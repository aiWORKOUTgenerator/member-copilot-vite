import { TrainerPersona } from "@/domain/entities";

/**
 * TrainerPersonaService interface defines operations for trainer persona management.
 * This is a domain-specific service that encapsulates trainer persona-related business logic.
 */
export interface TrainerPersonaService {
  /**
   * Fetches the current user's trainer persona
   * @returns Promise resolving to the trainer persona
   */
  getTrainerPersona(): Promise<TrainerPersona>;
}
