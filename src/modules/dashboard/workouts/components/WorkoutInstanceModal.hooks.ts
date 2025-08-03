import { WorkoutInstance } from "@/domain/entities/workoutInstance";
import { useCallback, useState } from "react";

/**
 * Hook to manage workout instance modal state
 */
export function useWorkoutInstanceModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [workoutInstance, setWorkoutInstance] =
    useState<WorkoutInstance | null>(null);

  const openModal = useCallback((instance: WorkoutInstance) => {
    setWorkoutInstance(instance);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Keep the instance data for a smooth close animation
    setTimeout(() => setWorkoutInstance(null), 200);
  }, []);

  return {
    isOpen,
    workoutInstance,
    openModal,
    closeModal,
  };
}
