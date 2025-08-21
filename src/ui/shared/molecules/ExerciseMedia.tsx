import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface ExerciseMediaProps {
  imageUrl?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'lg' | 'xl' | '2xl';
  showSkeleton?: boolean;
  className?: string;
}

export const ExerciseMedia: React.FC<ExerciseMediaProps> = ({
  imageUrl,
  alt,
  size = 'md',
  rounded = 'xl',
  showSkeleton = true,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Fixed container dimensions per size (image uses object-contain inside)
  const sizeClasses = {
    sm: 'w-64 h-40',
    md: 'w-80 h-56',
    lg: 'w-96 h-72',
  };

  // Rounded classes
  const roundedClasses = {
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
  };

  const containerClasses = `
    relative
    overflow-hidden
    bg-base-200/50
    backdrop-blur-xl
    border
    border-base-300
    ${roundedClasses[rounded]}
    shadow-sm
    ${sizeClasses[size]}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ');

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // No image URL provided
  if (!imageUrl) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center justify-center h-full w-full bg-base-200">
          <div className="text-center text-base-content/60">
            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">No image available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* Loading skeleton */}
      {isLoading && showSkeleton && (
        <div className="skeleton absolute inset-0" />
      )}

      {/* Error state */}
      {hasError && (
        <div className="flex items-center justify-center h-full w-full bg-base-200">
          <div className="text-center text-base-content/60">
            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      )}

      {/* Image */}
      {!hasError && (
        <img
          src={imageUrl}
          alt={alt}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`
            w-full
            h-full
            object-contain
            transition-opacity
            duration-300
            ${isLoading ? 'opacity-0' : 'opacity-100'}
          `
            .trim()
            .replace(/\s+/g, ' ')}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
};
