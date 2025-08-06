import {
  WorkoutFeedback,
  CreateWorkoutFeedbackRequest,
} from '@/domain/entities/workoutFeedback';
import { WorkoutFeedbackService } from '@/domain/interfaces/services/WorkoutFeedbackService';

export class MockWorkoutFeedbackService implements WorkoutFeedbackService {
  readonly serviceName = 'MockWorkoutFeedbackService';
  private feedbackStore: Map<string, WorkoutFeedback> = new Map();
  private workoutFeedbackMap: Map<string, string> = new Map(); // workoutId -> feedbackId

  constructor() {
    // Initialize with some mock data for development
    this.initializeMockData();
  }

  private initializeMockData(): void {
    const mockFeedback = new WorkoutFeedback({
      id: 'mock-feedback-1',
      workout_id: 'mock-workout-1',
      overall_rating: 4,
      difficulty_rating: 3,
      enjoyment_rating: 5,
      what_liked: 'Great variety of exercises',
      what_disliked: 'Could use more rest time',
      improvements: 'Add more stretching exercises',
      would_recommend: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    this.feedbackStore.set(mockFeedback.id, mockFeedback);
    this.workoutFeedbackMap.set(mockFeedback.workoutId, mockFeedback.id);
  }

  async submitFeedback(
    request: CreateWorkoutFeedbackRequest
  ): Promise<WorkoutFeedback> {
    // Simulate API delay
    await this.delay(500);

    const feedbackId = `feedback-${Date.now()}`;
    const now = new Date().toISOString();

    const feedback = new WorkoutFeedback({
      id: feedbackId,
      workout_id: request.workoutId,
      overall_rating: request.overallRating,
      difficulty_rating: request.difficultyRating,
      enjoyment_rating: request.enjoymentRating,
      what_liked: request.whatLiked || null,
      what_disliked: request.whatDisliked || null,
      improvements: request.improvements || null,
      would_recommend: request.wouldRecommend,
      created_at: now,
      updated_at: now,
    });

    this.feedbackStore.set(feedbackId, feedback);
    this.workoutFeedbackMap.set(request.workoutId, feedbackId);

    return feedback;
  }

  async getFeedbackForWorkout(
    workoutId: string
  ): Promise<WorkoutFeedback | null> {
    // Simulate API delay
    await this.delay(300);

    const feedbackId = this.workoutFeedbackMap.get(workoutId);
    if (!feedbackId) {
      return null;
    }

    return this.feedbackStore.get(feedbackId) || null;
  }

  async getUserFeedback(): Promise<WorkoutFeedback[]> {
    // Simulate API delay
    await this.delay(400);

    return Array.from(this.feedbackStore.values());
  }

  async updateFeedback(
    feedbackId: string,
    request: CreateWorkoutFeedbackRequest
  ): Promise<WorkoutFeedback> {
    // Simulate API delay
    await this.delay(500);

    const existingFeedback = this.feedbackStore.get(feedbackId);
    if (!existingFeedback) {
      throw new Error('Feedback not found');
    }

    const updatedFeedback = new WorkoutFeedback({
      id: feedbackId,
      workout_id: request.workoutId,
      overall_rating: request.overallRating,
      difficulty_rating: request.difficultyRating,
      enjoyment_rating: request.enjoymentRating,
      what_liked: request.whatLiked || null,
      what_disliked: request.whatDisliked || null,
      improvements: request.improvements || null,
      would_recommend: request.wouldRecommend,
      created_at: existingFeedback.createdAt,
      updated_at: new Date().toISOString(),
    });

    this.feedbackStore.set(feedbackId, updatedFeedback);
    return updatedFeedback;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Utility methods for testing
  clearStore(): void {
    this.feedbackStore.clear();
    this.workoutFeedbackMap.clear();
  }

  hasFeedbackForWorkout(workoutId: string): boolean {
    return this.workoutFeedbackMap.has(workoutId);
  }
}
