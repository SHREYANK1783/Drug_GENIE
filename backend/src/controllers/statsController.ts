import { Request, Response } from 'express';
import User from '../models/userModel';
import BloodRequest from '../models/bloodRequestModel';
import Reminder from '../models/reminderModel';
import DrugInteractionLog from '../models/drugInteractionLogModel';
import AIConsultationLog from '../models/aiConsultationLogModel';

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get total users count (all registered users)
    const totalUsers = await User.countDocuments();

    // Get total blood requests (all blood requests, not just active)
    const totalBloodRequests = await BloodRequest.countDocuments();

    // Get total drug interaction checks
    const totalInteractions = await DrugInteractionLog.countDocuments();

    // Get total AI consultations
    const totalAIConsultations = await AIConsultationLog.countDocuments();

    // Calculate stats
    const stats = {
      activeUsers: totalUsers, // Total registered users
      interactionsChecked: totalInteractions, // Total drug interaction checks performed
      aiConsultations: totalAIConsultations, // Total AI consultations
      bloodRequests: totalBloodRequests, // Total blood requests
    };

    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ 
      message: 'Error fetching dashboard statistics',
      error: error.message 
    });
  }
};

// Get user-specific statistics
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get user's reminders count
    const userReminders = await Reminder.countDocuments({ 
      userId,
      isActive: true 
    });

    // Get user's blood requests count
    const userBloodRequests = await BloodRequest.countDocuments({ 
      requesterId: userId,
      status: 'active'
    });

    const userStats = {
      activeReminders: userReminders,
      bloodRequests: userBloodRequests,
      accountAge: calculateAccountAge(user?.createdAt),
    };

    res.json(userStats);
  } catch (error: any) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ 
      message: 'Error fetching user statistics',
      error: error.message 
    });
  }
};

// Helper function to calculate account age in days
const calculateAccountAge = (createdAt: Date | undefined): number => {
  if (!createdAt) return 0;
  const now = new Date();
  const created = new Date(createdAt);
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Log a drug interaction check
export const logDrugInteraction = async (req: Request, res: Response) => {
  try {
    const { medications, interactionsFound } = req.body;
    const userId = (req as any).user?.id || 'anonymous';

    const log = await DrugInteractionLog.create({
      userId,
      medications,
      interactionsFound: interactionsFound || 0,
    });

    res.status(201).json({
      message: 'Drug interaction logged successfully',
      log,
    });
  } catch (error: any) {
    console.error('Error logging drug interaction:', error);
    res.status(500).json({
      message: 'Error logging drug interaction',
      error: error.message,
    });
  }
};

// Log an AI consultation
export const logAIConsultation = async (req: Request, res: Response) => {
  try {
    const { question, response } = req.body;
    const userId = (req as any).user?.id || 'anonymous';

    const log = await AIConsultationLog.create({
      userId,
      question,
      response,
    });

    res.status(201).json({
      message: 'AI consultation logged successfully',
      log,
    });
  } catch (error: any) {
    console.error('Error logging AI consultation:', error);
    res.status(500).json({
      message: 'Error logging AI consultation',
      error: error.message,
    });
  }
};
