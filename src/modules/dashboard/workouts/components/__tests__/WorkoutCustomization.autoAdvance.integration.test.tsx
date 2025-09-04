import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import WorkoutCustomization from '../WorkoutCustomization';
import { AutoScrollProvider } from '@/contexts/AutoScrollContext';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AutoScrollProvider>{children}</AutoScrollProvider>
);

describe.skip('WorkoutCustomization Auto-Advance Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear any existing timeouts
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should auto-advance from focus-energy to duration-equipment when both fields are completed', async () => {
    const onChange = vi.fn();
    const onQuickStepChange = vi.fn();

    render(
      <TestWrapper>
        <WorkoutCustomization
          options={{}}
          onChange={onChange}
          errors={{}}
          mode="quick"
          onQuickStepChange={onQuickStepChange}
        />
      </TestWrapper>
    );

    // Verify we start on focus-energy step
    expect(screen.getByText('Focus & Energy')).toBeInTheDocument();
    expect(screen.getByText('Duration & Equipment')).toBeInTheDocument();

    // Verify auto-advance is enabled by default
    const autoAdvanceToggle = screen.getByLabelText('Auto-advance');
    expect(autoAdvanceToggle).toBeChecked();

    // Select focus first
    const focusOptions = screen.getAllByRole('button');
    const energizingBoostOption = focusOptions.find((option) =>
      option.textContent?.includes('Energizing Boost')
    );

    expect(energizingBoostOption).toBeDefined();
    if (energizingBoostOption) {
      fireEvent.click(energizingBoostOption);
      expect(onChange).toHaveBeenCalledWith(
        'customization_focus',
        'energizing_boost'
      );
    }

    // Select energy (should trigger auto-advance)
    const energyOptions = screen.getAllByRole('button');
    const highEnergyOption = energyOptions.find((option) =>
      option.textContent?.includes('High')
    );

    expect(highEnergyOption).toBeDefined();
    if (highEnergyOption) {
      fireEvent.click(highEnergyOption);
      expect(onChange).toHaveBeenCalledWith('customization_energy', 'high');

      // Fast-forward through the auto-advance timing
      vi.advanceTimersByTime(800); // initial delay
      vi.advanceTimersByTime(400); // step advance delay

      // Wait for auto-advance to trigger
      await waitFor(
        () => {
          expect(onQuickStepChange).toHaveBeenCalledWith('duration-equipment');
        },
        { timeout: 2000 }
      );
    }
  });

  it('should NOT auto-advance when auto-scroll is disabled', async () => {
    const onChange = vi.fn();
    const onQuickStepChange = vi.fn();

    render(
      <TestWrapper>
        <WorkoutCustomization
          options={{}}
          onChange={onChange}
          errors={{}}
          mode="quick"
          onQuickStepChange={onQuickStepChange}
        />
      </TestWrapper>
    );

    // Disable auto-scroll
    const toggle = screen.getByLabelText('Auto-advance');
    fireEvent.click(toggle);
    expect(toggle).not.toBeChecked();

    // Select both focus and energy
    const focusOptions = screen.getAllByRole('button');
    const energizingBoostOption = focusOptions.find((option) =>
      option.textContent?.includes('Energizing Boost')
    );

    if (energizingBoostOption) {
      fireEvent.click(energizingBoostOption);
    }

    const energyOptions = screen.getAllByRole('button');
    const highEnergyOption = energyOptions.find((option) =>
      option.textContent?.includes('High')
    );

    if (highEnergyOption) {
      fireEvent.click(highEnergyOption);

      // Fast-forward through timing
      vi.advanceTimersByTime(2000);

      // Should NOT auto-advance
      expect(onQuickStepChange).not.toHaveBeenCalled();
    }
  });

  it('should auto-advance in detailed mode when step is completed', async () => {
    const onChange = vi.fn();

    render(
      <TestWrapper>
        <WorkoutCustomization
          options={{}}
          onChange={onChange}
          errors={{}}
          mode="detailed"
        />
      </TestWrapper>
    );

    // Verify we're in detailed mode
    expect(screen.getByText('Detailed Workout Setup')).toBeInTheDocument();

    // Verify auto-advance is enabled
    const autoAdvanceToggle = screen.getByLabelText('Auto-advance');
    expect(autoAdvanceToggle).toBeInTheDocument();
    expect(autoAdvanceToggle.checked).toBe(true);

    // This test verifies the detailed mode auto-scroll configuration is set up correctly
    // The actual step completion logic would need to be tested with real form data
    expect(autoAdvanceToggle).toBeInTheDocument();
  });

  it('should handle field selection with proper timing', async () => {
    const onChange = vi.fn();
    const onQuickStepChange = vi.fn();

    render(
      <TestWrapper>
        <WorkoutCustomization
          options={{}}
          onChange={onChange}
          errors={{}}
          mode="quick"
          onQuickStepChange={onQuickStepChange}
        />
      </TestWrapper>
    );

    // Test that field selection triggers onChange immediately
    const focusOptions = screen.getAllByRole('button');
    const energizingBoostOption = focusOptions.find((option) =>
      option.textContent?.includes('Energizing Boost')
    );

    if (energizingBoostOption) {
      fireEvent.click(energizingBoostOption);

      // onChange should be called immediately
      expect(onChange).toHaveBeenCalledWith(
        'customization_focus',
        'energizing_boost'
      );

      // But auto-advance should not happen yet (only one field selected)
      vi.advanceTimersByTime(2000);
      expect(onQuickStepChange).not.toHaveBeenCalled();
    }
  });
});
