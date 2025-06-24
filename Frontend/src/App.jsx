import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import Login from './pages/Login.jsx';
import { useDispatch, useSelector } from 'react-redux';
import Signup from './pages/Signup.jsx'
import { authActions } from '../store/auth.js';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();

  const ProtectedRoute = ({ children }) => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    return isLoggedIn ? children : <Navigate to="/login" />;
  };
  


  useEffect(() => {
    if (
      localStorage.getItem("id") &&
      localStorage.getItem("token") 
    ) { dispatch(authActions.login());
        
    }
    
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingPage/>
            } 
          />
          <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
          <Route 
            path="/login"
            element={<Login/>} />
          <Route 
            path="/signup"
            element={<Signup/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;