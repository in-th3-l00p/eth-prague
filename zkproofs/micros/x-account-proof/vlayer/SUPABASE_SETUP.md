# Supabase Setup for X Account Proof

This document explains how to set up Supabase for the X Account Proof micro frontend.

## Environment Variables

Create a `.env` file in the `vlayer` directory with the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Sentry DSN for error tracking
VITE_SENTRY_DSN=your_sentry_dsn

# vLayer Configuration (already configured)
VLAYER_ENV=dev
```

## Supabase Project Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the API settings
3. Add the environment variables to your `.env` file

## Database Schema

You'll need to create the following table in your Supabase database:

```sql
-- Account proofs table
CREATE TABLE account_proofs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  username TEXT NOT NULL,
  nft_address TEXT,
  token_id TEXT,
  proof_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE account_proofs ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own proofs
CREATE POLICY "Users can read own account proofs" ON account_proofs
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own proofs
CREATE POLICY "Users can insert own account proofs" ON account_proofs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own proofs
CREATE POLICY "Users can update own account proofs" ON account_proofs
  FOR UPDATE USING (auth.uid() = user_id);
```

## Authentication URLs

In your Supabase dashboard, go to Authentication > URL Configuration and add:

### Development URLs
```
http://localhost:5173
http://localhost:5173/auth/callback
```

### Production URLs (when deployed)
```
https://yourdomain.com
https://yourdomain.com/auth/callback
```

## Usage Examples

### Basic Authentication
```tsx
import { useAuth } from './hooks/useAuth'

function LoginComponent() {
  const { user, signIn, signOut, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  
  if (user) {
    return (
      <div>
        <p>Welcome, {user.email}!</p>
        <button onClick={signOut}>Sign Out</button>
      </div>
    )
  }

  return (
    <button onClick={() => signIn('email@example.com', 'password')}>
      Sign In
    </button>
  )
}
```

### Saving Account Proof Data
```tsx
import { db } from './lib/supabase'
import { useAuth } from './hooks/useAuth'

function ProofComponent() {
  const { user } = useAuth()

  const saveProof = async (proofData: any) => {
    if (!user) return

    const { data, error } = await db.saveAccountProof({
      user_id: user.id,
      platform: 'twitter',
      username: 'example_user',
      nft_address: '0x...',
      token_id: '1',
      proof_data: proofData
    })

    if (error) {
      console.error('Failed to save proof:', error)
    } else {
      console.log('Proof saved successfully:', data)
    }
  }

  return (
    <button onClick={() => saveProof({ verified: true })}>
      Save Proof
    </button>
  )
}
```

### OAuth Authentication
```tsx
import { useAuth } from './hooks/useAuth'

function OAuthLogin() {
  const { signInWithOAuth } = useAuth()

  return (
    <div>
      <button onClick={() => signInWithOAuth('google')}>
        Sign in with Google
      </button>
      <button onClick={() => signInWithOAuth('github')}>
        Sign in with GitHub
      </button>
      <button onClick={() => signInWithOAuth('twitter')}>
        Sign in with Twitter
      </button>
    </div>
  )
}
```

## Features

✅ **Client-side authentication** - Optimized for Vite + React + Bun
✅ **Persistent sessions** - Sessions persist across browser reloads
✅ **OAuth support** - Google, GitHub, Discord, Twitter
✅ **TypeScript support** - Fully typed with proper interfaces
✅ **Database helpers** - Built-in functions for account proof operations
✅ **Error handling** - Comprehensive error management
✅ **Custom storage key** - Isolated auth storage for this micro frontend

## Integration with vLayer

This Supabase setup is designed to work alongside your vLayer proof generation. The typical flow would be:

1. User signs in with Supabase
2. User generates zkTLS proof with vLayer
3. Proof data is saved to Supabase database
4. User can view their verification status

The authentication state persists across the entire verification flow, providing a seamless user experience. 