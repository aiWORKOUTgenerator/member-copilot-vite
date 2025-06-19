import { WorkoutFeedbackService } from "@/domain/interfaces/services/WorkoutFeedbackService";
import { WorkoutFeedbackServiceImpl } from "@/services/workout-feedback/WorkoutFeedbackServiceImpl";
import { MockWorkoutFeedbackService } from "@/services/workout-feedback/MockWorkoutFeedbackService";
import { useMemo } from "react";
import { useApiService } from "@/hooks/useApiService";

// Environment variable to determine if we should use mock service
const USE_MOCK_SERVICE =
  import.meta.env.VITE_USE_MOCK_FEEDBACK_SERVICE === "true";

export function useWorkoutFeedbackService(): WorkoutFeedbackService {
  const apiService = useApiService();

  const workoutFeedbackService = useMemo(() => {
    if (USE_MOCK_SERVICE) {
      return new MockWorkoutFeedbackService();
    }
    return new WorkoutFeedbackServiceImpl(apiService);
  }, [apiService]);

  return workoutFeedbackService;
}
