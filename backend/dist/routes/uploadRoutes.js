"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const s3Upload_1 = require("@/utils/s3Upload");
const response_1 = require("@/types/response");
const auth_1 = require("@/middleware/auth");
const router = express_1.default.Router();
router.post('/s3', auth_1.authenticateToken, async (req, res) => {
    try {
        const { base64Data, fileName, contentType } = req.body;
        if (!base64Data || !fileName) {
            res.status(400).json((0, response_1.createErrorResponse)('Base64 data and file name are required'));
            return;
        }
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (contentType && !validTypes.includes(contentType)) {
            res.status(400).json((0, response_1.createErrorResponse)('Invalid image format. Supported: JPEG, PNG, GIF, WebP'));
            return;
        }
        const result = await (0, s3Upload_1.uploadToS3)(base64Data, fileName, contentType);
        if (!result.success) {
            res.status(500).json((0, response_1.createErrorResponse)(result.error || 'Failed to upload image'));
            return;
        }
        res.json({
            success: true,
            message: 'Image uploaded successfully',
            url: result.url
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json((0, response_1.createErrorResponse)('Internal server error during upload'));
    }
});
router.delete('/s3', auth_1.authenticateToken, async (req, res) => {
    try {
        const { fileUrl } = req.body;
        if (!fileUrl) {
            res.status(400).json((0, response_1.createErrorResponse)('File URL is required'));
            return;
        }
        const result = await (0, s3Upload_1.deleteFromS3)(fileUrl);
        if (!result.success) {
            res.status(500).json((0, response_1.createErrorResponse)(result.error || 'Failed to delete image'));
            return;
        }
        res.json({
            success: true,
            message: 'Image deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete error:', error);
        res.status(500).json((0, response_1.createErrorResponse)('Internal server error during deletion'));
    }
});
exports.default = router;
//# sourceMappingURL=uploadRoutes.js.map