import { ChangeEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/constants";
import { TOPICS, TOPIC_LABELS, TopicKey } from "../../../shared/topics.ts";
import "./glitch.css";

interface SignupResponsePayload {
  message: string;
}

export const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [preferences, setPreferences] = useState<TopicKey[]>([]);

  const onEmailChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setEmail(target.value);
    setErrorMessage("");
  };

  const friendlyErrorMessages: Record<string, string> = {
    "ERR-001": "Email is required.",
    "ERR-002": "Invalid email format.",
  };

  const toggle = (key: TopicKey) =>
    setPreferences((p) =>
      p.includes(key) ? p.filter((x) => x !== key) : [...p, key]
    );

  const onSignupClick = async () => {
    if (!email) {
      setErrorMessage("Email is required.");
      return;
    }
    if (preferences.length === 0) {
      setErrorMessage("Please choose at least one topic.");
      return;
    }

    console.log("Signing up with email:", email);

    try {
      const response = await fetch(`${API_URL}/newsletter/signup`, {
        method: "POST",
        body: JSON.stringify({ email, topics: preferences }),
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
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-pink-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-2/3 left-3/4 w-80 h-80 bg-blue-300 opacity-20 rounded-full blur-3xl animate-ping"></div>
      </div>

      <div className="w-full max-w-xl bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 sm:p-10 space-y-4 text-center animate-fade-in transition-all duration-700 ease-in-out">
        <div className="text-center">
          <div className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-wide mb-2">
            Welcome to
          </div>

          <div className="mb-4">
            <span className="text-3d whitespace-nowrap text-4xl sm:text-5xl">
              Overexplained
            </span>
          </div>

          <p className="mb-0 text-gray-600 dark:text-gray-300 text-base sm:text-lg">
            Sign up below to get notified about our latest updates!
          </p>
        </div>

        <div className="relative text-left">
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            {preferences.length > 0
              ? `Selected (${preferences.length})`
              : "Choose your topics"}
            <span className="ml-2">▼</span>
          </button>
          {dropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-4 max-h-60 overflow-auto shadow-lg">
              {TOPICS.map((key) => (
                <label
                  key={key}
                  className="flex items-center mb-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded transition"
                >
                  <input
                    type="checkbox"
                    checked={preferences.includes(key)}
                    onChange={() => toggle(key)}
                    className="mr-2"
                  />
                  {TOPIC_LABELS[key]}
                </label>
              ))}
            </div>
          )}
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

      <div className="mt-14 max-w-2xl text-center px-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
          What our subscribers are saying:
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 text-left">
          <blockquote className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md text-gray-700 dark:text-gray-300 text-sm sm:text-base border-l-4 border-blue-400 dark:border-blue-500">
            “I love getting these updates! Super helpful and always on time.”
            <span className="mt-2 block text-xs text-gray-500 dark:text-gray-400">
              – Ali H.
            </span>
          </blockquote>
          <blockquote className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md text-gray-700 dark:text-gray-300 text-sm sm:text-base border-l-4 border-blue-400 dark:border-blue-500">
            “The newsletter is beautifully designed and actually useful.”
            <span className="mt-2 block text-xs text-gray-500 dark:text-gray-400">
              – Sid K.
            </span>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
