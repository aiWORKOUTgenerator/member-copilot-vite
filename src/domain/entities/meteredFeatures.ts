/**
 * Enum representing available metered features in the application.
 * These are keys used to identify different usage meters for tracking limits.
 */
export enum MeteredFeature {
  /**
   * Tracks the number of workout plans generated.
   */
  WORKOUTS_GENERATED = "workouts_generated",

  /**
   * Tracks the number of AI-driven profile generations.
   */
  PROFILE_AI_GENERATIONS = "profile_ai_generations",

  /**
   * Tracks the number of stored workouts a user can access.
   */
  STORED_WORKOUTS = "workouts_stored",
}

/**
 * Function to check if a string is a valid metered feature.
 * Useful for validation.
 */
export function isValidMeteredFeature(value: string): value is MeteredFeature {
  return Object.values(MeteredFeature).includes(value as MeteredFeature);
}
