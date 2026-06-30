import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Project } from '@/types/portal'

export default async function PortalHomePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  // Fetch projects the user is a member of
  const { data: memberships } = await supabase
    .from('project_members')
    .select('project_id, role')
    .eq('user_id', user.id)

  const projectIds = memberships?.map((m) => m.project_id) ?? []

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .in('id', projectIds.length ? projectIds : ['none'])
    .order('created_at', { ascending: false })

  // If only one project, go straight there
  if (projects?.length === 1) {
    redirect(`/portal/${projects[0].slug}`)
  }

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/portal/login')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-navy-900" stroke="currentColor" strokeWidth={2.5}>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="font-display font-bold text-white text-base">GEM Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/30 text-sm hidden sm:block">{user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="text-white/40 hover:text-white/70 text-sm transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Your Projects</h1>
        <p className="text-white/40 text-sm mb-10">Select a project to view details and submit updates.</p>

        {!projects?.length ? (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-12 text-center">
            <p className="text-white/30 text-sm">No projects assigned yet.</p>
            <p className="text-white/20 text-xs mt-2">
              Contact{' '}
              <a href="mailto:info@gs-emobility.com" className="text-green-400/60">
                info@gs-emobility.com
              </a>{' '}
              to get access.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project: Project) => {
              const role = memberships?.find((m) => m.project_id === project.id)?.role
              const statusColor =
                project.status === 'active'
                  ? 'text-green-400 bg-green-500/10'
                  : project.status === 'completed'
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-amber-400 bg-amber-500/10'

              return (
                <Link
                  key={project.id}
                  href={`/portal/${project.slug}`}
                  className="group block bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-green-500/25 rounded-2xl p-6 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>
                      {project.status.replace('_', ' ')}
                    </span>
                    <svg
                      className="w-4 h-4 text-white/20 group-hover:text-green-400 transition-colors shrink-0 mt-0.5"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  <h2 className="font-display font-bold text-white text-lg mb-1.5 leading-tight">
                    {project.name}
                  </h2>

                  {project.client && (
                    <p className="text-white/40 text-xs mb-3">{project.client}</p>
                  )}

                  {project.description && (
                    <p className="text-white/45 text-sm leading-relaxed line-clamp-2 mb-4">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                    {project.location && (
                      <span className="flex items-center gap-1 text-white/30 text-xs">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {project.location}
                      </span>
                    )}
                    {role && (
                      <span className="text-white/25 text-xs capitalize ml-auto">{role}</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
