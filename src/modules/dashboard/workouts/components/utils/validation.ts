import { WorkoutFocusConfigurationData } from '../types';

// Validation limits for security
export const VALIDATION_LIMITS = {
  MAX_STRING_LENGTH: 1000,
  MAX_ARRAY_LENGTH: 50,
  MAX_RATING_VALUE: 10,
  MIN_RATING_VALUE: 1,
  MAX_DURATION: 300,
  MIN_DURATION: 5,
} as const;

// Sanitize analytics data to prevent injection attacks
export function sanitizeAnalyticsData(data: unknown): unknown {
  if (typeof data === 'string') {
    return data.slice(0, VALIDATION_LIMITS.MAX_STRING_LENGTH);
  }

  if (Array.isArray(data)) {
    return data
      .slice(0, VALIDATION_LIMITS.MAX_ARRAY_LENGTH)
      .map((item) => sanitizeAnalyticsData(item));
  }

  if (typeof data === 'object' && data !== null) {
    const sanitized: Record<string, unknown> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (typeof key === 'string' && key.length <= 100) {
        sanitized[key] = sanitizeAnalyticsData(value);
      }
    });
    return sanitized;
  }

  return data;
}

// Validate rating values
export function validateRating(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    value >= VALIDATION_LIMITS.MIN_RATING_VALUE &&
    value <= VALIDATION_LIMITS.MAX_RATING_VALUE
  );
}

// Validate duration values
export function validateDuration(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    value >= VALIDATION_LIMITS.MIN_DURATION &&
    value <= VALIDATION_LIMITS.MAX_DURATION
  );
}

// Type guard for workout format values
export type WorkoutFormatValue =
  | 'straight_sets'
  | 'pyramid_sets'
  | 'cluster_sets'
  | 'rest_pause'
  | 'competition_style'
  | 'block_periodization'
  | 'conjugate_method'
  | 'heavy_light'
  | 'dup'
  | 'push_pull_legs'
  | 'straight_sets_hypertrophy'
  | 'supersets'
  | 'drop_sets'
  | 'giant_sets'
  | 'progressive_overload'
  | 'time_under_tension'
  | 'isometric_holds'
  | 'tabata'
  | 'emom'
  | 'circuit_training'
  | 'sprint_intervals'
  | 'steady_state'
  | 'tempo_intervals'
  | 'fartlek'
  | 'metabolic_circuits'
  | 'cardio_strength_fusion'
  | 'liss_resistance'
  | 'movement_patterns'
  | 'sport_specific'
  | 'crossfit_style'
  | 'dynamic_stretching'
  | 'static_stretching'
  | 'pnf_stretching'
  | 'yoga_flow'
  | 'gentle_flow'
  | 'foam_rolling'
  | 'breathwork';

// Type guard for workout format values
export function isWorkoutFormatValue(
  value: unknown
): value is WorkoutFormatValue {
  if (typeof value !== 'string') return false;

  const validFormats = new Set([
    'straight_sets',
    'pyramid_sets',
    'cluster_sets',
    'rest_pause',
    'competition_style',
    'block_periodization',
    'conjugate_method',
    'heavy_light',
    'dup',
    'push_pull_legs',
    'straight_sets_hypertrophy',
    'supersets',
    'drop_sets',
    'giant_sets',
    'progressive_overload',
    'time_under_tension',
    'isometric_holds',
    'tabata',
    'emom',
    'circuit_training',
    'sprint_intervals',
    'steady_state',
    'tempo_intervals',
    'fartlek',
    'metabolic_circuits',
    'cardio_strength_fusion',
    'liss_resistance',
    'movement_patterns',
    'sport_specific',
    'crossfit_style',
    'dynamic_stretching',
    'static_stretching',
    'pnf_stretching',
    'yoga_flow',
    'gentle_flow',
    'foam_rolling',
    'breathwork',
  ]);

  return validFormats.has(value);
}

// Type guard for workout focus configuration data
export function isWorkoutFocusConfigurationData(
  value: unknown
): value is WorkoutFocusConfigurationData {
  if (!value || typeof value !== 'object') return false;

  const data = value as Partial<WorkoutFocusConfigurationData>;

  // Required fields validation
  if (
    typeof data.selected !== 'boolean' ||
    typeof data.focus !== 'string' ||
    typeof data.focusLabel !== 'string' ||
    typeof data.label !== 'string' ||
    typeof data.value !== 'string' ||
    typeof data.description !== 'string' ||
    typeof data.configuration !== 'string' ||
    !['focus-only', 'focus-with-format'].includes(data.configuration) ||
    !data.metadata // metadata is required
  ) {
    return false;
  }

  // Optional fields validation
  if (data.format !== undefined && !isWorkoutFormatValue(data.format)) {
    return false;
  }

  if (data.formatLabel !== undefined && typeof data.formatLabel !== 'string') {
    return false;
  }

  // Metadata validation
  const { metadata } = data;

  if (
    !metadata ||
    !['low', 'moderate', 'high', 'variable'].includes(metadata.intensity) ||
    !['minimal', 'moderate', 'full-gym'].includes(metadata.equipment) ||
    !['beginner', 'intermediate', 'advanced', 'all-levels'].includes(
      metadata.experience
    ) ||
    !Array.isArray(metadata.duration_compatibility) ||
    !metadata.duration_compatibility.every(
      (d: number) => typeof d === 'number'
    ) ||
    ![
      'strength_power',
      'muscle_building',
      'conditioning_cardio',
      'functional_recovery',
    ].includes(metadata.category)
  ) {
    return false;
  }

  // Validation field check if present
  if (data.validation) {
    const { validation } = data;

    if (
      typeof validation.isValid !== 'boolean' ||
      (validation.warnings && !Array.isArray(validation.warnings)) ||
      (validation.recommendations && !Array.isArray(validation.recommendations))
    ) {
      return false;
    }
  }

  return true;
}

// Safe string concatenation utility that ensures string output
export function safeConcat(...parts: (string | null | undefined)[]): string {
  const validParts = parts.filter(
    (part): part is string =>
      part !== null && part !== undefined && typeof part === 'string'
  );
  return validParts.join('');
}
