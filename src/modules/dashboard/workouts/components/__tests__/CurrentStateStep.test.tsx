import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
    return String(value);
  }),
}));

// Mock LevelDots component
vi.mock('@/ui/shared/atoms', () => ({
  LevelDots: ({
    count,
    activeIndex,
    size,
  }: {
    count: number;
    activeIndex: number;
    size: string;
  }) => (
    <div
      data-testid="level-dots"
      data-count={count}
      data-active={activeIndex}
      data-size={size}
    >
      LevelDots Mock
    </div>
  ),
  SelectionBadge: ({
    value,
    size,
  }: {
    value?: string | null;
    size?: string;
  }) => (
    <span data-testid="selection-badge" data-value={value} data-size={size}>
      {value || 'No Selection'}
    </span>
  ),
}));

// Mock DetailedSelector components
vi.mock('@/ui/shared/molecules', () => ({
  DetailedSelector: ({
    question,
    options,
    onChange,
    disabled,
    error,
  }: {
    question: string;
    options: Array<{ id: string; title: string }>;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: string;
  }) => (
    <div data-testid="enhanced-detailed-selector">
      <div>{question}</div>
      {error && <div data-testid="error">{error}</div>}
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          disabled={disabled}
          data-testid={`enhanced-option-${option.id}`}
        >
          {option.title}
        </button>
      ))}
    </div>
  ),
}));

describe('CurrentStateStep Enhanced Components', () => {
  const defaultProps = {
    options: {} as PerWorkoutOptions,
    onChange: vi.fn(),
    errors: {},
    disabled: false,
    variant: 'detailed' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders enhanced components', async () => {
    const { CurrentStateStep } = await import('../steps/CurrentStateStep');
    render(<CurrentStateStep {...defaultProps} />);
    expect(screen.getByTestId('current-state-step')).toBeInTheDocument();
    expect(
      screen.getAllByTestId('enhanced-detailed-selector').length
    ).toBeGreaterThan(0);
  }, 10000);

  it('passes correct props to enhanced components', async () => {
    const { CurrentStateStep } = await import('../steps/CurrentStateStep');
    const optionsWithValues: PerWorkoutOptions = {
      customization_energy: 4,
      customization_sleep: 5,
      customization_stress: 2,
      customization_soreness: ['neck_shoulders'],
    };

    render(<CurrentStateStep {...defaultProps} options={optionsWithValues} />);

    // Verify enhanced components are rendered
    expect(
      screen.getAllByTestId('enhanced-detailed-selector').length
    ).toBeGreaterThan(0);
  }, 10000);

  it('handles disabled state correctly', async () => {
    const { CurrentStateStep } = await import('../steps/CurrentStateStep');
    render(<CurrentStateStep {...defaultProps} disabled={true} />);

    // Verify the component renders in disabled state
    expect(screen.getByTestId('current-state-step')).toBeInTheDocument();
  });

  it('displays selection badges for selected values', async () => {
    const { CurrentStateStep } = await import('../steps/CurrentStateStep');
    const optionsWithValues: PerWorkoutOptions = {
      customization_energy: 4,
      customization_sleep: 5,
      customization_stress: 2,
      customization_soreness: ['neck_shoulders'],
    };

    render(<CurrentStateStep {...defaultProps} options={optionsWithValues} />);

    // Verify selection badges are rendered
    expect(screen.getAllByTestId('selection-badge').length).toBeGreaterThan(0);
  });
});
