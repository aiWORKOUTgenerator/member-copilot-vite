"use client";

import { TrainerPersona } from "@/domain/entities/trainerPersona";
import { useAuth } from "@/hooks/auth";
import { useTrainerPersonaService } from "@/hooks/useTrainerPersonaService";
import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  TrainerPersonaContext,
  TrainerPersonaState,
} from "./trainer-persona.types";

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
