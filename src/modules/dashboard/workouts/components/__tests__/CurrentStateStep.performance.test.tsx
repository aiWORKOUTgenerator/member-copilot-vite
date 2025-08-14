import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { CurrentStateStep } from '../steps/CurrentStateStep';
import { PerWorkoutOptions } from '../types';

// Mock all dependencies to focus on performance
vi.mock('../../../hooks/useWorkoutAnalytics', () => ({
  useWorkoutAnalytics: () => ({
    trackStepCompletion: vi.fn(),
    trackSelection: vi.fn(),
  }),
}));

vi.mock('../../utils/optionEnhancers', () => ({
  useEnhancedOptions: () => ({
    energyOptions: Array.from({ length: 6 }, (_, i) => ({
      id: (i + 1).toString(),
      title: `Energy ${i + 1}`,
      description: `Energy level ${i + 1}`,
    })),
    sleepQualityOptions: Array.from({ length: 6 }, (_, i) => ({
      id: (i + 1).toString(),
      title: `Sleep ${i + 1}`,
      description: `Sleep quality ${i + 1}`,
    })),
    stressLevelOptions: Array.from({ length: 6 }, (_, i) => ({
      id: (i + 1).toString(),
      title: `Stress ${i + 1}`,
      description: `Stress level ${i + 1}`,
    })),
    sorenessAreaOptions: Array.from({ length: 10 }, (_, i) => ({
      id: `area_${i}`,
      title: `Area ${i}`,
      description: `Body area ${i}`,
    })),
  }),
}));

vi.mock('../../validation/detailedValidation', () => ({
  validateDetailedStep: vi.fn(() => ({
    isValid: true,
    errors: {},
    warnings: {},
    suggestions: [],
  })),
}));

vi.mock('../../utils/selectionFormatters', () => ({
  formatSelectionValue: vi.fn(() => 'Formatted Value'),
}));

interface MockPerformanceDetailedSelectorProps {
  options: Array<{ id: string; title: string }>;
}

interface MockSelectionBadgeProps {
  value?: string | null;
}

vi.mock('@/ui/shared/molecules', () => ({
  DetailedSelector: ({ options }: MockPerformanceDetailedSelectorProps) => (
    <div>
      {options.map((option) => (
        <button key={option.id}>{option.title}</button>
      ))}
    </div>
  ),
}));

vi.mock('@/ui/shared/atoms', () => ({
  SelectionBadge: ({ value }: MockSelectionBadgeProps) => (
    <span>{value || 'No selection'}</span>
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

  it('renders within performance budget', () => {
    const startTime = performance.now();

    render(<CurrentStateStep {...defaultProps} />);

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Should render in under 100ms
    expect(renderTime).toBeLessThan(100);
  });

  it('handles rapid state changes efficiently', () => {
    const { rerender } = render(<CurrentStateStep {...defaultProps} />);

    const startTime = performance.now();

    // Simulate rapid state changes
    for (let i = 1; i <= 6; i++) {
      rerender(
        <CurrentStateStep
          {...defaultProps}
          options={{
            customization_energy: i,
            customization_sleep: i,
            customization_stress: i,
            customization_soreness: [`area_${i}`],
          }}
        />
      );
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Should handle 6 rapid changes in under 50ms
    expect(totalTime).toBeLessThan(50);
  });

  it('maintains stable memory usage during multiple renders', () => {
    const performanceWithMemory = performance as typeof performance & {
      memory?: { usedJSHeapSize: number };
    };
    const initialMemory = performanceWithMemory.memory?.usedJSHeapSize || 0;

    // Render multiple times to test for memory leaks
    for (let i = 0; i < 10; i++) {
      const { unmount } = render(
        <CurrentStateStep
          {...defaultProps}
          options={{
            customization_energy: (i % 6) + 1,
            customization_sleep: (i % 6) + 1,
            customization_stress: (i % 6) + 1,
            customization_soreness: [`area_${i % 10}`],
          }}
        />
      );
      unmount();
    }

    // Force garbage collection if available
    if (
      'gc' in global &&
      typeof (global as { gc?: () => void }).gc === 'function'
    ) {
      (global as { gc: () => void }).gc();
    }

    const finalMemory = performanceWithMemory.memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;

    // Memory increase should be minimal (less than 5MB)
    // Note: This test may be flaky in different environments
    if (initialMemory > 0) {
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024); // 5MB
    }
  });

  it('renders efficiently with large datasets', () => {
    const largeOptions: PerWorkoutOptions = {
      customization_energy: 6,
      customization_sleep: 6,
      customization_stress: 6,
      customization_soreness: Array.from({ length: 5 }, (_, i) => `area_${i}`),
    };

    const startTime = performance.now();

    render(<CurrentStateStep {...defaultProps} options={largeOptions} />);

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Should still render quickly even with complex data
    expect(renderTime).toBeLessThan(150);
  });

  it('handles disabled state efficiently', () => {
    const startTime = performance.now();

    render(<CurrentStateStep {...defaultProps} disabled={true} />);

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Disabled rendering should be just as fast
    expect(renderTime).toBeLessThan(100);
  });

  it('efficiently handles error states', () => {
    const errors = {
      customization_energy: 'Energy error',
      customization_sleep: 'Sleep error',
      customization_stress: 'Stress error',
      customization_soreness: 'Soreness error',
    };

    const startTime = performance.now();

    render(<CurrentStateStep {...defaultProps} errors={errors} />);

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Error rendering should not significantly impact performance
    expect(renderTime).toBeLessThan(120);
  });

  it('maintains consistent performance across variants', () => {
    const simpleStartTime = performance.now();
    const { unmount: unmountSimple } = render(
      <CurrentStateStep {...defaultProps} variant="simple" />
    );
    const simpleEndTime = performance.now();
    unmountSimple();

    const detailedStartTime = performance.now();
    const { unmount: unmountDetailed } = render(
      <CurrentStateStep {...defaultProps} variant="detailed" />
    );
    const detailedEndTime = performance.now();
    unmountDetailed();

    const simpleTime = simpleEndTime - simpleStartTime;
    const detailedTime = detailedEndTime - detailedStartTime;

    // Both variants should render efficiently
    expect(simpleTime).toBeLessThan(100);
    expect(detailedTime).toBeLessThan(100);

    // Performance difference should be minimal
    expect(Math.abs(detailedTime - simpleTime)).toBeLessThan(50);
  });

  describe('Component Lifecycle Performance', () => {
    it('mounts efficiently', () => {
      const startTime = performance.now();

      const { unmount } = render(<CurrentStateStep {...defaultProps} />);

      const endTime = performance.now();
      const mountTime = endTime - startTime;

      expect(mountTime).toBeLessThan(100);

      unmount();
    });

    it('unmounts cleanly', () => {
      const { unmount } = render(<CurrentStateStep {...defaultProps} />);

      const startTime = performance.now();
      unmount();
      const endTime = performance.now();

      const unmountTime = endTime - startTime;
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

      const endTime = performance.now();
      const updateTime = endTime - startTime;

      expect(updateTime).toBeLessThan(50);
    });
  });
});
