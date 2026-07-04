'use client'

import { useState, useRef, useCallback } from 'react'
import Script from 'next/script'
import { useTranslations } from 'next-intl'
import { Send, CheckCircle2, Loader2 } from 'lucide-react'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!

export default function ContactForm() {
  const t = useTranslations('contact')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: '', message: '' })
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!turnstileToken) return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          interest: form.type,
          message: form.message,
          turnstileToken,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('sent')
    } catch {
      setStatus('idle')
      if (widgetId.current) window.turnstile?.reset(widgetId.current)
      setTurnstileToken('')
      alert('Something went wrong. Please email us directly at info@gs-emobility.com')
    }
  }

  if (status === 'sent') {
    return (
      <div className="glass rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
        <h3 className="font-display font-bold text-white text-2xl mb-3">{t('successTitle')}</h3>
        <p className="text-white/50 leading-relaxed">{t('successText')}</p>
      </div>
    )
  }

  const inputClass = 'w-full glass rounded-xl px-4 py-3.5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-green-500/50 transition-colors bg-transparent'
  const labelClass = 'block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2'

  return (
    <>
    <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js"
      strategy="afterInteractive"
      onLoad={handleTurnstileLoad}
    />
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>{t('nameLabel')}</label>
          <input
            name="name" type="text" required
            value={form.name} onChange={handleChange}
            placeholder={t('namePlaceholder')}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t('emailLabel')}</label>
          <input
            name="email" type="email" required
            value={form.email} onChange={handleChange}
            placeholder="tu@email.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>{t('phoneLabel')}</label>
          <input
            name="phone" type="tel"
            value={form.phone} onChange={handleChange}
            placeholder="+502 0000 0000"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t('typeLabel')}</label>
          <select
            name="type" required
            value={form.type} onChange={handleChange}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="" disabled>{t('selectPlaceholder')}</option>
            <option value="residential">{t('type1')}</option>
            <option value="commercial">{t('type2')}</option>
            <option value="public">{t('type3')}</option>
            <option value="fleet">{t('type4')}</option>
            <option value="other">{t('type5')}</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>{t('messageLabel')}</label>
        <textarea
          name="message" required rows={5}
          value={form.message} onChange={handleChange}
          placeholder={t('messagePlaceholder')}
          className={`${inputClass} resize-none`}
        />
      </div>

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

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId: string) => void
    }
  }
}
