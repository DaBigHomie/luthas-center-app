---
applyTo: "src/**"
---

# Supabase Rules — michael-imani-hub

## Client Initialization

```typescript
// src/shared/lib/supabase/client.ts — browser client (anon key)
import { createBrowserClient } from '@supabase/ssr';

// src/shared/lib/supabase/server.ts — server client (service-role safe)
import { createServerClient } from '@supabase/ssr';
```

Never import the service-role key into client-side code. Never expose it in env vars without `SUPABASE_SERVICE_ROLE_KEY` prefix (not `NEXT_PUBLIC_`).

## Type Safety

- Generate types with: `npx supabase gen types typescript --project-id <id> > src/shared/types/database.types.ts`
- JSONB columns: cast through `unknown` first before the target type:
  ```typescript
  const data = row.metadata as unknown as MyMetadataType;
  ```
- Insert type issues: use `as never` only as last resort — prefer typed insert helpers.

## Auth

- Auth state managed via Supabase Auth + middleware in `src/middleware.ts`.
- Session refresh handled by `@supabase/ssr` cookie helpers in server client.
- Never store JWT in localStorage — cookies only.

## RLS (Row Level Security)

- All tables MUST have RLS enabled in production.
- Admin routes use service-role client (server-side only).
- Public routes use anon key with RLS policies for read access.

## Migrations

- All schema changes via migration files in `supabase/migrations/`.
- Never run `ALTER TABLE` directly in production — use migration files.
- Run `supabase db push` or `supabase migration up` after creating migrations.

## Storage

- Product images: bucket `product-images` (public read, authenticated write).
- Brand assets: bucket `brand-assets` (public read).
- Never store user-uploaded files without size + MIME type validation.

## Real-time

- Avoid real-time subscriptions unless explicitly required — prefer polling or ISR.
- If used, clean up subscriptions in `useEffect` cleanup functions.
