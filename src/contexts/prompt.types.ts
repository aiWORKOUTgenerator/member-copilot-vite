import { Prompt } from '@/domain/entities';
import { createContext } from 'react';

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
export const PromptContext = createContext<PromptState | undefined>(undefined);
