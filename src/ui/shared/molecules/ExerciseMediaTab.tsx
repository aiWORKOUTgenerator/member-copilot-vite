'use client';

import { ExerciseMediaWithAudio } from './ExerciseMediaWithAudio';

interface ExerciseMediaTabProps {
  imageUrl?: string | null;
  audioUrl?: string | null;
  exerciseName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ExerciseMediaTab: React.FC<ExerciseMediaTabProps> = ({
  imageUrl,
  audioUrl,
  exerciseName,
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-base-content">
          Media & Resources
        </h3>
        <p className="text-sm text-base-content/70 mt-1">
          Visual and audio guides for {exerciseName}
        </p>
      </div>

      <ExerciseMediaWithAudio
        imageUrl={imageUrl}
        audioUrl={audioUrl}
        exerciseName={exerciseName}
        size={size}
        className="w-full"
      />
    </div>
  );
};
