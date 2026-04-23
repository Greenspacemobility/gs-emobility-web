import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Greenspace E-Mobility',
  description: 'La referencia en electromovilidad de la región.',
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
