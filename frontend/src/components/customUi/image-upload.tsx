'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ImageUploadProps {
  value?: string | File;
  onChange: (file: File | string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    toast.success(`Image selected (${fileSizeMB}MB) - will be optimized during upload`);

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

  // Get image URL for display (either from File object or existing URL)
  const getImageUrl = () => {
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }
    return value;
  };

  // Show file size for preview
  const getFileSize = () => {
    if (value instanceof File) {
      const sizeInMB = (value.size / (1024 * 1024)).toFixed(2);
      return `${sizeInMB} MB`;
    }
    return null;
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
          {value instanceof File ? 'Change Image' : 'Select Image'}
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

      {value && (
        <div className="relative inline-block">
          <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            <img
              src={getImageUrl()}
              alt="Product Preview"
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={() => {
                // Clean up object URL if it's a File
                if (value instanceof File) {
                  const url = URL.createObjectURL(value);
                  URL.revokeObjectURL(url);
                }
                toast.success('Image removed');
                onRemove();
              }}
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          {value instanceof File && (
            <div className="text-xs text-gray-500 mt-1 space-y-1">
              <p>Preview - Image will be compressed and uploaded when form is submitted</p>
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
}