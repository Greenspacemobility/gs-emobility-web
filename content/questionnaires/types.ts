/** Motor de cuestionarios para prospectos.
 *
 * Una plantilla describe el cuestionario; el enlace que recibe el cliente
 * apunta a una invitación guardada en Supabase que referencia la plantilla.
 * Añadir un cuestionario nuevo = añadir un archivo aquí, sin tocar código.
 */

export type FieldType = 'texto' | 'parrafo' | 'numero' | 'opcion' | 'si-no' | 'fecha'

export interface Field {
  id: string
  label: string
  type: FieldType
  help?: string
  options?: string[]
  unit?: string
  required?: boolean
}

export interface Section {
  id: string
  title: string
  intro?: string
  fields: Field[]
}

/** Tabla de filas fijas (p. ej. una fila por unidad) o filas que el cliente añade. */
export interface GridSection {
  id: string
  title: string
  intro?: string
  columns: { id: string; label: string; type: FieldType; options?: string[] }[]
  fixedRows?: string[]
  addRowLabel?: string
}

export interface DocItem { id: string; label: string }

export interface QuestionnaireTemplate {
  id: string
  title: string
  intro: string
  confidentiality: string
  sections: Section[]
  grids: GridSection[]
  documentsTitle: string
  documentsIntro: string
  documents: DocItem[]
  deliverablesTitle: string
  deliverables: string[]
  closingNote: string
}
