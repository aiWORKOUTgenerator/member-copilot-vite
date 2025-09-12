import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TrainerPersonaStatus } from '@/domain/entities/trainerPersona';
import { useTrainerPersonaService } from '@/hooks/useTrainerPersonaService';
import { useAuth } from '@/hooks/auth';

/**
 * Hook to get trainer persona generation status with smart polling
 * Uses React Query's built-in refetchInterval for efficient polling
 */
export function useTrainerPersonaStatus(enablePolling: boolean = false) {
  const trainerPersonaService = useTrainerPersonaService();
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const previousStatusRef = useRef<string | null>(null);

  const query = useQuery<TrainerPersonaStatus, Error>({
    queryKey: ['trainerPersonaStatus'],
    queryFn: () => trainerPersonaService.getTrainerPersonaStatus(),
    enabled: isSignedIn === true,
    staleTime: 0, // Always fresh for polling
    retry: false,
    // Smart polling: poll every 5 seconds when enabled, but stop when generation is complete or failed
    refetchInterval: enablePolling
      ? (query) => {
          if (!query.state.data) return 5000; // Keep polling if no data yet

          const status = query.state.data.generation_status.status;

          // Stop polling if generation is complete, failed, or if there's no generation in progress
          if (
            status === 'completed' ||
            status === 'failed' ||
            status === 'none'
          ) {
            return false;
          }

          // Continue polling every 5 seconds if still generating
          return status === 'generating' ? 5000 : false;
        }
      : false,
    refetchIntervalInBackground: false, // Don't poll when tab is not active
  });

  // Watch for status changes and invalidate trainer persona when generation completes
  useEffect(() => {
    if (query.data?.generation_status.status) {
      const currentStatus = query.data.generation_status.status;
      const previousStatus = previousStatusRef.current;

      // If status changed from 'generating' to 'completed', invalidate trainer persona cache
      if (previousStatus === 'generating' && currentStatus === 'completed') {
        queryClient.invalidateQueries({ queryKey: ['trainerPersona'] });
      }

      previousStatusRef.current = currentStatus;
    }
  }, [query.data?.generation_status.status, queryClient]);

  // Clear cache when user signs out
  useEffect(() => {
    if (isSignedIn === false) {
      queryClient.removeQueries({ queryKey: ['trainerPersonaStatus'] });
    }
  }, [isSignedIn, queryClient]);

  const refetch = async (): Promise<void> => {
    await query.refetch();
  };

  return {
    status: query.data ?? null,
    isLoading: query.isFetching,
    error: query.error?.message ?? null,
    isLoaded: query.isFetched,
    refetch,
    // Helper to check if generation just completed
    isGenerationComplete: query.data?.generation_status.status === 'completed',
  };
}

/**
 * Convenience hook to get just the generation status
 */
export function useTrainerPersonaGenerationStatus() {
  const { status } = useTrainerPersonaStatus();
  return status?.generation_status ?? null;
}

/**
 * Convenience hook to get generation blocked reason
 */
export function useTrainerPersonaGenerationBlockedReason(): string | null {
  const { status } = useTrainerPersonaStatus();
  return status?.generation_blocked_reason ?? null;
}
