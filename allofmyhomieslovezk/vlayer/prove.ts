import { createVlayerClient } from "@vlayer/sdk";
import proverSpec from "../out/WebProofProver.sol/WebProofProver";
import verifierSpec from "../out/WebProofVerifier.sol/WebProofVerifier";
import web_proof from "../testdata/web_proof.json";
import web_proof_invalid_signature from "../testdata/web_proof_invalid_notary_pub_key.json";
import * as assert from "assert";
import { encodePacked, keccak256 } from "viem";

import {
  getConfig,
  createContext,
  deployVlayerContracts,
  writeEnvVariables,
} from "@vlayer/sdk/config";

let config = getConfig();
const _usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const _uniswapRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const _uniswapFactory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const _treasury = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

// the deployVlayerContracts puts the first arg of the constructor the address
const { prover, verifier } = await deployVlayerContracts({
  proverSpec,
  verifierSpec,
  verifierArgs: [_usdc, _uniswapRouter, _uniswapFactory, _treasury],
});

await writeEnvVariables(".env", {
  VITE_PROVER_ADDRESS: prover,
  VITE_VERIFIER_ADDRESS: verifier,
});

config = getConfig();
const { chain, ethClient, account, proverUrl, confirmations } =
  createContext(config);

if (!account) {
  throw new Error(
    "No account found make sure EXAMPLES_TEST_PRIVATE_KEY is set in your environment variables",
  );
}

const twitterUserAddress = account.address;
const vlayer = createVlayerClient({
  url: proverUrl,
  token: config.token,
});

await testSuccessProvingAndVerification({
  chain,
  ethClient,
  account,
  confirmations,
});

await testFailedProving({ chain });

async function testSuccessProvingAndVerification({
  chain,
  ethClient,
  account,
  confirmations,
}: Required<
  Pick<
    ReturnType<typeof createContext>,
    "chain" | "ethClient" | "account" | "confirmations"
  >
>) {
  console.log("Proving...");

  const hash = await vlayer.prove({
    address: prover,
    functionName: "main",
    proverAbi: proverSpec.abi,
    args: [
      {
        webProofJson: JSON.stringify(web_proof),
      },
      twitterUserAddress,
    ],
    chainId: chain.id,
    gasLimit: config.gasLimit,
  });
  const result = await vlayer.waitForProvingResult({ hash });
  const [proof, twitterHandle, address] = result;

  console.log("Verifying...");

  // Workaround for viem estimating gas with `latest` block causing future block assumptions to fail on slower chains like mainnet/sepolia
  const gas = await ethClient.estimateContractGas({
    address: verifier,
    abi: verifierSpec.abi,
    functionName: "verify",
    args: [proof, twitterHandle, address],
    account,
    blockTag: "pending",
  });

  const txHash = await ethClient.writeContract({
    address: verifier,
    abi: verifierSpec.abi,
    functionName: "verify",
    args: [proof, twitterHandle, address],
    chain,
    account,
    gas,
  });

  await ethClient.waitForTransactionReceipt({
    hash: txHash,
    confirmations,
    retryCount: 60,
    retryDelay: 1000,
  });

  console.log("Verified!");

  const balance = await ethClient.readContract({
    address: verifier,
    abi: verifierSpec.abi,
    functionName: "balanceOf",
    args: [twitterUserAddress],
  });

  assert.strictEqual(balance, 1n);

  const tokenOwnerAddress = await ethClient.readContract({
    address: verifier,
    abi: verifierSpec.abi,
    functionName: "ownerOf",
    args: [generateTokenId(twitterHandle)],
  });

  assert.strictEqual(twitterUserAddress, tokenOwnerAddress);

  const tokenURI = await ethClient.readContract({
    address: verifier,
    abi: verifierSpec.abi,
    functionName: "tokenURI",
    args: [generateTokenId(twitterHandle)],
  });

  assert.strictEqual(
    tokenURI,
    `https://faucet.vlayer.xyz/api/xBadgeMeta?handle=${twitterHandle}`,
  );
}

async function testFailedProving({
  chain,
}: Pick<ReturnType<typeof createContext>, "chain">) {
  try {
    const hash = await vlayer.prove({
      address: prover,
      functionName: "main",
      proverAbi: proverSpec.abi,
      args: [
        {
          webProofJson: JSON.stringify(web_proof_invalid_signature),
        },
        twitterUserAddress,
      ],
      chainId: chain.id,
      gasLimit: config.gasLimit,
    });
    await vlayer.waitForProvingResult({ hash });
    throw new Error("Proving should have failed!");
  } catch (error) {
    assert.ok(
      error instanceof Error,
      `Invalid error returned: ${error as string}`,
    );
    assert.equal(
      error.message,
      'Preflight failed with error: Preflight: Transaction reverted: ContractError(Revert(Revert("Invalid notary public key")))',
      `Error with wrong message returned: ${error.message}`,
    );
    console.log("✅ Done");
  }
}

function generateTokenId(username: string): bigint {
  return BigInt(keccak256(encodePacked(["string"], [username])));
}
