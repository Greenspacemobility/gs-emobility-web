import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Greenspace E-mobility',
  description: 'Leading cross-border electric infrastructure across the Americas.',
  icons: {
    // favicon.png era el logotipo horizontal (184x58): ilegible en 16 px.
    // Ahora el isotipo en blanco sobre el verde de marca, en lienzo cuadrado.
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
