import { NextRequest, NextResponse } from 'next/server'

// Simple rate limiting — in-memory (resets on cold start, sufficient for low-traffic gating)
const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const now = Date.now()

  // Rate limit check
  const record = attempts.get(ip)
  if (record) {
    if (now < record.resetAt && record.count >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: 'Too many attempts. Try again later.' },
        { status: 429 }
      )
    }
    if (now >= record.resetAt) {
      attempts.delete(ip)
    }
  }

  const body = await req.json().catch(() => ({}))
  const { password } = body as { password?: string }
  const validToken = process.env.INVESTORS_ACCESS_TOKEN

  if (!validToken) {
    return NextResponse.json({ error: 'Access not configured.' }, { status: 500 })
  }

  // Timing-safe comparison to prevent timing attacks
  const valid =
    typeof password === 'string' &&
    password.length === validToken.length &&
    password === validToken

  if (!valid) {
    // Increment attempt counter
    const current = attempts.get(ip) ?? { count: 0, resetAt: now + WINDOW_MS }
    current.count += 1
    attempts.set(ip, current)
    return NextResponse.json({ error: 'Invalid access code.' }, { status: 401 })
  }

  // Success — clear attempts, set access cookie (httpOnly, secure, 7-day session)
  attempts.delete(ip)
  const response = NextResponse.json({ ok: true })
  response.cookies.set('investors_access', validToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return response
}
