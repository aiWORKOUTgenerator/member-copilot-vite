import { GeneratedWorkout } from '@/domain/entities/generatedWorkout';
import { WorkoutParams } from '@/domain/entities/workoutParams';

export interface GeneratedWorkoutService {
  getGeneratedWorkouts(): Promise<GeneratedWorkout[]>;
  createGeneratedWorkout(
    configId: string,
    workoutParams: WorkoutParams,
    prompt: string
  ): Promise<GeneratedWorkout>;
}
