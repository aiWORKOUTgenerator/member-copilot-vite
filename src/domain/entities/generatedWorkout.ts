/**
 * Represents a generated workout entity
 */
export class GeneratedWorkout {
  id: string;
  textFormat: string;
  jsonFormat: WorkoutStructure | null;
  simpleFormat: string | null;
  verySimpleFormat: string | null;
  createdAt: string;
  updatedAt: string;

  constructor(props: {
    id: string;
    text_format: string;
    json_format?: string | null;
    simple_format?: string | null;
    very_simple_format?: string | null;
    created_at: string;
    updated_at: string;
  }) {
    this.id = props.id;
    this.textFormat = props.text_format;
    this.simpleFormat = props.simple_format ?? null;
    this.verySimpleFormat = props.very_simple_format ?? null;
    this.jsonFormat = props.json_format
      ? (() => {
          try {
            return JSON.parse(props.json_format as string);
          } catch (error) {
            console.log("Error parsing JSON format:", error);
            return null;
          }
        })()
      : null;
    this.createdAt = props.created_at;
    this.updatedAt = props.updated_at;
  }
}

// Enum for exercise types
export enum ExerciseType {
  Standard = "Standard",
  Interval = "Interval",
  Circuit = "Circuit",
  AMRAP = "AMRAP",
  EMOM = "EMOM",
}

// Types based on the Pydantic models
export interface Exercise {
  name: string;
  description?: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  rest?: number;
  superset_exercise?: Exercise;
}

export interface Section {
  name: string;
  type: ExerciseType;
  exercises: Exercise[];
  rest_between_exercises?: number;
  rounds?: number;
  rest_between_rounds?: number;
  time_limit?: number;
  duration?: number;
  sub_sections?: Section[];
}

export interface WorkoutStructure {
  title: string;
  description: string;
  sections: Section[];
  rest_between_sections?: number;
}
