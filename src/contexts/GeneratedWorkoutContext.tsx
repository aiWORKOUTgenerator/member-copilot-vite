'use client';

import { GeneratedWorkout } from '@/domain/entities/generatedWorkout';
import { WorkoutParams } from '@/domain/entities/workoutParams';
import { useGeneratedWorkoutService } from '@/hooks/useGeneratedWorkoutService';
import { useAuth } from '@/hooks/auth';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import {
  GeneratedWorkoutContext,
  GeneratedWorkoutState,
} from './generated-workout.types';

interface GeneratedWorkoutProviderProps {
  children: ReactNode;
}

/**
 * GeneratedWorkoutProvider component that makes workout data available to all child components.
 * It fetches workout data on mount and provides methods to refetch.
 */
export function GeneratedWorkoutProvider({
  children,
}: GeneratedWorkoutProviderProps) {
  const generatedWorkoutService = useGeneratedWorkoutService();
  const { isSignedIn } = useAuth();
  const [workouts, setWorkouts] = useState<GeneratedWorkout[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await generatedWorkoutService.getGeneratedWorkouts();
      setWorkouts(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch generated workouts'
      );
    } finally {
      setIsLoading(false);
    }
  }, [generatedWorkoutService]);

  const createWorkout = useCallback(
    async (configId: string, workoutParams: WorkoutParams, prompt: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const newWorkout = await generatedWorkoutService.createGeneratedWorkout(
          configId,
          workoutParams,
          prompt
        );

        // Update state with the new workout
        setWorkouts((prevWorkouts) => [...prevWorkouts, newWorkout]);

        return newWorkout;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create workout';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [generatedWorkoutService]
  );

  // Fetch workout data when the component mounts
  useEffect(() => {
    if (isSignedIn) {
      fetchWorkouts();
    } else {
      setWorkouts([]);
    }
  }, [isSignedIn, fetchWorkouts]);

  // Memoized context value
  const contextValue: GeneratedWorkoutState = {
    workouts,
    isLoading,
    error,
    refetch: fetchWorkouts,
    createWorkout,
  };

  return (
    <GeneratedWorkoutContext.Provider value={contextValue}>
      {children}
    </GeneratedWorkoutContext.Provider>
  );
}
