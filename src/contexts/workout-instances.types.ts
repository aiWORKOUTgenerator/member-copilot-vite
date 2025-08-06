import { WorkoutInstance } from "@/domain/entities/workoutInstance";
import { CreateWorkoutInstanceRequest } from "@/domain/interfaces/services/WorkoutInstanceService";
import { createContext } from "react";

/**
 * WorkoutInstancesState interface for managing the list of workout instances
 */
export interface WorkoutInstancesState {
  instances: WorkoutInstance[];
  isLoading: boolean;
  error: string | null;
  fetchInstances: () => Promise<void>;
  createInstance: (
    request: CreateWorkoutInstanceRequest,
  ) => Promise<WorkoutInstance>;
  updateInstanceInList: (updatedInstance: WorkoutInstance) => void;
  getInstancesByGeneratedWorkoutId: (
    generatedWorkoutId: string,
  ) => WorkoutInstance[];
}

export const WorkoutInstancesContext = createContext<
  WorkoutInstancesState | undefined
>(undefined);
