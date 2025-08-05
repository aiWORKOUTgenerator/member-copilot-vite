"use client";

import {
  WorkoutFeedback,
  CreateWorkoutFeedbackRequest,
} from "@/domain/entities/workoutFeedback";
import { useWorkoutFeedbackService } from "@/hooks/useWorkoutFeedbackService";
import { useAuth } from "@/hooks/auth";
import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  WorkoutFeedbackContext,
  WorkoutFeedbackState,
} from "./workout-feedback.types";

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
        const newFeedback =
          await workoutFeedbackService.submitFeedback(request);

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
