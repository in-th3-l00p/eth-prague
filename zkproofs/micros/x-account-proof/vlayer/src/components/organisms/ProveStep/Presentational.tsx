import { CogIcon, PlayIcon } from "@heroicons/react/24/outline";
import { isMobile } from "../../../utils";

export const ProveStepPresentational = ({
  requestWebProof,
  isPending,
  disabled,
  setDisabled,
}: {
  requestWebProof: () => void;
  isPending: boolean;
  disabled: boolean;
  setDisabled: (disabled: boolean) => void;
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      {isMobile && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium text-center">
            Mobile is not supported. <br /> 
            Please use a desktop browser for the best experience.
          </p>
        </div>
      )}
      
      {!isMobile && (
        <>
          {/* Content */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              {isPending ? (
                <CogIcon className="w-8 h-8 text-white animate-spin" />
              ) : (
                <PlayIcon className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {isPending ? "Generating Proof..." : "Generate X Account Proof"}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {isPending 
                ? "Please wait while we generate your zero-knowledge proof. This process may take a few moments." 
                : "Click the button below to open the vLayer extension and generate your account ownership proof."}
            </p>
          </div>

          {/* Features List */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0" />
              Zero-knowledge proof generation
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0" />
              Privacy-preserving verification
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0" />
              Cryptographic account proof
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0" />
              Secure and transparent
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              disabled={disabled || isPending}
              id="nextButton"
              onClick={() => {
                requestWebProof();
                setDisabled(true);
              }}
              className={`inline-flex items-center justify-center w-full px-6 py-3 text-base font-semibold text-white rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                disabled || isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl transform hover:scale-[1.02]"
              }`}
            >
              {isPending ? (
                <>
                  <CogIcon className="w-5 h-5 mr-2 animate-spin" />
                  Proving in progress...
                </>
              ) : (
                <>
                  <PlayIcon className="w-5 h-5 mr-2" />
                  Open Extension
                </>
              )}
            </button>
          </div>

          {/* Process Note */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 text-center">
              🔐 The proof generation happens locally in your browser for maximum security
            </p>
          </div>

          {isPending && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-700 text-center">
                ⏳ Please keep this tab open while the proof is being generated
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
