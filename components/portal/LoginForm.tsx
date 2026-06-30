'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm({
  next,
  serverError,
}: {
  next?: string
  serverError?: string
}) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(
    serverError === 'auth_failed' ? 'Authentication failed. Please try again.' : ''
  )
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    router.push(next ?? '/portal')
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm"
    >
      <div className="space-y-5">
        <div>
          <label className="block text-white/60 text-sm mb-2 font-medium">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-white/[0.05] border border-white/[0.10] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-green-500/50 focus:bg-white/[0.07] transition-all"
          />
        </div>

        <div>
          <label className="block text-white/60 text-sm mb-2 font-medium">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-white/[0.05] border border-white/[0.10] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-green-500/50 focus:bg-white/[0.07] transition-all"
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-navy-900 font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </div>
    </form>
  )
}
