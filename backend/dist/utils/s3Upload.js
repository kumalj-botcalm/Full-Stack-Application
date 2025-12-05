"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = uploadToS3;
exports.deleteFromS3 = deleteFromS3;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1'
});
async function uploadToS3(base64Data, fileName, contentType = 'image/jpeg') {
    try {
        const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Image, 'base64');
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `users/${Date.now()}-${fileName}`,
            Body: buffer,
            ContentType: contentType
        };
        const result = await s3.upload(params).promise();
        return {
            success: true,
            url: result.Location
        };
    }
    catch (error) {
        console.error('S3 Upload Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}
async function deleteFromS3(fileUrl) {
    try {
        const url = new URL(fileUrl);
        const key = url.pathname.substring(1);
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key
        };
        await s3.deleteObject(params).promise();
        return {
            success: true
        };
    }
    catch (error) {
        console.error('S3 Delete Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}
//# sourceMappingURL=s3Upload.js.map