import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import AnimateIn from '@/components/AnimateIn'

export const metadata: Metadata = {
  title: 'Terms of Use — Greenspace E-Mobility',
  description: 'Terms and conditions for use of the Greenspace E-mobility website.',
}

export default function TermsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)

  const isEs = locale === 'es'

  const sections = isEs ? [
    {
      title: 'Uso del sitio',
      body: 'Este sitio web es operado por Greenspace E-mobility. Al acceder y utilizar este sitio, aceptas cumplir con estos términos. El contenido está destinado únicamente a fines informativos y comerciales.',
    },
    {
      title: 'Propiedad intelectual',
      body: 'Todo el contenido de este sitio — textos, imágenes, logotipos, gráficos y materiales de marca — es propiedad de Greenspace E-mobility o de sus licenciantes. No está permitida su reproducción o uso sin autorización previa por escrito.',
    },
    {
      title: 'Formularios y envíos',
      body: 'Al enviar un formulario de contacto o de propuesta de sitio, confirmas que la información proporcionada es veraz y que tienes la autoridad para compartirla. Greenspace no asume compromisos contractuales a partir de un envío de formulario sin un acuerdo firmado por ambas partes.',
    },
    {
      title: 'Limitación de responsabilidad',
      body: 'Greenspace E-mobility no será responsable de daños directos, indirectos, incidentales o consecuentes derivados del uso de este sitio o de la información aquí contenida. El contenido se proporciona "tal cual" sin garantías de ningún tipo.',
    },
    {
      title: 'Cambios a estos términos',
      body: 'Greenspace se reserva el derecho de actualizar estos términos en cualquier momento. El uso continuado del sitio tras la publicación de cambios implica la aceptación de los términos actualizados.',
    },
    {
      title: 'Contacto',
      body: 'Para preguntas sobre estos términos: info@gs-emobility.com',
    },
  ] : [
    {
      title: 'Use of this site',
      body: 'This website is operated by Greenspace E-mobility. By accessing and using this site, you agree to comply with these terms. Content is intended for informational and commercial purposes only.',
    },
    {
      title: 'Intellectual property',
      body: 'All content on this site — text, images, logos, graphics, and brand materials — is the property of Greenspace E-mobility or its licensors. Reproduction or use without prior written authorization is not permitted.',
    },
    {
      title: 'Forms and submissions',
      body: 'By submitting a contact or site proposal form, you confirm that the information provided is accurate and that you have the authority to share it. Greenspace does not assume contractual obligations from a form submission without a written agreement signed by both parties.',
    },
    {
      title: 'Limitation of liability',
      body: 'Greenspace E-mobility shall not be liable for direct, indirect, incidental, or consequential damages arising from the use of this site or the information contained herein. Content is provided "as is" without warranties of any kind.',
    },
    {
      title: 'Changes to these terms',
      body: 'Greenspace reserves the right to update these terms at any time. Continued use of the site after changes are posted constitutes acceptance of the updated terms.',
    },
    {
      title: 'Contact',
      body: 'For questions about these terms: info@gs-emobility.com',
    },
  ]

  return (
    <>
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container-wide relative z-10 text-center">
          <AnimateIn>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              {isEs ? 'Términos de Uso' : 'Terms of Use'}
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
