import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, User, Search, Heart, LogOut, Menu, X, Moon, Sun, Command, Settings, HelpCircle, Mail } from 'lucide-react';
import { getCurrentUser, logoutUser } from '../utils/storage';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services/notificationService';
import NotificationDropdown from './NotificationDropdown';
import GlobalSearch from './GlobalSearch';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  useEffect(() => {
    loadUnreadCount();
    // Reduced polling frequency from 30s to 2 minutes to reduce API calls
    const interval = setInterval(loadUnreadCount, 120000);
    return () => clearInterval(interval);
  }, []);

  // Global search keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowGlobalSearch(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      // Only update state if count actually changed to prevent unnecessary re-renders
      setUnreadCount(prevCount => prevCount !== count ? count : prevCount);
    } catch (error) {
      // Silently fail - user might not be authenticated
    }
  };

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClose = () => {
    setShowNotifications(false);
    // Only refresh count if dropdown was actually open and had unread notifications
    if (unreadCount > 0) {
      loadUnreadCount();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to medicine library with search term
      navigate('/library');
      // Clear search after navigation
      setTimeout(() => setSearchQuery(''), 100);
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 px-6 py-4 fixed w-full top-0 z-50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 cursor-pointer"
            title="Go to Dashboard"
          >
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Drug GENIE
              </span>
              <p className="text-xs text-gray-500 -mt-1">Healthcare Assistant</p>
            </div>
          </motion.div>
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 bg-gray-50 rounded-xl px-4 py-2 ml-8 border border-gray-200 hover:border-blue-300 transition-colors">
            <Search className="h-4 w-4 text-gray-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicines, symptoms..."
              className="bg-transparent border-none outline-none text-sm w-64 placeholder-gray-500 text-gray-900"
            />
          </form>
        </div>

        {/* Right side (Search + Dark Mode + Notifications + Profile) */}
        <div className="flex items-center space-x-2">
          {/* Global Search Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGlobalSearch(true)}
            className="hidden md:flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group"
            title="Search (Ctrl+K)"
          >
            <Command className="h-4 w-4" />
            <span className="text-sm font-medium">Search</span>
            <kbd className="hidden lg:inline-block px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded">⌘K</kbd>
          </motion.button>

          {/* Dark Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-3 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </motion.button>
          {/* Notification */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNotificationClick}
              className="relative p-3 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium transition-all duration-200"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </motion.button>
            
            <NotificationDropdown 
              isOpen={showNotifications}
              onClose={handleNotificationClose}
            />
          </div>
          
          {/* Profile + Dropdown */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-900">
                {currentUser?.name || 'Guest User'}
              </p>
              <p className="text-xs text-gray-500">
                {currentUser?.bloodGroup || 'Unknown'} • {currentUser?.age || 'N/A'} years
              </p>
            </div>
            
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-10 w-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center cursor-pointer shadow-lg"
              >
                <User className="h-5 w-5 text-white" />
              </motion.div>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{currentUser?.name}</p>
                  <p className="text-sm text-gray-500">{currentUser?.email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="text-sm font-medium">Profile & Settings</span>
                  </button>
                  <button
                    onClick={() => navigate('/help')}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Help Center</span>
                  </button>
                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="text-sm font-medium">Contact Support</span>
                  </button>
                  <div className="border-t border-gray-100 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={showGlobalSearch} onClose={() => setShowGlobalSearch(false)} />
    </motion.nav>
  );
};

export default Navbar;
