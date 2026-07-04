import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { checkRateLimit, getClientIp, FORM_RATE_LIMIT } from '@/lib/rate-limit'
import { sanitizeField } from '@/lib/sanitize'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  // Rate limiting — 5 submissions per IP per 15 minutes
  const ip = getClientIp(req)
  const rl = checkRateLimit(`contact:${ip}`, FORM_RATE_LIMIT)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    )
  }

  try {
    const body = await req.json()
    const { name, email, phone, interest, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Sanitize all user-supplied values before interpolating into HTML
    const sName     = sanitizeField(name, 120)
    const sEmail    = sanitizeField(email, 254)
    const sPhone    = sanitizeField(phone, 30)
    const sInterest = sanitizeField(interest, 100)
    const sMessage  = sanitizeField(message, 2000)

    const { error } = await resend.emails.send({
      from: 'Greenspace E-mobility <notifications@gs-emobility.com>',
      to: ['info@gs-emobility.com', 'william.pui@gs-emobility.com'],
      bcc: ['ruben.rock@gs-emobility.com', 'Moises.perez@gs-emobility.com', 'Mike.trevino@gs-emobility.com', 'horacio.delatorre@gs-emobility.com', 'roberpiere.villar@gs-emobility.com', 'john.parchment@gs-emobility.com', 'ricardo.zepeda@gs-emobility.com'],
      replyTo: sEmail,
      subject: `New Contact: ${sInterest || 'General Inquiry'} — ${sName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0a1628; padding: 24px; border-radius: 12px 12px 0 0;">
            <h2 style="color: #22c55e; margin: 0; font-size: 18px;">New Contact Form Submission</h2>
          </div>
          <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse;">
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
              ${sInterest ? `<tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Interest</td>
                <td style="padding: 8px 0; color: #111827;">${sInterest}</td>
              </tr>` : ''}
            </table>
            <hr style="margin: 16px 0; border: none; border-top: 1px solid #e5e7eb;" />
            <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px;">Message:</p>
            <p style="color: #111827; margin: 0; white-space: pre-wrap;">${sMessage}</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error (contact):', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
