import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, interest, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: `"Greenspace E-Mobility" <${process.env.GMAIL_USER}>`,
      to: 'info@gs-emobility.com',
      bcc: 'william.pui@gs-emobility.com',
      replyTo: email,
      subject: `New Contact: ${interest || 'General Inquiry'} — ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0a1628; padding: 24px; border-radius: 12px 12px 0 0;">
            <h2 style="color: #22c55e; margin: 0; font-size: 18px;">New Contact Form Submission</h2>
          </div>
          <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px; width: 120px;">Name</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Email</td>
                <td style="padding: 8px 0; color: #111827;"><a href="mailto:${email}" style="color: #22c55e;">${email}</a></td>
              </tr>
              ${phone ? `<tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Phone</td>
                <td style="padding: 8px 0; color: #111827;">${phone}</td>
              </tr>` : ''}
              ${interest ? `<tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Interest</td>
                <td style="padding: 8px 0; color: #111827;">${interest}</td>
              </tr>` : ''}
            </table>
            <hr style="margin: 16px 0; border: none; border-top: 1px solid #e5e7eb;" />
            <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px;">Message:</p>
            <p style="color: #111827; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
