import { Document } from 'mongoose';
export interface IUser extends Document {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    gender: 'Male' | 'Female' | 'Other';
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
    inStock: boolean;
    createdAt: Date;
    updatedAt: Date;
    getFormattedPrice(): string;
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
}
export interface IProductInput {
    name: string;
    description: string;
    category: string;
    price: number;
    inStock: boolean;
}
export interface IValidationResult {
    isValid: boolean;
    missing: string[];
}
//# sourceMappingURL=database.d.ts.map