import { Exercise } from '@/domain/entities/exercise';

export interface ExerciseState {
  exercises: Exercise[];
  isLoading: boolean;
  error: string | null;
  isLoaded: boolean;
  refetch: () => Promise<void>;
}
