import { useState, useCallback } from 'react';
import {
  DETAILED_WORKOUT_STEPS,
  getStepById,
} from '../constants/detailedWorkoutSteps';
import type { PerWorkoutOptions } from '../types';

// Estimated average fields per detailed workout step
// Based on analysis: workout-structure (3), equipment-preferences (3), current-state (4)
// Average: (3 + 3 + 4) / 3 = 3.33, rounded to 3 for simplicity
const ESTIMATED_FIELDS_PER_STEP = 3;

export interface UseDetailedWorkoutStepsReturn {
  currentStep: string;
  setCurrentStep: (stepId: string) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  getStepValidation: (stepId: string) => {
    isValid: boolean;
    completionPercentage: number;
    missingFields: string[];
  };
  getOverallProgress: () => number;
  getCompletedFieldsCount: () => number;
  getTotalFieldsCount: () => number;
  steps: typeof DETAILED_WORKOUT_STEPS;
  currentStepIndex: number;
  totalSteps: number;
  isLastStep: boolean;
}

export const useDetailedWorkoutSteps = (
  options: PerWorkoutOptions,
  initialStep: string = 'workout-structure'
): UseDetailedWorkoutStepsReturn => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const currentStepIndex = DETAILED_WORKOUT_STEPS.findIndex(
    (step) => step.id === currentStep
  );
  const totalSteps = DETAILED_WORKOUT_STEPS.length;

  const canGoNext = currentStepIndex < totalSteps - 1;
  const canGoPrevious = currentStepIndex > 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  const goToNextStep = useCallback(() => {
    if (canGoNext) {
      setCurrentStep(DETAILED_WORKOUT_STEPS[currentStepIndex + 1].id);
    }
  }, [canGoNext, currentStepIndex]);

  const goToPreviousStep = useCallback(() => {
    if (canGoPrevious) {
      setCurrentStep(DETAILED_WORKOUT_STEPS[currentStepIndex - 1].id);
    }
  }, [canGoPrevious, currentStepIndex]);

  const getStepValidation = useCallback(
    (stepId: string) => {
      const step = getStepById(stepId);
      if (!step || !step.validation) {
        return { isValid: false, completionPercentage: 0, missingFields: [] };
      }
      return step.validation(options);
    },
    [options]
  );

  const getOverallProgress = useCallback(() => {
    const totalCompletion = DETAILED_WORKOUT_STEPS.reduce((sum, step) => {
      const validation = getStepValidation(step.id);
      return sum + validation.completionPercentage;
    }, 0);
    return Math.round(totalCompletion / DETAILED_WORKOUT_STEPS.length);
  }, [getStepValidation]);

  const getCompletedFieldsCount = useCallback(() => {
    return DETAILED_WORKOUT_STEPS.reduce((count, step) => {
      const validation = getStepValidation(step.id);
      // Estimate completed fields based on completion percentage
      // This is a rough approximation since detailed steps have varying field counts
      return (
        count +
        Math.round(
          (validation.completionPercentage / 100) * ESTIMATED_FIELDS_PER_STEP
        )
      );
    }, 0);
  }, [getStepValidation]);

  const getTotalFieldsCount = useCallback(() => {
    // Estimate total fields across all detailed steps
    return DETAILED_WORKOUT_STEPS.length * ESTIMATED_FIELDS_PER_STEP;
  }, []);

  return {
    currentStep,
    setCurrentStep,
    goToNextStep,
    goToPreviousStep,
    canGoNext,
    canGoPrevious,
    getStepValidation,
    getOverallProgress,
    getCompletedFieldsCount,
    getTotalFieldsCount,
    steps: DETAILED_WORKOUT_STEPS,
    currentStepIndex,
    totalSteps,
    isLastStep,
  };
};
