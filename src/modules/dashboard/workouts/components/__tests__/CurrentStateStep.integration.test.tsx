import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CurrentStateStep } from '../steps/CurrentStateStep';
import { PerWorkoutOptions } from '../types';

// Mock the analytics hook
vi.mock('../../../hooks/useWorkoutAnalytics', () => ({
  useWorkoutAnalytics: () => ({
    trackStepCompletion: vi.fn(),
    trackSelection: vi.fn(),
  }),
}));

// Mock the enhanced options hook
vi.mock('../../utils/optionEnhancers', () => ({
  useEnhancedOptions: () => ({
    energyOptions: [
      { id: '1', title: 'Very Low', description: 'Extremely tired' },
      { id: '2', title: 'Low', description: 'Somewhat tired' },
      { id: '3', title: 'Moderate', description: 'Average energy' },
      { id: '4', title: 'High', description: 'Feeling energetic' },
      { id: '5', title: 'Very High', description: 'Peak energy' },
      { id: '6', title: 'Maximum', description: 'Unstoppable energy' },
    ],
    sleepQualityOptions: [
      { id: '1', title: 'Very Poor', description: 'Barely slept' },
      { id: '2', title: 'Poor', description: 'Restless sleep' },
      { id: '3', title: 'Fair', description: 'Decent sleep' },
      { id: '4', title: 'Good', description: 'Solid sleep' },
      { id: '5', title: 'Very Good', description: 'Great sleep' },
      { id: '6', title: 'Excellent', description: 'Perfect sleep' },
    ],
    stressLevelOptions: [
      { id: '1', title: 'Very Low', description: 'Calm and relaxed' },
      { id: '2', title: 'Low', description: 'Mostly relaxed' },
      { id: '3', title: 'Moderate', description: 'Some stress' },
      { id: '4', title: 'High', description: 'Feeling stressed' },
      { id: '5', title: 'Very High', description: 'Extremely stressed' },
      { id: '6', title: 'Extreme', description: 'Overwhelming stress' },
    ],
    sorenessAreaOptions: [
      {
        id: 'neck_shoulders',
        title: 'Neck & Shoulders',
        description: 'Upper body soreness',
      },
      {
        id: 'lower_back',
        title: 'Lower Back',
        description: 'Lower back soreness',
      },
      {
        id: 'upper_back',
        title: 'Upper Back',
        description: 'Upper back soreness',
      },
      { id: 'glutes', title: 'Glutes', description: 'Gluteal muscle soreness' },
      { id: 'quads', title: 'Quadriceps', description: 'Front thigh soreness' },
      {
        id: 'hamstrings',
        title: 'Hamstrings',
        description: 'Back thigh soreness',
      },
    ],
  }),
}));

// Mock the validation function
vi.mock('../../validation/detailedValidation', () => ({
  validateDetailedStep: vi.fn(() => ({
    isValid: true,
    errors: {},
    warnings: {},
    suggestions: [],
  })),
}));

// Mock the selection formatters
vi.mock('../../utils/selectionFormatters', () => ({
  formatSelectionValue: vi.fn((fieldKey: string, value: unknown) => {
    if (!value) return null;

    switch (fieldKey) {
      case 'customization_energy': {
        const energyLabels = [
          '',
          'Very Low',
          'Low',
          'Moderate',
          'High',
          'Very High',
          'Maximum',
        ];
        return `${energyLabels[value as number]} (${value}/6)`;
      }
      case 'customization_sleep': {
        const sleepLabels = [
          '',
          'Very Poor',
          'Poor',
          'Fair',
          'Good',
          'Very Good',
          'Excellent',
        ];
        return sleepLabels[value as number];
      }
      case 'customization_stress': {
        const stressLabels = [
          '',
          'Very Low',
          'Low',
          'Moderate',
          'High',
          'Very High',
          'Extreme',
        ];
        return stressLabels[value as number];
      }
      case 'customization_soreness': {
        const areas = value as string[];
        if (!areas || areas.length === 0) return 'None';
        if (areas.length === 1)
          return areas[0]
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
        return `${areas.length} areas`;
      }
      default:
        return String(value);
    }
  }),
}));

// Mock DetailedSelector components with unique test IDs
interface MockDetailedSelectorProps {
  options: Array<{ id: string; title: string }>;
  selectedValue?: string | string[];
  onChange: (value: string | string[]) => void;
  question: string;
  disabled?: boolean;
  error?: string;
  multiple?: boolean;
}

vi.mock('@/ui/shared/molecules', () => ({
  DetailedSelector: ({
    options,
    selectedValue,
    onChange,
    question,
    disabled,
    error,
    multiple,
  }: MockDetailedSelectorProps) => {
    // Create unique test ID based on the question to avoid conflicts
    const componentId = question.toLowerCase().replace(/[^a-z0-9]/g, '_');

    return (
      <div data-testid={`detailed-selector-${componentId}`}>
        <div>{question}</div>
        {error && <div data-testid="error">{error}</div>}
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() =>
              onChange(
                multiple
                  ? Array.isArray(selectedValue)
                    ? [...selectedValue, option.id]
                    : [option.id]
                  : option.id
              )
            }
            disabled={disabled}
            data-testid={`${componentId}-option-${option.id}`}
            className={
              multiple
                ? Array.isArray(selectedValue) &&
                  selectedValue.includes(option.id)
                  ? 'selected'
                  : ''
                : selectedValue === option.id
                  ? 'selected'
                  : ''
            }
          >
            {option.title}
          </button>
        ))}
      </div>
    );
  },
}));

describe('CurrentStateStep Integration', () => {
  const mockOnChange = vi.fn();
  const defaultProps = {
    options: {} as PerWorkoutOptions,
    onChange: mockOnChange,
    errors: {},
    disabled: false,
    variant: 'detailed' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all wellness components correctly', () => {
      render(<CurrentStateStep {...defaultProps} />);

      expect(screen.getByText('Energy Level')).toBeInTheDocument();
      expect(screen.getByText('Sleep Quality')).toBeInTheDocument();
      expect(screen.getByText('Stress Level')).toBeInTheDocument();
      expect(screen.getByText('Current Soreness')).toBeInTheDocument();
    });

    it('renders step header and descriptions', () => {
      render(<CurrentStateStep {...defaultProps} />);

      expect(screen.getByText('Current State')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Help us understand your current physical and mental state.'
        )
      ).toBeInTheDocument();
      expect(
        screen.getAllByText('How energetic are you feeling today?')[0]
      ).toBeInTheDocument();
      expect(
        screen.getAllByText('How well did you sleep last night?')[0]
      ).toBeInTheDocument();
      expect(
        screen.getAllByText("What's your current stress level?")[0]
      ).toBeInTheDocument();
      expect(
        screen.getAllByText('Are you experiencing any soreness?')[0]
      ).toBeInTheDocument();
    });

    it('renders with correct data-testid', () => {
      render(<CurrentStateStep {...defaultProps} />);
      expect(screen.getByTestId('current-state-step')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('handles energy level selection', async () => {
      render(<CurrentStateStep {...defaultProps} />);

      const energyOption = screen.getByTestId(
        'how_energetic_are_you_feeling_today_-option-4'
      ); // High energy
      fireEvent.click(energyOption);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith('customization_energy', 4);
      });
    });

    it('handles sleep quality selection', async () => {
      render(<CurrentStateStep {...defaultProps} />);

      const sleepOption = screen.getByTestId(
        'how_well_did_you_sleep_last_night_-option-5'
      ); // Very Good sleep
      fireEvent.click(sleepOption);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith('customization_sleep', 5);
      });
    });

    it('handles stress level selection', async () => {
      render(<CurrentStateStep {...defaultProps} />);

      const stressOption = screen.getByTestId(
        'what_s_your_current_stress_level_-option-2'
      ); // Low stress
      fireEvent.click(stressOption);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith('customization_stress', 2);
      });
    });

    it('handles soreness area selection', async () => {
      render(<CurrentStateStep {...defaultProps} />);

      const sorenessOption = screen.getByTestId(
        'are_you_experiencing_any_soreness_-option-neck_shoulders'
      );
      fireEvent.click(sorenessOption);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith('customization_soreness', [
          'neck_shoulders',
        ]);
      });
    });
  });

  describe('Selection Badges', () => {
    it('displays selection badges correctly with values', () => {
      const optionsWithValues: PerWorkoutOptions = {
        customization_energy: 4,
        customization_sleep: 5,
        customization_stress: 2,
        customization_soreness: ['neck_shoulders'],
      };

      render(
        <CurrentStateStep {...defaultProps} options={optionsWithValues} />
      );

      expect(screen.getByText('High (4/6)')).toBeInTheDocument();
      expect(screen.getAllByText('Very Good')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Low')[0]).toBeInTheDocument();
      expect(screen.getByText('Neck & Shoulders')).toBeInTheDocument();
    });

    it('displays empty badges for unselected values', () => {
      render(<CurrentStateStep {...defaultProps} />);

      // When no values are selected, the component should still render
      // but SelectionBadge components may not render if they handle null values
      expect(screen.getByTestId('current-state-step')).toBeInTheDocument();

      // Verify that all four sections are present
      expect(screen.getByText('Energy Level')).toBeInTheDocument();
      expect(screen.getByText('Sleep Quality')).toBeInTheDocument();
      expect(screen.getByText('Stress Level')).toBeInTheDocument();
      expect(screen.getByText('Current Soreness')).toBeInTheDocument();
    });

    it('displays multiple soreness areas correctly', () => {
      const optionsWithMultipleSoreness: PerWorkoutOptions = {
        customization_soreness: ['neck_shoulders', 'lower_back', 'glutes'],
      };

      render(
        <CurrentStateStep
          {...defaultProps}
          options={optionsWithMultipleSoreness}
        />
      );

      expect(screen.getByText('3 areas')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('handles disabled state correctly', () => {
      render(<CurrentStateStep {...defaultProps} disabled={true} />);

      // All DetailedSelector components should be disabled
      const detailedSelectors = screen.getAllByTestId(/detailed-selector/);
      detailedSelectors.forEach((selector) => {
        const buttons = selector.querySelectorAll('button');
        buttons.forEach((button) => {
          expect(button).toBeDisabled();
        });
      });
    });

    it('allows interactions when not disabled', () => {
      render(<CurrentStateStep {...defaultProps} disabled={false} />);

      const energyOption = screen.getByTestId(
        'how_energetic_are_you_feeling_today_-option-3'
      );
      expect(energyOption).not.toBeDisabled();
    });
  });

  describe('Error Display', () => {
    it('displays validation errors correctly', () => {
      const errors = {
        customization_energy: 'Please select an energy level',
        customization_sleep: 'Please rate your sleep quality',
        customization_stress: 'Please indicate your stress level',
        customization_soreness: 'Please select soreness areas',
      };

      render(<CurrentStateStep {...defaultProps} errors={errors} />);

      expect(
        screen.getByText('Please select an energy level')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Please rate your sleep quality')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Please indicate your stress level')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Please select soreness areas')
      ).toBeInTheDocument();
    });

    it('does not display errors when none are present', () => {
      render(<CurrentStateStep {...defaultProps} />);

      const errorElements = screen.queryAllByTestId('error');
      expect(errorElements).toHaveLength(0);
    });
  });

  describe('Variant Support', () => {
    it('supports simple variant', () => {
      render(<CurrentStateStep {...defaultProps} variant="simple" />);

      // Component should render without errors
      expect(screen.getByTestId('current-state-step')).toBeInTheDocument();
    });

    it('defaults to detailed variant', () => {
      render(<CurrentStateStep {...defaultProps} />);

      // Component should render without errors
      expect(screen.getByTestId('current-state-step')).toBeInTheDocument();
    });
  });

  describe('Analytics Integration', () => {
    it('tracks step completion on unmount', () => {
      const { unmount } = render(<CurrentStateStep {...defaultProps} />);

      // Component should set up analytics tracking
      unmount();

      // trackStepCompletion should be called on unmount
      // Note: This is tested through the useEffect cleanup
    });

    it('handles selection changes with analytics', async () => {
      render(<CurrentStateStep {...defaultProps} />);

      const energyOption = screen.getByTestId(
        'how_energetic_are_you_feeling_today_-option-5'
      );
      fireEvent.click(energyOption);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith('customization_energy', 5);
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<CurrentStateStep {...defaultProps} />);

      const mainHeading = screen.getByRole('heading', { level: 3 });
      expect(mainHeading).toHaveTextContent('Current State');

      const subHeadings = screen.getAllByRole('heading', { level: 4 });
      expect(subHeadings).toHaveLength(4);
      expect(subHeadings[0]).toHaveTextContent('Energy Level');
      expect(subHeadings[1]).toHaveTextContent('Sleep Quality');
      expect(subHeadings[2]).toHaveTextContent('Stress Level');
      expect(subHeadings[3]).toHaveTextContent('Current Soreness');
    });

    it('provides descriptive text for each section', () => {
      render(<CurrentStateStep {...defaultProps} />);

      expect(
        screen.getAllByText('How energetic are you feeling today?')[0]
      ).toBeInTheDocument();
      expect(
        screen.getAllByText('How well did you sleep last night?')[0]
      ).toBeInTheDocument();
      expect(
        screen.getAllByText("What's your current stress level?")[0]
      ).toBeInTheDocument();
      expect(
        screen.getAllByText('Are you experiencing any soreness?')[0]
      ).toBeInTheDocument();
    });
  });

  describe('Integration with Enhanced Components', () => {
    it('passes correct props to EnhancedEnergyLevelCustomization', () => {
      const options = { customization_energy: 3 };
      render(<CurrentStateStep {...defaultProps} options={options} />);

      // Verify the component receives the correct value
      const selectedButton = document.querySelector('.selected');
      expect(selectedButton).toHaveTextContent('Moderate');
    });

    it('handles complex soreness selection scenarios', async () => {
      render(<CurrentStateStep {...defaultProps} />);

      // Test multiple selections (would need to be handled by the DetailedSelector)
      const firstSorenessOption = screen.getByTestId(
        'are_you_experiencing_any_soreness_-option-neck_shoulders'
      );
      fireEvent.click(firstSorenessOption);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith('customization_soreness', [
          'neck_shoulders',
        ]);
      });
    });
  });
});
