export const VALIDATION_MESSAGES = {
  // Quick Workout Setup - Focus & Energy Step
  ENERGY_REQUIRED: "Please select your energy level",
  FOCUS_REQUIRED: "Please select a workout focus",

  // Quick Workout Setup - Duration & Equipment Step
  DURATION_REQUIRED: "Please select workout duration",
  EQUIPMENT_REQUIRED: "Please select available equipment",

  // Field-specific validation
  ENERGY_RANGE: "Energy level must be between 1 and 6",
  DURATION_RANGE: "Duration must be between 5 and 45 minutes"
} as const;