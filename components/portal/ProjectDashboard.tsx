'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Project, ProjectUpdate, ProjectFile, MemberRole } from '@/types/portal'
import UpdateForm from './UpdateForm'
import FileUploader from './FileUploader'

const STATUS_STYLES: Record<string, string> = {
  active: 'text-green-400 bg-green-500/10 border-green-500/20',
  completed: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  on_hold: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
}

const UPDATE_TYPE_STYLES: Record<string, { label: string; color: string }> = {
  note: { label: 'Note', color: 'text-white/50' },
  status_update: { label: 'Status Update', color: 'text-blue-400' },
  issue: { label: 'Issue', color: 'text-red-400' },
  milestone: { label: 'Milestone', color: 'text-green-400' },
}

function formatBytes(bytes: number | null) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

interface Props {
  project: Project
  updates: ProjectUpdate[]
  files: ProjectFile[]
  userRole: MemberRole
  userEmail: string
  userId: string
  onSignOut: () => void
}

type Tab = 'overview' | 'updates' | 'files'

export default function ProjectDashboard({
  project,
  updates: initialUpdates,
  files: initialFiles,
  userRole,
  userEmail,
  userId,
  onSignOut,
}: Props) {
  const [tab, setTab] = useState<Tab>('overview')
  const [updates, setUpdates] = useState(initialUpdates)
  const [files, setFiles] = useState(initialFiles)

  const canWrite = userRole !== 'viewer'

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-6 py-4 sticky top-0 z-10 bg-navy-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/portal" className="text-white/30 hover:text-white/60 transition-colors shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="w-px h-4 bg-white/[0.08]" />
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-navy-900" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span className="font-display font-bold text-white text-sm truncate">{project.name}</span>
            </div>
            <span className={`hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize shrink-0 ${STATUS_STYLES[project.status]}`}>
              {project.status.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-white/25 text-xs hidden md:block">{userEmail}</span>
            <form action={onSignOut}>
              <button type="submit" className="text-white/30 hover:text-white/60 text-xs transition-colors">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 w-fit">
          {(['overview', 'updates', 'files'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                tab === t
                  ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {t}
              {t === 'updates' && updates.length > 0 && (
                <span className="ml-1.5 text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">
                  {updates.length}
                </span>
              )}
              {t === 'files' && files.length > 0 && (
                <span className="ml-1.5 text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">
                  {files.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ────────────────────────────────────── */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Client', value: project.client ?? '—' },
                { label: 'Location', value: project.location ?? '—' },
                { label: 'Start Date', value: project.start_date ? new Date(project.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—' },
                { label: 'Your Role', value: userRole.charAt(0).toUpperCase() + userRole.slice(1) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-5">
                  <div className="text-white/35 text-xs mb-1.5">{label}</div>
                  <div className="font-display font-semibold text-white text-sm">{value}</div>
                </div>
              ))}
            </div>

            {project.description && (
              <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-6">
                <h3 className="text-white/50 text-xs uppercase tracking-wider mb-3">Description</h3>
                <p className="text-white/70 text-sm leading-relaxed">{project.description}</p>
              </div>
            )}

            {/* Recent activity preview */}
            {updates.length > 0 && (
              <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white/50 text-xs uppercase tracking-wider">Recent Activity</h3>
                  <button
                    onClick={() => setTab('updates')}
                    className="text-green-400/60 hover:text-green-400 text-xs transition-colors"
                  >
                    View all →
                  </button>
                </div>
                <div className="space-y-3">
                  {updates.slice(0, 3).map((u) => (
                    <div key={u.id} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[11px] font-semibold ${UPDATE_TYPE_STYLES[u.type]?.color}`}>
                            {UPDATE_TYPE_STYLES[u.type]?.label}
                          </span>
                          <span className="text-white/20 text-[11px]">{timeAgo(u.created_at)}</span>
                        </div>
                        <p className="text-white/55 text-sm line-clamp-2">{u.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Updates Tab ──────────────────────────────────────── */}
        {tab === 'updates' && (
          <div className="space-y-6">
            {canWrite && (
              <UpdateForm
                projectId={project.id}
                userId={userId}
                onAdded={(update) => setUpdates([update, ...updates])}
              />
            )}

            {updates.length === 0 ? (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-12 text-center">
                <p className="text-white/25 text-sm">No updates yet.</p>
                {canWrite && (
                  <p className="text-white/15 text-xs mt-1">Use the form above to add the first one.</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {updates.map((u) => (
                  <div
                    key={u.id}
                    className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/[0.08] ${UPDATE_TYPE_STYLES[u.type]?.color}`}>
                        {UPDATE_TYPE_STYLES[u.type]?.label}
                      </span>
                      <span className="text-white/25 text-xs ml-auto">{timeAgo(u.created_at)}</span>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{u.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Files Tab ──────────────────────────────────────── */}
        {tab === 'files' && (
          <div className="space-y-6">
            {canWrite && (
              <FileUploader
                projectId={project.id}
                userId={userId}
                onUploaded={(file) => setFiles([file, ...files])}
              />
            )}

            {files.length === 0 ? (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-12 text-center">
                <p className="text-white/25 text-sm">No files uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="bg-white/[0.04] border border-white/[0.07] hover:border-white/[0.12] rounded-xl px-5 py-4 flex items-center gap-4 transition-colors group"
                  >
                    {/* File icon */}
                    <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-white/80 text-sm font-medium truncate">{file.filename}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {file.file_size && (
                          <span className="text-white/25 text-xs">{formatBytes(file.file_size)}</span>
                        )}
                        <span className="text-white/20 text-xs">{timeAgo(file.created_at)}</span>
                      </div>
                    </div>

                    {file.public_url && (
                      <a
                        href={file.public_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/25 hover:text-green-400 transition-colors shrink-0"
                        title="Download"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
