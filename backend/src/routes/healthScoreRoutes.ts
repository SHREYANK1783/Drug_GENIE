import express from 'express';
import { getHealthScore } from '../controllers/healthScoreController_new';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get health score (activity-based, no reminders needed)
router.get('/', getHealthScore);

export default router;
