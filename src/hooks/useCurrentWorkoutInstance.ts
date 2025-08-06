import { useContext } from "react";
import { WorkoutInstance } from "@/domain/entities/workoutInstance";
import {
  CurrentWorkoutInstanceContext,
  CurrentWorkoutInstanceState,
} from "@/contexts/current-workout-instance.types";

/**
 * Hook to access the current workout instance
 */
export function useCurrentWorkoutInstance(): CurrentWorkoutInstanceState {
  const context = useContext(CurrentWorkoutInstanceContext);

  if (context === undefined) {
    throw new Error(
      "useCurrentWorkoutInstance must be used within a CurrentWorkoutInstanceProvider",
    );
  }

  return context;
}

/**
 * Convenience hooks
 */
export function useCurrentWorkoutInstanceData(): WorkoutInstance | null {
  const { currentInstance } = useCurrentWorkoutInstance();
  return currentInstance;
}

export function useCurrentWorkoutInstanceLoading(): boolean {
  const { isLoading } = useCurrentWorkoutInstance();
  return isLoading;
}

export function useCurrentWorkoutInstanceError(): string | null {
  const { error } = useCurrentWorkoutInstance();
  return error;
}
