import express from 'express';
import { getDashboardStats, getUserStats, logDrugInteraction, logAIConsultation } from '../controllers/statsController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public route - get general dashboard statistics
router.get('/dashboard', getDashboardStats);

// Protected route - get user-specific statistics
router.get('/user', protect, getUserStats);

// Log drug interaction check
router.post('/log-interaction', logDrugInteraction);

// Log AI consultation
router.post('/log-consultation', logAIConsultation);

export default router;
