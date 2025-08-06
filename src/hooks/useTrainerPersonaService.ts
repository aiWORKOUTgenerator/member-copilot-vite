import { useMemo } from 'react';
import { useApiService } from './useApiService';
import { TrainerPersonaService } from '../domain/interfaces/services/TrainerPersonaService';
import { TrainerPersonaServiceImpl } from '../services/trainerPersona/TrainerPersonaServiceImpl';

/**
 * Hook to get a TrainerPersonaService instance with authentication configured
 * @returns A TrainerPersonaService instance with authentication configured
 */
export function useTrainerPersonaService(): TrainerPersonaService {
  // Get the authenticated API service
  const apiService = useApiService();

  // Create a memoized TrainerPersonaService instance that will only change when dependencies change
  const trainerPersonaService = useMemo(() => {
    return new TrainerPersonaServiceImpl(apiService);
  }, [apiService]);

  return trainerPersonaService;
}
