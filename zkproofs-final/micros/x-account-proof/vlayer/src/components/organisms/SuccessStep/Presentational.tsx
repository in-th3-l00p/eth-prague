import { Link } from "react-router";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export const SuccessStepPresentational = () => {
  return (
    <div className="w-full max-w-md mx-auto text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
        <CheckCircleIcon className="w-10 h-10 text-white" />
      </div>

      {/* Success Message */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Verification Complete!
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Your X account has been successfully verified. You can now access creator features and start building your community.
        </p>
      </div>

      {/* Success Stats */}
      <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center justify-center space-x-2 text-green-700">
          <CheckCircleIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Account ownership verified</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-green-700 mt-2">
          <CheckCircleIcon className="w-5 h-5" />
          <span className="text-sm font-medium">NFT ready to mint</span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <Link to="http://localhost:3000/creator" id="nextButton" className="w-full">
          Continue to Creator Dashboard
        </Link>
      </div>

      {/* Additional Note */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700 text-center">
          🎉 You can now launch tokens and engage with your community!
        </p>
      </div>
    </div>
  );
};
