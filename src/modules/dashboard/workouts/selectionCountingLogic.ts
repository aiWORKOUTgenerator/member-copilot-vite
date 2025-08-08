import { PerWorkoutOptions } from './components/types';
import { VALIDATION_MESSAGES } from './constants/validationMessages';
import { CUSTOMIZATION_FIELD_KEYS } from './constants/fieldKeys';
import { VALID_EQUIPMENT_IDS } from './constants';

// Core interfaces for selection counting
export interface StepSelections {
  total: number;
  required: number;
  percentage: number;
  isComplete: boolean;
  isPartial: boolean;
  isEmpty: boolean;
  hasErrors: boolean;
  errorCount: number;
  canProceed: boolean;
  details: {
    [fieldName: string]: boolean;
  };
}

export interface SelectionState {
  focusEnergy: StepSelections;
  durationEquipment: StepSelections;
  currentStep: StepSelections;
}

export interface ButtonState {
  className: string;
  disabled: boolean;
  text: string;
  state: 'disabled' | 'partial' | 'active' | 'error' | 'loading';
  visualFeedback?: VisualFeedback;
}

export interface VisualFeedback {
  indicatorColor: 'gray' | 'blue' | 'green' | 'red' | 'orange';
  message: string;
  icon?: 'error' | 'warning' | 'info' | 'success';
  progress?: number; // 0-100 percentage
}

export interface ProgressIndicator {
  isEmpty: boolean;
  isComplete: boolean;
  isPartial: boolean;
  text: string;
  percentage: number;
  color: string;
}

// Selection counting functions that build upon existing infrastructure
export class SelectionCounter {
  // Focus & Energy step counting (Step 0)
  static getFocusEnergySelections(options: PerWorkoutOptions): StepSelections {
    const hasFocus = !!options.customization_focus;
    const hasEnergy = !!options.customization_energy;
    const total = (hasFocus ? 1 : 0) + (hasEnergy ? 1 : 0);
    const required = 2;

    return {
      total,
      required,
      percentage: (total / required) * 100,
      isComplete: total === required,
      isPartial: total > 0 && total < required,
      isEmpty: total === 0,
      hasErrors: false, // Will be set by validation logic
      errorCount: 0, // Will be set by validation logic
      canProceed: total === required,
      details: {
        [CUSTOMIZATION_FIELD_KEYS.FOCUS]: hasFocus,
        [CUSTOMIZATION_FIELD_KEYS.ENERGY]: hasEnergy,
      },
    };
  }

  // Duration & Equipment step counting (Step 1)
  static getDurationEquipmentSelections(
    options: PerWorkoutOptions
  ): StepSelections {
    const hasDuration = !!options.customization_duration;
    const hasEquipment = !!(
      options.customization_equipment &&
      options.customization_equipment.length > 0
    );
    const total = (hasDuration ? 1 : 0) + (hasEquipment ? 1 : 0);
    const required = 2;

    return {
      total,
      required,
      percentage: (total / required) * 100,
      isComplete: total === required,
      isPartial: total > 0 && total < required,
      isEmpty: total === 0,
      hasErrors: false, // Will be set by validation logic
      errorCount: 0, // Will be set by validation logic
      canProceed: total === required,
      details: {
        [CUSTOMIZATION_FIELD_KEYS.DURATION]: hasDuration,
        [CUSTOMIZATION_FIELD_KEYS.EQUIPMENT]: hasEquipment,
      },
    };
  }

  // Get current step selections based on active step
  static getCurrentStepSelections(
    activeStep: 'focus-energy' | 'duration-equipment',
    options: PerWorkoutOptions
  ): StepSelections {
    return activeStep === 'focus-energy'
      ? this.getFocusEnergySelections(options)
      : this.getDurationEquipmentSelections(options);
  }

  // Get overall selection state for all steps
  static getSelectionState(
    activeStep: 'focus-energy' | 'duration-equipment',
    options: PerWorkoutOptions
  ): SelectionState {
    return {
      focusEnergy: this.getFocusEnergySelections(options),
      durationEquipment: this.getDurationEquipmentSelections(options),
      currentStep: this.getCurrentStepSelections(activeStep, options),
    };
  }

  // Get individual field selection state
  static getFieldSelectionState(
    fieldKey: keyof PerWorkoutOptions,
    value: unknown
  ): {
    hasValue: boolean;
    isValid: boolean;
    errorMessage?: string;
  } {
    switch (fieldKey) {
      case CUSTOMIZATION_FIELD_KEYS.FOCUS:
        return {
          hasValue:
            !!value && typeof value === 'string' && value.trim().length > 0,
          isValid:
            !!value && typeof value === 'string' && value.trim().length > 0,
        };

      case CUSTOMIZATION_FIELD_KEYS.ENERGY: {
        const energy = Number(value);
        const energyHasValue =
          value !== undefined &&
          value !== null &&
          !isNaN(energy) &&
          energy >= 1;
        const energyIsValid = energyHasValue && energy <= 6;
        return {
          hasValue: energyHasValue,
          isValid: energyIsValid,
          errorMessage:
            value !== undefined &&
            value !== null &&
            !isNaN(energy) &&
            (energy < 1 || energy > 6)
              ? VALIDATION_MESSAGES.ENERGY_RANGE
              : undefined,
        };
      }

      case CUSTOMIZATION_FIELD_KEYS.DURATION: {
        const duration = Number(value);
        const durationHasValue =
          value !== undefined && value !== null && !isNaN(duration);
        const durationIsValid =
          durationHasValue && duration >= 5 && duration <= 300;
        return {
          hasValue: durationHasValue,
          isValid: durationIsValid,
          errorMessage:
            durationHasValue && !durationIsValid
              ? VALIDATION_MESSAGES.DURATION_RANGE
              : undefined,
        };
      }

      case CUSTOMIZATION_FIELD_KEYS.EQUIPMENT:
        return {
          hasValue: Array.isArray(value) && value.length > 0,
          isValid:
            Array.isArray(value) &&
            value.length > 0 &&
            value.every((item) => VALID_EQUIPMENT_IDS.includes(item)),
        };

      default:
        return {
          hasValue: !!value,
          isValid: !!value,
        };
    }
  }
}

// Button state logic that integrates with existing validation
export class ButtonStateLogic {
  // Get hybrid button state with validation integration
  static getHybridButtonState(
    activeStep: 'focus-energy' | 'duration-equipment',
    options: PerWorkoutOptions,
    errors: Partial<Record<keyof PerWorkoutOptions, string>>,
    isGenerating: boolean = false
  ): ButtonState {
    if (isGenerating) {
      return {
        className: 'btn btn-primary loading',
        disabled: true,
        text: 'Generating...',
        state: 'loading',
      };
    }

    const currentStepSelections = SelectionCounter.getCurrentStepSelections(
      activeStep,
      options
    );
    const hasValidationErrors = Object.keys(errors).length > 0;

    // Validation errors take absolute precedence
    if (hasValidationErrors) {
      return {
        className: 'btn btn-disabled',
        disabled: true,
        text: 'Fix validation errors',
        state: 'error',
        visualFeedback: {
          indicatorColor: 'red',
          message: `${Object.keys(errors).length} validation error${
            Object.keys(errors).length > 1 ? 's' : ''
          } found`,
          icon: 'error',
        },
      };
    }

    // Selection-based states
    if (currentStepSelections.isEmpty) {
      return {
        className: 'btn btn-disabled',
        disabled: true,
        text: 'Complete current step',
        state: 'disabled',
        visualFeedback: {
          indicatorColor: 'gray',
          message: 'Complete current step to continue',
          progress: 0,
        },
      };
    }

    if (currentStepSelections.isPartial) {
      return {
        className: 'btn btn-disabled',
        disabled: true,
        text: 'Complete current step',
        state: 'disabled',
        visualFeedback: {
          indicatorColor: 'blue',
          message: `${currentStepSelections.total} of ${currentStepSelections.required} selections made`,
          progress: currentStepSelections.percentage,
        },
      };
    }

    // All selections complete
    return {
      className: 'btn btn-primary',
      disabled: false,
      text: activeStep === 'focus-energy' ? 'Next' : 'Generate Quick Workout',
      state: 'active',
      visualFeedback: {
        indicatorColor: 'green',
        message: 'Ready to proceed',
        progress: 100,
      },
    };
  }

  // Get progress indicator for visual feedback
  static getProgressIndicator(
    activeStep: 'focus-energy' | 'duration-equipment',
    options: PerWorkoutOptions,
    errors: Partial<Record<keyof PerWorkoutOptions, string>>
  ): ProgressIndicator {
    const currentStepSelections = SelectionCounter.getCurrentStepSelections(
      activeStep,
      options
    );
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      return {
        isEmpty: false,
        isComplete: false,
        isPartial: false,
        text: `${Object.keys(errors).length} validation error${
          Object.keys(errors).length > 1 ? 's' : ''
        } found`,
        percentage: 0,
        color: 'red',
      };
    }

    if (currentStepSelections.isEmpty) {
      return {
        isEmpty: true,
        isComplete: false,
        isPartial: false,
        text: 'Complete current step to continue',
        percentage: 0,
        color: 'gray',
      };
    }

    if (currentStepSelections.isPartial) {
      return {
        isEmpty: false,
        isComplete: false,
        isPartial: true,
        text: `${currentStepSelections.total} of ${currentStepSelections.required} selections made`,
        percentage: currentStepSelections.percentage,
        color: 'blue',
      };
    }

    return {
      isEmpty: false,
      isComplete: true,
      isPartial: false,
      text: 'Ready to proceed',
      percentage: 100,
      color: 'green',
    };
  }
}

// React hook for easy integration with existing components
export function useStepSelections(
  activeStep: 'focus-energy' | 'duration-equipment',
  options: PerWorkoutOptions,
  errors: Partial<Record<keyof PerWorkoutOptions, string>>,
  isGenerating: boolean = false
) {
  const selectionState = SelectionCounter.getSelectionState(
    activeStep,
    options
  );
  const buttonState = ButtonStateLogic.getHybridButtonState(
    activeStep,
    options,
    errors,
    isGenerating
  );
  const progressIndicator = ButtonStateLogic.getProgressIndicator(
    activeStep,
    options,
    errors
  );

  // Get field states for enhanced feedback - include all possible fields
  const allFields: (keyof PerWorkoutOptions)[] = [
    'customization_focus',
    'customization_energy',
    'customization_duration',
    'customization_equipment',
    'customization_areas',
    'customization_soreness',
    'customization_stress',
    'customization_sleep',
    'customization_include',
    'customization_exclude',
  ];

  const fieldStates = Object.fromEntries(
    allFields.map((fieldKey) => [
      fieldKey,
      SelectionCounter.getFieldSelectionState(fieldKey, options[fieldKey]),
    ])
  );

  return {
    selectionState,
    buttonState,
    progressIndicator,
    fieldStates,
    // Helper methods
    getCurrentStepSelections: () => selectionState.currentStep,
    getStepProgress: (stepId: string) => {
      if (stepId === 'focus-energy')
        return selectionState.focusEnergy.percentage;
      if (stepId === 'duration-equipment')
        return selectionState.durationEquipment.percentage;
      return 0;
    },
    canProceed: () =>
      selectionState.currentStep.canProceed && Object.keys(errors).length === 0,
  };
}
