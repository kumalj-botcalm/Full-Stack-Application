'use client';

import { UserSchema } from '@/schema';
import { z } from 'zod';
import { User } from '../table-column/UserColumns';
import { useAddUser, useUpdateUser } from '@/hooks/useUserMutations';
import { FormWrapper } from '@/components/customUi/form-wrapper';
import { FormInput } from '@/components/customUi/form-input';
import { FormSelect } from '@/components/customUi/form-select';
import { S3ImageUpload } from '@/components/customUi';
import { uploadImageToS3 } from '@/utils/upload';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

interface UserFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  user?: User | null; // If provided, form will be in edit mode
}

const UserForm = ({ open = false, onOpenChange, user }: UserFormProps) => {
  const addUserMutation = useAddUser();
  const updateUserMutation = useUpdateUser();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Define gender options
  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  // Default values for the form
  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    gender: undefined,
    image: '',
  };

  // Handle form submission with S3 upload
  const handleSubmit = async (data: z.infer<typeof UserSchema>) => {
    const loadingToast = toast.loading('Processing user...');
    
    try {
      setIsUploadingImage(true);
      
      // Handle image upload if it's a File object
      let imageUrl = data.image;
      if (data.image instanceof File) {
        // Show file size info
        const fileSizeMB = (data.image.size / (1024 * 1024)).toFixed(2);
        toast.loading(`Optimizing image (${fileSizeMB}MB)...`, { id: loadingToast });
        
        // Upload with to S3
        imageUrl = await uploadImageToS3(data.image);
        toast.loading('Saving user...', { id: loadingToast });
      } else {
        toast.loading('Saving user...', { id: loadingToast });
      }

      // Prepare the final data with uploaded image URL
      // Ensure image is string or undefined (not File)
      const finalData = {
        ...data,
        image: imageUrl === '' || imageUrl === null ? undefined : (typeof imageUrl === 'string' ? imageUrl : undefined),
      };

      console.log('User form submitted:', finalData);

      if (user) {
        // Edit mode - use React Query mutation
        await updateUserMutation.mutateAsync({ id: user._id, userData: { ...finalData, userId: user.userId } });
        console.log('User updated:', finalData);
      } else {
        // Add mode - use React Query mutation
        await addUserMutation.mutateAsync({ ...finalData, userId: 0 });
        console.log('User added:', finalData);
      }

      // Success feedback
      toast.success(
        user ? 'User updated successfully!' : 'User added successfully!',
        { id: loadingToast }
      );
      
      // Close the form after successful submission
      onOpenChange?.(false);
    } catch (error) {
      console.error('Submit error:', error);
      
      // Better error handling with specific messages
      let errorMessage = 'Failed to process user. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = 'Upload took too long. Please check your connection and try again.';
        } else if (error.message.includes('S3 upload')) {
          errorMessage = 'Image upload to S3 failed. Please try a different image.';
        } else if (error.message.includes('Network')) {
          errorMessage = 'Network error. Please check your connection.';
        }
      }
      
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Prepare initial data for edit mode
  const initialData = user
    ? {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        birthDate: user.birthDate,
        gender: user.gender,
        image: user.image || '',
      }
    : undefined;

  return (
    <FormWrapper
      open={open}
      onOpenChange={onOpenChange}
      entityName="User"
      schema={UserSchema}
      defaultValues={defaultValues}
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={isUploadingImage || addUserMutation.isPending || updateUserMutation.isPending}
    >
      {(form) => (
        <>
          <FormInput
            control={form.control}
            name="firstName"
            label="First Name"
            type="text"
            placeholder="Enter first name"
          />

          <FormInput
            control={form.control}
            name="lastName"
            label="Last Name"
            type="text"
            placeholder="Enter last name"
          />

          <FormInput
            control={form.control}
            name="email"
            label="Email"
            type="email"
            placeholder="Enter email"
          />

          <FormInput
            control={form.control}
            name="birthDate"
            label="Birth Date"
            type="date"
            placeholder="Select birth date"
          />

          <FormSelect
            control={form.control}
            name="gender"
            label="Gender"
            options={genderOptions}
            placeholder="Select gender"
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Image</label>
            <S3ImageUpload
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
};

export default UserForm;
