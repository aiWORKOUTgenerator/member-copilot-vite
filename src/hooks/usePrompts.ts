import { useContext } from 'react';
import { Prompt } from '@/domain/entities';
import { PromptContext, PromptState } from '@/contexts/prompt.types';

/**
 * Custom hook to access the prompt data from the PromptContext.
 * Throws an error if used outside of a PromptProvider.
 */
export function usePrompts(): PromptState {
  const context = useContext(PromptContext);

  if (context === undefined) {
    throw new Error('usePrompts must be used within a PromptProvider');
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
