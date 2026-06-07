---
applyTo: "src/**/*.ts,src/**/*.tsx"
---

# TypeScript Rules — michael-imani-hub

## Strict Config
- All files must compile with `npx tsc --noEmit` — no errors allowed.
- `strict: true` is enforced — no `any` without an inline justification comment.
- Prefer `unknown` over `any` for external data ingestion.

## JSONB / Supabase Type Patterns
```typescript
// Cast through unknown first
const metadata = row.metadata as unknown as ProductMetadata;

// Insert type issues — use as never only as last resort
const { error } = await supabase
  .from('products')
  .insert(payload as never);
```

## Design Token Types
```typescript
// src/shared/design/tokens.ts exports typed token constants
import { TOKENS } from '@/shared/design/tokens';
// Never use raw string hex values — reference TOKENS.*
```

## Path Aliases
Use `@/` for absolute imports from `src/`:
```typescript
import { Button } from '@/shared/ui/button';
import { useProducts } from '@/features/clothing';
import { TOKENS } from '@/shared/design/tokens';
```

## Component Typing
```typescript
// Props interface over type for extensibility
interface ProductCardProps {
  product: Product;
  className?: string;
}

// Use React.FC sparingly — prefer explicit return type
function ProductCard({ product, className }: ProductCardProps): React.ReactElement {
  // ...
}
```

## Server Action Types
```typescript
'use server';

export async function addToCart(
  productId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  // ...
}
```

## No Implicit Returns
Functions must explicitly return or be typed `void`. Avoid implicit `undefined` returns in async functions.
