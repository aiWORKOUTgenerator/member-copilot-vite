/**
 * Workout customization constants
 *
 * This file contains all the options and configurations for workout customization,
 * including quick workout focus options, duration presets, equipment choices, and routes.
 * These constants are used throughout the workout generation system to provide
 * consistent, user-friendly options for workout personalization.
 */

// Route constants for workout generation
export const WORKOUTS_GENERATE_ROUTE = '/dashboard/workouts/generate';

export interface WorkoutFocusOption {
  id: string;
  title: string;
  description: string;
}

export interface WorkoutDurationOption {
  id: string;
  title: string;
  description: string;
  subtitle: string;
}

export interface WorkoutEquipmentOption {
  id: string;
  title: string;
  description: string;
}

export interface EnergyLevelOption {
  id: string;
  title: string;
  description: string;
}

// Quick workout focus options for the enhanced setup
export const QUICK_WORKOUT_FOCUS_OPTIONS: WorkoutFocusOption[] = [
  {
    id: 'energizing_boost',
    title: 'Energizing Boost',
    description: 'Get an energy boost to power through your day',
  },
  {
    id: 'improve_posture',
    title: 'Improve Posture',
    description: 'Relieve desk-related tension and improve alignment',
  },
  {
    id: 'stress_reduction',
    title: 'Stress Reduction',
    description: 'Calm your mind and release tension',
  },
  {
    id: 'quick_sweat',
    title: 'Quick Sweat',
    description: 'High-intensity calorie-burning workout',
  },
  {
    id: 'gentle_recovery',
    title: 'Gentle Recovery & Mobility',
    description: 'Gentle stretching and mobility work for recovery',
  },
  {
    id: 'core_abs',
    title: 'Core & Abs Focus',
    description: 'Target your core muscles for strength and stability',
  },
];

// Quick workout duration options
export const QUICK_WORKOUT_DURATION_OPTIONS: WorkoutDurationOption[] = [
  {
    id: '5',
    title: '5 min',
    description: 'Micro Workout',
    subtitle: 'Perfect for desk breaks',
  },
  {
    id: '10',
    title: '10 min',
    description: 'Mini Session',
    subtitle: 'Short but effective',
  },
  {
    id: '15',
    title: '15 min',
    description: 'Express',
    subtitle: 'Efficient workout',
  },
  {
    id: '20',
    title: '20 min',
    description: 'Focused',
    subtitle: 'Balanced duration',
  },
  {
    id: '30',
    title: '30 min',
    description: 'Complete',
    subtitle: 'Full workout experience',
  },
  {
    id: '45',
    title: '45 min',
    description: 'Extended',
    subtitle: 'Maximum benefit',
  },
];

// Detailed workout focus options - session intent-based for comprehensive customization
export const DETAILED_WORKOUT_FOCUS_OPTIONS: WorkoutFocusOption[] = [
  {
    id: 'general_fitness_maintenance',
    title: 'General Fitness Maintenance',
    description:
      'A balanced session to support overall health, movement, and energy',
  },
  {
    id: 'strength_power_development',
    title: 'Strength & Power Development',
    description:
      'Focus on building maximal force and explosive movement through resistance',
  },
  {
    id: 'muscle_building_hypertrophy',
    title: 'Muscle Building (Hypertrophy)',
    description:
      'Targeted muscle development using moderate-to-high volume training',
  },
  {
    id: 'endurance_conditioning',
    title: 'Endurance & Conditioning',
    description:
      'Improve cardiovascular fitness, stamina, and muscular endurance',
  },
  {
    id: 'mobility_movement_quality',
    title: 'Mobility & Movement Quality',
    description:
      'Emphasize joint range of motion, control, and injury resilience',
  },
  {
    id: 'recovery_restoration',
    title: 'Recovery & Restoration',
    description:
      'Gentle, supportive movement to aid recovery, reduce tension, and restore balance',
  },
];

// Detailed workout duration options - broader range for comprehensive customization
export const DETAILED_WORKOUT_DURATION_OPTIONS: WorkoutDurationOption[] = [
  {
    id: '20',
    title: '20 min',
    description:
      'HIIT, mobility flows, EMOM/AMRAP circuits, bodyweight conditioning',
    subtitle: 'Great for low-energy days, warm-ups, or time-crunched routines',
  },
  {
    id: '30',
    title: '30 min',
    description:
      'Full-body dumbbell or kettlebell workouts, short cardio/strength combos',
    subtitle: 'Efficient option for consistency and busy users',
  },
  {
    id: '45',
    title: '45 min',
    description:
      'Balanced strength splits, cardio intervals + accessory work, functional circuits',
    subtitle: 'Sweet spot for general fitness – warm-up to cool-down included',
  },
  {
    id: '60',
    title: '60 min',
    description:
      'Hypertrophy splits, strength + cardio combos, skill practice + accessories',
    subtitle: 'Traditional full training session; good rest-to-work balance',
  },
  {
    id: '75',
    title: '75 min',
    description:
      'Powerbuilding, Olympic lift work, strength splits with long rest, mobility + core work',
    subtitle: 'Advanced sessions with more complexity or mixed modalities',
  },
  {
    id: '90',
    title: '90 min',
    description:
      'Full powerlifting splits, CrossFit WOD + skill blocks, athlete-specific periodization',
    subtitle:
      'Rare use—advanced or competitive athletes needing full recovery blocks',
  },
];

// Quick workout equipment options
export const QUICK_WORKOUT_EQUIPMENT_OPTIONS: WorkoutEquipmentOption[] = [
  {
    id: 'bodyweight',
    title: 'Body Weight',
    description: 'No equipment needed',
  },
  {
    id: 'available_equipment',
    title: 'Available Equipment',
    description: 'Use what you have',
  },
  { id: 'full_gym', title: 'Full Gym', description: 'All equipment available' },
];

// Valid equipment IDs for validation
export const VALID_EQUIPMENT_IDS = QUICK_WORKOUT_EQUIPMENT_OPTIONS.map(
  (option) => option.id
) as readonly string[];

// Energy level options for quick workout setup
export const ENERGY_LEVEL_OPTIONS: EnergyLevelOption[] = [
  {
    id: '1',
    title: 'Very Low',
    description: 'Extremely fatigued, struggling to stay awake, need rest',
  },
  {
    id: '2',
    title: 'Low',
    description: 'Tired and sluggish, low motivation, minimal energy reserves',
  },
  {
    id: '3',
    title: 'Moderate',
    description: 'Average energy, can perform daily activities comfortably',
  },
  {
    id: '4',
    title: 'Somewhat High',
    description:
      'Feeling quite energetic, ready for moderate to challenging activities',
  },
  {
    id: '5',
    title: 'High',
    description:
      'Feeling energetic and motivated, ready for challenging activities',
  },
  {
    id: '6',
    title: 'Very High',
    description: 'Peak energy, feeling powerful and ready for intense workouts',
  },
];

// Helper functions for working with constants
export const getWorkoutFocusById = (
  id: string
): WorkoutFocusOption | undefined => {
  return QUICK_WORKOUT_FOCUS_OPTIONS.find((option) => option.id === id);
};

export const getDetailedWorkoutFocusById = (
  id: string
): WorkoutFocusOption | undefined => {
  return DETAILED_WORKOUT_FOCUS_OPTIONS.find((option) => option.id === id);
};

export const getWorkoutDurationById = (
  id: string
): WorkoutDurationOption | undefined => {
  return QUICK_WORKOUT_DURATION_OPTIONS.find((option) => option.id === id);
};

export const getWorkoutEquipmentById = (
  id: string
): WorkoutEquipmentOption | undefined => {
  return QUICK_WORKOUT_EQUIPMENT_OPTIONS.find((option) => option.id === id);
};

export const getEnergyLevelById = (
  id: string
): EnergyLevelOption | undefined => {
  return ENERGY_LEVEL_OPTIONS.find((option) => option.id === id);
};

// New interfaces for detailed workout setup
export interface FocusAreaOption {
  value: string;
  label: string;
}

export interface SleepQualityOption {
  value: number;
  label: string;
  description: string;
}

export interface StressLevelOption {
  value: number;
  label: string;
  description: string;
}

export interface SorenessAreaOption {
  value: string;
  label: string;
}

// Focus area options for detailed setup
export const FOCUS_AREA_OPTIONS: FocusAreaOption[] = [
  { value: 'full_body', label: 'Full Body' },
  { value: 'upper_body', label: 'Upper Body' },
  { value: 'lower_body', label: 'Lower Body' },
  { value: 'core', label: 'Core' },
  { value: 'chest_triceps', label: 'Chest & Triceps (Push Focus)' },
  { value: 'back_biceps', label: 'Back & Biceps (Pull Focus)' },
  { value: 'legs', label: 'Legs' },
  { value: 'shoulders_arms', label: 'Shoulders & Arms' },
  { value: 'push', label: 'Push (Chest, Shoulders, Triceps)' },
  { value: 'pull', label: 'Pull (Back, Biceps)' },
  { value: 'chest_back', label: 'Chest & Back' },
  { value: 'arms_only', label: 'Arms Only' },
];

// Sleep quality options (1-6 scale)
export const SLEEP_QUALITY_OPTIONS: SleepQualityOption[] = [
  { value: 1, label: 'Very Poor', description: 'Barely slept, very tired' },
  { value: 2, label: 'Poor', description: 'Restless sleep, feeling tired' },
  { value: 3, label: 'Fair', description: 'Decent sleep, somewhat rested' },
  { value: 4, label: 'Good', description: 'Solid sleep, feeling rested' },
  {
    value: 5,
    label: 'Very Good',
    description: 'Great sleep, feeling refreshed',
  },
  {
    value: 6,
    label: 'Excellent',
    description: 'Perfect sleep, fully energized',
  },
];

// Stress level options (1-6 scale)
export const STRESS_LEVEL_OPTIONS: StressLevelOption[] = [
  { value: 1, label: 'Very Low', description: 'Calm and relaxed' },
  { value: 2, label: 'Low', description: 'Mostly relaxed with minor concerns' },
  { value: 3, label: 'Moderate', description: 'Some stress, manageable' },
  { value: 4, label: 'High', description: 'Feeling stressed and tense' },
  {
    value: 5,
    label: 'Very High',
    description: 'Quite stressed and overwhelmed',
  },
  {
    value: 6,
    label: 'Extreme',
    description: 'Extremely stressed, need immediate relief',
  },
];

// Soreness area options - 12 intuitive areas that 90% of gym-goers recognize
export const SORENESS_AREA_OPTIONS: SorenessAreaOption[] = [
  { value: 'neck_shoulders', label: 'Neck & Shoulders' },
  { value: 'upper_back', label: 'Upper Back' },
  { value: 'lower_back', label: 'Lower Back' },
  { value: 'chest', label: 'Chest' },
  { value: 'arms_biceps_triceps', label: 'Arms (Biceps & Triceps)' },
  { value: 'forearms', label: 'Forearms' },
  { value: 'core', label: 'Core' },
  { value: 'glutes', label: 'Glutes' },
  { value: 'quads', label: 'Quadriceps' },
  { value: 'hamstrings', label: 'Hamstrings' },
  { value: 'adductors', label: 'Adductors (Inner Thighs)' },
  { value: 'calves', label: 'Calves' },
];

// Helper functions for detailed workout options
export const getFocusAreaByValue = (
  value: string
): FocusAreaOption | undefined => {
  return FOCUS_AREA_OPTIONS.find((option) => option.value === value);
};

export const getSleepQualityByValue = (
  value: number
): SleepQualityOption | undefined => {
  return SLEEP_QUALITY_OPTIONS.find((option) => option.value === value);
};

export const getStressLevelByValue = (
  value: number
): StressLevelOption | undefined => {
  return STRESS_LEVEL_OPTIONS.find((option) => option.value === value);
};

export const getSorenessAreaByValue = (
  value: string
): SorenessAreaOption | undefined => {
  return SORENESS_AREA_OPTIONS.find((option) => option.value === value);
};
