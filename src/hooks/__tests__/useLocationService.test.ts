import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLocationService } from '../useLocationService';
import { useApiService } from '../useApiService';
import { LocationServiceImpl } from '../../services/location/LocationServiceImpl';

// Mock the useApiService hook
vi.mock('../useApiService');

describe('useLocationService', () => {
  it('returns LocationService instance', () => {
    const mockApiService = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    vi.mocked(useApiService).mockReturnValue(mockApiService);

    const { result } = renderHook(() => useLocationService());

    expect(result.current).toBeInstanceOf(LocationServiceImpl);
  });

  it("memoizes the service instance when apiService doesn't change", () => {
    const mockApiService = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    vi.mocked(useApiService).mockReturnValue(mockApiService);

    const { result, rerender } = renderHook(() => useLocationService());
    const firstInstance = result.current;

    rerender();
    const secondInstance = result.current;

    expect(firstInstance).toBe(secondInstance);
  });

  it('creates new service instance when apiService changes', () => {
    const mockApiService1 = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    const mockApiService2 = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    vi.mocked(useApiService).mockReturnValue(mockApiService1);

    const { result, rerender } = renderHook(() => useLocationService());
    const firstInstance = result.current;

    vi.mocked(useApiService).mockReturnValue(mockApiService2);
    rerender();
    const secondInstance = result.current;

    expect(firstInstance).not.toBe(secondInstance);
  });

  it('exposes the correct methods', () => {
    const mockApiService = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    vi.mocked(useApiService).mockReturnValue(mockApiService);

    const { result } = renderHook(() => useLocationService());

    expect(typeof result.current.getLocations).toBe('function');
  });
});
