import { renderHook } from '@testing-library/react';
import { useExerciseMedia } from '@/hooks/useExerciseMedia';
import { Exercise } from '@/domain/entities/exercise';

describe('useExerciseMedia Hook', () => {
  const mockExercises: Exercise[] = [
    new Exercise({
      id: '1',
      name: 'Push Up',
      alternate_names: ['Push-ups', 'Pushup'],
      detailed_instructions: 'Detailed instructions',
      simple_instructions: 'Simple instructions',
      muscle_groups: ['chest'],
      body_part: 'upper body',
      equipment_required: [],
      exercise_type: 'strength',
      image_url: 'https://example.com/pushup.jpg',
      audio_url: 'https://example.com/pushup.mp3',
    }),
    new Exercise({
      id: '2',
      name: 'Pull Up',
      alternate_names: ['Pull-ups', 'Pullup'],
      detailed_instructions: 'Detailed instructions',
      simple_instructions: 'Simple instructions',
      muscle_groups: ['back'],
      body_part: 'upper body',
      equipment_required: ['pull-up bar'],
      exercise_type: 'strength',
      image_url: 'https://example.com/pullup.jpg',
      audio_url: null,
    }),
    new Exercise({
      id: '3',
      name: 'Squat',
      alternate_names: ['Squats', 'Air Squat'],
      detailed_instructions: 'Detailed instructions',
      simple_instructions: 'Simple instructions',
      muscle_groups: ['legs'],
      body_part: 'lower body',
      equipment_required: [],
      exercise_type: 'strength',
      image_url: null,
      audio_url: 'https://example.com/squat.mp3',
    }),
  ];

  describe('when uiExercise is null', () => {
    it('returns empty result', () => {
      const { result } = renderHook(() =>
        useExerciseMedia(null, mockExercises)
      );

      expect(result.current).toEqual({});
    });
  });

  describe('when availableExercises is empty', () => {
    it('returns empty result', () => {
      const uiExercise = { name: 'Push Up' };
      const { result } = renderHook(() => useExerciseMedia(uiExercise, []));

      expect(result.current).toEqual({});
    });
  });

  describe('exact ID matching', () => {
    it('matches by exact ID when provided', () => {
      const uiExercise = { id: '1', name: 'Different Name' };
      const { result } = renderHook(() =>
        useExerciseMedia(uiExercise, mockExercises)
      );

      expect(result.current).toEqual({
        imageUrl: 'https://example.com/pushup.jpg',
        audioUrl: 'https://example.com/pushup.mp3',
        sourceExerciseId: '1',
      });
    });

    it('prioritizes ID match over name match', () => {
      const uiExercise = { id: '1', name: 'Pull Up' }; // Name matches different exercise
      const { result } = renderHook(() =>
        useExerciseMedia(uiExercise, mockExercises)
      );

      // Should return Push Up data (ID=1) not Pull Up data
      expect(result.current).toEqual({
        imageUrl: 'https://example.com/pushup.jpg',
        audioUrl: 'https://example.com/pushup.mp3',
        sourceExerciseId: '1',
      });
    });
  });

  describe('name matching', () => {
    it('matches by exact name when ID not available', () => {
      const uiExercise = { name: 'Push Up' };
      const { result } = renderHook(() =>
        useExerciseMedia(uiExercise, mockExercises)
      );

      expect(result.current).toEqual({
        imageUrl: 'https://example.com/pushup.jpg',
        audioUrl: 'https://example.com/pushup.mp3',
        sourceExerciseId: '1',
      });
    });

    it('matches case-insensitively', () => {
      const uiExercise = { name: 'PUSH UP' };
      const { result } = renderHook(() =>
        useExerciseMedia(uiExercise, mockExercises)
      );

      expect(result.current).toEqual({
        imageUrl: 'https://example.com/pushup.jpg',
        audioUrl: 'https://example.com/pushup.mp3',
        sourceExerciseId: '1',
      });
    });

    it('normalizes whitespace and punctuation', () => {
      const uiExercise = { name: '  Push-Up!!!  ' };
      const { result } = renderHook(() =>
        useExerciseMedia(uiExercise, mockExercises)
      );

      expect(result.current).toEqual({
        imageUrl: 'https://example.com/pushup.jpg',
        audioUrl: 'https://example.com/pushup.mp3',
        sourceExerciseId: '1',
      });
    });
  });

  describe('alternate name matching', () => {
    it('matches against alternate names when primary name fails', () => {
      const uiExercise = { name: 'Push-ups' }; // This is an alternate name
      const { result } = renderHook(() =>
        useExerciseMedia(uiExercise, mockExercises)
      );

      expect(result.current).toEqual({
        imageUrl: 'https://example.com/pushup.jpg',
        audioUrl: 'https://example.com/pushup.mp3',
        sourceExerciseId: '1',
      });
    });

    it('matches alternate names case-insensitively', () => {
      const uiExercise = { name: 'PULLUP' };
      const { result } = renderHook(() =>
        useExerciseMedia(uiExercise, mockExercises)
      );

      expect(result.current).toEqual({
        imageUrl: 'https://example.com/pullup.jpg',
        audioUrl: null,
        sourceExerciseId: '2',
      });
    });
  });

  describe('no match scenarios', () => {
    it('returns empty object when no match found', () => {
      const uiExercise = { name: 'Unknown Exercise' };
      const { result } = renderHook(() =>
        useExerciseMedia(uiExercise, mockExercises)
      );

      expect(result.current).toEqual({});
    });

    it('returns empty object when ID does not exist and name does not match', () => {
      const uiExercise = { id: '999', name: 'Unknown Exercise' };
      const { result } = renderHook(() =>
        useExerciseMedia(uiExercise, mockExercises)
      );

      expect(result.current).toEqual({});
    });
  });

  describe('memoization', () => {
    it('memoizes results for same input', () => {
      const uiExercise = { name: 'Push Up' };
      const { result, rerender } = renderHook(() =>
        useExerciseMedia(uiExercise, mockExercises)
      );

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult); // Same reference
    });

    it('recalculates when uiExercise changes', () => {
      let uiExercise = { name: 'Push Up' };
      const { result, rerender } = renderHook(() =>
        useExerciseMedia(uiExercise, mockExercises)
      );

      const firstResult = result.current;

      uiExercise = { name: 'Pull Up' };
      rerender();

      expect(result.current).not.toBe(firstResult);
      expect(result.current.sourceExerciseId).toBe('2');
    });

    it('recalculates when availableExercises changes', () => {
      const uiExercise = { name: 'Push Up' };
      let exercises = mockExercises;

      const { result, rerender } = renderHook(() =>
        useExerciseMedia(uiExercise, exercises)
      );

      const firstResult = result.current;

      exercises = []; // Empty array
      rerender();

      expect(result.current).not.toBe(firstResult);
      expect(result.current).toEqual({});
    });
  });

  describe('edge cases', () => {
    it('handles exercises with null/undefined media URLs', () => {
      const uiExercise = { name: 'Squat' };
      const { result } = renderHook(() =>
        useExerciseMedia(uiExercise, mockExercises)
      );

      expect(result.current).toEqual({
        imageUrl: null,
        audioUrl: 'https://example.com/squat.mp3',
        sourceExerciseId: '3',
      });
    });

    it('handles empty alternate names array', () => {
      const exerciseWithNoAlternates = new Exercise({
        id: '4',
        name: 'Plank',
        alternate_names: [],
        detailed_instructions: 'Detailed instructions',
        simple_instructions: 'Simple instructions',
        muscle_groups: ['core'],
        body_part: 'core',
        equipment_required: [],
        exercise_type: 'strength',
        image_url: 'https://example.com/plank.jpg',
      });

      const uiExercise = { name: 'Plank' };
      const { result } = renderHook(() =>
        useExerciseMedia(uiExercise, [exerciseWithNoAlternates])
      );

      expect(result.current).toEqual({
        imageUrl: 'https://example.com/plank.jpg',
        audioUrl: undefined,
        sourceExerciseId: '4',
      });
    });
  });
});
