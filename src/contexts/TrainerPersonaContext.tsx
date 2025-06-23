"use client";

import { TrainerPersona } from "@/domain/entities/trainerPersona";
import { useAuth } from "@/hooks/auth";
import { useTrainerPersonaService } from "@/hooks/useTrainerPersonaService";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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
const TrainerPersonaContext = createContext<TrainerPersonaState | undefined>(
  undefined
);

interface TrainerPersonaProviderProps {
  children: ReactNode;
}

/**
 * TrainerPersonaProvider component that makes trainer persona data available to all child components.
 * It fetches trainer persona data on mount and provides methods to refetch.
 */
export function TrainerPersonaProvider({
  children,
}: TrainerPersonaProviderProps) {
  const trainerPersonaService = useTrainerPersonaService();
  const { isSignedIn } = useAuth();
  const [trainerPersona, setTrainerPersona] = useState<TrainerPersona | null>(
    null
  );
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNoPersona, setHasNoPersona] = useState<boolean>(false);

  const fetchTrainerPersona = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setHasNoPersona(false);

    try {
      const data = await trainerPersonaService.getTrainerPersona();
      setTrainerPersona(data);
      setIsLoaded(true);
    } catch (error) {
      console.error("Error fetching trainer persona:", error);
      setHasNoPersona(true);
      setIsLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, [trainerPersonaService]);

  const generateTrainerPersona = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await fetchTrainerPersona();
    } catch (error) {
      console.error("Error generating trainer persona:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate trainer persona"
      );
      setIsLoading(false);
    }
  }, [fetchTrainerPersona]);

  useEffect(() => {
    if (!isSignedIn && (trainerPersona || hasNoPersona)) {
      setTrainerPersona(null);
      setIsLoaded(false);
      setHasNoPersona(false);
    }
    if (isSignedIn && !trainerPersona && !hasNoPersona) {
      fetchTrainerPersona();
    }
  }, [isSignedIn, trainerPersona, hasNoPersona, fetchTrainerPersona]);

  // Memoized context value
  const contextValue: TrainerPersonaState = {
    trainerPersona,
    isLoading,
    error,
    isLoaded,
    hasNoPersona,
    refetch: fetchTrainerPersona,
    generateTrainerPersona: generateTrainerPersona,
  };

  return (
    <TrainerPersonaContext.Provider value={contextValue}>
      {children}
    </TrainerPersonaContext.Provider>
  );
}

/**
 * Custom hook to access the trainer persona data from the TrainerPersonaContext.
 * Throws an error if used outside of a TrainerPersonaProvider.
 */
export function useTrainerPersona(): TrainerPersonaState {
  const context = useContext(TrainerPersonaContext);

  if (context === undefined) {
    throw new Error(
      "useTrainerPersona must be used within a TrainerPersonaProvider"
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
