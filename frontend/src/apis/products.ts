import apiClient from '@/libs/axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  category?: string;
}

export interface PaginatedProductsResponse<TProduct = any> {
  products: TProduct[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export async function fetchProducts(
  params?: PaginationParams
): Promise<PaginatedProductsResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.category) queryParams.append('category', params.category);

    const url = `${API_BASE_URL}/api/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (err) {
    console.error('Error fetching products:', err);
    throw new Error('Failed to fetch products');
  }
}

export interface ProductData {
  name: string;
  description: string;
  category: string;
  price: number;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Add new product with timeout and retry logic
export const addProduct = async (productData: ProductData): Promise<ApiResponse> => {
  try {
    const { data } = await apiClient.post<ApiResponse>(
      `${API_BASE_URL}/api/products`,
      productData,
      {
        timeout: 15000, // 15 second timeout
      }
    );
    return data;
  } catch (error) {
    if (error instanceof Error && error.message.includes('timeout')) {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
};

// Update product with timeout and retry logic
export const updateProduct = async (
  productId: number,
  productData: ProductData
): Promise<ApiResponse> => {
  try {
    const { data } = await apiClient.put<ApiResponse>(
      `${API_BASE_URL}/api/products/${productId}`,
      productData,
      {
        timeout: 15000, // 15 second timeout
      }
    );
    return data;
  } catch (error) {
    if (error instanceof Error && error.message.includes('timeout')) {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId: number): Promise<ApiResponse> => {
  const { data } = await apiClient.delete<ApiResponse>(
    `${API_BASE_URL}/api/products/${productId}`
  );
  return data;
};

// Keep the old function for backward compatibility (returns all products)
// export async function fetchAllProducts(): Promise<any[]> {
//   try {
//     const response = await fetchProducts({ page: 1, limit: 1000 }); // Large limit to get all
//     return response.products;
//   } catch (err) {
//     console.error('Error fetching all products:', err);
//     throw new Error('Failed to fetch products');
//   }
// }