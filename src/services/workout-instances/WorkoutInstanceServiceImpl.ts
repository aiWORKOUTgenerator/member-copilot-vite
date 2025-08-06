import {
  WorkoutInstance,
  WorkoutInstanceStructure,
} from '@/domain/entities/workoutInstance';
import { ApiService } from '@/domain/interfaces/api/ApiService';
import {
  WorkoutInstanceService,
  CreateWorkoutInstanceRequest,
  UpdateWorkoutInstanceRequest,
  RecommendedExercise,
} from '@/domain/interfaces/services/WorkoutInstanceService';

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
  readonly serviceName = 'WorkoutInstanceService';
  private readonly apiService: ApiService;
  private readonly baseEndpoint = '/members';

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
      console.error('Error in getWorkoutInstances:', error);
      throw new Error('Failed to fetch workout instances');
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
      console.error('Error in getWorkoutInstancesByGeneratedWorkoutId:', error);
      throw new Error(
        'Failed to fetch workout instances for generated workout'
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
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }

      console.error('Error in getWorkoutInstance:', error);
      throw new Error('Failed to fetch workout instance');
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
      console.error('Error in createWorkoutInstance:', error);
      throw new Error('Failed to create workout instance');
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
      console.error('Error in updateWorkoutInstance:', error);
      throw new Error('Failed to update workout instance');
    }
  }

  async deleteWorkoutInstance(instanceId: string): Promise<void> {
    try {
      await this.apiService.delete(
        `${this.baseEndpoint}/workout-instances/${instanceId}/`
      );
    } catch (error) {
      console.error('Error in deleteWorkoutInstance:', error);
      throw new Error('Failed to delete workout instance');
    }
  }

  async getExerciseRecommendations(
    instanceId: string,
    exerciseName: string,
    reason?: string,
    preferences?: string[]
  ): Promise<RecommendedExercise[]> {
    try {
      interface ExerciseAlternativesRequest extends Record<string, unknown> {
        exercise_name: string;
        reason?: string;
        preferences?: string[];
      }

      interface ExerciseAlternativesResponse {
        message: string;
        instance_id: string;
        exercise_name: string;
        original_exercise: Record<string, unknown>;
        alternatives: Array<{
          name: string;
          description: string;
          sets?: number;
          reps?: number;
          weight?: number;
          duration?: number;
          rest?: number;
          reason?: string;
          targetMuscles?: string[];
          difficulty?: string;
          equipment?: string[];
        }>;
        generated_at: string;
      }

      const requestBody: ExerciseAlternativesRequest = {
        exercise_name: exerciseName,
      };

      if (reason) {
        requestBody.reason = reason;
      }

      if (preferences && preferences.length > 0) {
        requestBody.preferences = preferences;
      }

      const response = await this.apiService.post<
        ExerciseAlternativesResponse,
        ExerciseAlternativesRequest
      >(
        `${this.baseEndpoint}/workout-instances/${instanceId}/exercise-alternatives/`,
        requestBody
      );

      // Transform the response to match our RecommendedExercise interface
      return response.alternatives.map((alternative, index) => ({
        id: `alternative-${instanceId}-${index}`,
        name: alternative.name,
        description: alternative.description,
        sets: alternative.sets,
        reps: alternative.reps,
        weight: alternative.weight,
        duration: alternative.duration,
        rest: alternative.rest,
        targetMuscles: alternative.targetMuscles || [],
        difficulty: alternative.difficulty || 'Beginner',
        equipment: alternative.equipment || [],
      }));
    } catch (error) {
      console.error('Error in getExerciseRecommendations:', error);

      // Fallback to mock data for development
      return [
        {
          id: 'fallback-1',
          name: 'Push-ups',
          description:
            'Classic bodyweight chest exercise that targets the same muscles',
          sets: 3,
          reps: 15,
          targetMuscles: ['Chest', 'Triceps', 'Shoulders'],
          difficulty: 'Beginner',
          rest: 60,
        },
        {
          id: 'fallback-2',
          name: 'Modified Version',
          description: `A modified version of ${exerciseName} with adjusted parameters`,
          sets: 2,
          reps: 8,
          weight: 5,
          targetMuscles: ['Full Body'],
          difficulty: 'Beginner',
          rest: 60,
        },
      ];
    }
  }
}
