'use client';

import { WorkoutInstance } from '@/domain/entities/workoutInstance';
import { CreateWorkoutInstanceRequest } from '@/domain/interfaces/services/WorkoutInstanceService';
import { useWorkoutInstanceService } from '@/hooks/useWorkoutInstanceService';
import { useAuth } from '@/hooks/auth';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import {
  WorkoutInstancesContext,
  WorkoutInstancesState,
} from './workout-instances.types';

interface WorkoutInstancesProviderProps {
  children: ReactNode;
}

/**
 * Provider for managing the list of workout instances
 */
export function WorkoutInstancesProvider({
  children,
}: WorkoutInstancesProviderProps) {
  const workoutInstanceService = useWorkoutInstanceService();
  const { isSignedIn } = useAuth();
  const [instances, setInstances] = useState<WorkoutInstance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInstances = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await workoutInstanceService.getWorkoutInstances();
      setInstances(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch workout instances'
      );
    } finally {
      setIsLoading(false);
    }
  }, [workoutInstanceService]);

  const createInstance = useCallback(
    async (request: CreateWorkoutInstanceRequest) => {
      try {
        const newInstance =
          await workoutInstanceService.createWorkoutInstance(request);

        // Update state with the new instance
        setInstances((prevInstances) => [...prevInstances, newInstance]);

        return newInstance;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to create workout instance';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [workoutInstanceService]
  );

  const updateInstanceInList = useCallback(
    (updatedInstance: WorkoutInstance) => {
      setInstances((prevInstances) =>
        prevInstances.map((instance) =>
          instance.id === updatedInstance.id ? updatedInstance : instance
        )
      );
    },
    []
  );

  const getInstancesByGeneratedWorkoutId = useCallback(
    (generatedWorkoutId: string) => {
      return instances.filter(
        (instance) => instance.generatedWorkoutId === generatedWorkoutId
      );
    },
    [instances]
  );

  // Reset data when user signs out
  useEffect(() => {
    if (!isSignedIn) {
      setInstances([]);
      setError(null);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isSignedIn) {
      fetchInstances();
    }
  }, [isSignedIn, fetchInstances]);

  const contextValue: WorkoutInstancesState = {
    instances,
    isLoading,
    error,
    fetchInstances,
    createInstance,
    updateInstanceInList,
    getInstancesByGeneratedWorkoutId,
  };

  return (
    <WorkoutInstancesContext.Provider value={contextValue}>
      {children}
    </WorkoutInstancesContext.Provider>
  );
}
