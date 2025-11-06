import expressAsyncHandler from 'express-async-handler';
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import ActivityLog from '../models/activityLogModel';
import MedicationLog from '../models/medicationLogModel';

/**
 * Health Score Calculation Logic (No Reminders/Scheduling):
 * 
 * Since there are no reminders, we focus on actual usage patterns:
 * 
 * 1. Activity Level (40% weight) - How actively user tracks health
 *    - Based on number of interactions with app features
 *    - AI consultations, drug checks, medicine searches, etc.
 * 
 * 2. Logging Consistency (30% weight) - Regular health tracking
 *    - How many days user logged any health activity
 *    - Encourages daily engagement
 * 
 * 3. Feature Usage Diversity (20% weight) - Using multiple features
 *    - Using AI, drug checker, medicine library, etc.
 *    - Shows comprehensive health management
 * 
 * 4. Engagement Streak (10% weight) - Daily app usage
 *    - Consecutive days of any app activity
 *    - Builds healthy habits
 */

interface HealthScoreData {
  overallScore: number;
  activityLevel?: number;
  loggingConsistency?: number;
  featureDiversity?: number;
  engagementStreak?: number;
  totalActivities?: number;
  activeDays?: number;
  featuresUsed?: string[];
  medicationAdherence?: number;
  timeliness?: number;
  consistency?: number;
  currentStreak?: number;
  totalMedications?: number;
  takenMedications?: number;
  missedMedications?: number;
  skippedMedications?: number;
  insights: string[];
  recommendations: string[];
  lastActivityDate?: string;
  lastLogDate?: string;
}

// Calculate medication adherence score
const calculateAdherence = async (userId: string, days: number = 30): Promise<{
  adherenceScore: number;
  taken: number;
  missed: number;
  total: number;
}> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const logs = await MedicationLog.find({
    userId,
    scheduledTime: { $gte: startDate }
  });

  const taken = logs.filter(log => log.status === 'taken').length;
  const missed = logs.filter(log => log.status === 'missed').length;
  const total = taken + missed;

  const adherenceScore = total > 0 ? (taken / total) * 100 : 0;

  return { adherenceScore, taken, missed, total };
};

// Calculate timeliness score
const calculateTimeliness = async (userId: string, days: number = 30): Promise<number> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const logs = await MedicationLog.find({
    userId,
    status: 'taken',
    scheduledTime: { $gte: startDate },
    takenTime: { $exists: true }
  });

  if (logs.length === 0) return 0;

  let totalTimelinessScore = 0;

  logs.forEach(log => {
    if (log.takenTime && log.scheduledTime) {
      const diffMinutes = Math.abs(
        (log.takenTime.getTime() - log.scheduledTime.getTime()) / (1000 * 60)
      );

      // Score based on how close to scheduled time
      if (diffMinutes <= 30) {
        totalTimelinessScore += 100;
      } else if (diffMinutes <= 60) {
        totalTimelinessScore += 75;
      } else if (diffMinutes <= 120) {
        totalTimelinessScore += 50;
      } else {
        totalTimelinessScore += 25;
      }
    }
  });

  return logs.length > 0 ? totalTimelinessScore / logs.length : 0;
};

// Calculate current streak
const calculateStreak = async (userId: string): Promise<number> => {
  const logs = await MedicationLog.find({ userId })
    .sort({ scheduledTime: -1 })
    .limit(90); // Check last 90 days

  if (logs.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Group logs by day
  const logsByDay = new Map<string, { taken: number; missed: number }>();
  
  logs.forEach(log => {
    const dayKey = log.scheduledTime.toISOString().split('T')[0];
    if (!logsByDay.has(dayKey)) {
      logsByDay.set(dayKey, { taken: 0, missed: 0 });
    }
    const dayData = logsByDay.get(dayKey)!;
    if (log.status === 'taken') dayData.taken++;
    if (log.status === 'missed') dayData.missed++;
  });

  // Calculate streak from most recent day backwards
  const sortedDays = Array.from(logsByDay.keys()).sort().reverse();
  
  for (const day of sortedDays) {
    const dayData = logsByDay.get(day)!;
    const total = dayData.taken + dayData.missed;
    const adherence = total > 0 ? dayData.taken / total : 0;
    
    // Consider day successful if >80% adherence
    if (adherence >= 0.8) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

// Calculate consistency score (how regularly user logs medications)
const calculateConsistency = async (userId: string, days: number = 30): Promise<number> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const logs = await MedicationLog.find({
    userId,
    scheduledTime: { $gte: startDate }
  });

  if (logs.length === 0) return 0;

  // Group logs by day
  const logsByDay = new Map<string, number>();
  logs.forEach(log => {
    const dayKey = log.scheduledTime.toISOString().split('T')[0];
    logsByDay.set(dayKey, (logsByDay.get(dayKey) || 0) + 1);
  });

  const daysWithLogs = logsByDay.size;
  const consistencyScore = (daysWithLogs / days) * 100;

  return Math.min(consistencyScore, 100);
};

// Generate insights and recommendations
const generateInsights = (data: {
  adherence: number;
  timeliness: number;
  consistency: number;
  streak: number;
  taken: number;
  missed: number;
  skipped: number;
}): { insights: string[]; recommendations: string[] } => {
  const insights: string[] = [];
  const recommendations: string[] = [];

  // Adherence insights
  if (data.adherence >= 90) {
    insights.push('Excellent medication adherence! Keep up the great work.');
  } else if (data.adherence >= 75) {
    insights.push('Good medication adherence, but there\'s room for improvement.');
  } else if (data.adherence >= 50) {
    insights.push('Your medication adherence needs attention.');
  } else if (data.adherence > 0) {
    insights.push('Low medication adherence detected. This may affect your health.');
  }

  // Streak insights
  if (data.streak >= 7) {
    insights.push(`Amazing! You're on a ${data.streak}-day streak.`);
  } else if (data.streak >= 3) {
    insights.push(`You're building a good habit with a ${data.streak}-day streak.`);
  }

  // Timeliness insights
  if (data.timeliness >= 80) {
    insights.push('You\'re taking medications on time consistently.');
  } else if (data.timeliness < 60) {
    insights.push('Try to take medications closer to scheduled times.');
  }

  // Recommendations (Reminder feature disabled)
  if (data.adherence < 80) {
    recommendations.push('Try to maintain a consistent medication schedule');
  }

  if (data.timeliness < 70) {
    recommendations.push('Take medications closer to your scheduled times');
  }

  if (data.missed > data.taken && data.taken > 0) {
    recommendations.push('Consult your healthcare provider about your medication routine');
  }

  if (data.streak === 0 && data.taken > 0) {
    recommendations.push('Focus on taking medications daily to build a healthy streak');
  }
  
  if (data.adherence >= 80 && data.timeliness >= 80) {
    recommendations.push('Great job! Keep maintaining your excellent medication habits');
  }

  return { insights, recommendations };
};

// Get health score
const getHealthScore = expressAsyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = (req.user as any)?._id?.toString();

  if (!userId) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  // Calculate all components
  const adherenceData = await calculateAdherence(userId);
  const timelinessScore = await calculateTimeliness(userId);
  const consistencyScore = await calculateConsistency(userId);
  const streak = await calculateStreak(userId);

  // Get skipped count
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  const allLogs = await MedicationLog.find({
    userId,
    scheduledTime: { $gte: startDate }
  });
  const skipped = allLogs.filter(log => log.status === 'skipped').length;

  // Get last log date
  const lastLog = await MedicationLog.findOne({ userId }).sort({ scheduledTime: -1 });
  const lastLogDate = lastLog ? lastLog.scheduledTime.toISOString() : undefined;

  // Weighted calculation (No reminder feature)
  const weights = {
    adherence: 0.50,      // 50% - Taking meds vs missing
    timeliness: 0.25,     // 25% - Taking on time
    consistency: 0.15,    // 15% - Logging regularly
    streak: 0.10          // 10% - Maintaining streak
  };

  // Streak score (max 100, 10 points per day up to 10 days)
  const streakScore = Math.min(streak * 10, 100);

  // Calculate overall score
  const overallScore = Math.round(
    (adherenceData.adherenceScore * weights.adherence) +
    (timelinessScore * weights.timeliness) +
    (consistencyScore * weights.consistency) +
    (streakScore * weights.streak)
  );

  // Check if user has any data at all
  const hasData = adherenceData.total > 0;

  // Generate insights
  const { insights, recommendations } = hasData ? generateInsights({
    adherence: adherenceData.adherenceScore,
    timeliness: timelinessScore,
    consistency: consistencyScore,
    streak,
    taken: adherenceData.taken,
    missed: adherenceData.missed,
    skipped
  }) : {
    insights: ['Welcome to Drug GENIE! Start logging your medications to track your health.'],
    recommendations: [
      'Log your medication intake regularly',
      'Try to take medications on time',
      'Build a daily logging habit for better insights'
    ]
  };

  const healthScoreData: HealthScoreData = {
    overallScore: Math.max(0, Math.min(100, overallScore)),
    medicationAdherence: Math.round(adherenceData.adherenceScore),
    timeliness: Math.round(timelinessScore),
    consistency: Math.round(consistencyScore),
    currentStreak: streak,
    totalMedications: adherenceData.total,
    takenMedications: adherenceData.taken,
    missedMedications: adherenceData.missed,
    skippedMedications: skipped,
    insights,
    recommendations,
    lastLogDate
  };

  res.json(healthScoreData);
});

// Log medication intake
const logMedication = expressAsyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = (req.user as any)?._id?.toString();
  const { reminderId, medicineName, scheduledTime, status, takenTime, notes } = req.body;

  if (!medicineName || !scheduledTime || !status) {
    res.status(400);
    throw new Error('Missing required fields: medicineName, scheduledTime, status');
  }

  const log = await MedicationLog.create({
    userId,
    reminderId,
    medicineName,
    scheduledTime: new Date(scheduledTime),
    takenTime: takenTime ? new Date(takenTime) : undefined,
    status,
    notes
  });

  res.status(201).json({
    id: log._id,
    userId: log.userId,
    reminderId: log.reminderId,
    medicineName: log.medicineName,
    scheduledTime: log.scheduledTime,
    takenTime: log.takenTime,
    status: log.status,
    notes: log.notes
  });
});

// Get medication logs
const getMedicationLogs = expressAsyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = (req.user as any)?._id?.toString();
  const { days = 30 } = req.query;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - Number(days));

  const logs = await MedicationLog.find({
    userId,
    scheduledTime: { $gte: startDate }
  }).sort({ scheduledTime: -1 });

  res.json(logs);
});

export { getHealthScore, logMedication, getMedicationLogs };
