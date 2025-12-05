


/**
 * Convert file to base64 for S3 upload
 */
export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Upload image to AWS S3
 */
export const uploadImageToS3 = async (file: File): Promise<string> => {
  // Import dynamically to avoid circular dependency
  const { default: apiClient } = await import('@/libs/axios');
  
  // Convert to base64
  const base64Data = await convertToBase64(file);
  
  const response = await apiClient.post('/api/upload/s3', {
    base64Data,
    fileName: file.name,
    contentType: file.type,
  });

  return response.data.url;
};

/**
 * Upload image to Cloudinary
 */
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'products');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/dldcuv9jv/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.secure_url;
};