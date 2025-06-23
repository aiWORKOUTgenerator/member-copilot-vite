/**
 * Represents a workout instance entity - an actual execution/logging of a generated workout
 */
export class WorkoutInstance {
  id: string;
  generatedWorkoutId: string; // Reference to the original generated workout template
  jsonFormat: WorkoutInstanceStructure | null;
  performedAt: string; // Date/time when the workout was performed
  duration?: number; // Actual duration in minutes
  notes?: string; // User's notes about the workout performance
  completed: boolean; // Whether the workout was completed
  createdAt: string;
  updatedAt: string;

  constructor(props: {
    id: string;
    generated_workout_id: string;
    json_format?: WorkoutInstanceStructure | null;
    performed_at: string;
    duration?: number;
    notes?: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
  }) {
    this.id = props.id;
    this.generatedWorkoutId = props.generated_workout_id;
    this.performedAt = props.performed_at;
    this.duration = props.duration;
    this.notes = props.notes;
    this.completed = props.completed;
    this.jsonFormat = props.json_format || null;
    this.createdAt = props.created_at;
    this.updatedAt = props.updated_at;
  }
}

// Import and re-export types from generatedWorkout for consistency
import { ExerciseType } from "./generatedWorkout";
export { ExerciseType };

// Enhanced interfaces for workout instances with actual performance data
export interface ExerciseInstance {
  name: string;
  description?: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  rest?: number;
  superset_exercise?: ExerciseInstance;
  // Instance-specific fields for actual performance
  completed?: boolean;
  notes?: string;
}

export interface SectionInstance {
  name: string;
  type: ExerciseType;
  exercises: ExerciseInstance[];
  rest_between_exercises?: number;
  rounds?: number;
  rest_between_rounds?: number;
  time_limit?: number;
  duration?: number;
  sub_sections?: SectionInstance[];
  // Instance-specific fields for actual performance
  completed?: boolean;
  notes?: string;
}

export interface WorkoutInstanceStructure {
  title: string;
  description: string;
  sections: SectionInstance[];
  rest_between_sections?: number;
  // Instance-specific fields for actual performance
  completed?: boolean;
  performance_notes?: string;
}
