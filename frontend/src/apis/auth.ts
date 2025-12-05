import apiClient from '../libs/axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface SystemUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  mobileNumber: string;
  role: 'seller' | 'customer';
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  mobileNumber: string;
  role: 'seller' | 'customer';
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  birthDate?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: SystemUser;
  token?: string; // Added JWT token
  missing?: string[];
}

export interface EmailCheckResponse {
  success: boolean;
  available: boolean;
  message: string;
}

// Register a new user
export const registerUser = async (
  userData: RegisterData
): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>(
    `${API_BASE_URL}/api/auth/register`,
    userData
  );
  return data;
};

// Login user
export const loginUser = async (
  loginData: LoginData
): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>(
    `${API_BASE_URL}/api/auth/login`,
    loginData
  );
  return data;
};

// Check email availability
export const checkEmailAvailability = async (
  email: string
): Promise<EmailCheckResponse> => {
  const { data } = await apiClient.post<EmailCheckResponse>(
    `${API_BASE_URL}/api/auth/check-email`,
    { email }
  );
  return data;
};

// Get current user (requires authentication)
// export const getCurrentUser = async (): Promise<AuthResponse> => {
//   const { data } = await apiClient.get<AuthResponse>(
//     `${API_BASE_URL}/api/auth/me`
//   );
//   return data;
// };

// Update current user profile (requires authentication)
export const updateProfile = async (
  profileData: UpdateProfileData
): Promise<AuthResponse> => {
  const { data } = await apiClient.patch<AuthResponse>(
    `${API_BASE_URL}/api/auth/me`,
    profileData
  );
  return data;
};

// Change password (requires authentication)
export const changePassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
}): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>(
    `${API_BASE_URL}/api/auth/change-password`,
    passwordData
  );
  return data;
};
