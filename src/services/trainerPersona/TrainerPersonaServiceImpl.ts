import {
  TrainerPersona,
  TrainerPersonaStatus,
  GenerationStartResponse,
} from '@/domain';
import { ApiService } from '@/domain/interfaces/api/ApiService';
import { TrainerPersonaService } from '@/domain/interfaces/services/TrainerPersonaService';

/**
 * Implementation of the TrainerPersonaService interface.
 * This class uses the ApiService to make HTTP requests and adds domain-specific logic.
 */
export class TrainerPersonaServiceImpl implements TrainerPersonaService {
  private readonly apiService: ApiService;
  private readonly baseEndpoint = '/members/trainer-persona';

  /**
   * Creates a new instance of TrainerPersonaServiceImpl
   * @param apiService The API service to use for HTTP requests
   */
  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  /**
   * Fetches the current user's trainer persona
   * @returns Promise resolving to the trainer persona
   */
  async getTrainerPersona(): Promise<TrainerPersona> {
    return this.apiService.get<TrainerPersona>(`${this.baseEndpoint}/`);
  }

  /**
   * Gets the current status of trainer persona generation
   * @returns Promise resolving to the generation status
   */
  async getTrainerPersonaStatus(): Promise<TrainerPersonaStatus> {
    return this.apiService.get<TrainerPersonaStatus>(
      `${this.baseEndpoint}/status/`
    );
  }

  /**
   * Generates a new trainer persona for the current user
   * @returns Promise that resolves with generation start response
   */
  async generateTrainerPersona(): Promise<GenerationStartResponse> {
    return this.apiService.post<
      GenerationStartResponse,
      Record<string, unknown>
    >(`${this.baseEndpoint}/`, {});
  }
}
