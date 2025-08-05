export interface PerWorkoutOptions {
  customization_duration?: number | DurationConfigurationData;
  customization_equipment?: string[];
  customization_focus?: string;
  customization_energy?: number;
  customization_areas?: string[];
  customization_soreness?: string[];
  customization_stress?: number;
  customization_sleep?: number;
  customization_include?: string;
  customization_exclude?: string;
  // New field for quick workout focus selection
  customization_goal?: string; // "energizing_boost", "quick_sweat", etc.
}

// Interface for enhanced duration configurations with nested warm-up/cool-down structure
export interface DurationConfigurationData {
  selected: boolean;
  totalDuration: number;           // Total workout time in minutes
  label: string;                   // Display label (e.g., "45 min workout", "Standard Session + 5min warm-up")
  value: number;                   // Backend value (total duration for compatibility)
  description?: string;            // Rich description with structure details
  
  // Nested session structure configuration
  warmUp: {
    included: boolean;
    duration: number;              // Fixed time in minutes
    percentage?: number;           // Optional: percentage of total for advanced users
  };
  
  coolDown: {
    included: boolean;
    duration: number;              // Fixed time in minutes  
    percentage?: number;           // Optional: percentage of total for advanced users
  };
  
  workingTime: number;             // Auto-calculated: totalDuration - warmUp.duration - coolDown.duration
  
  // Metadata for intelligent display and parent communication
  configuration: 'duration-only' | 'with-warmup' | 'with-cooldown' | 'full-structure';
  
  // Smart validation and suggestions
  validation?: {
    isValid: boolean;
    warnings?: string[];           // Non-blocking suggestions
    errors?: string[];             // Blocking validation issues
  };
}

export interface CustomizationComponentProps<T = unknown> {
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  error?: string;
}

export interface WorkoutCustomizationProps {
  options: PerWorkoutOptions;
  onChange: (key: keyof PerWorkoutOptions, value: unknown) => void;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  disabled?: boolean;
  mode?: "detailed" | "quick";
  // Validation props for quick mode
  validateFocusAndEnergy?: (values: PerWorkoutOptions) => boolean;
  validateDurationAndEquipment?: (values: PerWorkoutOptions) => boolean;
  touchedFields?: Set<keyof PerWorkoutOptions>;
}


