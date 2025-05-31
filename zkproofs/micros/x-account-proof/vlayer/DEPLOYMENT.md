# Deployment Guide for X Account Proof

This guide explains how to deploy vLayer contracts with automatic Supabase database integration.

## Prerequisites

1. **Supabase Project**: Set up a Supabase project and create the required tables
2. **Environment Variables**: Configure both vLayer and Supabase credentials
3. **Database Setup**: Run the database setup script to create the `screenname_validator` table

## Environment Setup

Create a `.env` file in the `vlayer` directory with the following variables:

```bash
# vLayer Configuration (automatically populated by deployment)
VLAYER_ENV=dev
VITE_PROVER_ADDRESS=
VITE_VERIFIER_ADDRESS=
VITE_CHAIN_NAME=
VITE_PROVER_URL=
VITE_JSON_RPC_URL=
VITE_CLIENT_AUTH_MODE=
VITE_PRIVATE_KEY=
VITE_VLAYER_API_TOKEN=
VITE_NOTARY_URL=
VITE_WS_PROXY_URL=
VITE_GAS_LIMIT=

# Supabase Configuration (required for database integration)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Error tracking
VITE_SENTRY_DSN=your_sentry_dsn
```

## Database Setup

1. **Create Tables**: Run the SQL script in your Supabase SQL editor:
   ```bash
   # Copy and paste the contents of database-setup.sql into Supabase SQL editor
   cat vlayer/database-setup.sql
   ```

2. **Verify Tables**: Ensure both `account_proofs` and `screenname_validator` tables are created with proper RLS policies.

## Deployment Commands

### Development Environment
```bash
cd vlayer
bun run deploy:dev
```

### Testnet Environment  
```bash
cd vlayer
bun run deploy:testnet
```

### Mainnet Environment
```bash
cd vlayer
bun run deploy:mainnet
```

## What Happens During Deployment

1. **Contract Compilation**: Solidity contracts are compiled using Foundry
2. **Contract Deployment**: Prover and Verifier contracts are deployed to the target network
3. **Environment Update**: `.env` file is updated with deployed contract addresses
4. **Database Save**: Verifier contract address is saved to Supabase `screenname_validator` table
5. **Confirmation**: Deployment success is logged with contract addresses

## Deployment Output

A successful deployment will show:
```bash
Saving verifier contract address to Supabase...
✅ Verifier contract address saved to Supabase successfully
🎉 Deployment completed successfully!
📝 Prover address: 0x1234567890123456789012345678901234567890
🔍 Verifier address: 0x0987654321098765432109876543210987654321
```

## Database Schema

The `screenname_validator` table stores:
- `contract_address`: The deployed verifier contract address (unique)
- `prover_address`: The corresponding prover contract address
- `chain_name`: Network name (dev, testnet, mainnet)
- `deployed_at`: Timestamp of deployment
- `created_at`/`updated_at`: Automatic timestamps

## Retrieving Contract Addresses

Use the Supabase helper functions to retrieve contract addresses:

```typescript
import { db } from './src/lib/supabase'

// Get latest verifier for a specific chain
const { data, error } = await db.getLatestVerifierContract('testnet')
if (data) {
  console.log('Latest verifier address:', data.contract_address)
}

// Get all verifiers for a chain
const { data: contracts } = await db.getVerifierContractsByChain('testnet')
```

## Troubleshooting

### Missing Supabase Configuration
If Supabase environment variables are not set, deployment will continue but skip database operations:
```bash
⚠️ Supabase not configured - skipping database save
```

### Database Connection Errors
Check your Supabase credentials and ensure the table exists:
```bash
Error saving to Supabase: [error details]
```

### Contract Compilation Errors
Ensure the contracts in `../out/` directory are properly compiled:
```bash
Cannot find module '../out/WebProofProver.sol/WebProofProver'
```

Run `forge build` in the parent directory to compile contracts.

## Next Steps

After successful deployment:
1. Verify contract addresses in your Supabase dashboard
2. Test the proof generation with the deployed contracts
3. Update your frontend to use the new verifier address
4. Monitor deployment status through Supabase logs 