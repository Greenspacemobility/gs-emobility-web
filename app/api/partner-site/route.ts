import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { checkRateLimit, getClientIp, FORM_RATE_LIMIT } from '@/lib/rate-limit'
import { sanitizeField } from '@/lib/sanitize'
import { verifyTurnstile } from '@/lib/turnstile'

// Lazily constructed so `next build` never instantiates the client at
// import time — otherwise page-data collection fails when RESEND_API_KEY
// is absent (e.g. local builds without the secret).
let _resend: Resend | null = null
function resendClient(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

const SITE_TYPE_LABELS: Record<string, string> = {
  gas_station: 'Gas Station',
  parking: 'Parking Lot',
  truck_stop: 'Truck Stop',
  shopping: 'Shopping Center / Retail',
  logistics: 'Logistics / Warehouse',
  hotel: 'Hotel / Hospitality',
  industrial: 'Industrial Facility',
  other: 'Other',
}

const COUNTRY_LABELS: Record<string, string> = {
  pa: 'Panama',
  mx: 'Mexico',
  us_tx: 'United States — Texas',
  us_other: 'United States — Other state',
  other: 'Other',
}

const POWER_LABELS: Record<string, string> = {
  none: 'No existing infrastructure',
  lt100: 'Less than 100 kW',
  '100_500': '100–500 kW',
  gt500: 'More than 500 kW',
  unknown: 'Unknown',
}

const OWNERSHIP_LABELS: Record<string, string> = {
  owner: 'Property Owner',
  lessee: 'Long-term Lessee',
  agent: 'Authorized Representative',
}

export async function POST(req: NextRequest) {
  // Rate limiting — 5 submissions per IP per 15 minutes
  const ip = getClientIp(req)
  const rl = checkRateLimit(`partner-site:${ip}`, FORM_RATE_LIMIT)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    )
  }

  try {
    const body = await req.json()
    const { name, company, email, phone, country, siteType, address, power, ownership, message, turnstileToken } = body

    // Verify Turnstile CAPTCHA token
    const captchaOk = await verifyTurnstile(turnstileToken)
    if (!captchaOk) {
      return NextResponse.json({ error: 'CAPTCHA verification failed' }, { status: 403 })
    }

    if (!name || !email || !country || !siteType || !address || !ownership) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Sanitize free-text fields before interpolating into HTML
    // Enum fields (country, siteType, power, ownership) are resolved through lookup tables — safe as-is
    const sName    = sanitizeField(name, 120)
    const sCompany = sanitizeField(company, 120)
    const sEmail   = sanitizeField(email, 254)
    const sPhone   = sanitizeField(phone, 30)
    const sAddress = sanitizeField(address, 300)
    const sMessage = sanitizeField(message, 1000)

    const { error } = await resendClient().emails.send({
      from: 'Greenspace E-mobility <notifications@gs-emobility.com>',
      to: ['info@gs-emobility.com', 'william.pui@gs-emobility.com'],
      bcc: ['ruben.rock@gs-emobility.com', 'Moises.perez@gs-emobility.com', 'Mike.trevino@gs-emobility.com', 'horacio.delatorre@gs-emobility.com', 'roberpiere.villar@gs-emobility.com', 'john.parchment@gs-emobility.com', 'ricardo.zepeda@gs-emobility.com'],
      replyTo: sEmail,
      subject: `🔌 New Site Submission: ${SITE_TYPE_LABELS[siteType] ?? siteType} in ${COUNTRY_LABELS[country] ?? country} — ${sName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
          <div style="background: #0a1628; padding: 28px 32px; border-radius: 12px 12px 0 0;">
            <h2 style="color: #22c55e; margin: 0 0 4px; font-size: 20px;">🔌 New Partner Site Submission</h2>
            <p style="color: #ffffff80; margin: 0; font-size: 14px;">Someone wants to host a Greenspace charging hub</p>
          </div>

          <div style="background: #f9fafb; padding: 28px 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">

            <h3 style="color: #374151; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px;">Contact Information</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 7px 0; color: #6b7280; font-size: 13px; width: 140px;">Name</td>
                <td style="padding: 7px 0; color: #111827; font-weight: 600;">${sName}</td>
              </tr>
              ${sCompany ? `<tr>
                <td style="padding: 7px 0; color: #6b7280; font-size: 13px;">Company</td>
                <td style="padding: 7px 0; color: #111827;">${sCompany}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 7px 0; color: #6b7280; font-size: 13px;">Email</td>
                <td style="padding: 7px 0;"><a href="mailto:${sEmail}" style="color: #22c55e; font-weight: 600;">${sEmail}</a></td>
              </tr>
              ${sPhone ? `<tr>
                <td style="padding: 7px 0; color: #6b7280; font-size: 13px;">Phone</td>
                <td style="padding: 7px 0; color: #111827;">${sPhone}</td>
              </tr>` : ''}
            </table>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0 0 24px;" />

            <h3 style="color: #374151; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px;">Site Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 7px 0; color: #6b7280; font-size: 13px; width: 140px;">Country</td>
                <td style="padding: 7px 0; color: #111827; font-weight: 600;">${COUNTRY_LABELS[country] ?? country}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #6b7280; font-size: 13px;">Site Type</td>
                <td style="padding: 7px 0; color: #111827;">${SITE_TYPE_LABELS[siteType] ?? siteType}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #6b7280; font-size: 13px;">Address</td>
                <td style="padding: 7px 0; color: #111827;">${sAddress}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #6b7280; font-size: 13px;">Existing Power</td>
                <td style="padding: 7px 0; color: #111827;">${POWER_LABELS[power] ?? (power || 'Not specified')}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #6b7280; font-size: 13px;">Ownership Role</td>
                <td style="padding: 7px 0; color: #111827;">${OWNERSHIP_LABELS[ownership] ?? ownership}</td>
              </tr>
            </table>

            ${sMessage ? `
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0 0 24px;" />
            <h3 style="color: #374151; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 10px;">Additional Notes</h3>
            <p style="color: #111827; margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${sMessage}</p>
            ` : ''}

            <div style="margin-top: 28px; padding: 16px 20px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
              <p style="margin: 0; color: #15803d; font-size: 13px;">
                <strong>Reply directly</strong> to this email to contact ${sName} at <a href="mailto:${sEmail}" style="color: #15803d;">${sEmail}</a>
              </p>
            </div>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error (partner-site):', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Partner site route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
