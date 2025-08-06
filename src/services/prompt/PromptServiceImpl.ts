import { Prompt, PromptProps } from '@/domain';
import { ApiService } from '@/domain/interfaces/api/ApiService';
import { PromptService } from '@/domain/interfaces/services/PromptService';

/**
 * PromptService implements domain logic for managing prompts
 * Follows Single Responsibility Principle by focusing only on prompt-related operations
 */
export class PromptServiceImpl implements PromptService {
  readonly serviceName = 'PromptService';
  private readonly apiService: ApiService;
  private readonly baseEndpoint = '/members';

  /**
   * Creates a new instance of PromptServiceImpl
   * @param apiService The API service to use for HTTP requests
   */
  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  /**
   * Get all prompts
   * @returns Promise that resolves to an array of Prompt entities
   */
  async getAllPrompts(): Promise<Prompt[]> {
    try {
      // Get prompts from API
      const promptsData = await this.apiService.get<PromptProps[]>(
        `${this.baseEndpoint}/prompts/`
      );

      // Map the API response to domain entities
      return promptsData.map((data) => new Prompt(data));
    } catch (error) {
      console.error('Error in getAllPrompts:', error);
      throw new Error('Failed to fetch prompts');
    }
  }

  /**
   * Get prompt by ID
   * @param id The ID of the prompt to retrieve
   * @returns Promise that resolves to a Prompt entity or null if not found
   */
  async getPromptById(id: string): Promise<Prompt | null> {
    try {
      // Get all prompts and find the one with matching ID
      // Note: In a real API, we might have a dedicated endpoint for getting a single prompt
      const prompts = await this.getAllPrompts();
      return prompts.find((prompt) => prompt.id === id) || null;
    } catch (error) {
      console.error(`Error in getPromptById for id ${id}:`, error);
      throw new Error(`Failed to fetch prompt with id ${id}`);
    }
  }

  /**
   * Submit multiple prompt values to the server
   * @param promptValues Array of objects containing prompt_id and value pairs
   * @returns Promise that resolves when the submission is complete
   */
  async submitPromptValues(
    promptValues: Array<{
      prompt_id: string;
      value: string | number;
    }>
  ): Promise<void> {
    try {
      await this.apiService.post<
        void,
        { promptValues: Array<{ prompt_id: string; value: string | number }> }
      >(`${this.baseEndpoint}/submit-prompts/`, { promptValues });
    } catch (error) {
      console.error('Error in submitPromptValues:', error);
      throw new Error('Failed to submit prompt values');
    }
  }
}
