export const VALIDATION_MESSAGES = {
  // Workout customization validation messages
  REQUIRED_FIELD: 'This field is required',
  INVALID_DURATION: 'Please select a valid duration',
  INVALID_EQUIPMENT: 'Please select available equipment',
  INVALID_GOAL: 'Please select a workout goal',
  INVALID_ENERGY: 'Please select your energy level',

  // General validation messages
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be no more than ${max} characters`,
  INVALID_FORMAT: 'Invalid format',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',

  // Workout specific messages
  WORKOUT_NOT_FOUND: 'Workout not found',
  WORKOUT_ALREADY_STARTED: 'Workout has already been started',
  WORKOUT_COMPLETED: 'Workout has been completed',
  INVALID_WORKOUT_STATE: 'Invalid workout state',

  // Equipment validation
  EQUIPMENT_REQUIRED: 'Please select at least one piece of equipment',
  EQUIPMENT_NOT_AVAILABLE: 'Selected equipment is not available',

  // Duration validation
  DURATION_TOO_SHORT: 'Workout duration is too short',
  DURATION_TOO_LONG: 'Workout duration is too long',

  // Goal validation
  GOAL_REQUIRED: 'Please select a workout goal',
  FOCUS_REQUIRED: 'Please select a workout focus',
  INVALID_GOAL_COMBINATION: 'Selected goals are not compatible',

  // Energy level validation
  ENERGY_REQUIRED: 'Please select your current energy level',
  INVALID_ENERGY_LEVEL: 'Please select a valid energy level',
  ENERGY_RANGE: 'Energy level must be between 1 and 6',

  // Duration validation
  DURATION_RANGE: 'Duration must be between 5 and 300 minutes',
} as const;
