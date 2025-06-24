import React from "react";


const Header = () => {

    return (
        <nav className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Play className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">CommentIQ</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={onLogin}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Login
              </button>
              <button
                onClick={onSignup}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all transform hover:scale-105"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>
    )
}

export default Header;