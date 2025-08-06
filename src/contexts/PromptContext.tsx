'use client';

import { Prompt } from '@/domain/entities';
import { useAuth } from '@/hooks/auth';
import { usePromptService } from '@/hooks/usePromptService';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { PromptContext, PromptState } from './prompt.types';

interface PromptProviderProps {
  children: ReactNode;
}

/**
 * PromptProvider component that makes prompt data available to all child components.
 * It fetches prompt data on mount and provides methods to refetch.
 */
export function PromptProvider({ children }: PromptProviderProps) {
  const promptService = usePromptService();
  const { isSignedIn } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrompts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await promptService.getAllPrompts();
      setPrompts(data);
      setIsLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prompts');
      console.error('Error fetching prompts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [promptService]);

  // Fetch prompt data when the component mounts
  useEffect(() => {
    if (isSignedIn) {
      fetchPrompts();
    } else {
      setPrompts([]);
      setIsLoaded(false);
    }
  }, [isSignedIn, fetchPrompts]);

  // Memoized context value
  const contextValue: PromptState = {
    prompts,
    isLoading,
    isLoaded,
    error,
    refetch: fetchPrompts,
  };

  return (
    <PromptContext.Provider value={contextValue}>
      {children}
    </PromptContext.Provider>
  );
}
