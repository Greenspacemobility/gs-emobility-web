export type ProjectStatus = 'active' | 'completed' | 'on_hold'
export type UpdateType = 'note' | 'status_update' | 'issue' | 'milestone'
export type MemberRole = 'installer' | 'engineer' | 'admin' | 'viewer'

export interface Project {
  id: string
  name: string
  slug: string
  description: string | null
  status: ProjectStatus
  location: string | null
  client: string | null
  start_date: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ProjectMember {
  id: string
  project_id: string
  user_id: string
  role: MemberRole
  created_at: string
}

export interface ProjectUpdate {
  id: string
  project_id: string
  user_id: string
  type: UpdateType
  content: string
  metadata: Record<string, unknown>
  created_at: string
}

export interface ProjectFile {
  id: string
  project_id: string
  user_id: string
  filename: string
  storage_path: string
  file_size: number | null
  content_type: string | null
  created_at: string
  public_url?: string
}
