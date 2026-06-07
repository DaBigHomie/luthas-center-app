---
applyTo: "src/**,**/*.ts,**/*.tsx"
---

# App Router Rules — Next.js 15

## Route Structure

```
src/app/
├── layout.tsx          # Root layout — fonts, providers, global metadata
├── page.tsx            # Homepage (/)
├── clothing/
│   ├── page.tsx        # Michael Imani catalog (/clothing)
│   └── [slug]/
│       └── page.tsx    # Product detail (/clothing/[slug])
├── music/
│   ├── page.tsx        # Wyze Ink portal (/music)
│   └── [track]/
│       └── page.tsx    # Track / release detail (/music/[track])
├── angels/
│   └── page.tsx        # Ausome Angels (/angels)
├── cart/
│   └── page.tsx        # Cart (/cart)
├── checkout/
│   └── page.tsx        # Checkout (/checkout)
├── admin/
│   └── page.tsx        # Admin panel (/admin — protected)
└── client/
    └── page.tsx        # Client portal (/client — protected)
```

## Server vs Client Components

- **Default**: Server Component (no `'use client'` directive).
- **`'use client'`** required: interactivity, browser APIs, React hooks (`useState`, `useEffect`, etc.).
- **Data fetching**: Use `async/await` in Server Components — no `useEffect` for data.
- **Mutations**: Server Actions (`'use server'`) in `src/features/*/actions.ts`.

## Metadata

Every route must export a `metadata` object or `generateMetadata` function:
```typescript
export const metadata: Metadata = {
  title: 'Page Title | Michael Imani',
  description: 'Page description for SEO',
  openGraph: { ... }
};
```

## Route Protection

Admin (`/admin`) and client (`/client`) routes use Supabase Auth middleware.
Protected routes live in `src/middleware.ts` (matcher config).

## Streaming + Suspense

Wrap async data sections in `<Suspense>` with a skeleton fallback:
```tsx
<Suspense fallback={<ProductGridSkeleton />}>
  <ProductGrid />
</Suspense>
```

## Image Optimization

- Use `next/image` for ALL images — no raw `<img>` tags.
- Provide `width`, `height`, and descriptive `alt` text.
- Use `priority` prop for above-the-fold LCP images.
- Product images served from Supabase Storage — configure `remotePatterns` in `next.config.ts`.
