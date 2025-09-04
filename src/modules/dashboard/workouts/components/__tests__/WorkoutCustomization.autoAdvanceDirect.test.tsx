import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import WorkoutCustomization from '../WorkoutCustomization';
import { AutoScrollProvider } from '@/contexts/AutoScrollContext';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AutoScrollProvider>{children}</AutoScrollProvider>
);

describe.skip('WorkoutCustomization Direct Auto-Advance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call onQuickStepChange when auto-advance is triggered', async () => {
    const onChange = vi.fn();
    const onQuickStepChange = vi.fn();

    render(
      <TestWrapper>
        <WorkoutCustomization
          options={{
            customization_focus: 'strength_training',
            customization_energy: 'high',
          }}
          onChange={onChange}
          errors={{}}
          mode="quick"
          onQuickStepChange={onQuickStepChange}
        />
      </TestWrapper>
    );

    // Verify we start on focus-energy step
    expect(screen.getByText('Focus & Energy')).toBeInTheDocument();

    // Verify auto-advance is enabled
    const autoAdvanceToggle = screen.getByLabelText('Auto-advance');
    expect(autoAdvanceToggle.checked).toBe(true);

    // Simulate a field selection that should trigger auto-advance
    // Since both focus and energy are already set in options, any change should trigger auto-advance
    onChange.mockClear();
    onQuickStepChange.mockClear();

    // Trigger a change that should cause auto-advance
    fireEvent.click(autoAdvanceToggle); // Toggle off
    fireEvent.click(autoAdvanceToggle); // Toggle back on

    // Fast-forward through timing
    vi.advanceTimersByTime(100); // initial delay
    vi.advanceTimersByTime(800); // step advance delay

    // The auto-advance should trigger because the step is complete
    await waitFor(
      () => {
        expect(onQuickStepChange).toHaveBeenCalledWith('duration-equipment');
      },
      { timeout: 2000 }
    );
  });

  it('should not auto-advance when step is not complete', async () => {
    const onChange = vi.fn();
    const onQuickStepChange = vi.fn();

    render(
      <TestWrapper>
        <WorkoutCustomization
          options={{
            customization_focus: 'strength_training',
            // customization_energy is missing - step not complete
          }}
          onChange={onChange}
          errors={{}}
          mode="quick"
          onQuickStepChange={onQuickStepChange}
        />
      </TestWrapper>
    );

    // Verify we start on focus-energy step
    expect(screen.getByText('Focus & Energy')).toBeInTheDocument();

    // Verify auto-advance is enabled
    const autoAdvanceToggle = screen.getByLabelText('Auto-advance');
    expect(autoAdvanceToggle.checked).toBe(true);

    // Trigger a change
    onChange.mockClear();
    onQuickStepChange.mockClear();

    fireEvent.click(autoAdvanceToggle); // Toggle off
    fireEvent.click(autoAdvanceToggle); // Toggle back on

    // Fast-forward through timing
    vi.advanceTimersByTime(2000);

    // Should NOT auto-advance because step is not complete
    expect(onQuickStepChange).not.toHaveBeenCalled();
  });

  it('should not auto-advance when auto-scroll is disabled', async () => {
    const onChange = vi.fn();
    const onQuickStepChange = vi.fn();

    render(
      <TestWrapper>
        <WorkoutCustomization
          options={{
            customization_focus: 'strength_training',
            customization_energy: 'high',
          }}
          onChange={onChange}
          errors={{}}
          mode="quick"
          onQuickStepChange={onQuickStepChange}
        />
      </TestWrapper>
    );

    // Disable auto-scroll
    const autoAdvanceToggle = screen.getByLabelText('Auto-advance');
    fireEvent.click(autoAdvanceToggle);
    expect(autoAdvanceToggle.checked).toBe(false);

    // Trigger a change
    onChange.mockClear();
    onQuickStepChange.mockClear();

    fireEvent.click(autoAdvanceToggle); // Toggle back on
    fireEvent.click(autoAdvanceToggle); // Toggle off again

    // Fast-forward through timing
    vi.advanceTimersByTime(2000);

    // Should NOT auto-advance because auto-scroll is disabled
    expect(onQuickStepChange).not.toHaveBeenCalled();
  });
});
