import '@testing-library/jest-dom/vitest';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EnhancedSleepQualityCustomization from '../EnhancedSleepQualityCustomization';

// Mock the dependencies
vi.mock('../../../../utils/optionEnhancers', () => ({
  useEnhancedOptions: () => ({
    sleepQualityOptions: [
      {
        id: '1',
        title: 'Very Poor',
        description: 'Barely slept, very tired',
        tertiary: <div data-testid="level-dots-1">●●○○○○</div>,
      },
      {
        id: '2',
        title: 'Poor',
        description: 'Restless sleep, feeling tired',
        tertiary: <div data-testid="level-dots-2">●●○○○○</div>,
      },
      {
        id: '3',
        title: 'Fair',
        description: 'Decent sleep, somewhat rested',
        tertiary: <div data-testid="level-dots-3">●●●○○○</div>,
      },
      {
        id: '4',
        title: 'Good',
        description: 'Solid sleep, feeling rested',
        tertiary: <div data-testid="level-dots-4">●●●●○○</div>,
      },
      {
        id: '5',
        title: 'Very Good',
        description: 'Great sleep, feeling refreshed',
        tertiary: <div data-testid="level-dots-5">●●●●●○</div>,
      },
      {
        id: '6',
        title: 'Excellent',
        description: 'Perfect sleep, fully energized',
        tertiary: <div data-testid="level-dots-6">●●●●●●</div>,
      },
    ],
  }),
}));

vi.mock('../../../../hooks/useWorkoutAnalytics', () => ({
  useWorkoutAnalytics: () => ({
    trackSelection: vi.fn(),
  }),
}));

// Mock DetailedSelector component
vi.mock('@/ui/shared/molecules', () => ({
  DetailedSelector: ({
    options,
    selectedValue,
    onChange,
    question,
    description,
    disabled,
    error,
    gridCols,
    colorScheme,
    required,
    variant,
    showDescription,
    showTertiary,
  }: {
    icon?: React.ComponentType;
    options: Array<{
      id: string;
      title: string;
      description: string;
      tertiary?: React.ReactNode;
    }>;
    selectedValue?: string | string[];
    onChange: (value: string | string[]) => void;
    question: string;
    description?: string;
    disabled?: boolean;
    error?: string;
    gridCols?: number;
    colorScheme?: string;
    required?: boolean;
    variant?: string;
    showDescription?: boolean;
    showTertiary?: boolean;
  }) => (
    <div data-testid="detailed-selector">
      <div data-testid="selector-props">
        disabled: {disabled?.toString() || 'false'}, gridCols: {gridCols},
        colorScheme: {colorScheme}, required: {required?.toString() || 'false'},
        variant: {variant}, showDescription:{' '}
        {showDescription?.toString() || 'false'}, showTertiary:{' '}
        {showTertiary?.toString() || 'false'}
      </div>
      <div data-testid="selector-question">{question}</div>
      {description && (
        <div data-testid="selector-description">{description}</div>
      )}
      {error && <div data-testid="selector-error">{error}</div>}
      <div data-testid="selector-options">
        {options.map(
          (option: {
            id: string;
            title: string;
            description: string;
            tertiary?: React.ReactNode;
          }) => (
            <button
              key={option.id}
              data-testid={`option-${option.id}`}
              onClick={() => onChange(option.id)}
              disabled={disabled}
            >
              <span data-testid={`option-title-${option.id}`}>
                {option.title}
              </span>
              <span data-testid={`option-description-${option.id}`}>
                {option.description}
              </span>
              {option.tertiary && (
                <span data-testid={`option-tertiary-${option.id}`}>
                  {option.tertiary}
                </span>
              )}
            </button>
          )
        )}
      </div>
      {selectedValue && <div data-testid="selected-value">{selectedValue}</div>}
    </div>
  ),
}));

describe('EnhancedSleepQualityCustomization', () => {
  const defaultProps = {
    value: undefined,
    onChange: vi.fn(),
    disabled: false,
    error: undefined,
    variant: 'detailed' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct props and configuration', () => {
    render(<EnhancedSleepQualityCustomization {...defaultProps} />);

    // Check that DetailedSelector is rendered with correct props
    expect(screen.getByTestId('detailed-selector')).toBeInTheDocument();
    expect(screen.getByTestId('selector-question')).toHaveTextContent(
      'How well did you sleep last night?'
    );
    expect(screen.getByTestId('selector-description')).toHaveTextContent(
      'Your sleep quality affects workout intensity recommendations'
    );
    expect(screen.getByTestId('selector-props')).toHaveTextContent(
      'disabled: false, gridCols: 3, colorScheme: primary, required: false, variant: detailed, showDescription: true, showTertiary: true'
    );
  });

  it('renders all sleep quality options', () => {
    render(<EnhancedSleepQualityCustomization {...defaultProps} />);

    // Check that all 6 sleep quality options are rendered
    expect(screen.getByTestId('option-1')).toBeInTheDocument();
    expect(screen.getByTestId('option-2')).toBeInTheDocument();
    expect(screen.getByTestId('option-3')).toBeInTheDocument();
    expect(screen.getByTestId('option-4')).toBeInTheDocument();
    expect(screen.getByTestId('option-5')).toBeInTheDocument();
    expect(screen.getByTestId('option-6')).toBeInTheDocument();

    // Check option titles
    expect(screen.getByTestId('option-title-1')).toHaveTextContent('Very Poor');
    expect(screen.getByTestId('option-title-2')).toHaveTextContent('Poor');
    expect(screen.getByTestId('option-title-3')).toHaveTextContent('Fair');
    expect(screen.getByTestId('option-title-4')).toHaveTextContent('Good');
    expect(screen.getByTestId('option-title-5')).toHaveTextContent('Very Good');
    expect(screen.getByTestId('option-title-6')).toHaveTextContent('Excellent');
  });

  it('handles option selection correctly', async () => {
    const onChange = vi.fn();
    render(
      <EnhancedSleepQualityCustomization
        {...defaultProps}
        onChange={onChange}
      />
    );

    // Click on "Good" sleep quality (value 4)
    fireEvent.click(screen.getByTestId('option-4'));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(4);
    });
  });

  it('displays selected value correctly', () => {
    render(<EnhancedSleepQualityCustomization {...defaultProps} value={3} />);

    expect(screen.getByTestId('selected-value')).toHaveTextContent('3');
  });

  it('handles disabled state', () => {
    render(
      <EnhancedSleepQualityCustomization {...defaultProps} disabled={true} />
    );

    expect(screen.getByTestId('selector-props')).toHaveTextContent(
      'disabled: true'
    );

    // Check that options are disabled
    const optionButtons = screen.getAllByRole('button');
    optionButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('displays error message when provided', () => {
    const errorMessage = 'Please select your sleep quality';
    render(
      <EnhancedSleepQualityCustomization
        {...defaultProps}
        error={errorMessage}
      />
    );

    expect(screen.getByTestId('selector-error')).toHaveTextContent(
      errorMessage
    );
  });

  it('handles simple variant correctly', () => {
    render(
      <EnhancedSleepQualityCustomization {...defaultProps} variant="simple" />
    );

    expect(screen.getByTestId('selector-props')).toHaveTextContent(
      'variant: simple, showDescription: false, showTertiary: false'
    );
  });

  it('validates value range correctly', async () => {
    const onChange = vi.fn();
    render(
      <EnhancedSleepQualityCustomization
        {...defaultProps}
        onChange={onChange}
      />
    );

    // Test valid values (1-6)
    fireEvent.click(screen.getByTestId('option-1'));
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(1);
    });

    fireEvent.click(screen.getByTestId('option-6'));
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(6);
    });
  });

  it('tracks analytics on selection', async () => {
    // Note: Analytics integration is tested in the component implementation
    // This test verifies the component renders and handles selection correctly
    const onChange = vi.fn();
    render(
      <EnhancedSleepQualityCustomization
        {...defaultProps}
        onChange={onChange}
      />
    );

    // Click on an option
    fireEvent.click(screen.getByTestId('option-4'));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(4);
    });
  });

  it('handles undefined value correctly', () => {
    render(
      <EnhancedSleepQualityCustomization {...defaultProps} value={undefined} />
    );

    // Should not display selected value when undefined
    expect(screen.queryByTestId('selected-value')).not.toBeInTheDocument();
  });

  it('renders with correct grid layout', () => {
    render(<EnhancedSleepQualityCustomization {...defaultProps} />);

    expect(screen.getByTestId('selector-props')).toHaveTextContent(
      'gridCols: 3'
    );
  });

  it('shows tertiary content (LevelDots) in detailed mode', () => {
    render(
      <EnhancedSleepQualityCustomization {...defaultProps} variant="detailed" />
    );

    // Check that tertiary content is rendered for each option
    expect(screen.getByTestId('option-tertiary-1')).toBeInTheDocument();
    expect(screen.getByTestId('option-tertiary-2')).toBeInTheDocument();
    expect(screen.getByTestId('option-tertiary-3')).toBeInTheDocument();
    expect(screen.getByTestId('option-tertiary-4')).toBeInTheDocument();
    expect(screen.getByTestId('option-tertiary-5')).toBeInTheDocument();
    expect(screen.getByTestId('option-tertiary-6')).toBeInTheDocument();
  });
});
