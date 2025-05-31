import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useBalance,
} from "wagmi";

import { useLocalStorage } from "usehooks-ts";

import webProofProofVerifier from "../../../../../out/WebProofVerifier.sol/WebProofVerifier";
import { useTwitterAccountProof } from "../../../hooks/useTwitterAccountProof";
import { ProveStepPresentational } from "./Presentational";
import { ensureBalance } from "../../../utils/ethFaucet";
import { AlreadyMintedError } from "../../../errors";

export const ProveStep = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const [disabled, setDisabled] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyingError, setVerifyingError] = useState<Error | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const [, setProverResult] = useLocalStorage("proverResult", "");

  const {
    requestWebProof,
    webProof,
    callProver,
    isPending,
    isCallProverIdle,
    result,
    error,
  } = useTwitterAccountProof();

  const { writeContract, data: txHash, error: writeError } = useWriteContract();
  const { status } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (webProof && isCallProverIdle) {
      void callProver([webProof, address]);
    }
  }, [webProof, address, callProver, isCallProverIdle]);

  useEffect(() => {
    if (result) {
      // Store the result and trigger verification
      setProverResult(JSON.stringify(result));
      void handleVerify();
    }
  }, [result]);

  const handleVerify = async () => {
    if (!result) return;
    
    setIsVerifying(true);
    
    const proofData = result as Parameters<typeof writeContract>[0]["args"];
    const writeContractArgs: Parameters<typeof writeContract>[0] = {
      address: import.meta.env.VITE_VERIFIER_ADDRESS as `0x${string}`,
      abi: webProofProofVerifier.abi,
      functionName: "verify",
      args: proofData,
    };

    try {
      await ensureBalance(address as `0x${string}`, balance?.value ?? 0n);
    } catch (error) {
      setVerifyingError(error as Error);
      return;
    }

    writeContract(writeContractArgs);
  };

  useEffect(() => {
    if (status === "success") {
      setIsVerifying(false);
      void navigate("/success");
    }
  }, [status, navigate]);

  useEffect(() => {
    if (writeError) {
      setIsVerifying(false);
      if (writeError.message.includes("User has already minted a TwitterNFT")) {
        throw new AlreadyMintedError();
      } else {
        throw new Error(writeError.message);
      }
    }
  }, [writeError]);

  useEffect(() => {
    if (verifyingError) {
      setIsVerifying(false);
      throw verifyingError;
    }
  }, [verifyingError]);

  useEffect(() => {
    modalRef.current?.showModal();
  }, []);

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return (
    <ProveStepPresentational
      requestWebProof={requestWebProof}
      isPending={isPending || isVerifying}
      disabled={disabled}
      setDisabled={setDisabled}
    />
  );
};
