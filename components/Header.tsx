'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const otherLocale = locale === 'es' ? 'en' : 'es'
  const switchPath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/products`, label: t('products') },
    { href: `/${locale}/platform`, label: t('platform') },
    { href: `/${locale}/electric-highway`, label: t('electricHighway') },
    { href: `/${locale}/projects`, label: t('projects') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contact') },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-dark shadow-2xl shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="container-wide flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center group">
          <Image
            src="/images/logo-white.png"
            alt="Greenspace E-Mobility"
            width={180}
            height={50}
            className="h-9 w-auto object-contain group-hover:opacity-90 transition-opacity"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[0.8rem] font-semibold tracking-wide uppercase transition-colors duration-200 ${
                pathname === link.href
                  ? 'text-green-400'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language switcher */}
          <Link
            href={switchPath}
            className="text-xs font-semibold text-white/50 hover:text-white border border-white/10 hover:border-white/30 rounded-full px-3 py-1.5 transition-all duration-200 uppercase tracking-widest"
          >
            {otherLocale}
          </Link>

          <Link
            href={`/${locale}/partner-site`}
            className="text-[0.8rem] font-semibold text-green-400 hover:text-green-300 border border-green-500/30 hover:border-green-500/60 rounded-xl px-4 py-2.5 transition-all duration-200 uppercase tracking-wide"
          >
            {t('partnerSite')}
          </Link>

          <Link
            href={`/${locale}/contact`}
            className="bg-green-500 hover:bg-green-400 text-navy-900 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 glow-green-sm hover:glow-green hover:scale-105"
          >
            {t('cta')}
          </Link>
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
                  className="bg-green-500 text-navy-900 font-semibold text-sm px-5 py-2.5 rounded-xl"
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
