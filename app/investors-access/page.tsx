'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

function InvestorsAccessForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/en/investors'
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/investors-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      window.location.href = next
    } else {
      setError('Incorrect access code. Contact us at info@gs-emobility.com.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <Image src="/images/logo-white.png" alt="Greenspace E-mobility" width={180} height={42} />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h1 className="text-white font-display text-xl font-bold mb-2">Investor Access</h1>
          <p className="text-white/50 text-sm mb-6">
            Enter your access code to view investor materials.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Access code"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-green-500 transition-colors"
              required
              autoFocus
            />

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white font-semibold rounded-xl px-4 py-3 transition-colors"
            >
              {loading ? 'Verifying…' : 'Access investor materials'}
            </button>
          </form>

          <p className="text-white/30 text-xs mt-6 text-center">
            Don&apos;t have an access code?{' '}
            <a href="mailto:info@gs-emobility.com" className="text-green-400 hover:text-green-300">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function InvestorsAccessPage() {
  return (
    <Suspense>
      <InvestorsAccessForm />
    </Suspense>
  )
}
