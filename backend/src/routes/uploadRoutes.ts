import express, { Request, Response } from 'express';
import { uploadToS3, deleteFromS3 } from '@/utils/s3Upload';
import { createErrorResponse } from '@/types/response';
import { authenticateToken } from '@/middleware/auth';

const router = express.Router();

/**
 * POST /upload/s3 - Upload image to S3
 */
router.post('/s3', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { base64Data, fileName, contentType } = req.body;

    if (!base64Data || !fileName) {
      res.status(400).json(
        createErrorResponse('Base64 data and file name are required')
      );
      return;
    }

    // Validate content type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (contentType && !validTypes.includes(contentType)) {
      res.status(400).json(
        createErrorResponse('Invalid image format. Supported: JPEG, PNG, GIF, WebP')
      );
      return;
    }

    const result = await uploadToS3(base64Data, fileName, contentType);

    if (!result.success) {
      res.status(500).json(
        createErrorResponse(result.error || 'Failed to upload image')
      );
      return;
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: result.url
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json(
      createErrorResponse('Internal server error during upload')
    );
  }
});

/**
 * DELETE /upload/s3 - Delete image from S3
 */
router.delete('/s3', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileUrl } = req.body;

    if (!fileUrl) {
      res.status(400).json(
        createErrorResponse('File URL is required')
      );
      return;
    }

    const result = await deleteFromS3(fileUrl);

    if (!result.success) {
      res.status(500).json(
        createErrorResponse(result.error || 'Failed to delete image')
      );
      return;
    }

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json(
      createErrorResponse('Internal server error during deletion')
    );
  }
});

export default router;