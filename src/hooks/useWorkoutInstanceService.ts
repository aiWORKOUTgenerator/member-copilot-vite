import { useApiService } from './useApiService';
import { WorkoutInstanceService } from '@/domain/interfaces/services/WorkoutInstanceService';
import { WorkoutInstanceServiceImpl } from '@/services/workout-instances/WorkoutInstanceServiceImpl';
import { useMemo } from 'react';

export function useWorkoutInstanceService(): WorkoutInstanceService {
  const apiService = useApiService();
  const workoutInstanceService = useMemo(() => {
    //return new MockWorkoutInstanceService();
    return new WorkoutInstanceServiceImpl(apiService);
  }, [apiService]);

  return workoutInstanceService;
}
