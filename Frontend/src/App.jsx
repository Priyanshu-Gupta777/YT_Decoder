import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./components/LandingPage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import { useDispatch, useSelector } from "react-redux";
import Signup from "./pages/Signup.jsx";
import { authActions } from "./store/auth.js";
import VerifyEmail from "./pages/verifyEmail.jsx";
import Verify from "./pages/Verify.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import VerifyOTP from "./pages/VerifyOTP.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";

function App() {
  const dispatch = useDispatch();

  const ProtectedRoute = ({ children }) => {
    const user = useSelector((state) => state.auth.user);
    return user ? children : <Navigate to="/login" />;
  };

  const ProtectOtpRoute = ({ children }) => {
    const isVerifyOtp = localStorage.getItem("isVerifyOtp") === "true";

    return isVerifyOtp ? children : <Navigate to="/forget-password" />;
  };

  const ProtectChangePasswordRoute = ({ children }) => {
    const isChangePassword =
      localStorage.getItem("isChangePassword") === "true";

    return isChangePassword ? children : <Navigate to="/forget-password" />;
  };

  useEffect(() => {
    if (localStorage.getItem("id") && localStorage.getItem("token")) {
      dispatch(authActions.login());
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/VerifyEmail" element={<VerifyEmail />} />
          <Route path="/verify/:token" element={<Verify />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route
            path="/verifyotp/:email"
            element={
              <ProtectOtpRoute>
                <VerifyOTP />
              </ProtectOtpRoute>
            }
          />
          <Route
            path="/changepassword/:email"
            element={
              <ProtectChangePasswordRoute>
                <ChangePassword />
              </ProtectChangePasswordRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
