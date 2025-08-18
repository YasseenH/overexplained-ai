import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { API_URL } from "../utils/constants";

export const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const email = searchParams.get("email");
    if (!email) {
      setStatus("error");
      setMessage("Invalid unsubscribe link. Please contact support.");
      return;
    }

    // Call the unsubscribe API
    const unsubscribeUser = async () => {
      try {
        const response = await fetch(`${API_URL}/newsletter/unsubscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          setStatus("success");
          setMessage(
            "You have been successfully unsubscribed from our newsletter."
          );
        } else {
          const errorData = await response.json();
          setStatus("error");
          setMessage(
            errorData.message || "Failed to unsubscribe. Please try again."
          );
        }
      } catch (error) {
        console.error("Error unsubscribing:", error);
        setStatus("error");
        setMessage("An error occurred while unsubscribing. Please try again.");
      }
    };

    unsubscribeUser();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-10 flex flex-col items-center justify-center transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Unsubscribe
          </h1>
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            We're sorry to see you go
          </p>
        </div>

        {status === "loading" && (
          <div className="py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4 font-medium">
              Processing...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="py-4">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6 font-medium">
              {message}
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-lg"
            >
              Return to Home
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="py-4">
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6 font-medium">
              {message}
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-lg"
            >
              Return to Home
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Changed your mind? You can always{" "}
            <a href="/" className="text-blue-600 hover:text-blue-700 font-bold">
              resubscribe
            </a>{" "}
            anytime.
          </p>
        </div>
      </div>
    </div>
  );
};
