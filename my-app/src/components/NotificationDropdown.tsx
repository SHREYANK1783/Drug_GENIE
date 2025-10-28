import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Droplets, Clock, AlertCircle, Settings, Trash2 } from 'lucide-react';
import { notificationService, Notification } from '../services/notificationService';
import { Skeleton } from './ui/skeleton';
import { useNavigate } from 'react-router-dom';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = React.memo(({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMarkAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, []);

  const handleClearAll = useCallback(async () => {
    try {
      await notificationService.clearAllNotifications();
      setNotifications([]);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }, []);

  const handleNotificationClick = useCallback(async (notification: Notification) => {
    if (!notification.isRead) {
      await handleMarkAsRead(notification._id);
    }
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  }, [handleMarkAsRead, navigate, onClose]);

  const getNotificationIcon = useCallback((type: string) => {
    switch (type) {
      case 'blood_request':
        return <Droplets className="h-4 w-4 text-red-500" />;
      case 'reminder':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'health_alert':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Settings className="h-4 w-4 text-blue-500" />;
    }
  }, []);

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  }, []);

  const formatTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }, []);

  const hasUnreadNotifications = useMemo(() => 
    notifications.some(n => !n.isRead), [notifications]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={onClose}
          />
          
          {/* Dropdown - Simplified animation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {notifications.length > 0 && (
                  <>
                    {hasUnreadNotifications && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={handleClearAll}
                      className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Clear all</span>
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="divide-y divide-gray-100">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 space-y-3">
                      <div className="flex items-start space-x-3">
                        <Skeleton className="h-5 w-5 rounded-full mt-1" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <Skeleton className="h-3 w-1/4" />
                        </div>
                        <div className="flex space-x-1">
                          <Skeleton className="h-6 w-6 rounded" />
                          <Skeleton className="h-6 w-6 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${
                        !notification.isRead ? getPriorityColor(notification.priority) : 'border-l-gray-300 bg-gray-50'
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium truncate ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {formatTime(notification.createdAt)}
                              </span>
                              {!notification.isRead && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification._id);
                                  }}
                                  className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                                  title="Mark as read"
                                >
                                  <Check className="h-3 w-3 text-blue-500" />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className={`text-sm mt-1 ${
                            !notification.isRead ? 'text-gray-700' : 'text-gray-500'
                          }`}>
                            {notification.message}
                          </p>
                          {notification.metadata?.bloodGroup && (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Blood Type: {notification.metadata.bloodGroup}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

NotificationDropdown.displayName = 'NotificationDropdown';

export default NotificationDropdown;
