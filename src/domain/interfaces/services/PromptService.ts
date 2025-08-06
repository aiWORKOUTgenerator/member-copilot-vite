import { Prompt } from '@/domain/entities';

/**
 * Interface for PromptService
 * Following Interface Segregation Principle from SOLID
 */
export interface PromptService {
  getAllPrompts(): Promise<Prompt[]>;
  getPromptById(id: string): Promise<Prompt | null>;
  submitPromptValues(
    promptValues: Array<{
      prompt_id: string;
      value: string | number;
    }>
  ): Promise<void>;
}
