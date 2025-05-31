import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useTwitterAccountProof } from "../../../hooks/useTwitterAccountProof";
import { ProveStepPresentational } from "./Presentational";
import { useAccount } from "wagmi";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

export const ProveStep = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const [disabled, setDisabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  const {
    requestWebProof,
    webProof,
    callProver,
    isPending,
    isCallProverIdle,
    result,
    error,
  } = useTwitterAccountProof();

  useEffect(() => {
    if (webProof && isCallProverIdle) {
      void callProver([webProof, address]);
    }
  }, [webProof, address, callProver, isCallProverIdle]);

  useEffect(() => {
    const saveProofToDatabase = async () => {
      if (result && address && !isSaving) {
        setIsSaving(true);
        
        try {
          const screenName = Array.isArray(result) && result.length > 1 ? result[1] : 
                            (result as any)?.screenName || (result as any)?.screen_name;
          
          if (!screenName || typeof screenName !== 'string') {
            console.error('No valid screen name found in result:', result);
            setIsSaving(false);
            return;
          }

          // Save to Supabase
          const { data, error: dbError } = await supabase
            .from('account_proofs')
            .upsert({
              wallet: address.toLowerCase(),
              screen_name: screenName
            })
            .select();

          if (dbError) {
            console.error('Error saving to database:', dbError);
            throw dbError;
          }

          console.log('Proof saved successfully:', data);
          
          navigate("/success");
        } catch (error) {
          console.error('Failed to save proof:', error);
          setIsSaving(false);
        }
      }
    };

    if (result) {
      void saveProofToDatabase();
    }
  }, [result, address, navigate, isSaving]);

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
      isPending={isPending || isSaving}
      disabled={disabled}
      setDisabled={setDisabled}
    />
  );
};
