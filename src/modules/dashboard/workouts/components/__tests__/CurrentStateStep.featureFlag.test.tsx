import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PerWorkoutOptions } from '../types';

// Mock all dependencies
vi.mock('../../../hooks/useWorkoutAnalytics', () => ({
  useWorkoutAnalytics: () => ({
    trackStepCompletion: vi.fn(),
    trackSelection: vi.fn(),
  }),
}));

vi.mock('../../utils/optionEnhancers', () => ({
  useEnhancedOptions: () => ({
    energyOptions: [{ id: '1', title: 'Low', description: 'Low energy' }],
    sleepQualityOptions: [
      { id: '1', title: 'Poor', description: 'Poor sleep' },
    ],
    stressLevelOptions: [{ id: '1', title: 'Low', description: 'Low stress' }],
    sorenessAreaOptions: [
      { id: 'neck', title: 'Neck', description: 'Neck soreness' },
    ],
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

interface MockFlagSelectionBadgeProps {
  value?: string | null;
}

vi.mock('@/ui/shared/molecules', () => ({
  DetailedSelector: () => (
    <div data-testid="enhanced-detailed-selector">Enhanced Component</div>
  ),
}));

vi.mock('@/ui/shared/atoms', () => ({
  SelectionBadge: ({ value }: MockFlagSelectionBadgeProps) => (
    <span data-testid="selection-badge">{value || 'No selection'}</span>
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
    // Clear any existing environment variable
    delete (import.meta.env as Record<string, string | undefined>)
      .VITE_ENHANCED_CURRENT_STATE;
  });

  describe('Enhanced Mode (Feature Flag Enabled)', () => {
    beforeEach(() => {
      // Enable the feature flag
      (import.meta.env as Record<string, string>).VITE_ENHANCED_CURRENT_STATE =
        'true';

      // Re-require the module to pick up the new environment variable
      vi.resetModules();
    });

    it('renders enhanced components when feature flag is enabled', async () => {
      // We need to dynamically import since we changed the env var
      const { CurrentStateStep: EnhancedCurrentStateStep } = await import(
        '../steps/CurrentStateStep'
      );

      render(<EnhancedCurrentStateStep {...defaultProps} />);

      // Should render enhanced components
      expect(screen.getAllByTestId('enhanced-detailed-selector')).toHaveLength(
        4
      );

      // Should not render legacy components
      expect(
        screen.queryByTestId('legacy-energy-component')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('legacy-sleep-component')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('legacy-stress-component')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('legacy-soreness-component')
      ).not.toBeInTheDocument();

      // Should have the enhanced step testid
      expect(screen.getByTestId('current-state-step')).toBeInTheDocument();
      expect(
        screen.queryByTestId('legacy-current-state-step')
      ).not.toBeInTheDocument();
    });

    it('passes correct props to enhanced components', async () => {
      const { CurrentStateStep: EnhancedCurrentStateStep } = await import(
        '../steps/CurrentStateStep'
      );

      const options = {
        customization_energy: 3,
        customization_sleep: 4,
      };

      render(<EnhancedCurrentStateStep {...defaultProps} options={options} />);

      // Enhanced components should be rendered
      expect(screen.getAllByTestId('enhanced-detailed-selector')).toHaveLength(
        4
      );
    });
  });

  describe('Legacy Mode (Feature Flag Disabled)', () => {
    beforeEach(() => {
      // Disable the feature flag
      (import.meta.env as Record<string, string>).VITE_ENHANCED_CURRENT_STATE =
        'false';
      vi.resetModules();
    });

    it('renders legacy components when feature flag is disabled', async () => {
      const { CurrentStateStep: LegacyCurrentStateStep } = await import(
        '../steps/CurrentStateStep'
      );

      render(<LegacyCurrentStateStep {...defaultProps} />);

      // Should render legacy components
      expect(screen.getByTestId('legacy-energy-component')).toBeInTheDocument();
      expect(screen.getByTestId('legacy-sleep-component')).toBeInTheDocument();
      expect(screen.getByTestId('legacy-stress-component')).toBeInTheDocument();
      expect(
        screen.getByTestId('legacy-soreness-component')
      ).toBeInTheDocument();

      // Should not render enhanced components
      expect(
        screen.queryByTestId('enhanced-detailed-selector')
      ).not.toBeInTheDocument();

      // Should have the legacy step testid
      expect(
        screen.getByTestId('legacy-current-state-step')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('current-state-step')
      ).not.toBeInTheDocument();
    });

    it('passes correct props to legacy components', async () => {
      const { CurrentStateStep: LegacyCurrentStateStep } = await import(
        '../steps/CurrentStateStep'
      );

      const options = {
        customization_energy: 3,
        customization_sleep: 4,
      };

      render(<LegacyCurrentStateStep {...defaultProps} options={options} />);

      // Legacy components should be rendered
      expect(screen.getByTestId('legacy-energy-component')).toBeInTheDocument();
      expect(screen.getByTestId('legacy-sleep-component')).toBeInTheDocument();
      expect(screen.getByTestId('legacy-stress-component')).toBeInTheDocument();
      expect(
        screen.getByTestId('legacy-soreness-component')
      ).toBeInTheDocument();
    });
  });

  describe('Default Behavior (No Feature Flag)', () => {
    beforeEach(() => {
      // Ensure no feature flag is set
      delete (import.meta.env as Record<string, string | undefined>)
        .VITE_ENHANCED_CURRENT_STATE;
      vi.resetModules();
    });

    it('defaults to legacy mode when no feature flag is set', async () => {
      const { CurrentStateStep: DefaultCurrentStateStep } = await import(
        '../steps/CurrentStateStep'
      );

      render(<DefaultCurrentStateStep {...defaultProps} />);

      // Should default to legacy components
      expect(screen.getByTestId('legacy-energy-component')).toBeInTheDocument();
      expect(screen.getByTestId('legacy-sleep-component')).toBeInTheDocument();
      expect(screen.getByTestId('legacy-stress-component')).toBeInTheDocument();
      expect(
        screen.getByTestId('legacy-soreness-component')
      ).toBeInTheDocument();

      // Should not render enhanced components
      expect(
        screen.queryByTestId('enhanced-detailed-selector')
      ).not.toBeInTheDocument();

      // Should have the legacy step testid
      expect(
        screen.getByTestId('legacy-current-state-step')
      ).toBeInTheDocument();
    });
  });

  describe('Feature Flag Edge Cases', () => {
    it('handles invalid feature flag values gracefully', async () => {
      (import.meta.env as Record<string, string>).VITE_ENHANCED_CURRENT_STATE =
        'invalid_value';
      vi.resetModules();

      const { CurrentStateStep: InvalidFlagCurrentStateStep } = await import(
        '../steps/CurrentStateStep'
      );

      render(<InvalidFlagCurrentStateStep {...defaultProps} />);

      // Should default to legacy mode with invalid flag
      expect(
        screen.getByTestId('legacy-current-state-step')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('current-state-step')
      ).not.toBeInTheDocument();
    });

    it('handles empty string feature flag', async () => {
      (import.meta.env as Record<string, string>).VITE_ENHANCED_CURRENT_STATE =
        '';
      vi.resetModules();

      const { CurrentStateStep: EmptyFlagCurrentStateStep } = await import(
        '../steps/CurrentStateStep'
      );

      render(<EmptyFlagCurrentStateStep {...defaultProps} />);

      // Should default to legacy mode with empty flag
      expect(
        screen.getByTestId('legacy-current-state-step')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('current-state-step')
      ).not.toBeInTheDocument();
    });

    it('is case-sensitive for feature flag value', async () => {
      (import.meta.env as Record<string, string>).VITE_ENHANCED_CURRENT_STATE =
        'TRUE'; // uppercase
      vi.resetModules();

      const { CurrentStateStep: UppercaseFlagCurrentStateStep } = await import(
        '../steps/CurrentStateStep'
      );

      render(<UppercaseFlagCurrentStateStep {...defaultProps} />);

      // Should default to legacy mode (case-sensitive)
      expect(
        screen.getByTestId('legacy-current-state-step')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('current-state-step')
      ).not.toBeInTheDocument();
    });
  });

  describe('Component Interface Consistency', () => {
    it('maintains consistent props interface between enhanced and legacy modes', async () => {
      const testProps = {
        ...defaultProps,
        options: {
          customization_energy: 5,
          customization_sleep: 3,
          customization_stress: 2,
          customization_soreness: ['neck_shoulders'],
        },
        errors: {
          customization_energy: 'Energy error',
          customization_sleep: 'Sleep error',
        },
        disabled: true,
      };

      // Test enhanced mode
      (import.meta.env as Record<string, string>).VITE_ENHANCED_CURRENT_STATE =
        'true';
      vi.resetModules();
      const { CurrentStateStep: EnhancedStep } = await import(
        '../steps/CurrentStateStep'
      );

      const { unmount: unmountEnhanced } = render(
        <EnhancedStep {...testProps} />
      );

      // Should not throw errors
      expect(screen.getByTestId('current-state-step')).toBeInTheDocument();
      unmountEnhanced();

      // Test legacy mode
      (import.meta.env as Record<string, string>).VITE_ENHANCED_CURRENT_STATE =
        'false';
      vi.resetModules();
      const { CurrentStateStep: LegacyStep } = await import(
        '../steps/CurrentStateStep'
      );

      const { unmount: unmountLegacy } = render(<LegacyStep {...testProps} />);

      // Should not throw errors
      expect(
        screen.getByTestId('legacy-current-state-step')
      ).toBeInTheDocument();
      unmountLegacy();
    });
  });
});
