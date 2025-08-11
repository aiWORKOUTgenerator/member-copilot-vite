import React from 'react';
import { CheckCircle, X, Info, AlertTriangle } from 'lucide-react';

interface SelectionToastProps {
  /** The selection text to display */
  message: string;
  /** Toast type for styling */
  type?: 'success' | 'info' | 'warning';
  /** Duration in milliseconds */
  duration?: number;
  /** Show close button */
  showClose?: boolean;
}

/**
 * Simple toast notification for selection confirmation
 * Uses DaisyUI alert styling with smooth animations
 */
export const SelectionToast: React.FC<SelectionToastProps> = ({
  message,
  type = 'success',
  duration = 2000,
  showClose = false,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  if (!isVisible) return null;

  const alertClass = `alert alert-${type}`;
  const getIcon = () => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'info':
        return Info;
      case 'warning':
        return AlertTriangle;
      default:
        return CheckCircle;
    }
  };
  const Icon = getIcon();

  return (
    <div className="toast toast-top toast-center z-50">
      <div
        className={`${alertClass} animate-in slide-in-from-top-2 duration-300`}
      >
        <Icon className="w-4 h-4" />
        <span className="text-sm">{message}</span>
        {showClose && (
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => setIsVisible(false)}
            aria-label="Close notification"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
