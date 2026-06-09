/**
 * reading-time
 *
 * Estimates reading time in minutes for an HTML string.
 * Algorithm: strip all HTML tags → count whitespace-delimited words → divide
 * by 200 (average adult reading speed) → round up → minimum 1.
 *
 * Pure function, no dependencies.
 */

const TAG_RE = /<[^>]+>/g
const WHITESPACE_RE = /\s+/

/**
 * Returns an integer reading time in minutes (minimum 1).
 *
 * @param html - Raw or sanitized HTML string.
 */
export function readingTimeMinutes(html: string): number {
  const text = html.replace(TAG_RE, ' ').trim()
  if (!text) return 1
  const wordCount = text.split(WHITESPACE_RE).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}
