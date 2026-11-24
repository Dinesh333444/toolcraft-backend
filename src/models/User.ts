import { Schema, model, Document } from 'mongoose';

export type UserRole = 'BUYER' | 'MANUFACTURER_ADMIN' | 'MANUFACTURER_STAFF' | 'MODERATOR' | 'SUPER_ADMIN';
export type UserStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  firstName: string;
  lastName: string;
  companyName?: string;
  facilityLocation?: string;
  specialization?: string;
  standards?: string;
  phoneNumber?: string;
  taxId?: string;
  idProofDocument?: string;
  rejectionReason?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['BUYER', 'MANUFACTURER_ADMIN', 'MANUFACTURER_STAFF', 'MODERATOR', 'SUPER_ADMIN'], 
      default: 'BUYER' 
    },
    status: {
      type: String,
      enum: ['PENDING_APPROVAL', 'ACTIVE', 'REJECTED', 'SUSPENDED'],
      default: 'ACTIVE'
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true },
    facilityLocation: { type: String, trim: true },
    specialization: { type: String, trim: true },
    standards: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    taxId: { type: String, trim: true },
    idProofDocument: { type: String, trim: true },
    rejectionReason: { type: String, trim: true },
    isEmailVerified: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', UserSchema);
