'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { usePusherEvent } from '@/hooks/usePusherEvent';

export interface GeneratedWorkoutChunksState {
  chunks: string[];
  clear: () => void;
}

const GeneratedWorkoutChunksContext = createContext<
  GeneratedWorkoutChunksState | undefined
>(undefined);

interface GeneratedWorkoutChunksProviderProps {
  workoutId: string;
  children: ReactNode;
}

export function GeneratedWorkoutChunksProvider({
  workoutId,
  children,
}: GeneratedWorkoutChunksProviderProps) {
  const [chunks, setChunks] = useState<string[]>([]);

  const handleChunkEvent = useCallback((data: unknown) => {
    if (
      data &&
      typeof data === 'object' &&
      data !== null &&
      'chunk' in data &&
      typeof (data as { chunk: unknown }).chunk === 'string'
    ) {
      setChunks((prev) => [...prev, (data as { chunk: string }).chunk]);
    }
  }, []);

  usePusherEvent(`${workoutId}`, 'workout-chunk-created', handleChunkEvent);

  const clear = useCallback(() => setChunks([]), []);

  const value = useMemo<GeneratedWorkoutChunksState>(
    () => ({ chunks, clear }),
    [chunks, clear]
  );

  return (
    <GeneratedWorkoutChunksContext.Provider value={value}>
      {children}
    </GeneratedWorkoutChunksContext.Provider>
  );
}

export function useGeneratedWorkoutChunks(): GeneratedWorkoutChunksState {
  const ctx = useContext(GeneratedWorkoutChunksContext);
  if (!ctx) {
    throw new Error(
      'useGeneratedWorkoutChunks must be used within a GeneratedWorkoutChunksProvider'
    );
  }
  return ctx;
}
