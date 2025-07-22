import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../utils/constants";

export const ConfirmEmailPage = () => {
  const navigate = useNavigate();
  const [hasConfirmed, setHasConfirmed] = useState<boolean | null>(null);
  const location = useLocation();
  const params = location.search;

  useEffect(() => {
    const parsedParams = new URLSearchParams(params);
    const email = parsedParams.get("email");
    const token = parsedParams.get("token");

    if (!email || !token) return;
    console.log("Confirming email with:", `${API_URL}/newsletter/confirm-email`);

    (async () => {
      try {
        const response = await fetch(`${API_URL}/newsletter/confirm-email`, {
          method: "POST",
          body: JSON.stringify({ email, token }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        setHasConfirmed(response.status === 200);
      } catch (error) {
        console.error("Error confirming email:", error);
        setHasConfirmed(false);
      }
    })();
  }, [params]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-10 flex flex-col items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 sm:p-10 space-y-6 text-center animate-fade-in transition-all duration-700 ease-in-out">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Email Confirmation
        </h1>
        {hasConfirmed === null ? (
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
            Confirming your email...
          </p>
        ) : hasConfirmed ? (
          <p className="text-green-600 dark:text-green-400 text-base sm:text-lg">
            Your email has been successfully confirmed!
          </p>
        ) : (
          <p className="text-red-600 dark:text-red-400 text-base sm:text-lg">
            There was an error confirming your email. Please try again later.
          </p>
        )}

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

export default ConfirmEmailPage;
