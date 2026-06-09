/**
 * pipeline
 *
 * Composes an ordered list of ContentTransforms into a single pass.
 * Transforms are applied left-to-right; each receives the output of the
 * previous one.
 *
 * WP_CLEAN_PIPELINE is the canonical sequence for WordPress-sourced HTML:
 *   1. Strip Gutenberg block comments
 *   2. Unwrap / drop shortcodes
 *   3. Rewrite internal links to root-relative paths
 *   4. Replace unreachable .local image sources with the placeholder
 *
 * sanitize-html is intentionally NOT part of this pipeline — it runs as the
 * final safety net in Prose.tsx after the pipeline has already done its work.
 */

import type { ContentTransform, TransformCtx } from './types'
import { stripGutenbergComments } from './plugins/strip-gutenberg-comments'
import { unwrapShortcodes } from './plugins/unwrap-shortcodes'
import { rewriteInternalLinks } from './plugins/rewrite-internal-links'
import { replaceUnreachableImages } from './plugins/replace-unreachable-images'

/**
 * Apply an ordered list of transforms to an HTML string.
 *
 * @param html       - Input HTML.
 * @param transforms - Ordered transform functions to compose.
 * @param ctx        - Optional ambient context (redirect map, placeholder URL).
 * @returns The transformed HTML string.
 */
export function applyTransforms(
  html: string,
  transforms: readonly ContentTransform[],
  ctx?: TransformCtx,
): string {
  return transforms.reduce((acc, fn) => fn(acc, ctx), html)
}

/**
 * The canonical clean pipeline for WordPress-sourced HTML.
 * Import this and pass to applyTransforms to get consistent output across
 * Prose rendering, seed generation, and any future consumers.
 */
export const WP_CLEAN_PIPELINE: readonly ContentTransform[] = [
  stripGutenbergComments,
  unwrapShortcodes,
  rewriteInternalLinks,
  replaceUnreachableImages,
]
