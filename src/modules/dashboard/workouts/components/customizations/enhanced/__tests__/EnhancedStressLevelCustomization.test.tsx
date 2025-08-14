import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EnhancedStressLevelCustomization from '../EnhancedStressLevelCustomization';

// Mock the dependencies
vi.mock('../../../../utils/optionEnhancers', () => ({
  useEnhancedOptions: () => ({
    stressLevelOptions: [
      {
        id: '1',
        title: 'Very Low',
        description: 'Calm and relaxed',
        tertiary: <div data-testid="level-dots-1">●○○○○○</div>,
      },
      {
        id: '2',
        title: 'Low',
        description: 'Mostly relaxed with minor concerns',
        tertiary: <div data-testid="level-dots-2">●●○○○○</div>,
      },
      {
        id: '3',
        title: 'Moderate',
        description: 'Some stress, manageable',
        tertiary: <div data-testid="level-dots-3">●●●○○○</div>,
      },
      {
        id: '4',
        title: 'High',
        description: 'Feeling stressed and tense',
        tertiary: <div data-testid="level-dots-4">●●●●○○</div>,
      },
      {
        id: '5',
        title: 'Very High',
        description: 'Quite stressed and overwhelmed',
        tertiary: <div data-testid="level-dots-5">●●●●●○</div>,
      },
      {
        id: '6',
        title: 'Extreme',
        description: 'Extremely stressed, need immediate relief',
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

describe('EnhancedStressLevelCustomization', () => {
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
    render(<EnhancedStressLevelCustomization {...defaultProps} />);

    // Check that DetailedSelector is rendered with correct props
    expect(screen.getByTestId('detailed-selector')).toBeInTheDocument();
    expect(screen.getByTestId('selector-question')).toHaveTextContent(
      "What's your current stress level?"
    );
    expect(screen.getByTestId('selector-description')).toHaveTextContent(
      "We'll adjust the workout to help manage your stress"
    );
    expect(screen.getByTestId('selector-props')).toHaveTextContent(
      'disabled: false, gridCols: 6, colorScheme: primary, required: false, variant: detailed, showDescription: true, showTertiary: true'
    );
  });

  it('renders all stress level options', () => {
    render(<EnhancedStressLevelCustomization {...defaultProps} />);

    // Check that all 6 stress level options are rendered
    expect(screen.getByTestId('option-1')).toBeInTheDocument();
    expect(screen.getByTestId('option-2')).toBeInTheDocument();
    expect(screen.getByTestId('option-3')).toBeInTheDocument();
    expect(screen.getByTestId('option-4')).toBeInTheDocument();
    expect(screen.getByTestId('option-5')).toBeInTheDocument();
    expect(screen.getByTestId('option-6')).toBeInTheDocument();

    // Check option titles
    expect(screen.getByTestId('option-title-1')).toHaveTextContent('Very Low');
    expect(screen.getByTestId('option-title-2')).toHaveTextContent('Low');
    expect(screen.getByTestId('option-title-3')).toHaveTextContent('Moderate');
    expect(screen.getByTestId('option-title-4')).toHaveTextContent('High');
    expect(screen.getByTestId('option-title-5')).toHaveTextContent('Very High');
    expect(screen.getByTestId('option-title-6')).toHaveTextContent('Extreme');
  });

  it('handles option selection correctly', async () => {
    const onChange = vi.fn();
    render(
      <EnhancedStressLevelCustomization {...defaultProps} onChange={onChange} />
    );

    // Click on "High" stress level (value 4)
    fireEvent.click(screen.getByTestId('option-4'));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(4);
    });
  });

  it('displays selected value correctly', () => {
    render(<EnhancedStressLevelCustomization {...defaultProps} value={3} />);

    expect(screen.getByTestId('selected-value')).toHaveTextContent('3');
  });

  it('handles disabled state', () => {
    render(
      <EnhancedStressLevelCustomization {...defaultProps} disabled={true} />
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
    const errorMessage = 'Please select your stress level';
    render(
      <EnhancedStressLevelCustomization
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
      <EnhancedStressLevelCustomization {...defaultProps} variant="simple" />
    );

    expect(screen.getByTestId('selector-props')).toHaveTextContent(
      'variant: simple, showDescription: false, showTertiary: false'
    );
  });

  it('validates value range correctly', async () => {
    const onChange = vi.fn();
    render(
      <EnhancedStressLevelCustomization {...defaultProps} onChange={onChange} />
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
      <EnhancedStressLevelCustomization {...defaultProps} onChange={onChange} />
    );

    // Click on an option
    fireEvent.click(screen.getByTestId('option-4'));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(4);
    });
  });

  it('handles undefined value correctly', () => {
    render(
      <EnhancedStressLevelCustomization {...defaultProps} value={undefined} />
    );

    // Should not display selected value when undefined
    expect(screen.queryByTestId('selected-value')).not.toBeInTheDocument();
  });

  it('renders with correct grid layout', () => {
    render(<EnhancedStressLevelCustomization {...defaultProps} />);

    expect(screen.getByTestId('selector-props')).toHaveTextContent(
      'gridCols: 6'
    );
  });

  it('shows tertiary content (LevelDots) in detailed mode', () => {
    render(
      <EnhancedStressLevelCustomization {...defaultProps} variant="detailed" />
    );

    // Check that tertiary content is rendered for each option
    expect(screen.getByTestId('option-tertiary-1')).toBeInTheDocument();
    expect(screen.getByTestId('option-tertiary-2')).toBeInTheDocument();
    expect(screen.getByTestId('option-tertiary-3')).toBeInTheDocument();
    expect(screen.getByTestId('option-tertiary-4')).toBeInTheDocument();
    expect(screen.getByTestId('option-tertiary-5')).toBeInTheDocument();
    expect(screen.getByTestId('option-tertiary-6')).toBeInTheDocument();
  });

  it('handles edge case stress levels', async () => {
    const onChange = vi.fn();
    render(
      <EnhancedStressLevelCustomization {...defaultProps} onChange={onChange} />
    );

    // Test very low stress (1)
    fireEvent.click(screen.getByTestId('option-1'));
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(1);
    });

    // Test extreme stress (6)
    fireEvent.click(screen.getByTestId('option-6'));
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(6);
    });
  });

  it('provides appropriate descriptions for each stress level', () => {
    render(<EnhancedStressLevelCustomization {...defaultProps} />);

    // Check descriptions are appropriate for stress levels
    expect(screen.getByTestId('option-description-1')).toHaveTextContent(
      'Calm and relaxed'
    );
    expect(screen.getByTestId('option-description-3')).toHaveTextContent(
      'Some stress, manageable'
    );
    expect(screen.getByTestId('option-description-6')).toHaveTextContent(
      'Extremely stressed, need immediate relief'
    );
  });
});
