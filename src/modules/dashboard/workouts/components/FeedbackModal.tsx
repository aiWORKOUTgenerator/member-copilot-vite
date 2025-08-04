import { ReactNode, useEffect, useCallback, useState } from "react";
import { X } from "lucide-react";

export interface FeedbackModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should be closed */
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Modal content */
  children: ReactNode;
  /** Whether to show close confirmation if there are unsaved changes */
  confirmClose?: boolean;
  /** Custom confirmation message */
  confirmMessage?: string;
  /** Whether the modal content has changes that would be lost */
  hasUnsavedChanges?: boolean;
  /** Size of the modal */
  size?: "sm" | "md" | "lg" | "xl";
  /** Additional CSS classes */
  className?: string;
}

export default function FeedbackModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  confirmClose = false,
  confirmMessage = "You have unsaved changes. Are you sure you want to close?",
  hasUnsavedChanges = false,
  size = "lg",
  className = "",
}: FeedbackModalProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClose = useCallback(() => {
    if (confirmClose && hasUnsavedChanges) {
      setShowConfirmation(true);
    } else {
      onClose();
    }
  }, [confirmClose, hasUnsavedChanges, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleClose]);

  const handleConfirmClose = useCallback(() => {
    setShowConfirmation(false);
    onClose();
  }, [onClose]);

  const handleCancelClose = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // Only handle backdrop clicks on desktop (when backdrop is visible)
      if (event.target === event.currentTarget && window.innerWidth >= 640) {
        handleClose();
      }
    },
    [handleClose]
  );

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "sm:max-w-sm md:max-w-md";
      case "md":
        return "sm:max-w-lg";
      case "lg":
        return "sm:max-w-2xl lg:max-w-4xl";
      case "xl":
        return "sm:max-w-5xl lg:max-w-6xl";
      default:
        return "sm:max-w-2xl lg:max-w-4xl";
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div
        className={`
          fixed inset-0 z-50 
          flex items-center justify-center
          sm:bg-black/50 sm:backdrop-blur-sm
          ${className}
        `}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={subtitle ? "modal-subtitle" : undefined}
      >
        <div
          className={`
            w-full h-full flex flex-col bg-base-100
            sm:w-auto sm:h-auto sm:rounded-lg sm:shadow-xl
            sm:max-h-[90vh] ${getSizeClass()} sm:mx-4
          `}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-start mb-4 p-4 sm:p-6 sm:pb-0">
            <div className="flex-1 pr-4">
              <h2 id="modal-title" className="text-xl font-bold">
                {title}
              </h2>
              {subtitle && (
                <p
                  id="modal-subtitle"
                  className="text-sm text-base-content/70 mt-1"
                >
                  {subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost"
              onClick={handleClose}
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6">
            {children}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div
          className="modal modal-open"
          onClick={(e) => e.target === e.currentTarget && handleCancelClose()}
        >
          <div className="modal-box max-w-sm">
            <h3 className="font-bold text-lg">Confirm Close</h3>
            <p className="py-4">{confirmMessage}</p>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleCancelClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-error"
                onClick={handleConfirmClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
