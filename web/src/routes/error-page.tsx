import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  let message = "Something went wrong.";
  if (isRouteErrorResponse(error)) {
    message = error.statusText || error.data || message;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 via-white to-red-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-10 flex flex-col items-center justify-center transition-colors duration-300">
      {/* Error Card */}
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 sm:p-10 space-y-6 text-center animate-fade-in transition-all duration-700 ease-in-out">
        <h1 className="text-4xl sm:text-5xl font-bold text-red-600 dark:text-red-400">
          Oops!
        </h1>
        <p className="text-gray-700 dark:text-gray-200 text-lg sm:text-xl font-medium">
          Sorry, an unexpected error has occurred.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 italic font-medium">
          {message}
        </p>
        <a
          href="/"
          className="inline-block mt-4 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 text-lg"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
