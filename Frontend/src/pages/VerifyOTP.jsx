import axios from "axios"
import { useState, useRef, useEffect } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"


const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef([]);
  const {email} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleInputChange = (index, value) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    const newOtp = [...otp]

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i]
      }
    }

    setOtp(newOtp)
    setError("")

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "")
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus()
    } else {
      inputRefs.current[5]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const finalOTP = otp.join("")

    if (finalOTP.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    if (!/^\d{6}$/.test(finalOTP)) {
      setError("OTP must contain only numbers")
      return
    }

    try {

      setIsLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/verifyotp/${email}`, {
        otp: finalOTP,
      });

       toast(res.data.message,{icon:"✅",
      style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
      }
      })

      if (res.data.message === "OTP verified successfully") {
        setIsVerified(true);
       
        localStorage.removeItem("isVerifyOtp");
        localStorage.setItem("isChangePassword", "true");
        const resetToken = res.data.resetToken;
        localStorage.setItem("resetToken", resetToken);
        setTimeout(() => {
            navigate(`/changepassword/${email}`);
        }, 2000);


      } 
      else {
        setError("Invalid OTP. Please try again.")
      }

    } 
    catch (err) {
      setError("Something went wrong. Please try again.");
      toast(err.response.data.message,{icon:"❌",
      style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
      }
      })
      //console.log(err);
    } 
    finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return

    setError("")
    setResendCooldown(30)

    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/forget-password`, {
                email
        });

    } catch (err) {
      setError("Failed to resend OTP. Please try again.")
      //console.log(err)
      setResendCooldown(0)
    }
  }

  const handleBackToForgotPassword = () => {
    setIsVerified(false)
    setOtp(["", "", "", "", "", ""])
    setError("")
    setResendCooldown(0)
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-sm sm:max-w-md">
          <div className="bg-gradient-to-r from-rose-50 to-neutral-700 py-6 px-4 shadow rounded-lg sm:py-8 sm:px-10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 mb-3 sm:mb-4">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">OTP Verified!</h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 px-2">
                Your identity has been successfully verified. You can now proceed to reset your password.
              </p>
              <button
                onClick={() => {
                  // Handle navigation to reset password page
                  console.log("Navigate to reset password")
                }}
                className="w-full flex justify-center py-2.5 sm:py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out mb-3"
              >
                Reset Password
              </button>
              <button
                onClick={handleBackToForgotPassword}
                className="w-full flex justify-center py-2.5 sm:py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Back to start
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-sm sm:max-w-md">
        <div className="text-center">
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-cyan-500">Enter verification code</h2>
          <p className="mt-2 text-sm text-cyan-300 px-2">
            We've sent a 6-digit verification code to your email address.
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 mx-auto w-full max-w-sm sm:max-w-md">
        <div className="bg-gradient-to-r from-rose-50 to-neutral-700 py-6 px-4 shadow rounded-lg sm:py-8 sm:px-10">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Verification Code</label>
              <div className="flex justify-center gap-1.5 sm:gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoComplete="off"
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 sm:p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-2 sm:ml-3">
                    <h3 className="text-xs sm:text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 sm:py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-stone-600 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                    <span className="text-sm">Verifying...</span>
                  </div>
                ) : (
                  "Verify Code"
                )}
              </button>
            </div>

            <div className="text-center space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm text-gray-600">Didn't receive the code?</p>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0}
                className="text-xs sm:text-sm hover:text-stone-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
              </button>
            </div>

            <div className="text-center pt-2">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  // Handle navigation back to forgot password
                  console.log("Navigate back to forgot password")
                }}
                className="text-xs sm:text-sm hover:text-stone-700 font-medium"
              >
                Back to forgot password
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OtpVerification;
