'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ProjectUpdate, UpdateType } from '@/types/portal'

const UPDATE_TYPES: { value: UpdateType; label: string }[] = [
  { value: 'note', label: 'Note' },
  { value: 'status_update', label: 'Status Update' },
  { value: 'milestone', label: 'Milestone' },
  { value: 'issue', label: 'Issue' },
]

interface Props {
  projectId: string
  userId: string
  onAdded: (update: ProjectUpdate) => void
}

export default function UpdateForm({ projectId, userId, onAdded }: Props) {
  const [type, setType] = useState<UpdateType>('note')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data, error: dbError } = await supabase
      .from('project_updates')
      .insert({ project_id: projectId, user_id: userId, type, content: content.trim() })
      .select()
      .single()

    if (dbError || !data) {
      setError('Failed to save update. Please try again.')
    } else {
      onAdded(data as ProjectUpdate)
      setContent('')
      setType('note')
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6"
    >
      <h3 className="text-white/60 text-sm font-medium mb-4">Add Update</h3>

      {/* Type selector */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {UPDATE_TYPES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setType(value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              type === value
                ? 'bg-green-500/15 text-green-400 border-green-500/25'
                : 'text-white/30 border-white/[0.08] hover:text-white/50 hover:border-white/[0.14]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={
          type === 'note' ? 'Add a note about this project…'
          : type === 'status_update' ? 'Describe the current status…'
          : type === 'milestone' ? 'What milestone was reached?'
          : 'Describe the issue…'
        }
        rows={4}
        className="w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm resize-none focus:outline-none focus:border-green-500/40 transition-all"
      />

      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="bg-green-500 hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed text-navy-900 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          {loading ? 'Saving…' : 'Submit Update'}
        </button>
      </div>
    </form>
  )
}
