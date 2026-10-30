import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { loadInvite, submitInvite, isTokenShaped, TEMPLATES } from '@/lib/questionnaire'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { escapeHtml } from '@/lib/sanitize'

export const dynamic = 'force-dynamic'

let _resend: Resend | null = null
const resendClient = () => (_resend ??= new Resend(process.env.RESEND_API_KEY))

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!isTokenShaped(token)) return NextResponse.json({ error: 'no encontrado' }, { status: 404 })

  const rl = checkRateLimit(`q-submit:${getClientIp(req)}`, { limit: 10, windowMs: 60 * 60 * 1000 })
  if (!rl.allowed) return NextResponse.json({ error: 'demasiadas peticiones' }, { status: 429 })

  try {
    // Se leen las respuestas ANTES de marcar el envío: el correo las lleva completas.
    const invite = await loadInvite(token)
    if (!invite) return NextResponse.json({ error: 'no encontrado' }, { status: 404 })

    const result = await submitInvite(token)
    if (!result) return NextResponse.json({ error: 'no encontrado' }, { status: 404 })
    if (result.ya_enviado) return NextResponse.json({ ya_enviado: true })

    // El aviso por correo es cortesía: si Resend falla, el envío ya quedó guardado
    // en la base y no se le dice al cliente que algo salió mal.
    try {
      const tpl = TEMPLATES[invite.template]
      const quien = [invite.client_name, invite.operation_name].filter(Boolean).join(' · ')
      const answers = (invite.answers ?? {}) as Record<string, unknown>

      const filas: string[] = []
      for (const s of tpl?.sections ?? []) {
        filas.push(`<tr><td colspan="2" style="padding:18px 0 6px;font:600 13px system-ui;color:#0b1b2b">${escapeHtml(s.title)}</td></tr>`)
        for (const f of s.fields) {
          const v = answers[f.id]
          const txt = v === undefined || v === null || v === '' ? '—' : String(v)
          filas.push(
            `<tr><td style="padding:6px 12px 6px 0;font:400 12px system-ui;color:#5b6b7c;width:45%;vertical-align:top">${escapeHtml(f.label)}</td>` +
            `<td style="padding:6px 0;font:400 13px system-ui;color:#0b1b2b;white-space:pre-wrap">${escapeHtml(txt)}</td></tr>`
          )
        }
      }

      const adjuntos = (invite.files ?? []).map(f => `<li>${escapeHtml(f.filename)}</li>`).join('')

      await resendClient().emails.send({
        from: 'Greenspace E-mobility <info@gs-emobility.com>',
        to: ['info@gs-emobility.com'],
        subject: `Cuestionario completado — ${quien}`,
        html:
          `<div style="max-width:720px;margin:0 auto;font-family:system-ui">` +
          `<h2 style="font:700 18px system-ui;color:#0b1b2b">Cuestionario completado</h2>` +
          `<p style="font:400 13px system-ui;color:#5b6b7c">${escapeHtml(quien)}` +
          (invite.subtitle ? ` — ${escapeHtml(invite.subtitle)}` : '') + `</p>` +
          `<table style="width:100%;border-collapse:collapse">${filas.join('')}</table>` +
          (adjuntos ? `<h3 style="font:600 14px system-ui;color:#0b1b2b;margin-top:22px">Archivos adjuntos</h3><ul style="font:400 13px system-ui;color:#0b1b2b">${adjuntos}</ul>` : '') +
          `</div>`,
      })
    } catch (e) {
      console.error('Aviso por correo no enviado:', e)
    }

    return NextResponse.json({ enviado: true })
  } catch {
    return NextResponse.json({ error: 'error del servidor' }, { status: 500 })
  }
}
