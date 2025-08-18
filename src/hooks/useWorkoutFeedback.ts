import { WorkoutFeedbackState } from '@/contexts/workout-feedback.types';
import {
  CreateWorkoutFeedbackRequest,
  WorkoutFeedback,
} from '@/domain/entities/workoutFeedback';
import { useAuth } from '@/hooks/auth';
import { useWorkoutFeedbackService } from '@/hooks/useWorkoutFeedbackService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

/**
 * Hook to access workout feedback using React Query
 */
export function useWorkoutFeedback(): WorkoutFeedbackState {
  const workoutFeedbackService = useWorkoutFeedbackService();
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const feedbackQuery = useQuery<WorkoutFeedback[], unknown>({
    queryKey: ['workoutFeedback'],
    queryFn: () => workoutFeedbackService.getUserFeedback(),
    enabled: isSignedIn === true,
    staleTime: 30_000,
  });

  const submitMutation = useMutation<
    WorkoutFeedback,
    unknown,
    CreateWorkoutFeedbackRequest
  >({
    mutationFn: (request) => workoutFeedbackService.submitFeedback(request),
    onSuccess: (newFeedback) => {
      queryClient.setQueryData<WorkoutFeedback[] | undefined>(
        ['workoutFeedback'],
        (prev) => (prev ? [...prev, newFeedback] : [newFeedback])
      );
    },
  });

  const updateMutation = useMutation<
    WorkoutFeedback,
    unknown,
    { feedbackId: string; request: CreateWorkoutFeedbackRequest }
  >({
    mutationFn: ({ feedbackId, request }) =>
      workoutFeedbackService.updateFeedback(feedbackId, request),
    onSuccess: (updated) => {
      queryClient.setQueryData<WorkoutFeedback[] | undefined>(
        ['workoutFeedback'],
        (prev) =>
          prev ? prev.map((f) => (f.id === updated.id ? updated : f)) : prev
      );
    },
  });

  useEffect(() => {
    if (isSignedIn === false) {
      queryClient.removeQueries({ queryKey: ['workoutFeedback'] });
    }
  }, [isSignedIn, queryClient]);

  const refetch = async (): Promise<void> => {
    await feedbackQuery.refetch();
  };

  const submitFeedback = async (
    request: CreateWorkoutFeedbackRequest
  ): Promise<WorkoutFeedback> => {
    return submitMutation.mutateAsync(request);
  };

  const getFeedbackForWorkout = async (
    workoutId: string
  ): Promise<WorkoutFeedback | null> => {
    const list = feedbackQuery.data ?? [];
    return list.find((f) => f.workoutId === workoutId) ?? null;
  };

  const updateFeedback = async (
    feedbackId: string,
    request: CreateWorkoutFeedbackRequest
  ): Promise<WorkoutFeedback> => {
    return updateMutation.mutateAsync({ feedbackId, request });
  };

  const clearError = () => {
    // Errors are held in mutation/query states; nothing to clear globally.
  };

  return {
    userFeedback: feedbackQuery.data ?? [],
    isLoading: feedbackQuery.isFetching,
    isSubmitting: submitMutation.isPending || updateMutation.isPending,
    error:
      feedbackQuery.error instanceof Error
        ? feedbackQuery.error.message
        : submitMutation.error instanceof Error
          ? submitMutation.error.message
          : updateMutation.error instanceof Error
            ? updateMutation.error.message
            : null,
    refetch,
    submitFeedback,
    getFeedbackForWorkout,
    updateFeedback,
    clearError,
  };
}

/**
 * Convenience hook to get just the user feedback array
 */
export function useUserFeedbackData(): WorkoutFeedback[] {
  const { userFeedback } = useWorkoutFeedback();
  return userFeedback;
}

/**
 * Convenience hook to check if feedback is loading
 */
export function useWorkoutFeedbackLoading(): boolean {
  const { isLoading } = useWorkoutFeedback();
  return isLoading;
}

/**
 * Convenience hook to check if feedback is being submitted
 */
export function useWorkoutFeedbackSubmitting(): boolean {
  const { isSubmitting } = useWorkoutFeedback();
  return isSubmitting;
}

/**
 * Convenience hook to get any feedback error
 */
export function useWorkoutFeedbackError(): string | null {
  const { error } = useWorkoutFeedback();
  return error;
}

/**
 * Hook to get feedback for a specific workout
 */
export function useWorkoutFeedbackForWorkout(
  workoutId: string
): WorkoutFeedback | undefined {
  const { userFeedback } = useWorkoutFeedback();
  return userFeedback.find((feedback) => feedback.workoutId === workoutId);
}
