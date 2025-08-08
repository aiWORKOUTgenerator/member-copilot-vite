// Enhanced Duration Data Flattener
// Transforms complex DurationConfigurationData into comprehensive flat, queryable format
// Generates individual boolean flags for each field as requested by CTO

import { DurationConfigurationData } from '../types';

// Comprehensive flattened structure - each field gets its own JSON key
export interface EnhancedDurationFlat {
  // === CORE DURATION DATA ===
  duration_total_minutes: number;
  duration_working_minutes: number;
  duration_structure_minutes: number; // warm-up + cool-down combined

  // === WARM-UP ANALYSIS ===
  duration_warmup_included: boolean;
  duration_warmup_minutes: number;
  duration_warmup_percentage: number;
  duration_warmup_minimal: boolean; // <= 2 min
  duration_warmup_standard: boolean; // 3-7 min
  duration_warmup_extended: boolean; // >= 8 min

  // === COOL-DOWN ANALYSIS ===
  duration_cooldown_included: boolean;
  duration_cooldown_minutes: number;
  duration_cooldown_percentage: number;
  duration_cooldown_brief: boolean; // <= 3 min
  duration_cooldown_standard: boolean; // 4-7 min
  duration_cooldown_extended: boolean; // >= 8 min

  // === SESSION CATEGORIZATION ===
  duration_category_micro: boolean; // <= 15 min
  duration_category_short: boolean; // 16-30 min
  duration_category_standard: boolean; // 31-60 min
  duration_category_extended: boolean; // 61-90 min
  duration_category_long: boolean; // > 90 min

  // === CONFIGURATION TYPES ===
  duration_config_duration_only: boolean;
  duration_config_with_warmup: boolean;
  duration_config_with_cooldown: boolean;
  duration_config_full_structure: boolean;

  // === EFFICIENCY METRICS ===
  duration_working_percentage: number; // working time as % of total
  duration_structure_percentage: number; // prep time as % of total
  duration_efficiency_excellent: boolean; // >= 85% working time
  duration_efficiency_good: boolean; // 70-84% working time
  duration_efficiency_moderate: boolean; // 50-69% working time
  duration_efficiency_poor: boolean; // < 50% working time

  // === TIME BALANCE FLAGS ===
  duration_balanced_structure: boolean; // warm-up and cool-down similar duration
  duration_warmup_heavy: boolean; // warm-up > cool-down by 3+ min
  duration_cooldown_heavy: boolean; // cool-down > warm-up by 3+ min
  duration_minimal_prep: boolean; // total prep < 10% of session
  duration_heavy_prep: boolean; // total prep > 40% of session

  // === VALIDATION STATUS ===
  duration_validation_valid: boolean;
  duration_validation_has_warnings: boolean;
  duration_validation_has_errors: boolean;
  duration_validation_warning_count: number;
  duration_validation_error_count: number;

  // === RECOMMENDATION FLAGS ===
  duration_recommended_for_beginners: boolean; // 20-45 min with structure
  duration_recommended_for_intermediate: boolean; // 30-75 min flexible structure
  duration_recommended_for_advanced: boolean; // Any duration, optimized structure
  duration_injury_prevention_optimized: boolean; // Good warm-up/cool-down ratio
  duration_time_efficient: boolean; // High working time percentage

  // === SESSION TYPE SUITABILITY ===
  duration_suitable_strength: boolean; // >= 30 min with good prep
  duration_suitable_cardio: boolean; // >= 20 min, flexible prep
  duration_suitable_hiit: boolean; // 15-45 min with adequate prep
  duration_suitable_flexibility: boolean; // Any duration with good cool-down
  duration_suitable_recovery: boolean; // Extended cool-down focus

  // === SMART ANALYTICS ===
  duration_optimal_for_location_home: boolean; // 20-45 min range
  duration_optimal_for_location_gym: boolean; // 45-75 min range
  duration_optimal_for_location_quick: boolean; // <= 20 min
  duration_prep_to_work_ratio: number; // prep time / working time
  duration_intensity_capacity: number; // 0-100 based on structure
  duration_recovery_capacity: number; // 0-100 based on cool-down

  // === BACKUP & META ===
  duration_data_json: string; // stringified original object
  duration_last_updated: string;
  duration_flattener_version: string; // for schema versioning
}

// Helper function to create empty flattened structure
function createEmptyDurationFlattened(): EnhancedDurationFlat {
  return {
    // CORE DURATION DATA
    duration_total_minutes: 0,
    duration_working_minutes: 0,
    duration_structure_minutes: 0,

    // WARM-UP ANALYSIS
    duration_warmup_included: false,
    duration_warmup_minutes: 0,
    duration_warmup_percentage: 0,
    duration_warmup_minimal: false,
    duration_warmup_standard: false,
    duration_warmup_extended: false,

    // COOL-DOWN ANALYSIS
    duration_cooldown_included: false,
    duration_cooldown_minutes: 0,
    duration_cooldown_percentage: 0,
    duration_cooldown_brief: false,
    duration_cooldown_standard: false,
    duration_cooldown_extended: false,

    // SESSION CATEGORIZATION
    duration_category_micro: false,
    duration_category_short: false,
    duration_category_standard: false,
    duration_category_extended: false,
    duration_category_long: false,

    // CONFIGURATION TYPES
    duration_config_duration_only: false,
    duration_config_with_warmup: false,
    duration_config_with_cooldown: false,
    duration_config_full_structure: false,

    // EFFICIENCY METRICS
    duration_working_percentage: 0,
    duration_structure_percentage: 0,
    duration_efficiency_excellent: false,
    duration_efficiency_good: false,
    duration_efficiency_moderate: false,
    duration_efficiency_poor: false,

    // TIME BALANCE FLAGS
    duration_balanced_structure: false,
    duration_warmup_heavy: false,
    duration_cooldown_heavy: false,
    duration_minimal_prep: false,
    duration_heavy_prep: false,

    // VALIDATION STATUS
    duration_validation_valid: false,
    duration_validation_has_warnings: false,
    duration_validation_has_errors: false,
    duration_validation_warning_count: 0,
    duration_validation_error_count: 0,

    // RECOMMENDATION FLAGS
    duration_recommended_for_beginners: false,
    duration_recommended_for_intermediate: false,
    duration_recommended_for_advanced: false,
    duration_injury_prevention_optimized: false,
    duration_time_efficient: false,

    // SESSION TYPE SUITABILITY
    duration_suitable_strength: false,
    duration_suitable_cardio: false,
    duration_suitable_hiit: false,
    duration_suitable_flexibility: false,
    duration_suitable_recovery: false,

    // SMART ANALYTICS
    duration_optimal_for_location_home: false,
    duration_optimal_for_location_gym: false,
    duration_optimal_for_location_quick: false,
    duration_prep_to_work_ratio: 0,
    duration_intensity_capacity: 0,
    duration_recovery_capacity: 0,

    // BACKUP & META
    duration_data_json: JSON.stringify(null),
    duration_last_updated: new Date().toISOString(),
    duration_flattener_version: '1.0.0',
  };
}

// Enhanced flattener function - generates comprehensive boolean flags
export function flattenDurationData(
  data: DurationConfigurationData | number | undefined
): EnhancedDurationFlat {
  // Handle undefined/null input
  if (!data) {
    return createEmptyDurationFlattened();
  }

  // Handle legacy format (simple number)
  if (typeof data === 'number') {
    return flattenLegacyDuration(data);
  }

  // Handle modern format (DurationConfigurationData)
  return flattenModernDuration(data);
}

// Flatten legacy number format
function flattenLegacyDuration(totalMinutes: number): EnhancedDurationFlat {
  const result = createEmptyDurationFlattened();

  // Basic duration analysis
  result.duration_total_minutes = totalMinutes;
  result.duration_working_minutes = totalMinutes; // No structure in legacy format
  result.duration_structure_minutes = 0;
  result.duration_working_percentage = 100;
  result.duration_structure_percentage = 0;

  // Session categorization
  result.duration_category_micro = totalMinutes <= 15;
  result.duration_category_short = totalMinutes > 15 && totalMinutes <= 30;
  result.duration_category_standard = totalMinutes > 30 && totalMinutes <= 60;
  result.duration_category_extended = totalMinutes > 60 && totalMinutes <= 90;
  result.duration_category_long = totalMinutes > 90;

  // Configuration type
  result.duration_config_duration_only = true;

  // Efficiency (excellent since no prep time)
  result.duration_efficiency_excellent = true;
  result.duration_time_efficient = true;

  // Basic suitability (no prep time considerations)
  result.duration_suitable_strength = totalMinutes >= 30;
  result.duration_suitable_cardio = totalMinutes >= 20;
  result.duration_suitable_hiit = totalMinutes >= 15 && totalMinutes <= 45;
  result.duration_suitable_flexibility = true;

  // Location optimization
  result.duration_optimal_for_location_quick = totalMinutes <= 20;
  result.duration_optimal_for_location_home =
    totalMinutes >= 20 && totalMinutes <= 45;
  result.duration_optimal_for_location_gym = totalMinutes >= 45;

  result.duration_validation_valid = true;
  result.duration_data_json = JSON.stringify(totalMinutes);
  result.duration_last_updated = new Date().toISOString();

  return result;
}

// Flatten modern DurationConfigurationData format
function flattenModernDuration(
  data: DurationConfigurationData
): EnhancedDurationFlat {
  const result = createEmptyDurationFlattened();

  // CORE DURATION DATA
  result.duration_total_minutes = data.totalDuration;
  result.duration_working_minutes = data.workingTime;
  result.duration_structure_minutes =
    data.warmUp.duration + data.coolDown.duration;

  // WARM-UP ANALYSIS
  result.duration_warmup_included = data.warmUp.included;
  result.duration_warmup_minutes = data.warmUp.duration;
  result.duration_warmup_percentage = data.warmUp.percentage || 0;
  result.duration_warmup_minimal = data.warmUp.duration <= 2;
  result.duration_warmup_standard =
    data.warmUp.duration >= 3 && data.warmUp.duration <= 7;
  result.duration_warmup_extended = data.warmUp.duration >= 8;

  // COOL-DOWN ANALYSIS
  result.duration_cooldown_included = data.coolDown.included;
  result.duration_cooldown_minutes = data.coolDown.duration;
  result.duration_cooldown_percentage = data.coolDown.percentage || 0;
  result.duration_cooldown_brief = data.coolDown.duration <= 3;
  result.duration_cooldown_standard =
    data.coolDown.duration >= 4 && data.coolDown.duration <= 7;
  result.duration_cooldown_extended = data.coolDown.duration >= 8;

  // SESSION CATEGORIZATION
  result.duration_category_micro = data.totalDuration <= 15;
  result.duration_category_short =
    data.totalDuration > 15 && data.totalDuration <= 30;
  result.duration_category_standard =
    data.totalDuration > 30 && data.totalDuration <= 60;
  result.duration_category_extended =
    data.totalDuration > 60 && data.totalDuration <= 90;
  result.duration_category_long = data.totalDuration > 90;

  // CONFIGURATION TYPES
  result.duration_config_duration_only = data.configuration === 'duration-only';
  result.duration_config_with_warmup = data.configuration === 'with-warmup';
  result.duration_config_with_cooldown = data.configuration === 'with-cooldown';
  result.duration_config_full_structure =
    data.configuration === 'full-structure';

  // EFFICIENCY METRICS
  result.duration_working_percentage = Math.round(
    (data.workingTime / data.totalDuration) * 100
  );
  result.duration_structure_percentage = Math.round(
    (result.duration_structure_minutes / data.totalDuration) * 100
  );
  result.duration_efficiency_excellent =
    result.duration_working_percentage >= 85;
  result.duration_efficiency_good =
    result.duration_working_percentage >= 70 &&
    result.duration_working_percentage < 85;
  result.duration_efficiency_moderate =
    result.duration_working_percentage >= 50 &&
    result.duration_working_percentage < 70;
  result.duration_efficiency_poor = result.duration_working_percentage < 50;

  // TIME BALANCE FLAGS
  const warmUpDuration = data.warmUp.duration;
  const coolDownDuration = data.coolDown.duration;
  result.duration_balanced_structure =
    Math.abs(warmUpDuration - coolDownDuration) <= 2;
  result.duration_warmup_heavy = warmUpDuration > coolDownDuration + 3;
  result.duration_cooldown_heavy = coolDownDuration > warmUpDuration + 3;
  result.duration_minimal_prep = result.duration_structure_percentage < 10;
  result.duration_heavy_prep = result.duration_structure_percentage > 40;

  // VALIDATION STATUS
  if (data.validation) {
    result.duration_validation_valid = data.validation.isValid;
    result.duration_validation_has_warnings =
      (data.validation.warnings?.length || 0) > 0;
    result.duration_validation_has_errors =
      (data.validation.errors?.length || 0) > 0;
    result.duration_validation_warning_count =
      data.validation.warnings?.length || 0;
    result.duration_validation_error_count =
      data.validation.errors?.length || 0;
  }

  // RECOMMENDATION FLAGS
  result.duration_recommended_for_beginners =
    data.totalDuration >= 20 &&
    data.totalDuration <= 45 &&
    data.warmUp.included &&
    data.coolDown.included;
  result.duration_recommended_for_intermediate =
    data.totalDuration >= 30 && data.totalDuration <= 75;
  result.duration_recommended_for_advanced = data.totalDuration >= 30;
  result.duration_injury_prevention_optimized =
    data.warmUp.included &&
    data.coolDown.included &&
    data.warmUp.duration >= 3 &&
    data.coolDown.duration >= 3;
  result.duration_time_efficient = result.duration_working_percentage >= 75;

  // SESSION TYPE SUITABILITY
  result.duration_suitable_strength =
    data.totalDuration >= 30 &&
    (data.warmUp.duration >= 3 || !data.warmUp.included) &&
    data.workingTime >= 20;
  result.duration_suitable_cardio =
    data.totalDuration >= 20 && data.workingTime >= 15;
  result.duration_suitable_hiit =
    data.totalDuration >= 15 &&
    data.totalDuration <= 45 &&
    data.workingTime >= 10;
  result.duration_suitable_flexibility =
    (data.coolDown.included && data.coolDown.duration >= 5) ||
    data.totalDuration >= 20;
  result.duration_suitable_recovery =
    data.coolDown.included && data.coolDown.duration >= 8;

  // SMART ANALYTICS
  result.duration_optimal_for_location_home =
    data.totalDuration >= 20 && data.totalDuration <= 45;
  result.duration_optimal_for_location_gym =
    data.totalDuration >= 45 && data.totalDuration <= 75;
  result.duration_optimal_for_location_quick = data.totalDuration <= 20;
  result.duration_prep_to_work_ratio =
    data.workingTime > 0
      ? Math.round(
          (result.duration_structure_minutes / data.workingTime) * 100
        ) / 100
      : 0;
  result.duration_intensity_capacity = calculateIntensityCapacity(data);
  result.duration_recovery_capacity = calculateRecoveryCapacity(data);

  result.duration_data_json = JSON.stringify(data);
  result.duration_last_updated = new Date().toISOString();

  return result;
}

// Calculate intensity capacity (0-100) based on structure and duration
function calculateIntensityCapacity(data: DurationConfigurationData): number {
  let score = 0;

  // Base score from working time availability (40 points)
  const workingPercentage = (data.workingTime / data.totalDuration) * 100;
  score += Math.min(workingPercentage * 0.4, 40);

  // Warm-up adequacy for intensity (30 points)
  if (data.warmUp.included) {
    if (data.warmUp.duration >= 5) score += 30;
    else if (data.warmUp.duration >= 3) score += 20;
    else score += 10;
  } else if (data.totalDuration <= 20) {
    score += 15; // Short sessions can handle intensity without extensive warm-up
  }

  // Session duration suitability for intensity (20 points)
  if (data.totalDuration >= 20 && data.totalDuration <= 60) {
    score += 20; // Optimal range for intense sessions
  } else if (data.totalDuration < 20) {
    score += 15; // Can be intense but limited scope
  } else {
    score += 10; // Long sessions may need pacing
  }

  // Recovery planning (10 points)
  if (data.coolDown.included && data.coolDown.duration >= 5) {
    score += 10;
  } else if (data.coolDown.included) {
    score += 5;
  }

  return Math.min(Math.round(score), 100);
}

// Calculate recovery capacity (0-100) based on cool-down and session structure
function calculateRecoveryCapacity(data: DurationConfigurationData): number {
  let score = 0;

  // Cool-down presence and duration (50 points)
  if (data.coolDown.included) {
    if (data.coolDown.duration >= 10) score += 50;
    else if (data.coolDown.duration >= 7) score += 40;
    else if (data.coolDown.duration >= 5) score += 30;
    else score += 20;
  }

  // Session length for recovery opportunity (25 points)
  if (data.totalDuration >= 45) {
    score += 25; // Longer sessions allow for better recovery integration
  } else if (data.totalDuration >= 30) {
    score += 15;
  } else {
    score += 5;
  }

  // Structure balance for recovery (15 points)
  const structurePercentage =
    ((data.warmUp.duration + data.coolDown.duration) / data.totalDuration) *
    100;
  if (structurePercentage >= 20 && structurePercentage <= 40) {
    score += 15; // Good balance allows for recovery focus
  } else if (structurePercentage >= 15) {
    score += 10;
  }

  // Working time adequacy (10 points)
  if (data.workingTime >= 15) {
    score += 10; // Sufficient work to warrant recovery
  } else if (data.workingTime >= 10) {
    score += 5;
  }

  return Math.min(Math.round(score), 100);
}

// Enhanced usage example
export function getDurationSummary(flattened: EnhancedDurationFlat): string {
  const parts = [];

  // Core duration info
  parts.push(`${flattened.duration_total_minutes} min total`);

  if (
    flattened.duration_warmup_included ||
    flattened.duration_cooldown_included
  ) {
    parts.push(`${flattened.duration_working_minutes} min active`);

    if (flattened.duration_warmup_included) {
      parts.push(`${flattened.duration_warmup_minutes}min warm-up`);
    }
    if (flattened.duration_cooldown_included) {
      parts.push(`${flattened.duration_cooldown_minutes}min cool-down`);
    }
  }

  // Efficiency indicator
  if (flattened.duration_efficiency_excellent)
    parts.push('Excellent efficiency');
  else if (flattened.duration_efficiency_good) parts.push('Good efficiency');
  else if (flattened.duration_efficiency_moderate)
    parts.push('Moderate efficiency');

  // Capacity indicators
  if (flattened.duration_intensity_capacity >= 80)
    parts.push('High intensity capable');
  if (flattened.duration_recovery_capacity >= 80)
    parts.push('Strong recovery focus');

  return parts.join(' • ') || 'No duration configured';
}
