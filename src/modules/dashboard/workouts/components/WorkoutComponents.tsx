'use client';

import { Exercise } from '@/domain/entities/generatedWorkout';
import { formatTime } from '../utils/workouts.func';

// Exercise component to display a single exercise
export const ExerciseCard = ({ exercise }: { exercise: Exercise }) => {
  if (!exercise || typeof exercise !== 'object') {
    return (
      <div className="p-2 bg-error bg-opacity-10 rounded">
        Invalid exercise data
      </div>
    );
  }

  return (
    <div className="bg-base-200 p-4 rounded-lg mb-3">
      <h4 className="text-lg font-semibold">
        {exercise.name || 'Unnamed Exercise'}
      </h4>
      {exercise.description && (
        <p className="text-sm opacity-70 mt-1">{exercise.description}</p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
        {exercise.sets !== undefined && (
          <div className="stat-box">
            <span className="text-xs opacity-60">Sets</span>
            <span className="text-lg font-semibold">{exercise.sets}</span>
          </div>
        )}
        {exercise.reps !== undefined && (
          <div className="stat-box">
            <span className="text-xs opacity-60">Reps</span>
            <span className="text-lg font-semibold">{exercise.reps}</span>
          </div>
        )}
        {exercise.weight !== undefined && (
          <div className="stat-box">
            <span className="text-xs opacity-60">Weight</span>
            <span className="text-lg font-semibold">
              {exercise.weight > 0 ? `${exercise.weight} lbs` : 'Bodyweight'}
            </span>
          </div>
        )}
        {exercise.duration !== undefined && (
          <div className="stat-box">
            <span className="text-xs opacity-60">Duration</span>
            <span className="text-lg font-semibold">
              {formatTime(exercise.duration)}
            </span>
          </div>
        )}
        {exercise.rest !== undefined && exercise.rest > 0 && (
          <div className="stat-box">
            <span className="text-xs opacity-60">Rest</span>
            <span className="text-lg font-semibold">
              {formatTime(exercise.rest)}
            </span>
          </div>
        )}
      </div>
      {exercise.superset_exercise && (
        <div className="mt-3 border-l-4 border-primary pl-3">
          <div className="text-xs uppercase font-bold text-primary mb-1">
            Superset with
          </div>
          <ExerciseCard exercise={exercise.superset_exercise} />
        </div>
      )}
      <style>{`
        .stat-box {
          background: rgba(0, 0, 0, 0.05);
          padding: 0.5rem;
          border-radius: 0.375rem;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
};

// Error display component for invalid workout data
export const InvalidWorkoutCard = ({ title }: { title?: string }) => (
  <div className="bg-base-100 border border-error rounded-lg">
    <div className="p-4">
      <h2 className="card-title text-error">
        {title || 'Oops! Something went wrong'}
      </h2>
      <p>
        We couldn&apos;t display your workout correctly. The workout data might
        be missing or in an unexpected format.
      </p>
    </div>
  </div>
);

// Empty sections warning component
export const EmptySectionsCard = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => (
  <div className="bg-base-100 border border-warning rounded-lg">
    <div className="p-4">
      <h2 className="card-title">{title || 'Workout'}</h2>
      {description && <p>{description}</p>}
      <div className="alert alert-warning mt-4">
        <p>No workout sections found. This workout may be incomplete.</p>
      </div>
    </div>
  </div>
);
