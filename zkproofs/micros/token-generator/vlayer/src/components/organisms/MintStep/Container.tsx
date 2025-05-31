import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useLocalStorage } from "usehooks-ts";
import { MintStepPresentational } from "./Presentational";

export const MintStep = () => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDialogElement>(null);
  const [proverResult] = useLocalStorage("proverResult", "");
  const [resultData, setResultData] = useState<{ number: number; } | null>(null);
  const screenName = window.location.search.split("screenName=")[0].split("=")[1];

  useEffect(() => {
    if (proverResult) {
      try {
        setResultData(JSON.parse(proverResult));
      } catch (error) {
        console.error("Failed to parse prover result:", error);
      }
    }
    modalRef.current?.showModal();
  }, [proverResult]);

  const handleContinue = () => {
    void navigate(`/success?screenName=${screenName}`);
  };

  return (
    <MintStepPresentational
      resultData={resultData}
      onContinue={handleContinue}
    />
  );
};
