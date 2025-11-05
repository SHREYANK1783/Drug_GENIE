import mongoose, { Document, Model } from 'mongoose';

interface IMedicationLog extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  reminderId: mongoose.Schema.Types.ObjectId;
  medicineName: string;
  scheduledTime: Date;
  takenTime?: Date;
  status: 'taken' | 'missed' | 'skipped';
  notes?: string;
}

interface IMedicationLogModel extends Model<IMedicationLog> {}

const medicationLogSchema = new mongoose.Schema<IMedicationLog, IMedicationLogModel>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  reminderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Reminder',
  },
  medicineName: { type: String, required: true },
  scheduledTime: { type: Date, required: true },
  takenTime: { type: Date },
  status: { 
    type: String, 
    enum: ['taken', 'missed', 'skipped'],
    required: true 
  },
  notes: { type: String },
}, { timestamps: true });

// Index for faster queries
medicationLogSchema.index({ userId: 1, scheduledTime: -1 });
medicationLogSchema.index({ reminderId: 1 });

const MedicationLog = mongoose.model<IMedicationLog, IMedicationLogModel>('MedicationLog', medicationLogSchema);
export default MedicationLog;
