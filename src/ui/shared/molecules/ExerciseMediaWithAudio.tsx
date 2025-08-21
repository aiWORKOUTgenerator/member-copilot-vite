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

  // If neither image nor audio is available, return null
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
      {hasImage && (
        <ExerciseMedia
          imageUrl={imageUrl}
          alt={exerciseName}
          size={size}
          rounded={rounded}
          showSkeleton={showImageSkeleton}
        />
      )}

      {/* Exercise Audio */}
      {hasAudio && (
        <ExerciseAudio
          audioUrl={audioUrl}
          exerciseName={exerciseName}
          autoPlay={autoPlayAudio}
        />
      )}
    </div>
  );
};
