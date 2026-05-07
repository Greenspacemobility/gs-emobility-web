'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import {
  Zap, Battery, BatteryCharging, CheckCircle2,
  ChevronDown,
} from 'lucide-react'

export default function BrandSelector() {
  const t = useTranslations('products')
  const locale = useLocale()
  const [open, setOpen] = useState<string | null>(null)

  const toggle = (name: string) => setOpen(prev => prev === name ? null : name)

  /* ── Brand definitions ─────────────────────────────────────── */
  const brands = [
    {
      name: 'Autel Energy',
      color: 'from-blue-500/20 to-navy-700',
      accentColor: 'text-blue-400',
      borderColor: 'border-blue-500/40',
      glowColor: 'shadow-[0_0_30px_rgba(59,130,246,0.12)]',
      initials: 'AE',
      highlight: true,
      lines: [
        { icon: Zap,             label: t('ac'),      desc: t('autelAc') },
        { icon: BatteryCharging, label: t('dc'),      desc: t('autelDc') },
        { icon: Battery,         label: t('storage'), desc: t('autelStorage') },
      ],
    },
    // Sinexcel and Gresgying hidden — will be re-enabled in a future update
  ]

  /* ── Autel charger models ──────────────────────────────────── */
  const autelChargers = [
    {
      model: 'MaxiCharger AC Elite Business',
      badge: 'AC Level 2 · 12 kW',
      badgeColor: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
      image: '/images/products/autel-ac-elite-business.png',
      power: '12 kW',
      features: [
        'SAE J1772 · 25 ft tethered cable',
        '5" LCD touchscreen · RFID + APP auth',
        '4G · Wi-Fi · Ethernet · Bluetooth',
        'OCPP 1.6J · NEMA 4 · UL certified',
      ],
    },
    {
      model: 'MaxiCharger DC Wall Compact',
      badge: 'DC Fast · 40 kW',
      badgeColor: 'bg-green-500/15 text-green-400 border border-green-500/20',
      image: '/images/products/autel-dc-compact.png',
      power: '40 kW',
      features: [
        'Dual CCS1 or CCS1 + CHAdeMO',
        '21.5" LCD touchscreen · ISO 15118 PnC',
        '4G · Wi-Fi · Ethernet · OCPP 1.6J',
        'NEMA 3S · Wall or floor mount',
      ],
    },
    {
      model: 'MaxiCharger DC Series DH240 / DH480',
      badge: 'DC High-Power · up to 480 kW',
      badgeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
      image: '/images/products/autel-dc-series.jpg',
      power: '120–480 kW',
      features: [
        'Scalable 120–480 kW · Dual CCS2',
        '15.6" LCD · 4G / 5G · OCPP 2.0.1',
        'ISO 15118 Plug & Charge',
        'CE · UKCA · TÜV · IP54 / IK10',
      ],
    },
    {
      model: 'MaxiCharger DS600L Liquid-Cooled',
      badge: 'DC Liquid-Cooled · 600 kW',
      badgeColor: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20',
      image: '/images/products/autel-ds600l.png',
      power: '360–600 kW',
      features: [
        '10 outputs · 97% peak efficiency',
        'SiC modules · AI smart algorithms',
        'PV-ESS-EV integration · 4G / 5G',
        'IP55 · C5-M marine grade · 15-yr design life',
      ],
    },
  ]

  return (
    <section id="products" className="section-padding">
      <div className="container-wide">

        {/* ── Brand cards ─────────────────────────────────────── */}
        <div className="flex justify-center mb-0">
          {brands.map(({ name, color, accentColor, borderColor, glowColor, initials, highlight, lines }, i) => {
            const isOpen = open === name
            return (
              <div
                key={name}
                onClick={() => toggle(name)}
                className={`relative glass rounded-2xl overflow-hidden flex flex-col h-full cursor-pointer transition-all duration-300 hover:scale-[1.01] w-full max-w-sm
                  ${isOpen ? `${borderColor} ${glowColor}` : highlight ? `${borderColor} shadow-[0_0_30px_rgba(59,130,246,0.12)]` : 'hover:border-white/15'}
                `}
                style={{ transitionProperty: 'transform, border-color, box-shadow' }}
              >
                {/* Featured badge */}
                {highlight && (
                  <div className="absolute top-4 right-4 text-[10px] font-bold text-white bg-blue-500 px-2 py-1 rounded-full uppercase tracking-wider z-10">
                    {t('featured')}
                  </div>
                )}

                {/* Brand header */}
                <div className={`h-40 bg-gradient-to-br ${color} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)' }}
                  />
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center border border-white/10 mx-auto mb-3">
                      <span className={`font-display font-bold text-lg ${accentColor}`}>{initials}</span>
                    </div>
                    <h3 className="font-display font-bold text-white text-xl">{name}</h3>
                  </div>
                </div>

                {/* Product lines */}
                <div className="p-6 flex flex-col flex-1 gap-4">
                  {lines.map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className={`w-4 h-4 ${accentColor}`} />
                      </div>
                      <div>
                        <span className={`text-xs font-bold uppercase tracking-widest ${accentColor}`}>{label}</span>
                        <p className="text-white/55 text-sm leading-relaxed mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}

                  {/* View Portfolio button */}
                  <div className="mt-auto pt-4">
                    <div
                      className={`w-full flex items-center justify-center gap-2 border font-semibold text-sm py-3 rounded-xl transition-all duration-200
                        ${isOpen
                          ? `${accentColor} border-current bg-white/5`
                          : 'text-white/50 border-white/10 hover:border-white/25 hover:text-white/80'
                        }`}
                    >
                      {t('viewPortfolio')}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Portfolio panels ────────────────────────────────── */}

        {/* Autel Energy */}
        {open === 'Autel Energy' && (
          <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Autel Energy · {t('portfolioLabel')}</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {autelChargers.map(({ model, badge, badgeColor, image, power, features }) => (
                <div
                  key={model}
                  className="glass rounded-3xl overflow-hidden border border-white/[0.08] hover:border-blue-500/25 transition-all hover:scale-[1.01] flex flex-col h-full"
                >
                  {/* Product image */}
                  <div className="bg-white/[0.04] flex items-center justify-center p-6 h-56">
                    <Image
                      src={image}
                      alt={model}
                      width={220}
                      height={220}
                      className="object-contain h-full w-auto drop-shadow-2xl"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full mb-4 self-start ${badgeColor}`}>
                      {badge}
                    </span>
                    <h3 className="font-display font-bold text-white text-[0.95rem] leading-snug mb-1">{model}</h3>
                    <div className="text-blue-400 font-bold text-sm mb-5">{power}</div>

                    <ul className="space-y-2.5 mb-6 flex-1">
                      {features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 text-white/55 text-xs leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/${locale}/contact`}
                      onClick={e => e.stopPropagation()}
                      className="w-full text-center bg-blue-500/10 hover:bg-blue-500 border border-blue-500/20 hover:border-blue-500 text-blue-400 hover:text-white font-semibold text-xs py-2.5 rounded-xl transition-all duration-200 block"
                    >
                      {t('requestQuote')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


      </div>
    </section>
  )
}
