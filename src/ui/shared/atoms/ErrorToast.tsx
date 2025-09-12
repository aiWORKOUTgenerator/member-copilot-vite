import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorToastProps {
  /** The error message to display */
  message: string;
  /** Duration in milliseconds (0 = no auto-hide) */
  duration?: number;
  /** Show close button */
  showClose?: boolean;
  /** Callback when toast is dismissed */
  onDismiss?: () => void;
}

/**
 * Error toast notification with glassmorphism styling
 * Follows the established style guide for consistent error feedback
 */
export const ErrorToast: React.FC<ErrorToastProps> = ({
  message,
  duration = 5000,
  showClose = true,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleDismiss = React.useCallback(() => {
    setIsVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (duration > 0) {
      timer = setTimeout(() => {
        handleDismiss();
      }, duration);
    }
    return () => {
      if (timer !== undefined) {
        clearTimeout(timer);
      }
    };
  }, [duration, handleDismiss]);

  if (!isVisible) return null;

  return (
    <div className="toast toast-top toast-center z-50">
      <div
        className="alert alert-error bg-error/10 backdrop-blur-xl border border-error/20 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.2)] animate-in slide-in-from-top-2 duration-300"
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-error/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-error/20">
            <AlertTriangle className="w-4 h-4 text-error" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-error text-sm">Error</h4>
            <p className="text-sm text-base-content/80">{message}</p>
          </div>
          {showClose && (
            <button
              className="btn btn-ghost btn-xs hover:bg-error/10 transition-colors duration-200"
              onClick={handleDismiss}
              aria-label="Close error notification"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
