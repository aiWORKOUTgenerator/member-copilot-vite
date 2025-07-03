// Enhanced Workout Focus Data Flattener
// Transforms complex WorkoutFocusConfigurationData into comprehensive flat, queryable format
// Generates individual boolean flags for each field as requested by CTO

import { WorkoutFocusConfigurationData } from "../types";
import { isWorkoutFormatValue, isWorkoutFocusConfigurationData } from "../utils/validation";

// Comprehensive flattened structure - each field gets its own JSON key
export interface EnhancedWorkoutFocusFlat {
  // === PRIMARY FOCUS TYPES ===
  // Strength & Power Category
  focus_type_strength_training: boolean;
  focus_type_powerlifting: boolean;
  focus_type_strength_hypertrophy: boolean;
  
  // Muscle Building Category
  focus_type_muscle_building: boolean;
  focus_type_bodyweight_building: boolean;
  
  // Conditioning & Cardio Category
  focus_type_hiit: boolean;
  focus_type_cardio_endurance: boolean;
  focus_type_fat_loss: boolean;
  
  // Functional & Recovery Category
  focus_type_functional_fitness: boolean;
  focus_type_flexibility_mobility: boolean;
  focus_type_recovery_stretching: boolean;
  
  // === CATEGORY FLAGS ===
  focus_category_strength_power: boolean;
  focus_category_muscle_building: boolean;
  focus_category_conditioning_cardio: boolean;
  focus_category_functional_recovery: boolean;
  
  // === WORKOUT FORMATS ===
  // Strength Training Formats
  format_straight_sets: boolean;
  format_pyramid_sets: boolean;
  format_cluster_sets: boolean;
  format_rest_pause: boolean;
  
  // Powerlifting Formats
  format_competition_style: boolean;
  format_block_periodization: boolean;
  format_conjugate_method: boolean;
  
  // Strength-Hypertrophy Formats
  format_heavy_light: boolean;
  format_dup: boolean;
  format_push_pull_legs: boolean;
  
  // Muscle Building Formats
  format_straight_sets_hypertrophy: boolean;
  format_supersets: boolean;
  format_drop_sets: boolean;
  format_giant_sets: boolean;
  
  // Bodyweight Building Formats
  format_progressive_overload: boolean;
  format_time_under_tension: boolean;
  format_isometric_holds: boolean;
  
  // HIIT Formats
  format_tabata: boolean;
  format_emom: boolean;
  format_circuit_training: boolean;
  format_sprint_intervals: boolean;
  
  // Cardio Endurance Formats
  format_steady_state: boolean;
  format_tempo_intervals: boolean;
  format_fartlek: boolean;
  
  // Fat Loss Formats
  format_metabolic_circuits: boolean;
  format_cardio_strength_fusion: boolean;
  format_liss_resistance: boolean;
  
  // Functional Fitness Formats
  format_movement_patterns: boolean;
  format_sport_specific: boolean;
  format_crossfit_style: boolean;
  
  // Flexibility/Mobility Formats
  format_dynamic_stretching: boolean;
  format_static_stretching: boolean;
  format_pnf_stretching: boolean;
  format_yoga_flow: boolean;
  
  // Recovery/Stretching Formats
  format_gentle_flow: boolean;
  format_foam_rolling: boolean;
  format_breathwork: boolean;
  
  // === INTENSITY LEVELS ===
  intensity_low: boolean;
  intensity_moderate: boolean;
  intensity_high: boolean;
  intensity_variable: boolean;
  
  // === EQUIPMENT REQUIREMENTS ===
  equipment_minimal: boolean;
  equipment_moderate: boolean;
  equipment_full_gym: boolean;
  
  // === EXPERIENCE LEVELS ===
  experience_all_levels: boolean;
  experience_intermediate: boolean;
  experience_advanced: boolean;
  
  // === CONFIGURATION TYPES ===
  config_focus_only: boolean;
  config_focus_with_format: boolean;
  
  // === FORMAT CHARACTERISTICS ===
  format_beginner_friendly: boolean;
  format_time_efficient: boolean;
  format_advanced_technique: boolean;
  
  // === DURATION COMPATIBILITY ===
  duration_compatible_15min: boolean;
  duration_compatible_20min: boolean;
  duration_compatible_30min: boolean;
  duration_compatible_45min: boolean;
  duration_compatible_60min: boolean;
  duration_compatible_90min: boolean;
  duration_compatible_120min: boolean;
  
  // === TRAINING GOALS ===
  goal_strength_focused: boolean;
  goal_muscle_growth: boolean;
  goal_fat_loss_focused: boolean;
  goal_endurance_focused: boolean;
  goal_power_development: boolean;
  goal_mobility_focused: boolean;
  goal_recovery_focused: boolean;
  goal_athletic_performance: boolean;
  
  // === WORKOUT CHARACTERISTICS ===
  workout_compound_focused: boolean;
  workout_isolation_focused: boolean;
  workout_metabolic_focused: boolean;
  workout_strength_endurance: boolean;
  workout_power_explosive: boolean;
  workout_flexibility_focused: boolean;
  workout_rehabilitation: boolean;
  
  // === LOCATION SUITABILITY ===
  suitable_home_gym: boolean;
  suitable_commercial_gym: boolean;
  suitable_minimal_equipment: boolean;
  suitable_outdoor: boolean;
  suitable_travel: boolean;
  
  // === PROGRAMMING COMPATIBILITY ===
  compatible_linear_progression: boolean;
  compatible_periodization: boolean;
  compatible_autoregulation: boolean;
  compatible_high_frequency: boolean;
  compatible_low_frequency: boolean;
  
  // === VALIDATION STATUS ===
  validation_has_warnings: boolean;
  validation_has_recommendations: boolean;
  validation_warning_count: number;
  validation_recommendation_count: number;
  
  // === SMART ANALYTICS ===
  focus_complexity_score: number;        // 0-100 based on format and requirements
  focus_accessibility_score: number;     // 0-100 based on equipment/experience needs
  focus_time_efficiency_score: number;   // 0-100 based on format characteristics
  focus_beginner_suitability: number;    // 0-100 how suitable for beginners
  focus_advanced_potential: number;      // 0-100 how much room for progression
  
  // === BACKUP & META ===
  focus_data_json: string;
  focus_last_updated: string;
  focus_flattener_version: string;
}

// Helper function to create empty flattened structure
function createEmptyWorkoutFocusFlattened(): EnhancedWorkoutFocusFlat {
  return {
    // PRIMARY FOCUS TYPES
    focus_type_strength_training: false,
    focus_type_powerlifting: false,
    focus_type_strength_hypertrophy: false,
    focus_type_muscle_building: false,
    focus_type_bodyweight_building: false,
    focus_type_hiit: false,
    focus_type_cardio_endurance: false,
    focus_type_fat_loss: false,
    focus_type_functional_fitness: false,
    focus_type_flexibility_mobility: false,
    focus_type_recovery_stretching: false,
    
    // CATEGORY FLAGS
    focus_category_strength_power: false,
    focus_category_muscle_building: false,
    focus_category_conditioning_cardio: false,
    focus_category_functional_recovery: false,
    
    // WORKOUT FORMATS
    format_straight_sets: false,
    format_pyramid_sets: false,
    format_cluster_sets: false,
    format_rest_pause: false,
    format_competition_style: false,
    format_block_periodization: false,
    format_conjugate_method: false,
    format_heavy_light: false,
    format_dup: false,
    format_push_pull_legs: false,
    format_straight_sets_hypertrophy: false,
    format_supersets: false,
    format_drop_sets: false,
    format_giant_sets: false,
    format_progressive_overload: false,
    format_time_under_tension: false,
    format_isometric_holds: false,
    format_tabata: false,
    format_emom: false,
    format_circuit_training: false,
    format_sprint_intervals: false,
    format_steady_state: false,
    format_tempo_intervals: false,
    format_fartlek: false,
    format_metabolic_circuits: false,
    format_cardio_strength_fusion: false,
    format_liss_resistance: false,
    format_movement_patterns: false,
    format_sport_specific: false,
    format_crossfit_style: false,
    format_dynamic_stretching: false,
    format_static_stretching: false,
    format_pnf_stretching: false,
    format_yoga_flow: false,
    format_gentle_flow: false,
    format_foam_rolling: false,
    format_breathwork: false,
    
    // INTENSITY LEVELS
    intensity_low: false,
    intensity_moderate: false,
    intensity_high: false,
    intensity_variable: false,
    
    // EQUIPMENT REQUIREMENTS
    equipment_minimal: false,
    equipment_moderate: false,
    equipment_full_gym: false,
    
    // EXPERIENCE LEVELS
    experience_all_levels: false,
    experience_intermediate: false,
    experience_advanced: false,
    
    // CONFIGURATION TYPES
    config_focus_only: false,
    config_focus_with_format: false,
    
    // FORMAT CHARACTERISTICS
    format_beginner_friendly: false,
    format_time_efficient: false,
    format_advanced_technique: false,
    
    // DURATION COMPATIBILITY
    duration_compatible_15min: false,
    duration_compatible_20min: false,
    duration_compatible_30min: false,
    duration_compatible_45min: false,
    duration_compatible_60min: false,
    duration_compatible_90min: false,
    duration_compatible_120min: false,
    
    // TRAINING GOALS
    goal_strength_focused: false,
    goal_muscle_growth: false,
    goal_fat_loss_focused: false,
    goal_endurance_focused: false,
    goal_power_development: false,
    goal_mobility_focused: false,
    goal_recovery_focused: false,
    goal_athletic_performance: false,
    
    // WORKOUT CHARACTERISTICS
    workout_compound_focused: false,
    workout_isolation_focused: false,
    workout_metabolic_focused: false,
    workout_strength_endurance: false,
    workout_power_explosive: false,
    workout_flexibility_focused: false,
    workout_rehabilitation: false,
    
    // LOCATION SUITABILITY
    suitable_home_gym: false,
    suitable_commercial_gym: false,
    suitable_minimal_equipment: false,
    suitable_outdoor: false,
    suitable_travel: false,
    
    // PROGRAMMING COMPATIBILITY
    compatible_linear_progression: false,
    compatible_periodization: false,
    compatible_autoregulation: false,
    compatible_high_frequency: false,
    compatible_low_frequency: false,
    
    // VALIDATION STATUS
    validation_has_warnings: false,
    validation_has_recommendations: false,
    validation_warning_count: 0,
    validation_recommendation_count: 0,
    
    // SMART ANALYTICS
    focus_complexity_score: 0,
    focus_accessibility_score: 0,
    focus_time_efficiency_score: 0,
    focus_beginner_suitability: 0,
    focus_advanced_potential: 0,
    
    // BACKUP & META
    focus_data_json: JSON.stringify(null),
    focus_last_updated: new Date().toISOString(),
    focus_flattener_version: "1.0.0"
  };
}

// Enhanced flattener function - generates comprehensive boolean flags
export function flattenWorkoutFocusData(data: WorkoutFocusConfigurationData | string | undefined): EnhancedWorkoutFocusFlat {
  // Handle undefined/null input
  if (!data) {
    return createEmptyWorkoutFocusFlattened();
  }
  
  // Handle legacy format (simple string)
  if (typeof data === 'string') {
    return flattenLegacyWorkoutFocus(data);
  }
  
  // Handle modern format (WorkoutFocusConfigurationData)
  return flattenModernWorkoutFocus(data);
}

// Flatten legacy string format
function flattenLegacyWorkoutFocus(focus: string): EnhancedWorkoutFocusFlat {
  const result = createEmptyWorkoutFocusFlattened();
  
  // Map legacy string values to boolean flags
  switch (focus) {
    case 'strength_training':
    case 'strength':
      result.focus_type_strength_training = true;
      result.focus_category_strength_power = true;
      result.goal_strength_focused = true;
      break;
    case 'powerlifting':
      result.focus_type_powerlifting = true;
      result.focus_category_strength_power = true;
      result.goal_strength_focused = true;
      result.goal_power_development = true;
      break;
    case 'muscle_building':
    case 'hypertrophy':
      result.focus_type_muscle_building = true;
      result.focus_category_muscle_building = true;
      result.goal_muscle_growth = true;
      break;
    case 'hiit':
      result.focus_type_hiit = true;
      result.focus_category_conditioning_cardio = true;
      result.goal_fat_loss_focused = true;
      result.workout_metabolic_focused = true;
      break;
    case 'cardio':
    case 'cardio_endurance':
      result.focus_type_cardio_endurance = true;
      result.focus_category_conditioning_cardio = true;
      result.goal_endurance_focused = true;
      break;
    case 'fat_loss':
      result.focus_type_fat_loss = true;
      result.focus_category_conditioning_cardio = true;
      result.goal_fat_loss_focused = true;
      result.workout_metabolic_focused = true;
      break;
    case 'functional_fitness':
    case 'functional':
      result.focus_type_functional_fitness = true;
      result.focus_category_functional_recovery = true;
      result.goal_athletic_performance = true;
      result.workout_compound_focused = true;
      break;
    case 'flexibility_mobility':
    case 'mobility':
      result.focus_type_flexibility_mobility = true;
      result.focus_category_functional_recovery = true;
      result.goal_mobility_focused = true;
      result.workout_flexibility_focused = true;
      break;
    case 'recovery_stretching':
    case 'recovery':
      result.focus_type_recovery_stretching = true;
      result.focus_category_functional_recovery = true;
      result.goal_recovery_focused = true;
      result.workout_rehabilitation = true;
      break;
  }
  
  // Set basic defaults for legacy data
  result.config_focus_only = true;
  result.experience_all_levels = true;
  result.intensity_moderate = true;
  result.equipment_moderate = true;
  
  // Basic duration compatibility (assume flexible)
  result.duration_compatible_30min = true;
  result.duration_compatible_45min = true;
  result.duration_compatible_60min = true;
  
  result.focus_data_json = JSON.stringify(focus);
  result.focus_last_updated = new Date().toISOString();
  
  return result;
}

// Flatten modern WorkoutFocusConfigurationData format
function flattenModernWorkoutFocus(data: WorkoutFocusConfigurationData): EnhancedWorkoutFocusFlat {
  // Validate input data
  if (!isWorkoutFocusConfigurationData(data)) {
    throw new Error('Invalid workout focus configuration data');
  }

  const result: EnhancedWorkoutFocusFlat = {
    // Initialize all flags to false
    focus_type_strength_training: false,
    focus_type_powerlifting: false,
    focus_type_strength_hypertrophy: false,
    focus_type_muscle_building: false,
    focus_type_bodyweight_building: false,
    focus_type_hiit: false,
    focus_type_cardio_endurance: false,
    focus_type_fat_loss: false,
    focus_type_functional_fitness: false,
    focus_type_flexibility_mobility: false,
    focus_type_recovery_stretching: false,
    focus_category_strength_power: false,
    focus_category_muscle_building: false,
    focus_category_conditioning_cardio: false,
    focus_category_functional_recovery: false,
    format_straight_sets: false,
    format_pyramid_sets: false,
    format_cluster_sets: false,
    format_rest_pause: false,
    format_competition_style: false,
    format_block_periodization: false,
    format_conjugate_method: false,
    format_heavy_light: false,
    format_dup: false,
    format_push_pull_legs: false,
    format_straight_sets_hypertrophy: false,
    format_supersets: false,
    format_drop_sets: false,
    format_giant_sets: false,
    format_progressive_overload: false,
    format_time_under_tension: false,
    format_isometric_holds: false,
    format_tabata: false,
    format_emom: false,
    format_circuit_training: false,
    format_sprint_intervals: false,
    format_steady_state: false,
    format_tempo_intervals: false,
    format_fartlek: false,
    format_metabolic_circuits: false,
    format_cardio_strength_fusion: false,
    format_liss_resistance: false,
    format_movement_patterns: false,
    format_sport_specific: false,
    format_crossfit_style: false,
    format_dynamic_stretching: false,
    format_static_stretching: false,
    format_pnf_stretching: false,
    format_yoga_flow: false,
    format_gentle_flow: false,
    format_foam_rolling: false,
    format_breathwork: false,
    intensity_low: false,
    intensity_moderate: false,
    intensity_high: false,
    intensity_variable: false,
    equipment_minimal: false,
    equipment_moderate: false,
    equipment_full_gym: false,
    experience_all_levels: false,
    experience_intermediate: false,
    experience_advanced: false,
    config_focus_only: false,
    config_focus_with_format: false,
    format_beginner_friendly: false,
    format_time_efficient: false,
    format_advanced_technique: false,
    duration_compatible_15min: false,
    duration_compatible_20min: false,
    duration_compatible_30min: false,
    duration_compatible_45min: false,
    duration_compatible_60min: false,
    duration_compatible_90min: false,
    duration_compatible_120min: false,
    goal_strength_focused: false,
    goal_muscle_growth: false,
    goal_fat_loss_focused: false,
    goal_endurance_focused: false,
    goal_power_development: false,
    goal_mobility_focused: false,
    goal_recovery_focused: false,
    goal_athletic_performance: false,
    workout_compound_focused: false,
    workout_isolation_focused: false,
    workout_metabolic_focused: false,
    workout_strength_endurance: false,
    workout_power_explosive: false,
    workout_flexibility_focused: false,
    workout_rehabilitation: false,
    suitable_home_gym: false,
    suitable_commercial_gym: false,
    suitable_minimal_equipment: false,
    suitable_outdoor: false,
    suitable_travel: false,
    compatible_linear_progression: false,
    compatible_periodization: false,
    compatible_autoregulation: false,
    compatible_high_frequency: false,
    compatible_low_frequency: false,
    validation_has_warnings: false,
    validation_has_recommendations: false,
    validation_warning_count: 0,
    validation_recommendation_count: 0,
    focus_complexity_score: 0,
    focus_accessibility_score: 0,
    focus_time_efficiency_score: 0,
    focus_beginner_suitability: 0,
    focus_advanced_potential: 0,
    focus_data_json: '',
    focus_last_updated: new Date().toISOString(),
    focus_flattener_version: '2.0.0'
  };

  // Map focus type
  switch (data.focus) {
    case 'strength_training': result.focus_type_strength_training = true; break;
    case 'powerlifting': result.focus_type_powerlifting = true; break;
    case 'strength_hypertrophy': result.focus_type_strength_hypertrophy = true; break;
    case 'muscle_building': result.focus_type_muscle_building = true; break;
    case 'bodyweight_building': result.focus_type_bodyweight_building = true; break;
    case 'hiit': result.focus_type_hiit = true; break;
    case 'cardio_endurance': result.focus_type_cardio_endurance = true; break;
    case 'fat_loss': result.focus_type_fat_loss = true; break;
    case 'functional_fitness': result.focus_type_functional_fitness = true; break;
    case 'flexibility_mobility': result.focus_type_flexibility_mobility = true; break;
    case 'recovery_stretching': result.focus_type_recovery_stretching = true; break;
  }

  // Map format if present and valid
  if (data.format && isWorkoutFormatValue(data.format)) {
    switch (data.format) {
      // Strength Training Formats
      case 'straight_sets': result.format_straight_sets = true; break;
      case 'pyramid_sets': result.format_pyramid_sets = true; break;
      case 'cluster_sets': result.format_cluster_sets = true; break;
      case 'rest_pause': result.format_rest_pause = true; break;
      
      // Powerlifting Formats
      case 'competition_style': result.format_competition_style = true; break;
      case 'block_periodization': result.format_block_periodization = true; break;
      case 'conjugate_method': result.format_conjugate_method = true; break;
      
      // Strength-Hypertrophy Formats
      case 'heavy_light': result.format_heavy_light = true; break;
      case 'dup': result.format_dup = true; break;
      case 'push_pull_legs': result.format_push_pull_legs = true; break;
      
      // Muscle Building Formats
      case 'straight_sets_hypertrophy': result.format_straight_sets_hypertrophy = true; break;
      case 'supersets': result.format_supersets = true; break;
      case 'drop_sets': result.format_drop_sets = true; break;
      case 'giant_sets': result.format_giant_sets = true; break;
      
      // Bodyweight Building Formats
      case 'progressive_overload': result.format_progressive_overload = true; break;
      case 'time_under_tension': result.format_time_under_tension = true; break;
      case 'isometric_holds': result.format_isometric_holds = true; break;
      
      // HIIT Formats
      case 'tabata': result.format_tabata = true; break;
      case 'emom': result.format_emom = true; break;
      case 'circuit_training': result.format_circuit_training = true; break;
      case 'sprint_intervals': result.format_sprint_intervals = true; break;
      
      // Cardio Endurance Formats
      case 'steady_state': result.format_steady_state = true; break;
      case 'tempo_intervals': result.format_tempo_intervals = true; break;
      case 'fartlek': result.format_fartlek = true; break;
      
      // Fat Loss Formats
      case 'metabolic_circuits': result.format_metabolic_circuits = true; break;
      case 'cardio_strength_fusion': result.format_cardio_strength_fusion = true; break;
      case 'liss_resistance': result.format_liss_resistance = true; break;
      
      // Functional Fitness Formats
      case 'movement_patterns': result.format_movement_patterns = true; break;
      case 'sport_specific': result.format_sport_specific = true; break;
      case 'crossfit_style': result.format_crossfit_style = true; break;
      
      // Flexibility/Mobility Formats
      case 'dynamic_stretching': result.format_dynamic_stretching = true; break;
      case 'static_stretching': result.format_static_stretching = true; break;
      case 'pnf_stretching': result.format_pnf_stretching = true; break;
      case 'yoga_flow': result.format_yoga_flow = true; break;
      
      // Recovery/Stretching Formats
      case 'gentle_flow': result.format_gentle_flow = true; break;
      case 'foam_rolling': result.format_foam_rolling = true; break;
      case 'breathwork': result.format_breathwork = true; break;
    }
  }

  // Map configuration type
  result.config_focus_only = data.configuration === 'focus-only';
  result.config_focus_with_format = data.configuration === 'focus-with-format';

  // Map metadata if present
  if (data.metadata) {
    // Map intensity
    switch (data.metadata.intensity) {
      case 'low': result.intensity_low = true; break;
      case 'moderate': result.intensity_moderate = true; break;
      case 'high': result.intensity_high = true; break;
      case 'variable': result.intensity_variable = true; break;
    }

    // Map equipment
    switch (data.metadata.equipment) {
      case 'minimal': result.equipment_minimal = true; break;
      case 'moderate': result.equipment_moderate = true; break;
      case 'full-gym': result.equipment_full_gym = true; break;
    }

    // Map experience level
    switch (data.metadata.experience) {
      case 'all-levels': result.experience_all_levels = true; break;
      case 'intermediate': result.experience_intermediate = true; break;
      case 'advanced': result.experience_advanced = true; break;
    }

    // Map duration compatibility
    if (data.metadata.duration_compatibility) {
      data.metadata.duration_compatibility.forEach(duration => {
        switch (duration) {
          case 15: result.duration_compatible_15min = true; break;
          case 20: result.duration_compatible_20min = true; break;
          case 30: result.duration_compatible_30min = true; break;
          case 45: result.duration_compatible_45min = true; break;
          case 60: result.duration_compatible_60min = true; break;
          case 90: result.duration_compatible_90min = true; break;
          case 120: result.duration_compatible_120min = true; break;
        }
      });
    }

    // Map category
    switch (data.metadata.category) {
      case 'strength_power': result.focus_category_strength_power = true; break;
      case 'muscle_building': result.focus_category_muscle_building = true; break;
      case 'conditioning_cardio': result.focus_category_conditioning_cardio = true; break;
      case 'functional_recovery': result.focus_category_functional_recovery = true; break;
    }
  }

  return result;
}

// Calculate complexity score based on focus and format requirements
function calculateComplexityScore(result: EnhancedWorkoutFocusFlat): number {
  let score = 0;
  
  // Base complexity from focus type
  if (result.focus_type_powerlifting) score += 40;
  else if (result.focus_type_strength_hypertrophy) score += 35;
  else if (result.focus_type_functional_fitness) score += 30;
  else if (result.focus_type_strength_training) score += 25;
  else if (result.focus_type_muscle_building) score += 20;
  else if (result.focus_type_hiit) score += 25;
  else if (result.focus_type_cardio_endurance) score += 15;
  else if (result.focus_type_fat_loss) score += 20;
  else if (result.focus_type_flexibility_mobility) score += 10;
  else if (result.focus_type_recovery_stretching) score += 5;
  
  // Additional complexity from format
  if (result.format_conjugate_method || result.format_block_periodization) score += 30;
  else if (result.format_pyramid_sets || result.format_cluster_sets) score += 20;
  else if (result.format_supersets || result.format_drop_sets) score += 15;
  else if (result.format_tabata || result.format_emom) score += 10;
  
  // Experience level adjustment
  if (result.experience_advanced) score += 15;
  else if (result.experience_intermediate) score += 10;
  
  return Math.min(100, score);
}

// Calculate accessibility score (higher = more accessible)
function calculateAccessibilityScore(result: EnhancedWorkoutFocusFlat): number {
  let score = 100;
  
  // Equipment requirements reduce accessibility
  if (result.equipment_full_gym) score -= 30;
  else if (result.equipment_moderate) score -= 15;
  
  // Experience requirements reduce accessibility
  if (result.experience_advanced) score -= 25;
  else if (result.experience_intermediate) score -= 10;
  
  // High intensity reduces accessibility
  if (result.intensity_high) score -= 15;
  
  // Complex formats reduce accessibility
  if (result.format_conjugate_method || result.format_block_periodization) score -= 20;
  else if (result.format_pyramid_sets || result.format_cluster_sets) score -= 15;
  
  // Recovery/mobility increases accessibility
  if (result.focus_type_recovery_stretching || result.focus_type_flexibility_mobility) score += 10;
  
  return Math.max(0, score);
}

// Calculate time efficiency score
function calculateTimeEfficiencyScore(result: EnhancedWorkoutFocusFlat): number {
  let score = 50; // Base score
  
  // HIIT and metabolic work are highly time efficient
  if (result.focus_type_hiit) score += 30;
  if (result.workout_metabolic_focused) score += 20;
  
  // Supersets and circuits are time efficient
  if (result.format_supersets || result.format_giant_sets) score += 25;
  if (result.format_circuit_training || result.format_tabata) score += 30;
  
  // Some formats are less time efficient
  if (result.format_steady_state) score -= 20;
  if (result.format_block_periodization) score -= 15;
  
  // Bodyweight can be very efficient
  if (result.focus_type_bodyweight_building) score += 15;
  
  // Recovery work is moderately efficient
  if (result.focus_type_recovery_stretching) score += 10;
  
  return Math.max(0, Math.min(100, score));
}

// Calculate beginner suitability score
function calculateBeginnerSuitability(result: EnhancedWorkoutFocusFlat): number {
  let score = 50; // Base score
  
  // All-levels experience boosts suitability
  if (result.experience_all_levels) score += 30;
  else if (result.experience_intermediate) score -= 10;
  else if (result.experience_advanced) score -= 30;
  
  // Low/moderate intensity is beginner friendly
  if (result.intensity_low) score += 20;
  else if (result.intensity_moderate) score += 10;
  else if (result.intensity_high) score -= 15;
  
  // Minimal equipment is beginner friendly
  if (result.equipment_minimal) score += 15;
  else if (result.equipment_full_gym) score -= 10;
  
  // Simple focuses are more beginner friendly
  if (result.focus_type_muscle_building || result.focus_type_cardio_endurance) score += 15;
  if (result.focus_type_powerlifting) score -= 20;
  
  // Recovery/mobility is very beginner friendly
  if (result.focus_type_recovery_stretching || result.focus_type_flexibility_mobility) score += 20;
  
  return Math.max(0, Math.min(100, score));
}

// Calculate advanced potential score
function calculateAdvancedPotential(result: EnhancedWorkoutFocusFlat): number {
  let score = 50; // Base score
  
  // Advanced focuses have high potential
  if (result.focus_type_powerlifting) score += 40;
  if (result.focus_type_strength_hypertrophy) score += 35;
  if (result.focus_type_functional_fitness) score += 30;
  
  // Complex formats have high potential
  if (result.format_conjugate_method || result.format_block_periodization) score += 30;
  if (result.format_pyramid_sets || result.format_cluster_sets) score += 20;
  
  // High intensity has progression potential
  if (result.intensity_high) score += 15;
  if (result.intensity_variable) score += 10;
  
  // Recovery has limited advanced potential
  if (result.focus_type_recovery_stretching) score -= 20;
  
  return Math.max(0, Math.min(100, score));
}

// Enhanced usage example
export function getWorkoutFocusSummary(flattened: EnhancedWorkoutFocusFlat): string {
  const parts = [];
  
  // Focus type
  const focusTypes = [];
  if (flattened.focus_type_strength_training) focusTypes.push('Strength Training');
  if (flattened.focus_type_powerlifting) focusTypes.push('Powerlifting');
  if (flattened.focus_type_muscle_building) focusTypes.push('Muscle Building');
  if (flattened.focus_type_hiit) focusTypes.push('HIIT');
  if (flattened.focus_type_cardio_endurance) focusTypes.push('Cardio Endurance');
  if (flattened.focus_type_fat_loss) focusTypes.push('Fat Loss');
  if (flattened.focus_type_functional_fitness) focusTypes.push('Functional Fitness');
  if (flattened.focus_type_flexibility_mobility) focusTypes.push('Flexibility/Mobility');
  if (flattened.focus_type_recovery_stretching) focusTypes.push('Recovery/Stretching');
  
  if (focusTypes.length > 0) {
    parts.push(focusTypes[0]); // Primary focus
  }
  
  // Format if present
  const formats = [];
  if (flattened.format_tabata) formats.push('Tabata');
  if (flattened.format_supersets) formats.push('Supersets');
  if (flattened.format_competition_style) formats.push('Competition Style');
  if (flattened.format_circuit_training) formats.push('Circuit Training');
  // ... add other key formats
  
  if (formats.length > 0) {
    parts.push(`(${formats[0]})`);
  }
  
  // Key characteristics
  if (flattened.intensity_high) parts.push('High Intensity');
  if (flattened.equipment_minimal) parts.push('Minimal Equipment');
  if (flattened.format_time_efficient) parts.push('Time Efficient');
  if (flattened.experience_advanced) parts.push('Advanced');
  
  // Analytics indicators
  if (flattened.focus_complexity_score >= 80) parts.push('Complex');
  if (flattened.focus_accessibility_score >= 80) parts.push('Accessible');
  if (flattened.focus_beginner_suitability >= 80) parts.push('Beginner Friendly');
  
  return parts.join(' • ') || 'No workout focus selected';
} 