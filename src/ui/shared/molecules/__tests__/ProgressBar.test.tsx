import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
  it('renders with basic props', () => {
    render(<ProgressBar progress={50} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('50% Complete')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<ProgressBar progress={75} label="Overall Progress" />);

    expect(screen.getByText('Overall Progress')).toBeInTheDocument();
    expect(screen.getByText('75% Complete')).toBeInTheDocument();
  });

  it('hides percentage when showPercentage is false', () => {
    render(<ProgressBar progress={30} showPercentage={false} />);

    expect(screen.queryByText('30% Complete')).not.toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<ProgressBar progress={60} description="3 of 5 steps completed" />);

    expect(screen.getByText('3 of 5 steps completed')).toBeInTheDocument();
  });

  it('clamps progress to 0-100 range', () => {
    const { rerender } = render(<ProgressBar progress={150} />);
    expect(screen.getByText('100% Complete')).toBeInTheDocument();

    rerender(<ProgressBar progress={-20} />);
    expect(screen.getByText('0% Complete')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<ProgressBar progress={50} size="xs" />);
    let progressBar = screen.getByTestId('progress-bar-fill');
    expect(progressBar).toHaveClass('h-1');

    rerender(<ProgressBar progress={50} size="lg" />);
    progressBar = screen.getByTestId('progress-bar-fill');
    expect(progressBar).toHaveClass('h-3');
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(
      <ProgressBar progress={50} variant="success" />
    );
    let progressBar = screen.getByTestId('progress-bar-fill');
    expect(progressBar).toHaveClass('bg-success');

    rerender(<ProgressBar progress={50} variant="error" />);
    progressBar = screen.getByTestId('progress-bar-fill');
    expect(progressBar).toHaveClass('bg-error');
  });

  it('applies animation classes when animated is true', () => {
    render(<ProgressBar progress={50} animated={true} />);
    const progressBar = screen.getByTestId('progress-bar-fill');
    expect(progressBar).toHaveClass(
      'transition-all',
      'duration-300',
      'ease-out'
    );
  });

  it('does not apply animation classes when animated is false', () => {
    render(<ProgressBar progress={50} animated={false} />);
    const progressBar = screen.getByTestId('progress-bar-fill');
    expect(progressBar).not.toHaveClass('transition-all');
  });

  it('sets correct aria attributes', () => {
    render(<ProgressBar progress={75} label="Test Progress" />);
    const progressBar = screen.getByRole('progressbar');

    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    expect(progressBar).toHaveAttribute('aria-label', 'Test Progress');
  });

  it('uses default aria-label when no label provided', () => {
    render(<ProgressBar progress={42} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-label', 'Progress: 42%');
  });

  it('applies custom className', () => {
    render(<ProgressBar progress={50} className="custom-class" />);
    const container = screen.getByTestId('progress-bar');
    expect(container).toHaveClass('custom-class');
  });

  it('uses custom testId', () => {
    render(<ProgressBar progress={50} testId="custom-progress" />);
    expect(screen.getByTestId('custom-progress')).toBeInTheDocument();
    expect(screen.getByTestId('custom-progress-fill')).toBeInTheDocument();
  });

  it('rounds progress percentage in display', () => {
    render(<ProgressBar progress={33.7} />);
    expect(screen.getByText('34% Complete')).toBeInTheDocument();
  });

  it('handles zero progress correctly', () => {
    render(<ProgressBar progress={0} />);
    expect(screen.getByText('0% Complete')).toBeInTheDocument();

    const progressBar = screen.getByTestId('progress-bar-fill');
    expect(progressBar).toHaveStyle('width: 0%');
  });

  it('handles full progress correctly', () => {
    render(<ProgressBar progress={100} />);
    expect(screen.getByText('100% Complete')).toBeInTheDocument();

    const progressBar = screen.getByTestId('progress-bar-fill');
    expect(progressBar).toHaveStyle('width: 100%');
  });
});
