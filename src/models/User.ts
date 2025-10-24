import mongoose, { Document, Schema } from 'mongoose';
import { UserRole } from '../config/env';

export interface IUser extends Document {
  username: string;
  password: string;
  role: UserRole;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'user'] }
});

export const User = mongoose.model<IUser>('User', userSchema);