import {
  WorkoutInstance,
  WorkoutInstanceStructure,
} from "@/domain/entities/workoutInstance";
import { ApiService } from "@/domain/interfaces/api/ApiService";
import {
  WorkoutInstanceService,
  CreateWorkoutInstanceRequest,
  UpdateWorkoutInstanceRequest,
} from "@/domain/interfaces/services/WorkoutInstanceService";

interface WorkoutInstanceProps {
  id: string;
  generated_workout_id: string;
  json_format?: WorkoutInstanceStructure | null;
  performed_at: string;
  duration?: number;
  notes?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateWorkoutInstancePayload extends Record<string, unknown> {
  generated_workout_id: string;
  performed_at: string;
  duration?: number;
  notes?: string;
  completed: boolean;
  json_format?: WorkoutInstanceStructure;
}

interface UpdateWorkoutInstancePayload extends Record<string, unknown> {
  performed_at?: string;
  duration?: number;
  notes?: string;
  completed?: boolean;
  json_format?: WorkoutInstanceStructure;
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

      return workoutInstancesData
        .map((data) => new WorkoutInstance(data))
        .sort(
          (a, b) =>
            new Date(b.performedAt).getTime() -
            new Date(a.performedAt).getTime()
        );
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

      return workoutInstancesData
        .map((data) => new WorkoutInstance(data))
        .sort(
          (a, b) =>
            new Date(b.performedAt).getTime() -
            new Date(a.performedAt).getTime()
        );
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
      // If it's a 404, return null as expected by the interface
      if (error instanceof Error && error.message.includes("404")) {
        return null;
      }

      console.error("Error in getWorkoutInstance:", error);
      throw new Error("Failed to fetch workout instance");
    }
  }

  async createWorkoutInstance(
    request: CreateWorkoutInstanceRequest
  ): Promise<WorkoutInstance> {
    try {
      const payload: CreateWorkoutInstancePayload = {
        generated_workout_id: request.generatedWorkoutId,
        performed_at: request.performedAt,
        duration: request.duration,
        notes: request.notes,
        completed: request.completed,
        json_format: request.jsonFormat,
      };

      const createdWorkoutInstance = await this.apiService.post<
        WorkoutInstanceProps,
        CreateWorkoutInstancePayload
      >(`${this.baseEndpoint}/workout-instances/`, payload);

      return new WorkoutInstance(createdWorkoutInstance);
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
      const payload: UpdateWorkoutInstancePayload = {
        performed_at: request.performedAt,
        duration: request.duration,
        notes: request.notes,
        completed: request.completed,
        json_format: request.jsonFormat,
      };

      // Remove undefined values from payload
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined)
      );

      const updatedWorkoutInstance = await this.apiService.put<
        WorkoutInstanceProps,
        Partial<UpdateWorkoutInstancePayload>
      >(`${this.baseEndpoint}/workout-instances/${instanceId}/`, cleanPayload);

      return new WorkoutInstance(updatedWorkoutInstance);
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
