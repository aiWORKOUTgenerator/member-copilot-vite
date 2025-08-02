/**
 * Workout customization constants
 * 
 * This file contains all the options and configurations for workout customization,
 * including quick workout focus options, duration presets, and equipment choices.
 * These constants are used throughout the workout generation system to provide
 * consistent, user-friendly options for workout personalization.
 */

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

// Quick workout focus options for the enhanced setup
export const QUICK_WORKOUT_FOCUS_OPTIONS: WorkoutFocusOption[] = [
  {
    id: "energizing_boost",
    title: "Energizing Boost",
    description: "Get an energy boost to power through your day"
  },
  {
    id: "improve_posture",
    title: "Improve Posture", 
    description: "Relieve desk-related tension and improve alignment"
  },
  {
    id: "stress_reduction",
    title: "Stress Reduction",
    description: "Calm your mind and release tension"
  },
  {
    id: "quick_sweat",
    title: "Quick Sweat",
    description: "High-intensity calorie-burning workout"
  },
  {
    id: "gentle_recovery",
    title: "Gentle Recovery & Mobility",
    description: "Gentle stretching and mobility work for recovery"
  },
  {
    id: "core_abs",
    title: "Core & Abs Focus",
    description: "Target your core muscles for strength and stability"
  }
];

// Quick workout duration options
export const QUICK_WORKOUT_DURATION_OPTIONS: WorkoutDurationOption[] = [
  { id: "5", title: "5 min", description: "Micro Workout", subtitle: "Perfect for desk breaks" },
  { id: "10", title: "10 min", description: "Mini Session", subtitle: "Short but effective" },
  { id: "15", title: "15 min", description: "Express", subtitle: "Efficient workout" },
  { id: "20", title: "20 min", description: "Focused", subtitle: "Balanced duration" },
  { id: "30", title: "30 min", description: "Complete", subtitle: "Full workout experience" },
  { id: "45", title: "45 min", description: "Extended", subtitle: "Maximum benefit" }
];

// Quick workout equipment options
export const QUICK_WORKOUT_EQUIPMENT_OPTIONS: WorkoutEquipmentOption[] = [
  { id: "bodyweight", title: "Body Weight", description: "No equipment needed" },
  { id: "available_equipment", title: "Available Equipment", description: "Use what you have" },
  { id: "full_gym", title: "Full Gym", description: "All equipment available" }
];

// Energy level options for quick workout setup
export const ENERGY_LEVEL_OPTIONS = [
  {
    id: "1",
    title: "Very Low",
    description: "Extremely fatigued, struggling to stay awake, need rest"
  },
  {
    id: "2", 
    title: "Low",
    description: "Tired and sluggish, low motivation, minimal energy reserves"
  },
  {
    id: "3",
    title: "Moderate", 
    description: "Average energy, can perform daily activities comfortably"
  },
  {
    id: "4",
    title: "Somewhat High",
    description: "Feeling quite energetic, ready for moderate to challenging activities"
  },
  {
    id: "5",
    title: "High",
    description: "Feeling energetic and motivated, ready for challenging activities"
  },
  {
    id: "6",
    title: "Very High",
    description: "Peak energy, feeling powerful and ready for intense workouts"
  }
];

// Helper functions for working with constants
export const getWorkoutFocusById = (id: string): WorkoutFocusOption | undefined => {
  return QUICK_WORKOUT_FOCUS_OPTIONS.find(option => option.id === id);
};

export const getWorkoutDurationById = (id: string): WorkoutDurationOption | undefined => {
  return QUICK_WORKOUT_DURATION_OPTIONS.find(option => option.id === id);
};

export const getWorkoutEquipmentById = (id: string): WorkoutEquipmentOption | undefined => {
  return QUICK_WORKOUT_EQUIPMENT_OPTIONS.find(option => option.id === id);
};

export const getEnergyLevelById = (id: string) => {
  return ENERGY_LEVEL_OPTIONS.find(option => option.id === id);
}; 