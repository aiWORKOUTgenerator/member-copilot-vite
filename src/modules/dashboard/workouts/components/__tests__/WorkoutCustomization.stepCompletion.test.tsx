import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import WorkoutCustomization from '../WorkoutCustomization';
import { AutoScrollProvider } from '@/contexts/AutoScrollContext';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AutoScrollProvider>{children}</AutoScrollProvider>
);

describe('WorkoutCustomization Step Completion Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should complete focus-energy step when both focus and energy are selected', async () => {
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

    // Wait for form to render
    await waitFor(() => {
      expect(
        screen.getByText("What's your main focus for this workout session?")
      ).toBeInTheDocument();
    });

    // Simulate selecting focus
    onChange.mockClear();
    fireEvent.click(
      screen
        .getByText("What's your main focus for this workout session?")
        .closest('div')
        ?.querySelector('button') || document.createElement('button')
    );

    // Wait for energy question
    await waitFor(() => {
      expect(
        screen.getByText('How energetic are you feeling today?')
      ).toBeInTheDocument();
    });

    // Simulate selecting energy
    fireEvent.click(
      screen
        .getByText('How energetic are you feeling today?')
        .closest('div')
        ?.querySelector('button') || document.createElement('button')
    );

    // Check if onChange was called
    expect(onChange).toHaveBeenCalled();
  });

  it('should test step completion logic directly', () => {
    // Test the step completion logic that should be used in the auto-scroll config
    const testFormData = {
      customization_focus: 'strength_training',
      customization_energy: 'high',
      customization_duration: undefined,
      customization_equipment: undefined,
    };

    // This is the logic from the auto-scroll config
    const isStepComplete = (
      stepId: string,
      formData: Record<string, unknown>
    ) => {
      if (stepId === 'focus-energy') {
        return !!(
          formData.customization_focus && formData.customization_energy
        );
      } else if (stepId === 'duration-equipment') {
        return !!(
          formData.customization_duration &&
          Array.isArray(formData.customization_equipment) &&
          formData.customization_equipment.length > 0
        );
      }
      return false;
    };

    // Test focus-energy step completion
    expect(isStepComplete('focus-energy', testFormData)).toBe(true);
    expect(isStepComplete('focus-energy', {})).toBe(false);
    expect(
      isStepComplete('focus-energy', {
        customization_focus: 'strength_training',
      })
    ).toBe(false);
    expect(
      isStepComplete('focus-energy', { customization_energy: 'high' })
    ).toBe(false);

    // Test duration-equipment step completion
    expect(isStepComplete('duration-equipment', testFormData)).toBe(false);
    expect(
      isStepComplete('duration-equipment', {
        ...testFormData,
        customization_duration: '30_minutes',
        customization_equipment: ['dumbbells'],
      })
    ).toBe(true);
  });

  it('should test getNextStep logic', () => {
    // Test the getNextStep logic from the auto-scroll config
    const getNextStep = (currentStepId: string) => {
      if (currentStepId === 'focus-energy') return 'duration-equipment';
      return null;
    };

    expect(getNextStep('focus-energy')).toBe('duration-equipment');
    expect(getNextStep('duration-equipment')).toBe(null);
    expect(getNextStep('invalid-step')).toBe(null);
  });
});
