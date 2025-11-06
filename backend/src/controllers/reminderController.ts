import expressAsyncHandler from 'express-async-handler';
import Reminder from '../models/reminderModel';
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';

// Get user reminders
const getReminders = expressAsyncHandler(async (req: AuthRequest, res: Response) => {
  const reminders = await Reminder.find({ userId: req.user?._id }).sort({ createdAt: -1 });
  
  // Map MongoDB _id to id for frontend compatibility
  const mappedReminders = reminders.map(reminder => ({
    id: reminder._id,
    userId: reminder.userId,
    medicineName: reminder.medicineName,
    dosage: reminder.dosage,
    frequency: reminder.frequency,
    times: reminder.times,
    startDate: reminder.startDate,
    endDate: reminder.endDate,
    isActive: reminder.isActive,
    notes: reminder.notes,
  }));
  
  res.json(mappedReminders);
});

// Create new reminder
const createReminder = expressAsyncHandler(async (req: AuthRequest, res: Response) => {
  const { medicineName, dosage, frequency, times, startDate, endDate, notes } = req.body;

  const reminder = await Reminder.create({
    userId: req.user?._id,
    medicineName,
    dosage,
    frequency,
    times,
    startDate,
    endDate,
    isActive: true,
    notes,
  });

  // Map response for frontend compatibility
  res.status(201).json({
    id: reminder._id,
    userId: reminder.userId,
    medicineName: reminder.medicineName,
    dosage: reminder.dosage,
    frequency: reminder.frequency,
    times: reminder.times,
    startDate: reminder.startDate,
    endDate: reminder.endDate,
    isActive: reminder.isActive,
    notes: reminder.notes,
  });
});

// Delete reminder
const deleteReminder = expressAsyncHandler(async (req: AuthRequest, res: Response) => {
  const reminder = await Reminder.findById(req.params.id);

  if (!reminder) {
    res.status(404);
    throw new Error('Reminder not found');
  }

  // Check if reminder belongs to user
  if (reminder.userId.toString() !== req.user?._id?.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this reminder');
  }

  await Reminder.findByIdAndDelete(req.params.id);
  res.json({ message: 'Reminder deleted successfully' });
});

export { getReminders, createReminder, deleteReminder };