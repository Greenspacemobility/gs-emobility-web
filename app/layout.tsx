import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Greenspace E-Mobility',
  description: 'Leading cross-border electric infrastructure across the Americas.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
