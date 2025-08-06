import {
  WorkoutFeedback,
  CreateWorkoutFeedbackRequest,
} from '@/domain/entities/workoutFeedback';
import { ApiService } from '@/domain/interfaces/api/ApiService';
import { WorkoutFeedbackService } from '@/domain/interfaces/services/WorkoutFeedbackService';

interface WorkoutFeedbackProps {
  id: string;
  workout_id: string;
  overall_rating: number;
  difficulty_rating: number;
  enjoyment_rating: number;
  what_liked?: string | null;
  what_disliked?: string | null;
  improvements?: string | null;
  would_recommend: boolean;
  created_at: string;
  updated_at: string;
}

export class WorkoutFeedbackServiceImpl implements WorkoutFeedbackService {
  readonly serviceName = 'WorkoutFeedbackService';
  private readonly apiService: ApiService;
  private readonly baseEndpoint = '/members';

  /**
   * Creates a new instance of WorkoutFeedbackServiceImpl
   * @param apiService The API service to use for HTTP requests
   */
  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async submitFeedback(
    request: CreateWorkoutFeedbackRequest
  ): Promise<WorkoutFeedback> {
    try {
      const payload = {
        workout_id: request.workoutId,
        overall_rating: request.overallRating,
        difficulty_rating: request.difficultyRating,
        enjoyment_rating: request.enjoymentRating,
        what_liked: request.whatLiked || null,
        what_disliked: request.whatDisliked || null,
        improvements: request.improvements || null,
        would_recommend: request.wouldRecommend,
      };

      const createdFeedback = await this.apiService.post<
        WorkoutFeedbackProps,
        Record<string, unknown>
      >(`${this.baseEndpoint}/workout-feedback/`, payload);

      return new WorkoutFeedback(createdFeedback);
    } catch (error) {
      console.error('Error in submitFeedback:', error);
      throw new Error('Failed to submit workout feedback');
    }
  }

  async getFeedbackForWorkout(
    workoutId: string
  ): Promise<WorkoutFeedback | null> {
    try {
      const feedbackData =
        await this.apiService.get<WorkoutFeedbackProps | null>(
          `${this.baseEndpoint}/workout-feedback/workout/${workoutId}/`
        );

      return feedbackData ? new WorkoutFeedback(feedbackData) : null;
    } catch (error) {
      console.error('Error in getFeedbackForWorkout:', error);
      // If it's a 404, return null instead of throwing
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw new Error('Failed to fetch workout feedback');
    }
  }

  async getUserFeedback(): Promise<WorkoutFeedback[]> {
    try {
      const feedbackData = await this.apiService.get<WorkoutFeedbackProps[]>(
        `${this.baseEndpoint}/workout-feedback/`
      );

      return feedbackData.map((data) => new WorkoutFeedback(data));
    } catch (error) {
      console.error('Error in getUserFeedback:', error);
      throw new Error('Failed to fetch user feedback');
    }
  }

  async updateFeedback(
    feedbackId: string,
    request: CreateWorkoutFeedbackRequest
  ): Promise<WorkoutFeedback> {
    try {
      const payload = {
        workout_id: request.workoutId,
        overall_rating: request.overallRating,
        difficulty_rating: request.difficultyRating,
        enjoyment_rating: request.enjoymentRating,
        what_liked: request.whatLiked || null,
        what_disliked: request.whatDisliked || null,
        improvements: request.improvements || null,
        would_recommend: request.wouldRecommend,
      };

      const updatedFeedback = await this.apiService.put<
        WorkoutFeedbackProps,
        Record<string, unknown>
      >(`${this.baseEndpoint}/workout-feedback/${feedbackId}/`, payload);

      return new WorkoutFeedback(updatedFeedback);
    } catch (error) {
      console.error('Error in updateFeedback:', error);
      throw new Error('Failed to update workout feedback');
    }
  }
}
