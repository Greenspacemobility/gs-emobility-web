import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Project Portal | Greenspace E-mobility',
  description: 'Partner project access portal',
  robots: 'noindex, nofollow',
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-navy-950 text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
