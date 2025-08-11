import { useCallback, useRef, useMemo } from 'react';
import { AUTO_SCROLL_CONFIG } from '@/config/autoScroll';

interface AutoScrollTimingOptions {
  /** Enable/disable auto-scroll functionality */
  enabled?: boolean;
  /** Custom timing overrides */
  timing?: {
    initialDelay?: number;
    stepAdvanceDelay?: number;
    stepScrollDelay?: number;
  };
}

/**
 * Hook for managing auto-scroll timing in a structured way
 * Consolidates nested setTimeout calls into a more maintainable system
 */
export const useAutoScrollTiming = ({
  enabled = true,
  timing = {},
}: AutoScrollTimingOptions = {}) => {
  const timeoutRef = useRef<number | null>(null);

  // Use custom timing or fall back to config defaults
  const config = useMemo(
    () => ({
      initialDelay:
        timing.initialDelay ?? AUTO_SCROLL_CONFIG.timing.initialDelay,
      stepAdvanceDelay:
        timing.stepAdvanceDelay ?? AUTO_SCROLL_CONFIG.timing.stepAdvanceDelay,
      stepScrollDelay:
        timing.stepScrollDelay ?? AUTO_SCROLL_CONFIG.timing.stepScrollDelay,
    }),
    [timing.initialDelay, timing.stepAdvanceDelay, timing.stepScrollDelay]
  );

  const cancelTimeout = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  /**
   * Schedule a sequence of auto-scroll actions with proper timing
   */
  const scheduleAutoScrollSequence = useCallback(
    (actions: {
      initial?: () => void;
      stepAdvance?: () => void;
      stepScroll?: () => void;
    }) => {
      if (!enabled) return;

      cancelTimeout(); // Cancel any existing timeout

      // Schedule initial action
      if (actions.initial) {
        timeoutRef.current = window.setTimeout(() => {
          actions.initial!();

          // Schedule step advance action
          if (actions.stepAdvance) {
            timeoutRef.current = window.setTimeout(() => {
              actions.stepAdvance!();

              // Schedule step scroll action
              if (actions.stepScroll) {
                timeoutRef.current = window.setTimeout(() => {
                  actions.stepScroll!();
                }, config.stepScrollDelay);
              }
            }, config.stepAdvanceDelay);
          }
        }, config.initialDelay);
      }
    },
    [enabled, config, cancelTimeout]
  );

  return {
    scheduleAutoScrollSequence,
    cancelTimeout,
    config,
  };
};
