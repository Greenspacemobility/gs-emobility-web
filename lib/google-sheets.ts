import crypto from 'crypto'
import type { QuestionnaireTemplate } from '@/content/questionnaires/types'

/** Crea una hoja de cálculo en Google Drive con las respuestas del cuestionario.
 *
 *  Usa una cuenta de servicio: se firma un JWT con su clave privada, se cambia
 *  por un token de acceso y se llama a las APIs de Drive y Sheets. No se añade
 *  ninguna dependencia — basta con `crypto` de Node.
 *
 *  Si faltan las variables de entorno la función devuelve null y quien la llama
 *  sigue adelante: la hoja es un extra, nunca el sitio donde vive el dato.
 */

const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
].join(' ')

const b64url = (b: Buffer | string) =>
  Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

async function accessToken(): Promise<string | null> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  // La clave se guarda con \n escapados, que es como sobrevive a un campo de texto.
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, '\n')
  if (!email || !key) return null

  const now = Math.floor(Date.now() / 1000)
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claim = b64url(JSON.stringify({
    iss: email, scope: SCOPES,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
  }))
  const signer = crypto.createSign('RSA-SHA256')
  signer.update(`${head}.${claim}`)
  const assertion = `${head}.${claim}.${b64url(signer.sign(key))}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })
  if (!res.ok) throw new Error(`token google: ${res.status} ${(await res.text()).slice(0, 200)}`)
  const j = await res.json()
  return j.access_token as string
}

type Fila = (string | number)[]

function construirPestanas(
  template: QuestionnaireTemplate,
  answers: Record<string, unknown>,
  cabecera: { cliente: string; operadora: string; subtitulo: string; enviado: string },
): { titulo: string; filas: Fila[] }[] {
  const val = (id: string) => {
    const v = answers[id]
    if (v === undefined || v === null || v === '') return ''
    if (typeof v === 'boolean') return v ? 'Sí' : 'No'
    return String(v)
  }

  // 1 · Respuestas
  const respuestas: Fila[] = [
    ['Cliente', cabecera.cliente],
    ['Operación', cabecera.operadora],
    ['Alcance', cabecera.subtitulo],
    ['Enviado', cabecera.enviado],
    [],
    ['Sección', 'Pregunta', 'Respuesta'],
  ]
  for (const s of template.sections) {
    for (const f of s.fields) respuestas.push([s.title, f.label, val(f.id)])
  }

  const pestanas = [{ titulo: 'Respuestas', filas: respuestas }]

  // 2 y 3 · Anexos en forma de tabla
  for (const grid of template.grids) {
    const clave = `grid_${grid.id}`
    // Mismo criterio que el formulario: una tabla dinámica arranca con una fila.
    const filasId: string[] = grid.fixedRows
      ? grid.fixedRows
      : ((answers[`${clave}_filas`] as string[]) ?? ['r1'])
    const filas: Fila[] = [[grid.fixedRows ? 'Unidad' : '#', ...grid.columns.map(c => c.label)]]
    for (const fid of filasId) {
      filas.push([
        grid.fixedRows ? fid : String(filasId.indexOf(fid) + 1),
        ...grid.columns.map(c => val(`${clave}_${fid}_${c.id}`)),
      ])
    }
    pestanas.push({ titulo: grid.title.replace(/^Anexo\s+/i, 'Anexo ').slice(0, 95), filas })
  }

  // 4 · Documentos
  const docs: Fila[] = [['Documento', '¿Lo tiene el cliente?']]
  for (const d of template.documents) docs.push([d.label, val(`doc_${d.id}`) || 'No'])
  pestanas.push({ titulo: 'Documentos', filas: docs })

  return pestanas
}

export async function crearHojaDeCalculo(opciones: {
  template: QuestionnaireTemplate
  answers: Record<string, unknown>
  cliente: string
  operadora: string
  subtitulo: string
}): Promise<{ url: string } | null> {
  const token = await accessToken()
  if (!token) return null

  const carpeta = process.env.GOOGLE_DRIVE_FOLDER_ID
  const enviado = new Date().toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const quien = [opciones.cliente, opciones.operadora].filter(Boolean).join(' - ')
  // Sin guiones bajos en el nombre: espacios y guiones normales.
  const nombre = `Cuestionario diagnostico - ${quien} - ${enviado}`

  // 1 · Crear el archivo ya dentro de la carpeta de destino
  const crear = await fetch(
    'https://www.googleapis.com/drive/v3/files?supportsAllDrives=true&fields=id,webViewLink',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nombre,
        mimeType: 'application/vnd.google-apps.spreadsheet',
        ...(carpeta ? { parents: [carpeta] } : {}),
      }),
    },
  )
  if (!crear.ok) throw new Error(`drive crear: ${crear.status} ${(await crear.text()).slice(0, 200)}`)
  const { id, webViewLink } = await crear.json()

  const pestanas = construirPestanas(opciones.template, opciones.answers, {
    cliente: opciones.cliente, operadora: opciones.operadora,
    subtitulo: opciones.subtitulo, enviado,
  })

  // 2 · Renombrar la primera pestaña y crear las demás
  const peticiones: unknown[] = [
    { updateSheetProperties: { properties: { sheetId: 0, title: pestanas[0].titulo }, fields: 'title' } },
    ...pestanas.slice(1).map(p => ({ addSheet: { properties: { title: p.titulo } } })),
  ]
  const estructura = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}:batchUpdate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: peticiones }),
  })
  if (!estructura.ok) throw new Error(`sheets estructura: ${estructura.status}`)

  // 3 · Volcar los valores
  const valores = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${id}/values:batchUpdate`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        valueInputOption: 'RAW',
        data: pestanas.map(p => ({ range: `'${p.titulo}'!A1`, values: p.filas })),
      }),
    },
  )
  if (!valores.ok) throw new Error(`sheets valores: ${valores.status}`)

  return { url: webViewLink || `https://docs.google.com/spreadsheets/d/${id}` }
}
