import React, { useState } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { LogOut, Play, Search, TrendingUp, MessageCircle, BarChart3, Calendar, Eye, Heart, MessageSquare, Video, User, Target, Lightbulb, HelpCircle, ThumbsUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authActions } from '../store/auth';
import {LogOut as LogoutIcon} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);


const Dashboard = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  
  const navigate = useNavigate();
  const dispatch= useDispatch(); 
  
  const LogOut = async(e) => {
    e.preventDefault();

    try{
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/signout`, {}, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      })

      if(res.data.success){
        dispatch(authActions.setUser(null));
        localStorage.clear('id');
        localStorage.clear('token');
        toast("Log-Out Successfully",{icon:"👌",
      style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
      }
      })
        navigate('/')
      }

    }catch(err){
      console.log(err);
    }
}

  const handleAnalyze = async () => {
    if (!videoUrl.trim() && !token) return;

    setLoading(true);
    
    // Simulate API call
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/analyze`,
        { videoUrl: videoUrl },
        { headers: { Authorization: `Bearer ${token}`} }
      );
      //console.log(response.data);
      //let data = response.data;
      
      
      setAnalysisData(response.data);
    } catch (error) {
      console.error('Error analyzing video:', error);
    } finally {
      setLoading(false);
          }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (typeof num !== 'number' || isNaN(num)) return '0';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const sentimentChartData = analysisData ? {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          analysisData?.sentimentBreakdown?.positive || 0,
          analysisData?.sentimentBreakdown?.neutral || 0,
          analysisData?.sentimentBreakdown?.negative || 0
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(156, 163, 175, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(156, 163, 175, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ffffff',
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white"><Link to="/">YT_Decoder</Link></h1>
          </div>
          <button onClick = {LogOut} className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors">
          <LogoutIcon className="w-5 h-5 text-white-600 cursor-pointer" />
            <span>Logout </span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* URL Input Section */}
        <div className="mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Search className="h-5 w-5 mr-2 text-blue-500" />
              Analyze YouTube Video
            </h2>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Enter YouTube video URL..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
              onClick={handleAnalyze}
              disabled={loading || !videoUrl.trim()}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-semibold transition-all flex items-center space-x-2 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze</span>
                </>
              )}
            </button>
            </div>
          </div>
        </div>

        {/* Video Overview */}
        <div className="mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Video className="h-6 w-6 mr-2 text-blue-500" />
              Video Overview
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-blue-400 mb-2">Video Details </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400">Title:</span>
                    <p className="text-white font-medium">
                    {analysisData?.title}&nbsp;&nbsp;&nbsp;
                      <a className="hover:underline hover:text-purple-300" href={analysisData?.videoUrl} target='_blank'><b>(Watch Video)</b></a> 
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Channel:</span>
                    <p className="text-white font-medium flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {analysisData?.channelName}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Published:</span>
                    <p className="text-white font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(analysisData?.publishedAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-blue-400 mb-2">Engagement Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <Eye className="h-5 w-5 text-green-500" />
                      <span className="text-2xl font-bold">{formatNumber(analysisData?.views)}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Views</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <ThumbsUp className="h-5 w-5 text-blue-500" />
                      <span className="text-2xl font-bold">{formatNumber(analysisData?.likes)}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Likes</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <MessageCircle className="h-5 w-5 text-purple-500" />
                      <span className="text-2xl font-bold">{analysisData?.totalComments}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Comments</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <TrendingUp className="h-5 w-5 text-yellow-500" />
                      <span className="text-2xl font-bold">{analysisData?.likeToViewRatio}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Like Ratio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-blue-500" />
              Sentiment Analysis
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex justify-center">
              {sentimentChartData && (
                  <div className="h-80">
                    <Pie data={sentimentChartData} options={chartOptions} />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-medium">Positive Comments</span>
                    <span className="text-2xl font-bold text-green-400">{analysisData?.sentimentBreakdown?.positive}</span>
                  </div>
                </div>
                <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-medium">Neutral Comments</span>
                    <span className="text-2xl font-bold text-gray-400">{analysisData?.sentimentBreakdown?.neutral}</span>
                  </div>
                </div>
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-red-400 font-medium">Negative Comments</span>
                    <span className="text-2xl font-bold text-red-400">{analysisData?.sentimentBreakdown?.negative}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Positive Comments */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-green-400">
              <ThumbsUp className="h-5 w-5 mr-2" />
              Top Positive Comments
            </h2>
            <div className="space-y-4 overflow-y-auto max-h-[300px]">
              {analysisData?.topPositiveComments.map((comment, index) => (
                <div key={index} className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <User className="h-4 w-4 mr-2 text-green-400" />
                    <span className="font-medium text-green-400">{comment.user}</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{comment.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Negative Comments */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-red-400">
              <MessageCircle className="h-5 w-5 mr-2" />
              Top Negative Comments
            </h2>
            <div className="space-y-4 overflow-y-auto max-h-[300px]">
              {analysisData?.topNegativeComments.map((comment, index) => (
                <div key={index} className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <User className="h-4 w-4 mr-2 text-red-400" />
                    <span className="font-medium text-red-400">{comment.user}</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{comment.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Target className="h-6 w-6 mr-2 text-blue-500" />
            AI Analysis
          </h2>

          {/* Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-blue-400 mb-3">Summary</h3>
            <div className="bg-gray-700/50 overflow-y-auto max-h-64 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">{analysisData?.summary}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Key Themes */}
              <div>
                <h3 className="text-lg font-medium text-blue-400 mb-3 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Key Themes
                </h3>
                <div className="bg-gray-700/50 overflow-y-auto max-h-64 rounded-lg p-4">
                  <ul className="space-y-2">
                    {analysisData?.keyThemes.map((theme, index) => (
                      <li key={index} className="text-gray-300 flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        {theme}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Suggestions & Praise */}
              <div>
                <h3 className="text-lg font-medium text-blue-400 mb-3 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Suggestions & Praise
                </h3>
                <div className="bg-gray-700/50 overflow-y-auto max-h-64 rounded-lg p-4">
                  <ul className="space-y-2">
                    {analysisData?.suggestionsAndPraise.map((item, index) => (
                      <li key={index} className="text-gray-300 flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* User Questions */}
              <div>
                <h3 className="text-lg font-medium text-blue-400 mb-3 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  User Questions
                </h3>
                <div className="bg-gray-700/50 overflow-y-auto max-h-64 rounded-lg p-4">
                  <ul className="space-y-2">
                    {analysisData?.userQuestions.map((question, index) => (
                      <li key={index} className="text-gray-300 flex items-start">
                        <span className="text-purple-400 mr-2">•</span>
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Video Suggestions */}
              <div>
                <h3 className="text-lg font-medium text-blue-400 mb-3 flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  Viewer Video Suggestions
                </h3>
                <div className="bg-gray-700/50 rounded-lg p-4 overflow-y-auto max-h-64">
                  <ul className="space-y-2">
                    {analysisData?.videoSuggestionsByViewers.map((suggestion, index) => (
                      <li key={index} className="text-gray-300 flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AI Recommendations */}
              <div>
                <h3 className="text-lg font-medium text-blue-400 mb-3 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  AI Recommendations
                </h3>
                <div className="bg-gray-700/50 rounded-lg p-4 overflow-y-auto max-h-64">
                  <ul className="space-y-2">
                    {analysisData?.aiRecommendation?.map((recommendation, index) => (
                      <li key={index} className="text-gray-300 flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 mt-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              NOTE : 
            </h2>
            <p className='font-semibold text-yellow-400'>This tool analyzes only the <u>first  1000 comments</u> of a YouTube video.
            This limitation exists because the analysis is powered by a <u>free-tier AI</u> , which can only process a limited amount of data. As a result, the insights are based on a sample of comments and should be considered an approximate representation of the overall sentiment and trends.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
