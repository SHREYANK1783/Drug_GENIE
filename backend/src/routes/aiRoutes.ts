import express from 'express';
import { chatWithAI, getConsultationHistory, clearConsultationHistory } from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Chat with AI (protected route - requires authentication)
router.post('/chat', protect, chatWithAI);

// Get consultation history (protected route)
router.get('/history', protect, getConsultationHistory);

// Clear consultation history (protected route)
router.delete('/history', protect, clearConsultationHistory);

export default router;
