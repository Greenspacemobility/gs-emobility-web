import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowRight, Linkedin, Target, Eye, Zap, Truck, Route, Globe, BatteryCharging,
  CheckCircle2, MapPin, Users
} from 'lucide-react'
import Image from 'next/image'
import AnimateIn from '@/components/AnimateIn'
import Badge from '@/components/Badge'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'about' })
  return { title: 'About — Greenspace E-Mobility', description: t('p1') }
}

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t  = useTranslations('about')
  const tp = useTranslations('partners')

  const board = [
    {
      name:     'William Pui Martinez',
      role:     'CEO / Founder',
      initials: 'WP',
      bio:      t('board.william'),
      linkedin: 'https://www.linkedin.com/in/williampui/',
    },
    {
      name:     'Mike Trevino',
      role:     'Chief Commercial Officer',
      initials: 'MT',
      bio:      t('board.mike'),
      linkedin: 'https://www.linkedin.com/in/migueltrevinomtz/',
    },
    {
      name:     'Moises Perez',
      role:     'Chief Financial Officer',
      initials: 'MP',
      bio:      t('board.moises'),
      linkedin: 'https://www.linkedin.com/in/moises-perez-robles-56267855/',
    },
    {
      name:     'Ruben Rock',
      role:     'COO / General Manager Mexico',
      initials: 'RR',
      bio:      t('board.ruben'),
      linkedin: 'https://www.linkedin.com/in/ruben-rock/?locale=en',
    },
    {
      name:     'Horacio de la Torre',
      role:     'CLO / General Manager USA',
      initials: 'HT',
      bio:      t('board.horacio'),
      linkedin: 'https://www.linkedin.com/in/horacio-de-la-torre-89a625362/',
    },
  ]

  const whatWeDo = [
    { icon: BatteryCharging, title: t('do1Title'), desc: t('do1Desc') },
    { icon: Truck,           title: t('do2Title'), desc: t('do2Desc') },
    { icon: Route,           title: t('do3Title'), desc: t('do3Desc') },
    { icon: Globe,           title: t('do4Title'), desc: t('do4Desc') },
    { icon: Zap,             title: t('do5Title'), desc: t('do5Desc') },
  ]

  const partners = [
    { name: 'Autel Energy', category: tp('partnerAutel'),    color: 'bg-green-500/10 text-green-300' },
    { name: 'Sinexcel',     category: tp('partnerSinexcel'), color: 'bg-emerald-500/10 text-emerald-300' },
    { name: 'Gresgying',    category: tp('partnerGresgying'), color: 'bg-teal-500/10 text-teal-300' },
  ]

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 overflow-hidden">
        <Image src="/images/service-cooperation.jpg" alt="Greenspace E-mobility team" fill priority className="object-cover object-center" quality={80} />
        <div className="absolute inset-0 bg-navy-900/72" />
        <div className="absolute inset-0 bg-gradient-hero opacity-70" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-forest-600/10 rounded-full blur-3xl" />
        {/* Vertical accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-green-500/20 to-transparent hidden lg:block" style={{ left: '8%' }} />

        <div className="container-wide relative z-10">
          <div className="max-w-3xl">
            <AnimateIn>
              <Badge className="mb-6">{t('badge')}</Badge>
            </AnimateIn>
            <AnimateIn delay={100}>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.05]">
                {t('heroTitle')}
              </h1>
            </AnimateIn>
            <AnimateIn delay={200}>
              <p className="text-white/65 text-lg leading-relaxed mb-5">{t('p1')}</p>
            </AnimateIn>
            <AnimateIn delay={280}>
              <p className="text-white/50 leading-relaxed mb-5">{t('p2')}</p>
            </AnimateIn>
            <AnimateIn delay={340}>
              <p className="text-white/50 leading-relaxed mb-5">{t('p3')}</p>
            </AnimateIn>
            <AnimateIn delay={400}>
              <p className="text-white/50 leading-relaxed">{t('p4')}</p>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── MISSION + VISION ─────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-8">

            {/* Mission */}
            <AnimateIn direction="left">
              <div className="glass rounded-3xl p-8 md:p-10 h-full relative overflow-hidden group hover:border-green-500/25 transition-all">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-green-400/60 to-transparent" />
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                  <Target className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="font-display font-bold text-white text-2xl mb-4">{t('missionTitle')}</h2>
                <p className="text-white/55 leading-relaxed">{t('missionText')}</p>
              </div>
            </AnimateIn>

            {/* Vision */}
            <AnimateIn direction="right">
              <div className="glass rounded-3xl p-8 md:p-10 h-full relative overflow-hidden group hover:border-green-500/20 transition-all">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/80 via-emerald-400/40 to-transparent" />
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                  <Eye className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="font-display font-bold text-white text-2xl mb-4">{t('visionTitle')}</h2>
                <p className="text-white/55 leading-relaxed">{t('visionText')}</p>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── WHAT WE DO ───────────────────────────────────────────────── */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-800/30 to-transparent" />
        <div className="container-wide relative z-10">
          <div className="text-center mb-16">
            <AnimateIn><Badge className="mb-6">{t('whatWeBadge')}</Badge></AnimateIn>
            <AnimateIn delay={100}>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">{t('whatWeTitle')}</h2>
            </AnimateIn>
            <AnimateIn delay={200}>
              <p className="text-white/40 max-w-xl mx-auto">{t('whatWeSubtitle')}</p>
            </AnimateIn>
          </div>

          {/* 3 + 2 grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {whatWeDo.slice(0, 3).map(({ icon: Icon, title, desc }, i) => (
              <AnimateIn key={title} delay={i * 100}>
                <div className="glass rounded-2xl p-7 group hover:border-green-500/25 transition-all h-full">
                  <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center mb-5 group-hover:bg-green-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="font-display font-bold text-white mb-3">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto md:max-w-none md:grid-cols-2 lg:w-2/3 lg:mx-auto">
            {whatWeDo.slice(3).map(({ icon: Icon, title, desc }, i) => (
              <AnimateIn key={title} delay={(i + 3) * 100}>
                <div className="glass rounded-2xl p-7 group hover:border-green-500/25 transition-all h-full">
                  <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center mb-5 group-hover:bg-green-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="font-display font-bold text-white mb-3">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHERE WE OPERATE ─────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-8">

            {/* Americas */}
            <AnimateIn direction="left">
              <div className="relative glass rounded-3xl p-8 md:p-10 overflow-hidden group hover:border-green-500/30 transition-all h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-green-400 text-[0.7rem] font-bold uppercase tracking-[0.13em]">Americas</p>
                      <h3 className="font-display font-bold text-white text-xl">Infrastructure Development</h3>
                    </div>
                  </div>
                  <p className="text-white/55 leading-relaxed mb-6">{t('p3')}</p>
                  <ul className="space-y-2.5">
                    {['Fleet depot charging', 'High-power commercial hubs', 'Cross-border electric highways', 'Grid-independent solar + storage sites'].map(item => (
                      <li key={item} className="flex items-center gap-3 text-white/65 text-sm">
                        <MapPin className="w-4 h-4 text-green-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimateIn>

            {/* Europe */}
            <AnimateIn direction="right">
              <div className="relative glass rounded-3xl p-8 md:p-10 overflow-hidden group hover:border-emerald-500/30 transition-all h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-emerald-400 text-[0.7rem] font-bold uppercase tracking-[0.13em]">Europe</p>
                      <h3 className="font-display font-bold text-white text-xl">Strategic Consulting</h3>
                    </div>
                  </div>
                  <p className="text-white/55 leading-relaxed mb-6">{t('p4')}</p>
                  <ul className="space-y-2.5">
                    {['CPO & OEM hardware strategy', 'Vendor benchmarking & selection', 'Market entry execution', 'Infrastructure deployment advisory'].map(item => (
                      <li key={item} className="flex items-center gap-3 text-white/65 text-sm">
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── WHY GREENSPACE ───────────────────────────────────────────── */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
        <div className="container-wide relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <AnimateIn direction="left">
                <Badge className="mb-6">{t('whyBadge')}</Badge>
              </AnimateIn>
              <AnimateIn direction="left" delay={100}>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {t('whyTitle')}
                </h2>
              </AnimateIn>
              <AnimateIn direction="left" delay={200}>
                <p className="text-white/55 leading-relaxed mb-8">{t('whyText')}</p>
              </AnimateIn>
            </div>

            <AnimateIn direction="right" delay={150}>
              <div className="glass rounded-3xl p-8 border border-green-500/15">
                <ul className="space-y-5">
                  {([t('whyPoint1'), t('whyPoint2'), t('whyPoint3'), t('whyPoint4')] as string[]).map((point, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="w-7 h-7 rounded-lg bg-green-500/15 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-white/75 leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── BOARD OF DIRECTORS ───────────────────────────────────────── */}
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

          {/* Top 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {board.slice(0, 3).map((member, i) => (
              <BoardCard key={member.name} member={member} delay={i * 80} />
            ))}
          </div>
          {/* Bottom 2 centered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {board.slice(3).map((member, i) => (
              <BoardCard key={member.name} member={member} delay={(i + 3) * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS ─────────────────────────────────────────────────── */}
      <section id="partners" className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-16">
            <AnimateIn><Badge className="mb-6">{tp('badge')}</Badge></AnimateIn>
            <AnimateIn delay={100}>
              <h2 className="font-display text-4xl font-bold text-white mb-4">{tp('title')}</h2>
            </AnimateIn>
            <AnimateIn delay={200}>
              <p className="text-white/40 max-w-xl mx-auto">{tp('subtitle')}</p>
            </AnimateIn>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {partners.map((p, i) => (
              <AnimateIn key={p.name} delay={i * 80}>
                <div className="glass rounded-2xl p-6 flex items-center gap-4 hover:border-green-500/20 transition-all group">
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

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-wide">
          <AnimateIn>
            <div className="relative glass rounded-3xl overflow-hidden p-12 md:p-16 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-navy-700/20" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-0.5 bg-gradient-to-r from-transparent via-green-500/60 to-transparent" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-green-500/15 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{t('ctaTitle')}</h2>
                <p className="text-white/50 max-w-lg mx-auto mb-8">{t('ctaText')}</p>
                <Link
                  href={`/${locale}/contact`}
                  className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-8 py-4 rounded-2xl transition-all glow-green"
                >
                  {t('ctaButton')}
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

/* ── Board card component ──────────────────────────────────────────────── */
interface BoardMember {
  name: string; role: string; initials: string; bio: string; linkedin: string
}

function BoardCard({ member, delay }: { member: BoardMember; delay: number }) {
  return (
    <AnimateIn delay={delay}>
      <div className="glass rounded-2xl p-7 flex flex-col items-center text-center group hover:border-green-500/25 transition-all h-full">
        {/* Initials avatar */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-navy-700 flex items-center justify-center ring-1 ring-green-500/20 group-hover:ring-green-500/40 transition-all mb-5">
          <span className="font-display font-bold text-white text-xl select-none">{member.initials}</span>
        </div>

        {/* Name + role */}
        <h3 className="font-display font-bold text-white text-lg mb-1">{member.name}</h3>
        <p
          className="text-green-400 mb-4"
          style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}
        >
          {member.role}
        </p>

        {/* Bio */}
        <p className="text-white/50 text-sm leading-relaxed flex-1 mb-5">{member.bio}</p>

        {/* LinkedIn */}
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white/35 hover:text-green-400 transition-colors text-sm font-medium"
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </a>
      </div>
    </AnimateIn>
  )
}
