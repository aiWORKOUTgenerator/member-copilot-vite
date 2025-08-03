import { createContext } from "react";
import {
  WorkoutInstance,
  WorkoutInstanceStructure,
} from "@/domain/entities/workoutInstance";
import { Exercise } from "@/domain/entities/generatedWorkout";
import {
  UpdateWorkoutInstanceRequest,
  RecommendedExercise,
} from "@/domain/interfaces/services/WorkoutInstanceService";

/**
 * CurrentWorkoutInstanceState interface for managing a single workout instance
 */
export interface CurrentWorkoutInstanceState {
  currentInstance: WorkoutInstance | null;
  isLoading: boolean;
  error: string | null;
  loadInstance: (instanceId: string) => Promise<void>;
  clearInstance: () => void;
  updateInstance: (
    instanceId: string,
    request: UpdateWorkoutInstanceRequest
  ) => Promise<WorkoutInstance>;
  deleteInstance: (instanceId: string) => Promise<void>;
  updateInstanceOptimistically: (updates: Partial<WorkoutInstance>) => void;
  updateInstanceJsonFormatOptimistically: (
    jsonFormat: WorkoutInstanceStructure
  ) => void;
  syncToServer: () => Promise<void>;
  hasPendingChanges: boolean;
  getExerciseRecommendations: (
    currentExercise: Exercise
  ) => Promise<RecommendedExercise[]>;
}

export const CurrentWorkoutInstanceContext = createContext<
  CurrentWorkoutInstanceState | undefined
>(undefined);
