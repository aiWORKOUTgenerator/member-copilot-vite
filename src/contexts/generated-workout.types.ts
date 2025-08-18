import { GeneratedWorkout } from '@/domain/entities/generatedWorkout';
import { WorkoutParams } from '@/domain/entities/workoutParams';

/**
 * GeneratedWorkoutState interface defines the shape of our generated workout context value.
 */
export interface GeneratedWorkoutState {
  workouts: GeneratedWorkout[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createWorkout: (
    configId: string,
    workoutParams: WorkoutParams,
    prompt: string
  ) => Promise<GeneratedWorkout>;
}

/**
 * Create the context with a default undefined value.
 * This forces consumers to use the useGeneratedWorkouts hook which performs a null check.
 */
export {};
