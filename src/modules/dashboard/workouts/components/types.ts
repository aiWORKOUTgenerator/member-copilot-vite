// Unified interface for category-based customizations with rating scales
export interface CategoryRatingData {
  [categoryKey: string]: {
    selected: boolean;
    rating?: number; // 1-5 scale
    label: string; // Human-readable category name
    description?: string; // Category description
  };
}

export interface PerWorkoutOptions {
  customization_duration?: number;
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
  mode?: 'detailed' | 'quick';
  // Validation props for quick mode
  validateFocusAndEnergy?: (values: PerWorkoutOptions) => boolean;
  validateDurationAndEquipment?: (values: PerWorkoutOptions) => boolean;
  touchedFields?: Set<keyof PerWorkoutOptions>;
}
