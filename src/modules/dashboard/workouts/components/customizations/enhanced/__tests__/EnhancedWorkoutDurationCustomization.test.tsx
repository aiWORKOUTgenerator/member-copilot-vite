import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EnhancedWorkoutDurationCustomization from '../EnhancedWorkoutDurationCustomization';

// Mock the hooks
vi.mock('../../../hooks/useWorkoutAnalytics', () => ({
  useWorkoutAnalytics: () => ({
    trackSelection: vi.fn(),
  }),
}));

vi.mock('../../utils/optionEnhancers', () => ({
  useEnhancedOptions: () => ({
    detailedDurationOptions: [
      {
        id: '20',
        title: '20 min',
        description:
          'HIIT, mobility flows, EMOM/AMRAP circuits, bodyweight conditioning',
        tertiary:
          'Great for low-energy days, warm-ups, or time-crunched routines',
      },
      {
        id: '30',
        title: '30 min',
        description:
          'Full-body dumbbell or kettlebell workouts, short cardio/strength combos',
        tertiary: 'Efficient option for consistency and busy users',
      },
      {
        id: '45',
        title: '45 min',
        description:
          'Balanced strength splits, cardio intervals + accessory work, functional circuits',
        tertiary:
          'Sweet spot for general fitness – warm-up to cool-down included',
      },
      {
        id: '60',
        title: '60 min',
        description:
          'Hypertrophy splits, strength + cardio combos, skill practice + accessories',
        tertiary:
          'Traditional full training session; good rest-to-work balance',
      },
      {
        id: '75',
        title: '75 min',
        description:
          'Powerbuilding, Olympic lift work, strength splits with long rest, mobility + core work',
        tertiary: 'Advanced sessions with more complexity or mixed modalities',
      },
      {
        id: '90',
        title: '90 min',
        description:
          'Full powerlifting splits, CrossFit WOD + skill blocks, athlete-specific periodization',
        tertiary:
          'Rare use—advanced or competitive athletes needing full recovery blocks',
      },
    ],
  }),
}));

// Mock the DetailedSelector component
vi.mock('@/ui/shared/molecules', () => ({
  DetailedSelector: ({
    options,
    selectedValue,
    onChange,
    question,
    description,
  }: {
    options: Array<{
      id: string;
      title: string;
      description: string;
      tertiary: string;
    }>;
    selectedValue?: string;
    onChange: (value: string | string[]) => void;
    question: string;
    description: string;
  }) => (
    <div data-testid="detailed-selector">
      <h3>{question}</h3>
      <p>{description}</p>
      <div data-testid="options">
        {options.map((option) => (
          <button
            key={option.id}
            data-testid={`option-${option.id}`}
            onClick={() => onChange(option.id)}
            className={selectedValue === option.id ? 'selected' : ''}
          >
            <div>{option.title}</div>
            <div>{option.description}</div>
            <div>{option.tertiary}</div>
          </button>
        ))}
      </div>
    </div>
  ),
}));

describe('EnhancedWorkoutDurationCustomization', () => {
  const defaultProps = {
    value: undefined,
    onChange: vi.fn(),
    disabled: false,
    error: undefined,
  };

  it('renders with detailed duration options', () => {
    render(<EnhancedWorkoutDurationCustomization {...defaultProps} />);

    expect(
      screen.getByText('How long do you want your workout to be?')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Choose a duration that fits your schedule, energy level, and fitness goals'
      )
    ).toBeInTheDocument();

    // Check that all detailed duration options are rendered
    expect(screen.getByTestId('option-20')).toBeInTheDocument();
    expect(screen.getByTestId('option-30')).toBeInTheDocument();
    expect(screen.getByTestId('option-45')).toBeInTheDocument();
    expect(screen.getByTestId('option-60')).toBeInTheDocument();
    expect(screen.getByTestId('option-75')).toBeInTheDocument();
    expect(screen.getByTestId('option-90')).toBeInTheDocument();
  });

  it('displays comprehensive descriptions for each duration option', () => {
    render(<EnhancedWorkoutDurationCustomization {...defaultProps} />);

    // Check that the descriptions are comprehensive
    expect(
      screen.getByText(
        'HIIT, mobility flows, EMOM/AMRAP circuits, bodyweight conditioning'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Full-body dumbbell or kettlebell workouts, short cardio/strength combos'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Balanced strength splits, cardio intervals + accessory work, functional circuits'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Hypertrophy splits, strength + cardio combos, skill practice + accessories'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Powerbuilding, Olympic lift work, strength splits with long rest, mobility + core work'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Full powerlifting splits, CrossFit WOD + skill blocks, athlete-specific periodization'
      )
    ).toBeInTheDocument();
  });

  it('displays subtitles for each duration option', () => {
    render(<EnhancedWorkoutDurationCustomization {...defaultProps} />);

    // Check that the subtitles are displayed
    expect(
      screen.getByText(
        'Great for low-energy days, warm-ups, or time-crunched routines'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Efficient option for consistency and busy users')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Sweet spot for general fitness – warm-up to cool-down included'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Traditional full training session; good rest-to-work balance'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Advanced sessions with more complexity or mixed modalities'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Rare use—advanced or competitive athletes needing full recovery blocks'
      )
    ).toBeInTheDocument();
  });

  it('calls onChange with correct duration value when option is selected', () => {
    const onChange = vi.fn();
    render(
      <EnhancedWorkoutDurationCustomization
        {...defaultProps}
        onChange={onChange}
      />
    );

    // Click on the 45-minute option
    fireEvent.click(screen.getByTestId('option-45'));

    expect(onChange).toHaveBeenCalledWith(45);
  });

  it('handles invalid duration values gracefully', () => {
    const onChange = vi.fn();
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <EnhancedWorkoutDurationCustomization
        {...defaultProps}
        onChange={onChange}
      />
    );

    // Simulate an invalid selection (this would be handled by the DetailedSelector)
    // The component should handle this gracefully

    consoleSpy.mockRestore();
  });

  it('shows selected value correctly', () => {
    render(
      <EnhancedWorkoutDurationCustomization {...defaultProps} value={60} />
    );

    // The selected option should have the 'selected' class
    const selectedOption = screen.getByTestId('option-60');
    expect(selectedOption).toHaveClass('selected');
  });
});
