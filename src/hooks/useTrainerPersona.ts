import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TrainerPersona } from '@/domain/entities/trainerPersona';
import { TrainerPersonaState } from '@/contexts/trainer-persona.types';
import { useTrainerPersonaService } from '@/hooks/useTrainerPersonaService';
import { useAuth } from '@/hooks/auth';

/**
 * Hook to access trainer persona data using React Query
 */
export function useTrainerPersona(): TrainerPersonaState {
  const trainerPersonaService = useTrainerPersonaService();
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<TrainerPersona, unknown>({
    queryKey: ['trainerPersona'],
    queryFn: () => trainerPersonaService.getTrainerPersona(),
    enabled: isSignedIn === true,
    staleTime: 30_000,
  });

  const generateMutation = useMutation<void, unknown, void>({
    mutationFn: () => trainerPersonaService.generateTrainerPersona(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['trainerPersona'] });
    },
  });

  // Clear cache when user signs out
  useEffect(() => {
    if (isSignedIn === false) {
      queryClient.removeQueries({ queryKey: ['trainerPersona'] });
    }
  }, [isSignedIn, queryClient]);

  const refetch = async (): Promise<void> => {
    await query.refetch();
  };

  const generateTrainerPersona = async (): Promise<void> => {
    await generateMutation.mutateAsync();
    await query.refetch();
  };

  return {
    trainerPersona: query.data ?? null,
    isLoading: query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    isLoaded: query.isFetched,
    hasNoPersona: query.isError === true,
    refetch,
    generateTrainerPersona,
  };
}

/**
 * Convenience hook to get just the trainer persona data
 */
export function useTrainerPersonaData(): TrainerPersona | null {
  const { trainerPersona } = useTrainerPersona();
  return trainerPersona;
}

/**
 * Convenience hook to check if the trainer persona is loading
 */
export function useTrainerPersonaLoading(): boolean {
  const { isLoading } = useTrainerPersona();
  return isLoading;
}

/**
 * Convenience hook to check if the trainer persona is loaded
 */
export function useTrainerPersonaLoaded(): boolean {
  const { isLoaded } = useTrainerPersona();
  return isLoaded;
}

/**
 * Convenience hook to get any trainer persona loading error
 */
export function useTrainerPersonaError(): string | null {
  const { error } = useTrainerPersona();
  return error;
}

/**
 * Convenience hook to check if the user has no trainer persona assigned
 */
export function useTrainerPersonaHasNoPersona(): boolean {
  const { hasNoPersona } = useTrainerPersona();
  return hasNoPersona;
}

/**
 * Convenience hook to generate a new trainer persona
 */
export function useGenerateTrainerPersona(): () => Promise<void> {
  const { generateTrainerPersona } = useTrainerPersona();
  return generateTrainerPersona;
}
