import expressAsyncHandler from 'express-async-handler';
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import ActivityLog from '../models/activityLogModel';

/**
 * Health Score Calculation Logic (Activity-Based, No Reminders):
 * 
 * 1. Activity Level (40%) - How actively user engages with health features
 * 2. Logging Consistency (30%) - Regular daily engagement
 * 3. Feature Diversity (20%) - Using multiple app features
 * 4. Engagement Streak (10%) - Consecutive days of activity
 */

interface HealthScoreData {
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

// Calculate activity level (number of activities in last 30 days)
const calculateActivityLevel = async (userId: string, days: number = 30): Promise<{
  score: number;
  total: number;
}> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const activities = await ActivityLog.find({
    userId,
    timestamp: { $gte: startDate }
  });

  const total = activities.length;
  
  // Score based on activity count
  // 0-5 activities = 0-20%, 6-15 = 21-50%, 16-30 = 51-80%, 31+ = 81-100%
  let score = 0;
  if (total === 0) score = 0;
  else if (total <= 5) score = (total / 5) * 20;
  else if (total <= 15) score = 20 + ((total - 5) / 10) * 30;
  else if (total <= 30) score = 50 + ((total - 15) / 15) * 30;
  else score = Math.min(80 + ((total - 30) / 20) * 20, 100);

  return { score, total };
};

// Calculate logging consistency (how many days user was active)
const calculateLoggingConsistency = async (userId: string, days: number = 30): Promise<{
  score: number;
  activeDays: number;
}> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const activities = await ActivityLog.find({
    userId,
    timestamp: { $gte: startDate }
  });

  // Group by day
  const uniqueDays = new Set<string>();
  activities.forEach(activity => {
    const dayKey = activity.timestamp.toISOString().split('T')[0];
    uniqueDays.add(dayKey);
  });

  const activeDays = uniqueDays.size;
  const score = (activeDays / days) * 100;

  return { score, activeDays };
};

// Calculate feature diversity (how many different features used)
const calculateFeatureDiversity = async (userId: string, days: number = 30): Promise<{
  score: number;
  features: string[];
}> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const activities = await ActivityLog.find({
    userId,
    timestamp: { $gte: startDate }
  });

  // Get unique activity types
  const uniqueFeatures = new Set<string>();
  activities.forEach(activity => {
    uniqueFeatures.add(activity.activityType);
  });

  const features = Array.from(uniqueFeatures);
  const featureCount = features.length;

  // Score based on feature diversity
  // 1 feature = 30%, 2 = 50%, 3 = 70%, 4 = 85%, 5+ = 100%
  let score = 0;
  if (featureCount === 0) score = 0;
  else if (featureCount === 1) score = 30;
  else if (featureCount === 2) score = 50;
  else if (featureCount === 3) score = 70;
  else if (featureCount === 4) score = 85;
  else score = 100;

  return { score, features };
};

// Calculate engagement streak (consecutive days with activity)
const calculateEngagementStreak = async (userId: string): Promise<number> => {
  const activities = await ActivityLog.find({ userId })
    .sort({ timestamp: -1 })
    .limit(90);

  if (activities.length === 0) return 0;

  // Group by day
  const daySet = new Set<string>();
  activities.forEach(activity => {
    const dayKey = activity.timestamp.toISOString().split('T')[0];
    daySet.add(dayKey);
  });

  const sortedDays = Array.from(daySet).sort().reverse();
  
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  let currentDay = new Date(today);

  for (const day of sortedDays) {
    const dayDate = new Date(day);
    const diffDays = Math.floor((currentDay.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak) {
      streak++;
    } else if (diffDays > streak) {
      break;
    }
  }

  return streak;
};

// Generate insights and recommendations
const generateInsights = (data: {
  activityLevel: number;
  consistency: number;
  diversity: number;
  streak: number;
  totalActivities: number;
  activeDays: number;
  featuresUsed: string[];
}): { insights: string[]; recommendations: string[] } => {
  const insights: string[] = [];
  const recommendations: string[] = [];

  // Activity level insights
  if (data.activityLevel >= 80) {
    insights.push('Excellent engagement with health tracking!');
  } else if (data.activityLevel >= 50) {
    insights.push('Good activity level, keep it up!');
  } else if (data.activityLevel > 0) {
    insights.push('You\'re getting started with health tracking.');
  }

  // Consistency insights
  if (data.consistency >= 70) {
    insights.push(`Great consistency! Active ${data.activeDays} days this month.`);
  } else if (data.consistency >= 40) {
    insights.push('Building a good tracking habit.');
  }

  // Streak insights
  if (data.streak >= 7) {
    insights.push(`Amazing ${data.streak}-day streak! Keep it going.`);
  } else if (data.streak >= 3) {
    insights.push(`You're on a ${data.streak}-day streak!`);
  }

  // Feature diversity insights
  if (data.diversity >= 70) {
    insights.push(`Using ${data.featuresUsed.length} features - comprehensive health management!`);
  }

  // Recommendations
  if (data.activityLevel < 50) {
    recommendations.push('Try using the app daily to track your health better');
  }

  if (data.consistency < 50) {
    recommendations.push('Build a daily habit by checking in regularly');
  }

  if (data.diversity < 50) {
    recommendations.push('Explore more features: AI Assistant, Drug Checker, Medicine Library');
  }

  if (data.streak === 0 && data.totalActivities > 0) {
    recommendations.push('Start a new streak by using the app daily');
  }

  if (data.featuresUsed.length < 3) {
    const unused = ['AI consultations', 'drug interaction checks', 'medicine searches'];
    recommendations.push(`Try ${unused[0]} for better health insights`);
  }

  if (insights.length === 0) {
    insights.push('Welcome! Start using features to build your health score.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Keep up the great work with your health tracking!');
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
  const activityData = await calculateActivityLevel(userId);
  const consistencyData = await calculateLoggingConsistency(userId);
  const diversityData = await calculateFeatureDiversity(userId);
  const streak = await calculateEngagementStreak(userId);

  // Get last activity date
  const lastActivity = await ActivityLog.findOne({ userId }).sort({ timestamp: -1 });
  const lastActivityDate = lastActivity ? lastActivity.timestamp.toISOString() : undefined;

  // Weighted calculation
  const weights = {
    activity: 0.40,      // 40% - How much they use the app
    consistency: 0.30,   // 30% - How regularly they use it
    diversity: 0.20,     // 20% - How many features they use
    streak: 0.10         // 10% - Daily engagement streak
  };

  // Streak score (10 points per day, max 100)
  const streakScore = Math.min(streak * 10, 100);

  // Calculate overall score
  const overallScore = Math.round(
    (activityData.score * weights.activity) +
    (consistencyData.score * weights.consistency) +
    (diversityData.score * weights.diversity) +
    (streakScore * weights.streak)
  );

  // Check if user has any data
  const hasData = activityData.total > 0;

  // Generate insights
  const { insights, recommendations } = hasData ? generateInsights({
    activityLevel: activityData.score,
    consistency: consistencyData.score,
    diversity: diversityData.score,
    streak,
    totalActivities: activityData.total,
    activeDays: consistencyData.activeDays,
    featuresUsed: diversityData.features
  }) : {
    insights: ['Welcome to Drug GENIE! Start exploring features to build your health score.'],
    recommendations: [
      'Try the AI Assistant for health questions',
      'Check drug interactions for safety',
      'Search the medicine library for information'
    ]
  };

  const healthScoreData: HealthScoreData = {
    overallScore: Math.max(0, Math.min(100, overallScore)),
    activityLevel: Math.round(activityData.score),
    loggingConsistency: Math.round(consistencyData.score),
    featureDiversity: Math.round(diversityData.score),
    engagementStreak: streak,
    totalActivities: activityData.total,
    activeDays: consistencyData.activeDays,
    featuresUsed: diversityData.features,
    insights,
    recommendations,
    lastActivityDate
  };

  res.json(healthScoreData);
});

export { getHealthScore };
