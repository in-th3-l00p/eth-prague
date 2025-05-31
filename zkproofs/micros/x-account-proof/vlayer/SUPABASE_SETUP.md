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

You'll need to create the following tables in your Supabase database:

### Account Proofs Table
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

### Screenname Validator Table
```sql
-- Screenname validator table for storing deployed verifier contract addresses
CREATE TABLE screenname_validator (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_address TEXT NOT NULL UNIQUE,
  prover_address TEXT,
  chain_name TEXT NOT NULL,
  deployed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_screenname_validator_contract_address ON screenname_validator(contract_address);
CREATE INDEX idx_screenname_validator_chain_name ON screenname_validator(chain_name);

-- Enable RLS
ALTER TABLE screenname_validator ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users
CREATE POLICY "Allow read access to screenname_validator" ON screenname_validator
  FOR SELECT USING (true);

-- Allow insert/update for contract deployment
CREATE POLICY "Allow insert to screenname_validator" ON screenname_validator
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update to screenname_validator" ON screenname_validator
  FOR UPDATE USING (true);
```

**Note:** You can run the complete database setup by executing the SQL file at `vlayer/database-setup.sql` in your Supabase SQL editor.

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

### Managing Verifier Contracts
```tsx
import { db } from './lib/supabase'

function ContractManager() {
  const saveVerifierContract = async (contractAddress: string, proverAddress: string, chainName: string) => {
    const { data, error } = await db.saveVerifierContract({
      contract_address: contractAddress,
      prover_address: proverAddress,
      chain_name: chainName,
      deployed_at: new Date().toISOString()
    })

    if (error) {
      console.error('Failed to save verifier contract:', error)
    } else {
      console.log('Verifier contract saved successfully:', data)
    }
  }

  const getLatestVerifier = async (chainName: string) => {
    const { data, error } = await db.getLatestVerifierContract(chainName)
    
    if (error) {
      console.error('Failed to get latest verifier:', error)
    } else {
      console.log('Latest verifier contract:', data)
      return data?.contract_address
    }
  }

  const getAllVerifiers = async (chainName: string) => {
    const { data, error } = await db.getVerifierContractsByChain(chainName)
    
    if (error) {
      console.error('Failed to get verifiers:', error)
    } else {
      console.log('All verifier contracts:', data)
      return data
    }
  }

  return (
    <div>
      <button onClick={() => saveVerifierContract('0x123...', '0x456...', 'testnet')}>
        Save Contract
      </button>
      <button onClick={() => getLatestVerifier('testnet')}>
        Get Latest Verifier
      </button>
      <button onClick={() => getAllVerifiers('testnet')}>
        Get All Verifiers
      </button>
    </div>
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
✅ **Database helpers** - Built-in functions for account proof and verifier contract operations  
✅ **Error handling** - Comprehensive error management  
✅ **Custom storage key** - Isolated auth storage for this micro frontend  
✅ **Contract management** - Store and retrieve verifier contract addresses  

## Integration with vLayer

This Supabase setup is designed to work alongside your vLayer proof generation. The typical flow would be:

1. **Contract Deployment**: When contracts are deployed via `bun run deploy.ts`, verifier addresses are automatically saved to Supabase
2. **User Authentication**: User signs in with Supabase  
3. **Proof Generation**: User generates zkTLS proof with vLayer using the stored verifier contracts
4. **Data Persistence**: Proof data is saved to Supabase database  
5. **Status Tracking**: User can view their verification status

The authentication state and contract addresses persist across the entire verification flow, providing a seamless user experience.