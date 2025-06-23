"use client";

import {
  WorkoutInstance,
  WorkoutInstanceStructure,
} from "@/domain/entities/workoutInstance";
import { Exercise } from "@/domain/entities/generatedWorkout";
import {
  UpdateWorkoutInstanceRequest,
  RecommendedExercise,
} from "@/domain/interfaces/services/WorkoutInstanceService";
import { useWorkoutInstanceService } from "@/hooks/useWorkoutInstanceService";
import { useAuth } from "@/hooks/auth";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router";

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

const CurrentWorkoutInstanceContext = createContext<
  CurrentWorkoutInstanceState | undefined
>(undefined);

interface CurrentWorkoutInstanceProviderProps {
  children: ReactNode;
}

/**
 * Provider for managing a single current workout instance
 */
export function CurrentWorkoutInstanceProvider({
  children,
}: CurrentWorkoutInstanceProviderProps) {
  const workoutInstanceService = useWorkoutInstanceService();
  const { isSignedIn } = useAuth();
  const [currentInstance, setCurrentInstance] =
    useState<WorkoutInstance | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPendingChanges, setHasPendingChanges] = useState<boolean>(false);
  const params = useParams();

  const loadInstance = useCallback(
    async (instanceId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const instance = await workoutInstanceService.getWorkoutInstance(
          instanceId
        );
        setCurrentInstance(instance);
        setHasPendingChanges(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load workout instance"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [workoutInstanceService]
  );

  useEffect(() => {
    if (params?.id && isSignedIn) {
      loadInstance(params.id as string);
    }
  }, [params?.id, isSignedIn, loadInstance]);

  const clearInstance = useCallback(() => {
    setCurrentInstance(null);
    setHasPendingChanges(false);
    setError(null);
  }, []);

  const updateInstanceOptimistically = useCallback(
    (updates: Partial<WorkoutInstance>) => {
      setCurrentInstance((prev) => {
        if (!prev) return null;

        const updatedInstance = {
          ...prev,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        setHasPendingChanges(true);
        return updatedInstance;
      });
    },
    []
  );

  const updateInstanceJsonFormatOptimistically = useCallback(
    (jsonFormat: WorkoutInstanceStructure) => {
      updateInstanceOptimistically({ jsonFormat });
    },
    [updateInstanceOptimistically]
  );

  const updateInstance = useCallback(
    async (instanceId: string, request: UpdateWorkoutInstanceRequest) => {
      try {
        const updatedInstance =
          await workoutInstanceService.updateWorkoutInstance(
            instanceId,
            request
          );

        // Update current instance if it's the same one
        if (currentInstance?.id === instanceId) {
          setCurrentInstance(updatedInstance);
          setHasPendingChanges(false);
        }

        return updatedInstance;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update workout instance";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [workoutInstanceService, currentInstance]
  );

  const deleteInstance = useCallback(
    async (instanceId: string) => {
      try {
        await workoutInstanceService.deleteWorkoutInstance(instanceId);

        // Clear current instance if it's the one being deleted
        if (currentInstance?.id === instanceId) {
          clearInstance();
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to delete workout instance";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [workoutInstanceService, currentInstance, clearInstance]
  );

  const syncToServer = useCallback(async () => {
    if (!currentInstance || !hasPendingChanges) return;

    try {
      const updateRequest: UpdateWorkoutInstanceRequest = {
        performedAt: currentInstance.performedAt,
        duration: currentInstance.duration,
        notes: currentInstance.notes,
        completed: currentInstance.completed,
        jsonFormat: currentInstance.jsonFormat || undefined,
      };

      const updatedInstance =
        await workoutInstanceService.updateWorkoutInstance(
          currentInstance.id,
          updateRequest
        );

      setCurrentInstance(updatedInstance);
      setHasPendingChanges(false);
    } catch (err) {
      console.error("Failed to sync instance to server:", err);
      throw err;
    }
  }, [currentInstance, hasPendingChanges, workoutInstanceService]);

  const getExerciseRecommendations = useCallback(
    async (currentExercise: Exercise): Promise<RecommendedExercise[]> => {
      try {
        const request = {
          currentExercise: {
            name: currentExercise.name,
            description: currentExercise.description,
            sets: currentExercise.sets,
            reps: currentExercise.reps,
            weight: currentExercise.weight,
            duration: currentExercise.duration,
          },
        };

        return await workoutInstanceService.getExerciseRecommendations(request);
      } catch (error) {
        console.error("Error loading recommendations:", error);
        return [];
      }
    },
    [workoutInstanceService]
  );

  // Auto-sync to server after a delay (debounced sync)
  useEffect(() => {
    if (!hasPendingChanges) return;

    const timeoutId = setTimeout(() => {
      syncToServer().catch((err) => {
        console.warn("Auto-sync failed:", err);
      });
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [hasPendingChanges, syncToServer]);

  // Reset data when user signs out
  useEffect(() => {
    if (!isSignedIn) {
      clearInstance();
    }
  }, [isSignedIn, clearInstance]);

  const contextValue: CurrentWorkoutInstanceState = {
    currentInstance,
    isLoading,
    error,
    loadInstance,
    clearInstance,
    updateInstance,
    deleteInstance,
    updateInstanceOptimistically,
    updateInstanceJsonFormatOptimistically,
    syncToServer,
    hasPendingChanges,
    getExerciseRecommendations,
  };

  return (
    <CurrentWorkoutInstanceContext.Provider value={contextValue}>
      {children}
    </CurrentWorkoutInstanceContext.Provider>
  );
}

/**
 * Hook to access the current workout instance
 */
export function useCurrentWorkoutInstance(): CurrentWorkoutInstanceState {
  const context = useContext(CurrentWorkoutInstanceContext);

  if (context === undefined) {
    throw new Error(
      "useCurrentWorkoutInstance must be used within a CurrentWorkoutInstanceProvider"
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
