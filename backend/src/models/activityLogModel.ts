import mongoose, { Document, Model } from 'mongoose';

export interface IActivityLog extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  userName: string;
  activityType: string;
  action: string;
  details?: string;
  metadata?: {
    medicineName?: string;
    bloodGroup?: string;
    interactionCount?: number;
    consultationType?: string;
    [key: string]: any;
  };
  timestamp: Date;
}

interface IActivityLogModel extends Model<IActivityLog> {}

const activityLogSchema = new mongoose.Schema<IActivityLog, IActivityLogModel>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  userName: {
    type: String,
    required: true,
  },
  activityType: {
    type: String,
    required: true,
    enum: [
      'ai_consultation',
      'drug_interaction',
      'medicine_search',
      'medication_log',
      'blood_request',
      'symptom_check',
      'health_score',
      'reminder',
      'profile_update',
      'login',
      'register'
    ],
  },
  action: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Index for faster queries
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ timestamp: -1 });
activityLogSchema.index({ activityType: 1, timestamp: -1 });

const ActivityLog = mongoose.model<IActivityLog, IActivityLogModel>('ActivityLog', activityLogSchema);
export default ActivityLog;
