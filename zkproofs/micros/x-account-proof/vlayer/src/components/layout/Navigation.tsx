import * as React from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useCurrentStep } from "../../hooks/useCurentStep";
import { useNavigate } from "react-router";

export const Navigation: React.FC = () => {
  const { currentStep } = useCurrentStep();
  const navigate = useNavigate();
  return (
    <nav
      className="flex gap-10 justify-between w-full mb-4"
      style={{ opacity: currentStep?.backUrl ? 1 : 0 }}
    >
      <BackButton
        back={() => {
          if (currentStep?.backUrl) {
            void navigate(currentStep.backUrl);
          }
        }}
      />
      <div className="flex-1" />
    </nav>
  );
};

export const BackButton: React.FC<{ back: () => void }> = ({ back }) => {
  return (
    <button
      onClick={back}
      className="flex gap-2 items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
    >
      <ChevronLeftIcon className="w-4 h-4" />
      <span>Back</span>
    </button>
  );
};
