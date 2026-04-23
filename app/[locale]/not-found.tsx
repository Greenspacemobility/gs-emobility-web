import Link from 'next/link'
import { Zap, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-8">
          <Zap className="w-10 h-10 text-green-400" />
        </div>
        <h1 className="font-display text-8xl font-bold text-gradient mb-4">404</h1>
        <p className="text-white/50 text-lg mb-8">Esta página no existe o fue movida.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-6 py-3 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
