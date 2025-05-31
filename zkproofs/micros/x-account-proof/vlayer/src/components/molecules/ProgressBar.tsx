import { useCurrentStep } from "../../hooks/useCurentStep";
import { motion } from "motion/react";
import { CheckIcon } from "@heroicons/react/24/solid";

export const ProgressBar = () => {
  const { currentStep } = useCurrentStep();
  
  const steps = [
    { label: "Connect", index: 1 },
    { label: "Verify", index: 2 },
    { label: "Verified", index: 3 },
  ];

  const getStepStatus = (stepIndex: number) => {
    if (currentStep?.index === undefined) return "pending";
    if (currentStep.index > stepIndex) return "completed";
    if (currentStep.index === stepIndex) return "current";
    return "pending";
  };

  return (
    <div className="w-full mb-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "easeOut", duration: 0.3, delay: 0.4 }}
        className="w-full"
      >
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2" />
          <div 
            className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 -translate-y-1/2 transition-all duration-500"
            style={{ 
              width: `${((currentStep?.index || 1) - 1) / (steps.length - 1) * 100}%` 
            }}
          />

          {/* Step Items */}
          <div className="relative flex justify-between items-center">
            {steps.map((step) => {
              const status = getStepStatus(step.index);
              
              return (
                <div key={step.index} className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300 ${
                      status === "completed"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500 text-white"
                        : status === "current"
                        ? "bg-white border-purple-500 text-purple-600"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {status === "completed" ? (
                      <CheckIcon className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-medium">{step.index}</span>
                    )}
                  </div>

                  {/* Step Label */}
                  <p
                    className={`text-xs transition-colors duration-300 ${
                      status === "current" || status === "completed"
                        ? "text-gray-700 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
