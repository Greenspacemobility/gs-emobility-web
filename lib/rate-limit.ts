/**
 * In-memory rate limiter for Next.js API routes.
 * Resets on cold start — sufficient for edge protection on low-traffic endpoints.
 * For high-traffic APIs, replace with an Upstash Redis-backed solution.
 */

interface RateLimitRecord {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitRecord>()

export interface RateLimitOptions {
  /** Max requests allowed per window */
  limit: number
  /** Window size in milliseconds */
  windowMs: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

export function getClientIp(req: Request): string {
  const headers = req.headers as Headers
  return (
    headers.get('cf-connecting-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  )
}

export function checkRateLimit(
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now()
  const record = store.get(key)

  // Expired or new window — reset
  if (!record || now >= record.resetAt) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + options.windowMs,
    }
    store.set(key, newRecord)
    return { allowed: true, remaining: options.limit - 1, resetAt: newRecord.resetAt }
  }

  // Within window — check limit
  if (record.count >= options.limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt }
  }

  record.count += 1
  return { allowed: true, remaining: options.limit - record.count, resetAt: record.resetAt }
}

// Pre-configured limiters for form endpoints
export const FORM_RATE_LIMIT: RateLimitOptions = {
  limit: 5,      // 5 submissions
  windowMs: 15 * 60 * 1000, // per 15 minutes per IP
}
