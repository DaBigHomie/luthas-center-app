'use client'

/**
 * BlogPagination — URL-driven client wrapper around the shared Pagination primitive.
 *
 * Reads the current page from searchParams and pushes a new URL on change so
 * Next.js re-renders the Server Component above it with updated params.
 */

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Pagination } from '@/shared/ui'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface BlogPaginationProps {
  currentPage: number
  totalPages: number
  /** Base path to push to (default: "/blog"). */
  basePath?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BlogPagination({ currentPage, totalPages, basePath = '/blog' }: BlogPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', String(page))
    }
    const qs = params.toString()
    router.push(`${basePath}${qs ? `?${qs}` : ''}`)
  }

  if (totalPages <= 1) return null

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      variant="default"
      className="py-spacing-8"
    />
  )
}

BlogPagination.displayName = 'BlogPagination'
