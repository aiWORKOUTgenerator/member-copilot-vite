import React from 'react';
import { ExerciseMedia } from './ExerciseMedia';
import { ExerciseAudio } from './ExerciseAudio';

interface ExerciseMediaWithAudioProps {
  imageUrl?: string | null;
  audioUrl?: string | null;
  exerciseName: string;
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'lg' | 'xl' | '2xl';
  showImageSkeleton?: boolean;
  className?: string;
  autoPlayAudio?: boolean;
}

export const ExerciseMediaWithAudio: React.FC<ExerciseMediaWithAudioProps> = ({
  imageUrl,
  audioUrl,
  exerciseName,
  size = 'md',
  rounded = 'xl',
  showImageSkeleton = true,
  className = '',
  autoPlayAudio = false,
}) => {
  const hasImage = Boolean(imageUrl);
  const hasAudio = Boolean(audioUrl);

  // If no media is available, don't render the component
  if (!hasImage && !hasAudio) {
    return null;
  }

  const containerClasses = `
    space-y-3
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ');

  return (
    <div className={containerClasses}>
      {/* Exercise Image */}
      {hasImage ? (
        <ExerciseMedia
          imageUrl={imageUrl}
          alt={exerciseName}
          size={size}
          rounded={rounded}
          showSkeleton={showImageSkeleton}
        />
      ) : (
        <div className="bg-base-200 border border-base-300 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-center h-32 text-base-content/60">
            <div className="text-center">
              <p className="text-sm font-medium">Image Currently Unavailable</p>
              <p className="text-xs opacity-70">
                Image for {exerciseName} is not available at this time
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Audio */}
      <ExerciseAudio
        audioUrl={audioUrl}
        exerciseName={exerciseName}
        autoPlay={autoPlayAudio}
      />
    </div>
  );
};
