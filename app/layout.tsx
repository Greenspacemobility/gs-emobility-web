import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Greenspace E-Mobility',
  description: 'La referencia en electromovilidad de la región.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
