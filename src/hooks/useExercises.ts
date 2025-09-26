import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Exercise } from '@/domain/entities/exercise';
import { ExerciseState } from '@/contexts/exercise.types';
import { useExerciseService } from './useExerciseService';
import { useAuth } from './auth';

interface UseExercisesOptions {
  generatedWorkoutId?: string;
  workoutId?: string;
  enabled?: boolean;
}

export function useExercises(options: UseExercisesOptions = {}): ExerciseState {
  const { generatedWorkoutId, workoutId, enabled = true } = options;
  const exerciseService = useExerciseService();
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const shouldFetch =
    isSignedIn === true && enabled && (!!generatedWorkoutId || !!workoutId);

  const query = useQuery<Exercise[], unknown>({
    queryKey: ['exercises', { generatedWorkoutId, workoutId }],
    queryFn: () => {
      if (generatedWorkoutId) {
        return exerciseService.getExercisesByGeneratedWorkoutId(
          generatedWorkoutId
        );
      } else if (workoutId) {
        return exerciseService.getExercisesByWorkoutId(workoutId);
      }
      return Promise.resolve([]);
    },
    enabled: shouldFetch,
  });

  useEffect(() => {
    if (isSignedIn === false) {
      queryClient.removeQueries({ queryKey: ['exercises'] });
    }
  }, [isSignedIn, queryClient]);

  const refetch = async (): Promise<void> => {
    await query.refetch();
  };

  return {
    exercises: query.data ?? [],
    isLoading: query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    refetch,
    isLoaded: query.isFetched,
  };
}

export function useExercisesForGeneratedWorkout(
  generatedWorkoutId: string
): ExerciseState {
  return useExercises({ generatedWorkoutId });
}

export function useExercisesForWorkout(workoutId: string): ExerciseState {
  return useExercises({ workoutId });
}
