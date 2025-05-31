import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCurrentStep } from "../../hooks/useCurentStep";
import { STEP_KIND } from "../../utils/steps";
import { ProgressBar } from "../molecules/ProgressBar";
import { Navigation } from "./Navigation";
import { ErrorBoundary } from "react-error-boundary";
import { StepErrorBoundaryComponent } from "./ErrorBoundary";

export const modalContext = createContext({
  showModal: () => {},
  closeModal: () => {},
});

export const Modal = ({ children }: { children: React.ReactNode }) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const showModal = useCallback(() => {
    modalRef.current?.showModal();
  }, [modalRef]);

  const closeModal = useCallback(() => {
    modalRef.current?.close();
  }, [modalRef]);

  useEffect(() => {
    showModal();
  }, [showModal]);
  const { currentStep } = useCurrentStep();
  const [isWelcome, setIsWelcome] = useState(false);
  const [isSuccessStep, setIsSuccessStep] = useState(false);
  useEffect(() => {
    setIsWelcome(currentStep?.kind === STEP_KIND.WELCOME);
    setIsSuccessStep(currentStep?.kind === STEP_KIND.SUCCESS);
  }, [currentStep?.kind]);

  const [descClass, setDescClass] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {
    setDescClass("out");

    setTimeout(() => {
      setDescClass("in");
      setDescription(currentStep?.description || "");
    }, 300);
  }, [currentStep?.description]);

  return (
    <dialog className="modal backdrop-blur-sm bg-black/20" ref={modalRef}>
      <div className="modal-box bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-2xl shadow-2xl border-0 max-w-2xl w-full mx-4">
        <motion.div
          className="min-h-[600px] flex flex-col items-center justify-between p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        >
          {/* Navigation */}
          <div className="w-full">
            <Navigation />
          </div>
          
          {/* Progress Bar */}
          <AnimatePresence>
            {!isWelcome && !isSuccessStep && (
              <div className="w-full mb-6">
                <ProgressBar />
              </div>
            )}
          </AnimatePresence>
          
          <ErrorBoundary FallbackComponent={StepErrorBoundaryComponent}>
            <div className="flex-col flex gap-6 justify-between flex-1 w-full max-w-md">
              {/* Content */}
              <div className="flex-1 flex items-center justify-center w-full">
                <modalContext.Provider value={{ showModal, closeModal }}>
                  {children}
                </modalContext.Provider>
              </div>
            </div>
          </ErrorBoundary>
        </motion.div>
      </div>
    </dialog>
  );
};
