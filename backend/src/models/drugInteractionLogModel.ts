import mongoose, { Document, Schema } from 'mongoose';

export interface IDrugInteractionLog extends Document {
  userId: string;
  medications: string[];
  interactionsFound: number;
  createdAt: Date;
}

const drugInteractionLogSchema = new Schema<IDrugInteractionLog>(
  {
    userId: {
      type: String,
      required: true,
    },
    medications: {
      type: [String],
      required: true,
    },
    interactionsFound: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const DrugInteractionLog = mongoose.model<IDrugInteractionLog>('DrugInteractionLog', drugInteractionLogSchema);

export default DrugInteractionLog;
