// Re-exports for backward compatibility
// Use the specific files directly for better tree-shaking and clearer intent:
// - Use '@/lib/supabase-client' for client-side code
// - Use '@/lib/supabase-server' for server-side code

export { createClient } from './supabase-client'
export { createServerSupabaseClient, updateSession } from './supabase-server' 