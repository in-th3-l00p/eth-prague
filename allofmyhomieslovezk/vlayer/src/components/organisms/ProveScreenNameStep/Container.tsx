import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useTwitterAccountProof } from "../../../hooks/useTwitterAccountProof";
import { ProveFollowersPresentational } from "./Presentational";
import { useAccount } from "wagmi";
import {useTwitterFollowersProof} from "../../../hooks/useTwitterFollowersProof.ts";

export const ProveFollowersStep = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const [disabled, setDisabled] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  const {
    requestWebProof,
    webProof,
    callProver,
    isPending,
    isCallProverIdle,
    result,
    error,
  } = useTwitterFollowersProof(window.location.search.split("=")[1]);

  useEffect(() => {
    if (webProof && isCallProverIdle) {
      void callProver([webProof, address]);
    }
  }, [webProof, address, callProver, isCallProverIdle]);

  useEffect(() => {
    if (result) {
      void navigate("/success");
    }
  }, [result, navigate]);

  useEffect(() => {
    modalRef.current?.showModal();
  }, []);

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return (
    <ProveFollowersPresentational
      requestWebProof={requestWebProof}
      isPending={isPending}
      disabled={disabled}
      setDisabled={setDisabled}
    />
  );
};
