import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addProduct, updateProduct, deleteProduct } from '@/apis/products';
import { ProductFormData } from '@/schema';

// Hook for adding a new product
export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: ProductFormData) => addProduct(productData),
    onSuccess: () => {
      // Invalidate and refetch products data
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product added successfully');
    },
    onError: (error: any) => {
      console.error('Add product error:', error);
      const message = error.response?.data?.message || 'Failed to add product';
      toast.error(message);
    },
  });
};

// Hook for updating a product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...productData }: ProductFormData & { id: number }) =>
      updateProduct(id, productData),
    onSuccess: () => {
      // Invalidate and refetch products data
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
    onError: (error: any) => {
      console.error('Update product error:', error);
      const message = error.response?.data?.message || 'Failed to update product';
      toast.error(message);
    },
  });
};

// Hook for deleting a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => deleteProduct(productId),
    onSuccess: () => {
      // Invalidate and refetch products data
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      console.error('Delete product error:', error);
      const message = error.response?.data?.message || 'Failed to delete product';
      toast.error(message);
    },
  });
};