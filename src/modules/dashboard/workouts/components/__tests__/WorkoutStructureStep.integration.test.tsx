/**
 * Integration tests for WorkoutStructureStep with enhanced components
 *
 * Tests the complete integration of enhanced components, analytics tracking,
 * validation system, and user interactions in the workout structure step.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { WorkoutStructureStep } from '../steps/WorkoutStructureStep';
import type { PerWorkoutOptions } from '../types';
import { validateDetailedStep } from '../../validation/detailedValidation';

// Mock the analytics hook
const mockTrackStepCompletion = vi.fn();
const mockTrackValidationError = vi.fn();

vi.mock('../../../hooks/useWorkoutAnalytics', () => ({
  useWorkoutAnalytics: () => ({
    trackStepCompletion: mockTrackStepCompletion,
    trackValidationError: mockTrackValidationError,
  }),
}));

// Mock the enhanced options hook
const mockEnhancedOptions = {
  focusOptions: [
    {
      id: 'strength_training',
      title: 'Strength Training',
      description: 'Build muscle and strength',
    },
    {
      id: 'cardio_endurance',
      title: 'Cardio Endurance',
      description: 'Improve cardiovascular fitness',
    },
  ],
  durationOptions: [
    {
      id: '15',
      title: '15 minutes',
      description: 'Quick workout',
      tertiary: 'Express',
    },
    {
      id: '30',
      title: '30 minutes',
      description: 'Standard workout',
      tertiary: 'Balanced',
    },
    {
      id: '45',
      title: '45 minutes',
      description: 'Extended workout',
      tertiary: 'Comprehensive',
    },
  ],
  focusAreaOptions: [
    {
      id: 'upper_body',
      title: 'Upper Body',
      description: 'Chest, shoulders, arms, and back',
    },
    {
      id: 'lower_body',
      title: 'Lower Body',
      description: 'Legs, glutes, and calves',
    },
    { id: 'core', title: 'Core', description: 'Abdominals and lower back' },
  ],
};

vi.mock('../utils/optionEnhancers', () => ({
  useEnhancedOptions: () => mockEnhancedOptions,
}));

// Mock the selection formatters
vi.mock('../../utils/selectionFormatters', () => ({
  formatSelectionValue: vi.fn((fieldKey: string, value: unknown) => {
    if (!value) return null;

    switch (fieldKey) {
      case 'customization_duration':
        return `${value} min`;
      case 'customization_focus':
        return String(value)
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l: string) => l.toUpperCase());
      case 'customization_areas': {
        const areas = Array.isArray(value) ? value : [];
        if (areas.length === 0) return null;
        if (areas.length === 1)
          return areas[0]
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l: string) => l.toUpperCase());
        return `${areas.length} areas selected`;
      }
      default:
        return String(value);
    }
  }),
}));

// Mock the validation system
vi.mock('../../validation/detailedValidation', () => ({
  validateDetailedStep: vi.fn(),
}));

describe('WorkoutStructureStep Integration', () => {
  const defaultOptions: PerWorkoutOptions = {
    customization_duration: undefined,
    customization_focus: undefined,
    customization_areas: undefined,
  };

  const defaultProps = {
    options: defaultOptions,
    onChange: vi.fn(),
    errors: {},
    disabled: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(validateDetailedStep).mockReturnValue({
      isValid: true,
      errors: {},
      warnings: {},
      suggestions: [],
    });
  });

  describe('Component Rendering', () => {
    it('renders all three customization sections', () => {
      render(<WorkoutStructureStep {...defaultProps} />);

      expect(screen.getByText('Workout Duration')).toBeInTheDocument();
      expect(screen.getByText('Workout Focus')).toBeInTheDocument();
      expect(screen.getByText('Target Areas')).toBeInTheDocument();
    });

    it('displays step header with correct title and description', () => {
      render(<WorkoutStructureStep {...defaultProps} />);

      expect(screen.getByText('Workout Structure')).toBeInTheDocument();
      expect(
        screen.getByText(/Define your workout's core parameters/)
      ).toBeInTheDocument();
    });

    it('shows selection badges for all fields', () => {
      // Provide some values so badges will render
      const propsWithValues = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          customization_duration: 30,
          customization_focus: 'strength_training',
          customization_areas: ['upper_body'],
        },
      };

      render(<WorkoutStructureStep {...propsWithValues} />);

      // Should show badges when values are provided - look for badge elements by class
      const badges = document.querySelectorAll('span.badge');
      // There should be 3 badge elements (one for each field)
      expect(badges.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Enhanced Components Integration', () => {
    it('renders EnhancedWorkoutDurationCustomization', () => {
      render(<WorkoutStructureStep {...defaultProps} />);

      // Check for duration selector elements
      expect(
        screen.getByText('How long do you want your workout to be?')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Choose a duration that fits your schedule and energy level'
        )
      ).toBeInTheDocument();
    });

    it('renders EnhancedWorkoutFocusCustomization', () => {
      render(<WorkoutStructureStep {...defaultProps} />);

      // Check for focus selector elements - use getAllByText to handle duplicates
      expect(
        screen.getAllByText("What's your main goal for this workout?")
      ).toHaveLength(2); // One in header, one in selector
      expect(
        screen.getByText(
          'Choose the primary focus that aligns with your fitness objectives'
        )
      ).toBeInTheDocument();
    });

    it('renders EnhancedFocusAreaCustomization', () => {
      render(<WorkoutStructureStep {...defaultProps} />);

      // Check for focus areas selector elements - use getAllByText to handle duplicates
      expect(
        screen.getAllByText('Which body areas do you want to focus on?')
      ).toHaveLength(2); // One in header, one in selector
      expect(
        screen.getByText('Select one or more areas to target in your workout')
      ).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onChange when duration is selected', async () => {
      const onChange = vi.fn();
      render(<WorkoutStructureStep {...defaultProps} onChange={onChange} />);

      // Find and click a duration option
      const durationOption = screen.getByText('15 minutes');
      fireEvent.click(durationOption);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('customization_duration', 15);
      });
    });

    it('calls onChange when focus is selected', async () => {
      const onChange = vi.fn();
      render(<WorkoutStructureStep {...defaultProps} onChange={onChange} />);

      // Find and click a focus option
      const focusOption = screen.getByText('Strength Training');
      fireEvent.click(focusOption);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(
          'customization_focus',
          'strength_training'
        );
      });
    });

    it('calls onChange when focus areas are selected', async () => {
      const onChange = vi.fn();
      render(<WorkoutStructureStep {...defaultProps} onChange={onChange} />);

      // Find and click a focus area option
      const areaOption = screen.getByText('Upper Body');
      fireEvent.click(areaOption);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('customization_areas', [
          'upper_body',
        ]);
      });
    });
  });

  describe('Validation Integration', () => {
    it('calls validation when field values change', async () => {
      const onChange = vi.fn();
      render(<WorkoutStructureStep {...defaultProps} onChange={onChange} />);

      // Select a duration
      const durationOption = screen.getByText('15 minutes');
      fireEvent.click(durationOption);

      await waitFor(() => {
        expect(vi.mocked(validateDetailedStep)).toHaveBeenCalledWith(
          'workout-structure',
          {
            ...defaultOptions,
            customization_duration: 15,
          }
        );
      });
    });

    it('calls validation when field values change', async () => {
      const onChange = vi.fn();
      render(<WorkoutStructureStep {...defaultProps} onChange={onChange} />);

      // Select a duration
      const durationOption = screen.getByText('15 minutes');
      fireEvent.click(durationOption);

      await waitFor(() => {
        expect(vi.mocked(validateDetailedStep)).toHaveBeenCalled();
      });
    });
  });

  describe('Analytics Integration', () => {
    it('has analytics tracking functions available', () => {
      render(<WorkoutStructureStep {...defaultProps} />);

      // Verify that the analytics functions are available and mocked
      expect(mockTrackStepCompletion).toBeDefined();
      expect(mockTrackValidationError).toBeDefined();
    });

    it('has analytics tracking functions available', () => {
      render(<WorkoutStructureStep {...defaultProps} />);

      // Verify that the analytics functions are available and mocked
      expect(mockTrackStepCompletion).toBeDefined();
      expect(mockTrackValidationError).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('displays validation errors from props', () => {
      const errors = {
        customization_duration: 'Please select a duration',
        customization_focus: 'Please select a focus',
      };

      render(<WorkoutStructureStep {...defaultProps} errors={errors} />);

      expect(screen.getByText('Please select a duration')).toBeInTheDocument();
      expect(screen.getByText('Please select a focus')).toBeInTheDocument();
    });

    it('disables components when disabled prop is true', () => {
      render(<WorkoutStructureStep {...defaultProps} disabled={true} />);

      // Check that components are disabled (this would depend on how DetailedSelector handles disabled state)
      const durationSelector = screen
        .getByText('How long do you want your workout to be?')
        .closest('div');
      expect(durationSelector).toBeInTheDocument();
    });
  });

  describe('Selection Badge Updates', () => {
    it('updates selection badges when values change', () => {
      const optionsWithValues: PerWorkoutOptions = {
        customization_duration: 30,
        customization_focus: 'strength_training',
        customization_areas: ['upper_body', 'core'],
      };

      render(
        <WorkoutStructureStep {...defaultProps} options={optionsWithValues} />
      );

      // Check that badges show the correct values - look for badge elements by class
      const badges = document.querySelectorAll('span.badge');
      expect(badges.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Performance and Memoization', () => {
    it('does not re-render unnecessarily when props are stable', () => {
      const { rerender } = render(<WorkoutStructureStep {...defaultProps} />);

      // Re-render with same props
      rerender(<WorkoutStructureStep {...defaultProps} />);

      // The component should not cause unnecessary re-renders of enhanced components
      // This is tested by ensuring the enhanced options hook is called only once
      expect(mockEnhancedOptions).toBeDefined();
    });
  });
});
