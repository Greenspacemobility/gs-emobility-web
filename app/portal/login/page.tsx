import LoginForm from '@/components/portal/LoginForm'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string }
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, rgba(0,200,83,0.5) 0px, rgba(0,200,83,0.5) 1px, transparent 1px, transparent 60px),
                            repeating-linear-gradient(0deg, rgba(0,200,83,0.5) 0px, rgba(0,200,83,0.5) 1px, transparent 1px, transparent 60px)`,
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-navy-900" stroke="currentColor" strokeWidth={2.5}>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">
              GEM Portal
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-2">
            Project Access
          </h1>
          <p className="text-white/40 text-sm">
            Sign in to view your project details
          </p>
        </div>

        <LoginForm
          next={searchParams.next}
          serverError={searchParams.error}
        />

        <p className="text-center text-white/20 text-xs mt-8">
          Access restricted to invited partners only.
          <br />
          Contact{' '}
          <a href="mailto:info@gs-emobility.com" className="text-green-400/60 hover:text-green-400 transition-colors">
            info@gs-emobility.com
          </a>{' '}
          if you need help.
        </p>
      </div>
    </main>
  )
}
