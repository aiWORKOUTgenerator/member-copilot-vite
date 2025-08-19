import React, { ReactNode } from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConfigurationGuard } from '../ConfigurationGuard';

// Mock the ConfigurationLoadingScreen component
import type { ConfigurationLoadingScreenProps } from '../ConfigurationLoadingScreen';

vi.mock('../ConfigurationLoadingScreen', () => ({
  ConfigurationLoadingScreen: ({
    isLoading,
    error,
    onRetry,
  }: ConfigurationLoadingScreenProps) => (
    <div data-testid="loading-screen">
      <span>Loading: {isLoading.toString()}</span>
      <span>Error: {error || 'none'}</span>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

// Mock the useConfiguration hook
const mockUseConfiguration = vi.fn();
vi.mock('@/hooks/useConfiguration', () => ({
  useConfiguration: () => mockUseConfiguration(),
}));

const createWrapper =
  () =>
  ({ children }: { children: ReactNode }) => (
    <ConfigurationGuard>{children}</ConfigurationGuard>
  );

describe('ConfigurationGuard', () => {
  const TestComponent = () => <div data-testid="app-content">App Content</div>;

  it('should show loading screen when configuration is loading', () => {
    mockUseConfiguration.mockReturnValue({
      isLoading: true,
      isLoaded: false,
      error: null,
      refetch: vi.fn(),
    });
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
    expect(screen.getByText('Loading: true')).toBeInTheDocument();
    expect(screen.queryByTestId('app-content')).not.toBeInTheDocument();
  });

  it('should show loading screen when configuration is not loaded', () => {
    mockUseConfiguration.mockReturnValue({
      isLoading: false,
      isLoaded: false,
      error: null,
      refetch: vi.fn(),
    });
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
    expect(screen.queryByTestId('app-content')).not.toBeInTheDocument();
  });

  it('should show loading screen with error when there is an error', () => {
    const errorMessage = 'Configuration failed';
    mockUseConfiguration.mockReturnValue({
      isLoading: false,
      isLoaded: false,
      error: errorMessage,
      refetch: vi.fn(),
    });
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    expect(screen.queryByTestId('app-content')).not.toBeInTheDocument();
  });

  it('should render children when configuration is loaded successfully', () => {
    mockUseConfiguration.mockReturnValue({
      isLoading: false,
      isLoaded: true,
      error: null,
      refetch: vi.fn(),
    });
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    expect(screen.getByTestId('app-content')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
  });

  it('should pass refetch function to loading screen', () => {
    const mockRefetch = vi.fn();
    mockUseConfiguration.mockReturnValue({
      isLoading: false,
      isLoaded: false,
      error: 'Test error',
      refetch: mockRefetch,
    });
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    const retryButton = screen.getByText('Retry');
    retryButton.click();

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple children', () => {
    mockUseConfiguration.mockReturnValue({
      isLoading: false,
      isLoaded: true,
      error: null,
      refetch: vi.fn(),
    });
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
      </Wrapper>
    );

    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
  });
});
