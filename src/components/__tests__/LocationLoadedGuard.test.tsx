import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LocationLoadedGuard } from '../LocationLoadedGuard';
import { useLocation } from '../../hooks/useLocation';
import { useAuth } from '../../hooks/auth';

// Mock the dependencies
vi.mock('../../hooks/useLocation');
vi.mock('../../hooks/auth');

describe('LocationLoadedGuard', () => {
  const mockChild = <div data-testid="child-content">Protected Content</div>;
  const mockFallback = <div data-testid="custom-fallback">Custom Loading</div>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when user is signed in and locations are loaded', () => {
    vi.mocked(useLocation).mockReturnValue({
      locations: [],
      isLoading: false,
      error: null,
      isLoaded: true,
      refetch: vi.fn(),
      getAllEquipment: vi.fn(),
      getAllClassSchedules: vi.fn(),
      getDefaultLocation: vi.fn(),
      hasActiveEquipment: vi.fn(),
      hasActiveClasses: vi.fn(),
    });

    vi.mocked(useAuth).mockReturnValue({
      isSignedIn: true,
    });

    render(<LocationLoadedGuard>{mockChild}</LocationLoadedGuard>);

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('renders default loading state when user is signed in but locations are loading', () => {
    vi.mocked(useLocation).mockReturnValue({
      locations: [],
      isLoading: true,
      error: null,
      isLoaded: false,
      refetch: vi.fn(),
      getAllEquipment: vi.fn(),
      getAllClassSchedules: vi.fn(),
      getDefaultLocation: vi.fn(),
      hasActiveEquipment: vi.fn(),
      hasActiveClasses: vi.fn(),
    });

    vi.mocked(useAuth).mockReturnValue({
      isSignedIn: true,
    });

    render(<LocationLoadedGuard>{mockChild}</LocationLoadedGuard>);

    expect(screen.getByText('Loading locations...')).toBeInTheDocument();
    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
  });

  it('renders custom fallback when provided and locations are loading', () => {
    vi.mocked(useLocation).mockReturnValue({
      locations: [],
      isLoading: true,
      error: null,
      isLoaded: false,
      refetch: vi.fn(),
      getAllEquipment: vi.fn(),
      getAllClassSchedules: vi.fn(),
      getDefaultLocation: vi.fn(),
      hasActiveEquipment: vi.fn(),
      hasActiveClasses: vi.fn(),
    });

    vi.mocked(useAuth).mockReturnValue({
      isSignedIn: true,
    });

    render(
      <LocationLoadedGuard fallback={mockFallback}>
        {mockChild}
      </LocationLoadedGuard>
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading locations...')).not.toBeInTheDocument();
  });

  it('renders children when user is not signed in', () => {
    vi.mocked(useLocation).mockReturnValue({
      locations: [],
      isLoading: false,
      error: null,
      isLoaded: false,
      refetch: vi.fn(),
      getAllEquipment: vi.fn(),
      getAllClassSchedules: vi.fn(),
      getDefaultLocation: vi.fn(),
      hasActiveEquipment: vi.fn(),
      hasActiveClasses: vi.fn(),
    });

    vi.mocked(useAuth).mockReturnValue({
      isSignedIn: false,
    });

    render(<LocationLoadedGuard>{mockChild}</LocationLoadedGuard>);

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('renders children when user is signed in and locations failed to load', () => {
    vi.mocked(useLocation).mockReturnValue({
      locations: [],
      isLoading: false,
      error: 'Failed to load locations',
      isLoaded: false,
      refetch: vi.fn(),
      getAllEquipment: vi.fn(),
      getAllClassSchedules: vi.fn(),
      getDefaultLocation: vi.fn(),
      hasActiveEquipment: vi.fn(),
      hasActiveClasses: vi.fn(),
    });

    vi.mocked(useAuth).mockReturnValue({
      isSignedIn: true,
    });

    render(<LocationLoadedGuard>{mockChild}</LocationLoadedGuard>);

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('renders children when user is signed in, not loading, but not loaded yet', () => {
    vi.mocked(useLocation).mockReturnValue({
      locations: [],
      isLoading: false,
      error: null,
      isLoaded: false,
      refetch: vi.fn(),
      getAllEquipment: vi.fn(),
      getAllClassSchedules: vi.fn(),
      getDefaultLocation: vi.fn(),
      hasActiveEquipment: vi.fn(),
      hasActiveClasses: vi.fn(),
    });

    vi.mocked(useAuth).mockReturnValue({
      isSignedIn: true,
    });

    render(<LocationLoadedGuard>{mockChild}</LocationLoadedGuard>);

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('includes proper loading spinner attributes', () => {
    vi.mocked(useLocation).mockReturnValue({
      locations: [],
      isLoading: true,
      error: null,
      isLoaded: false,
      refetch: vi.fn(),
      getAllEquipment: vi.fn(),
      getAllClassSchedules: vi.fn(),
      getDefaultLocation: vi.fn(),
      hasActiveEquipment: vi.fn(),
      hasActiveClasses: vi.fn(),
    });

    vi.mocked(useAuth).mockReturnValue({
      isSignedIn: true,
    });

    render(<LocationLoadedGuard>{mockChild}</LocationLoadedGuard>);

    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
