/**
 * Plugin: strip-gutenberg-comments
 *
 * Removes Gutenberg block delimiter comments from HTML:
 *   <!-- wp:paragraph {"align":"left"} -->   (opening)
 *   <!-- /wp:paragraph -->                    (closing)
 *
 * These are structural metadata inserted by the block editor and add no
 * value to rendered output.
 */

import type { ContentTransform } from '../types'

// Matches both opening and closing wp: comments, including any JSON attributes.
// The [^-]* inner guard prevents runaway matches on adjacent comments.
const WP_COMMENT_RE = /<!--\s*\/?wp:[^\-]*?-->/g

export const stripGutenbergComments: ContentTransform = (html) =>
  html.replace(WP_COMMENT_RE, '')
