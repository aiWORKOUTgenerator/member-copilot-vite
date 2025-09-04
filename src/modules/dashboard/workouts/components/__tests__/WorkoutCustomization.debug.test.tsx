import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import WorkoutCustomization from '../WorkoutCustomization';
import { AutoScrollProvider } from '@/contexts/AutoScrollContext';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AutoScrollProvider>{children}</AutoScrollProvider>
);

describe('WorkoutCustomization Debug Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  it('should show auto-scroll preferences state', () => {
    render(
      <TestWrapper>
        <WorkoutCustomization
          options={{}}
          onChange={vi.fn()}
          errors={{}}
          mode="quick"
        />
      </TestWrapper>
    );

    // Check if the toggle exists
    const toggle = screen.getByLabelText('Auto-advance');
    console.log('Toggle element:', toggle);
    console.log('Toggle checked state:', toggle.checked);
    console.log('Toggle attributes:', toggle.attributes);

    // Check if the toggle is visible
    expect(toggle).toBeInTheDocument();
  });

  it('should show detailed mode auto-scroll preferences state', () => {
    render(
      <TestWrapper>
        <WorkoutCustomization
          options={{}}
          onChange={vi.fn()}
          errors={{}}
          mode="detailed"
        />
      </TestWrapper>
    );

    // Check if the toggle exists
    const toggle = screen.getByLabelText('Auto-advance');
    console.log('Detailed mode toggle element:', toggle);
    console.log('Detailed mode toggle checked state:', toggle.checked);
    console.log('Detailed mode toggle attributes:', toggle.attributes);

    // Check if the toggle is visible
    expect(toggle).toBeInTheDocument();
  });
});
