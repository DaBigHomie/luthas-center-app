// Re-export barrel — prefer importing directly from supabase/client or
// supabase/server. This shim exists so any legacy import of
// '@/shared/lib/supabase' still resolves without crashing.
export { createClient as createBrowserClient } from './supabase/client'
export { createClient as createServerClient } from './supabase/server'
