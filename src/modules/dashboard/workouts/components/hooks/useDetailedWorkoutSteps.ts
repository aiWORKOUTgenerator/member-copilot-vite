import { useState, useCallback } from 'react';
import {
  DETAILED_WORKOUT_STEPS,
  getStepById,
} from '../constants/detailedWorkoutSteps';
import type { PerWorkoutOptions } from '../types';

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
  steps: typeof DETAILED_WORKOUT_STEPS;
  currentStepIndex: number;
  totalSteps: number;
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
        return { isValid: true, completionPercentage: 0, missingFields: [] };
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

  return {
    currentStep,
    setCurrentStep,
    goToNextStep,
    goToPreviousStep,
    canGoNext,
    canGoPrevious,
    getStepValidation,
    getOverallProgress,
    steps: DETAILED_WORKOUT_STEPS,
    currentStepIndex,
    totalSteps,
  };
};
