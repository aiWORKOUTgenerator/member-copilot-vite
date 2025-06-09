export interface PerWorkoutOptions {
  workoutDuration?: number;
  availableEquipment?: string[];
  workoutFocus?: string;
  energyLevel?: number;
  bodyFocus?: string;
  focusAreas?: string[];
  soreness?: string[];
  stressLevel?: number;
  sleepQuality?: number;
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
