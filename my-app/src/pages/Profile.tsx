import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Droplets,
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Save,
  Camera,
  LogOut,
  Trash2,
  Users,
} from 'lucide-react';
import { getCurrentUser, logoutUser, updateUser } from '../utils/storage';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'privacy'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [showRetentionModal, setShowRetentionModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(currentUser?.profilePhoto || null);

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    age: currentUser?.age || '',
    bloodGroup: currentUser?.bloodGroup || '',
    gender: currentUser?.gender || '',
    phone: currentUser?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    reminderAlerts: true,
    bloodDonationAlerts: true,
    weeklyReport: false,
  });

  const handleProfileUpdate = async () => {
    try {
      const updatedUser = await authAPI.updateProfile({
        name: profileData.name,
        age: Number(profileData.age),
        bloodGroup: profileData.bloodGroup,
        gender: profileData.gender,
        phone: profileData.phone,
      });
      
      updateUser(updatedUser);
      setIsEditing(false);
      
      // Force re-render by updating window location
      window.location.reload();
    } catch (error: any) {
      console.error('Failed to update profile:', error);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      console.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      await authAPI.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Failed to change password:', error);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    const password = prompt('Please enter your password to confirm account deletion:');
    
    if (!password) {
      return; // User cancelled
    }

    if (confirm('Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted.')) {
      try {
        const response = await authAPI.deleteAccount(password);
        alert(response.message || 'Account deleted successfully');
        logoutUser();
        navigate('/signup');
      } catch (error: any) {
        alert(error.response?.data?.message || 'Failed to delete account. Please check your password.');
        console.error('Error deleting account:', error);
      }
    }
  };

  // Handle profile photo upload
  const handlePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size must be less than 5MB');
          return;
        }
        const reader = new FileReader();
        reader.onload = async (event) => {
          const photoData = event.target?.result as string;
          setProfilePhoto(photoData);
          
          // Upload to server
          try {
            const response = await authAPI.uploadProfilePhoto(photoData);
            alert('Profile photo uploaded successfully!');
            // Update user in storage
            const updatedUser = { ...currentUser, profilePhoto: response.profilePhoto };
            updateUser(updatedUser as any);
          } catch (error: any) {
            const errorMessage = error.message || error.response?.data?.message || 'Failed to upload photo';
            alert(`Error: ${errorMessage}`);
            console.error('Error uploading photo:', error);
            console.error('Error details:', {
              message: error.message,
              response: error.response,
              stack: error.stack
            });
            setProfilePhoto(currentUser?.profilePhoto || '');
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Handle data export
  const handleDataExport = () => {
    setTimeout(() => {
      // Create mock data export
      const userData = {
        profile: profileData,
        exportDate: new Date().toISOString(),
        accountCreated: currentUser?.createdAt || 'N/A',
        dataCategories: {
          personalInfo: 'Included',
          healthRecords: 'Included',
          medications: 'Included',
          bloodRequests: 'Included',
          notifications: 'Included',
        }
      };
      
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `drug-genie-data-export-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }, 1500);
  };

  // Active sessions data
  const activeSessions = [
    {
      device: 'Windows PC - Chrome',
      location: 'New York, USA',
      lastActive: 'Active now',
      ip: '192.168.1.1',
      current: true,
    },
    {
      device: 'iPhone 13 - Safari',
      location: 'New York, USA',
      lastActive: '2 hours ago',
      ip: '192.168.1.2',
      current: false,
    },
    {
      device: 'Android - Chrome',
      location: 'California, USA',
      lastActive: 'Yesterday',
      ip: '192.168.1.3',
      current: false,
    },
  ];

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-white" />
              )}
            </div>
            <button 
              onClick={handlePhotoUpload}
              className="absolute bottom-0 right-0 p-2 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
              title="Upload Photo"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{currentUser?.name}</h1>
            <p className="text-blue-100 flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>{currentUser?.email}</span>
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="flex items-center space-x-1 text-sm">
                <Droplets className="h-4 w-4" />
                <span>{currentUser?.bloodGroup}</span>
              </span>
              <span className="flex items-center space-x-1 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{currentUser?.age} years</span>
              </span>
              <span className="flex items-center space-x-1 text-sm">
                <Users className="h-4 w-4" />
                <span>{currentUser?.gender}</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200"
      >
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="email"
                      disabled
                      value={profileData.email}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="tel"
                      disabled={!isEditing}
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="Enter phone number"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Age
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="number"
                      disabled={!isEditing}
                      value={profileData.age}
                      onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Blood Group
                  </label>
                  <div className="relative">
                    <Droplets className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <select
                      disabled={!isEditing}
                      value={profileData.bloodGroup}
                      onChange={(e) => setProfileData({ ...profileData, bloodGroup: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Gender
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <select
                      disabled={!isEditing}
                      value={profileData.gender}
                      onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {isEditing && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleProfileUpdate}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Save className="h-5 w-5" />
                  <span>Save Changes</span>
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Change Password</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Enter current password"
                    />
                    <button
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                    >
                      {showOldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Enter new password"
                    />
                    <button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handlePasswordChange}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Lock className="h-5 w-5" />
                <span>Update Password</span>
              </button>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Security Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
                    </div>
                    <button 
                      onClick={() => setShow2FAModal(true)}
                      className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-500"
                    >
                      Enable
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Active Sessions</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Manage your logged-in devices</p>
                    </div>
                    <button 
                      onClick={() => setShowSessionsModal(true)}
                      className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-500"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Notification Preferences</h2>

              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {key === 'emailNotifications' && 'Receive updates via email'}
                        {key === 'pushNotifications' && 'Receive push notifications in browser'}
                        {key === 'reminderAlerts' && 'Get alerts for medicine reminders'}
                        {key === 'bloodDonationAlerts' && 'Notifications for blood donation requests'}
                        {key === 'weeklyReport' && 'Weekly health summary email'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {}}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Save className="h-5 w-5" />
                <span>Save Preferences</span>
              </button>
            </motion.div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Privacy & Data</h2>

              <div className="space-y-4">
                <div className="p-6 bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-400 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Data Privacy</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Your health data is encrypted and stored securely. We never share your personal information without your consent.
                      </p>
                      <button 
                        onClick={() => navigate('/privacy-policy')}
                        className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-500"
                      >
                        Learn More →
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Download Your Data</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Export all your health records</p>
                    </div>
                    <button 
                      onClick={handleDataExport}
                      className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-500"
                    >
                      Download
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Data Retention</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">How long we keep your data</p>
                    </div>
                    <button 
                      onClick={() => setShowRetentionModal(true)}
                      className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-500"
                    >
                      Settings
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 text-red-600">Danger Zone</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Log Out</span>
                  </button>

                  <button
                    onClick={handleDeleteAccount}
                    className="w-full flex items-center justify-center space-x-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-6 py-3 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/50 border-2 border-red-200 dark:border-red-400 transition-all"
                  >
                    <Trash2 className="h-5 w-5" />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* 2FA Setup Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Enable 2FA</h2>
              <p className="text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-48 h-48 bg-white dark:bg-gray-700 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600">
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400 text-center">QR Code<br />Placeholder</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Scan this QR code with your authenticator app
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-400 rounded-xl">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-400 mb-2">Backup Code:</p>
                <code className="block text-center text-lg font-mono text-blue-700 dark:text-blue-400 bg-white dark:bg-gray-700 p-3 rounded-lg">
                  XXXX-XXXX-XXXX-XXXX
                </code>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Save this code in a safe place</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShow2FAModal(false);
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Enable 2FA
              </button>
              <button
                onClick={() => setShow2FAModal(false)}
                className="px-6 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-100 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Active Sessions Modal */}
      {showSessionsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Active Sessions</h2>
                <p className="text-gray-600 dark:text-gray-400">Manage devices logged into your account</p>
              </div>
              <button
                onClick={() => setShowSessionsModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {activeSessions.map((session, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 ${
                    session.current
                      ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-400'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{session.device}</p>
                        {session.current && (
                          <span className="px-2 py-1 bg-green-200 dark:bg-green-400 text-green-800 dark:text-green-100 text-xs font-medium rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p>📍 {session.location}</p>
                        <p>🕐 {session.lastActive}</p>
                        <p>🌐 IP: {session.ip}</p>
                      </div>
                    </div>
                    {!session.current && (
                      <button
                        onClick={() => {}}
                        className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-200 dark:border-yellow-400 rounded-xl">
              <p className="text-sm text-yellow-800 dark:text-yellow-100">
                <strong>Security Tip:</strong> If you see any suspicious sessions, revoke them immediately and change your password.
              </p>
            </div>

            <button
              onClick={() => {
                if (confirm('This will log you out from all other devices. Continue?')) {
                  setShowSessionsModal(false);
                }
              }}
              className="w-full mt-4 bg-red-600 dark:bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 dark:hover:bg-red-600 transition-all"
            >
              Revoke All Other Sessions
            </button>
          </motion.div>
        </div>
      )}

      {/* Data Retention Settings Modal */}
      {showRetentionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Data Retention Settings</h2>
              <p className="text-gray-600 dark:text-gray-400">Choose how long we keep your data</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-400 rounded-xl">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="retention"
                    defaultChecked
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Keep Forever</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">All your data is stored indefinitely</p>
                  </div>
                </label>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input type="radio" name="retention" className="mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">1 Year Retention</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Data older than 1 year is automatically deleted</p>
                  </div>
                </label>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input type="radio" name="retention" className="mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">6 Months Retention</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Data older than 6 months is automatically deleted</p>
                  </div>
                </label>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input type="radio" name="retention" className="mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">3 Months Retention</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Data older than 3 months is automatically deleted</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-200 dark:border-yellow-400 rounded-xl mb-6">
              <p className="text-sm text-yellow-800 dark:text-yellow-100">
                <strong>Note:</strong> Medical records and prescription data will always be retained for legal compliance.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRetentionModal(false);
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Save Settings
              </button>
              <button
                onClick={() => setShowRetentionModal(false)}
                className="px-6 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-100 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;
