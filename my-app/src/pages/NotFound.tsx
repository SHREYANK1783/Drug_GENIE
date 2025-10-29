import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft, Heart, AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl">
            <Heart className="h-16 w-16 text-white" />
          </div>
        </motion.div>

        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="relative mb-8"
        >
          <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            404
          </h1>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="absolute top-0 right-1/4"
          >
            <AlertCircle className="h-12 w-12 text-yellow-500" />
          </motion.div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            The page you're looking for seems to have taken a sick day. 🏥
          </p>
          <p className="text-gray-500">
            Don't worry, our AI assistant can help you find what you need!
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Home className="h-5 w-5" />
              <span>Back to Home</span>
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center justify-center space-x-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-blue-300 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </motion.button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Search className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Popular Pages
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              to="/ai-assistant"
              className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-600 font-medium transition-colors text-sm"
            >
              AI Assistant
            </Link>
            <Link
              to="/drug-checker"
              className="p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-600 font-medium transition-colors text-sm"
            >
              Drug Checker
            </Link>
            <Link
              to="/library"
              className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 font-medium transition-colors text-sm"
            >
              Medicine Library
            </Link>
            <Link
              to="/reminders"
              className="p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-600 font-medium transition-colors text-sm"
            >
              Reminders
            </Link>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-200/30 rounded-full blur-3xl -z-10"></div>
      </motion.div>
    </div>
  );
};

export default NotFound;
