import proverSpec from "../out/WebProofProver.sol/WebProofProver";
import verifierSpec from "../out/WebProofVerifier.sol/WebProofVerifier";
import {
  deployVlayerContracts,
  writeEnvVariables,
  getConfig,
} from "@vlayer/sdk/config";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

const config = getConfig();

const { prover, verifier } = await deployVlayerContracts({
  proverSpec,
  verifierSpec,
});

if (supabase) {
  try {
    console.log("Saving verifier contract address to Supabase...");

    const { data, error } = await supabase
      .from('screenname_validator')
      .upsert({
        contract_address: verifier,
      });

    if (error) {
      console.error("Error saving to Supabase:", error);
    } else {
      console.log("✅ Verifier contract address saved to Supabase successfully");
    }
  } catch (err) {
    console.error("Failed to save to Supabase:", err);
  }
} else {
  console.log("⚠️  Supabase not configured - skipping database save");
}

await writeEnvVariables(".env", {
  VITE_PROVER_ADDRESS: prover,
  VITE_VERIFIER_ADDRESS: verifier,
  VITE_CHAIN_NAME: config.chainName,
  VITE_PROVER_URL: config.proverUrl,
  VITE_JSON_RPC_URL: config.jsonRpcUrl,
  VITE_CLIENT_AUTH_MODE: config.clientAuthMode,
  VITE_PRIVATE_KEY: config.privateKey,
  VITE_VLAYER_API_TOKEN: config.token,
  VITE_NOTARY_URL: config.notaryUrl,
  VITE_WS_PROXY_URL: config.wsProxyUrl,
  VITE_GAS_LIMIT: config.gasLimit,
});

console.log("🎉 Deployment completed successfully!");
console.log(`📝 Prover address: ${prover}`);
console.log(`🔍 Verifier address: ${verifier}`);
