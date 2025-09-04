import { useCallback, useRef, useEffect } from 'react';
import { useAutoScroll, useAutoScrollTiming } from '@/hooks';

export interface FormStep {
  id: string;
  label: string;
  fields: string[];
  scrollTarget?: string; // Optional specific scroll target within step
}

export interface FormAutoScrollConfig<TFormData = Record<string, unknown>> {
  /** Form identifier for analytics */
  formId: string;
  /** Steps configuration */
  steps: FormStep[];
  /** Current step ID */
  currentStepId: string;
  /** Function to set current step */
  setCurrentStep: (stepId: string) => void;
  /** Function to check if step is complete */
  isStepComplete: (stepId: string, formData: TFormData) => boolean;
  /** Function to get next field within current step */
  getNextField?: (currentField: string, currentStepId: string) => string | null;
  /** Function to get next step after current step */
  getNextStep?: (currentStepId: string) => string | null;
  /** Enable/disable auto-scroll functionality */
  enabled?: boolean;
  /** Custom timing overrides */
  timing?: {
    initialDelay?: number;
    stepAdvanceDelay?: number;
    stepScrollDelay?: number;
  };
  /** Custom scroll behavior */
  scrollBehavior?: {
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
  };
}

export interface FormAutoScrollReturn<TFormData = Record<string, unknown>> {
  /** Register a scroll target for a field or step */
  registerScrollTarget: (targetId: string, element: HTMLElement | null) => void;
  /** Handle field selection with auto-scroll logic */
  handleFieldSelection: (
    fieldId: string,
    value: unknown,
    formData: TFormData,
    onFieldChange: (fieldId: string, value: unknown) => void
  ) => void;
  /** Manually trigger scroll to a target */
  scrollToTarget: (targetId: string) => void;
  /** Get current scroll targets */
  getScrollTargets: () => Map<string, HTMLElement>;
  /** Clear all scroll targets */
  clearScrollTargets: () => void;
}

/**
 * Universal auto-scroll hook for form-based interfaces
 *
 * This hook provides a consistent pattern for auto-scrolling in multi-step forms,
 * handling both intra-step scrolling (field to field) and inter-step scrolling
 * (step to step) with proper timing and user preferences.
 *
 * @example
 * const { registerScrollTarget, handleFieldSelection } = useFormAutoScroll({
 *   formId: 'workout-customization',
 *   steps: [
 *     { id: 'focus-energy', label: 'Focus & Energy', fields: ['focus', 'energy'] },
 *     { id: 'duration-equipment', label: 'Duration & Equipment', fields: ['duration', 'equipment'] }
 *   ],
 *   currentStepId: currentStep,
 *   setCurrentStep: setCurrentStep,
 *   isStepComplete: (stepId, data) => {
 *     if (stepId === 'focus-energy') return data.focus && data.energy;
 *     if (stepId === 'duration-equipment') return data.duration && data.equipment;
 *     return false;
 *   }
 * });
 *
 * // In your component:
 * <div ref={(el) => registerScrollTarget('duration-question', el)}>
 *   <h3>How long do you want your workout to be?</h3>
 * </div>
 *
 * // Handle selection:
 * handleFieldSelection('energy', 5, formData, setFormData);
 */
export const useFormAutoScroll = <TFormData = Record<string, unknown>>({
  formId,
  steps,
  currentStepId,
  setCurrentStep,
  isStepComplete,
  getNextField,
  getNextStep,
  enabled = true,
  timing = {},
  scrollBehavior = { block: 'start', inline: 'nearest' },
}: FormAutoScrollConfig<TFormData>): FormAutoScrollReturn<TFormData> => {
  // Store scroll targets
  const scrollTargets = useRef<Map<string, HTMLElement>>(new Map());

  // Auto-scroll hooks
  const { triggerAutoScroll } = useAutoScroll({
    enabled,
    trackingContext: formId,
  });
  const { scheduleAutoScrollSequence } = useAutoScrollTiming({
    enabled,
    timing,
  });

  // Register a scroll target
  const registerScrollTarget = useCallback(
    (targetId: string, element: HTMLElement | null) => {
      if (!targetId) {
        console.warn(
          'useFormAutoScroll: targetId is required for registerScrollTarget'
        );
        return;
      }

      if (element) {
        scrollTargets.current.set(targetId, element);
        if (import.meta.env.DEV) {
          console.debug(`${formId}: Registered scroll target: ${targetId}`);
        }
      } else {
        scrollTargets.current.delete(targetId);
        if (import.meta.env.DEV) {
          console.debug(`${formId}: Unregistered scroll target: ${targetId}`);
        }
      }
    },
    [formId]
  );

  // Get scroll target element
  const getScrollTargetElement = useCallback(
    (targetId: string): HTMLElement | null => {
      return scrollTargets.current.get(targetId) || null;
    },
    []
  );

  // Scroll to a specific target
  const scrollToTarget = useCallback(
    (targetId: string) => {
      const element = getScrollTargetElement(targetId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          ...scrollBehavior,
        });
      }
    },
    [getScrollTargetElement, scrollBehavior]
  );

  // Handle field selection with auto-scroll logic
  const handleFieldSelection = useCallback(
    (
      fieldId: string,
      value: unknown,
      formData: TFormData,
      onFieldChange: (fieldId: string, value: unknown) => void
    ) => {
      // Validate inputs
      if (!fieldId) {
        console.warn(
          'useFormAutoScroll: fieldId is required for handleFieldSelection'
        );
        return;
      }

      if (!onFieldChange || typeof onFieldChange !== 'function') {
        console.warn('useFormAutoScroll: onFieldChange must be a function');
        return;
      }

      // Update the field value
      try {
        onFieldChange(fieldId, value);
      } catch (error) {
        console.error('useFormAutoScroll: Error updating field:', error);
        return;
      }

      // Show selection feedback (optional)
      if (import.meta.env.DEV) {
        console.debug(
          `${formId}: Field ${fieldId} selected with value:`,
          value
        );
      }

      // Precompute updated form data
      const updatedFormData = { ...formData, [fieldId]: value };

      // Determine next action
      const nextField = getNextField?.(fieldId, currentStepId);
      const nextFieldTarget = nextField
        ? `${currentStepId}-${nextField}`
        : null;
      const shouldAdvance =
        !nextField && isStepComplete(currentStepId, updatedFormData);
      const nextStep = shouldAdvance ? getNextStep?.(currentStepId) : null;

      // Enhanced debug logging
      if (import.meta.env.DEV) {
        console.debug(`${formId}: Field selection debug:`, {
          fieldId,
          currentStepId,
          nextField,
          nextFieldTarget,
          shouldAdvance,
          nextStep,
          updatedFormData,
          isStepComplete: isStepComplete(currentStepId, updatedFormData),
        });
      }

      // Schedule auto-scroll sequence
      if (import.meta.env.DEV) {
        console.debug(`${formId}: Scheduling auto-scroll sequence`, {
          enabled,
          hasInitial: true,
          hasStepAdvance: true,
          hasStepScroll: true,
        });
      }
      scheduleAutoScrollSequence({
        initial: () => {
          if (import.meta.env.DEV) {
            console.debug(`${formId}: Auto-scroll check for field ${fieldId}`);
          }

          if (nextFieldTarget) {
            // Intra-step scroll to next field
            const nextFieldElement = getScrollTargetElement(nextFieldTarget);
            if (nextFieldElement) {
              if (import.meta.env.DEV) {
                console.debug(
                  `${formId}: Scrolling to next field: ${nextFieldTarget}`
                );
              }
              triggerAutoScroll(nextFieldElement);
            }
          } else if (shouldAdvance) {
            if (import.meta.env.DEV) {
              console.debug(`${formId}: Step complete, preparing to advance`);
            }
          }
        },
        stepAdvance: () => {
          // Recalculate step completion status at execution time
          const currentStepComplete = isStepComplete(
            currentStepId,
            updatedFormData
          );
          const nextStepId = currentStepComplete
            ? getNextStep?.(currentStepId)
            : null;

          if (import.meta.env.DEV) {
            console.debug(`${formId}: Step advance check:`, {
              currentStepId,
              currentStepComplete,
              nextStepId,
              enabled,
              updatedFormData,
            });
          }

          if (currentStepComplete && nextStepId && enabled) {
            if (import.meta.env.DEV) {
              console.debug(`${formId}: Advancing to step: ${nextStepId}`);
            }
            setCurrentStep(nextStepId);
          } else if (import.meta.env.DEV) {
            console.debug(`${formId}: Step advance prevented:`, {
              currentStepComplete,
              nextStepId,
              enabled,
              reason: !currentStepComplete
                ? 'step not complete'
                : !enabled
                  ? 'auto-scroll disabled'
                  : 'no next step',
            });
          }
        },
        stepScroll: () => {
          // Recalculate next step at execution time
          const currentStepComplete = isStepComplete(
            currentStepId,
            updatedFormData
          );
          const nextStepId = currentStepComplete
            ? getNextStep?.(currentStepId)
            : null;

          if (nextStepId) {
            // Try to scroll to step's scroll target first, then fallback to step ID
            const stepConfig = steps.find((step) => step.id === nextStepId);
            const scrollTargetId = stepConfig?.scrollTarget || nextStepId;
            const scrollElement = getScrollTargetElement(scrollTargetId);

            if (scrollElement) {
              if (import.meta.env.DEV) {
                console.debug(
                  `${formId}: Scrolling to step target: ${scrollTargetId}`
                );
              }
              scrollElement.scrollIntoView({
                behavior: 'smooth',
                ...scrollBehavior,
              });
            } else if (import.meta.env.DEV) {
              console.warn(
                `${formId}: No scroll target found for step: ${nextStepId}`
              );
            }
          }
        },
      });
    },
    [
      formId,
      currentStepId,
      getNextField,
      getNextStep,
      isStepComplete,
      enabled,
      scheduleAutoScrollSequence,
      triggerAutoScroll,
      getScrollTargetElement,
      setCurrentStep,
      steps,
      scrollBehavior,
    ]
  );

  // Get all scroll targets
  const getScrollTargets = useCallback(() => {
    return new Map(scrollTargets.current);
  }, []);

  // Clear all scroll targets
  const clearScrollTargets = useCallback(() => {
    scrollTargets.current.clear();
    if (import.meta.env.DEV) {
      console.debug(`${formId}: Cleared all scroll targets`);
    }
  }, [formId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearScrollTargets();
    };
  }, [clearScrollTargets]);

  // Validate configuration on mount
  useEffect(() => {
    if (!formId) {
      console.warn('useFormAutoScroll: formId is required');
    }

    if (!steps || steps.length === 0) {
      console.warn(
        'useFormAutoScroll: steps array is required and must not be empty'
      );
    }

    if (!currentStepId) {
      console.warn('useFormAutoScroll: currentStepId is required');
    }

    const currentStepExists = steps.some((step) => step.id === currentStepId);
    if (!currentStepExists) {
      console.warn(
        `useFormAutoScroll: currentStepId "${currentStepId}" not found in steps`
      );
    }
  }, [formId, steps, currentStepId]);

  return {
    registerScrollTarget,
    handleFieldSelection,
    scrollToTarget,
    getScrollTargets,
    clearScrollTargets,
  };
};
