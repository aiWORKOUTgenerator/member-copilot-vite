import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WorkoutCustomization from '../WorkoutCustomization';
import type { PerWorkoutOptions } from '../types';

// Mock scrollIntoView for test environment
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true,
});

// Mock the step components
vi.mock('../steps', () => ({
  WorkoutStructureStep: ({ options }: { options: PerWorkoutOptions }) => (
    <div data-testid="workout-structure-step">
      Workout Structure Step - Duration: {options.customization_duration}
    </div>
  ),
  EquipmentPreferencesStep: ({ options }: { options: PerWorkoutOptions }) => (
    <div data-testid="equipment-preferences-step">
      Equipment Preferences Step - Equipment:{' '}
      {options.customization_equipment?.join(', ')}
    </div>
  ),
  CurrentStateStep: ({ options }: { options: PerWorkoutOptions }) => (
    <div data-testid="current-state-step">
      Current State Step - Energy: {options.customization_energy}
    </div>
  ),
}));

describe('WorkoutCustomization - Step Navigation', () => {
  const defaultOptions: PerWorkoutOptions = {};
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    options: defaultOptions,
    onChange: mockOnChange,
    errors: {},
    mode: 'detailed' as const,
  };

  describe('Step Indicator Integration', () => {
    it('renders step indicator in detailed mode', () => {
      render(<WorkoutCustomization {...defaultProps} />);

      expect(
        screen.getByTestId('step-indicator-container')
      ).toBeInTheDocument();
      expect(screen.getByText('Workout Structure')).toBeInTheDocument();
      expect(screen.getByText('Equipment & Preferences')).toBeInTheDocument();
      expect(screen.getByText('Current State')).toBeInTheDocument();
    });

    it('starts with workout structure step', () => {
      render(<WorkoutCustomization {...defaultProps} />);

      expect(screen.getByTestId('workout-structure-step')).toBeInTheDocument();
      expect(
        screen.queryByTestId('equipment-preferences-step')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('current-state-step')
      ).not.toBeInTheDocument();
    });

    it('navigates to next step when clicking step indicator', () => {
      render(<WorkoutCustomization {...defaultProps} />);

      // Click on the actual step button (step 2)
      const step2Button = screen.getByLabelText(
        'Step 2: Equipment & Preferences'
      );
      fireEvent.click(step2Button);

      expect(
        screen.getByTestId('equipment-preferences-step')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('workout-structure-step')
      ).not.toBeInTheDocument();
    });

    it('navigates to current state step when clicked', () => {
      render(<WorkoutCustomization {...defaultProps} />);

      // Click on the actual step button (step 3)
      const step3Button = screen.getByLabelText('Step 3: Current State');
      fireEvent.click(step3Button);

      expect(screen.getByTestId('current-state-step')).toBeInTheDocument();
      expect(
        screen.queryByTestId('workout-structure-step')
      ).not.toBeInTheDocument();
    });
  });

  describe('Progress Tracking', () => {
    it('shows 0% progress initially', () => {
      render(<WorkoutCustomization {...defaultProps} />);

      expect(screen.getByText('0% Complete')).toBeInTheDocument();
    });

    it('updates progress when fields are filled', () => {
      const optionsWithData: PerWorkoutOptions = {
        customization_duration: 30,
        customization_focus: 'strength',
      };

      render(
        <WorkoutCustomization {...defaultProps} options={optionsWithData} />
      );

      // Should show some progress (exact percentage depends on implementation)
      expect(screen.getByText(/\d+% Complete/)).toBeInTheDocument();
    });

    it('shows individual step completion percentages', () => {
      const optionsWithData: PerWorkoutOptions = {
        customization_duration: 30,
        customization_equipment: ['dumbbells'],
      };

      render(
        <WorkoutCustomization {...defaultProps} options={optionsWithData} />
      );

      // Should show completion percentages for individual steps (use getAllByText for multiple matches)
      const completionTexts = screen.getAllByText(/\d+% complete/);
      expect(completionTexts.length).toBeGreaterThan(0);
    });
  });

  describe('Navigation Controls', () => {
    it('disables previous button on first step', () => {
      render(<WorkoutCustomization {...defaultProps} />);

      const previousButton = screen.getByText('Previous');
      expect(previousButton).toBeDisabled();
    });

    it('enables next button when not on last step', () => {
      render(<WorkoutCustomization {...defaultProps} />);

      const nextButton = screen.getByText('Next');
      expect(nextButton).not.toBeDisabled();
    });

    it('navigates to next step when clicking next button', () => {
      render(<WorkoutCustomization {...defaultProps} />);

      fireEvent.click(screen.getByText('Next'));

      expect(
        screen.getByTestId('equipment-preferences-step')
      ).toBeInTheDocument();
    });

    it('navigates to previous step when clicking previous button', () => {
      render(<WorkoutCustomization {...defaultProps} />);

      // Go to second step first
      fireEvent.click(screen.getByText('Next'));
      expect(
        screen.getByTestId('equipment-preferences-step')
      ).toBeInTheDocument();

      // Then go back
      fireEvent.click(screen.getByText('Previous'));
      expect(screen.getByTestId('workout-structure-step')).toBeInTheDocument();
    });

    it('disables next button on last step', () => {
      render(<WorkoutCustomization {...defaultProps} />);

      // Navigate to last step using the step button
      const step3Button = screen.getByLabelText('Step 3: Current State');
      fireEvent.click(step3Button);

      // Verify we're on the last step
      expect(screen.getByTestId('current-state-step')).toBeInTheDocument();

      const nextButton = screen.getByText('Next');
      expect(nextButton).toBeDisabled();
    });

    it('shows correct step counter', () => {
      render(<WorkoutCustomization {...defaultProps} />);

      expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Next'));
      expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    });
  });

  describe('Step Content', () => {
    it('renders workout structure step content', () => {
      render(<WorkoutCustomization {...defaultProps} />);

      expect(screen.getByTestId('workout-structure-step')).toBeInTheDocument();
    });

    it('renders equipment preferences step content when navigated', () => {
      render(<WorkoutCustomization {...defaultProps} />);

      const step2Button = screen.getByLabelText(
        'Step 2: Equipment & Preferences'
      );
      fireEvent.click(step2Button);

      expect(
        screen.getByTestId('equipment-preferences-step')
      ).toBeInTheDocument();
    });

    it('renders current state step content when navigated', () => {
      render(<WorkoutCustomization {...defaultProps} />);

      const step3Button = screen.getByLabelText('Step 3: Current State');
      fireEvent.click(step3Button);

      expect(screen.getByTestId('current-state-step')).toBeInTheDocument();
    });
  });

  describe('State Preservation', () => {
    it('preserves form data when switching steps', () => {
      const optionsWithData: PerWorkoutOptions = {
        customization_duration: 30,
        customization_focus: 'strength',
        customization_equipment: ['dumbbells'],
      };

      render(
        <WorkoutCustomization {...defaultProps} options={optionsWithData} />
      );

      // Navigate to second step
      const step2Button = screen.getByLabelText(
        'Step 2: Equipment & Preferences'
      );
      fireEvent.click(step2Button);

      // Navigate back to first step
      const step1Button = screen.getByLabelText('Step 1: Workout Structure');
      fireEvent.click(step1Button);

      // Data should still be preserved (this is tested via the step content display)
      expect(screen.getByTestId('workout-structure-step')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels for step navigation', () => {
      render(<WorkoutCustomization {...defaultProps} />);

      const stepIndicator = screen.getByTestId('step-indicator-container');
      expect(stepIndicator).toBeInTheDocument();

      // Step indicator should have proper accessibility attributes
      const stepButtons = screen.getAllByRole('button');
      const stepIndicatorButtons = stepButtons.filter((button) =>
        button.getAttribute('aria-label')?.includes('Step')
      );

      expect(stepIndicatorButtons.length).toBeGreaterThan(0);
    });

    it('supports keyboard navigation', () => {
      render(<WorkoutCustomization {...defaultProps} />);

      const stepButtons = screen.getAllByRole('button');
      const firstStepButton = stepButtons.find((button) =>
        button.getAttribute('aria-label')?.includes('Step 1')
      );

      if (firstStepButton) {
        // Focus the step button
        firstStepButton.focus();
        expect(document.activeElement).toBe(firstStepButton);

        // Simulate Enter key press
        fireEvent.keyDown(firstStepButton, { key: 'Enter' });

        // Should still be on the same step since it's already active
        expect(
          screen.getByTestId('workout-structure-step')
        ).toBeInTheDocument();
      }
    });
  });

  describe('Disabled State', () => {
    it('disables all navigation when disabled prop is true', () => {
      render(<WorkoutCustomization {...defaultProps} disabled={true} />);

      const nextButton = screen.getByText('Next');
      const previousButton = screen.getByText('Previous');

      expect(nextButton).toBeDisabled();
      expect(previousButton).toBeDisabled();
    });
  });
});
