import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  registerUser,
  loginUser,
  checkEmailAvailability,
  type RegisterData,
  type LoginData,
  type AuthResponse,
  type EmailCheckResponse,
} from '../apis/auth';
import { useAuthContext } from '../contexts/AuthContext';

// Hook for user registration
export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation<AuthResponse, Error, RegisterData>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    },
  });
};

// Hook for user login
export const useLogin = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  return useMutation<AuthResponse, Error, LoginData>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.success && data.token && data.data) {
        login(data.token, data.data);
        toast.success(data.message);
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Login failed');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    },
  });
};

// Hook for checking email availability
export const useCheckEmail = () => {
  return useMutation<EmailCheckResponse, Error, string>({
    mutationFn: checkEmailAvailability,
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to check email availability';
      toast.error(message);
    },
  });
};
