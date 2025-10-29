export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  bloodGroup: string;
  gender: string;
  phone?: string;
  profilePhoto?: string;
  createdAt: Date;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  dosage: string;
  sideEffects: string[];
  warnings: string[];
  interactions: string[];
  description: string;
  manufacturer: string;
  price: number;
}

export interface Reminder {
  id: string;
  userId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  notes?: string;
}

export interface BloodRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  bloodGroup: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  contactNumber: string;
  hospitalName: string;
  unitsNeeded: number;
  createdAt: Date;
  status: 'active' | 'fulfilled' | 'expired' | 'cancelled';
}

export interface Symptom {
  id: string;
  name: string;
  category: string;
  severity: 'mild' | 'moderate' | 'severe';
  commonCauses: string[];
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}