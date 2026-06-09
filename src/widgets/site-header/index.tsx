/**
 * SiteHeader widget — Luthas Center
 *
 * Desktop (≥1024px): logo + horizontal nav + "Donate" CTA
 * Mobile (<1024px): logo + hamburger → slide-in drawer from left
 *
 * Nav items: Home, Courses, Blog, About, Donate, Contact
 *
 * Accessibility:
 * - <header> landmark
 * - <nav aria-label="Main navigation">
 * - Skip-link target handled in layout.tsx
 * - aria-current="page" on active link (rendered server-side via pathname)
 * - Mobile: aria-expanded, aria-controls="nav-drawer", aria-label on hamburger
 * - Drawer: role="dialog", aria-modal="true", focus trap, close on Escape
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/shared/lib/utils'

// ---------------------------------------------------------------------------
// Nav items definition
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const

// ---------------------------------------------------------------------------
// SiteHeader
// ---------------------------------------------------------------------------

export function SiteHeader() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const drawerRef = React.useRef<HTMLDivElement>(null)
  const closeButtonRef = React.useRef<HTMLButtonElement>(null)
  const hamburgerRef = React.useRef<HTMLButtonElement>(null)

  // Close drawer on Escape
  React.useEffect(() => {
    if (!drawerOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setDrawerOpen(false)
        hamburgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [drawerOpen])

  // Focus first element in drawer when opened
  React.useEffect(() => {
    if (drawerOpen) {
      closeButtonRef.current?.focus()
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  // Focus trap inside drawer
  function handleDrawerKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'Tab') return
    const drawer = drawerRef.current
    if (!drawer) return
    const focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const focusable = Array.from(drawer.querySelectorAll<HTMLElement>(focusableSelectors))
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus() }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-color-surface border-b border-color-border shadow-[var(--shadow-sm)]">
      <div className="mx-auto max-w-7xl px-spacing-4 sm:px-spacing-6 lg:px-spacing-8">
        <div className="flex h-16 items-center justify-between gap-spacing-4">

          {/* Logo / Wordmark */}
          <Link
            href="/"
            aria-label="Luthas Center for Excellence — Home"
            className="flex items-center gap-spacing-2 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus rounded-radius-sm"
          >
            <span
              className="font-[var(--font-heading)] font-bold text-xl text-color-primary tracking-tight"
              aria-hidden="true"
            >
              Luthas<span className="text-color-accent">Center</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-spacing-6"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'text-base font-medium transition-colors duration-[var(--duration-fast)]',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus rounded-radius-sm',
                    'border-b-2',
                    isActive
                      ? 'text-color-primary font-semibold border-color-primary'
                      : 'text-color-text border-transparent hover:text-color-primary hover:border-color-primary',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-spacing-3">
            <Link
              href="/donate"
              className={cn(
                'inline-flex items-center justify-center rounded-radius-md px-spacing-5 py-spacing-2',
                'bg-color-accent text-color-text-inverse font-semibold text-sm',
                'hover:opacity-90 transition-opacity duration-[var(--duration-fast)]',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus',
              )}
            >
              Donate
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            ref={hamburgerRef}
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            aria-controls="nav-drawer"
            onClick={() => setDrawerOpen(true)}
            className={cn(
              'lg:hidden flex items-center justify-center size-10 rounded-radius-md',
              'text-color-text hover:bg-color-surface-raised',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus',
              'transition-colors duration-[var(--duration-fast)]',
            )}
          >
            <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer backdrop */}
      {drawerOpen && (
        <div
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-color-surface-overlay/60 transition-opacity duration-[var(--duration-base)]"
        />
      )}

      {/* Mobile drawer */}
      <div
        id="nav-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        onKeyDown={handleDrawerKeyDown}
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-color-background shadow-[var(--shadow-lg)]',
          'flex flex-col',
          'transition-transform duration-[var(--duration-base)] ease-[var(--ease-default)]',
          drawerOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-spacing-4 py-spacing-4 border-b border-color-border">
          <Link
            href="/"
            onClick={() => setDrawerOpen(false)}
            aria-label="Luthas Center for Excellence — Home"
            className="font-[var(--font-heading)] font-bold text-lg text-color-primary tracking-tight"
          >
            Luthas<span className="text-color-accent">Center</span>
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close navigation menu"
            onClick={() => { setDrawerOpen(false); hamburgerRef.current?.focus() }}
            className="flex items-center justify-center size-9 rounded-radius-md text-color-text hover:bg-color-surface-raised focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-border-focus transition-colors duration-[var(--duration-fast)]"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Drawer nav items */}
        <nav
          aria-label="Mobile navigation"
          className="flex flex-col py-spacing-2 flex-1 overflow-y-auto"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'px-spacing-4 py-spacing-3 text-base font-medium',
                  'transition-colors duration-[var(--duration-fast)]',
                  'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-border-focus',
                  isActive
                    ? 'bg-color-surface-raised text-color-primary font-semibold'
                    : 'text-color-text hover:bg-color-surface-raised hover:text-color-primary',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Drawer CTA + auth */}
        <div className="px-spacing-4 pb-spacing-6 pt-spacing-4 border-t border-color-border space-y-spacing-3">
          <Link
            href="/donate"
            onClick={() => setDrawerOpen(false)}
            className="flex items-center justify-center w-full rounded-radius-md px-spacing-5 py-spacing-3 bg-color-accent text-color-text-inverse font-semibold text-base hover:opacity-90 transition-opacity duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus"
          >
            Donate
          </Link>
        </div>
      </div>
    </header>
  )
}
