import { useContext } from "react";
import { WorkoutInstance } from "@/domain/entities/workoutInstance";
import {
  WorkoutInstancesContext,
  WorkoutInstancesState,
} from "@/contexts/workout-instances.types";

/**
 * Hook to access the workout instances list
 */
export function useWorkoutInstances(): WorkoutInstancesState {
  const context = useContext(WorkoutInstancesContext);

  if (context === undefined) {
    throw new Error(
      "useWorkoutInstances must be used within a WorkoutInstancesProvider"
    );
  }

  return context;
}

/**
 * Convenience hooks
 */
export function useWorkoutInstancesData(): WorkoutInstance[] {
  const { instances } = useWorkoutInstances();
  return instances;
}

export function useWorkoutInstancesLoading(): boolean {
  const { isLoading } = useWorkoutInstances();
  return isLoading;
}

export function useWorkoutInstancesError(): string | null {
  const { error } = useWorkoutInstances();
  return error;
}

export function useWorkoutInstancesByGeneratedWorkoutId(
  generatedWorkoutId: string
): WorkoutInstance[] {
  const { getInstancesByGeneratedWorkoutId } = useWorkoutInstances();
  return getInstancesByGeneratedWorkoutId(generatedWorkoutId);
}
