import {
  WorkoutFeedback,
  CreateWorkoutFeedbackRequest,
} from '@/domain/entities/workoutFeedback';

/**
 * WorkoutFeedbackState interface defines the shape of our workout feedback context value.
 */
export interface WorkoutFeedbackState {
  userFeedback: WorkoutFeedback[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  submitFeedback: (
    request: CreateWorkoutFeedbackRequest
  ) => Promise<WorkoutFeedback>;
  getFeedbackForWorkout: (workoutId: string) => Promise<WorkoutFeedback | null>;
  updateFeedback: (
    feedbackId: string,
    request: CreateWorkoutFeedbackRequest
  ) => Promise<WorkoutFeedback>;
  clearError: () => void;
}

/**
 * Create the context with a default undefined value.
 * This forces consumers to use the useWorkoutFeedback hook which performs a null check.
 */
export {};
