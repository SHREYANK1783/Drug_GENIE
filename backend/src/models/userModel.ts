import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface to define the properties of a User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  age: number;
  bloodGroup: string;
  gender: string;
  phone?: string;
  profilePhoto?: string;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// Interface for the model to add static methods if needed
interface IUserModel extends Model<IUser> {}

const userSchema = new mongoose.Schema<IUser, IUserModel>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  bloodGroup: { type: String, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: false },
  profilePhoto: { type: String, required: false },
}, { timestamps: true });

// Middleware to hash password before saving a user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser, IUserModel>('User', userSchema);
export default User;