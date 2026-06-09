/**
 * slugify — converts a human-readable title into a URL-safe slug.
 *
 * Rules:
 *  - Lower-case
 *  - Strip characters that are not alphanumeric, space, hyphen, or underscore
 *  - Collapse whitespace / underscores to a single hyphen
 *  - Collapse multiple hyphens
 *  - Trim leading/trailing hyphens
 *
 * No external dependencies — safe to use on both server and client.
 */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // strip special chars (keep word, space, hyphen)
    .replace(/[\s_]+/g, '-')   // space / underscore → hyphen
    .replace(/-+/g, '-')       // collapse multiple hyphens
    .replace(/^-|-$/g, '')     // trim leading/trailing hyphens
}

/**
 * isNumericSlug — returns true when the slug is purely numeric (WP wp_id default)
 * or an empty string; both indicate a missing real slug.
 */
export function isNumericSlug(slug: string | null | undefined): boolean {
  if (!slug) return true
  return /^\d+$/.test(slug)
}
