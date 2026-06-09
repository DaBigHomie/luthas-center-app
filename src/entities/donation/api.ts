import 'server-only'
import { createClient } from '@/shared/lib/supabase/server'
import type { DonationFormRow, DonationFormWithStats, DonationStatsRow } from './model'

/** List all published donation forms. */
export async function listDonationForms(): Promise<DonationFormRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('donation_forms')
    .select('*')
    .eq('status', 'publish')
    .order('created_at', { ascending: true })

  if (error) throw new Error(`listDonationForms: ${error.message}`)
  return data ?? []
}

/** Fetch a published donation form by wp_id, including aggregate stats. */
export async function getDonationFormWithStats(
  wpId: number,
): Promise<DonationFormWithStats | null> {
  const supabase = await createClient()
  const { data: form, error: formError } = await supabase
    .from('donation_forms')
    .select('*')
    .eq('wp_id', wpId)
    .eq('status', 'publish')
    .single()

  if (formError) {
    if (formError.code === 'PGRST116') return null
    throw new Error(`getDonationFormWithStats(form): ${formError.message}`)
  }

  const { data: stats, error: statsError } = await supabase
    .from('donation_stats')
    .select('*')
    .eq('form_id', wpId)
    .single()

  if (statsError && statsError.code !== 'PGRST116') {
    throw new Error(`getDonationFormWithStats(stats): ${statsError.message}`)
  }

  return { ...form, stats: stats ?? null }
}

/** Fetch aggregate stats for a donation form. */
export async function getDonationStats(formWpId: number): Promise<DonationStatsRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('donation_stats')
    .select('*')
    .eq('form_id', formWpId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`getDonationStats: ${error.message}`)
  }
  return data
}