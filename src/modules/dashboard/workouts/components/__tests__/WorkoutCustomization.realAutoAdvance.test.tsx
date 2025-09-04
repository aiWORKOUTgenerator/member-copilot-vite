import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import WorkoutCustomization from '../WorkoutCustomization';
import { AutoScrollProvider } from '@/contexts/AutoScrollContext';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AutoScrollProvider>{children}</AutoScrollProvider>
);

describe.skip('WorkoutCustomization Real Auto-Advance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should auto-advance when both focus and energy are selected in quick mode', async () => {
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

    // Verify auto-advance is enabled
    const autoAdvanceToggle = screen.getByLabelText('Auto-advance');
    expect(autoAdvanceToggle.checked).toBe(true);

    // Wait for the form to render completely
    await waitFor(() => {
      expect(
        screen.getByText("What's your main focus for this workout session?")
      ).toBeInTheDocument();
    });

    // Find and click the first focus option
    const focusOptions = screen.getAllByRole('button');
    const firstFocusOption = focusOptions.find(
      (option) =>
        option.textContent &&
        option.textContent !== 'Auto-advance' &&
        option.textContent !== 'Simple' &&
        option.textContent !== 'Detailed' &&
        !option.textContent.includes('Focus & Energy') &&
        !option.textContent.includes('Duration & Equipment')
    );

    if (firstFocusOption) {
      fireEvent.click(firstFocusOption);
      expect(onChange).toHaveBeenCalled();
    }

    // Wait for energy question to appear
    await waitFor(() => {
      expect(
        screen.getByText('How energetic are you feeling today?')
      ).toBeInTheDocument();
    });

    // Find and click the first energy option
    const energyOptions = screen.getAllByRole('button');
    const firstEnergyOption = energyOptions.find(
      (option) =>
        option.textContent &&
        option.textContent !== 'Auto-advance' &&
        option.textContent !== 'Simple' &&
        option.textContent !== 'Detailed' &&
        !option.textContent.includes('Focus & Energy') &&
        !option.textContent.includes('Duration & Equipment') &&
        !option.textContent.includes("What's your main focus") &&
        !option.textContent.includes('How energetic are you')
    );

    if (firstEnergyOption) {
      fireEvent.click(firstEnergyOption);
      expect(onChange).toHaveBeenCalledTimes(2);

      // Fast-forward through the auto-advance timing
      vi.advanceTimersByTime(100); // initial delay
      vi.advanceTimersByTime(800); // step advance delay

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
    expect(toggle.checked).toBe(false);

    // Wait for the form to render
    await waitFor(() => {
      expect(
        screen.getByText("What's your main focus for this workout session?")
      ).toBeInTheDocument();
    });

    // Select focus
    const focusOptions = screen.getAllByRole('button');
    const firstFocusOption = focusOptions.find(
      (option) =>
        option.textContent &&
        option.textContent !== 'Auto-advance' &&
        option.textContent !== 'Simple' &&
        option.textContent !== 'Detailed' &&
        !option.textContent.includes('Focus & Energy') &&
        !option.textContent.includes('Duration & Equipment')
    );

    if (firstFocusOption) {
      fireEvent.click(firstFocusOption);
    }

    // Wait for energy question
    await waitFor(() => {
      expect(
        screen.getByText('How energetic are you feeling today?')
      ).toBeInTheDocument();
    });

    // Select energy
    const energyOptions = screen.getAllByRole('button');
    const firstEnergyOption = energyOptions.find(
      (option) =>
        option.textContent &&
        option.textContent !== 'Auto-advance' &&
        option.textContent !== 'Simple' &&
        option.textContent !== 'Detailed' &&
        !option.textContent.includes('Focus & Energy') &&
        !option.textContent.includes('Duration & Equipment') &&
        !option.textContent.includes("What's your main focus") &&
        !option.textContent.includes('How energetic are you')
    );

    if (firstEnergyOption) {
      fireEvent.click(firstEnergyOption);

      // Fast-forward through timing
      vi.advanceTimersByTime(2000);

      // Should NOT auto-advance
      expect(onQuickStepChange).not.toHaveBeenCalled();
    }
  });

  it('should render detailed mode with auto-advance toggle', async () => {
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

    // Verify auto-advance toggle exists and is checked
    const autoAdvanceToggle = screen.getByLabelText('Auto-advance');
    expect(autoAdvanceToggle).toBeInTheDocument();
    expect(autoAdvanceToggle.checked).toBe(true);
  });
});
