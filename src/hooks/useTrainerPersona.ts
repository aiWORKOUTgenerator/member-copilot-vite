import { useContext } from "react";
import { TrainerPersona } from "@/domain/entities/trainerPersona";
import {
  TrainerPersonaContext,
  TrainerPersonaState,
} from "@/contexts/trainer-persona.types";

/**
 * Custom hook to access the trainer persona data from the TrainerPersonaContext.
 * Throws an error if used outside of a TrainerPersonaProvider.
 */
export function useTrainerPersona(): TrainerPersonaState {
  const context = useContext(TrainerPersonaContext);

  if (context === undefined) {
    throw new Error(
      "useTrainerPersona must be used within a TrainerPersonaProvider",
    );
  }

  return context;
}

/**
 * Convenience hook to get just the trainer persona data
 */
export function useTrainerPersonaData(): TrainerPersona | null {
  const { trainerPersona } = useTrainerPersona();
  return trainerPersona;
}

/**
 * Convenience hook to check if the trainer persona is loading
 */
export function useTrainerPersonaLoading(): boolean {
  const { isLoading } = useTrainerPersona();
  return isLoading;
}

/**
 * Convenience hook to check if the trainer persona is loaded
 */
export function useTrainerPersonaLoaded(): boolean {
  const { isLoaded } = useTrainerPersona();
  return isLoaded;
}

/**
 * Convenience hook to get any trainer persona loading error
 */
export function useTrainerPersonaError(): string | null {
  const { error } = useTrainerPersona();
  return error;
}

/**
 * Convenience hook to check if the user has no trainer persona assigned
 */
export function useTrainerPersonaHasNoPersona(): boolean {
  const { hasNoPersona } = useTrainerPersona();
  return hasNoPersona;
}

/**
 * Convenience hook to generate a new trainer persona
 */
export function useGenerateTrainerPersona(): () => Promise<void> {
  const { generateTrainerPersona } = useTrainerPersona();
  return generateTrainerPersona;
}
