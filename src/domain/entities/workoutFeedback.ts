/**
 * Represents a workout feedback entity with rating and text feedback fields
 */
export class WorkoutFeedback {
  id: string;
  workoutId: string;
  overallRating: number; // 1-5 scale
  difficultyRating: number; // 1-5 scale
  enjoymentRating: number; // 1-5 scale
  whatLiked?: string;
  whatDisliked?: string;
  improvements?: string;
  wouldRecommend: boolean;
  createdAt: string;
  updatedAt: string;

  constructor(props: {
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
  }) {
    this.id = props.id;
    this.workoutId = props.workout_id;
    this.overallRating = props.overall_rating;
    this.difficultyRating = props.difficulty_rating;
    this.enjoymentRating = props.enjoyment_rating;
    this.whatLiked = props.what_liked ?? undefined;
    this.whatDisliked = props.what_disliked ?? undefined;
    this.improvements = props.improvements ?? undefined;
    this.wouldRecommend = props.would_recommend;
    this.createdAt = props.created_at;
    this.updatedAt = props.updated_at;
  }
}

/**
 * Request interface for creating workout feedback
 */
export interface CreateWorkoutFeedbackRequest {
  workoutId: string;
  overallRating: number;
  difficultyRating: number;
  enjoymentRating: number;
  whatLiked?: string;
  whatDisliked?: string;
  improvements?: string;
  wouldRecommend: boolean;
}

/**
 * Validation helper for rating values
 */
export function isValidRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

/**
 * Validation helper for feedback request
 */
export function validateWorkoutFeedbackRequest(
  request: CreateWorkoutFeedbackRequest,
): string | null {
  if (!request.workoutId) {
    return "Workout ID is required";
  }

  if (!isValidRating(request.overallRating)) {
    return "Overall rating must be between 1 and 5";
  }

  if (!isValidRating(request.difficultyRating)) {
    return "Difficulty rating must be between 1 and 5";
  }

  if (!isValidRating(request.enjoymentRating)) {
    return "Enjoyment rating must be between 1 and 5";
  }

  if (typeof request.wouldRecommend !== "boolean") {
    return "Would recommend must be a boolean value";
  }

  return null;
}
