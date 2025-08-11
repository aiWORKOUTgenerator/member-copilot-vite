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

describe('WorkoutCustomization Intra-Step Auto-Scroll', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should auto-scroll from Focus to Energy section within same step', async () => {
    const onChange = vi.fn();

    render(
      <TestWrapper>
        <WorkoutCustomization
          options={{}}
          onChange={onChange}
          errors={{}}
          mode="quick"
        />
      </TestWrapper>
    );

    // Ensure we're on the focus-energy step
    expect(screen.getByText('Focus & Energy')).toBeInTheDocument();

    // Find and click a focus option
    const focusOptions = screen.getAllByRole('button');
    const energizingBoostOption = focusOptions.find((option) =>
      option.textContent?.includes('Energizing Boost')
    );

    if (energizingBoostOption) {
      fireEvent.click(energizingBoostOption);

      // Should call onChange
      expect(onChange).toHaveBeenCalled();

      // Should trigger auto-scroll after delay
      await waitFor(
        () => {
          expect(mockTriggerAutoScroll).toHaveBeenCalled();
        },
        { timeout: 200 }
      );
    }
  });

  it('should auto-scroll from Duration to Equipment section within same step', async () => {
    const onChange = vi.fn();

    render(
      <TestWrapper>
        <WorkoutCustomization
          options={{}}
          onChange={onChange}
          errors={{}}
          mode="quick"
          activeQuickStep="duration-equipment"
        />
      </TestWrapper>
    );

    // Ensure we're on the duration-equipment step
    expect(screen.getByText('Duration & Equipment')).toBeInTheDocument();

    // Find and click a duration option
    const durationOptions = screen.getAllByRole('button');
    const fifteenMinOption = durationOptions.find((option) =>
      option.textContent?.includes('15 min')
    );

    if (fifteenMinOption) {
      fireEvent.click(fifteenMinOption);

      // Should call onChange
      expect(onChange).toHaveBeenCalled();

      // Should trigger auto-scroll after delay
      await waitFor(
        () => {
          expect(mockTriggerAutoScroll).toHaveBeenCalled();
        },
        { timeout: 200 }
      );
    }
  });

  it('should not auto-scroll from Energy (last field in step)', async () => {
    const onChange = vi.fn();

    render(
      <TestWrapper>
        <WorkoutCustomization
          options={{ customization_focus: 'energizing_boost' }}
          onChange={onChange}
          errors={{}}
          mode="quick"
        />
      </TestWrapper>
    );

    // Find and click an energy option
    const energyOptions = screen.getAllByRole('button');
    const highEnergyOption = energyOptions.find((option) =>
      option.textContent?.includes('High')
    );

    if (highEnergyOption) {
      fireEvent.click(highEnergyOption);

      // Should call onChange
      expect(onChange).toHaveBeenCalled();

      // Should NOT trigger auto-scroll (Energy is last field in step)
      await new Promise((resolve) => setTimeout(resolve, 200));
      expect(mockTriggerAutoScroll).not.toHaveBeenCalled();
    }
  });

  it('should not auto-scroll when auto-advance is disabled', async () => {
    const onChange = vi.fn();

    render(
      <TestWrapper>
        <WorkoutCustomization
          options={{}}
          onChange={onChange}
          errors={{}}
          mode="quick"
        />
      </TestWrapper>
    );

    // Disable auto-scroll
    const toggle = screen.getByLabelText('Auto-advance');
    fireEvent.click(toggle);

    // Make a selection
    const focusOptions = screen.getAllByRole('button');
    const energizingBoostOption = focusOptions.find((option) =>
      option.textContent?.includes('Energizing Boost')
    );

    if (energizingBoostOption) {
      fireEvent.click(energizingBoostOption);

      // Should call onChange but not trigger auto-scroll
      expect(onChange).toHaveBeenCalled();

      await new Promise((resolve) => setTimeout(resolve, 200));
      expect(mockTriggerAutoScroll).not.toHaveBeenCalled();
    }
  });
});
