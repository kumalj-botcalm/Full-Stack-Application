import React, { useState } from 'react';

interface ImageViewerProps {
  src?: string;
  alt?: string;
  className?: string;
  width?: string;
  height?: string;
  fallbackSrc?: string;
  showPlaceholder?: boolean;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  src,
  alt = 'Image',
  className = '',
  width = 'w-48',
  height = 'h-48',
  fallbackSrc = '/placeholder-image.jpg',
  showPlaceholder = true,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const displaySrc = imageError || !src ? fallbackSrc : src;

  return (
    <div className={`relative ${width} ${height} ${className}`}>
      {src && !imageError ? (
        <img
          src={displaySrc}
          alt={alt}
          className={`${width} ${height} object-cover rounded-lg border shadow-sm`}
          onError={handleImageError}
        />
      ) : (
        showPlaceholder && (
          <div className={`${width} ${height} bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center`}>
            <div className="text-center p-4">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path 
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                  strokeWidth={2} 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
              <p className="text-sm text-gray-500">No image available</p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ImageViewer;