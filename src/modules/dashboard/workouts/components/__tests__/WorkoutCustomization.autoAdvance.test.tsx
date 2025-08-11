import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { AutoScrollProvider } from '@/contexts/AutoScrollContext';
import WorkoutCustomization from '../WorkoutCustomization';

// Mock the auto-scroll hooks
const mockTriggerAutoScroll = vi.fn();
vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks');
  return {
    ...actual,
    useAutoScroll: () => ({ triggerAutoScroll: mockTriggerAutoScroll }),
    useToast: () => ({ showSelectionToast: vi.fn(), showToast: vi.fn() }),
  };
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AutoScrollProvider>{children}</AutoScrollProvider>
);

describe('WorkoutCustomization Auto-Advance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should auto-advance from focus-energy step to duration-equipment step when both fields are selected', async () => {
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

    // Should start on focus-energy step
    expect(screen.getByText('Focus & Energy')).toBeInTheDocument();

    // Select focus first
    const focusOptions = screen.getAllByRole('button');
    const energizingBoostOption = focusOptions.find((option) =>
      option.textContent?.includes('Energizing Boost')
    );

    if (energizingBoostOption) {
      fireEvent.click(energizingBoostOption);
      expect(onChange).toHaveBeenCalled();
    }

    // Select energy (should trigger auto-advance)
    const energyOptions = screen.getAllByRole('button');
    const highEnergyOption = energyOptions.find((option) =>
      option.textContent?.includes('High')
    );

    if (highEnergyOption) {
      fireEvent.click(highEnergyOption);
      expect(onChange).toHaveBeenCalled();

      // Should auto-advance to next step after delay
      await waitFor(
        () => {
          expect(onQuickStepChange).toHaveBeenCalledWith('duration-equipment');
        },
        { timeout: 1200 }
      ); // 800ms delay + buffer
    }
  });

  it('should not auto-advance when only one field is selected in a step', async () => {
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

    // Select only focus (should not auto-advance)
    const focusOptions = screen.getAllByRole('button');
    const energizingBoostOption = focusOptions.find((option) =>
      option.textContent?.includes('Energizing Boost')
    );

    if (energizingBoostOption) {
      fireEvent.click(energizingBoostOption);
      expect(onChange).toHaveBeenCalled();

      // Should not auto-advance (only focus selected, energy missing)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      expect(onQuickStepChange).not.toHaveBeenCalled();
    }
  });

  it('should not auto-advance when auto-scroll is disabled', async () => {
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

      // Should not auto-advance (disabled)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      expect(onQuickStepChange).not.toHaveBeenCalled();
    }
  });

  it('should not auto-advance from duration-equipment step (last step)', async () => {
    const onChange = vi.fn();
    const onQuickStepChange = vi.fn();

    render(
      <TestWrapper>
        <WorkoutCustomization
          options={{}}
          onChange={onChange}
          errors={{}}
          mode="quick"
          activeQuickStep="duration-equipment"
          onQuickStepChange={onQuickStepChange}
        />
      </TestWrapper>
    );

    // Should be on duration-equipment step
    expect(screen.getByText('Duration & Equipment')).toBeInTheDocument();

    // Select both duration and equipment
    const durationOptions = screen.getAllByRole('button');
    const fifteenMinOption = durationOptions.find((option) =>
      option.textContent?.includes('15 min')
    );

    if (fifteenMinOption) {
      fireEvent.click(fifteenMinOption);
    }

    const equipmentOptions = screen.getAllByRole('button');
    const bodyweightOption = equipmentOptions.find((option) =>
      option.textContent?.includes('Bodyweight')
    );

    if (bodyweightOption) {
      fireEvent.click(bodyweightOption);

      // Should not auto-advance (last step)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      expect(onQuickStepChange).not.toHaveBeenCalled();
    }
  });

  it('should scroll to step top when auto-advancing', async () => {
    const onChange = vi.fn();
    const onQuickStepChange = vi.fn();

    // Mock scrollIntoView
    const mockScrollIntoView = vi.fn();
    const mockElement = { scrollIntoView: mockScrollIntoView };

    // Mock containerRef.current by mocking useRef
    const originalUseRef = React.useRef;
    vi.spyOn(React, 'useRef').mockImplementation((initialValue) => {
      // Return mock for containerRef, original for others
      if (initialValue === null) {
        return { current: mockElement };
      }
      return originalUseRef(initialValue);
    });

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

    // Select focus and energy to trigger auto-advance
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

      // Wait for auto-advance
      await waitFor(
        () => {
          expect(onQuickStepChange).toHaveBeenCalledWith('duration-equipment');
        },
        { timeout: 1200 }
      );

      // Verify scrollIntoView was called (by useEffect when step changed)
      await waitFor(() => {
        expect(mockScrollIntoView).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'start',
        });
      });
    }

    // Restore original useRef
    vi.restoreAllMocks();
  });
});
