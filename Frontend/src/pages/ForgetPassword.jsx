import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const allowedDomains = [
      "gmail.com",
      "outlook.com",
      "yahoo.com",
      "hotmail.com",
      "icloud.com",
      "microsoft.com",
    ];
    const emailParts = email.split("@");
    if (emailParts.length !== 2) return false;
    const domain = emailParts[1].toLowerCase();
    return allowedDomains.includes(domain);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/forget-password`,
        {
          email,
        }
      );

      if (res.data.success) {
        setIsSubmitted(true);
        localStorage.setItem("isVerifyOtp", "true");
        setTimeout(() => {
          navigate(`/verifyotp/${email}`);
        }, 2000);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      toast("Something went wrong. Please try again.", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      //console.log(err)
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setIsSubmitted(false);
    setEmail("");
    setError("");
    navigate("/login");
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 mr-4 ml-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gradient-to-r from-rose-50 to-neutral-700 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Check your email
              </h2>
              <p className="text-sm text-gray-800 mb-6">
                We've sent a password reset link to{" "}
                <span className="font-medium">{email}</span>
              </p>
              <p className="text-xs text-gray-800 mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>

              <button
                onClick={handleBackToLogin}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-stone-600 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                Back to login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mx-4">
          <h2 className="mt-6 text-3xl font-bold text-cyan-500">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-cyan-300 ">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md mx-4">
        <div className="bg-gradient-to-r from-rose-50 to-neutral-700 py-8 px-4 shadow rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-stone-600 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </div>
                ) : (
                  "Send reset link"
                )}
              </button>
            </div>

            <div className="text-center">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                className="text-sm  hover:text-blue-500 font-medium"
              >
                Back to login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
