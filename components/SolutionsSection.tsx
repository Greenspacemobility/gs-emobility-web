'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Home, Building2, Zap, Car, Sun, Smartphone } from 'lucide-react'
import AnimateIn from '@/components/AnimateIn'
import Badge from '@/components/Badge'
import SolutionModal, { type SolutionKey } from '@/components/SolutionModal'

const items = [
  { icon: Home,       key: 'residential' as SolutionKey, img: '/images/sol-residential.jpg' },
  { icon: Building2,  key: 'commercial'  as SolutionKey, img: '/images/sol-commercial.jpg' },
  { icon: Zap,        key: 'public'      as SolutionKey, img: '/images/sol-public.jpg' },
  { icon: Car,        key: 'fleet'       as SolutionKey, img: '/images/sol-fleet.jpg' },
  { icon: Sun,        key: 'solar'       as SolutionKey, img: '/images/sol-solar.jpg' },
  { icon: Smartphone, key: 'software'    as SolutionKey, img: '/images/sol-software.jpg' },
]

export default function SolutionsSection() {
  const t = useTranslations('solutions')
  const [active, setActive] = useState<{ key: SolutionKey; img: string } | null>(null)

  return (
    <>
      <section id="solutions" className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-16">
            <AnimateIn>
              <Badge className="mb-6">{t('badge')}</Badge>
            </AnimateIn>
            <AnimateIn delay={100}>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto leading-tight">
                {t('title')}
              </h2>
            </AnimateIn>
            <AnimateIn delay={200}>
              <p className="text-white/50 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
            </AnimateIn>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(({ icon: Icon, key, img }, i) => (
              <AnimateIn key={key} delay={i * 80}>
                <button
                  onClick={() => setActive({ key, img })}
                  className="relative rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300 w-full min-h-[260px] text-left cursor-pointer"
                >
                  <Image
                    src={img}
                    alt={t(`${key}.title` as any)}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/95 via-navy-900/60 to-navy-900/20 group-hover:from-navy-900/85 transition-colors" />
                  <div className="relative z-10 p-7 flex flex-col justify-end h-full min-h-[260px]">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors">
                      <Icon className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="font-display font-bold text-white text-lg mb-2">
                      {t(`${key}.title` as any)}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-3">
                      {t(`${key}.desc` as any)}
                    </p>
                    <span className="text-green-400 text-xs font-semibold uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t('learnMore')} →
                    </span>
                  </div>
                </button>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <SolutionModal
        solutionKey={active?.key ?? null}
        img={active?.img ?? ''}
        onClose={() => setActive(null)}
      />
    </>
  )
}
