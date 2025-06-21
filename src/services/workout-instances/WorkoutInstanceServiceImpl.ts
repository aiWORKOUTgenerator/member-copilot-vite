import { WorkoutInstance } from "@/domain/entities/workoutInstance";
import { ApiService } from "@/domain/interfaces/api/ApiService";
import {
  WorkoutInstanceService,
  CreateWorkoutInstanceRequest,
  UpdateWorkoutInstanceRequest,
} from "@/domain/interfaces/services/WorkoutInstanceService";

interface WorkoutInstanceProps {
  id: string;
  generated_workout_id: string;
  json_format?: string | null;
  performed_at: string;
  duration?: number;
  notes?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export class WorkoutInstanceServiceImpl implements WorkoutInstanceService {
  readonly serviceName = "WorkoutInstanceService";
  private readonly apiService: ApiService;
  private readonly baseEndpoint = "/members";

  /**
   * Creates a new instance of WorkoutInstanceServiceImpl
   * @param apiService The API service to use for HTTP requests
   */
  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async getWorkoutInstances(): Promise<WorkoutInstance[]> {
    try {
      const workoutInstancesData = await this.apiService.get<
        WorkoutInstanceProps[]
      >(`${this.baseEndpoint}/workout-instances/`);

      return workoutInstancesData.map((data) => new WorkoutInstance(data));
    } catch (error) {
      console.error("Error in getWorkoutInstances:", error);
      throw new Error("Failed to fetch workout instances");
    }
  }

  async getWorkoutInstancesByGeneratedWorkoutId(
    generatedWorkoutId: string
  ): Promise<WorkoutInstance[]> {
    try {
      const workoutInstancesData = await this.apiService.get<
        WorkoutInstanceProps[]
      >(
        `${this.baseEndpoint}/workout-instances/?generated_workout_id=${generatedWorkoutId}`
      );

      return workoutInstancesData.map((data) => new WorkoutInstance(data));
    } catch (error) {
      console.error("Error in getWorkoutInstancesByGeneratedWorkoutId:", error);
      throw new Error(
        "Failed to fetch workout instances for generated workout"
      );
    }
  }

  async getWorkoutInstance(
    instanceId: string
  ): Promise<WorkoutInstance | null> {
    try {
      const workoutInstanceData =
        await this.apiService.get<WorkoutInstanceProps>(
          `${this.baseEndpoint}/workout-instances/${instanceId}/`
        );

      return new WorkoutInstance(workoutInstanceData);
    } catch (error) {
      console.error("Error in getWorkoutInstance:", error);
      // Return null if not found, throw for other errors
      if (error instanceof Error && error.message.includes("404")) {
        return null;
      }
      throw new Error("Failed to fetch workout instance");
    }
  }

  async createWorkoutInstance(
    request: CreateWorkoutInstanceRequest
  ): Promise<WorkoutInstance> {
    try {
      const payload = {
        generated_workout_id: request.generatedWorkoutId,
        performed_at: request.performedAt,
        duration: request.duration,
        notes: request.notes,
        completed: request.completed,
        json_format: request.jsonFormat,
      };

      const createdInstance = await this.apiService.post<
        WorkoutInstanceProps,
        Record<string, unknown>
      >(`${this.baseEndpoint}/workout-instances/`, payload);

      return new WorkoutInstance(createdInstance);
    } catch (error) {
      console.error("Error in createWorkoutInstance:", error);
      throw new Error("Failed to create workout instance");
    }
  }

  async updateWorkoutInstance(
    instanceId: string,
    request: UpdateWorkoutInstanceRequest
  ): Promise<WorkoutInstance> {
    try {
      const payload = {
        performed_at: request.performedAt,
        duration: request.duration,
        notes: request.notes,
        completed: request.completed,
        json_format: request.jsonFormat,
      };

      const updatedInstance = await this.apiService.put<
        WorkoutInstanceProps,
        Record<string, unknown>
      >(`${this.baseEndpoint}/workout-instances/${instanceId}/`, payload);

      return new WorkoutInstance(updatedInstance);
    } catch (error) {
      console.error("Error in updateWorkoutInstance:", error);
      throw new Error("Failed to update workout instance");
    }
  }

  async deleteWorkoutInstance(instanceId: string): Promise<void> {
    try {
      await this.apiService.delete(
        `${this.baseEndpoint}/workout-instances/${instanceId}/`
      );
    } catch (error) {
      console.error("Error in deleteWorkoutInstance:", error);
      throw new Error("Failed to delete workout instance");
    }
  }
}
