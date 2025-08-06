import { GeneratedWorkoutService } from '@/domain/interfaces/services/GeneratedWorkoutService';
import { GeneratedWorkoutServiceImpl } from '@/services/generated-workouts/GeneratedWorkoutServiceimpl';
import { useMemo } from 'react';
import { useApiService } from '@/hooks/useApiService';

export function useGeneratedWorkoutService(): GeneratedWorkoutService {
  const apiService = useApiService();

  const generatedWorkoutService = useMemo(() => {
    return new GeneratedWorkoutServiceImpl(apiService);
  }, [apiService]);

  return generatedWorkoutService;
}
