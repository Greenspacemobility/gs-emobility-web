'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Check, ArrowRight, Zap } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

export type SolutionKey = 'residential' | 'commercial' | 'public' | 'fleet' | 'solar' | 'software'

interface Props {
  solutionKey: SolutionKey | null
  img: string
  onClose: () => void
}

export default function SolutionModal({ solutionKey, img, onClose }: Props) {
  const t = useTranslations('solutions')
  const locale = useLocale()

  useEffect(() => {
    if (!solutionKey) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [solutionKey, onClose])

  if (!solutionKey) return null

  const features = t.raw(`${solutionKey}.features`) as string[]

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-900/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full md:max-w-2xl max-h-[92vh] overflow-y-auto glass-dark rounded-t-3xl md:rounded-3xl shadow-2xl animate-slide-up">
        {/* Image header */}
        <div className="relative h-56 overflow-hidden rounded-t-3xl shrink-0">
          <Image
            src={img}
            alt={t(`${solutionKey}.title` as any)}
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 glass rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Charging type badge */}
          <div className="absolute bottom-4 left-6 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Zap className="w-3 h-3" />
              {t(`${solutionKey}.chargingType` as any)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <h2 className="font-display text-2xl font-bold text-white mb-3">
            {t(`${solutionKey}.title` as any)}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-7">
            {t(`${solutionKey}.detail` as any)}
          </p>

          {/* Features */}
          <div className="mb-8">
            <h4 className="text-white/40 font-semibold text-xs uppercase tracking-widest mb-4">
              {t('featuresLabel')}
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5 text-white/70 text-sm">
                  <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/${locale}/contact?solution=${solutionKey}`}
              onClick={onClose}
              className="flex-1 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 glow-green-sm"
            >
              {t('contactCta')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/${locale}/products#${solutionKey}`}
              onClick={onClose}
              className="flex-1 glass border border-white/10 hover:border-green-500/30 hover:text-green-400 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all text-center"
            >
              {t('learnMore')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
