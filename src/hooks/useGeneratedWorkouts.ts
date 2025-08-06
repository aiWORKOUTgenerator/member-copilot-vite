import { useContext } from 'react';
import { GeneratedWorkout } from '@/domain/entities/generatedWorkout';
import {
  GeneratedWorkoutContext,
  GeneratedWorkoutState,
} from '@/contexts/generated-workout.types';

/**
 * Custom hook to access the generated workout data from the GeneratedWorkoutContext.
 * Throws an error if used outside of a GeneratedWorkoutProvider.
 */
export function useGeneratedWorkouts(): GeneratedWorkoutState {
  const context = useContext(GeneratedWorkoutContext);

  if (context === undefined) {
    throw new Error(
      'useGeneratedWorkouts must be used within a GeneratedWorkoutProvider'
    );
  }

  return context;
}

/**
 * Convenience hook to get just the workouts array
 */
export function useGeneratedWorkoutsData(): GeneratedWorkout[] {
  const { workouts } = useGeneratedWorkouts();
  return workouts;
}

/**
 * Convenience hook to check if the workouts are loading
 */
export function useGeneratedWorkoutsLoading(): boolean {
  const { isLoading } = useGeneratedWorkouts();
  return isLoading;
}

/**
 * Convenience hook to get any workouts loading error
 */
export function useGeneratedWorkoutsError(): string | null {
  const { error } = useGeneratedWorkouts();
  return error;
}

/**
 * Hook to get a specific workout by ID
 */
export function useGeneratedWorkout(id: string): GeneratedWorkout | undefined {
  const { workouts } = useGeneratedWorkouts();
  return workouts.find((workout) => workout.id === id);
}
