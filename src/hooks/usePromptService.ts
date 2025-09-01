import { PromptService } from '@/domain/interfaces/services/PromptService';
import { useServices } from './useServices';

/**
 * Hook to access the PromptService
 * @returns An instance of PromptService
 */
export function usePromptService(): PromptService {
  const { promptService } = useServices();
  return promptService;
}
