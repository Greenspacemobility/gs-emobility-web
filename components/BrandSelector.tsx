'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import {
  Zap, Battery, BatteryCharging, CheckCircle2,
  ChevronDown, FileDown, MapPin, Sun,
} from 'lucide-react'
import { chargerCatalog, brandNames, type BrandId, type ChargerModel } from '@/lib/chargers'

/* ── Per-brand visual identity ─────────────────────────────── */
const brandStyles: Record<BrandId, {
  color: string; accentColor: string; borderColor: string; glowColor: string
  initials: string; cardHover: string; badgeColor: string; check: string; cta: string
}> = {
  autel: {
    color: 'from-blue-500/20 to-navy-700',
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-500/40',
    glowColor: 'shadow-[0_0_30px_rgba(59,130,246,0.12)]',
    initials: 'AE',
    cardHover: 'hover:border-blue-500/25',
    badgeColor: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    check: 'text-blue-400',
    cta: 'bg-blue-500/10 hover:bg-blue-500 border-blue-500/20 hover:border-blue-500 text-blue-400',
  },
  sinexcel: {
    color: 'from-green-500/20 to-navy-700',
    accentColor: 'text-green-400',
    borderColor: 'border-green-500/40',
    glowColor: 'shadow-[0_0_30px_rgba(34,197,94,0.12)]',
    initials: 'SX',
    cardHover: 'hover:border-green-500/25',
    badgeColor: 'bg-green-500/15 text-green-400 border border-green-500/20',
    check: 'text-green-400',
    cta: 'bg-green-500/10 hover:bg-green-500 border-green-500/20 hover:border-green-500 text-green-400',
  },
  lumosenergy: {
    color: 'from-purple-500/20 to-navy-700',
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    glowColor: 'shadow-[0_0_30px_rgba(168,85,247,0.12)]',
    initials: 'LE',
    cardHover: 'hover:border-purple-500/25',
    badgeColor: 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
    check: 'text-purple-400',
    cta: 'bg-purple-500/10 hover:bg-purple-500 border-purple-500/20 hover:border-purple-500 text-purple-400',
  },
  sungrow: {
    color: 'from-amber-500/20 to-navy-700',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    glowColor: 'shadow-[0_0_30px_rgba(245,158,11,0.12)]',
    initials: 'SG',
    cardHover: 'hover:border-amber-500/25',
    badgeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
    check: 'text-amber-400',
    cta: 'bg-amber-500/10 hover:bg-amber-500 border-amber-500/20 hover:border-amber-500 text-amber-400',
  },
}

export default function BrandSelector() {
  const t = useTranslations('products')
  const locale = useLocale()
  const [open, setOpen] = useState<BrandId | null>('autel')

  const toggle = (name: BrandId) => setOpen(prev => prev === name ? null : name)

  /* ── Brand definitions ─────────────────────────────────────── */
  const brands: Array<{
    id: BrandId
    highlight?: boolean
    marketTag?: string
    lines: Array<{ icon: any; label: string; desc: string }>
  }> = [
    {
      id: 'autel',
      highlight: true,
      lines: [
        { icon: Zap,             label: t('ac'),      desc: t('autelAc') },
        { icon: BatteryCharging, label: t('dc'),      desc: t('autelDc') },
        { icon: Battery,         label: t('storage'), desc: t('autelStorage') },
      ],
    },
    {
      id: 'sinexcel',
      lines: [
        { icon: BatteryCharging, label: t('dc'),      desc: t('sinexcelDc') },
        { icon: Battery,         label: t('storage'), desc: t('sinexcelStorage') },
      ],
    },
    {
      id: 'lumosenergy',
      lines: [
        { icon: BatteryCharging, label: t('dc'),      desc: t('gresgyingDc') },
        { icon: Battery,         label: t('storage'), desc: t('gresgyingStorage') },
      ],
    },
    {
      id: 'sungrow',
      marketTag: t('colombiaTag'),
      lines: [
        { icon: BatteryCharging, label: t('dc'),   desc: t('sungrowDc') },
        { icon: Sun,             label: t('solar'), desc: t('sungrowSolar') },
      ],
    },
  ]

  return (
    <section id="products" className="section-padding">
      <div className="container-wide">

        {/* ── Brand cards ─────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-0">
          {brands.map(({ id, highlight, marketTag, lines }) => {
            const s = brandStyles[id]
            const isOpen = open === id
            return (
              <div
                key={id}
                onClick={() => toggle(id)}
                className={`relative glass rounded-2xl overflow-hidden flex flex-col h-full cursor-pointer transition-all duration-300 hover:scale-[1.01]
                  ${isOpen ? `${s.borderColor} ${s.glowColor}` : highlight ? `${s.borderColor} shadow-[0_0_30px_rgba(59,130,246,0.12)]` : 'hover:border-white/15'}
                `}
                style={{ transitionProperty: 'transform, border-color, box-shadow' }}
              >
                {/* Featured / market badge */}
                {highlight && (
                  <div className="absolute top-4 right-4 text-[10px] font-bold text-white bg-blue-500 px-2 py-1 rounded-full uppercase tracking-wider z-10">
                    {t('featured')}
                  </div>
                )}
                {marketTag && (
                  <div className="absolute top-4 right-4 z-10 inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-1 rounded-full uppercase tracking-wider">
                    <MapPin className="w-3 h-3" />
                    {marketTag}
                  </div>
                )}

                {/* Brand header */}
                <div className={`h-36 bg-gradient-to-br ${s.color} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)' }}
                  />
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center border border-white/10 mx-auto mb-2.5">
                      <span className={`font-display font-bold text-lg ${s.accentColor}`}>{s.initials}</span>
                    </div>
                    <h3 className="font-display font-bold text-white text-lg leading-tight px-2">{brandNames[id]}</h3>
                  </div>
                </div>

                {/* Product lines */}
                <div className="p-5 flex flex-col flex-1 gap-3.5">
                  {lines.map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className={`w-4 h-4 ${s.accentColor}`} />
                      </div>
                      <div>
                        <span className={`text-xs font-bold uppercase tracking-widest ${s.accentColor}`}>{label}</span>
                        <p className="text-white/55 text-sm leading-relaxed mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}

                  {/* View Portfolio button */}
                  <div className="mt-auto pt-4">
                    <div
                      className={`w-full flex items-center justify-center gap-2 border font-semibold text-sm py-3 rounded-xl transition-all duration-200
                        ${isOpen
                          ? `${s.accentColor} border-current bg-white/5`
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

        {/* ── Portfolio panel ─────────────────────────────────── */}
        {open && (
          <div key={open} className="mt-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/8" />
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${brandStyles[open].accentColor}`}>
                {brandNames[open]} · {t('portfolioLabel')}
              </span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            {open === 'sungrow' && (
              <p className="text-white/40 text-sm text-center max-w-2xl mx-auto mb-6">
                {t('sungrowNote')}
              </p>
            )}

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {chargerCatalog.filter(c => c.brand === open).map(model => (
                <ChargerCard key={model.id} model={model} locale={locale} t={t} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}

/* ── Individual charger card ─────────────────────────────────── */
function ChargerCard({ model, locale, t }: { model: ChargerModel; locale: string; t: any }) {
  const s = brandStyles[model.brand]
  return (
    <div
      className={`glass rounded-3xl overflow-hidden border border-white/[0.08] ${s.cardHover} transition-all hover:scale-[1.01] flex flex-col h-full`}
      onClick={e => e.stopPropagation()}
    >
      {/* Product image / placeholder */}
      <div className={`flex items-center justify-center p-6 h-48 relative ${model.imageBg === 'light' ? 'bg-white' : 'bg-white/[0.04]'}`}>
        {model.image ? (
          <Image
            src={model.image}
            alt={model.model}
            width={200}
            height={200}
            className="object-contain h-full w-auto drop-shadow-2xl"
          />
        ) : (
          <div className="text-center">
            <div className={`w-16 h-16 rounded-2xl glass border border-white/10 flex items-center justify-center mx-auto mb-2`}>
              <BatteryCharging className={`w-8 h-8 ${s.accentColor}`} />
            </div>
            <span className="text-white/25 text-xs font-semibold uppercase tracking-widest">{model.power}</span>
          </div>
        )}
        {model.market === 'CO' && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
            <MapPin className="w-2.5 h-2.5" />
            {t('colombiaTag')}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <span className={`text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full mb-4 self-start ${s.badgeColor}`}>
          {model.badge}
        </span>
        <h3 className="font-display font-bold text-white text-[0.95rem] leading-snug mb-1">{model.model}</h3>
        <div className={`font-bold text-sm mb-1 ${s.accentColor}`}>{model.power}</div>
        <div className="text-white/35 text-xs mb-5">{model.connectors}</div>

        <ul className="space-y-2.5 mb-6 flex-1">
          {model.features.map((f, j) => (
            <li key={j} className="flex items-start gap-2 text-white/55 text-xs leading-relaxed">
              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${s.check}`} />
              {f}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2">
          {model.datasheet ? (
            <a
              href={model.datasheet}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 text-white/60 hover:text-white border border-white/10 hover:border-white/30 font-semibold text-xs py-2.5 rounded-xl transition-all duration-200"
            >
              <FileDown className="w-3.5 h-3.5" />
              {t('datasheet')}
            </a>
          ) : (
            <span className="w-full inline-flex items-center justify-center gap-2 text-white/30 border border-white/[0.06] font-semibold text-xs py-2.5 rounded-xl">
              <FileDown className="w-3.5 h-3.5" />
              {t('datasheetOnRequest')}
            </span>
          )}
          <Link
            href={`/${locale}/contact`}
            className={`w-full text-center border font-semibold text-xs py-2.5 rounded-xl transition-all duration-200 block hover:text-white ${s.cta}`}
          >
            {t('requestQuote')}
          </Link>
        </div>
      </div>
    </div>
  )
}
