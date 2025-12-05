import { ProductSchema } from '@/schema';
import { z } from 'zod';
import { Product } from '../columns/product-columns';
import { useAddProduct, useUpdateProduct } from '../../../hooks/useProductMutations';
import { FormWrapper } from '@/components/customUi/form-wrapper';
import { FormInput } from '@/components/customUi/form-input';
import { FormSelect } from '@/components/customUi/form-select';
import { FormTextarea } from '@/components/customUi/form-textarea';
import { ImageUpload } from '@/components/customUi';
import { uploadImageToCloudinary } from '@/utils/upload';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

type ProductFormData = z.infer<typeof ProductSchema>;

interface ProductFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  mode: 'create' | 'edit';
}

// Product categories
const categoryOptions = [
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Books', label: 'Books' },
  { value: 'Home & Garden', label: 'Home & Garden' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Beauty', label: 'Beauty' },
  { value: 'Food & Beverages', label: 'Food & Beverages' },
  { value: 'Toys', label: 'Toys' },
  { value: 'Automotive', label: 'Automotive' },
  { value: 'Health', label: 'Health' },
];

export default function ProductForm({
  isOpen,
  onOpenChange,
  product,
  mode,
}: ProductFormProps) {
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const defaultValues = {
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    price: product?.price?.toString() || '',
    image: product?.image || '',
  };

  // Prepare initialData with proper string formatting for edit mode
  const initialData = product ? {
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price.toString(), // Ensure price is string for form validation
    image: product.image || '',
  } : undefined;

  const handleSubmit = async (data: ProductFormData) => {
    const loadingToast = toast.loading('Processing product...');
    
    try {
      setIsUploadingImage(true);
      
      // Handle image upload if it's a File object
      let imageUrl = data.image;
      if (data.image instanceof File) {
        // Update loading message for image upload
        toast.loading('Compressing and uploading image...', { id: loadingToast });
        imageUrl = await uploadImageToCloudinary(data.image);
        toast.loading('Saving product...', { id: loadingToast });
      } else {
        toast.loading('Saving product...', { id: loadingToast });
      }

      // Prepare the final data with uploaded image URL
      const finalData = {
        ...data,
        image: imageUrl,
      };

      // Submit product data
      if (mode === 'create') {
        await addProductMutation.mutateAsync(finalData);
      } else if (mode === 'edit' && product) {
        await updateProductMutation.mutateAsync({
          id: product.productId,
          ...finalData,
        });
      }
      
      // Success feedback
      toast.success(
        mode === 'create' ? 'Product added successfully!' : 'Product updated successfully!',
        { id: loadingToast }
      );
      
      // Close the dialog after successful submission
      onOpenChange(false);
    } catch (error) {
      console.error('Submit error:', error);
      
      // Better error handling with specific messages
      let errorMessage = 'Failed to process product. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = 'Upload took too long. Please check your connection and try again.';
        } else if (error.message.includes('Upload failed')) {
          errorMessage = 'Image upload failed. Please try a different image.';
        } else if (error.message.includes('Network')) {
          errorMessage = 'Network error. Please check your connection.';
        }
      }
      
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <FormWrapper
      open={isOpen}
      onOpenChange={onOpenChange}
      entityName="Product"
      schema={ProductSchema}
      defaultValues={defaultValues}
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={isUploadingImage || addProductMutation.isPending || updateProductMutation.isPending}
    >
      {(form) => (
        <>
          <FormInput
            control={form.control}
            name="name"
            label="Product Name"
            placeholder="Enter product name"
          />
          
          <FormTextarea
            control={form.control}
            name="description"
            label="Description"
            placeholder="Enter product description"
          />
          
          <FormSelect
            control={form.control}
            name="category"
            label="Category"
            placeholder="Select category"
            options={categoryOptions}
          />
          
          <FormInput
            control={form.control}
            name="price"
            label="Price (LKR)"
            type="number"
            placeholder="Enter price"
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Image</label>
            <ImageUpload
              value={form.watch('image')}
              onChange={(fileOrUrl: File | string) => form.setValue('image', fileOrUrl)}
              onRemove={() => form.setValue('image', '')}
              disabled={isUploadingImage}
            />
          </div>
        </>
      )}
    </FormWrapper>
  );
}