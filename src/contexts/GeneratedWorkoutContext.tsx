"use client";

import { GeneratedWorkout } from "@/domain/entities/generatedWorkout";
import { WorkoutParams } from "@/domain/entities/workoutParams";
import { useGeneratedWorkoutService } from "@/hooks/useGeneratedWorkoutService";
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
const GeneratedWorkoutContext = createContext<
  GeneratedWorkoutState | undefined
>(undefined);

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
          : "Failed to fetch generated workouts"
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
          err instanceof Error ? err.message : "Failed to create workout";
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

/**
 * Custom hook to access the generated workout data from the GeneratedWorkoutContext.
 * Throws an error if used outside of a GeneratedWorkoutProvider.
 */
export function useGeneratedWorkouts(): GeneratedWorkoutState {
  const context = useContext(GeneratedWorkoutContext);

  if (context === undefined) {
    throw new Error(
      "useGeneratedWorkouts must be used within a GeneratedWorkoutProvider"
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
