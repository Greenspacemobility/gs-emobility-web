/**
 * HTML sanitization for user-supplied content rendered in email templates.
 * Prevents HTML injection via form fields interpolated into email HTML bodies.
 */
export function escapeHtml(str: unknown): string {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/** Truncate and strip to prevent excessively long inputs */
export function sanitizeField(str: unknown, maxLength = 500): string {
  if (typeof str !== 'string') return ''
  return escapeHtml(str.trim().slice(0, maxLength))
}
