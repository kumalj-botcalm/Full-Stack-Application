import { Document } from 'mongoose';

export interface IUser extends Document {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: 'Male' | 'Female' | 'Other';
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  getFullName(): string;
}

export interface IProduct extends Document {
  productId: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  getFormattedPrice(): string;
}

export interface ISystemUser extends Document {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
  mobileNumber: string;
  role: 'seller' | 'customer';
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  getFullName(): string;
}

export interface ICounter extends Document {
  _id: string;
  seq: number;
}

export interface IUserInput {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: 'Male' | 'Female' | 'Other';
  image?: string;
}

export interface ISystemUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  mobileNumber: string;
  role: 'seller' | 'customer';
}

export interface IValidationResult {
  isValid: boolean;
  missing: string[];
}