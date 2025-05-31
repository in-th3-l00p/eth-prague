import { Link } from "react-router";

export const SuccessStepPresentational = () => {
  return (
    <>
      <p className="text-gray-500">
        Your account has been verified.
      </p>
      <div className="mt-2 flex justify-center">
        <Link to="http://localhost:3000/creator" id="nextButton">
          Go to home
        </Link>
      </div>
    </>
  );
};
