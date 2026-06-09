/**
 * Plugin: unwrap-dead-links
 *
 * Removes dead <a> wrappers from legacy WordPress HTML while preserving the
 * anchor's inner content (text / child tags).  An anchor is considered "dead"
 * when its href cannot exist in the new app:
 *
 *   • href starts with /wp-content/  — legacy asset path (uploads, plugins…)
 *   • href starts with /             — relative internal path whose first
 *     segment is NOT one of the known live route prefixes.
 *
 * Anchors that are left untouched:
 *   • External http(s):// URLs
 *   • mailto: / tel: schemes
 *   • Fragment-only links (#something)
 *   • Known live routes (courses, blog, donate, about, contact, give,
 *     privacy-policy, terms-and-conditions)
 *   • Root "/" itself
 *
 * The transform is a tolerant regex pass consistent with the rest of the
 * pipeline.  It does NOT attempt full HTML parsing, so deeply nested same-name
 * anchors (rare / invalid HTML) are handled on a best-effort basis.
 *
 * Runs AFTER rewriteInternalLinks and replaceUnreachableImages so that
 * absolute luthascenter.com URLs have already been normalised to root-relative
 * paths before we evaluate them here.
 */

import type { ContentTransform } from '../types'

/**
 * First-path-segment prefixes that correspond to real routes in the new app.
 * Must be lower-case; comparison is case-insensitive.
 */
const LIVE_ROUTE_PREFIXES = new Set([
  'courses',
  'blog',
  'donate',
  'about',
  'contact',
  'give',
  'privacy-policy',
  'terms-and-conditions',
])

/**
 * Return true when the href should be kept as-is (link stays live).
 */
function isLiveHref(href: string): boolean {
  const trimmed = href.trim()

  // Fragment-only, empty, or non-path schemes — leave untouched.
  if (
    trimmed === '' ||
    trimmed === '/' ||
    trimmed.startsWith('#') ||
    /^(https?|mailto|tel):/i.test(trimmed)
  ) {
    return true
  }

  // Relative paths only from here on (start with /).
  if (!trimmed.startsWith('/')) {
    // Relative paths without a leading slash (e.g. "page.html") — treat as dead.
    return false
  }

  // /wp-content/... — always dead in new app.
  if (/^\/wp-content\//i.test(trimmed)) return false

  // Extract first path segment: "/foo/bar/..." → "foo"
  const firstSegment = trimmed.slice(1).split('/')[0].toLowerCase()

  // Known live route? Keep the link.
  if (LIVE_ROUTE_PREFIXES.has(firstSegment)) return true

  // Everything else is a dead relative path — unwrap.
  return false
}

/**
 * Matches a full <a …>…</a> block non-greedily.
 * Group 1 = opening tag (with all attributes).
 * Group 2 = inner HTML.
 * Flags: g, i, s (dotAll for multi-line content).
 *
 * We accept both double- and single-quoted href, and href with no quotes
 * (technically invalid but occasionally produced by old WP serialisers).
 */
const ANCHOR_RE = /(<a\s[^>]*>)([\s\S]*?)<\/a>/gi

/**
 * Extract the href value from an opening <a …> tag string.
 * Returns an empty string if no href attribute is found.
 */
function extractHref(openTag: string): string {
  // Double-quoted
  const dq = /\shref="([^"]*)"/i.exec(openTag)
  if (dq) return dq[1]
  // Single-quoted
  const sq = /\shref='([^']*)'/i.exec(openTag)
  if (sq) return sq[1]
  // Unquoted (up to next whitespace or >)
  const uq = /\shref=([^\s>'"]+)/i.exec(openTag)
  if (uq) return uq[1]
  return ''
}

export const unwrapDeadLinks: ContentTransform = (html) => {
  return html.replace(ANCHOR_RE, (match, openTag: string, inner: string) => {
    const href = extractHref(openTag)
    if (isLiveHref(href)) return match
    // Dead link — drop the <a> wrapper, keep inner content.
    return inner
  })
}
