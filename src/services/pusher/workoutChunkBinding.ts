import type { PusherService } from '@/domain/interfaces/services/PusherService';
import type { QueryClient } from '@tanstack/react-query';

// Global registry to ensure we only bind once per (workoutId, event)
const BOUND_KEYS = new Set<string>();

/**
 * Ensure a single binding to the workout chunk stream per workout id.
 * Appends chunks into React Query cache at ['generatedWorkoutChunks', workoutId].
 */
export function ensureWorkoutChunkBinding(
  pusherService: PusherService,
  queryClient: QueryClient,
  workoutId: string
): void {
  const key = `${workoutId}|workout-chunk-created`;
  if (BOUND_KEYS.has(key)) {
    return;
  }

  const channel = pusherService.subscribe(`${workoutId}`);
  const onChunk = (data: unknown) => {
    if (
      data &&
      typeof data === 'object' &&
      data !== null &&
      'chunk' in data &&
      typeof (data as { chunk: unknown }).chunk === 'string'
    ) {
      const chunk = (data as { chunk: string }).chunk;
      // Debug logging
      console.log('[WorkoutChunkBinding] chunk received', {
        workoutId,
        length: chunk.length,
        preview: chunk.slice(0, 120),
      });
      queryClient.setQueryData<string[]>(
        ['generatedWorkoutChunks', workoutId],
        (prev = []) => [...prev, chunk]
      );
    }
  };

  channel.bind('workout-chunk-created', onChunk);
  BOUND_KEYS.add(key);
}
