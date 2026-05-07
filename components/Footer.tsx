'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Mail, MapPin, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()

  return (
    <footer className="bg-navy-900 border-t border-green-500/10">
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center mb-4">
              <Image
                src="/images/logo-white.png"
                alt="Greenspace E-Mobility"
                width={160}
                height={44}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6">{t('tagline')}</p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: 'https://www.instagram.com/greenspacemobility' },
                { icon: Linkedin,  href: 'https://www.linkedin.com/company/greenspace-emobility/' },
                { icon: Twitter,   href: 'https://twitter.com/GEMOBILITY' },
                { icon: Youtube,   href: 'https://www.youtube.com/@greenspaceE-mobility' },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 glass rounded-lg flex items-center justify-center text-white/40 hover:text-green-400 hover:border-green-500/30 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">{t('solutions')}</h4>
            <ul className="space-y-3">
              {[
                { label: t('residential'), href: `/${locale}/products#residential` },
                { label: t('commercial'), href: `/${locale}/products#commercial` },
                { label: t('public'), href: `/${locale}/products#public` },
                { label: t('fleet'), href: `/${locale}/products#fleet` },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-white/50 hover:text-green-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">{t('company')}</h4>
            <ul className="space-y-3">
              {[
                { label: t('about'), href: `/${locale}/about` },
                { label: t('highway'), href: `/${locale}/electric-highway` },
                { label: t('partners'), href: `/${locale}/about#partners` },
                { label: t('partnerSite'), href: `/${locale}/partner-site` },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-white/50 hover:text-green-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Mail className="w-4 h-4 text-green-500 shrink-0" />
                <a href="mailto:info@gs-emobility.com" className="hover:text-green-400 transition-colors">
                  info@gs-emobility.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <MapPin className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <span>América Central & Caribe</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">{t('copyright')}</p>
          <div className="flex gap-6">
            <Link href={`/${locale}/privacy`} className="text-white/30 hover:text-white/60 text-xs transition-colors">
              {t('privacy')}
            </Link>
            <Link href={`/${locale}/terms`} className="text-white/30 hover:text-white/60 text-xs transition-colors">
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
