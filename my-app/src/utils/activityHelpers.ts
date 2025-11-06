import { 
  Bot, 
  Shield, 
  BookOpen, 
  Clock, 
  Droplets, 
  Activity as ActivityIcon,
  Heart,
  User,
  LogIn
} from 'lucide-react';
// Format timestamp to relative time (fallback without date-fns)
const formatDistanceToNowFallback = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) !== 1 ? 's' : ''} ago`;
};

// Map activity types to icons
export const getActivityIcon = (activityType: string) => {
  const iconMap: { [key: string]: any } = {
    ai_consultation: Bot,
    drug_interaction: Shield,
    medicine_search: BookOpen,
    medication_log: Clock,
    blood_request: Droplets,
    symptom_check: ActivityIcon,
    health_score: Heart,
    reminder: Clock,
    profile_update: User,
    login: LogIn,
    register: User,
  };
  
  return iconMap[activityType] || ActivityIcon;
};

// Map activity types to colors
export const getActivityColor = (activityType: string) => {
  const colorMap: { [key: string]: { bg: string; text: string; type: string } } = {
    ai_consultation: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', type: 'success' },
    drug_interaction: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', type: 'success' },
    medicine_search: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400', type: 'info' },
    medication_log: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', type: 'info' },
    blood_request: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', type: 'warning' },
    symptom_check: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400', type: 'info' },
    health_score: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400', type: 'success' },
    reminder: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', type: 'info' },
    profile_update: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', type: 'info' },
    login: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400', type: 'info' },
    register: { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-600 dark:text-teal-400', type: 'success' },
  };
  
  return colorMap[activityType] || { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400', type: 'info' };
};

// Format timestamp to relative time
export const formatActivityTime = (timestamp: string): string => {
  try {
    return formatDistanceToNowFallback(new Date(timestamp));
  } catch (error) {
    return 'Recently';
  }
};

// Get friendly activity name
export const getActivityName = (activityType: string): string => {
  const nameMap: { [key: string]: string } = {
    ai_consultation: 'AI Consultation',
    drug_interaction: 'Drug Interaction Check',
    medicine_search: 'Medicine Search',
    medication_log: 'Medication Logged',
    blood_request: 'Blood Request',
    symptom_check: 'Symptom Check',
    health_score: 'Health Score Check',
    reminder: 'Reminder Set',
    profile_update: 'Profile Updated',
    login: 'Logged In',
    register: 'Account Created',
  };
  
  return nameMap[activityType] || 'Activity';
};
