import { useCallback, useState } from "react";

/**
 * Hook to manage modal state with confirmation
 */
export function useFeedbackModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setHasUnsavedChanges(false);
  }, []);

  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const markAsSaved = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  return {
    isOpen,
    hasUnsavedChanges,
    openModal,
    closeModal,
    markAsChanged,
    markAsSaved,
  };
}
