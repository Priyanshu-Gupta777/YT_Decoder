import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const { email } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validatePassword = (password) => {
    if (password.length <= 5) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { newPassword, confirmPassword } = formData;

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      const resetToken = localStorage.getItem("resetToken");
      if (!resetToken) {
        //setError("Reset token is missing. Please verify OTP again.");
        toast("Reset token is missing. Please verify OTP again.", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        return;
      }
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/change-password/${email}`,
        {
          newPassword,
          confirmPassword,
        },
        { headers: { Authorization: `Bearer ${resetToken}` } }
      );
      setIsSuccess(res.data.message);
      toast(res.data.message, {
        icon: "✔",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      localStorage.removeItem("isChangePassword");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please try again.");
      toast(err.response.data.message, {
        icon: "❌",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      //console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setIsSuccess(false);
    setFormData({ newPassword: "", confirmPassword: "" });
    setError("");
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gradient-to-r from-rose-50 to-neutral-700 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center mr-4 ml-4">
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
                Password Changed!
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Your password has been successfully updated. You can now sign in
                with your new password.
              </p>
              <button
                onClick={() => {
                  console.log("Navigate to login");
                }}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out mb-3"
              >
                Sign In
              </button>
              <button
                onClick={handleBackToLogin}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Back to start
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
          <h2 className="mt-6 text-3xl font-bold text-cyan-600">
            Change your password
          </h2>
          <p className="mt-2 text-sm text-cyan-400">
            Enter your new password below to update your account.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md mx-4">
        <div className="bg-gradient-to-r from-rose-50 to-neutral-700 py-8 px-4 shadow rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPasswords.newPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility("newPassword")}
                >
                  {showPasswords.newPassword ? (
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      ></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                >
                  {showPasswords.confirmPassword ? (
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      ></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {formData.newPassword && (
              <div className="text-xs text-gray-600 space-y-1">
                <p className="font-medium">Password requirements:</p>
                <ul className="space-y-1">
                  <li
                    className={`flex items-center ${
                      formData.newPassword.length >= 8
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <span className="mr-2">
                      {formData.newPassword.length >= 8 ? "✓" : "○"}
                    </span>
                    At least 8 characters
                  </li>
                  <li
                    className={`flex items-center ${
                      /(?=.*[a-z])/.test(formData.newPassword)
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <span className="mr-2">
                      {/(?=.*[a-z])/.test(formData.newPassword) ? "✓" : "○"}
                    </span>
                    One lowercase letter
                  </li>
                  <li
                    className={`flex items-center ${
                      /(?=.*[A-Z])/.test(formData.newPassword)
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <span className="mr-2">
                      {/(?=.*[A-Z])/.test(formData.newPassword) ? "✓" : "○"}
                    </span>
                    One uppercase letter
                  </li>
                  <li
                    className={`flex items-center ${
                      /(?=.*\d)/.test(formData.newPassword)
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <span className="mr-2">
                      {/(?=.*\d)/.test(formData.newPassword) ? "✓" : "○"}
                    </span>
                    One number
                  </li>
                </ul>
              </div>
            )}

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
                    Updating Password...
                  </div>
                ) : (
                  "Update Password"
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
                className="text-sm hover:text-gray-700 font-medium"
              >
                Back to LogIn
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
