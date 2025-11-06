import expressAsyncHandler from 'express-async-handler';
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import ActivityLog from '../models/activityLogModel';
import mongoose from 'mongoose';

// Helper function to log activity
export const logActivity = async (
  userId: string,
  userName: string,
  activityType: string,
  action: string,
  details?: string,
  metadata?: any
) => {
  try {
    await ActivityLog.create({
      userId,
      userName,
      activityType,
      action,
      details,
      metadata,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw error - activity logging should not break main functionality
  }
};

// Get recent activities for current user
export const getUserActivities = expressAsyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = (req.user as any)?._id?.toString();
  const { limit = 20 } = req.query;

  const activities = await ActivityLog.find({ userId })
    .sort({ timestamp: -1 })
    .limit(Number(limit));

  res.json(activities);
});

// Get recent activities for all users (for dashboard)
export const getRecentActivities = expressAsyncHandler(async (req: AuthRequest, res: Response) => {
  const { limit = 10 } = req.query;

  const activities = await ActivityLog.find()
    .sort({ timestamp: -1 })
    .limit(Number(limit))
    .select('-__v');

  res.json(activities);
});

// Get activity statistics
export const getActivityStats = expressAsyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = (req.user as any)?._id?.toString();
  const { days = 7 } = req.query;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - Number(days));

  // Get activity counts by type
  const activityCounts = await ActivityLog.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$activityType',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get daily activity trend
  const dailyTrend = await ActivityLog.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  res.json({
    activityCounts,
    dailyTrend,
    totalActivities: activityCounts.reduce((sum, item) => sum + item.count, 0)
  });
});

// Get global activity feed (recent activities from all users)
export const getGlobalActivityFeed = expressAsyncHandler(async (req: AuthRequest, res: Response) => {
  const { limit = 20, activityType } = req.query;

  const query: any = {};
  if (activityType) {
    query.activityType = activityType;
  }

  const activities = await ActivityLog.find(query)
    .sort({ timestamp: -1 })
    .limit(Number(limit))
    .select('userName activityType action details timestamp metadata');

  res.json(activities);
});
