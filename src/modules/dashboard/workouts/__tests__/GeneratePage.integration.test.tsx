import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import GeneratePage from '../GeneratePage';
import { useGeneratedWorkouts } from '@/contexts/GeneratedWorkoutContext';
import { useAnalytics } from '@/hooks/useAnalytics';

// Mock the dependencies
vi.mock('@/contexts/GeneratedWorkoutContext');
vi.mock('@/hooks/useAnalytics');
vi.mock('react-router', () => ({
  useNavigate: () => vi.fn(),
}));

// Mock the selection counting logic
vi.mock('../selectionCountingLogic', () => ({
  useStepSelections: vi.fn(() => ({
    buttonState: {
      className: 'btn btn-primary',
      disabled: false,
      text: 'Next',
      state: 'active'
    },
    progressIndicator: {
      isEmpty: false,
      isComplete: true,
      isPartial: false,
      text: 'Ready to proceed',
      percentage: 100,
      color: 'green'
    },
    selectionState: {
      currentStep: {
        total: 2,
        required: 2,
        isComplete: true
      }
    }
  }))
}));

describe('GeneratePage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock useGeneratedWorkouts
    (useGeneratedWorkouts as ReturnType<typeof vi.fn>).mockReturnValue({
      createWorkout: vi.fn()
    });
    
    // Mock useAnalytics
    (useAnalytics as ReturnType<typeof vi.fn>).mockReturnValue({
      track: vi.fn()
    });
  });

  it('renders with hybrid button state system', () => {
    render(<GeneratePage />);
    
    // Check that the button is rendered
    const submitButton = screen.getByRole('button', { name: /next/i });
    expect(submitButton).toBeInTheDocument();
    
    // Check that the button has the correct class
    expect(submitButton).toHaveClass('btn', 'btn-primary');
  });

  it('shows progress indicator in quick mode', () => {
    render(<GeneratePage />);
    
    // Switch to quick mode (it should be default)
    const quickTab = screen.getByRole('button', { name: /quick workout setup/i });
    expect(quickTab).toHaveClass('btn-primary');
    
    // Check for progress indicator - use getAllByText since there are multiple instances
    const progressTexts = screen.getAllByText('Ready to proceed');
    expect(progressTexts.length).toBeGreaterThan(0);
  });

  it('shows percentage completion', () => {
    render(<GeneratePage />);
    
    // Check for percentage display
    const percentageText = screen.getByText('100% complete');
    expect(percentageText).toBeInTheDocument();
  });

  it('has smooth transitions on button', () => {
    render(<GeneratePage />);
    
    const submitButton = screen.getByRole('button', { name: /next/i });
    expect(submitButton).toHaveClass('transition-all', 'duration-200');
  });

  it('shows button state indicator', () => {
    render(<GeneratePage />);
    
    // Check for the state indicator dot - it should have a background color class
    const stateDot = document.querySelector('.w-2.h-2.rounded-full');
    expect(stateDot).toBeInTheDocument();
    expect(stateDot?.className).toMatch(/bg-(success|primary|error|base-content)/);
  });
}); 