"use client";

import {
  WorkoutFeedback,
  CreateWorkoutFeedbackRequest,
} from "@/domain/entities/workoutFeedback";
import { useWorkoutFeedbackService } from "@/hooks/useWorkoutFeedbackService";
import { useAuth } from "@/hooks/auth";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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
const WorkoutFeedbackContext = createContext<WorkoutFeedbackState | undefined>(
  undefined
);

interface WorkoutFeedbackProviderProps {
  children: ReactNode;
}

/**
 * WorkoutFeedbackProvider component that makes feedback data available to all child components.
 * It fetches user feedback on mount and provides methods to submit and manage feedback.
 */
export function WorkoutFeedbackProvider({
  children,
}: WorkoutFeedbackProviderProps) {
  const workoutFeedbackService = useWorkoutFeedbackService();
  const { isSignedIn } = useAuth();
  const [userFeedback, setUserFeedback] = useState<WorkoutFeedback[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchUserFeedback = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await workoutFeedbackService.getUserFeedback();
      setUserFeedback(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch user feedback"
      );
    } finally {
      setIsLoading(false);
    }
  }, [workoutFeedbackService]);

  const submitFeedback = useCallback(
    async (request: CreateWorkoutFeedbackRequest) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const newFeedback = await workoutFeedbackService.submitFeedback(
          request
        );

        // Update state with the new feedback
        setUserFeedback((prevFeedback) => [...prevFeedback, newFeedback]);

        return newFeedback;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to submit feedback";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [workoutFeedbackService]
  );

  const getFeedbackForWorkout = useCallback(
    async (workoutId: string) => {
      try {
        return await workoutFeedbackService.getFeedbackForWorkout(workoutId);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch workout feedback";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [workoutFeedbackService]
  );

  const updateFeedback = useCallback(
    async (feedbackId: string, request: CreateWorkoutFeedbackRequest) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const updatedFeedback = await workoutFeedbackService.updateFeedback(
          feedbackId,
          request
        );

        // Update state with the updated feedback
        setUserFeedback((prevFeedback) =>
          prevFeedback.map((feedback) =>
            feedback.id === feedbackId ? updatedFeedback : feedback
          )
        );

        return updatedFeedback;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update feedback";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [workoutFeedbackService]
  );

  // Fetch user feedback when the component mounts
  useEffect(() => {
    if (isSignedIn) {
      fetchUserFeedback();
    } else {
      setUserFeedback([]);
    }
  }, [isSignedIn, fetchUserFeedback]);

  // Memoized context value
  const contextValue: WorkoutFeedbackState = {
    userFeedback,
    isLoading,
    isSubmitting,
    error,
    refetch: fetchUserFeedback,
    submitFeedback,
    getFeedbackForWorkout,
    updateFeedback,
    clearError,
  };

  return (
    <WorkoutFeedbackContext.Provider value={contextValue}>
      {children}
    </WorkoutFeedbackContext.Provider>
  );
}

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
