/**
 * Core types for the WordPress content transform pipeline.
 *
 * A ContentTransform is a pure function: string in, string out.
 * TransformCtx carries optional ambient data that plugins may need
 * (redirect lookup table, placeholder URL for broken images, etc.).
 */

export interface TransformCtx {
  /**
   * Map of old-path → new-path for internal link rewriting.
   * Keys are root-relative paths without trailing slash (e.g. "/courses/foo").
   */
  redirectMap?: Readonly<Record<string, string>>

  /**
   * URL to substitute when an internal .local/<img> source is unreachable.
   * Defaults to "/placeholder-cover.svg" when not supplied.
   */
  mediaPlaceholder?: string
}

/**
 * A single content transform.
 * Receives the HTML string and an optional context; returns the transformed HTML.
 * Transforms must be pure and side-effect-free.
 */
export type ContentTransform = (html: string, ctx?: TransformCtx) => string
