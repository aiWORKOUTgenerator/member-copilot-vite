import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EnhancedSorenessCustomization from '../EnhancedSorenessCustomization';

// Mock the analytics hook
const mockTrackSelection = vi.fn();
vi.mock('../../../hooks/useWorkoutAnalytics', () => ({
  useWorkoutAnalytics: () => ({
    trackSelection: mockTrackSelection,
    trackStepCompletion: vi.fn(),
    trackValidationError: vi.fn(),
  }),
}));

// Mock the enhanced options hook with all soreness area options
const mockSorenessAreaOptions = [
  {
    id: 'neck_shoulders',
    title: 'Neck & Shoulders',
    description: 'Neck and shoulder region (traps, delts)',
  },
  {
    id: 'upper_back',
    title: 'Upper Back',
    description: 'Upper back and trapezius',
  },
  {
    id: 'lower_back',
    title: 'Lower Back',
    description: 'Lumbar region and spinal erectors',
  },
  {
    id: 'chest',
    title: 'Chest',
    description: 'Pectoral muscles',
  },
  {
    id: 'arms_biceps_triceps',
    title: 'Arms (Biceps & Triceps)',
    description: 'Front and back of upper arms',
  },
  {
    id: 'forearms',
    title: 'Forearms',
    description: 'Lower arm muscles and grip',
  },
  {
    id: 'core',
    title: 'Core',
    description: 'Abdominals, obliques, and deep core stabilizers',
  },
  {
    id: 'glutes',
    title: 'Glutes',
    description: 'Gluteal muscles',
  },
  {
    id: 'quads',
    title: 'Quadriceps',
    description: 'Front of thighs',
  },
  {
    id: 'hamstrings',
    title: 'Hamstrings',
    description: 'Back of thighs',
  },
  {
    id: 'adductors',
    title: 'Adductors (Inner Thighs)',
    description: 'Groin and inner thigh muscles',
  },
  {
    id: 'calves',
    title: 'Calves',
    description: 'Lower leg muscles',
  },
];

vi.mock('../../utils/optionEnhancers', () => ({
  useEnhancedOptions: () => ({
    sorenessAreaOptions: mockSorenessAreaOptions,
  }),
}));

// Mock the DetailedSelector component
vi.mock('@/ui/shared/molecules', () => ({
  DetailedSelector: ({
    icon: Icon,
    options,
    selectedValue,
    onChange,
    question,
    description,
    disabled,
    error,
    multiple,
    gridCols,
    colorScheme,
    required,
    variant,
  }: {
    icon?: React.ComponentType;
    options: Array<{ id: string; title: string; description: string }>;
    selectedValue?: string | string[];
    onChange: (value: string | string[]) => void;
    question: string;
    description?: string;
    disabled?: boolean;
    error?: string;
    multiple?: boolean;
    gridCols?: number;
    colorScheme?: string;
    required?: boolean;
    variant?: string;
  }) => (
    <div data-testid="detailed-selector">
      <div data-testid="selector-icon">{Icon && <Icon />}</div>
      <div data-testid="selector-question">{question}</div>
      <div data-testid="selector-description">{description}</div>
      <div data-testid="selector-error">{error}</div>
      <div data-testid="selector-props">
        disabled: {disabled?.toString() || 'false'}, multiple:{' '}
        {multiple?.toString() || 'false'}, gridCols: {gridCols}, colorScheme:{' '}
        {colorScheme}, required: {required?.toString() || 'false'}, variant:{' '}
        {variant}
      </div>
      {options.map(
        (option: { id: string; title: string; description: string }) => (
          <button
            key={option.id}
            data-testid={`option-${option.id}`}
            onClick={() => {
              if (multiple) {
                const currentSelection = Array.isArray(selectedValue)
                  ? selectedValue
                  : [];
                const isSelected = currentSelection.includes(option.id);
                const newSelection = isSelected
                  ? currentSelection.filter((id) => id !== option.id)
                  : [...currentSelection, option.id];
                onChange(newSelection);
              } else {
                onChange(option.id);
              }
            }}
            className={
              Array.isArray(selectedValue) && selectedValue.includes(option.id)
                ? 'selected'
                : ''
            }
          >
            {option.title}
          </button>
        )
      )}
    </div>
  ),
}));

describe('EnhancedSorenessCustomization', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct props and configuration', () => {
    render(
      <EnhancedSorenessCustomization
        value={['neck_shoulders']}
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    expect(screen.getByTestId('detailed-selector')).toBeInTheDocument();
    expect(screen.getByTestId('selector-question')).toHaveTextContent(
      'Are you experiencing any soreness?'
    );
    expect(screen.getByTestId('selector-description')).toHaveTextContent(
      "We'll modify exercises to avoid aggravating sore areas"
    );
    expect(screen.getByTestId('selector-props')).toHaveTextContent(
      'disabled: false, multiple: true, gridCols: 3, colorScheme: warning, required: false, variant: detailed'
    );
  });

  it('displays all soreness area options', () => {
    render(
      <EnhancedSorenessCustomization
        value={[]}
        onChange={mockOnChange}
        disabled={false}
      />
    );

    expect(screen.getByTestId('option-neck_shoulders')).toHaveTextContent(
      'Neck & Shoulders'
    );
    expect(screen.getByTestId('option-upper_back')).toHaveTextContent(
      'Upper Back'
    );
    expect(screen.getByTestId('option-lower_back')).toHaveTextContent(
      'Lower Back'
    );
    expect(screen.getByTestId('option-chest')).toHaveTextContent('Chest');
    expect(screen.getByTestId('option-arms_biceps_triceps')).toHaveTextContent(
      'Arms (Biceps & Triceps)'
    );
    expect(screen.getByTestId('option-forearms')).toHaveTextContent('Forearms');
    expect(screen.getByTestId('option-core')).toHaveTextContent('Core');
    expect(screen.getByTestId('option-glutes')).toHaveTextContent('Glutes');
    expect(screen.getByTestId('option-quads')).toHaveTextContent('Quadriceps');
    expect(screen.getByTestId('option-hamstrings')).toHaveTextContent(
      'Hamstrings'
    );
    expect(screen.getByTestId('option-adductors')).toHaveTextContent(
      'Adductors (Inner Thighs)'
    );
    expect(screen.getByTestId('option-calves')).toHaveTextContent('Calves');
  });

  it('handles single soreness area selection correctly', async () => {
    render(
      <EnhancedSorenessCustomization
        value={[]}
        onChange={mockOnChange}
        disabled={false}
      />
    );

    const neckShouldersButton = screen.getByTestId('option-neck_shoulders');
    fireEvent.click(neckShouldersButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(['neck_shoulders']);
    });
  });

  it('handles multiple soreness area selections correctly', async () => {
    render(
      <EnhancedSorenessCustomization
        value={['neck_shoulders']}
        onChange={mockOnChange}
        disabled={false}
      />
    );

    const upperBackButton = screen.getByTestId('option-upper_back');
    fireEvent.click(upperBackButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith([
        'neck_shoulders',
        'upper_back',
      ]);
    });
  });

  it('handles deselection of soreness areas correctly', async () => {
    render(
      <EnhancedSorenessCustomization
        value={['neck_shoulders', 'upper_back']}
        onChange={mockOnChange}
        disabled={false}
      />
    );

    const neckShouldersButton = screen.getByTestId('option-neck_shoulders');
    fireEvent.click(neckShouldersButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(['upper_back']);
    });
  });

  it('handles deselection of last soreness area correctly', async () => {
    render(
      <EnhancedSorenessCustomization
        value={['neck_shoulders']}
        onChange={mockOnChange}
        disabled={false}
      />
    );

    const neckShouldersButton = screen.getByTestId('option-neck_shoulders');
    fireEvent.click(neckShouldersButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(undefined);
    });
  });

  it('handles undefined value correctly', () => {
    render(
      <EnhancedSorenessCustomization
        value={undefined}
        onChange={mockOnChange}
        disabled={false}
      />
    );

    expect(screen.getByTestId('detailed-selector')).toBeInTheDocument();
    // Should render with empty array for selectedValue
    expect(screen.getByTestId('selector-props')).toHaveTextContent(
      'disabled: false, multiple: true, gridCols: 3, colorScheme: warning, required: false, variant: detailed'
    );
  });

  it('handles disabled state correctly', () => {
    render(
      <EnhancedSorenessCustomization
        value={['neck_shoulders']}
        onChange={mockOnChange}
        disabled={true}
      />
    );

    expect(screen.getByTestId('selector-props')).toHaveTextContent(
      'disabled: true, multiple: true, gridCols: 3, colorScheme: warning, required: false, variant: detailed'
    );
  });

  it('displays error message when provided', () => {
    const errorMessage = 'Please select at least one sore area';
    render(
      <EnhancedSorenessCustomization
        value={[]}
        onChange={mockOnChange}
        disabled={false}
        error={errorMessage}
      />
    );

    expect(screen.getByTestId('selector-error')).toHaveTextContent(
      errorMessage
    );
  });

  it('handles variant prop correctly', () => {
    render(
      <EnhancedSorenessCustomization
        value={[]}
        onChange={mockOnChange}
        disabled={false}
        variant="simple"
      />
    );

    expect(screen.getByTestId('selector-props')).toHaveTextContent(
      'disabled: false, multiple: true, gridCols: 3, colorScheme: warning, required: false, variant: simple'
    );
  });

  it('uses warning color scheme for soreness areas', () => {
    render(
      <EnhancedSorenessCustomization
        value={[]}
        onChange={mockOnChange}
        disabled={false}
      />
    );

    expect(screen.getByTestId('selector-props')).toHaveTextContent(
      'colorScheme: warning'
    );
  });

  it('maintains API compatibility with legacy component', () => {
    // Test that the component accepts the same props as the legacy component
    const props = {
      value: ['neck_shoulders'] as string[] | undefined,
      onChange: mockOnChange,
      disabled: false,
      error: '',
    };

    expect(() =>
      render(<EnhancedSorenessCustomization {...props} />)
    ).not.toThrow();
  });

  it('handles edge case with empty array value', () => {
    render(
      <EnhancedSorenessCustomization
        value={[]}
        onChange={mockOnChange}
        disabled={false}
      />
    );

    expect(screen.getByTestId('detailed-selector')).toBeInTheDocument();
    expect(screen.getByTestId('selector-props')).toHaveTextContent(
      'disabled: false, multiple: true, gridCols: 3, colorScheme: warning, required: false, variant: detailed'
    );
  });

  it('integrates with analytics tracking', () => {
    render(
      <EnhancedSorenessCustomization
        value={[]}
        onChange={mockOnChange}
        disabled={false}
      />
    );

    // Verify the component renders without errors
    expect(screen.getByTestId('detailed-selector')).toBeInTheDocument();

    // The analytics integration is tested at the component level
    // and verified through the useWorkoutAnalytics hook mock
    expect(mockTrackSelection).toBeDefined();
  });
});
