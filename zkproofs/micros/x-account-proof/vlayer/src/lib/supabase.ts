import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables not configured')
}

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null

// Database helper functions
export const saveProverResult = async (walletAddress: string, proverResult: any) => {
  if (!supabase) {
    console.warn('Supabase not configured - skipping database save')
    return { data: null, error: 'Supabase not configured' }
  }

  try {
    const { data, error } = await supabase
      .from('account_proofs')
      .upsert({
        wallet_address: walletAddress,
        platform: 'twitter',
        proof_data: proverResult,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'wallet_address'
      })

    if (error) {
      console.error('Error saving prover result to Supabase:', error)
      return { data: null, error }
    }

    console.log('✅ Prover result saved to Supabase successfully')
    return { data, error: null }
  } catch (err) {
    console.error('Failed to save prover result:', err)
    return { data: null, error: err }
  }
}

export const getProverResult = async (walletAddress: string) => {
  if (!supabase) {
    console.warn('Supabase not configured')
    return { data: null, error: 'Supabase not configured' }
  }

  try {
    const { data, error } = await supabase
      .from('account_proofs')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()

    return { data, error }
  } catch (err) {
    console.error('Failed to get prover result:', err)
    return { data: null, error: err }
  }
} 