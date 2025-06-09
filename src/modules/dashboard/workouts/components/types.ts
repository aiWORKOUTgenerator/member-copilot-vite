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
}
