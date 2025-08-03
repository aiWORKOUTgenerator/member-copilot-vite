import { createContext } from "react";
import { TrainerPersona } from "@/domain/entities/trainerPersona";

/**
 * TrainerPersonaState interface defines the shape of our trainer persona context value.
 */
export interface TrainerPersonaState {
  trainerPersona: TrainerPersona | null;
  isLoading: boolean;
  error: string | null;
  isLoaded: boolean;
  hasNoPersona: boolean;
  refetch: () => Promise<void>;
  generateTrainerPersona: () => Promise<void>;
}

/**
 * Create the context with a default undefined value.
 * This forces consumers to use the useTrainerPersona hook which performs a null check.
 */
export const TrainerPersonaContext = createContext<
  TrainerPersonaState | undefined
>(undefined);
