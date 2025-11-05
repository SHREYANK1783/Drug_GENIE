import axios from 'axios';
import { getToken } from './api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Helper function to log user activities
 * This will automatically get the token and send the activity to the backend
 */
export const logUserActivity = async (
  activityType: string,
  action: string,
  details?: string,
  metadata?: any
): Promise<void> => {
  try {
    const token = getToken();
    if (!token) {
      console.warn('No token found, skipping activity log');
      return;
    }

    await axios.post(
      `${API_URL}/api/activities/log`,
      {
        activityType,
        action,
        details,
        metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw - activity logging should not break the app
  }
};

// Activity type constants for type safety
export const ActivityTypes = {
  AI_CONSULTATION: 'ai_consultation',
  DRUG_INTERACTION: 'drug_interaction',
  MEDICINE_SEARCH: 'medicine_search',
  MEDICATION_LOG: 'medication_log',
  BLOOD_REQUEST: 'blood_request',
  SYMPTOM_CHECK: 'symptom_check',
  HEALTH_SCORE: 'health_score',
  REMINDER: 'reminder',
  PROFILE_UPDATE: 'profile_update',
  LOGIN: 'login',
  REGISTER: 'register',
} as const;
