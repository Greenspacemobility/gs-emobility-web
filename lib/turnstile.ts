/**
 * Cloudflare Turnstile server-side token verification.
 * Call this in API routes before processing any form submission.
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstile(token: string | null | undefined): Promise<boolean> {
  if (!token) return false

  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    // Fail open only in local dev where the env var may not be set
    if (process.env.NODE_ENV === 'development') return true
    return false
  }

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
    })
    const data = await res.json()
    return data.success === true
  } catch {
    return false
  }
}
