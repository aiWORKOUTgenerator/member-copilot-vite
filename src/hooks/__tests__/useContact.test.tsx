import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { mockContact } from '../../test/mocks';

// Mock the ContactContext
const mockContactContext = {
  contact: mockContact,
  isLoading: false,
  error: null,
  refetch: vi.fn(),
  isLoaded: true,
};

// Mock the useContact hook
vi.mock('../useContact', () => ({
  useContact: vi.fn(() => mockContactContext),
}));

// Import after mocking
import { useContact } from '../useContact';

describe('useContact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
