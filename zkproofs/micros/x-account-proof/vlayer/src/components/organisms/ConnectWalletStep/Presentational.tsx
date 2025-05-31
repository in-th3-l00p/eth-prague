import { WalletIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { isMobile } from "../../../utils";

export const ConnectWalletStepPresentational = ({
  isWalletConnected,
  next,
  connectWallet,
}: {
  isWalletConnected: boolean;
  next: () => void;
  connectWallet: () => void;
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
              <WalletIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {isWalletConnected ? "Wallet Connected" : "Connect Your Wallet"}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {isWalletConnected 
                ? "Great! Your wallet is connected. You can now proceed with the verification process." 
                : "Connect your Ethereum wallet to continue with the account verification process."}
            </p>
          </div>

          {/* Features List */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0" />
              Secure wallet connection
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0" />
              No private key exposure
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0" />
              NFT will be minted to your address
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            {isWalletConnected ? (
              <button
                onClick={next}
                id="nextButton"
                data-testid="next-button"
                className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <ArrowRightIcon className="w-5 h-5 mr-2" />
                Start Proving
              </button>
            ) : (
              <button
                onClick={connectWallet}
                id="nextButton"
                data-testid="connect-wallet-button"
                className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <WalletIcon className="w-5 h-5 mr-2" />
                Connect Wallet
              </button>
            )}
          </div>

          {/* Security Note */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 text-center">
              🔒 Your wallet connection is secure and handled by your browser extension
            </p>
          </div>
        </>
      )}
    </div>
  );
};
