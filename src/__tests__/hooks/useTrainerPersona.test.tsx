import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTrainerPersona } from '@/hooks/useTrainerPersona';
import type { TrainerPersona } from '@/domain/entities/trainerPersona';
import { ReactNode } from 'react';

// Mock auth to be signed in
vi.mock('@/hooks/auth', () => ({
  useAuth: () => ({ isSignedIn: true, isLoaded: true }),
}));

// Mock service implementation
const getTrainerPersona: () => Promise<TrainerPersona> = vi.fn();
const generateTrainerPersona: () => Promise<void> = vi.fn();

vi.mock('@/hooks/useTrainerPersonaService', () => ({
  useTrainerPersonaService: () => ({
    getTrainerPersona,
    generateTrainerPersona,
  }),
}));

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

beforeEach(() => {
  getTrainerPersona.mockReset();
  generateTrainerPersona.mockReset();
});

describe('useTrainerPersona', () => {
  it('should fetch and expose trainer persona state', async () => {
    const mockPersona: TrainerPersona = {
      trainer_name: 'Alex',
      trainer_bio: 'Bio',
      trainer_gender: 'non-binary',
      avatar_url: null,
      personality_traits: { friendly: 'yes' },
      expertise_areas: ['strength'],
      communication_style: ['concise'],
      llm_system_prompt: 'prompt',
    };
    getTrainerPersona.mockResolvedValueOnce(mockPersona);

    const { result } = renderHook(() => useTrainerPersona(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));
    expect(result.current.trainerPersona).toEqual(mockPersona);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.hasNoPersona).toBe(false);
  });

  it('should expose refetch and generate methods', async () => {
    const mockPersona: TrainerPersona = {
      trainer_name: 'Sam',
      trainer_bio: 'Bio',
      trainer_gender: 'female',
      avatar_url: null,
      personality_traits: {},
      expertise_areas: [],
      communication_style: [],
      llm_system_prompt: 'prompt',
    };
    getTrainerPersona.mockResolvedValue(mockPersona);
    generateTrainerPersona.mockResolvedValue(undefined);

    const { result } = renderHook(() => useTrainerPersona(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));
    expect(typeof result.current.refetch).toBe('function');
    expect(typeof result.current.generateTrainerPersona).toBe('function');
  });
});
