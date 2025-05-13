export enum WorkoutType {
  STRENGTH = "Strength",
  CARDIO = "Cardio",
  HIIT = "HIIT",
  FLEXIBILITY = "Flexibility",
  RECOVERY = "Recovery",
}

export enum WorkoutStructure {
  TRADITIONAL = "Traditional (Reps x Sets)",
  CIRCUIT = "Circuit",
  SUPERSET = "Superset",
  AMRAP = "AMRAP",
  EMOM = "EMOM",
}

export interface WorkoutParams {
  workoutType?: WorkoutType;
  workoutStructure?: WorkoutStructure;
  restBetweenSets?: number; // in seconds
  targetMuscleGroups?: string;
  includeExercises?: string;
  excludeExercises?: string;
}
