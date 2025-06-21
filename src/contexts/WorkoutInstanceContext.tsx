"use client";

import { WorkoutInstance } from "@/domain/entities/workoutInstance";
import {
  CreateWorkoutInstanceRequest,
  UpdateWorkoutInstanceRequest,
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

/**
 * WorkoutInstanceState interface defines the shape of our workout instance context value.
 */
export interface WorkoutInstanceState {
  instances: WorkoutInstance[];
  currentInstance: WorkoutInstance | null;
  isLoading: boolean;
  isLoadingCurrentInstance: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  loadCurrentInstance: (instanceId: string) => Promise<void>;
  clearCurrentInstance: () => void;
  createInstance: (
    request: CreateWorkoutInstanceRequest
  ) => Promise<WorkoutInstance>;
  updateInstance: (
    instanceId: string,
    request: UpdateWorkoutInstanceRequest
  ) => Promise<WorkoutInstance>;
  deleteInstance: (instanceId: string) => Promise<void>;
  getInstancesByGeneratedWorkoutId: (
    generatedWorkoutId: string
  ) => WorkoutInstance[];
}

/**
 * Create the context with a default undefined value.
 * This forces consumers to use the useWorkoutInstances hook which performs a null check.
 */
const WorkoutInstanceContext = createContext<WorkoutInstanceState | undefined>(
  undefined
);

interface WorkoutInstanceProviderProps {
  children: ReactNode;
}

/**
 * WorkoutInstanceProvider component that makes workout instance data available to all child components.
 * It fetches workout instance data on mount and provides methods to create, update, and delete instances.
 */
export function WorkoutInstanceProvider({
  children,
}: WorkoutInstanceProviderProps) {
  const workoutInstanceService = useWorkoutInstanceService();
  const { isSignedIn } = useAuth();
  const [instances, setInstances] = useState<WorkoutInstance[]>([]);
  const [currentInstance, setCurrentInstance] =
    useState<WorkoutInstance | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingCurrentInstance, setIsLoadingCurrentInstance] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInstances = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await workoutInstanceService.getWorkoutInstances();
      setInstances(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch workout instances"
      );
    } finally {
      setIsLoading(false);
    }
  }, [workoutInstanceService]);

  const createInstance = useCallback(
    async (request: CreateWorkoutInstanceRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const newInstance = await workoutInstanceService.createWorkoutInstance(
          request
        );

        // Update state with the new instance
        setInstances((prevInstances) => [...prevInstances, newInstance]);

        return newInstance;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to create workout instance";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [workoutInstanceService]
  );

  const updateInstance = useCallback(
    async (instanceId: string, request: UpdateWorkoutInstanceRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedInstance =
          await workoutInstanceService.updateWorkoutInstance(
            instanceId,
            request
          );

        // Update state with the updated instance
        setInstances((prevInstances) =>
          prevInstances.map((instance) =>
            instance.id === instanceId ? updatedInstance : instance
          )
        );

        // Update current instance if it's the same one being updated
        setCurrentInstance((prevCurrent) =>
          prevCurrent && prevCurrent.id === instanceId
            ? updatedInstance
            : prevCurrent
        );

        return updatedInstance;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update workout instance";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [workoutInstanceService]
  );

  const deleteInstance = useCallback(
    async (instanceId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await workoutInstanceService.deleteWorkoutInstance(instanceId);

        // Remove the instance from state
        setInstances((prevInstances) =>
          prevInstances.filter((instance) => instance.id !== instanceId)
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to delete workout instance";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [workoutInstanceService]
  );

  const loadCurrentInstance = useCallback(
    async (instanceId: string) => {
      setIsLoadingCurrentInstance(true);
      setError(null);

      try {
        const instance = await workoutInstanceService.getWorkoutInstance(
          instanceId
        );
        setCurrentInstance(instance);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load workout instance"
        );
      } finally {
        setIsLoadingCurrentInstance(false);
      }
    },
    [workoutInstanceService]
  );

  const clearCurrentInstance = useCallback(() => {
    setCurrentInstance(null);
  }, []);

  const getInstancesByGeneratedWorkoutId = useCallback(
    (generatedWorkoutId: string) => {
      return instances.filter(
        (instance) => instance.generatedWorkoutId === generatedWorkoutId
      );
    },
    [instances]
  );

  // Fetch workout instance data when the component mounts
  useEffect(() => {
    if (isSignedIn) {
      fetchInstances();
    } else {
      setInstances([]);
    }
  }, [isSignedIn, fetchInstances]);

  // Memoized context value
  const contextValue: WorkoutInstanceState = {
    instances,
    currentInstance,
    isLoading,
    isLoadingCurrentInstance,
    error,
    refetch: fetchInstances,
    loadCurrentInstance,
    clearCurrentInstance,
    createInstance,
    updateInstance,
    deleteInstance,
    getInstancesByGeneratedWorkoutId,
  };

  return (
    <WorkoutInstanceContext.Provider value={contextValue}>
      {children}
    </WorkoutInstanceContext.Provider>
  );
}

/**
 * Custom hook to access the workout instance data from the WorkoutInstanceContext.
 * Throws an error if used outside of a WorkoutInstanceProvider.
 */
export function useWorkoutInstances(): WorkoutInstanceState {
  const context = useContext(WorkoutInstanceContext);

  if (context === undefined) {
    throw new Error(
      "useWorkoutInstances must be used within a WorkoutInstanceProvider"
    );
  }

  return context;
}

/**
 * Convenience hook to get just the instances array
 */
export function useWorkoutInstancesData(): WorkoutInstance[] {
  const { instances } = useWorkoutInstances();
  return instances;
}

/**
 * Convenience hook to check if the instances are loading
 */
export function useWorkoutInstancesLoading(): boolean {
  const { isLoading } = useWorkoutInstances();
  return isLoading;
}

/**
 * Convenience hook to get any instances loading error
 */
export function useWorkoutInstancesError(): string | null {
  const { error } = useWorkoutInstances();
  return error;
}

/**
 * Hook to get a specific workout instance by ID
 */
export function useWorkoutInstance(id: string): WorkoutInstance | undefined {
  const { instances } = useWorkoutInstances();
  return instances.find((instance) => instance.id === id);
}

/**
 * Hook to get workout instances for a specific generated workout
 */
export function useWorkoutInstancesByGeneratedWorkoutId(
  generatedWorkoutId: string
): WorkoutInstance[] {
  const { getInstancesByGeneratedWorkoutId } = useWorkoutInstances();
  return getInstancesByGeneratedWorkoutId(generatedWorkoutId);
}

/**
 * Hook to get the current workout instance
 */
export function useCurrentWorkoutInstance(): WorkoutInstance | null {
  const { currentInstance } = useWorkoutInstances();
  return currentInstance;
}

/**
 * Hook to check if the current instance is loading
 */
export function useCurrentWorkoutInstanceLoading(): boolean {
  const { isLoadingCurrentInstance } = useWorkoutInstances();
  return isLoadingCurrentInstance;
}
