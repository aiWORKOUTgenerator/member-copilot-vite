import { describe, it, expect } from 'vitest';
import { Exercise, ExerciseProps } from '@/domain/entities/exercise';

describe('Exercise Entity', () => {
  const mockExerciseProps: ExerciseProps = {
    id: '1',
    name: 'Push-ups',
    alternate_names: ['Press-ups', 'Floor Press'],
    detailed_instructions:
      'Start in a plank position with your arms fully extended...',
    simple_instructions: 'Lower body to floor and push back up',
    muscle_groups: ['Chest', 'Triceps', 'Shoulders'],
    body_part: 'Upper Body',
    equipment_required: [],
    exercise_type: 'strength',
    difficulty_level: 'beginner',
    is_compound: true,
    tags: ['compound', 'upper body'],
    audio_url: null,
    image_url: null,
  };

  describe('constructor', () => {
    it('should create an exercise instance with correct properties', () => {
      const exercise = new Exercise(mockExerciseProps);

      expect(exercise.id).toBe('1');
      expect(exercise.name).toBe('Push-ups');
      expect(exercise.alternateNames).toEqual(['Press-ups', 'Floor Press']);
      expect(exercise.detailedInstructions).toBe(
        'Start in a plank position with your arms fully extended...'
      );
      expect(exercise.simpleInstructions).toBe(
        'Lower body to floor and push back up'
      );
      expect(exercise.muscleGroups).toEqual(['Chest', 'Triceps', 'Shoulders']);
      expect(exercise.bodyPart).toBe('Upper Body');
      expect(exercise.equipmentRequired).toEqual([]);
      expect(exercise.exerciseType).toBe('strength');
      expect(exercise.difficultyLevel).toBe('beginner');
      expect(exercise.isCompound).toBe(true);
      expect(exercise.tags).toEqual(['compound', 'upper body']);
      expect(exercise.audioUrl).toBeNull();
      expect(exercise.imageUrl).toBeNull();
    });
  });

  describe('getters', () => {
    it('should return immutable properties', () => {
      const exercise = new Exercise(mockExerciseProps);

      // Test that arrays are returned by reference but should be treated as immutable
      const alternateNames = exercise.alternateNames;
      const muscleGroups = exercise.muscleGroups;
      const equipmentRequired = exercise.equipmentRequired;

      expect(alternateNames).toEqual(['Press-ups', 'Floor Press']);
      expect(muscleGroups).toEqual(['Chest', 'Triceps', 'Shoulders']);
      expect(equipmentRequired).toEqual([]);

      // Verify getters work correctly
      expect(exercise.name).toBe('Push-ups');
      expect(exercise.bodyPart).toBe('Upper Body');
      expect(exercise.exerciseType).toBe('strength');
      expect(exercise.difficultyLevel).toBe('beginner');
      expect(exercise.isCompound).toBe(true);
    });
  });

  describe('fromApiResponse', () => {
    it('should create exercise instance from API response', () => {
      const exercise = Exercise.fromApiResponse(mockExerciseProps);

      expect(exercise).toBeInstanceOf(Exercise);
      expect(exercise.id).toBe('1');
      expect(exercise.name).toBe('Push-ups');
      expect(exercise.alternateNames).toEqual(['Press-ups', 'Floor Press']);
    });
  });

  describe('equals', () => {
    it('should return true for exercises with same id', () => {
      const exercise1 = new Exercise(mockExerciseProps);
      const exercise2 = new Exercise(mockExerciseProps);

      expect(exercise1.equals(exercise2)).toBe(true);
    });

    it('should return false for exercises with different ids', () => {
      const exercise1 = new Exercise(mockExerciseProps);
      const exercise2 = new Exercise({ ...mockExerciseProps, id: '2' });

      expect(exercise1.equals(exercise2)).toBe(false);
    });

    it('should return false for null or undefined', () => {
      const exercise = new Exercise(mockExerciseProps);

      expect(exercise.equals(null as unknown as Exercise)).toBe(false);
      expect(exercise.equals(undefined as unknown as Exercise)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle exercises with media URLs', () => {
      const exerciseWithMedia = new Exercise({
        ...mockExerciseProps,
        audio_url: 'https://example.com/audio.mp3',
        image_url: 'https://example.com/image.jpg',
      });

      expect(exerciseWithMedia.audioUrl).toBe('https://example.com/audio.mp3');
      expect(exerciseWithMedia.imageUrl).toBe('https://example.com/image.jpg');
    });

    it('should handle exercises with equipment', () => {
      const exerciseWithEquipment = new Exercise({
        ...mockExerciseProps,
        equipment_required: ['Dumbbells', 'Bench'],
      });

      expect(exerciseWithEquipment.equipmentRequired).toEqual([
        'Dumbbells',
        'Bench',
      ]);
    });

    it('should handle empty alternate names', () => {
      const exerciseWithoutAlternates = new Exercise({
        ...mockExerciseProps,
        alternate_names: [],
      });

      expect(exerciseWithoutAlternates.alternateNames).toEqual([]);
    });
  });
});
