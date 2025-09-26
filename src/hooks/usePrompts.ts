import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Prompt } from '@/domain/entities';
import { PromptState } from '@/contexts/prompt.types';
import { usePromptService } from '@/hooks/usePromptService';
import { useAuth } from '@/hooks/auth';

/**
 * Hook to access prompts using React Query
 */
export function usePrompts(): PromptState {
  const promptService = usePromptService();
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<Prompt[], unknown>({
    queryKey: ['prompts'],
    queryFn: () => promptService.getAllPrompts(),
    enabled: isSignedIn === true,
  });

  useEffect(() => {
    if (isSignedIn === false) {
      queryClient.removeQueries({ queryKey: ['prompts'] });
    }
  }, [isSignedIn, queryClient]);

  const refetch = async (): Promise<void> => {
    await query.refetch();
  };

  return {
    prompts: query.data ?? [],
    isLoading: query.isFetching,
    isLoaded: query.isFetched,
    error: query.error instanceof Error ? query.error.message : null,
    refetch,
  };
}

/**
 * Convenience hook to get just the prompts array
 */
export function usePromptsData(): Prompt[] {
  const { prompts } = usePrompts();
  return prompts;
}

/**
 * Hook to get a specific prompt by ID
 */
export function usePrompt(id: string): Prompt | undefined {
  const { prompts } = usePrompts();
  return prompts.find((prompt) => prompt.id === id);
}

/**
 * Convenience hook to check if the prompts are loading
 */
export function usePromptsLoading(): boolean {
  const { isLoading } = usePrompts();
  return isLoading;
}

/**
 * Convenience hook to get any prompts loading error
 */
export function usePromptsError(): string | null {
  const { error } = usePrompts();
  return error;
}

/**
 * Convenience hook to check if the prompts are loaded
 */
export function usePromptsLoaded(): boolean {
  const { isLoaded } = usePrompts();
  return isLoaded;
}
