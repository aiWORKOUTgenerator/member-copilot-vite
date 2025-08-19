import { useCallback } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

export function useWorkoutPathSelection() {
  const analytics = useAnalytics();

  const selectPath = useCallback(
    (path: 'quick' | 'detailed') => {
      analytics.track('workout_path_selected', {
        path,
        timestamp: new Date().toISOString(),
      });
    },
    [analytics]
  );

  return { selectPath };
}
