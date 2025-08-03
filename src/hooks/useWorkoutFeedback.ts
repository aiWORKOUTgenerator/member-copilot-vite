import { useContext } from "react";
import { WorkoutFeedback } from "@/domain/entities/workoutFeedback";
import {
  WorkoutFeedbackContext,
  WorkoutFeedbackState,
} from "@/contexts/workout-feedback.types";

/**
 * Custom hook to access the workout feedback data from the WorkoutFeedbackContext.
 * Throws an error if used outside of a WorkoutFeedbackProvider.
 */
export function useWorkoutFeedback(): WorkoutFeedbackState {
  const context = useContext(WorkoutFeedbackContext);

  if (context === undefined) {
    throw new Error(
      "useWorkoutFeedback must be used within a WorkoutFeedbackProvider"
    );
  }

  return context;
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
