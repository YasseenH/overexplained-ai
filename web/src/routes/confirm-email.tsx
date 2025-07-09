import { useNavigate } from "react-router-dom";

export const ConfirmPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white to-blue-100 px-4 py-10 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-8 sm:p-10 space-y-6 text-center transition-all duration-700 ease-in-out animate-fade-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-gray-900">
          Email Confirmed
        </h1>
        <p className="mt-3 text-gray-600 text-base sm:text-lg">
          Thank you for confirming your email! You’re now subscribed to the{" "}
          <span className="text-blue-500 font-semibold">Magic Conch</span>{" "}
          newsletter.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition-colors duration-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ConfirmPage;
