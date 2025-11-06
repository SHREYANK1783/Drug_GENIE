import express from 'express';
import { 
  getUserActivities, 
  getRecentActivities, 
  getActivityStats,
  getGlobalActivityFeed,
  logActivity
} from '../controllers/activityController';
import { protect } from '../middleware/authMiddleware';
import expressAsyncHandler from 'express-async-handler';
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Log activity from frontend
router.post('/log', expressAsyncHandler(async (req: AuthRequest, res: Response) => {
  const user = (req as any).user;
  const { activityType, action, details, metadata } = req.body;

  if (!user || !activityType || !action) {
    res.status(400);
    throw new Error('Missing required fields');
  }

  await logActivity(
    user._id.toString(),
    user.name || 'User',
    activityType,
    action,
    details,
    metadata
  );

  res.status(201).json({ success: true, message: 'Activity logged' });
}));

// Get current user's activities
router.get('/my-activities', getUserActivities);

// Get recent activities (for dashboard)
router.get('/recent', getRecentActivities);

// Get activity statistics
router.get('/stats', getActivityStats);

// Get global activity feed
router.get('/feed', getGlobalActivityFeed);

export default router;
