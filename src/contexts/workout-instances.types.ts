import { WorkoutInstance } from '@/domain/entities/workoutInstance';
import { CreateWorkoutInstanceRequest } from '@/domain/interfaces/services/WorkoutInstanceService';

/**
 * WorkoutInstancesState interface for managing the list of workout instances
 */
export interface WorkoutInstancesState {
  instances: WorkoutInstance[];
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
  createInstance: (
    request: CreateWorkoutInstanceRequest
  ) => Promise<WorkoutInstance>;
  updateInstanceInList: (updatedInstance: WorkoutInstance) => void;
  getInstancesByGeneratedWorkoutId: (
    generatedWorkoutId: string
  ) => WorkoutInstance[];
}
