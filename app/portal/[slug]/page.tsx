import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProjectDashboard from '@/components/portal/ProjectDashboard'
import type { Project, ProjectUpdate, ProjectFile, MemberRole } from '@/types/portal'

interface Props {
  params: { slug: string }
}

export default async function ProjectPage({ params }: Props) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  // Fetch the project
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!project) notFound()

  // Verify membership
  const { data: membership } = await supabase
    .from('project_members')
    .select('role')
    .eq('project_id', project.id)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    // User not a member of this project
    redirect('/portal')
  }

  // Fetch updates (most recent first)
  const { data: updates } = await supabase
    .from('project_updates')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })

  // Fetch files
  const { data: files } = await supabase
    .from('project_files')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })

  // Generate signed URLs for files
  const filesWithUrls: ProjectFile[] = await Promise.all(
    (files ?? []).map(async (file) => {
      const { data } = await supabase.storage
        .from('project-files')
        .createSignedUrl(file.storage_path, 3600) // 1 hour
      return { ...file, public_url: data?.signedUrl }
    })
  )

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/portal/login')
  }

  return (
    <ProjectDashboard
      project={project as Project}
      updates={(updates ?? []) as ProjectUpdate[]}
      files={filesWithUrls}
      userRole={membership.role as MemberRole}
      userEmail={user.email ?? ''}
      userId={user.id}
      onSignOut={signOut}
    />
  )
}
