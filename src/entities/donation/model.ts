import type { Tables, Json } from '@/shared/types/database'

export type DonationFormRow = Tables<'donation_forms'>
export type DonationStatsRow = Tables<'donation_stats'>

/** A donation form with its aggregate stats joined. */
export type DonationFormWithStats = DonationFormRow & {
  stats: DonationStatsRow | null
}

/** Typed representation of a price level entry in the price_levels JSONB array. */
export interface DonationLevel {
  amount: number
  label?: string
  default?: boolean
}

/**
 * Parse the price_levels JSONB column into a typed array.
 * Returns an empty array if the column is null or malformed.
 */
export function parsePriceLevels(raw: Json | null): DonationLevel[] {
  if (!Array.isArray(raw)) return []
  return (raw as unknown[]).flatMap((item) => {
    if (typeof item !== 'object' || item === null) return []
    const obj = item as Record<string, unknown>
    if (typeof obj['amount'] !== 'number') return []
    return [
      {
        amount: obj['amount'] as number,
        label: typeof obj['label'] === 'string' ? obj['label'] : undefined,
        default: typeof obj['default'] === 'boolean' ? obj['default'] : undefined,
      },
    ]
  })
}
