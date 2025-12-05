import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addUser, updateUser, deleteUser } from '@/apis/user';
import { User } from '@/pages/users/table-column/UserColumns';
import { toast } from 'sonner';

// Hook for adding a new user to MongoDB
export function useAddUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: Omit<User, '_id'>) => {
      return await addUser(userData);
    },
    onSuccess: (data) => {
      // Invalidate and refetch users data
      queryClient.invalidateQueries({ queryKey: ['users'] });

      // Use notification data from backend if available
      if (data.notification) {
        const { title, details } = data.notification;
        toast.success(title, {
          description: details,
        });
      } else {
        // Fallback to client-side message
        const userData = data.user;
        const userName = userData
          ? `${userData.firstName} ${userData.lastName}`
          : 'User';
        const userId = userData ? `ID: ${userData.userId}` : '';

        toast.success(`✅ ${userName} successfully added!`, {
          description: `${userId} - Account created and ready to use`,
        });
      }
    },
    onError: (error: any) => {
      console.error('Error adding user:', error);

      // Check if error response has notification data
      if (error?.response?.data?.notification) {
        const { title, message, details } = error.response.data.notification;
        toast.error(title, {
          description: `${message}${details ? ` - ${details}` : ''}`,
        });
      } else {
        // Fallback for errors without notification data
        toast.error('Failed to add user', {
          description:
            error?.response?.data?.error ||
            error.message ||
            'An unexpected error occurred',
        });
      }
    },
  });
}

// Hook for updating a user in MongoDB
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string;
      userData: Omit<User, '_id'>;
    }) => {
      return await updateUser(id, userData);
    },
    onSuccess: (data) => {
      // Invalidate and refetch users data
      queryClient.invalidateQueries({ queryKey: ['users'] });

      // Use notification data from backend if available
      if (data.notification) {
        const { title, details } = data.notification;
        toast.success(title, {
          description: details,
        });
      } else {
        // Fallback to client-side message
        const userData = data.user;
        const userName = userData
          ? `${userData.firstName} ${userData.lastName}`
          : 'User';

        toast.success(`🔄 ${userName} successfully updated!`, {
          description: 'User information has been saved',
        });
      }
    },
    onError: (error: any) => {
      console.error('Error updating user:', error);

      // Check if error response has notification data
      if (error?.response?.data?.notification) {
        const { title, message, details } = error.response.data.notification;
        toast.error(title, {
          description: `${message}${details ? ` - ${details}` : ''}`,
        });
      } else {
        // Fallback for errors without notification data
        toast.error('Failed to update user', {
          description:
            error?.response?.data?.error ||
            error.message ||
            'An unexpected error occurred',
        });
      }
    },
  });
}

// Hook for deleting a user from MongoDB
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return await deleteUser(userId);
    },
    onSuccess: (data) => {
      // Invalidate and refetch users data
      queryClient.invalidateQueries({ queryKey: ['users'] });

      // Use notification data from backend if available
      if (data.notification) {
        const { title, details } = data.notification;
        toast.success(title, {
          description: details,
        });
      } else {
        // Fallback to client-side message
        const userData = data.user;
        const userName = userData
          ? `${userData.firstName} ${userData.lastName}`
          : 'User';

        toast.success(` ${userName} : successfully deleted!`, {
          description: 'User account has been permanently removed',
        });
      }
    },
    onError: (error: any) => {
      console.error('Error deleting user:', error);

      // Check if error response has notification data
      if (error?.response?.data?.notification) {
        const { title, message, details } = error.response.data.notification;
        toast.error(title, {
          description: `${message}${details ? ` - ${details}` : ''}`,
        });
      } else {
        // Fallback for errors without notification data
        toast.error(' Failed to delete user', {
          description:
            error?.response?.data?.error ||
            error.message ||
            'An unexpected error occurred',
        });
      }
    },
  });
}
