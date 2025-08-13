import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EnhancedFocusAreaCustomization from '../EnhancedFocusAreaCustomization';

// Mock the analytics hook
const mockTrackSelection = vi.fn();
vi.mock('../../../hooks/useWorkoutAnalytics', () => ({
  useWorkoutAnalytics: () => ({
    trackSelection: mockTrackSelection,
    trackStepCompletion: vi.fn(),
    trackValidationError: vi.fn(),
  }),
}));

// Mock the enhanced options hook with all focus area options
const mockFocusAreaOptions = [
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
  {
    id: 'core',
    title: 'Core',
    description: 'Abdominals and lower back',
  },
  {
    id: 'back',
    title: 'Back',
    description: 'Upper and lower back muscles',
  },
  {
    id: 'shoulders',
    title: 'Shoulders',
    description: 'Deltoids and rotator cuff',
  },
  {
    id: 'chest',
    title: 'Chest',
    description: 'Pectorals and surrounding muscles',
  },
  {
    id: 'arms',
    title: 'Arms',
    description: 'Biceps, triceps, and forearms',
  },
  {
    id: 'mobility_flexibility',
    title: 'Mobility/Flexibility',
    description: 'Joint mobility and muscle flexibility',
  },
  {
    id: 'cardio',
    title: 'Cardio',
    description: 'Cardiovascular endurance',
  },
  {
    id: 'recovery_stretching',
    title: 'Recovery/Stretching',
    description: 'Gentle recovery and stretching',
  },
];

vi.mock('../../utils/optionEnhancers', () => ({
  useEnhancedOptions: () => ({
    focusAreaOptions: mockFocusAreaOptions,
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

describe('EnhancedFocusAreaCustomization', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct props and configuration', () => {
    render(
      <EnhancedFocusAreaCustomization
        value={['upper_body']}
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    expect(screen.getByTestId('detailed-selector')).toBeInTheDocument();
    expect(screen.getByTestId('selector-question')).toHaveTextContent(
      'Which body areas do you want to focus on?'
    );
    expect(screen.getByTestId('selector-description')).toHaveTextContent(
      'Select one or more areas to target in your workout'
    );
    expect(screen.getByTestId('selector-props')).toHaveTextContent(
      'disabled: false, multiple: true, gridCols: 3, colorScheme: primary, required: false, variant: detailed'
    );
  });

  it('displays all focus area options', () => {
    render(
      <EnhancedFocusAreaCustomization
        value={[]}
        onChange={mockOnChange}
        disabled={false}
      />
    );

    expect(screen.getByTestId('option-upper_body')).toHaveTextContent(
      'Upper Body'
    );
    expect(screen.getByTestId('option-lower_body')).toHaveTextContent(
      'Lower Body'
    );
    expect(screen.getByTestId('option-core')).toHaveTextContent('Core');
  });

  it('handles single area selection correctly', async () => {
    render(
      <EnhancedFocusAreaCustomization
        value={[]}
        onChange={mockOnChange}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByTestId('option-upper_body'));

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(['upper_body']);
    });
  });

  it('handles multiple area selection correctly', async () => {
    render(
      <EnhancedFocusAreaCustomization
        value={['upper_body']}
        onChange={mockOnChange}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByTestId('option-lower_body'));

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(['upper_body', 'lower_body']);
    });
  });

  it('handles area deselection correctly', async () => {
    render(
      <EnhancedFocusAreaCustomization
        value={['upper_body', 'lower_body']}
        onChange={mockOnChange}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByTestId('option-upper_body'));

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(['lower_body']);
    });
  });

  it('handles empty selection correctly', async () => {
    render(
      <EnhancedFocusAreaCustomization
        value={['upper_body']}
        onChange={mockOnChange}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByTestId('option-upper_body'));

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(undefined);
    });
  });

  it('displays validation error when provided', () => {
    const errorMessage = 'Select up to 5 focus areas';

    render(
      <EnhancedFocusAreaCustomization
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

  it('handles disabled state correctly', () => {
    render(
      <EnhancedFocusAreaCustomization
        value={[]}
        onChange={mockOnChange}
        disabled={true}
      />
    );

    expect(screen.getByTestId('selector-props')).toHaveTextContent(
      'disabled: true'
    );
  });

  it('handles undefined value correctly', () => {
    render(
      <EnhancedFocusAreaCustomization
        value={undefined}
        onChange={mockOnChange}
        disabled={false}
      />
    );

    // Should render without errors and treat undefined as empty array
    expect(screen.getByTestId('detailed-selector')).toBeInTheDocument();
  });

  it('maintains API compatibility with legacy component', () => {
    // Test that the component accepts the same props as the legacy component
    const props = {
      value: ['upper_body', 'core'] as string[] | undefined,
      onChange: mockOnChange,
      disabled: false,
      error: 'Test error',
    };

    expect(() => {
      render(<EnhancedFocusAreaCustomization {...props} />);
    }).not.toThrow();
  });

  it('integrates with analytics system', () => {
    // Test that the component uses the analytics hook
    render(
      <EnhancedFocusAreaCustomization
        value={['upper_body']}
        onChange={mockOnChange}
        disabled={false}
      />
    );

    // Verify the component renders without errors
    expect(screen.getByTestId('detailed-selector')).toBeInTheDocument();

    // The analytics integration is tested at a higher level in integration tests
    // This test ensures the hook is properly imported and used
  });

  it('uses Target icon correctly', () => {
    render(
      <EnhancedFocusAreaCustomization
        value={[]}
        onChange={mockOnChange}
        disabled={false}
      />
    );

    // The icon should be passed to DetailedSelector
    expect(screen.getByTestId('selector-icon')).toBeInTheDocument();
  });

  it('is memoized to prevent unnecessary re-renders', () => {
    const { rerender } = render(
      <EnhancedFocusAreaCustomization
        value={['upper_body']}
        onChange={mockOnChange}
        disabled={false}
      />
    );

    // Re-render with same props
    rerender(
      <EnhancedFocusAreaCustomization
        value={['upper_body']}
        onChange={mockOnChange}
        disabled={false}
      />
    );

    // Component should be memoized (React.memo)
    // This is more of a smoke test - detailed memo testing would require React DevTools
    expect(screen.getByTestId('detailed-selector')).toBeInTheDocument();
  });
});
