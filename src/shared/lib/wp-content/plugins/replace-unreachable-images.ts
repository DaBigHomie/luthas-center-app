/**
 * Plugin: replace-unreachable-images
 *
 * Replaces src (and clears srcset/sizes) on <img> tags whose src is
 * unreachable from the new app.  Two cases are handled:
 *
 *   1. Absolute URLs pointing to a known internal origin
 *      (luthascenter.local or luthascenter.com) — caught by toInternalPath.
 *
 *   2. Relative paths starting with /wp-content/ — legacy media paths that
 *      exist in old WP post HTML and are not served by the new app.
 *
 * The replacement URL defaults to "/placeholder-cover.svg" but can be
 * overridden via ctx.mediaPlaceholder.
 *
 * Runs BEFORE sanitize-html so the final safety pass strips any residual
 * local URLs we might have missed.
 */

import type { ContentTransform } from '../types'
import { toInternalPath } from './rewrite-internal-links'

const DEFAULT_PLACEHOLDER = '/placeholder-cover.svg'

// Matches <img … src="…" … > (including self-closing />)
// We rewrite the whole <img> tag to avoid partial attribute replacement.
const IMG_TAG_RE = /<img\s[^>]*>/gi

/** Return true when a relative src path is a legacy WP media upload path. */
function isRelativeWpMedia(src: string): boolean {
  return /^\/wp-content\//i.test(src)
}

/** Replace the value of a named attribute in an HTML tag string. */
function replaceAttr(tag: string, name: string, newValue: string): string {
  // Handles both double- and single-quoted attributes.
  const re = new RegExp(`(\\s${name}=)(["'])([^"']*?)\\2`, 'i')
  if (re.test(tag)) {
    return tag.replace(re, `$1$2${newValue}$2`)
  }
  // Attribute not present — append it.
  return tag.replace(/\s*\/?>$/, ` ${name}="${newValue}"$&`)
}

/** Remove a named attribute from an HTML tag string entirely. */
function removeAttr(tag: string, name: string): string {
  return tag.replace(new RegExp(`\\s${name}=["'][^"']*?["']`, 'gi'), '')
}

export const replaceUnreachableImages: ContentTransform = (html, ctx) => {
  const placeholder = ctx?.mediaPlaceholder ?? DEFAULT_PLACEHOLDER

  return html.replace(IMG_TAG_RE, (imgTag) => {
    // Extract src value.
    const srcMatch = /\ssrc=(["'])([^"']*)\1/i.exec(imgTag)
    if (!srcMatch) return imgTag
    const src = srcMatch[2]

    // Case 1: absolute URL to a known internal origin.
    // Case 2: relative /wp-content/ path (no host) — unreachable in new app.
    if (toInternalPath(src) === null && !isRelativeWpMedia(src)) return imgTag

    // Swap src, clear srcset and sizes.
    let tag = replaceAttr(imgTag, 'src', placeholder)
    tag = removeAttr(tag, 'srcset')
    tag = removeAttr(tag, 'sizes')
    return tag
  })
}
