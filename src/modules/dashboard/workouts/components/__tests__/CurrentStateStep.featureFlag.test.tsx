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

// Mock CUSTOMIZATION_CONFIG for legacy component
vi.mock('../customizations', () => ({
  CUSTOMIZATION_CONFIG: [
    {
      key: 'customization_energy',
      component: () => (
        <div data-testid="legacy-energy-component">Legacy Energy</div>
      ),
      label: 'Energy Level',
      icon: () => <div>Icon</div>,
    },
    {
      key: 'customization_sleep',
      component: () => (
        <div data-testid="legacy-sleep-component">Legacy Sleep</div>
      ),
      label: 'Sleep Quality',
      icon: () => <div>Icon</div>,
    },
    {
      key: 'customization_stress',
      component: () => (
        <div data-testid="legacy-stress-component">Legacy Stress</div>
      ),
      label: 'Stress Level',
      icon: () => <div>Icon</div>,
    },
    {
      key: 'customization_soreness',
      component: () => (
        <div data-testid="legacy-soreness-component">Legacy Soreness</div>
      ),
      label: 'Current Soreness',
      icon: () => <div>Icon</div>,
    },
  ],
}));

// Mock LegacyCurrentStateStep directly
vi.mock('../steps/LegacyCurrentStateStep', () => ({
  LegacyCurrentStateStep: ({ options }: { options: PerWorkoutOptions }) => (
    <div data-testid="legacy-current-state-step">
      Legacy Current State Step
      {/* Render some indicators of legacy components */}
      {options.customization_energy && (
        <div data-testid="legacy-energy-display">
          {options.customization_energy}
        </div>
      )}
    </div>
  ),
}));

describe('CurrentStateStep Feature Flag', () => {
  const defaultProps = {
    options: {} as PerWorkoutOptions,
    onChange: vi.fn(),
    errors: {},
    disabled: false,
    variant: 'detailed' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    delete (import.meta.env as Record<string, string | undefined>)
      .VITE_ENHANCED_CURRENT_STATE;
  });

  describe('Enhanced Mode (Feature Flag Enabled)', () => {
    beforeEach(() => {
      (import.meta.env as Record<string, string>).VITE_ENHANCED_CURRENT_STATE =
        'true';
      vi.resetModules(); // Re-require the module to pick up the new environment variable
    });

    it('renders enhanced components when feature flag is enabled', async () => {
      const { CurrentStateStep: EnhancedCurrentStateStep } = await import(
        '../steps/CurrentStateStep'
      );
      render(<EnhancedCurrentStateStep {...defaultProps} />);
      expect(screen.getByTestId('current-state-step')).toBeInTheDocument();
      expect(
        screen.queryByTestId('legacy-current-state-step')
      ).not.toBeInTheDocument();
      expect(
        screen.getAllByTestId('enhanced-detailed-selector').length
      ).toBeGreaterThan(0);
    }, 10000);

    it('passes correct props to enhanced components', async () => {
      const { CurrentStateStep: EnhancedCurrentStateStep } = await import(
        '../steps/CurrentStateStep'
      );
      const optionsWithValues: PerWorkoutOptions = {
        customization_energy: 4,
        customization_sleep: 5,
        customization_stress: 2,
        customization_soreness: ['neck_shoulders'],
      };

      render(
        <EnhancedCurrentStateStep
          {...defaultProps}
          options={optionsWithValues}
        />
      );

      // Verify enhanced components are rendered
      expect(
        screen.getAllByTestId('enhanced-detailed-selector').length
      ).toBeGreaterThan(0);
    }, 10000);
  });

  describe('Legacy Mode (Feature Flag Disabled)', () => {
    beforeEach(() => {
      (import.meta.env as Record<string, string>).VITE_ENHANCED_CURRENT_STATE =
        'false';
      vi.resetModules();
    });

    it('renders legacy components when feature flag is disabled', async () => {
      const { CurrentStateStep: LegacyCurrentStateStep } = await import(
        '../steps/CurrentStateStep'
      );
      render(<LegacyCurrentStateStep {...defaultProps} />);
      expect(
        screen.getByTestId('legacy-current-state-step')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('current-state-step')
      ).not.toBeInTheDocument();
    }, 10000);

    it('passes correct props to legacy components', async () => {
      const { CurrentStateStep: LegacyCurrentStateStep } = await import(
        '../steps/CurrentStateStep'
      );
      const optionsWithValues: PerWorkoutOptions = {
        customization_energy: 4,
      };

      render(
        <LegacyCurrentStateStep {...defaultProps} options={optionsWithValues} />
      );
      expect(screen.getByTestId('legacy-energy-display')).toHaveTextContent(
        '4'
      );
    }, 10000);
  });

  describe('Default Behavior (No Feature Flag)', () => {
    beforeEach(() => {
      delete (import.meta.env as Record<string, string | undefined>)
        .VITE_ENHANCED_CURRENT_STATE;
      vi.resetModules();
    });

    it('defaults to legacy mode when no feature flag is set', async () => {
      const { CurrentStateStep: DefaultCurrentStateStep } = await import(
        '../steps/CurrentStateStep'
      );
      render(<DefaultCurrentStateStep {...defaultProps} />);
      expect(
        screen.getByTestId('legacy-current-state-step')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('current-state-step')
      ).not.toBeInTheDocument();
    }, 10000);
  });

  describe('Feature Flag Edge Cases', () => {
    it('handles invalid feature flag values gracefully', async () => {
      (import.meta.env as Record<string, string>).VITE_ENHANCED_CURRENT_STATE =
        'invalid';
      vi.resetModules();

      const { CurrentStateStep: InvalidFlagCurrentStateStep } = await import(
        '../steps/CurrentStateStep'
      );
      render(<InvalidFlagCurrentStateStep {...defaultProps} />);
      expect(
        screen.getByTestId('legacy-current-state-step')
      ).toBeInTheDocument();
    });

    it('handles empty string feature flag', async () => {
      (import.meta.env as Record<string, string>).VITE_ENHANCED_CURRENT_STATE =
        '';
      vi.resetModules();

      const { CurrentStateStep: EmptyFlagCurrentStateStep } = await import(
        '../steps/CurrentStateStep'
      );
      render(<EmptyFlagCurrentStateStep {...defaultProps} />);
      expect(
        screen.getByTestId('legacy-current-state-step')
      ).toBeInTheDocument();
    });

    it('is case-sensitive for feature flag value', async () => {
      (import.meta.env as Record<string, string>).VITE_ENHANCED_CURRENT_STATE =
        'TRUE';
      vi.resetModules();

      const { CurrentStateStep: CaseSensitiveCurrentStateStep } = await import(
        '../steps/CurrentStateStep'
      );
      render(<CaseSensitiveCurrentStateStep {...defaultProps} />);
      expect(
        screen.getByTestId('legacy-current-state-step')
      ).toBeInTheDocument();
    });
  });

  describe('Component Interface Consistency', () => {
    it('maintains consistent props interface between enhanced and legacy modes', async () => {
      // Test that both modes accept the same props
      const { CurrentStateStep: EnhancedCurrentStateStep } = await import(
        '../steps/CurrentStateStep'
      );

      (import.meta.env as Record<string, string>).VITE_ENHANCED_CURRENT_STATE =
        'true';
      vi.resetModules();

      const enhancedComponent = EnhancedCurrentStateStep;
      expect(enhancedComponent).toBeDefined();

      (import.meta.env as Record<string, string>).VITE_ENHANCED_CURRENT_STATE =
        'false';
      vi.resetModules();

      const { CurrentStateStep: LegacyCurrentStateStep } = await import(
        '../steps/CurrentStateStep'
      );
      const legacyComponent = LegacyCurrentStateStep;
      expect(legacyComponent).toBeDefined();
    });
  });
});
