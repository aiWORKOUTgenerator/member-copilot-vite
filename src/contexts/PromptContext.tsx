"use client";

import { Prompt } from "@/domain/entities";
import { useAuth } from "@/hooks/auth";
import { usePromptService } from "@/hooks/usePromptService";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

/**
 * PromptState interface defines the shape of our prompt context value.
 */
export interface PromptState {
  prompts: Prompt[];
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Create the context with a default undefined value.
 * This forces consumers to use the usePrompts hook which performs a null check.
 */
const PromptContext = createContext<PromptState | undefined>(undefined);

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
      setError(err instanceof Error ? err.message : "Failed to fetch prompts");
      console.error("Error fetching prompts:", err);
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

/**
 * Custom hook to access the prompt data from the PromptContext.
 * Throws an error if used outside of a PromptProvider.
 */
export function usePrompts(): PromptState {
  const context = useContext(PromptContext);

  if (context === undefined) {
    throw new Error("usePrompts must be used within a PromptProvider");
  }

  return context;
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
