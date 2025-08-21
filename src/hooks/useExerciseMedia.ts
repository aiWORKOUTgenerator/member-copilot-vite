import { useMemo } from 'react';
import { Exercise } from '@/domain/entities/exercise';

interface UIExercise {
  id?: string;
  name: string;
}

interface ExerciseMediaResult {
  imageUrl?: string | null;
  audioUrl?: string | null;
  sourceExerciseId?: string;
}

/**
 * Hook to resolve exercise media (images, audio) from canonical Exercise entities
 * @param uiExercise The exercise from the workout UI (may lack media data)
 * @param availableExercises Canonical Exercise entities with media URLs
 * @returns Resolved media URLs and source exercise ID
 */
export function useExerciseMedia(
  uiExercise: UIExercise | null,
  availableExercises: Exercise[]
): ExerciseMediaResult {
  return useMemo(() => {
    if (!uiExercise || !availableExercises.length) {
      return {};
    }

    // Step 1: Try exact ID match first (if ID is available)
    if (uiExercise.id) {
      const exactMatch = availableExercises.find(
        (exercise) => exercise.id === uiExercise.id
      );
      if (exactMatch) {
        return {
          imageUrl: exactMatch.imageUrl,
          audioUrl: exactMatch.audioUrl,
          sourceExerciseId: exactMatch.id,
        };
      }
    }

    // Step 2: Normalize the UI exercise name for matching
    const normalizedUIName = normalizeName(uiExercise.name);

    // Step 3: Try case-insensitive name match against Exercise.name
    const nameMatch = availableExercises.find(
      (exercise) => normalizeName(exercise.name) === normalizedUIName
    );
    if (nameMatch) {
      return {
        imageUrl: nameMatch.imageUrl,
        audioUrl: nameMatch.audioUrl,
        sourceExerciseId: nameMatch.id,
      };
    }

    // Step 4: Try matching against Exercise.alternateNames
    const alternateMatch = availableExercises.find(
      (exercise) =>
        exercise.alternateNames &&
        exercise.alternateNames.some(
          (altName) => normalizeName(altName) === normalizedUIName
        )
    );
    if (alternateMatch) {
      return {
        imageUrl: alternateMatch.imageUrl,
        audioUrl: alternateMatch.audioUrl,
        sourceExerciseId: alternateMatch.id,
      };
    }

    // No match found
    return {};
  }, [uiExercise, availableExercises]);
}

/**
 * Normalize exercise names for consistent matching
 * - Trim whitespace
 * - Convert to lowercase
 * - Collapse multiple spaces to single space
 * - Strip common punctuation
 */
function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/[^\w\s]/g, '') // Strip punctuation (keep word chars and spaces)
    .trim();
}
