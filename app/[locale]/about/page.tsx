import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Zap, Target, Eye, Heart, ArrowRight, Linkedin } from 'lucide-react'
import AnimateIn from '@/components/AnimateIn'
import Badge from '@/components/Badge'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'about' })
  return { title: t('badge'), description: t('p1') }
}

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = useTranslations('about')
  const tp = useTranslations('partners')

  const values = [
    { key: 'value1', icon: Heart,  color: 'from-green-500/20'  },
    { key: 'value2', icon: Zap,    color: 'from-blue-500/20'   },
    { key: 'value3', icon: Target, color: 'from-purple-500/20' },
    { key: 'value4', icon: Eye,    color: 'from-orange-500/20' },
  ] as const

  const board = [
    {
      name: 'William Pui Martinez',
      role: 'CEO / Founder',
      initials: 'WP',
      photo: '/images/team-william.jpg',
      bio: t('board.william'),
      linkedin: 'https://www.linkedin.com/in/williampui/',
    },
    {
      name: 'Mike Trevino',
      role: 'Chief Commercial Officer',
      initials: 'MT',
      photo: '/images/team-mike.jpg',
      bio: t('board.mike'),
      linkedin: 'https://www.linkedin.com/in/migueltrevinomtz/',
    },
    {
      name: 'Moises Perez',
      role: 'Chief Financial Officer',
      initials: 'MP',
      photo: '/images/team-moises.jpg',
      bio: t('board.moises'),
      linkedin: 'https://www.linkedin.com/in/moises-perez-robles-56267855/',
    },
    {
      name: 'Ruben Rock',
      role: 'COO / General Manager Mexico',
      initials: 'RR',
      photo: '/images/team-ruben.jpg',
      bio: t('board.ruben'),
      linkedin: 'https://www.linkedin.com/in/ruben-rock/?locale=en',
    },
    {
      name: 'Horacio de la Torre',
      role: 'CLO / General Manager USA',
      initials: 'HT',
      photo: '/images/team-horacio.jpg',
      bio: t('board.horacio'),
      linkedin: 'https://www.linkedin.com/in/horacio-de-la-torre-89a625362/',
    },
  ]

  const partners = [
    { name: 'Wallbox', category: 'Cargadores AC/DC', color: 'bg-blue-500/10 text-blue-300' },
    { name: 'ABB', category: 'Infraestructura DC', color: 'bg-red-500/10 text-red-300' },
    { name: 'Schneider Electric', category: 'Gestión de energía', color: 'bg-green-500/10 text-green-300' },
    { name: 'Efacec', category: 'Carga rápida', color: 'bg-purple-500/10 text-purple-300' },
    { name: 'Tritium', category: 'DC Fast Charging', color: 'bg-yellow-500/10 text-yellow-300' },
    { name: 'Phoenix Contact', category: 'Conectores', color: 'bg-orange-500/10 text-orange-300' },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-green-500/8 rounded-full blur-3xl" />
        <div className="container-wide relative z-10">
          <div className="max-w-3xl">
            <AnimateIn><Badge className="mb-6">{t('badge')}</Badge></AnimateIn>
            <AnimateIn delay={100}>
              <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-8 leading-[1.05]">
                {t('title')}
              </h1>
            </AnimateIn>
            <AnimateIn delay={200}>
              <p className="text-white/60 text-lg leading-relaxed mb-6">{t('p1')}</p>
            </AnimateIn>
            <AnimateIn delay={300}>
              <p className="text-white/50 leading-relaxed mb-6">{t('p2')}</p>
            </AnimateIn>
            <AnimateIn delay={400}>
              <p className="text-white/50 leading-relaxed">{t('p3')}</p>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <AnimateIn direction="left">
              <div className="glass rounded-2xl p-8 h-full relative overflow-hidden group hover:border-green-500/25 transition-all">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500/80 via-green-400 to-green-500/20" />
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-5 group-hover:bg-green-500/20 transition-colors">
                  <Target className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="font-display font-bold text-white text-2xl mb-4">{t('missionTitle')}</h2>
                <p className="text-white/50 leading-relaxed">{t('missionText')}</p>
              </div>
            </AnimateIn>
            <AnimateIn direction="right">
              <div className="glass rounded-2xl p-8 h-full relative overflow-hidden group hover:border-green-500/25 transition-all">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/80 via-blue-400/50 to-transparent" />
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-5 group-hover:bg-blue-500/20 transition-colors">
                  <Eye className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="font-display font-bold text-white text-2xl mb-4">{t('visionTitle')}</h2>
                <p className="text-white/50 leading-relaxed">{t('visionText')}</p>
              </div>
            </AnimateIn>
          </div>

          {/* Values */}
          <div className="text-center mb-12">
            <AnimateIn><h2 className="font-display text-3xl font-bold text-white">{t('valuesTitle')}</h2></AnimateIn>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ key, icon: Icon, color }, i) => (
              <AnimateIn key={key} delay={i * 80}>
                <div className={`glass rounded-2xl p-6 text-center group hover:border-green-500/20 transition-all overflow-hidden relative`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="font-display font-bold text-white">{t(key as any)}</span>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-16">
            <AnimateIn><Badge className="mb-6">{t('boardBadge')}</Badge></AnimateIn>
            <AnimateIn delay={100}>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">{t('boardTitle')}</h2>
            </AnimateIn>
            <AnimateIn delay={200}>
              <p className="text-white/40 max-w-2xl mx-auto">{t('boardSubtitle')}</p>
            </AnimateIn>
          </div>

          {/* Top row — 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {board.slice(0, 3).map((member, i) => (
              <BoardCard key={member.name} member={member} delay={i * 80} />
            ))}
          </div>
          {/* Bottom row — 2 cards centered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {board.slice(3).map((member, i) => (
              <BoardCard key={member.name} member={member} delay={(i + 3) * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-16">
            <AnimateIn><Badge className="mb-6">{tp('badge')}</Badge></AnimateIn>
            <AnimateIn delay={100}><h2 className="font-display text-4xl font-bold text-white mb-4">{tp('title')}</h2></AnimateIn>
            <AnimateIn delay={200}><p className="text-white/40 max-w-xl mx-auto">{tp('subtitle')}</p></AnimateIn>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {partners.map((p, i) => (
              <AnimateIn key={p.name} delay={i * 80}>
                <div className="glass rounded-2xl p-6 flex items-center gap-4 hover:border-white/15 transition-all group">
                  <div className={`w-12 h-12 rounded-xl ${p.color} flex items-center justify-center text-sm font-bold shrink-0`}>
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white">{p.name}</h3>
                    <p className="text-white/40 text-xs">{p.category}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide">
          <AnimateIn>
            <div className="glass rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/8 via-transparent to-navy-700/20" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
              <div className="relative z-10">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">¿Quieres trabajar con nosotros?</h2>
                <p className="text-white/50 max-w-lg mx-auto mb-8">
                  Buscamos constantemente distribuidores, instaladores y socios estratégicos comprometidos con la electromovilidad.
                </p>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-8 py-4 rounded-2xl transition-all glow-green"
                >
                  Hablemos
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  )
}

interface BoardMember {
  name: string
  role: string
  initials: string
  photo: string
  bio: string
  linkedin: string
}

function BoardCard({ member, delay }: { member: BoardMember; delay: number }) {
  return (
    <AnimateIn delay={delay}>
      <div className="glass rounded-2xl p-7 flex flex-col items-center text-center group hover:border-green-500/25 transition-all h-full">
        {/* Avatar */}
        <div className="relative w-24 h-24 mb-5 shrink-0">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/30 to-navy-700 flex items-center justify-center ring-2 ring-green-500/20 group-hover:ring-green-500/50 transition-all overflow-hidden">
            <span className="font-display font-bold text-white text-2xl select-none">
              {member.initials}
            </span>
          </div>
        </div>

        {/* Name & role */}
        <h3 className="font-display font-bold text-white text-lg mb-1">{member.name}</h3>
        <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-4">{member.role}</p>

        {/* Bio */}
        <p className="text-white/50 text-sm leading-relaxed flex-1 mb-5">{member.bio}</p>

        {/* LinkedIn */}
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white/40 hover:text-blue-400 transition-colors text-sm font-medium"
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </a>
      </div>
    </AnimateIn>
  )
}
