/**
 * Plugin: unwrap-shortcodes
 *
 * Config-driven shortcode normalisation:
 *
 *   UNWRAP  — content-bearing shortcodes: strip the opening/closing tags but
 *             keep inner text/HTML.
 *             e.g. [caption id="x"]<img …> My caption[/caption]
 *                → <img …> My caption
 *
 *   DROP    — wrapper / non-content shortcodes: remove the whole thing
 *             including inner content.
 *             e.g. [gallery ids="1,2,3"] → (empty)
 *
 *   EMBED   — [embed]URL[/embed]: keep the URL as a plain <a> link.
 *
 *   UNKNOWN — any remaining [shortcode …] tag (not in any list): strip the
 *             tag itself but keep inner content (safe default).
 *
 * Both self-closing ([foo /] and [foo]) and paired ([foo]…[/foo]) forms are
 * handled.  Nested shortcodes of the same name are NOT supported (WP doesn't
 * support nesting the same tag either).
 */

import type { ContentTransform } from '../types'

// ---------------------------------------------------------------------------
// Config lists
// ---------------------------------------------------------------------------

/** Strip opening/closing tags; keep inner content. */
const UNWRAP_TAGS = new Set([
  'caption',
  'vc_column_text',
  'et_pb_text',
  'et_pb_section',
  'et_pb_row',
  'et_pb_column',
])

/** Remove the entire shortcode (tag + inner content). */
const DROP_TAGS = new Set([
  'vc_row',
  'vc_column',
  'gallery',
])

// ---------------------------------------------------------------------------
// Regex builders
// ---------------------------------------------------------------------------

/** Escape a string for use inside a regex. */
function esc(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Build a regex that matches a paired shortcode: [name attrs]content[/name]
 * The content is captured in group 1.
 * Flags: g, s (dotAll so content can span lines).
 */
function pairedRe(name: string): RegExp {
  return new RegExp(
    `\\[${esc(name)}(?:\\s[^\\]]*)?\\]([\\s\\S]*?)\\[\\/${esc(name)}\\]`,
    'gi',
  )
}

/**
 * Build a regex that matches a self-closing shortcode: [name attrs] or [name attrs /]
 */
function selfClosingRe(name: string): RegExp {
  return new RegExp(`\\[${esc(name)}(?:\\s[^\\]]*)?\\/?\\]`, 'gi')
}

// ---------------------------------------------------------------------------
// Transform
// ---------------------------------------------------------------------------

export const unwrapShortcodes: ContentTransform = (html) => {
  let result = html

  // 1. UNWRAP — keep inner content
  for (const tag of UNWRAP_TAGS) {
    result = result.replace(pairedRe(tag), '$1')
    result = result.replace(selfClosingRe(tag), '')
  }

  // 2. DROP — remove everything including inner content
  for (const tag of DROP_TAGS) {
    result = result.replace(pairedRe(tag), '')
    result = result.replace(selfClosingRe(tag), '')
  }

  // 3. EMBED — [embed]URL[/embed] → <a href="URL">URL</a>
  result = result.replace(
    /\[embed(?:\s[^\]]*)?\]([\s\S]*?)\[\/embed\]/gi,
    (_, inner) => {
      const url = inner.trim()
      if (!url) return ''
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    },
  )

  // 4. UNKNOWN — strip any remaining [shortcode …] / [/shortcode] tags but
  //    keep inner text (safe fallback for unrecognised shortcodes).
  //
  //    Closing tags first (so inner content is preserved, not swallowed).
  result = result.replace(/\[\/[a-z_][\w-]*\]/gi, '')
  //    Opening + self-closing tags (do not greedily match bracket content —
  //    only consume up to the first ] that closes this tag).
  result = result.replace(/\[[a-z_][\w-]*(?:\s[^\]]*)?\/?\]/gi, '')

  return result
}
