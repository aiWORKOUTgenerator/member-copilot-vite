import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WorkoutStructureStep } from '../WorkoutStructureStep';
import type { PerWorkoutOptions } from '../../types';
import { validateDetailedStep } from '../../../validation/detailedValidation';

// Mock analytics hook
const mockTrackStepCompletion = vi.fn();
const mockTrackValidationError = vi.fn();
vi.mock('../../../hooks/useWorkoutAnalytics', () => ({
  useWorkoutAnalytics: () => ({
    trackSelection: vi.fn(),
    trackStepCompletion: mockTrackStepCompletion,
    trackValidationError: mockTrackValidationError,
  }),
}));

// Mock validation system
vi.mock('../../../validation/detailedValidation', () => ({
  validateDetailedStep: vi.fn(),
}));

// Mock enhanced options
vi.mock('../../utils/optionEnhancers', () => ({
  useEnhancedOptions: () => ({
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
  }),
}));

// Mock DetailedSelector to simulate user interactions
vi.mock('@/ui/shared/molecules', () => ({
  DetailedSelector: ({
    onChange,
    selectedValue,
    options,
  }: {
    onChange: (value: string | string[]) => void;
    selectedValue?: string | string[];
    options: Array<{ id: string; title: string; description?: string }>;
  }) => (
    <div data-testid="enhanced-focus-area-selector">
      {options.map(
        (option: { id: string; title: string; description?: string }) => (
          <button
            key={option.id}
            data-testid={`focus-area-${option.id}`}
            onClick={() => {
              const currentSelection = Array.isArray(selectedValue)
                ? selectedValue
                : [];
              const isSelected = currentSelection.includes(option.id);
              const newSelection = isSelected
                ? currentSelection.filter((id) => id !== option.id)
                : [...currentSelection, option.id];
              onChange(newSelection);
            }}
          >
            {option.title}
          </button>
        )
      )}
    </div>
  ),
}));

// Mock other customization components
vi.mock('../../customizations', () => ({
  CUSTOMIZATION_CONFIG: [
    {
      key: 'customization_duration',
      component: ({
        value,
        onChange,
      }: {
        value?: number;
        onChange: (value: number) => void;
      }) => (
        <div data-testid="duration-component">
          <button onClick={() => onChange(30)}>30 min</button>
          <span>Current: {value || 'none'}</span>
        </div>
      ),
      label: 'Workout Duration',
      icon: () => <span>Clock</span>,
      category: 'Workout Goals & Structure',
    },
    {
      key: 'customization_focus',
      component: ({
        value,
        onChange,
      }: {
        value?: string;
        onChange: (value: string) => void;
      }) => (
        <div data-testid="focus-component">
          <button onClick={() => onChange('strength')}>Strength</button>
          <span>Current: {value || 'none'}</span>
        </div>
      ),
      label: 'Workout Focus',
      icon: () => <span>Heart</span>,
      category: 'Workout Goals & Structure',
    },
    {
      key: 'customization_areas',
      component: ({
        value,
        onChange,
      }: {
        value?: string[];
        onChange: (value: string[]) => void;
      }) => (
        <div data-testid="enhanced-focus-area-component">
          <button
            data-testid="add-upper-body"
            onClick={() => {
              const current = value || [];
              onChange([...current, 'upper_body']);
            }}
          >
            Add Upper Body
          </button>
          <span>Areas: {JSON.stringify(value || [])}</span>
        </div>
      ),
      label: 'Focus Areas',
      icon: () => <span>Target</span>,
      category: 'Workout Goals & Structure',
    },
  ],
}));

// Mock SelectionBadge
vi.mock('@/ui/shared/atoms', () => ({
  SelectionBadge: ({ value }: { value?: string }) => (
    <span data-testid="selection-badge">{value || 'None'}</span>
  ),
}));

describe('WorkoutStructureStep Integration', () => {
  const mockOnChange = vi.fn();
  const defaultOptions: PerWorkoutOptions = {
    customization_duration: undefined,
    customization_focus: undefined,
    customization_areas: undefined,
  };
  const defaultErrors = {};

  beforeEach(() => {
    vi.clearAllMocks();
    const mockValidateDetailedStep = vi.mocked(validateDetailedStep);
    mockValidateDetailedStep.mockReturnValue({
      isValid: true,
      errors: {},
      warnings: {},
      suggestions: [],
    });
  });

  it('renders all workout structure components', () => {
    render(
      <WorkoutStructureStep
        options={defaultOptions}
        onChange={mockOnChange}
        errors={defaultErrors}
        disabled={false}
      />
    );

    expect(screen.getByTestId('duration-component')).toBeInTheDocument();
    expect(screen.getByTestId('focus-component')).toBeInTheDocument();
    expect(
      screen.getByTestId('enhanced-focus-area-component')
    ).toBeInTheDocument();
  });

  it('displays step header and description', () => {
    render(
      <WorkoutStructureStep
        options={defaultOptions}
        onChange={mockOnChange}
        errors={defaultErrors}
      />
    );

    expect(screen.getByText('Workout Structure')).toBeInTheDocument();
    expect(
      screen.getByText(/Define your workout's core parameters/)
    ).toBeInTheDocument();
  });

  it('handles focus area selection with validation integration', async () => {
    render(
      <WorkoutStructureStep
        options={defaultOptions}
        onChange={mockOnChange}
        errors={defaultErrors}
      />
    );

    fireEvent.click(screen.getByTestId('add-upper-body'));

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('customization_areas', [
        'upper_body',
      ]);
      expect(validateDetailedStep).toHaveBeenCalledWith('workout-structure', {
        ...defaultOptions,
        customization_areas: ['upper_body'],
      });
    });
  });

  it('tracks validation errors when they occur', async () => {
    // Mock validation to return an error
    const mockValidateDetailedStep = vi.mocked(validateDetailedStep);
    mockValidateDetailedStep.mockReturnValue({
      isValid: false,
      errors: {
        customization_areas: 'Select up to 5 focus areas',
      },
      warnings: {},
      suggestions: [],
    });

    render(
      <WorkoutStructureStep
        options={defaultOptions}
        onChange={mockOnChange}
        errors={defaultErrors}
      />
    );

    fireEvent.click(screen.getByTestId('add-upper-body'));

    await waitFor(() => {
      expect(mockTrackValidationError).toHaveBeenCalledWith(
        'customization_areas',
        'Select up to 5 focus areas',
        'detailed',
        ['upper_body']
      );
    });
  });

  it('tracks step completion on component unmount', () => {
    const optionsWithData: PerWorkoutOptions = {
      customization_duration: 30,
      customization_focus: 'strength',
      customization_areas: ['upper_body', 'core'],
    };

    const { unmount } = render(
      <WorkoutStructureStep
        options={optionsWithData}
        onChange={mockOnChange}
        errors={defaultErrors}
      />
    );

    unmount();

    expect(mockTrackStepCompletion).toHaveBeenCalledWith(
      'workout-structure',
      expect.any(Number), // duration
      'detailed',
      100, // completion rate (3/3 fields completed)
      3 // field count
    );
  });

  it('calculates completion rate correctly', () => {
    const partialOptions: PerWorkoutOptions = {
      customization_duration: 30,
      customization_focus: undefined,
      customization_areas: ['upper_body'],
    };

    const { unmount } = render(
      <WorkoutStructureStep
        options={partialOptions}
        onChange={mockOnChange}
        errors={defaultErrors}
      />
    );

    unmount();

    expect(mockTrackStepCompletion).toHaveBeenCalledWith(
      'workout-structure',
      expect.any(Number),
      'detailed',
      (2 / 3) * 100, // 2 out of 3 fields completed
      2
    );
  });

  it('formats selection values correctly in badges', () => {
    const optionsWithSelections: PerWorkoutOptions = {
      customization_duration: 45,
      customization_focus: 'muscle_building',
      customization_areas: ['upper_body', 'lower_body'],
    };

    render(
      <WorkoutStructureStep
        options={optionsWithSelections}
        onChange={mockOnChange}
        errors={defaultErrors}
      />
    );

    const badges = screen.getAllByTestId('selection-badge');

    // Duration should be formatted as "45 min"
    expect(badges.some((badge) => badge.textContent === '45 min')).toBe(true);

    // Focus should be formatted with proper capitalization
    expect(
      badges.some((badge) => badge.textContent === 'Muscle Building')
    ).toBe(true);

    // Areas should show count for multiple selections
    expect(badges.some((badge) => badge.textContent === '2 areas')).toBe(true);
  });

  it('handles disabled state correctly', () => {
    render(
      <WorkoutStructureStep
        options={defaultOptions}
        onChange={mockOnChange}
        errors={defaultErrors}
        disabled={true}
      />
    );

    // Components should still render but be disabled
    expect(screen.getByTestId('duration-component')).toBeInTheDocument();
    expect(screen.getByTestId('focus-component')).toBeInTheDocument();
    expect(
      screen.getByTestId('enhanced-focus-area-component')
    ).toBeInTheDocument();
  });

  it('displays validation errors for focus areas', () => {
    const errorsWithFocusArea = {
      customization_areas: 'Select up to 5 focus areas',
    };

    render(
      <WorkoutStructureStep
        options={defaultOptions}
        onChange={mockOnChange}
        errors={errorsWithFocusArea}
      />
    );

    // The error should be passed to the enhanced component
    expect(
      screen.getByTestId('enhanced-focus-area-component')
    ).toBeInTheDocument();
  });

  it('handles duration formatting correctly', () => {
    const testCases = [
      { duration: 30, expected: '30 min' },
      { duration: 60, expected: '1 hour' },
      { duration: 90, expected: '1h 30m' },
      { duration: 120, expected: '2 hours' },
    ];

    testCases.forEach(({ duration, expected }) => {
      const options = { ...defaultOptions, customization_duration: duration };

      const { unmount } = render(
        <WorkoutStructureStep
          options={options}
          onChange={mockOnChange}
          errors={defaultErrors}
        />
      );

      const badges = screen.getAllByTestId('selection-badge');
      expect(badges.some((badge) => badge.textContent === expected)).toBe(true);

      unmount();
    });
  });

  it('handles focus areas formatting correctly', () => {
    const testCases = [
      { areas: [], expected: 'None' },
      { areas: ['upper_body'], expected: 'Upper Body' },
      { areas: ['upper_body', 'core'], expected: '2 areas' },
      { areas: ['upper_body', 'core', 'lower_body'], expected: '3 areas' },
    ];

    testCases.forEach(({ areas, expected }) => {
      const options = {
        ...defaultOptions,
        customization_areas: areas.length > 0 ? areas : undefined,
      };

      const { unmount } = render(
        <WorkoutStructureStep
          options={options}
          onChange={mockOnChange}
          errors={defaultErrors}
        />
      );

      const badges = screen.getAllByTestId('selection-badge');
      expect(badges.some((badge) => badge.textContent === expected)).toBe(true);

      unmount();
    });
  });

  it('maintains proper component lifecycle for analytics', async () => {
    const { rerender, unmount } = render(
      <WorkoutStructureStep
        options={defaultOptions}
        onChange={mockOnChange}
        errors={defaultErrors}
      />
    );

    // Simulate user interactions
    fireEvent.click(screen.getByTestId('add-upper-body'));

    // Update props to simulate state changes
    const updatedOptions = {
      ...defaultOptions,
      customization_areas: ['upper_body'],
    };
    rerender(
      <WorkoutStructureStep
        options={updatedOptions}
        onChange={mockOnChange}
        errors={defaultErrors}
      />
    );

    // Unmount to trigger completion tracking
    unmount();

    expect(mockTrackStepCompletion).toHaveBeenCalled();
  });
});
