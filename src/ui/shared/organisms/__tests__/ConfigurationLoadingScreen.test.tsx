import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfigurationLoadingScreen } from '../ConfigurationLoadingScreen';

describe('ConfigurationLoadingScreen', () => {
  const mockOnRetry = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    render(
      <ConfigurationLoadingScreen
        isLoading={true}
        error={null}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText('Loading Application')).toBeInTheDocument();
    expect(
      screen.getByText('Setting up your personalized experience...')
    ).toBeInTheDocument();
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('should render error state with error message', () => {
    const errorMessage = 'Network connection failed';

    render(
      <ConfigurationLoadingScreen
        isLoading={false}
        error={errorMessage}
        onRetry={mockOnRetry}
      />
    );

    expect(
      screen.getByText('Unable to Load Configuration')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "We're having trouble setting up your application. Please check your connection and try again."
      )
    ).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should render error state without specific error message', () => {
    render(
      <ConfigurationLoadingScreen
        isLoading={false}
        error=""
        onRetry={mockOnRetry}
      />
    );

    expect(
      screen.getByText('Unable to Load Configuration')
    ).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(
      screen.queryByText('Network connection failed')
    ).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', () => {
    render(
      <ConfigurationLoadingScreen
        isLoading={false}
        error="Test error"
        onRetry={mockOnRetry}
      />
    );

    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('should render nothing when not loading and no error', () => {
    const { container } = render(
      <ConfigurationLoadingScreen
        isLoading={false}
        error={null}
        onRetry={mockOnRetry}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should have proper accessibility attributes', () => {
    render(
      <ConfigurationLoadingScreen
        isLoading={false}
        error="Test error"
        onRetry={mockOnRetry}
      />
    );

    const retryButton = screen.getByRole('button', { name: 'Try Again' });
    expect(retryButton).toBeInTheDocument();
  });

  it('should display error icon in error state', () => {
    const { container } = render(
      <ConfigurationLoadingScreen
        isLoading={false}
        error="Test error"
        onRetry={mockOnRetry}
      />
    );

    // Check that the error icon SVG is present
    const errorIcon = container.querySelector('svg');
    expect(errorIcon).toBeInTheDocument();
    expect(errorIcon).toHaveClass('w-8', 'h-8', 'text-error');
  });

  it('should display support message in error state', () => {
    render(
      <ConfigurationLoadingScreen
        isLoading={false}
        error="Test error"
        onRetry={mockOnRetry}
      />
    );

    expect(
      screen.getByText('If the problem persists, please contact support')
    ).toBeInTheDocument();
  });
});
