import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      return NextResponse.redirect(`${requestUrl.origin}/login?error=Could not authenticate user`)
    }
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
} 