import axios from 'axios';

const API_URL = 'http://localhost:5000/api/health-score';

export interface HealthScoreData {
  overallScore: number;
  activityLevel: number;
  loggingConsistency: number;
  featureDiversity: number;
  engagementStreak: number;
  totalActivities: number;
  activeDays: number;
  featuresUsed: string[];
  insights: string[];
  recommendations: string[];
  lastActivityDate?: string;
}

export interface MedicationLog {
  id?: string;
  userId?: string;
  reminderId: string;
  medicineName: string;
  scheduledTime: Date | string;
  takenTime?: Date | string;
  status: 'taken' | 'missed' | 'skipped';
  notes?: string;
}

// Get health score
export const getHealthScore = async (token: string): Promise<HealthScoreData> => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Log medication intake
export const logMedication = async (
  token: string,
  log: MedicationLog
): Promise<MedicationLog> => {
  const response = await axios.post(`${API_URL}/log`, log, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get medication logs
export const getMedicationLogs = async (
  token: string,
  days: number = 30
): Promise<MedicationLog[]> => {
  const response = await axios.get(`${API_URL}/logs?days=${days}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
