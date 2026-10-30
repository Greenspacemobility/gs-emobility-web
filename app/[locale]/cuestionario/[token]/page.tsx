import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { AlertCircle, Clock } from 'lucide-react'
import { loadInvite, isTokenShaped, TEMPLATES } from '@/lib/questionnaire'
import QuestionnaireForm from '@/components/QuestionnaireForm'

/** Página privada por enlace: nunca debe aparecer en buscadores. */
export const metadata: Metadata = {
  title: 'Cuestionario de diagnóstico',
  robots: { index: false, follow: false, nocache: true },
}

export const dynamic = 'force-dynamic'

/** Un fallo de configuración o una base dormida NO deben verse como un 404.
 *  Al otro lado hay un cliente al que le enviamos este enlace: si ve
 *  "esta página no existe" concluye que le mandamos algo roto. */
function Aviso({ titulo, texto, icono }: { titulo: string; texto: string; icono: 'alerta' | 'reloj' }) {
  const Icono = icono === 'reloj' ? Clock : AlertCircle
  return (
    <main className="min-h-screen bg-navy-900 flex items-center justify-center px-6 py-24">
      <div className="max-w-md text-center">
        <Image src="/images/logo-white.png" alt="Greenspace E-mobility" width={160} height={56}
               className="h-8 w-auto mx-auto mb-10 opacity-80" />
        <div className="w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center mx-auto mb-7">
          <Icono className="w-6 h-6 text-white/40" />
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">{titulo}</h1>
        <p className="text-white/45 leading-relaxed mb-8">{texto}</p>
        <a href="mailto:info@gs-emobility.com"
           className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-7 py-3.5 rounded-2xl transition-all">
          Escribirnos
        </a>
        <p className="mt-8">
          <Link href="/es" className="text-white/25 hover:text-white/50 text-sm transition-colors">
            Ir a gs-emobility.com
          </Link>
        </p>
      </div>
    </main>
  )
}

export default async function Page({
  params,
}: { params: Promise<{ locale: string; token: string }> }) {
  const { locale, token } = await params
  setRequestLocale(locale)

  // Un token con forma inválida sí es un 404 honesto: nadie nos lo dio así.
  if (!isTokenShaped(token)) notFound()

  let invite
  try {
    invite = await loadInvite(token)
  } catch {
    // Base caída, pausada o sin configurar. No es culpa de quien abre el enlace.
    return (
      <Aviso
        icono="alerta"
        titulo="El cuestionario no está disponible en este momento"
        texto="Su enlace es válido, pero no podemos cargar el formulario ahora mismo. Vuelva a intentarlo en unos minutos; si sigue igual, escríbanos y le ayudamos enseguida."
      />
    )
  }

  if (!invite) notFound()

  if ((invite as { expirado?: boolean }).expirado) {
    return (
      <Aviso
        icono="reloj"
        titulo="Este enlace ha caducado"
        texto="El enlace de su cuestionario ya no está activo. Escríbanos y le enviamos uno nuevo sin perder lo que haya respondido."
      />
    )
  }

  const template = TEMPLATES[invite.template]
  if (!template) {
    return (
      <Aviso
        icono="alerta"
        titulo="El cuestionario no está disponible en este momento"
        texto="Su enlace es válido, pero no podemos mostrar el formulario ahora mismo. Escríbanos y lo resolvemos enseguida."
      />
    )
  }

  return (
    <QuestionnaireForm
      token={token}
      template={template}
      invite={invite}
      uploadsEnabled={Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)}
    />
  )
}
