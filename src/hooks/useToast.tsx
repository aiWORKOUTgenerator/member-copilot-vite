import { useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { SelectionToast } from '@/ui/shared/atoms/SelectionToast';

// Toast timing constants
const TOAST_ANIMATION_TIME_MS = 500;

interface ToastOptions {
  type?: 'success' | 'info' | 'warning';
  duration?: number;
}

/**
 * Hook for managing toast notifications
 * Creates and manages toast lifecycle
 */
export const useToast = () => {
  const showToast = useCallback(
    (message: string, options: ToastOptions = {}) => {
      const toastContainer = document.createElement('div');
      document.body.appendChild(toastContainer);

      const root = createRoot(toastContainer);

      const cleanup = () => {
        try {
          root.unmount();
        } catch (e) {
          // Log error in development, ignore in production
          if (import.meta.env.DEV) {
            console.warn('Toast unmount error:', e);
          }
        } finally {
          if (document.body.contains(toastContainer)) {
            document.body.removeChild(toastContainer);
          }
        }
      };

      root.render(
        <SelectionToast
          message={message}
          type={options.type}
          duration={options.duration}
        />
      );

      // Cleanup after duration + animation time
      setTimeout(cleanup, (options.duration || 2000) + TOAST_ANIMATION_TIME_MS);
    },
    []
  );

  const showSelectionToast = useCallback(
    (selection: string) => {
      showToast(`${selection} selected`, { type: 'success', duration: 1800 });
    },
    [showToast]
  );

  return { showToast, showSelectionToast };
};
