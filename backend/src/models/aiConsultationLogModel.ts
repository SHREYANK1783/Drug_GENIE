import mongoose, { Document, Schema } from 'mongoose';

export interface IAIConsultationLog extends Document {
  userId: string;
  question: string;
  response: string;
  createdAt: Date;
}

const aiConsultationLogSchema = new Schema<IAIConsultationLog>(
  {
    userId: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AIConsultationLog = mongoose.model<IAIConsultationLog>('AIConsultationLog', aiConsultationLogSchema);

export default AIConsultationLog;
