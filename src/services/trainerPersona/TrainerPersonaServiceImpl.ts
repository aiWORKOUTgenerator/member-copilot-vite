import { TrainerPersona } from "@/domain";
import { ApiService } from "@/domain/interfaces/api/ApiService";
import { TrainerPersonaService } from "@/domain/interfaces/services/TrainerPersonaService";

/**
 * Implementation of the TrainerPersonaService interface.
 * This class uses the ApiService to make HTTP requests and adds domain-specific logic.
 */
export class TrainerPersonaServiceImpl implements TrainerPersonaService {
  private readonly apiService: ApiService;
  private readonly baseEndpoint = "/members/trainer-persona";

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
}
