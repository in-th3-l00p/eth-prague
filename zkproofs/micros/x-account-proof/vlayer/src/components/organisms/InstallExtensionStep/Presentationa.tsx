import { PuzzlePieceIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { isMobile, vlayerPovingExtensionId } from "../../../utils";

export const InstallExtensionPresentational = () => {
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
              <PuzzlePieceIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Install vLayer Extension
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Install the vLayer browser extension to generate zero-knowledge proofs. 
              This extension enables secure verification of your social media account.
            </p>
          </div>

          {/* Features List */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0" />
              Secure proof generation
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0" />
              Privacy-preserving technology
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0" />
              Official vLayer extension
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0" />
              Free to use
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              id="nextButton"
              onClick={() => {
                window.open(
                  `https://chromewebstore.google.com/detail/vlayer/${vlayerPovingExtensionId}/reviews`,
                  "_blank",
                );
              }}
              className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              Install Extension
            </button>
          </div>

          {/* Installation Note */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 text-center">
              🔧 After installation, refresh this page to continue with verification
            </p>
          </div>
        </>
      )}
    </div>
  );
};
