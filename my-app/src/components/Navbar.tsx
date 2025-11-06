import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, User, Heart, LogOut, Menu, X, Moon, Sun } from 'lucide-react';
import { getCurrentUser, logoutUser } from '../utils/storage';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services/notificationService';
import NotificationDropdown from './NotificationDropdown';
import { useTheme } from '../contexts/ThemeContext';

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

  useEffect(() => {
    loadUnreadCount();
    // Reduced polling frequency from 30s to 2 minutes to reduce API calls
    const interval = setInterval(loadUnreadCount, 120000);
    return () => clearInterval(interval);
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

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-700 px-6 py-4 fixed w-full top-0 z-50 transition-colors duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 transition"
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
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Healthcare Assistant</p>
            </div>
          </motion.div>
        </div>

        {/* Right side (Dark Mode + Notifications + Profile) */}
        <div className="flex items-center space-x-2">
          {/* Dark Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-3 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all"
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
              className="relative p-3 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all"
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
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {currentUser?.name || 'Guest User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentUser?.bloodGroup || 'Unknown'} • {currentUser?.age || 'N/A'} years
              </p>
            </div>
            
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-10 w-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center cursor-pointer shadow-lg overflow-hidden"
              >
                {currentUser?.profilePhoto ? (
                  <img 
                    src={currentUser.profilePhoto} 
                    alt={currentUser.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </motion.div>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {currentUser?.profilePhoto ? (
                      <img 
                        src={currentUser.profilePhoto} 
                        alt={currentUser.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{currentUser?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{currentUser?.email}</p>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Profile & Settings</span>
                  </button>
                  <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
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
    </motion.nav>
  );
};

export default Navbar;
