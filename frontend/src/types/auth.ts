// User data interface (matches backend)
export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  mobileNumber: string;
  role: 'seller' | 'customer';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

// JWT token payload interface
export interface TokenPayload {
  userId: number;
  name: string;
  email: string;
  role: 'seller' | 'customer';
  iat?: number;
  exp?: number;
}

// Authentication response interface
export interface AuthResponse {
  success: boolean;
  message: string;
  data: User;
  token: string;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Login form interface
export interface LoginForm {
  email: string;
  password: string;
}

// Register form interface
export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'seller' | 'customer';
  birthDate: string;
  mobileNumber: string;
}
