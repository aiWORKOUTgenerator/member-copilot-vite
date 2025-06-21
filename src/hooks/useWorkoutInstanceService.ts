import { WorkoutInstanceService } from "@/domain/interfaces/services/WorkoutInstanceService";
import { MockWorkoutInstanceService } from "@/services/workout-instances/MockWorkoutInstanceService";
import { useMemo } from "react";

export function useWorkoutInstanceService(): WorkoutInstanceService {
  const workoutInstanceService = useMemo(() => {
    return new MockWorkoutInstanceService();
  }, []);

  return workoutInstanceService;
}
