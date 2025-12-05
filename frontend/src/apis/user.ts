import apiClient from '@/libs/axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface PaginatedUsersResponse<TUser = any> {
  users: TUser[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function fetchUsers(
  params?: PaginationParams
): Promise<PaginatedUsersResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `${API_BASE_URL}/api/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (err) {
    console.error('Error fetching users:', err);
    throw new Error('Failed to fetch users');
  }
}

// Keep the old function for backward compatibility (returns all users)
// export async function fetchAllUsers(): Promise<any[]> {
//   try {
//     const response = await fetchUsers({ page: 1, limit: 1000 }); // Large limit to get all
//     return response.users;
//   } catch (err) {
//     console.error('Error fetching all users:', err);
//     throw new Error('Failed to fetch users');
//   }
// }

// Add new user to MongoDB
export async function addUser(userData: {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender?: string;
  image?: string;
}) {
  try {
    const response = await apiClient.post(
      `${API_BASE_URL}/api/users`,
      userData
    );
    console.log('User added successfully:', response.data);
    return response.data;
  } catch (err: any) {
    console.error('Error adding user:', err);

    // Extract error message from server response
    const errorMessage =
      err.response?.data?.error || err.message || 'Failed to add user';
    throw new Error(errorMessage);
  }
}

// Update user in MongoDB
export async function updateUser(
  userId: string,
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    gender?: string;
    image?: string;
  }
) {
  try {
    const response = await apiClient.put(
      `${API_BASE_URL}/api/users/${userId}`,
      userData
    );
    console.log('User updated successfully:', response.data);
    return response.data;
  } catch (err: any) {
    console.error('Error updating user:', err);

    // Extract error message from server response
    const errorMessage =
      err.response?.data?.error || err.message || 'Failed to update user';
    throw new Error(errorMessage);
  }
}

// Delete user from MongoDB
export async function deleteUser(userId: string) {
  try {
    const response = await apiClient.delete(
      `${API_BASE_URL}/api/users/${userId}`
    );
    console.log('User deleted successfully:', response.data);
    return response.data;
  } catch (err: any) {
    console.error('Error deleting user:', err);

    // Extract error message from server response
    const errorMessage =
      err.response?.data?.error || err.message || 'Failed to delete user';
    throw new Error(errorMessage);
  }
}
