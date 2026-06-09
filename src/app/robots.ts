/**
 * robots.ts — Luthas Center for Excellence
 *
 * Allow all crawlers; point to the XML sitemap.
 * Next.js 16 file convention: default export returns MetadataRoute.Robots.
 */

import type { MetadataRoute } from 'next'

const BASE_URL = 'https://luthascenter.damieus.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
