import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const ConfirmPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = (location.state as { email?: string })?.email;

  // redirect to home if no email is found in state
  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-10 flex flex-col items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 sm:p-10 space-y-6 text-center animate-fade-in transition-all duration-700 ease-in-out">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
          Email Confirmed
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300 text-base sm:text-lg font-medium">
          Thank you! Please check <strong>{email}</strong> for your confirmation
          email.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-lg"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ConfirmPage;
