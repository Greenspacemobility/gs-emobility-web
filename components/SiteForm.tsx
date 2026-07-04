'use client'

import { useState, useRef, useCallback } from 'react'
import Script from 'next/script'
import { useTranslations } from 'next-intl'
import { Send, CheckCircle2, Loader2 } from 'lucide-react'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!

export default function SiteForm() {
  const t = useTranslations('partnerSite')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '',
    country: '', siteType: '', address: '', power: '',
    ownership: '', message: '',
  })
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | undefined>(undefined)

  const handleTurnstileLoad = useCallback(() => {
    if (turnstileRef.current && window.turnstile && !widgetId.current) {
      widgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: SITE_KEY,
        callback: (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => setTurnstileToken(''),
      })
    }
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value })

  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!turnstileToken) return
    setStatus('sending')
    setError(null)
    try {
      const res = await fetch('/api/partner-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, turnstileToken }),
      })
      if (!res.ok) throw new Error('Server error')
      setStatus('sent')
    } catch {
      setStatus('idle')
      if (widgetId.current) window.turnstile?.reset(widgetId.current)
      setTurnstileToken('')
      setError('Something went wrong. Please try again or email us directly at info@gs-emobility.com')
    }
  }

  if (status === 'sent') {
    return (
      <div className="glass rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
        <h3 className="font-display font-bold text-white text-2xl mb-3">{t('successTitle')}</h3>
        <p className="text-white/50 leading-relaxed max-w-sm">{t('successText')}</p>
      </div>
    )
  }

  const inputClass =
    'w-full glass rounded-xl px-4 py-3.5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-green-500/50 transition-colors bg-transparent'
  const labelClass = 'block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2'

  return (
    <>
    <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js"
      strategy="afterInteractive"
      onLoad={handleTurnstileLoad}
    />
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6">
      {/* Name + Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>{t('nameLabel')}</label>
          <input name="name" type="text" required value={form.name} onChange={handleChange}
            placeholder={t('namePlaceholder')} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('companyLabel')}</label>
          <input name="company" type="text" value={form.company} onChange={handleChange}
            placeholder={t('companyPlaceholder')} className={inputClass} />
        </div>
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>{t('emailLabel')}</label>
          <input name="email" type="email" required value={form.email} onChange={handleChange}
            placeholder="tu@email.com" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('phoneLabel')}</label>
          <input name="phone" type="tel" value={form.phone} onChange={handleChange}
            placeholder="+1 000 000 0000" className={inputClass} />
        </div>
      </div>

      {/* Country + Site Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>{t('countryLabel')}</label>
          <select name="country" required value={form.country} onChange={handleChange}
            className={`${inputClass} cursor-pointer`}>
            <option value="" disabled>{t('selectOption')}</option>
            <option value="pa">Panama</option>
            <option value="mx">Mexico</option>
            <option value="us_tx">United States — Texas</option>
            <option value="us_other">United States — Other state</option>
            <option value="other">{t('otherOption')}</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>{t('siteTypeLabel')}</label>
          <select name="siteType" required value={form.siteType} onChange={handleChange}
            className={`${inputClass} cursor-pointer`}>
            <option value="" disabled>{t('selectOption')}</option>
            <option value="gas_station">{t('siteGas')}</option>
            <option value="parking">{t('sitePark')}</option>
            <option value="truck_stop">{t('siteTruck')}</option>
            <option value="shopping">{t('siteShopping')}</option>
            <option value="logistics">{t('siteLogistics')}</option>
            <option value="hotel">{t('siteHotel')}</option>
            <option value="industrial">{t('siteIndustrial')}</option>
            <option value="other">{t('otherOption')}</option>
          </select>
        </div>
      </div>

      {/* Address */}
      <div>
        <label className={labelClass}>{t('addressLabel')}</label>
        <input name="address" type="text" required value={form.address} onChange={handleChange}
          placeholder={t('addressPlaceholder')} className={inputClass} />
      </div>

      {/* Power + Ownership */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>{t('powerLabel')}</label>
          <select name="power" value={form.power} onChange={handleChange}
            className={`${inputClass} cursor-pointer`}>
            <option value="" disabled>{t('selectOption')}</option>
            <option value="none">{t('powerNone')}</option>
            <option value="lt100">{t('powerLt100')}</option>
            <option value="100_500">{t('power100_500')}</option>
            <option value="gt500">{t('powerGt500')}</option>
            <option value="unknown">{t('powerUnknown')}</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>{t('ownershipLabel')}</label>
          <select name="ownership" required value={form.ownership} onChange={handleChange}
            className={`${inputClass} cursor-pointer`}>
            <option value="" disabled>{t('selectOption')}</option>
            <option value="owner">{t('ownershipOwner')}</option>
            <option value="lessee">{t('ownershipLessee')}</option>
            <option value="agent">{t('ownershipAgent')}</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className={labelClass}>{t('messageLabel')}</label>
        <textarea name="message" rows={4} value={form.message} onChange={handleChange}
          placeholder={t('messagePlaceholder')}
          className={`${inputClass} resize-none`} />
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}

      <div ref={turnstileRef} className="flex justify-center" />

      <button
        type="submit"
        disabled={status === 'sending' || !turnstileToken}
        className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-70 text-navy-900 font-semibold py-4 rounded-xl transition-all duration-200 glow-green-sm hover:glow-green text-base"
      >
        {status === 'sending' ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> {t('sending')}</>
        ) : (
          <><Send className="w-4 h-4" /> {t('submit')}</>
        )}
      </button>
    </form>
    </>
  )
}
