import {
  WorkoutInstance,
  WorkoutInstanceStructure,
} from "@/domain/entities/workoutInstance";

export interface RecommendedExercise {
  id: string;
  name: string;
  description: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  rest?: number;
  targetMuscles: string[];
  difficulty: string;
  equipment?: string[];
}

export interface GetExerciseRecommendationsRequest
  extends Record<string, unknown> {
  currentExercise: {
    name: string;
    description?: string;
    sets?: number;
    reps?: number;
    weight?: number;
    duration?: number;
  };
}

export interface CreateWorkoutInstanceRequest {
  generatedWorkoutId: string;
  performedAt: string;
  duration?: number;
  notes?: string;
  completed: boolean;
  jsonFormat?: WorkoutInstanceStructure;
}

export interface UpdateWorkoutInstanceRequest {
  performedAt?: string;
  duration?: number;
  notes?: string;
  completed?: boolean;
  jsonFormat?: WorkoutInstanceStructure;
}

export interface WorkoutInstanceService {
  /**
   * Get all workout instances for the current user
   * @returns Promise resolving to array of WorkoutInstance
   */
  getWorkoutInstances(): Promise<WorkoutInstance[]>;

  /**
   * Get workout instances for a specific generated workout
   * @param generatedWorkoutId The ID of the generated workout template
   * @returns Promise resolving to array of WorkoutInstance
   */
  getWorkoutInstancesByGeneratedWorkoutId(
    generatedWorkoutId: string
  ): Promise<WorkoutInstance[]>;

  /**
   * Get a specific workout instance by ID
   * @param instanceId The ID of the workout instance
   * @returns Promise resolving to WorkoutInstance or null if not found
   */
  getWorkoutInstance(instanceId: string): Promise<WorkoutInstance | null>;

  /**
   * Create a new workout instance
   * @param request The workout instance data to create
   * @returns Promise resolving to the created WorkoutInstance
   */
  createWorkoutInstance(
    request: CreateWorkoutInstanceRequest
  ): Promise<WorkoutInstance>;

  /**
   * Update an existing workout instance
   * @param instanceId The ID of the workout instance to update
   * @param request The updated workout instance data
   * @returns Promise resolving to the updated WorkoutInstance
   */
  updateWorkoutInstance(
    instanceId: string,
    request: UpdateWorkoutInstanceRequest
  ): Promise<WorkoutInstance>;

  /**
   * Delete a workout instance
   * @param instanceId The ID of the workout instance to delete
   * @returns Promise resolving to void
   */
  deleteWorkoutInstance(instanceId: string): Promise<void>;

  /**
   * Get AI-powered exercise recommendations based on a current exercise
   * @param request The current exercise data to get recommendations for
   * @returns Promise resolving to array of RecommendedExercise
   */
  getExerciseRecommendations(
    request: GetExerciseRecommendationsRequest
  ): Promise<RecommendedExercise[]>;
}
