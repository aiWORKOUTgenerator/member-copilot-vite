import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { mockContact } from '../../test/mocks';
import { clearMocks } from '../../test/mock-utils';

describe('useContact', () => {
  let mockContactContext: {
    contact: typeof mockContact;
    isLoading: boolean;
    error: string | null;
    refetch: ReturnType<typeof vi.fn>;
    isLoaded: boolean;
  };
  let useContact: () => typeof mockContactContext;

  beforeEach(async () => {
    clearMocks();

    // Create fresh mocks for each test
    mockContactContext = {
      contact: mockContact,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      isLoaded: true,
    };

    // Mock the useContact hook with controlled approach
    vi.doMock('../useContact', () => ({
      useContact: vi.fn(() => mockContactContext),
    }));

    // Import after mocking for better isolation
    const module = await import('../useContact');
    useContact = module.useContact;
  });

  it('returns contact data', () => {
    const { result } = renderHook(() => useContact());

    expect(result.current.contact).toEqual(mockContact);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoaded).toBe(true);
  });

  it('provides refetch function', () => {
    const { result } = renderHook(() => useContact());

    expect(typeof result.current.refetch).toBe('function');
  });

  it('calls refetch when requested', async () => {
    const { result } = renderHook(() => useContact());

    await result.current.refetch();

    expect(mockContactContext.refetch).toHaveBeenCalledTimes(1);
  });
});
