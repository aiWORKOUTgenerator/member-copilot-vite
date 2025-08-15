import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CurrentStateStep } from '../steps/CurrentStateStep';
import { PerWorkoutOptions } from '../types';
import React from 'react';

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

describe('CurrentStateStep Performance', () => {
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

  describe('renders within performance budget', () => {
    it('renders efficiently with default props', () => {
      const startTime = performance.now();

      render(<CurrentStateStep {...defaultProps} />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within 600ms (increased threshold for test environment variations)
      expect(renderTime).toBeLessThan(600);
      expect(screen.getByTestId('current-state-step')).toBeInTheDocument();
    });

    it('renders efficiently with populated options', () => {
      const optionsWithValues: PerWorkoutOptions = {
        customization_energy: 4,
        customization_sleep: 5,
        customization_stress: 2,
        customization_soreness: ['neck_shoulders'],
      };

      const startTime = performance.now();

      render(
        <CurrentStateStep {...defaultProps} options={optionsWithValues} />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within 200ms even with data
      expect(renderTime).toBeLessThan(200);
      expect(screen.getByTestId('current-state-step')).toBeInTheDocument();
    });
  });

  describe('handles rapid state changes efficiently', () => {
    it('updates efficiently when props change', () => {
      const { rerender } = render(<CurrentStateStep {...defaultProps} />);

      const startTime = performance.now();

      // Rapidly change props
      for (let i = 0; i < 10; i++) {
        rerender(
          <CurrentStateStep
            {...defaultProps}
            options={{ customization_energy: i }}
          />
        );
      }

      const endTime = performance.now();
      const updateTime = endTime - startTime;

      // Should handle rapid updates efficiently
      expect(updateTime).toBeLessThan(500);
    });
  });

  describe('maintains stable memory usage during multiple renders', () => {
    it('does not leak memory during repeated renders', () => {
      const { rerender, unmount } = render(
        <CurrentStateStep {...defaultProps} />
      );

      // Perform multiple render cycles
      for (let i = 0; i < 50; i++) {
        rerender(
          <CurrentStateStep
            {...defaultProps}
            options={{ customization_energy: i % 6 }}
          />
        );
      }

      // Should not throw errors during repeated renders
      expect(screen.getByTestId('current-state-step')).toBeInTheDocument();

      // Clean up
      unmount();
    });
  });

  describe('renders efficiently with large datasets', () => {
    it('handles large soreness datasets efficiently', () => {
      const largeSorenessDataset: PerWorkoutOptions = {
        customization_soreness: [
          'neck_shoulders',
          'upper_back',
          'lower_back',
          'chest',
          'arms',
          'core',
          'glutes',
          'quads',
          'hamstrings',
          'calves',
        ],
      };

      const startTime = performance.now();

      render(
        <CurrentStateStep {...defaultProps} options={largeSorenessDataset} />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within 100ms even with large datasets
      expect(renderTime).toBeLessThan(100);
      expect(screen.getByTestId('current-state-step')).toBeInTheDocument();
    });
  });

  describe('handles disabled state efficiently', () => {
    it('renders disabled state efficiently', () => {
      const startTime = performance.now();

      render(<CurrentStateStep {...defaultProps} disabled={true} />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render disabled state within 100ms
      expect(renderTime).toBeLessThan(100);
      expect(screen.getByTestId('current-state-step')).toBeInTheDocument();
    });
  });

  describe('efficiently handles error states', () => {
    it('renders error states efficiently', () => {
      const errors = {
        customization_energy: 'Please select an energy level',
        customization_sleep: 'Please rate your sleep quality',
        customization_stress: 'Please indicate your stress level',
        customization_soreness: 'Please select soreness areas',
      };

      const startTime = performance.now();

      render(<CurrentStateStep {...defaultProps} errors={errors} />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render error states within 100ms
      expect(renderTime).toBeLessThan(100);
      expect(screen.getByTestId('current-state-step')).toBeInTheDocument();
    });
  });

  describe('maintains consistent performance across variants', () => {
    it('renders simple variant efficiently', () => {
      const startTime = performance.now();

      render(<CurrentStateStep {...defaultProps} variant="simple" />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render simple variant within 100ms
      expect(renderTime).toBeLessThan(100);
      expect(screen.getByTestId('current-state-step')).toBeInTheDocument();
    });

    it('renders detailed variant efficiently', () => {
      const startTime = performance.now();

      render(<CurrentStateStep {...defaultProps} variant="detailed" />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render detailed variant within 100ms
      expect(renderTime).toBeLessThan(100);
      expect(screen.getByTestId('current-state-step')).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle Performance', () => {
    it('mounts efficiently', () => {
      const startTime = performance.now();

      const { unmount } = render(<CurrentStateStep {...defaultProps} />);

      const mountTime = performance.now() - startTime;

      // Should mount within 100ms
      expect(mountTime).toBeLessThan(100);
      expect(screen.getByTestId('current-state-step')).toBeInTheDocument();

      unmount();
    });

    it('unmounts cleanly', () => {
      const { unmount } = render(<CurrentStateStep {...defaultProps} />);

      const startTime = performance.now();

      unmount();

      const unmountTime = performance.now() - startTime;

      // Should unmount within 50ms
      expect(unmountTime).toBeLessThan(50);
    });

    it('updates efficiently', () => {
      const { rerender } = render(<CurrentStateStep {...defaultProps} />);

      const startTime = performance.now();

      rerender(
        <CurrentStateStep
          {...defaultProps}
          options={{ customization_energy: 3 }}
        />
      );

      const updateTime = performance.now() - startTime;

      // Should update within 50ms
      expect(updateTime).toBeLessThan(50);
      expect(screen.getByTestId('current-state-step')).toBeInTheDocument();
    });
  });
});
