import { WorkoutInstanceService } from "@/domain/interfaces/services/WorkoutInstanceService";
import { WorkoutInstanceServiceImpl } from "@/services/workout-instances/WorkoutInstanceServiceImpl";
import { MockWorkoutInstanceService } from "@/services/workout-instances/MockWorkoutInstanceService";
import { useMemo } from "react";
import { useApiService } from "@/hooks/useApiService";

// Environment variable to determine if we should use mock service
const USE_MOCK_SERVICE =
  import.meta.env.VITE_USE_MOCK_WORKOUT_INSTANCE_SERVICE === "true";

export function useWorkoutInstanceService(): WorkoutInstanceService {
  const apiService = useApiService();

  const workoutInstanceService = useMemo(() => {
    if (USE_MOCK_SERVICE) {
      return new MockWorkoutInstanceService();
    }
    return new WorkoutInstanceServiceImpl(apiService);
  }, [apiService]);

  return workoutInstanceService;
}
