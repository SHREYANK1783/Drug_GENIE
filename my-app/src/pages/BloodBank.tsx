import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Plus, MapPin, Phone, Clock, AlertCircle, X } from 'lucide-react';
import { BloodRequest } from '../types';
import { getCurrentUser } from '../utils/storage';
import { bloodRequestsAPI } from '../services/api';
import { Skeleton } from '../components/ui/skeleton';
import { format } from 'date-fns';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const urgencyLevels = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
];

const BloodBank: React.FC = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    bloodGroup: '',
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    location: '',
    contactNumber: '',
    hospitalName: '',
    unitsNeeded: 1
  });

  const currentUser = getCurrentUser();

  useEffect(() => {
    const loadBloodRequests = async () => {
      try {
        setIsLoading(true);
        const allRequests = await bloodRequestsAPI.getActiveRequests();
        setRequests(allRequests.filter(req => req.status === 'active'));
      } catch (error) {
        console.error('Failed to load blood requests:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBloodRequests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      return;
    }

    try {
      await bloodRequestsAPI.createRequest({
        bloodGroup: formData.bloodGroup,
        urgency: formData.urgency,
        location: formData.location,
        contactNumber: formData.contactNumber,
        hospitalName: formData.hospitalName,
        unitsNeeded: formData.unitsNeeded,
      });
      
      // Reload requests to show the new one
      const updatedRequests = await bloodRequestsAPI.getActiveRequests();
      setRequests(updatedRequests.filter(req => req.status === 'active'));
      
      setShowForm(false);
      setFormData({
        bloodGroup: '',
        urgency: 'medium',
        location: '',
        contactNumber: '',
        hospitalName: '',
        unitsNeeded: 1
      });
    } catch (error: any) {
      console.error('Blood request error:', error);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      await bloodRequestsAPI.cancelRequest(requestId);
      
      // Reload requests to remove the cancelled one
      const updatedRequests = await bloodRequestsAPI.getActiveRequests();
      setRequests(updatedRequests.filter(req => req.status === 'active'));
    } catch (error: any) {
      console.error('Cancel request error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      bloodGroup: '',
      urgency: 'medium',
      location: '',
      contactNumber: '',
      hospitalName: '',
      unitsNeeded: 1
    });
  };

  const getUrgencyStyle = (urgency: string) => {
    const level = urgencyLevels.find(l => l.value === urgency);
    return level?.color || 'bg-gray-100 text-gray-800';
  };

  const canDonate = (requesterBloodGroup: string, donorBloodGroup: string): boolean => {
    const compatibility: { [key: string]: string[] } = {
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      'AB-': ['A-', 'B-', 'AB-', 'O-'],
      'O+': ['O+', 'O-'],
      'O-': ['O-']
    };
    
    return compatibility[requesterBloodGroup]?.includes(donorBloodGroup) || false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
              <Droplets className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Blood Bank & Donation</h1>
              <p className="text-gray-600 dark:text-gray-300">Find blood donors and request blood donations</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Request Blood</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Blood Request Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Create Blood Request</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Blood Group Needed
                </label>
                <select
                  required
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Urgency Level
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {urgencyLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hospital Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="e.g., City General Hospital"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Units Needed
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="10"
                  value={formData.unitsNeeded}
                  onChange={(e) => setFormData({ ...formData, unitsNeeded: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Downtown, City Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                required
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., +1 (555) 123-4567"
              />
            </div>

            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Create Request
              </motion.button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Blood Requests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Active Blood Requests ({requests.length})</h2>
        </div>
        
        {isLoading ? (
          <div className="divide-y divide-gray-200">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Skeleton className="h-8 w-24 rounded-lg" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center">
            <Droplets className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Active Requests</h3>
            <p className="text-gray-600 dark:text-gray-300">There are currently no active blood donation requests</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <Droplets className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {request.bloodGroup} Blood Needed
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Requested by {request.requesterName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyStyle(request.urgency)}`}>
                        {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{request.hospitalName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{request.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{request.contactNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{format(new Date(request.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Units needed: {request.unitsNeeded}
                      </span>
                      {currentUser && canDonate(request.bloodGroup, currentUser.bloodGroup) && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">You can donate!</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {currentUser && request.requesterId === currentUser.id && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCancelRequest(request.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel Request</span>
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        window.open(`tel:${request.contactNumber}`, '_self');
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      Contact Donor
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const message = `I saw your blood donation request for ${request.bloodGroup} blood at ${request.hospitalName}. I would like to help.`;
                        window.open(`sms:${request.contactNumber}?body=${encodeURIComponent(message)}`, '_self');
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                    >
                      Send SMS
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Compatibility Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Blood Donation Compatibility Guide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Universal Donors</h4>
            <p className="text-blue-700">O- can donate to anyone</p>
            <p className="text-blue-700">O+ can donate to all positive types</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Universal Recipients</h4>
            <p className="text-blue-700">AB+ can receive from anyone</p>
            <p className="text-blue-700">AB- can receive from all negative types</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Type A</h4>
            <p className="text-blue-700">A+ can receive: A+, A-, O+, O-</p>
            <p className="text-blue-700">A- can receive: A-, O-</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Type B</h4>
            <p className="text-blue-700">B+ can receive: B+, B-, O+, O-</p>
            <p className="text-blue-700">B- can receive: B-, O-</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BloodBank;