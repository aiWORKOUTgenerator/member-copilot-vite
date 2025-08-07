import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useTrainerPersona } from '@/hooks/useTrainerPersona';

// Mock the TrainerPersonaContext to return our mock context value
// The context is exported from the types file in this project's architecture
vi.mock('@/contexts/trainer-persona.types', () => ({
  TrainerPersonaContext: {
    _currentValue: {
      trainerPersona: null,
      isLoading: false,
      error: null,
      isLoaded: true,
      hasNoPersona: false,
      refetch: vi.fn(),
      generateTrainerPersona: vi.fn(),
    },
  },
}));

describe('useTrainerPersona', () => {
  it('should return trainer persona state', () => {
    const { result } = renderHook(() => useTrainerPersona());

    expect(result.current).toBeDefined();
    expect(result.current.isLoaded).toBe(true);
    expect(result.current.trainerPersona).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.hasNoPersona).toBe(false);
  });

  it('should have all required properties', () => {
    const { result } = renderHook(() => useTrainerPersona());

    expect(result.current.refetch).toBeDefined();
    expect(result.current.generateTrainerPersona).toBeDefined();
  });
});
