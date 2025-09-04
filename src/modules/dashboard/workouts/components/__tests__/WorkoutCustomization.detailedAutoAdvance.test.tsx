import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import WorkoutCustomization from '../WorkoutCustomization';
import { AutoScrollProvider } from '@/contexts/AutoScrollContext';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AutoScrollProvider>{children}</AutoScrollProvider>
);

describe('WorkoutCustomization Detailed Auto-Advance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render detailed workout form with ModernFormHeader', () => {
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

    // Should render the modern header
    expect(screen.getByText('Detailed Workout Setup')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Comprehensive workout customization with advanced options'
      )
    ).toBeInTheDocument();

    // Should have auto-advance toggle
    expect(screen.getByLabelText('Auto-advance')).toBeInTheDocument();

    // Should have view mode toggle
    expect(screen.getByText('Simple')).toBeInTheDocument();
    expect(screen.getByText('Detailed')).toBeInTheDocument();
  });

  it('should have auto-advance disabled in detailed mode', () => {
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

    // Auto-advance should be disabled in detailed mode
    const toggle = screen.getByLabelText('Auto-advance');
    expect(toggle).not.toBeChecked();
    expect(toggle).toBeDisabled();
  });
});
