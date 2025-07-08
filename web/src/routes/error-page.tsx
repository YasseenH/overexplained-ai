import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  let message = "Something went wrong.";
  if (isRouteErrorResponse(error)) {
    message = error.statusText || error.data || message;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 via-white to-red-100 px-4 py-10 flex flex-col items-center justify-center">
      {/* Error Card */}
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-8 sm:p-10 space-y-6 text-center animate-fade-in transition-all duration-700 ease-in-out">
        <h1 className="text-4xl sm:text-5xl font-bold text-red-600">Oops!</h1>
        <p className="text-gray-700 text-lg sm:text-xl">
          Sorry, an unexpected error has occurred.
        </p>
        <p className="text-sm text-gray-500 italic">
          {message}
        </p>
        <a
          href="/"
          className="inline-block mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-colors duration-300"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;