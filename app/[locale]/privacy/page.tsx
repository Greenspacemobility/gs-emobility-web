import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import AnimateIn from '@/components/AnimateIn'

export const metadata: Metadata = {
  title: 'Privacy Policy — Greenspace E-Mobility',
  description: 'How Greenspace E-mobility collects, uses, and protects your personal data.',
}

export default function PrivacyPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)

  const isEs = locale === 'es'

  const sections = isEs ? [
    {
      title: 'Datos que recopilamos',
      body: 'Cuando completas un formulario en este sitio recopilamos: nombre, correo electrónico, número de teléfono, empresa, país y la información de proyecto o sitio que nos proporcionas voluntariamente.',
    },
    {
      title: 'Cómo usamos tus datos',
      body: 'Utilizamos tu información para responder a tu consulta, evaluar oportunidades de co-desarrollo, preparar propuestas técnicas y comerciales, y enviarte comunicaciones relacionadas con tu solicitud. No vendemos ni compartimos tus datos con terceros sin tu consentimiento, salvo cuando sea necesario para ejecutar un proyecto conjunto.',
    },
    {
      title: 'Retención de datos',
      body: 'Conservamos tu información durante el tiempo necesario para gestionar la relación comercial y cumplir con obligaciones legales aplicables. Puedes solicitar la eliminación de tus datos en cualquier momento.',
    },
    {
      title: 'Seguridad',
      body: 'Aplicamos medidas técnicas y organizativas razonables para proteger tu información contra acceso no autorizado, pérdida o divulgación.',
    },
    {
      title: 'Tus derechos',
      body: 'Tienes derecho a acceder, rectificar o eliminar tus datos personales. Para ejercer estos derechos o para cualquier consulta sobre privacidad, contáctanos en info@gs-emobility.com.',
    },
    {
      title: 'Contacto',
      body: 'Greenspace E-mobility · info@gs-emobility.com',
    },
  ] : [
    {
      title: 'Data we collect',
      body: 'When you complete a form on this site we collect: name, email address, phone number, company, country, and any project or site information you voluntarily provide.',
    },
    {
      title: 'How we use your data',
      body: 'We use your information to respond to your inquiry, evaluate co-development opportunities, prepare technical and commercial proposals, and send you communications related to your request. We do not sell or share your data with third parties without your consent, except where necessary to execute a joint project.',
    },
    {
      title: 'Data retention',
      body: 'We retain your information for as long as necessary to manage the business relationship and comply with applicable legal obligations. You may request deletion of your data at any time.',
    },
    {
      title: 'Security',
      body: 'We apply reasonable technical and organizational measures to protect your information against unauthorized access, loss, or disclosure.',
    },
    {
      title: 'Your rights',
      body: 'You have the right to access, correct, or delete your personal data. To exercise these rights or for any privacy inquiry, contact us at info@gs-emobility.com.',
    },
    {
      title: 'Contact',
      body: 'Greenspace E-mobility · info@gs-emobility.com',
    },
  ]

  return (
    <>
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container-wide relative z-10 text-center">
          <AnimateIn>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              {isEs ? 'Política de Privacidad' : 'Privacy Policy'}
            </h1>
          </AnimateIn>
          <AnimateIn delay={100}>
            <p className="text-white/40 text-sm">
              {isEs ? 'Última actualización: enero 2025' : 'Last updated: January 2025'}
            </p>
          </AnimateIn>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide max-w-3xl">
          <div className="space-y-8">
            {sections.map(({ title, body }, i) => (
              <AnimateIn key={i} delay={i * 60}>
                <div className="glass rounded-2xl p-7">
                  <h2 className="font-display font-bold text-white text-lg mb-3">{title}</h2>
                  <p className="text-white/55 text-sm leading-relaxed">{body}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
