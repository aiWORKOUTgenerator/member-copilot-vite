import { useState, useCallback, FormEvent } from "react";
import {
  CreateWorkoutFeedbackRequest,
  validateWorkoutFeedbackRequest,
} from "@/domain/entities/workoutFeedback";
import StarRating from "@/ui/shared/molecules/StarRating";

export interface WorkoutFeedbackFormProps {
  /** The workout ID to submit feedback for */
  workoutId: string;
  /** Callback when form is submitted successfully */
  onSubmit: (request: CreateWorkoutFeedbackRequest) => Promise<void>;
  /** Whether the form is currently submitting */
  isSubmitting?: boolean;
  /** Error message to display */
  error?: string | null;
  /** Callback when form is cancelled */
  onCancel?: () => void;
  /** Initial values for editing existing feedback */
  initialValues?: Partial<CreateWorkoutFeedbackRequest>;
}

interface FormData {
  overallRating: number;
  difficultyRating: number;
  enjoymentRating: number;
  whatLiked: string;
  whatDisliked: string;
  improvements: string;
  wouldRecommend: boolean;
}

export default function WorkoutFeedbackForm({
  workoutId,
  onSubmit,
  isSubmitting = false,
  error = null,
  onCancel,
  initialValues,
}: WorkoutFeedbackFormProps) {
  const [formData, setFormData] = useState<FormData>({
    overallRating: initialValues?.overallRating || 0,
    difficultyRating: initialValues?.difficultyRating || 0,
    enjoymentRating: initialValues?.enjoymentRating || 0,
    whatLiked: initialValues?.whatLiked || "",
    whatDisliked: initialValues?.whatDisliked || "",
    improvements: initialValues?.improvements || "",
    wouldRecommend: initialValues?.wouldRecommend || false,
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [hasChanges, setHasChanges] = useState(false);

  const updateFormData = useCallback(
    (field: keyof FormData, value: string | number | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setHasChanges(true);

      // Clear validation error for this field
      if (validationErrors[field]) {
        setValidationErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [validationErrors],
  );

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (formData.overallRating === 0) {
      errors.overallRating = "Please provide an overall rating";
    }
    if (formData.difficultyRating === 0) {
      errors.difficultyRating = "Please rate the workout difficulty";
    }
    if (formData.enjoymentRating === 0) {
      errors.enjoymentRating = "Please rate how much you enjoyed the workout";
    }

    const request: CreateWorkoutFeedbackRequest = {
      workoutId,
      overallRating: formData.overallRating,
      difficultyRating: formData.difficultyRating,
      enjoymentRating: formData.enjoymentRating,
      whatLiked: formData.whatLiked.trim() || undefined,
      whatDisliked: formData.whatDisliked.trim() || undefined,
      improvements: formData.improvements.trim() || undefined,
      wouldRecommend: formData.wouldRecommend,
    };

    const entityValidationError = validateWorkoutFeedbackRequest(request);
    if (entityValidationError) {
      errors.form = entityValidationError;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, workoutId]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      const request: CreateWorkoutFeedbackRequest = {
        workoutId,
        overallRating: formData.overallRating,
        difficultyRating: formData.difficultyRating,
        enjoymentRating: formData.enjoymentRating,
        whatLiked: formData.whatLiked.trim() || undefined,
        whatDisliked: formData.whatDisliked.trim() || undefined,
        improvements: formData.improvements.trim() || undefined,
        wouldRecommend: formData.wouldRecommend,
      };

      try {
        await onSubmit(request);
        setHasChanges(false);
      } catch {
        // Error handling is done by parent component
      }
    },
    [formData, workoutId, onSubmit, validateForm],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Overall Error Display */}
      {(error || validationErrors.form) && (
        <div className="alert alert-error">
          <span>{error || validationErrors.form}</span>
        </div>
      )}

      {/* Rating Sections */}
      <div className="space-y-4">
        <div className="border-b border-base-300 pb-3">
          <h3 className="text-base font-semibold text-base-content">
            Rate Your Workout
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Overall Rating */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-base-content">
              Overall Experience
            </label>
            <StarRating
              value={formData.overallRating}
              onChange={(rating) => updateFormData("overallRating", rating)}
              disabled={isSubmitting}
              showNumber
              label="Overall workout experience"
              size="sm"
            />
            {validationErrors.overallRating && (
              <p className="text-xs text-error">
                {validationErrors.overallRating}
              </p>
            )}
          </div>

          {/* Difficulty Rating */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-base-content">
              Difficulty Level
            </label>
            <StarRating
              value={formData.difficultyRating}
              onChange={(rating) => updateFormData("difficultyRating", rating)}
              disabled={isSubmitting}
              showNumber
              label="Workout difficulty level"
              size="sm"
            />
            {validationErrors.difficultyRating && (
              <p className="text-xs text-error">
                {validationErrors.difficultyRating}
              </p>
            )}
          </div>

          {/* Enjoyment Rating */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-base-content">
              Enjoyment
            </label>
            <StarRating
              value={formData.enjoymentRating}
              onChange={(rating) => updateFormData("enjoymentRating", rating)}
              disabled={isSubmitting}
              showNumber
              label="How much you enjoyed the workout"
              size="sm"
            />
            {validationErrors.enjoymentRating && (
              <p className="text-xs text-error">
                {validationErrors.enjoymentRating}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Text Feedback Sections */}
      <div className="space-y-4">
        <div className="border-b border-base-300 pb-3">
          <h3 className="text-base font-semibold text-base-content">
            Share Your Thoughts
            <span className="ml-2 text-sm font-normal text-base-content/60">
              (Optional)
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* What Liked */}
          <div className="space-y-1">
            <label
              htmlFor="what-liked"
              className="block text-sm font-medium text-base-content"
            >
              What you liked
            </label>
            <textarea
              id="what-liked"
              className="textarea textarea-bordered textarea-sm w-full"
              placeholder="What you enjoyed..."
              rows={2}
              value={formData.whatLiked}
              onChange={(e) => updateFormData("whatLiked", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* What Disliked */}
          <div className="space-y-1">
            <label
              htmlFor="what-disliked"
              className="block text-sm font-medium text-base-content"
            >
              Could be improved
            </label>
            <textarea
              id="what-disliked"
              className="textarea textarea-bordered textarea-sm w-full"
              placeholder="Areas for improvement..."
              rows={2}
              value={formData.whatDisliked}
              onChange={(e) => updateFormData("whatDisliked", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Improvements */}
          <div className="space-y-1">
            <label
              htmlFor="improvements"
              className="block text-sm font-medium text-base-content"
            >
              Future suggestions
            </label>
            <textarea
              id="improvements"
              className="textarea textarea-bordered textarea-sm w-full"
              placeholder="Ideas for future workouts..."
              rows={2}
              value={formData.improvements}
              onChange={(e) => updateFormData("improvements", e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <input
            id="would-recommend"
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={formData.wouldRecommend}
            onChange={(e) => updateFormData("wouldRecommend", e.target.checked)}
            disabled={isSubmitting}
          />
          <label
            htmlFor="would-recommend"
            className="text-sm font-medium text-base-content cursor-pointer"
          >
            I would recommend this workout to others
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-base-300">
        {onCancel && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          disabled={isSubmitting || (!hasChanges && !initialValues)}
        >
          {isSubmitting && (
            <span className="loading loading-spinner loading-xs"></span>
          )}
          {initialValues ? "Update Feedback" : "Submit Feedback"}
        </button>
      </div>
    </form>
  );
}
