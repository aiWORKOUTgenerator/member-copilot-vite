import { useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkoutInstance } from '@/domain/entities/workoutInstance';
import { CreateWorkoutInstanceRequest } from '@/domain/interfaces/services/WorkoutInstanceService';
import { WorkoutInstancesState } from '@/contexts/workout-instances.types';
import { useWorkoutInstanceService } from '@/hooks/useWorkoutInstanceService';
import { useAuth } from '@/hooks/auth';

/**
 * Hook to access and manage the workout instances list using React Query
 */
export function useWorkoutInstances(): WorkoutInstancesState {
  const workoutInstanceService = useWorkoutInstanceService();
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const instancesQuery = useQuery<WorkoutInstance[], unknown>({
    queryKey: ['workoutInstances'],
    queryFn: () => workoutInstanceService.getWorkoutInstances(),
    enabled: isSignedIn === true,
    staleTime: 30_000,
  });

  const createMutation = useMutation<
    WorkoutInstance,
    unknown,
    CreateWorkoutInstanceRequest
  >({
    mutationFn: (request: CreateWorkoutInstanceRequest) =>
      workoutInstanceService.createWorkoutInstance(request),
    onSuccess: (newInstance: WorkoutInstance) => {
      queryClient.setQueryData<WorkoutInstance[] | undefined>(
        ['workoutInstances'],
        (prev) => (prev ? [...prev, newInstance] : [newInstance])
      );
    },
  });

  const createInstance = useCallback(
    (request: CreateWorkoutInstanceRequest) =>
      createMutation.mutateAsync(request),
    [createMutation]
  );

  const updateInstanceInList = useCallback(
    (updatedInstance: WorkoutInstance) => {
      queryClient.setQueryData<WorkoutInstance[] | undefined>(
        ['workoutInstances'],
        (prev) =>
          prev
            ? prev.map((i) =>
                i.id === updatedInstance.id ? updatedInstance : i
              )
            : prev
      );
    },
    [queryClient]
  );

  const getInstancesByGeneratedWorkoutId = useCallback(
    (generatedWorkoutId: string) => {
      const list: WorkoutInstance[] = instancesQuery.data ?? [];
      return list.filter(
        (instance) => instance.generatedWorkoutId === generatedWorkoutId
      );
    },
    [instancesQuery.data]
  );

  // Reset data when user signs out (parity with previous provider behavior)
  useEffect(() => {
    if (isSignedIn === false) {
      queryClient.removeQueries({ queryKey: ['workoutInstances'] });
    }
  }, [isSignedIn, queryClient]);

  return {
    instances: instancesQuery.data ?? [],
    isLoading: instancesQuery.isFetching,
    isLoaded: instancesQuery.isFetched,
    error:
      instancesQuery.error instanceof Error
        ? instancesQuery.error.message
        : null,
    createInstance,
    updateInstanceInList,
    getInstancesByGeneratedWorkoutId,
  };
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
