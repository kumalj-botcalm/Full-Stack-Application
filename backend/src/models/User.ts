import mongoose, { Schema, Model } from 'mongoose';
import { IUser, IValidationResult, IUserInput } from '@/types/database';

/**
 * User Schema Definition
 */
const UserSchema = new Schema<IUser>({
  userId: {
    type: Number,
    required: true,
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
  birthDate: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  image: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

/**
 * User model methods
 */
UserSchema.methods.getFullName = function(this: IUser): string {
  return `${this.firstName} ${this.lastName}`;
};

/**
 * Static methods for User model
 */
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.findByUserId = function(userId: number) {
  return this.findOne({ userId });
};

/**
 * Validation helpers
 */
UserSchema.statics.validateUserData = function(userData: Partial<IUserInput>): IValidationResult {
  const { firstName, lastName, email, birthDate, gender } = userData;
  const missing: string[] = [];
  
  if (!firstName || firstName.trim() === '') missing.push('firstName');
  if (!lastName || lastName.trim() === '') missing.push('lastName');
  if (!email || email.trim() === '') missing.push('email');
  if (!birthDate) missing.push('birthDate');
  if (!gender) missing.push('gender');
  
  return {
    isValid: missing.length === 0,
    missing
  };
};

// Define the User model interface with static methods
interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findByUserId(userId: number): Promise<IUser | null>;
  validateUserData(userData: Partial<IUserInput>): IValidationResult;
}

const UserModel = mongoose.model<IUser, IUserModel>('User', UserSchema, 'users');

export default UserModel;