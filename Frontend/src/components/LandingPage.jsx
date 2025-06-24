import React from 'react';
import { BarChart3, MessageCircle, TrendingUp, Zap, Play, Users, Youtube, Brain,  } from 'lucide-react';
import {useNavigate} from 'react-router-dom'
import { Link } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { authActions } from '../../store/auth';

const LandingPage = () => {
  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Sentiment Detection",
      description: "AI-powered analysis of comment emotions and reactions"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Top Viewer Comments",
      description: "Identify the most engaging and influential comments"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Visual Analytics",
      description: "Beautiful charts and graphs to understand your audience"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI Suggestions",
      description: "Get insights and recommendations for better engagement"
    }
  ];
  
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const handleClick = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const onLogin = () => {
    navigate('/login');
  }
  
  const onSignup = () => {
    navigate('/signup');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Play className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">YT_Decoder</span>
            </div>
            <div className="flex space-x-4">
            {isLoggedIn === false? (<Link to = "/login"><button
                onClick={onLogin}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Login
              </button></Link>) : <></>}
              
              {isLoggedIn === false? (<Link to = "/signup"><button
                onClick={onSignup}
                className="px-4 py-2 text-gray-300 hover:text-white  transition-colors rounded-lg bg-gradient-to-r from-blue-400 to-purple-600"
              >
                Signup
              </button></Link>) : <></>}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              AI-Powered
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent block">
                YouTube Comment
              </span>
              Analyzer
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Unlock the power of your YouTube comments with advanced AI analysis. 
              Understand sentiment, discover insights, and engage better with your audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button
                onClick={handleClick}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-2xl"
              >
                Get Started Free
              </button>
              <button disabled={true} className="px-8 py-4 bg-gray-800  disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all border border-gray-600">
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful Features for Content Creators
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to understand and optimize your YouTube engagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300 group hover:scale-105"
              >
                <div className="text-blue-400 mb-4 group-hover:text-blue-300 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto max-w-6xl">
          <div className="text-center mt-16 mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get insights from your YouTube comments in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 m-4">
            <div className="text-center">
              <div className="bg-blue-400 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 ">
                1
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mb-4 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
                <Youtube className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Paste YouTube URL</h3>
                <p className="text-gray-300">Simply paste your YouTube video URL into our analyzer</p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-blue-400 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                2
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mb-4 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
                <Brain className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">AI Analysis</h3>
                <p className="text-gray-300">Our AI processes all comments and generates insights</p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-blue-400 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                3
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mb-4 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
                <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Get Insights</h3>
                <p className="text-gray-300">Receive detailed analytics and actionable recommendations</p>
              </div>
            </div>
          </div>
        </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Understand Your Audience?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators who are already using AI to improve their content strategy.
          </p>
          <button
            onClick={handleClick}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-2xl"
          >
            Start Analyzing Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Play className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold text-white">YT_Decoder</span>
            </div>
            <div className="text-gray-400">
              © 2025 YT_Decoder. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;