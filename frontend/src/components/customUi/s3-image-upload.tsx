import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface S3ImageUploadProps {
  value?: string | File;
  onChange: (value: File | string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

const S3ImageUpload: React.FC<S3ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    typeof value === 'string' ? value : undefined
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handlePreview(file);
    }
  };

  const handlePreview = (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (10MB max - will be compressed during upload)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    // Show success message for file selection
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    toast.success(`Image selected (${fileSizeMB}MB) - will be optimized and uploaded to S3 when form is submitted`);

    // Store the file for later upload
    onChange(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };


  // Manage preview URL for File value
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (typeof value === 'string') {
      setPreviewUrl(value);
    } else {
      setPreviewUrl(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Show file size for preview
  const getFileSize = () => {
    if (value instanceof File) {
      const sizeInMB = (value.size / (1024 * 1024)).toFixed(2);
      return `${sizeInMB} MB`;
    }
    return null;
  };



  // Handle remove
  const handleRemove = () => {
    toast.success('Image removed');
    onRemove();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          disabled={disabled}
          className="relative"
        >
          <Upload className="h-4 w-4 mr-2" />
          {value ? 'Change Image' : 'Select Image'}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
          title="Select image file"
        />
      </div>


      {previewUrl && (
        <div className="relative inline-block">
          <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          {value instanceof File && (
            <div className="text-xs text-gray-500 mt-1 space-y-1">
              <p>File size: {getFileSize()}</p>
            </div>
          )}
        </div>
      )}

      {!value && (
        <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-xs text-gray-500">No image</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default S3ImageUpload;