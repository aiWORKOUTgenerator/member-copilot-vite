import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useExercises, useExercisesForGeneratedWorkout } from '../useExercises';
import { Exercise } from '@/domain/entities/exercise';

// Mock the auth hook
vi.mock('../auth', () => ({
  useAuth: vi.fn(() => ({
    isSignedIn: true,
    isLoaded: true,
  })),
}));

// Mock the exercise service hook
const mockExerciseService = {
  getExercisesByGeneratedWorkoutId: vi.fn(),
  getExercisesByWorkoutId: vi.fn(),
  getExerciseById: vi.fn(),
};

vi.mock('../useExerciseService', () => ({
  useExerciseService: vi.fn(() => mockExerciseService),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useExercises', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load exercises for generated workout', async () => {
    const mockExercises = [
      new Exercise({
        id: '1',
        name: 'Push-ups',
        alternate_names: ['Press-ups'],
        detailed_instructions: 'Full instructions',
        simple_instructions: 'Simple instructions',
        muscle_groups: ['Chest'],
        body_part: 'Upper Body',
        equipment_required: [],
        exercise_type: 'Bodyweight',
        audio_url: null,
        image_url: null,
      }),
    ];

    mockExerciseService.getExercisesByGeneratedWorkoutId.mockResolvedValue(
      mockExercises
    );

    const { result } = renderHook(
      () => useExercises({ generatedWorkoutId: 'workout-123' }),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.exercises).toEqual(mockExercises);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoaded).toBe(true);
  });

  it('should load exercises for workout template', async () => {
    const mockExercises = [
      new Exercise({
        id: '2',
        name: 'Squats',
        alternate_names: ['Air Squats'],
        detailed_instructions: 'Full squat instructions',
        simple_instructions: 'Simple squat instructions',
        muscle_groups: ['Quadriceps'],
        body_part: 'Lower Body',
        equipment_required: [],
        exercise_type: 'Bodyweight',
        audio_url: null,
        image_url: null,
      }),
    ];

    mockExerciseService.getExercisesByWorkoutId.mockResolvedValue(
      mockExercises
    );

    const { result } = renderHook(
      () => useExercises({ workoutId: 'template-456' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.exercises).toEqual(mockExercises);
  });

  it('should handle loading state', () => {
    const { result } = renderHook(
      () => useExercises({ generatedWorkoutId: 'workout-123' }),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.exercises).toEqual([]);
    expect(result.current.isLoaded).toBe(false);
  });

  it('should handle errors', async () => {
    const error = new Error('API Error');
    mockExerciseService.getExercisesByGeneratedWorkoutId.mockRejectedValue(
      error
    );

    const { result } = renderHook(
      () => useExercises({ generatedWorkoutId: 'workout-123' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.error).toBe('API Error');
    });

    expect(result.current.exercises).toEqual([]);
  });

  it('should not fetch when user is not signed in', async () => {
    // Mock auth to return signed out
    const { useAuth } = await import('../auth');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useAuth as any).mockReturnValue({ isSignedIn: false, isLoaded: true });

    const { result } = renderHook(
      () => useExercises({ generatedWorkoutId: 'workout-123' }),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(false);
    expect(
      mockExerciseService.getExercisesByGeneratedWorkoutId
    ).not.toHaveBeenCalled();
  });
});

describe('useExercisesForGeneratedWorkout', () => {
  it('should be a convenience hook for generated workouts', () => {
    const { result } = renderHook(
      () => useExercisesForGeneratedWorkout('workout-123'),
      { wrapper: createWrapper() }
    );

    expect(result.current).toHaveProperty('exercises');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('refetch');
    expect(result.current).toHaveProperty('isLoaded');
  });
});
