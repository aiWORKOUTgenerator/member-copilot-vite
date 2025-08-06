'use client';

import {
  WorkoutInstance,
  WorkoutInstanceStructure,
} from '@/domain/entities/workoutInstance';
import { Exercise } from '@/domain/entities/generatedWorkout';
import {
  UpdateWorkoutInstanceRequest,
  RecommendedExercise,
} from '@/domain/interfaces/services/WorkoutInstanceService';
import { useWorkoutInstanceService } from '@/hooks/useWorkoutInstanceService';
import { useAuth } from '@/hooks/auth';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  CurrentWorkoutInstanceContext,
  CurrentWorkoutInstanceState,
} from './current-workout-instance.types';

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
        const instance =
          await workoutInstanceService.getWorkoutInstance(instanceId);
        setCurrentInstance(instance);
        setHasPendingChanges(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load workout instance'
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
            : 'Failed to update workout instance';
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
            : 'Failed to delete workout instance';
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
      console.error('Failed to sync instance to server:', err);
      throw err;
    }
  }, [currentInstance, hasPendingChanges, workoutInstanceService]);

  const getExerciseRecommendations = useCallback(
    async (currentExercise: Exercise): Promise<RecommendedExercise[]> => {
      if (!currentInstance) {
        console.error(
          'No current instance available for exercise recommendations'
        );
        return [];
      }

      try {
        return await workoutInstanceService.getExerciseRecommendations(
          currentInstance.id,
          currentExercise.name,
          undefined, // reason - could be added as parameter later
          undefined // preferences - could be added as parameter later
        );
      } catch (error) {
        console.error('Error loading recommendations:', error);
        return [];
      }
    },
    [workoutInstanceService, currentInstance]
  );

  // Auto-sync to server after a delay (debounced sync)
  useEffect(() => {
    if (!hasPendingChanges) return;

    const timeoutId = setTimeout(() => {
      syncToServer().catch((err) => {
        console.warn('Auto-sync failed:', err);
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
