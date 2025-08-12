import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
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
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('clamps progress values to valid range', () => {
    render(<ProgressBar progress={150} />);
    expect(screen.getByText('100% Complete')).toBeInTheDocument();

    render(<ProgressBar progress={-10} />);
    expect(screen.getByText('0% Complete')).toBeInTheDocument();
  });

  it('renders with different size variants', () => {
    const { rerender } = render(<ProgressBar progress={50} size="xs" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    rerender(<ProgressBar progress={50} size="sm" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    rerender(<ProgressBar progress={50} size="md" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    rerender(<ProgressBar progress={50} size="lg" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders with different variant colors', () => {
    const { rerender } = render(
      <ProgressBar progress={50} variant="primary" />
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    rerender(<ProgressBar progress={50} variant="secondary" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    rerender(<ProgressBar progress={50} variant="success" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    rerender(<ProgressBar progress={50} variant="warning" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    rerender(<ProgressBar progress={50} variant="error" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders with description', () => {
    render(<ProgressBar progress={60} description="3 of 5 fields completed" />);

    expect(screen.getByText('3 of 5 fields completed')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ProgressBar progress={50} className="custom-class" />);

    const container = screen.getByTestId('progress-bar');
    expect(container).toHaveClass('custom-class');
  });

  it('renders without label or percentage when both are disabled', () => {
    render(<ProgressBar progress={50} showPercentage={false} label="" />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText('50% Complete')).not.toBeInTheDocument();
  });

  it('rounds progress percentage correctly', () => {
    render(<ProgressBar progress={33.7} />);
    expect(screen.getByText('34% Complete')).toBeInTheDocument();

    render(<ProgressBar progress={33.3} />);
    expect(screen.getByText('33% Complete')).toBeInTheDocument();
  });

  it('has proper ARIA attributes', () => {
    render(<ProgressBar progress={75} label="Test Progress" />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    expect(progressBar).toHaveAttribute('aria-label', 'Test Progress');
  });

  it('uses fallback aria-label when no label provided', () => {
    render(<ProgressBar progress={50} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-label', 'Progress');
  });

  it('applies animation classes when animated is true', () => {
    render(<ProgressBar progress={50} animated={true} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass(
      'transition-all',
      'duration-300',
      'ease-out'
    );
  });

  it('does not apply animation classes when animated is false', () => {
    render(<ProgressBar progress={50} animated={false} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).not.toHaveClass(
      'transition-all',
      'duration-300',
      'ease-out'
    );
  });

  it('renders with custom test ID', () => {
    render(<ProgressBar progress={50} testId="custom-progress" />);

    expect(screen.getByTestId('custom-progress')).toBeInTheDocument();
  });

  it('handles zero progress correctly', () => {
    render(<ProgressBar progress={0} />);

    expect(screen.getByText('0% Complete')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('handles 100% progress correctly', () => {
    render(<ProgressBar progress={100} />);

    expect(screen.getByText('100% Complete')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
