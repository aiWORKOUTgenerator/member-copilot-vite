import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { AttributeCard } from '../AttributeCard';
import { Target } from 'lucide-react';

describe('AttributeCard', () => {
  const mockOnClick = vi.fn();

  const defaultProps = {
    id: '1',
    name: 'Fitness Goals',
    completionPercentage: 75,
    completedPrompts: 3,
    totalPrompts: 4,
    onClick: mockOnClick,
    icon: <Target className="w-5 h-5" />,
    hasErrors: false,
  };

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders with correct props', () => {
    render(<AttributeCard {...defaultProps} />);

    expect(screen.getByText('Fitness Goals')).toBeInTheDocument();
    expect(screen.getByText('3 of 4 questions answered')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('shows correct status for complete attribute', () => {
    render(<AttributeCard {...defaultProps} completionPercentage={100} />);

    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('shows correct status for not started attribute', () => {
    render(<AttributeCard {...defaultProps} completionPercentage={0} />);

    expect(screen.getByText('Not Started')).toBeInTheDocument();
    expect(screen.getByText('Start')).toBeInTheDocument();
  });

  it('shows error status when hasErrors is true', () => {
    render(<AttributeCard {...defaultProps} hasErrors={true} />);

    expect(screen.getByText('Has Errors')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    render(<AttributeCard {...defaultProps} />);

    const card = screen.getByLabelText(
      'Fitness Goals - In Progress (75% complete)'
    );
    fireEvent.click(card);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when button is clicked', () => {
    render(<AttributeCard {...defaultProps} />);

    const button = screen.getByText('Continue');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard navigation', () => {
    render(<AttributeCard {...defaultProps} />);

    const card = screen.getByLabelText(
      'Fitness Goals - In Progress (75% complete)'
    );
    fireEvent.keyDown(card, { key: 'Enter' });

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    render(<AttributeCard {...defaultProps} />);

    const card = screen.getByLabelText(
      'Fitness Goals - In Progress (75% complete)'
    );
    expect(card).toHaveAttribute(
      'aria-label',
      'Fitness Goals - In Progress (75% complete)'
    );
  });
});
