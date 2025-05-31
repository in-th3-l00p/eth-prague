export const MintStepPresentational = ({
  resultData,
  onContinue,
}: {
  resultData: {
    followersCount: number;
  } | null;
  onContinue: () => void;
}) => {
  return (
    <>
      <div className="mt-7 flex justify-center flex-col items-center space-y-4">
        {resultData ? (
          <div className="bg-gray-50 p-6 rounded-lg border space-y-3 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 text-center">
              Proof Data
            </h3>
            <div className="space-y-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">Followers Count:</span>
                <span className="text-gray-800">{resultData.followersCount}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">Loading data...</div>
        )}
        
        <button 
          id="nextButton" 
          onClick={onContinue}
          disabled={!resultData}
          className={`${!resultData ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Continue
        </button>
      </div>
    </>
  );
};
