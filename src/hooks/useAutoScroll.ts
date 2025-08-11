import { useCallback } from 'react';
import { useAnalytics } from './useAnalytics';

interface UseAutoScrollOptions {
  /** Enable/disable auto-scroll functionality */
  enabled?: boolean;
  /** Delay before scrolling in milliseconds */
  delay?: number;
  /** Validation function - return false to prevent scroll */
  onValidate?: () => boolean;
  /** Callback after scroll completes */
  onAfterScroll?: () => void;
  /** Context for analytics tracking */
  trackingContext?: string;
}

/**
 * Hook for managing auto-scroll behavior with validation
 *
 * @example
 * const { triggerAutoScroll } = useAutoScroll({
 *   enabled: autoScrollEnabled,
 *   delay: 1200,
 *   onValidate: () => isStepComplete(currentStep)
 * });
 */
export const useAutoScroll = ({
  enabled = true,
  delay = 1200,
  onValidate,
  onAfterScroll,
  trackingContext = 'unknown',
}: UseAutoScrollOptions = {}) => {
  const analytics = useAnalytics();
  const triggerAutoScroll = useCallback(
    (targetElement: HTMLElement) => {
      if (!enabled) return;

      // Run validation if provided
      if (onValidate && !onValidate()) {
        console.debug('Auto-scroll prevented by validation');
        analytics.track('Auto Scroll Prevented', {
          context: trackingContext,
          reason: 'validation_failed',
        });
        return;
      }

      // Track auto-scroll usage
      analytics.track('Auto Scroll Triggered', {
        context: trackingContext,
        delay,
        timestamp: new Date().toISOString(),
      });

      // Respect user's reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      setTimeout(() => {
        if (
          targetElement &&
          typeof targetElement.scrollIntoView === 'function'
        ) {
          targetElement.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start',
            inline: 'nearest',
          });

          analytics.track('Auto Scroll Completed', {
            context: trackingContext,
          });

          onAfterScroll?.();
        }
      }, delay);
    },
    [enabled, delay, onValidate, onAfterScroll, analytics, trackingContext]
  );

  return { triggerAutoScroll };
};
