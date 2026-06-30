'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ProjectFile } from '@/types/portal'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'text/plain', 'text/csv',
]

interface Props {
  projectId: string
  userId: string
  onUploaded: (file: ProjectFile) => void
}

export default function FileUploader({ projectId, userId, onUploaded }: Props) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    setError('')

    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum size is 50 MB.')
      return
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('File type not supported. Upload PDF, image, Word, Excel, ZIP, or text files.')
      return
    }

    setUploading(true)
    setProgress(10)

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const storagePath = `${projectId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`

    // Upload to Supabase Storage
    const { error: storageError } = await supabase.storage
      .from('project-files')
      .upload(storagePath, file, { contentType: file.type })

    if (storageError) {
      setError('Upload failed. Please try again.')
      setUploading(false)
      setProgress(0)
      return
    }

    setProgress(70)

    // Save metadata to project_files table
    const { data, error: dbError } = await supabase
      .from('project_files')
      .insert({
        project_id: projectId,
        user_id: userId,
        filename: file.name,
        storage_path: storagePath,
        file_size: file.size,
        content_type: file.type,
      })
      .select()
      .single()

    if (dbError || !data) {
      setError('File uploaded but failed to save record. Contact support.')
      setUploading(false)
      setProgress(0)
      return
    }

    // Get signed URL for immediate display
    const { data: urlData } = await supabase.storage
      .from('project-files')
      .createSignedUrl(storagePath, 3600)

    setProgress(100)
    onUploaded({ ...data, public_url: urlData?.signedUrl } as ProjectFile)

    setTimeout(() => {
      setUploading(false)
      setProgress(0)
    }, 500)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    e.target.value = ''
  }

  return (
    <div>
      <h3 className="text-white/60 text-sm font-medium mb-4">Upload File</h3>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
          dragging
            ? 'border-green-500/50 bg-green-500/[0.06]'
            : uploading
            ? 'border-white/[0.10] bg-white/[0.03] cursor-default'
            : 'border-white/[0.10] hover:border-white/[0.20] bg-white/[0.02] hover:bg-white/[0.04]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept={ALLOWED_TYPES.join(',')}
        />

        {uploading ? (
          <div className="space-y-3">
            <div className="text-white/40 text-sm">Uploading…</div>
            <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <svg className="w-8 h-8 text-white/20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-white/40 text-sm mb-1">
              Drop a file here or <span className="text-green-400/70">browse</span>
            </p>
            <p className="text-white/20 text-xs">PDF, images, Word, Excel, ZIP — up to 50 MB</p>
          </>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-xs mt-2 px-1">{error}</p>
      )}
    </div>
  )
}
