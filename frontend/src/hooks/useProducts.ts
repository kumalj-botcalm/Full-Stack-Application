import { useQuery } from '@tanstack/react-query';
import {
  fetchProducts,
  PaginationParams,
  PaginatedProductsResponse,
} from '@/apis/products';

export function useProducts(params?: PaginationParams) {
  return useQuery<PaginatedProductsResponse>({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}


