'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X, ChevronDown } from 'lucide-react'

export default function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [companyOpen, setCompanyOpen] = useState(false)
  const [ctaOpen, setCtaOpen] = useState(false)
  const companyRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (companyRef.current && !companyRef.current.contains(e.target as Node)) setCompanyOpen(false)
      if (ctaRef.current && !ctaRef.current.contains(e.target as Node)) setCtaOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const otherLocale = locale === 'es' ? 'en' : 'es'
  const switchPath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  const navLinks = [
    { href: `/${locale}/products`,        label: t('products') },
    { href: `/${locale}/platform`,        label: t('platform') },
    { href: `/${locale}/electric-highway`, label: t('electricHighway') },
    { href: `/${locale}/projects`,        label: t('projects') },
    { href: `/${locale}/contact`,         label: t('contact') },
  ]

  const companyLinks = [
    { href: `/${locale}/about`,     label: t('about') },
    { href: `/${locale}/blog`,      label: t('blog') },
    { href: `/${locale}/investors`, label: t('investors') },
  ]

  const isCompanyActive = companyLinks.some(l => pathname === l.href)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-dark shadow-2xl shadow-black/30' : 'bg-transparent'
      }`}
    >
      <div className="container-wide flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center group shrink-0">
          <Image
            src="/images/logo-white.png"
            alt="Greenspace E-mobility"
            width={180}
            height={50}
            className="h-9 w-auto object-contain group-hover:opacity-90 transition-opacity"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => {
            const isHighway = link.href.includes('electric-highway')
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[0.8rem] font-semibold tracking-wide uppercase transition-colors duration-200 ${
                  isHighway
                    ? isActive
                      ? 'text-green-400'
                      : 'text-green-400 hover:text-green-300 relative after:absolute after:-bottom-0.5 after:left-0 after:right-0 after:h-px after:bg-green-500/50'
                    : isActive
                      ? 'text-green-400'
                      : 'text-white/60 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            )
          })}

          {/* Company dropdown */}
          <div ref={companyRef} className="relative">
            <button
              onClick={() => setCompanyOpen(o => !o)}
              className={`flex items-center gap-1 text-[0.8rem] font-semibold tracking-wide uppercase transition-colors duration-200 ${
                isCompanyActive || companyOpen ? 'text-green-400' : 'text-white/60 hover:text-white'
              }`}
            >
              {t('company')}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${companyOpen ? 'rotate-180' : ''}`} />
            </button>
            {companyOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 glass-dark border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 min-w-[160px]">
                {companyLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setCompanyOpen(false)}
                    className={`block px-5 py-3 text-sm font-medium transition-colors hover:bg-white/5 ${
                      pathname === link.href ? 'text-green-400' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language switcher */}
          <Link
            href={switchPath}
            className="text-xs font-semibold text-white/50 hover:text-white border border-white/10 hover:border-white/30 rounded-full px-3 py-1.5 transition-all duration-200 uppercase tracking-widest"
          >
            {otherLocale}
          </Link>

          {/* Merged CTA dropdown */}
          <div ref={ctaRef} className="relative">
            <button
              onClick={() => setCtaOpen(o => !o)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 glow-green-sm hover:glow-green hover:scale-105"
            >
              {t('cta')}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${ctaOpen ? 'rotate-180' : ''}`} />
            </button>
            {ctaOpen && (
              <div className="absolute top-full right-0 mt-3 glass-dark border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 min-w-[200px]">
                <Link
                  href={`/${locale}/contact`}
                  onClick={() => setCtaOpen(false)}
                  className="block px-5 py-3.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors border-b border-white/[0.06]"
                >
                  {t('cta')}
                </Link>
                <Link
                  href={`/${locale}/partner-site`}
                  onClick={() => setCtaOpen(false)}
                  className="block px-5 py-3.5 text-sm font-medium text-green-400 hover:text-green-300 hover:bg-white/5 transition-colors"
                >
                  {t('partnerSite')}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white/80 hover:text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-dark border-t border-white/5">
          <nav className="container-wide py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-base font-medium transition-colors ${
                  pathname === link.href ? 'text-green-400' : 'text-white/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/[0.06] pt-4 space-y-3">
              <p className="text-white/25 text-xs uppercase tracking-widest">{t('company')}</p>
              {companyLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block text-base font-medium transition-colors ${
                    pathname === link.href ? 'text-green-400' : 'text-white/70'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
              <Link
                href={`/${locale}/partner-site`}
                onClick={() => setMobileOpen(false)}
                className="w-full text-center text-sm font-semibold text-green-400 border border-green-500/30 rounded-xl px-5 py-2.5 uppercase tracking-wide"
              >
                {t('partnerSite')}
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href={switchPath}
                  className="text-xs font-semibold text-white/50 border border-white/10 rounded-full px-3 py-1.5 uppercase tracking-widest"
                >
                  {otherLocale}
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center bg-green-500 text-navy-900 font-semibold text-sm px-5 py-2.5 rounded-xl"
                >
                  {t('cta')}
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
