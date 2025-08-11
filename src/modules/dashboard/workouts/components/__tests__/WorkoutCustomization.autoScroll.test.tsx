import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import WorkoutCustomization from '../WorkoutCustomization';

// Simple test without complex mocking
describe('WorkoutCustomization Auto-Scroll UI', () => {
  it('should show auto-scroll toggle', () => {
    render(
      <WorkoutCustomization
        options={{}}
        onChange={vi.fn()}
        errors={{}}
        mode="quick"
      />
    );

    expect(screen.getByLabelText('Auto-advance')).toBeInTheDocument();
  });

  it('should have auto-scroll enabled by default', () => {
    render(
      <WorkoutCustomization
        options={{}}
        onChange={vi.fn()}
        errors={{}}
        mode="quick"
      />
    );

    expect(screen.getByLabelText('Auto-advance')).toBeChecked();
  });

  it('should allow disabling auto-scroll', () => {
    render(
      <WorkoutCustomization
        options={{}}
        onChange={vi.fn()}
        errors={{}}
        mode="quick"
      />
    );

    const toggle = screen.getByLabelText('Auto-advance');
    fireEvent.click(toggle);

    expect(toggle).not.toBeChecked();
  });

  it('should render without errors', () => {
    const onChange = vi.fn();

    render(
      <WorkoutCustomization
        options={{}}
        onChange={onChange}
        errors={{}}
        mode="quick"
      />
    );

    // Should render the component successfully
    expect(screen.getByText('Quick Workout Setup')).toBeInTheDocument();
    expect(screen.getByText('Focus & Energy')).toBeInTheDocument();
  });
});
