/**
 * wp-content — barrel export
 *
 * WordPress content transform pipeline.
 * Import the canonical pipeline and apply it before rendering or storing HTML.
 *
 * @example
 *   import { applyTransforms, WP_CLEAN_PIPELINE } from '@/shared/lib/wp-content'
 *   const clean = applyTransforms(rawHtml, WP_CLEAN_PIPELINE, { redirectMap: REDIRECT_MAP })
 */

export type { ContentTransform, TransformCtx } from './types'

// Pipeline runner + default pipeline
export { applyTransforms, WP_CLEAN_PIPELINE } from './pipeline'

// Individual plugins (for custom pipelines or testing)
export { stripGutenbergComments } from './plugins/strip-gutenberg-comments'
export { unwrapShortcodes } from './plugins/unwrap-shortcodes'
export { rewriteInternalLinks } from './plugins/rewrite-internal-links'
export { replaceUnreachableImages } from './plugins/replace-unreachable-images'
export { unwrapDeadLinks } from './plugins/unwrap-dead-links'

// Utilities
export { readingTimeMinutes } from './reading-time'
