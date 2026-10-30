import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { loadInvite, isTokenShaped, TEMPLATES } from '@/lib/questionnaire'
import QuestionnaireForm from '@/components/QuestionnaireForm'

/** Página privada por enlace: nunca debe aparecer en buscadores. */
export const metadata: Metadata = {
  title: 'Cuestionario de diagnóstico',
  robots: { index: false, follow: false, nocache: true },
}

export const dynamic = 'force-dynamic'

export default async function Page({
  params,
}: { params: Promise<{ locale: string; token: string }> }) {
  const { locale, token } = await params
  setRequestLocale(locale)

  if (!isTokenShaped(token)) notFound()

  let invite
  try {
    invite = await loadInvite(token)
  } catch {
    invite = null
  }
  if (!invite) notFound()

  const template = TEMPLATES[invite.template]
  if (!template) notFound()

  return (
    <QuestionnaireForm
      token={token}
      template={template}
      invite={invite}
      uploadsEnabled={Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)}
    />
  )
}
