import { ChangeEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/constants";
import {
  TOPICS,
  TOPIC_LABELS,
  TopicKey,
} from "../../../server/src/utils/topics.ts";
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

      <div className="w-full max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-wide mb-4">
            Start Your Day Smarter
          </div>
          <div className="mb-6">
            <span className="text-3d whitespace-nowrap text-4xl sm:text-5xl">
              Overexplained
            </span>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-medium">
            Get AI-powered newsletters delivered daily. Learn something new
            every morning with engaging content tailored to your interests.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Signup Form */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 sm:p-10 space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Join Our Community
              </h2>
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                It only takes 30 seconds to get started
              </p>
            </div>

            <div className="space-y-5">
              {/* Topics Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  What interests you? *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((o) => !o)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 bg-white dark:bg-gray-700 font-medium"
                  >
                    {preferences.length > 0
                      ? `${preferences.length} topic${
                          preferences.length > 1 ? "s" : ""
                        } selected`
                      : "Choose your topics"}
                    <span className="ml-2 text-gray-400">▼</span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 max-h-60 overflow-auto shadow-lg">
                      {TOPICS.map((key) => (
                        <label
                          key={key}
                          className="flex items-center mb-3 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md transition-colors duration-200 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={preferences.includes(key)}
                            onChange={() => toggle(key)}
                            className="mr-3 w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {TOPIC_LABELS[key]}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
                >
                  Your email address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={onEmailChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200 font-medium"
                />
                {errorMessage && (
                  <p className="text-sm text-red-500 mt-2 flex items-center font-medium">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errorMessage}
                  </p>
                )}
              </div>

              {/* Signup Button */}
              <button
                onClick={onSignupClick}
                disabled={!email || preferences.length === 0}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-lg"
              >
                {preferences.length > 0 && email
                  ? "Get My Daily Newsletters"
                  : "Choose topics and enter email"}
              </button>

              {/* Trust Indicators */}
              <div className="text-center pt-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4 text-green-500"
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
                    <span className="font-medium">No spam, ever</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4 text-green-500"
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
                    <span className="font-medium">Unsubscribe anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                What You'll Get
              </h3>
              <div className="space-y-5">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                      Daily Delivery
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                      Fresh newsletters every morning at 9 AM UTC, perfect with
                      your coffee
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-purple-600 dark:text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                      AI-Generated Content
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                      Engaging, informative content written by advanced AI
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                      Personalized Topics
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                      Choose what interests you and we'll cycle through topics
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 text-center">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                <span className="font-bold">Join thousands</span> of curious
                minds who start their day with AI-powered insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
