import type { QuestionnaireTemplate } from '@/content/questionnaires/types'
import { diagnosticoFlota } from '@/content/questionnaires/diagnostico-flota'

/** Plantillas disponibles. Añadir una es añadir una línea aquí. */
export const TEMPLATES: Record<string, QuestionnaireTemplate> = {
  'diagnostico-flota': diagnosticoFlota,
}

export interface InviteData {
  template: string
  client_name: string
  operation_name: string | null
  subtitle: string | null
  locale: string
  status: 'pendiente' | 'en_progreso' | 'enviado'
  answers: Record<string, unknown>
  progress: number
  submitted_at: string | null
  files: { id: string; field: string; filename: string; size_bytes: number; uploaded_at: string }[]
  expirado?: boolean
}

/** Las tablas están cerradas por RLS: todo pasa por funciones security definer
 *  que validan el token dentro de Postgres. La clave anónima por sí sola no
 *  puede leer ni escribir nada. */
export class RpcError extends Error {
  constructor(public causa: string, public status: number, public detalle = '') {
    super(`${causa} (${status})`)
  }
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new RpcError('sin-configurar', 0)

  const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
    cache: 'no-store',
  })
  if (!res.ok) {
    // El cuerpo puede traer el motivo de PostgREST; se recorta y se guarda
    // para el diagnóstico, nunca se devuelve al cliente final.
    let detalle = ''
    try { detalle = (await res.text()).slice(0, 300) } catch { /* vacío */ }
    throw new RpcError(`rpc-${fn}`, res.status, detalle)
  }
  const data = await res.json()
  return (data ?? null) as T | null
}

export const loadInvite = (token: string) =>
  rpc<InviteData>('q_load', { p_token: token })

export const saveAnswers = (token: string, answers: unknown, progress: number) =>
  rpc<{ guardado?: boolean; bloqueado?: boolean; expirado?: boolean }>(
    'q_save', { p_token: token, p_answers: answers, p_progress: progress })

export const submitInvite = (token: string) =>
  rpc<{ enviado?: boolean; ya_enviado?: boolean; client_name?: string; operation_name?: string }>(
    'q_submit', { p_token: token })

export const registerFile = (
  token: string, field: string, filename: string,
  path: string, size: number, type: string,
) => rpc<{ id?: string; bloqueado?: boolean }>('q_add_file', {
  p_token: token, p_field: field, p_filename: filename,
  p_path: path, p_size: size, p_type: type,
})

/** Un token válido es hexadecimal largo: filtra basura antes de tocar la base. */
export const isTokenShaped = (t: string) => /^[a-f0-9]{32,64}$/i.test(t)
