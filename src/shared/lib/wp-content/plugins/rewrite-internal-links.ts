/**
 * Plugin: rewrite-internal-links
 *
 * Rewrites href attributes on <a> tags that point to known internal origins
 * (luthascenter.local and luthascenter.com) to root-relative paths, then
 * applies the redirect map to resolve any old-path → new-path mappings.
 *
 * External links are left unchanged (sanitize-html adds rel/target later).
 *
 * This is a pure-HTML string transform that runs BEFORE sanitize-html so
 * the final safety pass can strip anything we miss.
 */

import type { ContentTransform } from '../types'

export const INTERNAL_ORIGINS = [
  'https://luthascenter.local',
  'http://luthascenter.local',
  'https://www.luthascenter.local',
  'http://www.luthascenter.local',
  'https://luthascenter.com',
  'http://luthascenter.com',
  'https://www.luthascenter.com',
  'http://www.luthascenter.com',
]

/**
 * If `href` belongs to a known internal origin, strip the origin and return the
 * root-relative path.  Returns null for all other URLs.
 */
export function toInternalPath(href: string): string | null {
  for (const origin of INTERNAL_ORIGINS) {
    if (href.startsWith(origin + '/') || href === origin) {
      return href.slice(origin.length) || '/'
    }
  }
  return null
}

/**
 * Normalise trailing slash then look up in the redirect map.
 * Returns the mapped new-path, or the original path if not found.
 */
export function resolveInternalPath(
  rawPath: string,
  redirectMap?: Readonly<Record<string, string>>,
): string {
  const normalised = rawPath.length > 1 ? rawPath.replace(/\/$/, '') : rawPath
  return redirectMap?.[normalised] ?? normalised
}

// Matches href="…" or href='…' inside <a …> tags.
// Group 1 = quote char, Group 2 = href value.
const HREF_RE = /<a\s[^>]*href=(["'])([^"']*)\1/gi

export const rewriteInternalLinks: ContentTransform = (html, ctx) => {
  const redirectMap = ctx?.redirectMap

  return html.replace(HREF_RE, (match, quote, href) => {
    const internalPath = toInternalPath(href)
    if (internalPath === null) return match
    const resolved = resolveInternalPath(internalPath, redirectMap)
    return match.replace(`${quote}${href}${quote}`, `${quote}${resolved}${quote}`)
  })
}
