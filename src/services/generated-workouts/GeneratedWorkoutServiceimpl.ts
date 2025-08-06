import { GeneratedWorkout } from '@/domain/entities/generatedWorkout';
import { WorkoutParams } from '@/domain/entities/workoutParams';
import { ApiService } from '@/domain/interfaces/api/ApiService';
import { GeneratedWorkoutService } from '@/domain/interfaces/services/GeneratedWorkoutService';

interface GeneratedWorkoutProps {
  id: string;
  text_format: string;
  json_format?: string | null;
  simple_format?: string | null;
  created_at: string;
  updated_at: string;
}

export class GeneratedWorkoutServiceImpl implements GeneratedWorkoutService {
  readonly serviceName = 'GeneratedWorkoutService';
  private readonly apiService: ApiService;
  private readonly baseEndpoint = '/members';

  /**
   * Creates a new instance of PromptServiceImpl
   * @param apiService The API service to use for HTTP requests
   */
  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async getGeneratedWorkouts(): Promise<GeneratedWorkout[]> {
    try {
      const generatedWorkoutsData = await this.apiService.get<
        GeneratedWorkoutProps[]
      >(`${this.baseEndpoint}/generated-workouts/`);

      return generatedWorkoutsData.map((data) => new GeneratedWorkout(data));
    } catch (error) {
      console.error('Error in getGeneratedWorkouts:', error);
      throw new Error('Failed to fetch generated workouts');
    }
  }

  /**
   * Creates a new generated workout
   * @param configId The workout configuration ID
   * @param workoutParams The workout parameters
   * @param prompt The user's prompt describing the workout
   * @returns Promise resolving to the created GeneratedWorkout
   */
  async createGeneratedWorkout(
    configId: string,
    workoutParams: WorkoutParams,
    prompt: string
  ): Promise<GeneratedWorkout> {
    try {
      interface WorkoutResponse {
        id: string;
        text_format: string;
        json_format: string;
        created_at: string;
        updated_at: string;
      }

      const payload = {
        workout_configuration: configId,
        workout_params: workoutParams,
        prompt: prompt,
      };

      const createdWorkout = await this.apiService.post<
        WorkoutResponse,
        Record<string, unknown>
      >(`${this.baseEndpoint}/generated-workouts/`, payload);

      return new GeneratedWorkout(createdWorkout);
    } catch (error) {
      console.error('Error in createGeneratedWorkout:', error);
      throw new Error('Failed to create generated workout');
    }
  }
}
