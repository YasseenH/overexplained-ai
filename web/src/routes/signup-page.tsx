import { ChangeEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/constants";

interface SignupResponsePayload {
  message: string;
}

export const SignupPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const onEmailChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setEmail(target.value);
    setErrorMessage("");
  };

  const friendlyErrorMessages: Record<string, string> = {
    "ERR-001": "Email is required.",
    "ERR-002": "Invalid email format.",
  };

  const onSignupClick = async () => {
    if (!email) {
      setErrorMessage("Email is required.");
      return;
    }

    console.log("Signing up with email:", email);

    try {
      const response = await fetch(`${API_URL}/newsletter/signup`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      let payload: SignupResponsePayload | null = null;

      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        payload = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        return setErrorMessage("Something went wrong on the server.");
      }

      if (!response.ok) {
        if (payload?.message) {
          console.log("Signup error payload:", payload);
          const code = payload.message.split(":")[0];
          const msg = friendlyErrorMessages[code] || "Something went wrong.";
          return setErrorMessage(msg);
        }
        return setErrorMessage("Something went wrong.");
      }

      return navigate("/confirm-email-sent", { state: { email } });
    } catch (error: unknown) {
      console.error(error);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-10 flex flex-col items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 sm:p-10 space-y-6 text-center animate-fade-in transition-all duration-700 ease-in-out">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
            Welcome to the{" "}
            <span className="text-blue-500 whitespace-nowrap">Magic Conch</span>
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300 text-base sm:text-lg">
            Sign up below to get notified about our latest updates!
          </p>
        </div>

        <div className="text-left">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={onEmailChange}
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errorMessage && (
            <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
          )}
        </div>

        <button
          onClick={onSignupClick}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition-colors duration-300"
        >
          Sign Up
        </button>
      </div>

      <div className="mt-12 max-w-2xl text-center px-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
          What our subscribers are saying:
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 text-left">
          <blockquote className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-gray-700 dark:text-gray-300 text-sm sm:text-base">
            “I love getting these updates! Super helpful and always on time.”
            <br />
            <span className="mt-2 block text-xs text-gray-500 dark:text-gray-400">– Ali H.</span>
          </blockquote>
          <blockquote className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-gray-700 dark:text-gray-300 text-sm sm:text-base">
            “The newsletter is beautifully designed and actually useful.”
            <br />
            <span className="mt-2 block text-xs text-gray-500 dark:text-gray-400">– Sid K.</span>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
