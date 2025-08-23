import { useMemo } from 'react';
import { ExerciseService } from '@/domain/interfaces/services/ExerciseService';
import { ExerciseServiceImpl } from '@/services/exercise/ExerciseServiceImpl';
import { MockExerciseService } from '@/services/exercise/MockExerciseService';
import { useApiService } from './useApiService';

export function useExerciseService(): ExerciseService {
  const apiService = useApiService();

  const exerciseService = useMemo(() => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      return new MockExerciseService();
    }
    return new ExerciseServiceImpl(apiService);
  }, [apiService]);

  return exerciseService;
}
