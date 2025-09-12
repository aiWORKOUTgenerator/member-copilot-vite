import { GeneratedWorkoutState } from '@/contexts/generated-workout.types';
import { GeneratedWorkout } from '@/domain/entities/generatedWorkout';
import { WorkoutParams } from '@/domain/entities/workoutParams';
import { useAuth } from '@/hooks/auth';
import { useGeneratedWorkoutService } from '@/hooks/useGeneratedWorkoutService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

/**
 * Hook to access generated workouts using React Query
 */
export function useGeneratedWorkouts(): GeneratedWorkoutState {
  const generatedWorkoutService = useGeneratedWorkoutService();
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<GeneratedWorkout[], unknown>({
    queryKey: ['generatedWorkouts'],
    queryFn: () => generatedWorkoutService.getGeneratedWorkouts(),
    enabled: isSignedIn === true,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  const createMutation = useMutation<
    GeneratedWorkout,
    unknown,
    { configId: string; workoutParams: WorkoutParams; prompt: string }
  >({
    mutationFn: ({ configId, workoutParams, prompt }) =>
      generatedWorkoutService.createGeneratedWorkout(
        configId,
        workoutParams,
        prompt
      ),
    onSuccess: (newWorkout) => {
      queryClient.setQueryData<GeneratedWorkout[] | undefined>(
        ['generatedWorkouts'],
        (prev) => (prev ? [...prev, newWorkout] : [newWorkout])
      );
    },
  });

  useEffect(() => {
    if (isSignedIn === false) {
      queryClient.removeQueries({ queryKey: ['generatedWorkouts'] });
    }
  }, [isSignedIn, queryClient]);

  const refetch = async (): Promise<void> => {
    await query.refetch();
  };

  const createWorkout = async (
    configId: string,
    workoutParams: WorkoutParams,
    prompt: string
  ): Promise<GeneratedWorkout> => {
    const result = await createMutation.mutateAsync({
      configId,
      workoutParams,
      prompt,
    });
    return result;
  };

  return {
    workouts: query.data ?? [],
    isLoading: query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    refetch,
    createWorkout,
  };
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
