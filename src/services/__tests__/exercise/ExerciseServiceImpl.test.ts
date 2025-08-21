import { Exercise } from '@/domain/entities/exercise';
import { ApiService } from '@/domain/interfaces/api/ApiService';
import { ExerciseServiceImpl } from '@/services/exercise/ExerciseServiceImpl';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('ExerciseServiceImpl', () => {
  let exerciseService: ExerciseServiceImpl;
  let mockApiService: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockApiService = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };
    exerciseService = new ExerciseServiceImpl(mockApiService as ApiService);
  });

  describe('getExercisesByGeneratedWorkoutId', () => {
    it('should fetch exercises for a generated workout', async () => {
      const mockResponse = {
        generated_workout_id: 'workout-123',
        exercise_names: ['Push-ups', 'Squats'],
        exercises: [
          {
            id: '1',
            name: 'Push-ups',
            alternate_names: ['Press-ups'],
            detailed_instructions: 'Full instructions',
            simple_instructions: 'Simple instructions',
            muscle_groups: ['Chest'],
            body_part: 'Upper Body',
            equipment_required: [],
            exercise_type: 'strength',
            difficulty_level: 'beginner',
            is_compound: true,
            tags: ['compound'],
            audio_url: null,
            image_url: null,
          },
        ],
      };

      mockApiService.get.mockResolvedValue(mockResponse);

      const result =
        await exerciseService.getExercisesByGeneratedWorkoutId('workout-123');

      expect(mockApiService.get).toHaveBeenCalledWith(
        '/members/exercise-list/?generatedWorkoutId=workout-123'
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Exercise);
      expect(result[0].name).toBe('Push-ups');
      expect(result[0].difficultyLevel).toBe('beginner');
      expect(result[0].isCompound).toBe(true);
    });

    it('should handle API errors', async () => {
      const error = new Error('Network error');
      mockApiService.get.mockRejectedValue(error);

      await expect(
        exerciseService.getExercisesByGeneratedWorkoutId('workout-123')
      ).rejects.toThrow('Network error');
    });
  });

  describe('getExercisesByWorkoutId', () => {
    it('should fetch exercises for a workout template', async () => {
      const mockResponse = {
        exercise_names: ['Squats', 'Lunges'],
        exercises: [
          {
            id: '2',
            name: 'Squats',
            alternate_names: ['Air Squats'],
            detailed_instructions: 'Full squat instructions',
            simple_instructions: 'Simple squat instructions',
            muscle_groups: ['quadriceps', 'glutes'],
            body_part: 'lower body',
            equipment_required: [],
            exercise_type: 'strength',
            difficulty_level: 'intermediate',
            is_compound: true,
            tags: ['compound', 'legs'],
            audio_url: null,
            image_url: null,
          },
        ],
      };

      mockApiService.get.mockResolvedValue(mockResponse);

      const result =
        await exerciseService.getExercisesByWorkoutId('template-456');

      expect(mockApiService.get).toHaveBeenCalledWith(
        '/members/exercise-list/?workoutId=template-456'
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Exercise);
      expect(result[0].name).toBe('Squats');
    });
  });

  describe('getExerciseById', () => {
    it('should throw an error since this endpoint is not implemented', async () => {
      await expect(exerciseService.getExerciseById('3')).rejects.toThrow(
        'getExerciseById is not implemented by the current API'
      );
    });
  });
});
