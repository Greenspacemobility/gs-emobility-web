import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { checkRateLimit, getClientIp, FORM_RATE_LIMIT } from '@/lib/rate-limit'
import { sanitizeField } from '@/lib/sanitize'
import { verifyTurnstile } from '@/lib/turnstile'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  // Rate limiting — 5 submissions per IP per 15 minutes
  const ip = getClientIp(req)
  const rl = checkRateLimit(`book-visit:${ip}`, FORM_RATE_LIMIT)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    )
  }

  try {
    const body = await req.json()
    const { name, email, phone, country, address, siteType, date, time, notes, turnstileToken } = body

    // Verify Turnstile CAPTCHA token
    const captchaOk = await verifyTurnstile(turnstileToken)
    if (!captchaOk) {
      return NextResponse.json({ error: 'CAPTCHA verification failed' }, { status: 403 })
    }

    if (!name || !email || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Sanitize all user-supplied values before interpolating into HTML
    const sName     = sanitizeField(name, 120)
    const sEmail    = sanitizeField(email, 254)
    const sPhone    = sanitizeField(phone, 30)
    const sCountry  = sanitizeField(country, 60)
    const sAddress  = sanitizeField(address, 300)
    const sSiteType = sanitizeField(siteType, 100)
    const sDate     = sanitizeField(date, 30)
    const sTime     = sanitizeField(time, 60)
    const sNotes    = sanitizeField(notes, 1000)

    const { error } = await resend.emails.send({
      from: 'Greenspace E-mobility <notifications@gs-emobility.com>',
      to: ['info@gs-emobility.com', 'william.pui@gs-emobility.com'],
      bcc: ['ruben.rock@gs-emobility.com', 'Moises.perez@gs-emobility.com', 'Mike.trevino@gs-emobility.com', 'horacio.delatorre@gs-emobility.com', 'roberpiere.villar@gs-emobility.com', 'john.parchment@gs-emobility.com', 'ricardo.zepeda@gs-emobility.com'],
      replyTo: sEmail,
      subject: `Site Visit Request — ${sName} · ${sCountry || 'Unknown'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0a1628; padding: 24px; border-radius: 12px 12px 0 0;">
            <h2 style="color: #22c55e; margin: 0; font-size: 18px;">New Site Visit Request</h2>
            <p style="color: #94a3b8; margin: 8px 0 0; font-size: 13px;">Respond within 24 hours with a quote</p>
          </div>
          <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; font-size: 14px; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.05em;">Contact Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px; width: 120px;">Name</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600;">${sName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Email</td>
                <td style="padding: 8px 0; color: #111827;"><a href="mailto:${sEmail}" style="color: #22c55e;">${sEmail}</a></td>
              </tr>
              ${sPhone ? `<tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Phone</td>
                <td style="padding: 8px 0; color: #111827;">${sPhone}</td>
              </tr>` : ''}
              ${sCountry ? `<tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Country</td>
                <td style="padding: 8px 0; color: #111827;">${sCountry}</td>
              </tr>` : ''}
            </table>

            <hr style="margin: 16px 0; border: none; border-top: 1px solid #e5e7eb;" />
            <h3 style="color: #374151; font-size: 14px; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.05em;">Site Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px; width: 120px;">Address</td>
                <td style="padding: 8px 0; color: #111827;">${sAddress}</td>
              </tr>
              ${sSiteType ? `<tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Site Type</td>
                <td style="padding: 8px 0; color: #111827;">${sSiteType}</td>
              </tr>` : ''}
              ${sDate ? `<tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Preferred Date</td>
                <td style="padding: 8px 0; color: #111827;">${sDate}</td>
              </tr>` : ''}
              ${sTime ? `<tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Time Preference</td>
                <td style="padding: 8px 0; color: #111827;">${sTime}</td>
              </tr>` : ''}
            </table>

            ${sNotes ? `
            <hr style="margin: 16px 0; border: none; border-top: 1px solid #e5e7eb;" />
            <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px;">Additional Notes:</p>
            <p style="color: #111827; margin: 0; white-space: pre-wrap;">${sNotes}</p>
            ` : ''}
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error (book-visit):', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Book-visit route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
