import { NextRequest, NextResponse } from 'next/server'
import { loadInvite, saveAnswers, isTokenShaped, RpcError } from '@/lib/questionnaire'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!isTokenShaped(token)) return NextResponse.json({ error: 'no encontrado' }, { status: 404 })
  try {
    const data = await loadInvite(token)
    if (!data) return NextResponse.json({ error: 'no encontrado' }, { status: 404 })
    return NextResponse.json(data)
  } catch (e) {
    // El motivo se expone solo como etiqueta y código: ayuda a diagnosticar
    // sin filtrar nada de la base ni de las credenciales.
    const causa = e instanceof RpcError ? `${e.causa}:${e.status}` : 'desconocida'
    console.error('q_load falló:', causa, e instanceof RpcError ? e.detalle : e)
    return NextResponse.json({ error: 'error del servidor', causa }, { status: 500 })
  }
}

/** Guardado automático. Generoso en frecuencia pero con tope, para que un
 *  cuestionario abierto toda la tarde no pueda convertirse en un martillo. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!isTokenShaped(token)) return NextResponse.json({ error: 'no encontrado' }, { status: 404 })

  const rl = checkRateLimit(`q-save:${getClientIp(req)}`, { limit: 240, windowMs: 15 * 60 * 1000 })
  if (!rl.allowed) return NextResponse.json({ error: 'demasiadas peticiones' }, { status: 429 })

  try {
    const body = await req.json()
    const answers = body?.answers ?? {}
    const progress = Number(body?.progress ?? 0)
    if (JSON.stringify(answers).length > 400_000) {
      return NextResponse.json({ error: 'respuesta demasiado grande' }, { status: 413 })
    }
    const result = await saveAnswers(token, answers, progress)
    if (!result) return NextResponse.json({ error: 'no encontrado' }, { status: 404 })
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'error del servidor' }, { status: 500 })
  }
}
