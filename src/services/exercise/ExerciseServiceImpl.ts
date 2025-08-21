import { Exercise, ExerciseProps } from '@/domain/entities/exercise';
import { ApiService } from '@/domain/interfaces/api/ApiService';
import { ExerciseService } from '@/domain/interfaces/services/ExerciseService';

interface ExerciseListResponse {
  generated_workout_id?: string;
  exercise_names: string[];
  exercises: ExerciseProps[];
}

export class ExerciseServiceImpl implements ExerciseService {
  private readonly apiService: ApiService;
  private readonly baseEndpoint = '/api/members/exercise-list';

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async getExercisesByGeneratedWorkoutId(
    generatedWorkoutId: string
  ): Promise<Exercise[]> {
    const response = await this.apiService.get<ExerciseListResponse>(
      `${this.baseEndpoint}/?generatedWorkoutId=${generatedWorkoutId}`
    );

    return response.exercises.map((data) => Exercise.fromApiResponse(data));
  }

  async getExercisesByWorkoutId(workoutId: string): Promise<Exercise[]> {
    const response = await this.apiService.get<ExerciseListResponse>(
      `${this.baseEndpoint}/?workoutId=${workoutId}`
    );

    return response.exercises.map((data) => Exercise.fromApiResponse(data));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getExerciseById(_exerciseId: string): Promise<Exercise | null> {
    // Note: The API documentation doesn't specify a single exercise endpoint
    // This method may need to be implemented differently or removed
    // For now, keeping it as a placeholder that throws an error
    throw new Error('getExerciseById is not implemented by the current API');
  }
}
