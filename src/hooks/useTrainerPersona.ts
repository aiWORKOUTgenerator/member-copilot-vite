import { TrainerPersonaState } from '@/contexts/trainer-persona.types';
import {
  GenerationStartResponse,
  TrainerPersona,
} from '@/domain/entities/trainerPersona';
import { useAuth } from '@/hooks/auth';
import { useTrainerPersonaService } from '@/hooks/useTrainerPersonaService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

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
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 30_000,
  });

  const generateMutation = useMutation<GenerationStartResponse, unknown, void>({
    mutationFn: () => trainerPersonaService.generateTrainerPersona(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['trainerPersona'] });
      await queryClient.invalidateQueries({
        queryKey: ['trainerPersonaStatus'],
      });
    },
  });

  // Clear cache when user signs out
  useEffect(() => {
    if (isSignedIn === false) {
      queryClient.removeQueries({ queryKey: ['trainerPersona'] });
      queryClient.removeQueries({ queryKey: ['trainerPersonaStatus'] });
    }
  }, [isSignedIn, queryClient]);

  const refetch = async (): Promise<void> => {
    await query.refetch();
  };

  const generateTrainerPersona = async (): Promise<GenerationStartResponse> => {
    const result = await generateMutation.mutateAsync();
    return result;
  };

  // Determine if user has no persona based on the response structure
  const hasNoPersona = query.data?.has_persona === false || query.isError;

  // Check if persona is currently generating
  const isGenerating = query.data?.generation_status?.status === 'generating';

  return {
    trainerPersona: query.data ?? null,
    isLoading: query.isFetching || generateMutation.isPending,
    error:
      query.error instanceof Error
        ? query.error.message
        : generateMutation.error instanceof Error
          ? generateMutation.error.message
          : null,
    isLoaded: query.isFetched,
    hasNoPersona,
    isGenerating,
    isGenerationLoading: generateMutation.isPending,
    generationError:
      generateMutation.error instanceof Error
        ? generateMutation.error.message
        : null,
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
 * Convenience hook to check if trainer persona is currently generating
 */
export function useTrainerPersonaIsGenerating(): boolean {
  const { isGenerating } = useTrainerPersona();
  return isGenerating;
}

/**
 * Convenience hook to check if trainer persona generation is loading
 */
export function useTrainerPersonaGenerationLoading(): boolean {
  const { isGenerationLoading } = useTrainerPersona();
  return isGenerationLoading;
}

/**
 * Convenience hook to get trainer persona generation error
 */
export function useTrainerPersonaGenerationError(): string | null {
  const { generationError } = useTrainerPersona();
  return generationError;
}

/**
 * Convenience hook to generate a new trainer persona
 */
export function useGenerateTrainerPersona(): () => Promise<GenerationStartResponse> {
  const { generateTrainerPersona } = useTrainerPersona();
  return generateTrainerPersona;
}
