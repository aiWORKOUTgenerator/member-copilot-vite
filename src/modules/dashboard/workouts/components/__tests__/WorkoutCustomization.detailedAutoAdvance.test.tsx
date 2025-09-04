import { render, screen, fireEvent } from '@testing-library/react';
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

  it('should allow toggling auto-advance on and off', () => {
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

    // Should have auto-advance toggle enabled by default
    const toggle = screen.getByLabelText('Auto-advance');
    expect(toggle).toBeChecked();

    // Should be able to disable auto-advance
    fireEvent.click(toggle);
    expect(toggle).not.toBeChecked();

    // Should be able to re-enable auto-advance
    fireEvent.click(toggle);
    expect(toggle).toBeChecked();
  });
});
