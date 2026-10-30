'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { Check, CloudUpload, Loader2, Send, ShieldCheck } from 'lucide-react'
import type { QuestionnaireTemplate, Field } from '@/content/questionnaires/types'
import type { InviteData } from '@/lib/questionnaire'

type Answers = Record<string, any>

export default function QuestionnaireForm({
  token, template, invite, uploadsEnabled,
}: {
  token: string
  template: QuestionnaireTemplate
  invite: InviteData
  uploadsEnabled: boolean
}) {
  const [answers, setAnswers] = useState<Answers>(invite.answers || {})
  const [estado, setEstado] = useState<'inactivo' | 'guardando' | 'guardado' | 'error'>('inactivo')
  const [enviado, setEnviado] = useState(invite.status === 'enviado')
  const [enviando, setEnviando] = useState(false)
  const primerRender = useRef(true)

  const quien = [invite.client_name, invite.operation_name].filter(Boolean).join(' · ')

  /* ── Progreso: campos con contenido sobre el total de preguntas ───────── */
  const todosLosCampos = useMemo(
    () => template.sections.flatMap(s => s.fields),
    [template],
  )
  const progreso = useMemo(() => {
    const llenos = todosLosCampos.filter(f => {
      const v = answers[f.id]
      return v !== undefined && v !== null && String(v).trim() !== ''
    }).length
    return Math.round((llenos / Math.max(1, todosLosCampos.length)) * 100)
  }, [answers, todosLosCampos])

  const faltanObligatorios = useMemo(
    () => todosLosCampos.filter(f => f.required && !String(answers[f.id] ?? '').trim()),
    [answers, todosLosCampos],
  )

  /* ── Guardado automático, 1,5 s después de dejar de escribir ──────────── */
  const guardar = useCallback(async (datos: Answers, pct: number) => {
    setEstado('guardando')
    try {
      const res = await fetch(`/api/cuestionario/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: datos, progress: pct }),
      })
      setEstado(res.ok ? 'guardado' : 'error')
    } catch {
      setEstado('error')
    }
  }, [token])

  useEffect(() => {
    if (primerRender.current) { primerRender.current = false; return }
    if (enviado) return
    const t = setTimeout(() => { void guardar(answers, progreso) }, 1500)
    return () => clearTimeout(t)
  }, [answers, progreso, enviado, guardar])

  const set = (id: string, valor: any) => setAnswers(a => ({ ...a, [id]: valor }))

  const enviar = async () => {
    setEnviando(true)
    try {
      await guardar(answers, progreso)
      const res = await fetch(`/api/cuestionario/${token}/submit`, { method: 'POST' })
      if (res.ok) { setEnviado(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }
    } finally {
      setEnviando(false)
    }
  }

  /* ── Pantalla de acuse ────────────────────────────────────────────────── */
  if (enviado) {
    return (
      <main className="min-h-screen bg-navy-900 flex items-center justify-center px-6 py-24">
        <div className="max-w-xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-7">
            <Check className="w-7 h-7 text-green-400" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Cuestionario recibido
          </h1>
          <p className="text-white/50 leading-relaxed mb-3">
            Gracias. Hemos recibido la información de {quien}. Nuestro equipo la revisará y
            volverá a usted con el diagnóstico y las preguntas de seguimiento que haga falta.
          </p>
          <p className="text-white/25 text-sm">
            Si necesita corregir o ampliar algo, escríbanos a{' '}
            <a href="mailto:info@gs-emobility.com" className="text-green-400 hover:underline">
              info@gs-emobility.com
            </a>.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-navy-900">
      {/* ── Encabezado ──────────────────────────────────────────────────── */}
      <header className="border-b border-white/10 bg-navy-900/95 sticky top-0 z-30 backdrop-blur">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Image src="/images/logo-white.png" alt="Greenspace E-mobility" width={132} height={46}
                 className="h-7 w-auto shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-green-500 transition-all duration-500"
                   style={{ width: `${progreso}%` }} />
            </div>
          </div>
          <span className="text-white/40 text-xs tabular-nums shrink-0">{progreso}%</span>
          <span className="text-xs shrink-0 w-28 text-right">
            {estado === 'guardando' && <span className="text-white/35 inline-flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> guardando</span>}
            {estado === 'guardado'  && <span className="text-green-400/70">guardado</span>}
            {estado === 'error'     && <span className="text-amber-400/80">sin guardar</span>}
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-14">
        <p className="text-green-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">{quien}</p>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
          {template.title}
        </h1>
        {invite.subtitle && <p className="text-white/40 mb-7">{invite.subtitle}</p>}
        <p className="text-white/55 leading-relaxed mb-5">{template.intro}</p>

        <div className="glass rounded-2xl p-5 flex gap-3 mb-14 border border-green-500/15">
          <ShieldCheck className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          <p className="text-white/45 text-sm leading-relaxed">{template.confidentiality}</p>
        </div>

        {/* ── Secciones ─────────────────────────────────────────────────── */}
        {template.sections.map(seccion => (
          <section key={seccion.id} className="mb-16">
            <h2 className="font-display text-xl font-bold text-white mb-2">{seccion.title}</h2>
            {seccion.intro && <p className="text-white/35 text-sm mb-7">{seccion.intro}</p>}
            <div className="space-y-7 mt-7">
              {seccion.fields.map(f => (
                <Campo key={f.id} field={f} valor={answers[f.id]} onChange={v => set(f.id, v)} />
              ))}
            </div>
          </section>
        ))}

        {/* ── Tablas ────────────────────────────────────────────────────── */}
        {template.grids.map(grid => (
          <Grid key={grid.id} grid={grid} answers={answers} set={set} />
        ))}

        {/* ── Documentos ────────────────────────────────────────────────── */}
        <section className="mb-16">
          <h2 className="font-display text-xl font-bold text-white mb-2">{template.documentsTitle}</h2>
          <p className="text-white/35 text-sm mb-7">{template.documentsIntro}</p>
          <div className="space-y-3">
            {template.documents.map(d => (
              <label key={d.id}
                     className="glass rounded-xl p-4 flex items-start gap-3 cursor-pointer hover:border-green-500/20 transition-colors">
                <input type="checkbox"
                       checked={Boolean(answers[`doc_${d.id}`])}
                       onChange={e => set(`doc_${d.id}`, e.target.checked)}
                       className="mt-1 w-4 h-4 accent-green-500 shrink-0" />
                <span className="text-white/60 text-sm leading-relaxed">{d.label}</span>
              </label>
            ))}
          </div>
          <div className="glass rounded-xl p-4 flex gap-3 mt-5 border border-white/10">
            <CloudUpload className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
            <p className="text-white/35 text-xs leading-relaxed">
              {uploadsEnabled
                ? 'Puede adjuntar los archivos marcados al final del formulario.'
                : 'Marque lo que tenga disponible y envíe los archivos a info@gs-emobility.com indicando el nombre de su empresa. Le confirmaremos la recepción.'}
            </p>
          </div>
        </section>

        {/* ── Entregables ───────────────────────────────────────────────── */}
        <section className="mb-16 glass rounded-2xl p-7">
          <h2 className="font-display text-lg font-bold text-white mb-5">{template.deliverablesTitle}</h2>
          <ul className="space-y-3">
            {template.deliverables.map((d, i) => (
              <li key={i} className="flex gap-3">
                <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <span className="text-white/50 text-sm leading-relaxed">{d}</span>
              </li>
            ))}
          </ul>
          <p className="text-white/25 text-xs leading-relaxed mt-6">{template.closingNote}</p>
        </section>

        {/* ── Envío ─────────────────────────────────────────────────────── */}
        <section className="border-t border-white/10 pt-10 pb-24">
          {faltanObligatorios.length > 0 && (
            <p className="text-amber-400/70 text-sm mb-5">
              Faltan {faltanObligatorios.length} respuesta{faltanObligatorios.length > 1 ? 's' : ''} marcada
              {faltanObligatorios.length > 1 ? 's' : ''} como esencial
              {faltanObligatorios.length > 1 ? 'es' : ''}. Puede enviarlo igualmente; lo veremos juntos después.
            </p>
          )}
          <button
            onClick={enviar}
            disabled={enviando}
            className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-navy-900 font-semibold px-8 py-4 rounded-2xl transition-all"
          >
            {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {enviando ? 'Enviando…' : 'Enviar cuestionario'}
          </button>
          <p className="text-white/25 text-xs mt-4">
            Sus respuestas se guardan solas. Puede cerrar esta página y volver con el mismo enlace.
          </p>
        </section>
      </div>
    </main>
  )
}

/* ── Un campo ──────────────────────────────────────────────────────────── */
function Campo({ field, valor, onChange }: { field: Field; valor: any; onChange: (v: any) => void }) {
  const base =
    'w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm ' +
    'placeholder:text-white/20 focus:border-green-500/50 focus:outline-none transition-colors'

  return (
    <div>
      <label className="block text-white/70 text-sm leading-relaxed mb-2">
        {field.label}
        {field.required && <span className="text-green-400 ml-1">*</span>}
      </label>
      {field.help && <p className="text-white/25 text-xs mb-2">{field.help}</p>}

      {field.type === 'parrafo' && (
        <textarea rows={3} className={base} value={valor ?? ''} onChange={e => onChange(e.target.value)} />
      )}
      {field.type === 'texto' && (
        <input type="text" className={base} value={valor ?? ''} onChange={e => onChange(e.target.value)} />
      )}
      {field.type === 'numero' && (
        <input type="number" className={base} value={valor ?? ''} onChange={e => onChange(e.target.value)} />
      )}
      {field.type === 'fecha' && (
        <input type="date" className={base} value={valor ?? ''} onChange={e => onChange(e.target.value)} />
      )}
      {field.type === 'opcion' && (
        <select className={base} value={valor ?? ''} onChange={e => onChange(e.target.value)}>
          <option value="">Seleccione…</option>
          {(field.options ?? []).map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
      {field.type === 'si-no' && (
        <div className="flex gap-3">
          {['Sí', 'No', 'Parcialmente'].map(o => (
            <button key={o} type="button" onClick={() => onChange(o)}
              className={`px-5 py-2.5 rounded-xl text-sm transition-colors border ${
                valor === o
                  ? 'bg-green-500/15 border-green-500/50 text-green-400'
                  : 'bg-white/[0.04] border-white/10 text-white/50 hover:border-white/20'
              }`}>{o}</button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Una tabla ─────────────────────────────────────────────────────────── */
function Grid({ grid, answers, set }: { grid: any; answers: Answers; set: (id: string, v: any) => void }) {
  const clave = `grid_${grid.id}`
  const filas: string[] = grid.fixedRows
    ? grid.fixedRows
    : (answers[`${clave}_filas`] as string[]) ?? ['r1']

  const añadir = () => set(`${clave}_filas`, [...filas, `r${filas.length + 1}`])

  return (
    <section className="mb-16">
      <h2 className="font-display text-xl font-bold text-white mb-2">{grid.title}</h2>
      {grid.intro && <p className="text-white/35 text-sm mb-7">{grid.intro}</p>}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full border-collapse min-w-[640px]">
          <thead>
            <tr>
              <th className="text-left text-white/30 text-[11px] uppercase tracking-wider font-medium pb-3 pr-3 w-16" />
              {grid.columns.map((c: any) => (
                <th key={c.id} className="text-left text-white/30 text-[11px] uppercase tracking-wider font-medium pb-3 pr-3">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila: string) => (
              <tr key={fila}>
                <td className="pr-3 py-1 text-white/40 text-xs tabular-nums">{grid.fixedRows ? fila : ''}</td>
                {grid.columns.map((c: any) => {
                  const id = `${clave}_${fila}_${c.id}`
                  return (
                    <td key={c.id} className="pr-3 py-1">
                      <input type="text"
                        className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-green-500/50 focus:outline-none transition-colors"
                        value={answers[id] ?? ''} onChange={e => set(id, e.target.value)} />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {grid.addRowLabel && (
        <button type="button" onClick={añadir}
                className="mt-4 text-green-400 hover:text-green-300 text-sm transition-colors">
          + {grid.addRowLabel}
        </button>
      )}
    </section>
  )
}
