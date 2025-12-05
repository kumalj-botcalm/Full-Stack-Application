export interface S3UploadResponse {
    success: boolean;
    url?: string;
    error?: string;
}
export declare function uploadToS3(base64Data: string, fileName: string, contentType?: string): Promise<S3UploadResponse>;
export declare function deleteFromS3(fileUrl: string): Promise<S3UploadResponse>;
//# sourceMappingURL=s3Upload.d.ts.map