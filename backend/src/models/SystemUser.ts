import mongoose, { Schema, Model } from 'mongoose';
import { ISystemUser, ISystemUserInput, IValidationResult } from '@/types/database';
import { getNextSequence } from '@/config/database';

/**
 * System User Schema Definition for Authentication
 */
const SystemUserSchema = new Schema<ISystemUser>({
  userId: {
    type: Number,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  birthDate: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['seller', 'customer'],
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

/**
 * Pre-save hook to auto-generate userId
 */
SystemUserSchema.pre<ISystemUser>('save', async function(next) {
  if (this.isNew && !this.userId) {
    try {
      this.userId = await getNextSequence('system_user_id');
    } catch (error) {
      return next(error as any);
    }
  }
  next();
});

/**
 * System User model methods
 */
SystemUserSchema.methods.getFullName = function(this: ISystemUser): string {
  return `${this.firstName} ${this.lastName}`;
};

/**
 * Static methods for System User model
 */
SystemUserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

SystemUserSchema.statics.findByUserId = function(userId: number) {
  return this.findOne({ userId });
};

/**
 * Validation helpers for registration
 */
SystemUserSchema.statics.validateRegistrationData = function(userData: Partial<ISystemUserInput>): IValidationResult {
  const { firstName, lastName, email, birthDate, mobileNumber, role } = userData;
  const missing: string[] = [];
  
  if (!firstName || firstName.trim() === '') missing.push('firstName');
  if (!lastName || lastName.trim() === '') missing.push('lastName');
  if (!email || email.trim() === '') missing.push('email');
  if (!birthDate) missing.push('birthDate');
  if (!mobileNumber || mobileNumber.trim() === '') missing.push('mobileNumber');
  if (!role || !['seller', 'customer'].includes(role)) missing.push('role');
  
  return {
    isValid: missing.length === 0,
    missing
  };
};

/**
 * Validation helpers for login
 */
SystemUserSchema.statics.validateLoginData = function(userData: { email?: string; password?: string }): IValidationResult {
  const { email, password } = userData;
  const missing: string[] = [];
  
  if (!email || email.trim() === '') missing.push('email');
  if (!password || password.trim() === '') missing.push('password');
  
  return {
    isValid: missing.length === 0,
    missing
  };
};

// Define the System User model interface with static methods
interface ISystemUserModel extends Model<ISystemUser> {
  findByEmail(email: string): Promise<ISystemUser | null>;
  findByUserId(userId: number): Promise<ISystemUser | null>;
  validateRegistrationData(userData: Partial<ISystemUserInput>): IValidationResult;
  validateLoginData(userData: { email?: string; password?: string }): IValidationResult;
}

const SystemUserModel = mongoose.model<ISystemUser, ISystemUserModel>('SystemUser', SystemUserSchema, 'System_Users');

export default SystemUserModel;