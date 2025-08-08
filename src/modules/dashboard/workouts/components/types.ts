export interface PerWorkoutOptions {
  customization_duration?: number | DurationConfigurationData;
  customization_equipment?: string[] | EquipmentSelectionData;
  customization_focus?: string | WorkoutFocusConfigurationData;
  customization_energy?: number;
  customization_areas?: string[] | HierarchicalSelectionData;
  customization_soreness?: CategoryRatingData;
  customization_stress?: CategoryRatingData;
  customization_sleep?: number;
  customization_include?: string;
  customization_exclude?: string;
  // New field for quick workout focus selection
  customization_goal?: string; // "energizing_boost", "quick_sweat", etc.
}

// Unified interface for category-based customizations with rating scales
export interface CategoryRatingData {
  [categoryKey: string]: {
    selected: boolean;
    rating?: number; // 1-5 scale
    label: string; // Human-readable category name
    description?: string; // Category description
  };
}

// Enhanced equipment selection data structure for 4-tier progressive disclosure
export interface EquipmentSelectionData {
  location?: string; // Selected workout location
  contexts: string[]; // Selected equipment contexts
  specificEquipment: string[]; // Individual equipment items
  weights?: { [equipmentType: string]: number[] }; // Available weights for weight-supporting equipment
  lastUpdated?: Date; // For smart recommendations
}

// Interface for hierarchical selections (e.g., Focus Areas with Primary -> Secondary -> Tertiary)
export interface HierarchicalSelectionData {
  [categoryKey: string]: {
    selected: boolean;
    label: string;
    description?: string;
    level: 'primary' | 'secondary' | 'tertiary';
    parentKey?: string; // Reference to parent category for nested items
    children?: string[]; // Keys of child categories
  };
}

// Interface for enhanced duration configurations with nested warm-up/cool-down structure
export interface DurationConfigurationData {
  selected: boolean;
  totalDuration: number; // Total workout time in minutes
  label: string; // Display label (e.g., "45 min workout", "Standard Session + 5min warm-up")
  value: number; // Backend value (total duration for compatibility)
  description?: string; // Rich description with structure details

  // Nested session structure configuration
  warmUp: {
    included: boolean;
    duration: number; // Fixed time in minutes
    percentage?: number; // Optional: percentage of total for advanced users
  };

  coolDown: {
    included: boolean;
    duration: number; // Fixed time in minutes
    percentage?: number; // Optional: percentage of total for advanced users
  };

  workingTime: number; // Auto-calculated: totalDuration - warmUp.duration - coolDown.duration

  // Metadata for intelligent display and parent communication
  configuration:
    | 'duration-only'
    | 'with-warmup'
    | 'with-cooldown'
    | 'full-structure';

  // Smart validation and suggestions
  validation?: {
    isValid: boolean;
    warnings?: string[]; // Non-blocking suggestions
    errors?: string[]; // Blocking validation issues
  };
}

// Interface for enhanced workout focus configurations with 2-tier progressive disclosure
export interface WorkoutFocusConfigurationData {
  selected: boolean;
  focus: string; // Focus type value (e.g., "strength_training")
  focusLabel: string; // Focus display label (e.g., "Strength Training")
  format?: string; // Format type value (e.g., "straight_sets")
  formatLabel?: string; // Format display label (e.g., "Straight Sets")
  label: string; // Smart combined label for parent display
  value: string; // Backend value (focus or focus_format combination)
  description: string; // Rich description with focus and format details
  configuration: 'focus-only' | 'focus-with-format';

  // Enhanced metadata for intelligent display and validation
  metadata: {
    intensity: 'low' | 'moderate' | 'high' | 'variable';
    equipment: 'minimal' | 'moderate' | 'full-gym';
    experience: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
    duration_compatibility: number[]; // Compatible duration ranges in minutes
    category:
      | 'strength_power'
      | 'muscle_building'
      | 'conditioning_cardio'
      | 'functional_recovery';
  };

  // Smart validation and recommendations
  validation?: {
    isValid: boolean;
    warnings?: string[]; // Non-blocking suggestions
    recommendations?: string[]; // Smart suggestions for optimal combinations
  };
}

export interface CustomizationComponentProps<T = unknown> {
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  error?: string;
}

export interface CustomizationConfig {
  key: keyof PerWorkoutOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<CustomizationComponentProps<any>>;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  comingSoon?: boolean;
  category?: string;
}

export interface WorkoutCustomizationProps {
  options: PerWorkoutOptions;
  onChange: (key: keyof PerWorkoutOptions, value: unknown) => void;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  disabled?: boolean;
  mode?: 'detailed' | 'quick' | 'custom';
  // Validation props for quick mode
  validateFocusAndEnergy?: (values: PerWorkoutOptions) => boolean;
  validateDurationAndEquipment?: (values: PerWorkoutOptions) => boolean;
  touchedFields?: Set<keyof PerWorkoutOptions>;
}
