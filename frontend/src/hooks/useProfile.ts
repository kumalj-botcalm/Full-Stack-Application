import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile, changePassword } from '../apis/auth';
import { useAuthContext } from '../contexts/AuthContext';
import { toast } from 'sonner';

export const useProfileMutations = () => {
  const queryClient = useQueryClient();
  const { setUserData } = useAuthContext();

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Update the user data in the auth context
        setUserData(data.data);

        // Update any cached user data
        queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });

        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Password changed successfully!');
      } else {
        toast.error(data.message || 'Failed to change password');
      }
    },
    onError: (error: any) => {
      console.error('Password change error:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to change password';
      toast.error(errorMessage);
    },
  });

  return {
    updateProfile: updateProfileMutation,
    isUpdating: updateProfileMutation.isPending,
    changePassword: changePasswordMutation,
    isChangingPassword: changePasswordMutation.isPending,
  };
};
