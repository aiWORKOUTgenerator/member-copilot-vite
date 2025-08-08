// Enhanced Stress Level Data Flattener
// Transforms CategoryRatingData into comprehensive flat, queryable format
// Generates individual boolean flags for each field as requested by CTO

import { CategoryRatingData } from '../types';

// Comprehensive flattened structure - each field gets its own JSON key
export interface EnhancedStressLevelFlat {
  // === STRESS CATEGORY PRESENCE FLAGS ===
  stress_has_physical: boolean;
  stress_has_mental_emotional: boolean;
  stress_has_environmental: boolean;
  stress_has_systemic: boolean;

  // === STRESS LEVEL FLAGS (by category) ===
  // Physical stress levels
  stress_physical_mild: boolean; // level 1
  stress_physical_low_moderate: boolean; // level 2
  stress_physical_moderate: boolean; // level 3
  stress_physical_high: boolean; // level 4
  stress_physical_severe: boolean; // level 5

  // Mental/Emotional stress levels
  stress_mental_emotional_mild: boolean;
  stress_mental_emotional_low_moderate: boolean;
  stress_mental_emotional_moderate: boolean;
  stress_mental_emotional_high: boolean;
  stress_mental_emotional_severe: boolean;

  // Environmental stress levels
  stress_environmental_mild: boolean;
  stress_environmental_low_moderate: boolean;
  stress_environmental_moderate: boolean;
  stress_environmental_high: boolean;
  stress_environmental_severe: boolean;

  // Systemic stress levels
  stress_systemic_mild: boolean;
  stress_systemic_low_moderate: boolean;
  stress_systemic_moderate: boolean;
  stress_systemic_high: boolean;
  stress_systemic_severe: boolean;

  // === STRESS PATTERN ANALYSIS ===
  stress_single_category: boolean; // only one category affected
  stress_multiple_categories: boolean; // multiple categories affected
  stress_all_categories: boolean; // all four categories affected
  stress_primarily_physical: boolean; // physical stress dominates
  stress_primarily_mental: boolean; // mental/emotional stress dominates
  stress_mixed_sources: boolean; // balanced across categories

  // === SEVERITY ANALYSIS ===
  stress_has_mild_only: boolean; // all selected are level 1
  stress_has_moderate_levels: boolean; // any level 2-3
  stress_has_high_levels: boolean; // any level 4-5
  stress_has_severe_levels: boolean; // any level 5
  stress_escalating_pattern: boolean; // multiple categories with increasing severity

  // === TRAINING IMPACT ASSESSMENT ===
  stress_affects_physical_performance: boolean; // physical stress present
  stress_affects_mental_focus: boolean; // mental/emotional stress present
  stress_affects_consistency: boolean; // environmental stress present
  stress_affects_recovery: boolean; // systemic stress present
  stress_affects_motivation: boolean; // mental + systemic stress
  stress_affects_exercise_selection: boolean; // environmental + physical stress

  // === WORKOUT MODIFICATION FLAGS ===
  stress_needs_intensity_reduction: boolean; // high physical/systemic stress
  stress_needs_duration_reduction: boolean; // multiple high-level stressors
  stress_needs_complexity_reduction: boolean; // high mental/emotional stress
  stress_needs_flexibility_increase: boolean; // high environmental stress
  stress_needs_recovery_emphasis: boolean; // high systemic stress
  stress_contraindicated_high_intensity: boolean; // severe stress levels

  // === STRESS COPING RECOMMENDATIONS ===
  stress_recommend_mindful_movement: boolean; // high mental/emotional stress
  stress_recommend_gentle_exercise: boolean; // high physical stress
  stress_recommend_routine_structure: boolean; // high environmental stress
  stress_recommend_rest_prioritization: boolean; // high systemic stress
  stress_recommend_stress_management: boolean; // multiple severe stressors
  stress_recommend_professional_support: boolean; // severe systemic or multiple severe

  // === EXERCISE TYPE SUITABILITY ===
  stress_suitable_strength_training: boolean; // low-moderate stress levels
  stress_suitable_cardio_moderate: boolean; // good for stress relief
  stress_suitable_cardio_intense: boolean; // only if stress is manageable
  stress_suitable_yoga_meditation: boolean; // high mental/emotional stress
  stress_suitable_walking_light: boolean; // high stress levels
  stress_suitable_flexibility_work: boolean; // always suitable
  stress_suitable_skill_practice: boolean; // low mental stress

  // === TIMING RECOMMENDATIONS ===
  stress_prefer_morning_workouts: boolean; // high evening stress
  stress_prefer_shorter_sessions: boolean; // high overall stress
  stress_prefer_familiar_routines: boolean; // high mental/environmental stress
  stress_prefer_social_support: boolean; // high mental/emotional stress
  stress_prefer_solo_activities: boolean; // overwhelmed state

  // === ANALYTICS & COUNTS ===
  stress_total_categories: number; // count of stressed categories
  stress_mild_count: number; // count of level 1 categories
  stress_moderate_count: number; // count of level 2-3 categories
  stress_high_count: number; // count of level 4-5 categories
  stress_average_level: number; // average stress level (0-5)
  stress_overall_load_score: number; // weighted stress score (0-100)
  stress_allostatic_load: number; // cumulative stress burden (0-100)

  // === RECOVERY CAPACITY INDICATORS ===
  stress_recovery_capacity_high: boolean; // low stress, good recovery
  stress_recovery_capacity_moderate: boolean; // moderate stress levels
  stress_recovery_capacity_low: boolean; // high stress, impaired recovery
  stress_recovery_capacity_critical: boolean; // severe stress, recovery compromised

  // === ADAPTIVE RECOMMENDATIONS ===
  stress_adaptive_training_needed: boolean; // stress levels require adaptation
  stress_periodization_adjustment: boolean; // long-term planning changes needed
  stress_autoregulation_recommended: boolean; // daily adjustments needed
  stress_external_support_needed: boolean; // professional help recommended

  // === BACKUP & META ===
  stress_data_json: string;
  stress_last_updated: string;
  stress_flattener_version: string;
}

// Helper function to create empty flattened structure
function createEmptyStressLevelFlattened(): EnhancedStressLevelFlat {
  return {
    // STRESS CATEGORY PRESENCE FLAGS
    stress_has_physical: false,
    stress_has_mental_emotional: false,
    stress_has_environmental: false,
    stress_has_systemic: false,

    // STRESS LEVEL FLAGS
    stress_physical_mild: false,
    stress_physical_low_moderate: false,
    stress_physical_moderate: false,
    stress_physical_high: false,
    stress_physical_severe: false,

    stress_mental_emotional_mild: false,
    stress_mental_emotional_low_moderate: false,
    stress_mental_emotional_moderate: false,
    stress_mental_emotional_high: false,
    stress_mental_emotional_severe: false,

    stress_environmental_mild: false,
    stress_environmental_low_moderate: false,
    stress_environmental_moderate: false,
    stress_environmental_high: false,
    stress_environmental_severe: false,

    stress_systemic_mild: false,
    stress_systemic_low_moderate: false,
    stress_systemic_moderate: false,
    stress_systemic_high: false,
    stress_systemic_severe: false,

    // STRESS PATTERN ANALYSIS
    stress_single_category: false,
    stress_multiple_categories: false,
    stress_all_categories: false,
    stress_primarily_physical: false,
    stress_primarily_mental: false,
    stress_mixed_sources: false,

    // SEVERITY ANALYSIS
    stress_has_mild_only: false,
    stress_has_moderate_levels: false,
    stress_has_high_levels: false,
    stress_has_severe_levels: false,
    stress_escalating_pattern: false,

    // TRAINING IMPACT ASSESSMENT
    stress_affects_physical_performance: false,
    stress_affects_mental_focus: false,
    stress_affects_consistency: false,
    stress_affects_recovery: false,
    stress_affects_motivation: false,
    stress_affects_exercise_selection: false,

    // WORKOUT MODIFICATION FLAGS
    stress_needs_intensity_reduction: false,
    stress_needs_duration_reduction: false,
    stress_needs_complexity_reduction: false,
    stress_needs_flexibility_increase: false,
    stress_needs_recovery_emphasis: false,
    stress_contraindicated_high_intensity: false,

    // STRESS COPING RECOMMENDATIONS
    stress_recommend_mindful_movement: false,
    stress_recommend_gentle_exercise: false,
    stress_recommend_routine_structure: false,
    stress_recommend_rest_prioritization: false,
    stress_recommend_stress_management: false,
    stress_recommend_professional_support: false,

    // EXERCISE TYPE SUITABILITY
    stress_suitable_strength_training: false,
    stress_suitable_cardio_moderate: false,
    stress_suitable_cardio_intense: false,
    stress_suitable_yoga_meditation: false,
    stress_suitable_walking_light: false,
    stress_suitable_flexibility_work: false,
    stress_suitable_skill_practice: false,

    // TIMING RECOMMENDATIONS
    stress_prefer_morning_workouts: false,
    stress_prefer_shorter_sessions: false,
    stress_prefer_familiar_routines: false,
    stress_prefer_social_support: false,
    stress_prefer_solo_activities: false,

    // ANALYTICS & COUNTS
    stress_total_categories: 0,
    stress_mild_count: 0,
    stress_moderate_count: 0,
    stress_high_count: 0,
    stress_average_level: 0,
    stress_overall_load_score: 0,
    stress_allostatic_load: 0,

    // RECOVERY CAPACITY INDICATORS
    stress_recovery_capacity_high: false,
    stress_recovery_capacity_moderate: false,
    stress_recovery_capacity_low: false,
    stress_recovery_capacity_critical: false,

    // ADAPTIVE RECOMMENDATIONS
    stress_adaptive_training_needed: false,
    stress_periodization_adjustment: false,
    stress_autoregulation_recommended: false,
    stress_external_support_needed: false,

    // BACKUP & META
    stress_data_json: JSON.stringify(null),
    stress_last_updated: new Date().toISOString(),
    stress_flattener_version: '1.0.0',
  };
}

// Enhanced flattener function - generates comprehensive boolean flags
export function flattenStressLevelData(
  data: CategoryRatingData | undefined
): EnhancedStressLevelFlat {
  // Handle undefined/null input
  if (!data) {
    return createEmptyStressLevelFlattened();
  }

  const result = createEmptyStressLevelFlattened();

  // Process each stress category and its rating
  const stressCategories = Object.keys(data).filter(
    (key) => data[key].selected
  );
  const ratings: number[] = [];
  const categoryRatings: { [key: string]: number } = {};

  stressCategories.forEach((category) => {
    const categoryInfo = data[category];
    const rating = categoryInfo.rating;

    // Set presence flags
    switch (category) {
      case 'physical':
        result.stress_has_physical = true;
        break;
      case 'mental_emotional':
        result.stress_has_mental_emotional = true;
        break;
      case 'environmental':
        result.stress_has_environmental = true;
        break;
      case 'systemic':
        result.stress_has_systemic = true;
        break;
    }

    // Set level-specific flags if rating exists
    if (rating) {
      ratings.push(rating);
      categoryRatings[category] = rating;

      switch (category) {
        case 'physical':
          if (rating === 1) result.stress_physical_mild = true;
          else if (rating === 2) result.stress_physical_low_moderate = true;
          else if (rating === 3) result.stress_physical_moderate = true;
          else if (rating === 4) result.stress_physical_high = true;
          else if (rating === 5) result.stress_physical_severe = true;
          break;
        case 'mental_emotional':
          if (rating === 1) result.stress_mental_emotional_mild = true;
          else if (rating === 2)
            result.stress_mental_emotional_low_moderate = true;
          else if (rating === 3) result.stress_mental_emotional_moderate = true;
          else if (rating === 4) result.stress_mental_emotional_high = true;
          else if (rating === 5) result.stress_mental_emotional_severe = true;
          break;
        case 'environmental':
          if (rating === 1) result.stress_environmental_mild = true;
          else if (rating === 2)
            result.stress_environmental_low_moderate = true;
          else if (rating === 3) result.stress_environmental_moderate = true;
          else if (rating === 4) result.stress_environmental_high = true;
          else if (rating === 5) result.stress_environmental_severe = true;
          break;
        case 'systemic':
          if (rating === 1) result.stress_systemic_mild = true;
          else if (rating === 2) result.stress_systemic_low_moderate = true;
          else if (rating === 3) result.stress_systemic_moderate = true;
          else if (rating === 4) result.stress_systemic_high = true;
          else if (rating === 5) result.stress_systemic_severe = true;
          break;
      }
    }
  });

  // Calculate stress pattern analysis
  result.stress_single_category = stressCategories.length === 1;
  result.stress_multiple_categories = stressCategories.length > 1;
  result.stress_all_categories = stressCategories.length === 4;

  const physicalRating = categoryRatings['physical'] || 0;
  const mentalRating = categoryRatings['mental_emotional'] || 0;
  const environmentalRating = categoryRatings['environmental'] || 0;
  const systemicRating = categoryRatings['systemic'] || 0;

  result.stress_primarily_physical =
    physicalRating > 0 &&
    physicalRating >=
      Math.max(mentalRating, environmentalRating, systemicRating);
  result.stress_primarily_mental =
    mentalRating > 0 &&
    mentalRating >=
      Math.max(physicalRating, environmentalRating, systemicRating);
  result.stress_mixed_sources =
    stressCategories.length >= 2 &&
    !result.stress_primarily_physical &&
    !result.stress_primarily_mental;

  // Calculate severity analysis
  const mildCount = ratings.filter((r) => r === 1).length;
  const moderateCount = ratings.filter((r) => r === 2 || r === 3).length;
  const highCount = ratings.filter((r) => r === 4 || r === 5).length;
  const severeCount = ratings.filter((r) => r === 5).length;

  result.stress_has_mild_only =
    ratings.length > 0 && ratings.every((r) => r === 1);
  result.stress_has_moderate_levels = moderateCount > 0;
  result.stress_has_high_levels = highCount > 0;
  result.stress_has_severe_levels = severeCount > 0;
  result.stress_escalating_pattern =
    stressCategories.length >= 2 && ratings.some((r) => r >= 4);

  // Calculate training impact assessment
  result.stress_affects_physical_performance =
    result.stress_has_physical && physicalRating >= 3;
  result.stress_affects_mental_focus =
    result.stress_has_mental_emotional && mentalRating >= 3;
  result.stress_affects_consistency =
    result.stress_has_environmental && environmentalRating >= 3;
  result.stress_affects_recovery =
    result.stress_has_systemic && systemicRating >= 3;
  result.stress_affects_motivation =
    (mentalRating >= 3 && systemicRating >= 2) ||
    mentalRating >= 4 ||
    systemicRating >= 4;
  result.stress_affects_exercise_selection =
    (environmentalRating >= 3 && physicalRating >= 2) ||
    environmentalRating >= 4;

  // Calculate workout modification flags
  result.stress_needs_intensity_reduction =
    physicalRating >= 4 || systemicRating >= 4 || ratings.some((r) => r === 5);
  result.stress_needs_duration_reduction =
    ratings.filter((r) => r >= 4).length >= 2;
  result.stress_needs_complexity_reduction =
    mentalRating >= 4 || (mentalRating >= 3 && systemicRating >= 3);
  result.stress_needs_flexibility_increase = environmentalRating >= 3;
  result.stress_needs_recovery_emphasis =
    systemicRating >= 3 || ratings.filter((r) => r >= 4).length >= 2;
  result.stress_contraindicated_high_intensity =
    severeCount > 0 || ratings.filter((r) => r >= 4).length >= 3;

  // Calculate stress coping recommendations
  result.stress_recommend_mindful_movement = mentalRating >= 3;
  result.stress_recommend_gentle_exercise = physicalRating >= 4;
  result.stress_recommend_routine_structure = environmentalRating >= 3;
  result.stress_recommend_rest_prioritization = systemicRating >= 4;
  result.stress_recommend_stress_management =
    ratings.filter((r) => r >= 4).length >= 2;
  result.stress_recommend_professional_support =
    systemicRating === 5 || severeCount >= 2;

  // Calculate exercise type suitability
  const overallStressLevel = ratings.length > 0 ? Math.max(...ratings) : 0;
  const averageStressLevel =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0;

  result.stress_suitable_strength_training =
    overallStressLevel <= 3 && averageStressLevel <= 2.5;
  result.stress_suitable_cardio_moderate =
    overallStressLevel <= 4 && !result.stress_contraindicated_high_intensity;
  result.stress_suitable_cardio_intense =
    overallStressLevel <= 2 && averageStressLevel <= 2;
  result.stress_suitable_yoga_meditation =
    mentalRating >= 2 || overallStressLevel >= 3;
  result.stress_suitable_walking_light = true; // Always suitable
  result.stress_suitable_flexibility_work = true; // Always suitable
  result.stress_suitable_skill_practice = mentalRating <= 2;

  // Calculate timing recommendations
  result.stress_prefer_morning_workouts =
    mentalRating >= 3 || systemicRating >= 3;
  result.stress_prefer_shorter_sessions =
    overallStressLevel >= 4 || averageStressLevel >= 3;
  result.stress_prefer_familiar_routines =
    mentalRating >= 3 || environmentalRating >= 3;
  result.stress_prefer_social_support = mentalRating >= 3 && mentalRating <= 4;
  result.stress_prefer_solo_activities =
    mentalRating === 5 || systemicRating === 5;

  // Calculate analytics
  result.stress_total_categories = stressCategories.length;
  result.stress_mild_count = mildCount;
  result.stress_moderate_count = moderateCount;
  result.stress_high_count = highCount;
  result.stress_average_level =
    ratings.length > 0
      ? Math.round(
          (ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 10
        ) / 10
      : 0;

  // Calculate overall load score (0-100)
  result.stress_overall_load_score =
    ratings.length > 0
      ? Math.round(ratings.reduce((sum, r) => sum + r * 20, 0) / ratings.length)
      : 0;

  // Calculate allostatic load (cumulative stress burden)
  result.stress_allostatic_load = Math.min(
    100,
    Math.round(
      physicalRating * 25 +
        mentalRating * 25 +
        environmentalRating * 20 +
        systemicRating * 30
    )
  );

  // Calculate recovery capacity indicators
  if (result.stress_allostatic_load <= 25) {
    result.stress_recovery_capacity_high = true;
  } else if (result.stress_allostatic_load <= 50) {
    result.stress_recovery_capacity_moderate = true;
  } else if (result.stress_allostatic_load <= 75) {
    result.stress_recovery_capacity_low = true;
  } else {
    result.stress_recovery_capacity_critical = true;
  }

  // Calculate adaptive recommendations
  result.stress_adaptive_training_needed =
    overallStressLevel >= 3 || averageStressLevel >= 2.5;
  result.stress_periodization_adjustment =
    systemicRating >= 4 || ratings.filter((r) => r >= 4).length >= 2;
  result.stress_autoregulation_recommended =
    result.stress_multiple_categories && overallStressLevel >= 3;
  result.stress_external_support_needed =
    result.stress_recommend_professional_support;

  result.stress_data_json = JSON.stringify(data);
  result.stress_last_updated = new Date().toISOString();

  return result;
}

// Enhanced usage example
export function getStressLevelSummary(
  flattened: EnhancedStressLevelFlat
): string {
  const parts = [];

  // Category count
  if (flattened.stress_total_categories > 0) {
    parts.push(`${flattened.stress_total_categories} stress categories`);
  }

  // Severity summary
  if (flattened.stress_has_severe_levels) parts.push('Severe stress');
  else if (flattened.stress_has_high_levels) parts.push('High stress');
  else if (flattened.stress_has_moderate_levels) parts.push('Moderate stress');
  else if (flattened.stress_has_mild_only) parts.push('Mild stress');

  // Pattern summary
  if (flattened.stress_all_categories) parts.push('All domains affected');
  else if (flattened.stress_primarily_physical)
    parts.push('Physical stress dominant');
  else if (flattened.stress_primarily_mental)
    parts.push('Mental stress dominant');
  else if (flattened.stress_mixed_sources) parts.push('Mixed stress sources');

  // Recovery capacity
  if (flattened.stress_recovery_capacity_critical)
    parts.push('Critical recovery impairment');
  else if (flattened.stress_recovery_capacity_low)
    parts.push('Low recovery capacity');
  else if (flattened.stress_recovery_capacity_moderate)
    parts.push('Moderate recovery capacity');
  else if (flattened.stress_recovery_capacity_high)
    parts.push('Good recovery capacity');

  // Key recommendations
  if (flattened.stress_recommend_professional_support)
    parts.push('Professional support needed');
  else if (flattened.stress_recommend_rest_prioritization)
    parts.push('Rest prioritization');
  else if (flattened.stress_recommend_stress_management)
    parts.push('Stress management needed');

  // Training adaptations
  if (flattened.stress_contraindicated_high_intensity)
    parts.push('Avoid high intensity');
  else if (flattened.stress_needs_intensity_reduction)
    parts.push('Reduce intensity');

  return parts.join(' • ') || 'No stress reported';
}
