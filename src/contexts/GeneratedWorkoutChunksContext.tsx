'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { usePusherEvent } from '@/hooks/usePusherEvent';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

  const { data: chunks = [] } = useQuery<string[]>({
    queryKey: ['generatedWorkoutChunks', workoutId],
    queryFn: async () => {
      const existing = queryClient.getQueryData<string[]>([
        'generatedWorkoutChunks',
        workoutId,
      ]);
      return existing ?? [];
    },
    initialData: [],
    staleTime: Infinity,
  });

  const handleChunkEvent = useCallback(
    (data: unknown) => {
      if (
        data &&
        typeof data === 'object' &&
        data !== null &&
        'chunk' in data &&
        typeof (data as { chunk: unknown }).chunk === 'string'
      ) {
        queryClient.setQueryData<string[] | undefined>(
          ['generatedWorkoutChunks', workoutId],
          (prev) =>
            prev
              ? [...prev, (data as { chunk: string }).chunk]
              : [(data as { chunk: string }).chunk]
        );
      }
    },
    [queryClient, workoutId]
  );

  usePusherEvent(`${workoutId}`, 'workout-chunk-created', handleChunkEvent);

  const clear = useCallback(() => {
    queryClient.setQueryData<string[]>(
      ['generatedWorkoutChunks', workoutId],
      []
    );
  }, [queryClient, workoutId]);

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
