import { useApiService } from "@/contexts/ServiceContext";
import { WorkoutInstanceService } from "@/domain/interfaces/services/WorkoutInstanceService";
import { MockWorkoutInstanceService } from "@/services/workout-instances/MockWorkoutInstanceService";
import { WorkoutInstanceServiceImpl } from "@/services/workout-instances/WorkoutInstanceServiceImpl";
import { useMemo } from "react";

export function useWorkoutInstanceService(): WorkoutInstanceService {
  const apiService = useApiService();
  const workoutInstanceService = useMemo(() => {
    return new MockWorkoutInstanceService();
    return new WorkoutInstanceServiceImpl(apiService);
  }, [apiService]);

  return workoutInstanceService;
}
