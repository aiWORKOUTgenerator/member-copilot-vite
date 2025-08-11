import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import WorkoutCustomization from '../WorkoutCustomization';
import { AutoScrollProvider } from '@/contexts/AutoScrollContext';

// Test wrapper with AutoScrollProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AutoScrollProvider>{children}</AutoScrollProvider>
);

// Simple test without complex mocking
describe('WorkoutCustomization Auto-Scroll UI', () => {
  it('should show auto-scroll toggle', () => {
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

    expect(screen.getByLabelText('Auto-advance')).toBeInTheDocument();
  });

  it('should have auto-scroll enabled by default', () => {
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

    expect(screen.getByLabelText('Auto-advance')).toBeChecked();
  });

  it('should allow disabling auto-scroll', () => {
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

    const toggle = screen.getByLabelText('Auto-advance');
    fireEvent.click(toggle);

    expect(toggle).not.toBeChecked();
  });

  it('should render without errors', () => {
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

    // Should render the component successfully
    expect(screen.getByText('Quick Workout Setup')).toBeInTheDocument();
    expect(screen.getByText('Focus & Energy')).toBeInTheDocument();
  });
});
