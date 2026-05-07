'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CalendarCheck, Loader2, CheckCircle2 } from 'lucide-react'

export default function BookVisitForm() {
  const t = useTranslations('bookVisit')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    country: '', address: '', siteType: '',
    date: '', time: '', notes: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    await new Promise((r) => setTimeout(r, 1500))
    setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div className="glass rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[340px]">
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
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6">
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>{t('nameLabel')}</label>
          <input name="name" type="text" required value={form.name} onChange={handleChange}
            placeholder={t('namePlaceholder')} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('emailLabel')}</label>
          <input name="email" type="email" required value={form.email} onChange={handleChange}
            placeholder="tu@email.com" className={inputClass} />
        </div>
      </div>

      {/* Phone + Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>{t('phoneLabel')}</label>
          <input name="phone" type="tel" required value={form.phone} onChange={handleChange}
            placeholder="+1 000 000 0000" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('countryLabel')}</label>
          <select name="country" required value={form.country} onChange={handleChange}
            className={`${inputClass} cursor-pointer`}>
            <option value="" disabled>{t('selectOption')}</option>
            <option value="pa">Panama</option>
            <option value="mx">Mexico</option>
            <option value="us_tx">United States — Texas</option>
            <option value="no">Norway — Oslo</option>
          </select>
        </div>
      </div>

      {/* Site address */}
      <div>
        <label className={labelClass}>{t('addressLabel')}</label>
        <input name="address" type="text" required value={form.address} onChange={handleChange}
          placeholder={t('addressPlaceholder')} className={inputClass} />
      </div>

      {/* Site type */}
      <div>
        <label className={labelClass}>{t('siteTypeLabel')}</label>
        <select name="siteType" required value={form.siteType} onChange={handleChange}
          className={`${inputClass} cursor-pointer`}>
          <option value="" disabled>{t('selectOption')}</option>
          <option value="residential">{t('typeResidential')}</option>
          <option value="commercial">{t('typeCommercial')}</option>
          <option value="fleet_depot">{t('typeFleet')}</option>
          <option value="parking">{t('typeParking')}</option>
          <option value="gas_station">{t('typeGas')}</option>
          <option value="logistics">{t('typeLogistics')}</option>
          <option value="other">{t('typeOther')}</option>
        </select>
      </div>

      {/* Preferred date + time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>{t('dateLabel')}</label>
          <input name="date" type="date" required value={form.date} onChange={handleChange}
            className={`${inputClass} [color-scheme:dark]`} />
        </div>
        <div>
          <label className={labelClass}>{t('timeLabel')}</label>
          <select name="time" required value={form.time} onChange={handleChange}
            className={`${inputClass} cursor-pointer`}>
            <option value="" disabled>{t('selectOption')}</option>
            <option value="morning">{t('timeMorning')}</option>
            <option value="afternoon">{t('timeAfternoon')}</option>
            <option value="flexible">{t('timeFlexible')}</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className={labelClass}>{t('notesLabel')}</label>
        <textarea name="notes" rows={3} value={form.notes} onChange={handleChange}
          placeholder={t('notesPlaceholder')}
          className={`${inputClass} resize-none`} />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-70 text-navy-900 font-semibold py-4 rounded-xl transition-all duration-200 glow-green-sm hover:glow-green text-base"
      >
        {status === 'sending' ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> {t('sending')}</>
        ) : (
          <><CalendarCheck className="w-4 h-4" /> {t('submit')}</>
        )}
      </button>
    </form>
  )
}
