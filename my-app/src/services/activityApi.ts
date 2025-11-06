import axios from 'axios';

const API_URL = 'http://localhost:5000/api/activities';

export interface Activity {
  _id: string;
  userId: string;
  userName: string;
  activityType: string;
  action: string;
  details?: string;
  metadata?: {
    medicineName?: string;
    bloodGroup?: string;
    interactionCount?: number;
    consultationType?: string;
    [key: string]: any;
  };
  timestamp: string;
}

// Get recent activities
export const getRecentActivities = async (token: string, limit: number = 10): Promise<Activity[]> => {
  const response = await axios.get(`${API_URL}/recent?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get user's own activities
export const getUserActivities = async (token: string, limit: number = 20): Promise<Activity[]> => {
  const response = await axios.get(`${API_URL}/my-activities?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get activity statistics
export const getActivityStats = async (token: string, days: number = 7): Promise<any> => {
  const response = await axios.get(`${API_URL}/stats?days=${days}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get global activity feed
export const getGlobalActivityFeed = async (token: string, limit: number = 20): Promise<Activity[]> => {
  const response = await axios.get(`${API_URL}/feed?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
