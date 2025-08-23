import { Exercise } from '@/domain/entities/exercise';

export interface ExerciseService {
  /**
   * Get exercises for a generated workout
   * @param generatedWorkoutId The ID of the generated workout
   * @returns Promise resolving to array of Exercise entities
   */
  getExercisesByGeneratedWorkoutId(
    generatedWorkoutId: string
  ): Promise<Exercise[]>;

  /**
   * Get exercises for a workout template
   * @param workoutId The ID of the workout template
   * @returns Promise resolving to array of Exercise entities
   */
  getExercisesByWorkoutId(workoutId: string): Promise<Exercise[]>;

  /**
   * Get a specific exercise by ID
   * @param exerciseId The ID of the exercise
   * @returns Promise resolving to Exercise entity or null
   */
  getExerciseById(exerciseId: string): Promise<Exercise | null>;
}
