import AWS from 'aws-sdk';
import { config } from 'dotenv';

config();

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  region: process.env.AWS_REGION || 'us-east-1'
});

export interface S3UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload base64 image to S3
 * @param base64Data - Base64 encoded image data
 * @param fileName - Name for the file
 * @param contentType - MIME type of the image
 * @returns Promise with upload response
 */
export async function uploadToS3(
  base64Data: string,
  fileName: string,
  contentType: string = 'image/jpeg'
): Promise<S3UploadResponse> {
  try {
    // Remove data:image/xxx;base64, prefix if present
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
    
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Image, 'base64');
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: `users/${Date.now()}-${fileName}`,
      Body: buffer,
      ContentType: contentType
    };

    const result = await s3.upload(params).promise();
    
    return {
      success: true,
      url: result.Location
    };
  } catch (error) {
    console.error('S3 Upload Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Delete file from S3
 * @param fileUrl - Full URL of the file to delete
 * @returns Promise with deletion response
 */
export async function deleteFromS3(fileUrl: string): Promise<S3UploadResponse> {
  try {
    // Extract the key from the URL
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // Remove leading slash
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key
    };

    await s3.deleteObject(params).promise();
    
    return {
      success: true
    };
  } catch (error) {
    console.error('S3 Delete Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}