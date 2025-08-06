import {
  WorkoutFeedback,
  CreateWorkoutFeedbackRequest,
} from '@/domain/entities/workoutFeedback';

export interface WorkoutFeedbackService {
  /**
   * Submit feedback for a workout
   * @param request The feedback data to submit
   * @returns Promise resolving to the created WorkoutFeedback
   */
  submitFeedback(
    request: CreateWorkoutFeedbackRequest
  ): Promise<WorkoutFeedback>;

  /**
   * Get feedback for a specific workout
   * @param workoutId The ID of the workout to get feedback for
   * @returns Promise resolving to WorkoutFeedback or null if not found
   */
  getFeedbackForWorkout(workoutId: string): Promise<WorkoutFeedback | null>;

  /**
   * Get all feedback submitted by the current user
   * @returns Promise resolving to array of WorkoutFeedback
   */
  getUserFeedback(): Promise<WorkoutFeedback[]>;

  /**
   * Update existing feedback
   * @param feedbackId The ID of the feedback to update
   * @param request The updated feedback data
   * @returns Promise resolving to the updated WorkoutFeedback
   */
  updateFeedback(
    feedbackId: string,
    request: CreateWorkoutFeedbackRequest
  ): Promise<WorkoutFeedback>;
}
