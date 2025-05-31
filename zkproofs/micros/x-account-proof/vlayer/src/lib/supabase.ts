import { createClient } from '@supabase/supabase-js'

// Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  )
}

// Create Supabase client with custom storage key for this project
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storageKey: 'x-account-proof-auth-token',
    storage: globalThis.localStorage,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'x-account-proof@1.0.0'
    }
  }
})

// Helper functions for common auth operations
export const auth = {
  /**
   * Get the current user
   */
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, options?: { redirectTo?: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: options?.redirectTo || `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  /**
   * Sign in with OAuth provider
   */
  async signInWithOAuth(provider: 'google' | 'github' | 'discord' | 'twitter', options?: { redirectTo?: string }) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: options?.redirectTo || `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  /**
   * Sign out
   */
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helpers
export const db = {
  /**
   * Save account proof data
   */
  async saveAccountProof(data: {
    user_id: string
    platform: string
    username: string
    nft_address?: string
    token_id?: string
    proof_data?: any
  }) {
    const { data: result, error } = await supabase
      .from('account_proofs')
      .insert(data)
      .select()
      .single()
    
    return { data: result, error }
  },

  /**
   * Get account proof for user
   */
  async getAccountProof(userId: string) {
    const { data, error } = await supabase
      .from('account_proofs')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    return { data, error }
  },

  /**
   * Update account proof
   */
  async updateAccountProof(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('account_proofs')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
    
    return { data, error }
  }
}

export default supabase 