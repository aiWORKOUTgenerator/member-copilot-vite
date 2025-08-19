'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { usePusherService } from '@/hooks/useServices';
import { ensureWorkoutChunkBinding } from '@/services/pusher/workoutChunkBinding';
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
    initialData: () =>
      queryClient.getQueryData<string[]>([
        'generatedWorkoutChunks',
        workoutId,
      ]) ?? [],
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
  });

  // Debug: provider mount and cached state
  useMemo(() => {
    const cached = queryClient.getQueryData<string[]>([
      'generatedWorkoutChunks',
      workoutId,
    ]);
    console.log('[GeneratedWorkoutChunks] provider mounted', {
      workoutId,
      cachedCount: cached?.length ?? 0,
      cached,
    });
    return undefined;
  }, [queryClient, workoutId]);

  const pusherService = usePusherService();
  useMemo(() => {
    ensureWorkoutChunkBinding(pusherService, queryClient, workoutId);
    return undefined;
  }, [pusherService, queryClient, workoutId]);

  // Debug: react to chunk list changes
  useMemo(() => {
    console.log('[GeneratedWorkoutChunks] chunks updated', {
      workoutId,
      count: chunks.length,
    });
    return undefined;
  }, [chunks, workoutId]);

  const clear = useCallback(() => {
    console.log('[GeneratedWorkoutChunks] clear called', { workoutId });
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
