// Enhanced Soreness Data Flattener
// Transforms CategoryRatingData into comprehensive flat, queryable format
// Generates individual boolean flags for each field as requested by CTO

import { CategoryRatingData } from '../types';

// Comprehensive flattened structure - each field gets its own JSON key
export interface EnhancedSorenessFlat {
  // === BODY PART PRESENCE FLAGS ===
  soreness_has_neck: boolean;
  soreness_has_shoulders: boolean;
  soreness_has_upper_back: boolean;
  soreness_has_lower_back: boolean;
  soreness_has_chest: boolean;
  soreness_has_arms: boolean;
  soreness_has_wrists: boolean;
  soreness_has_elbows: boolean;
  soreness_has_abs_core: boolean;
  soreness_has_hips: boolean;
  soreness_has_glutes: boolean;
  soreness_has_thighs: boolean;
  soreness_has_hamstrings: boolean;
  soreness_has_knees: boolean;
  soreness_has_calves: boolean;
  soreness_has_ankles: boolean;

  // === SORENESS LEVEL FLAGS (by body part) ===
  // Neck levels
  soreness_neck_mild: boolean; // level 1
  soreness_neck_low_moderate: boolean; // level 2
  soreness_neck_moderate: boolean; // level 3
  soreness_neck_high: boolean; // level 4
  soreness_neck_severe: boolean; // level 5

  // Shoulders levels
  soreness_shoulders_mild: boolean;
  soreness_shoulders_low_moderate: boolean;
  soreness_shoulders_moderate: boolean;
  soreness_shoulders_high: boolean;
  soreness_shoulders_severe: boolean;

  // Upper Back levels
  soreness_upper_back_mild: boolean;
  soreness_upper_back_low_moderate: boolean;
  soreness_upper_back_moderate: boolean;
  soreness_upper_back_high: boolean;
  soreness_upper_back_severe: boolean;

  // Lower Back levels
  soreness_lower_back_mild: boolean;
  soreness_lower_back_low_moderate: boolean;
  soreness_lower_back_moderate: boolean;
  soreness_lower_back_high: boolean;
  soreness_lower_back_severe: boolean;

  // Chest levels
  soreness_chest_mild: boolean;
  soreness_chest_low_moderate: boolean;
  soreness_chest_moderate: boolean;
  soreness_chest_high: boolean;
  soreness_chest_severe: boolean;

  // Arms levels
  soreness_arms_mild: boolean;
  soreness_arms_low_moderate: boolean;
  soreness_arms_moderate: boolean;
  soreness_arms_high: boolean;
  soreness_arms_severe: boolean;

  // Wrists levels
  soreness_wrists_mild: boolean;
  soreness_wrists_low_moderate: boolean;
  soreness_wrists_moderate: boolean;
  soreness_wrists_high: boolean;
  soreness_wrists_severe: boolean;

  // Elbows levels
  soreness_elbows_mild: boolean;
  soreness_elbows_low_moderate: boolean;
  soreness_elbows_moderate: boolean;
  soreness_elbows_high: boolean;
  soreness_elbows_severe: boolean;

  // Abs/Core levels
  soreness_abs_core_mild: boolean;
  soreness_abs_core_low_moderate: boolean;
  soreness_abs_core_moderate: boolean;
  soreness_abs_core_high: boolean;
  soreness_abs_core_severe: boolean;

  // Hips levels
  soreness_hips_mild: boolean;
  soreness_hips_low_moderate: boolean;
  soreness_hips_moderate: boolean;
  soreness_hips_high: boolean;
  soreness_hips_severe: boolean;

  // Glutes levels
  soreness_glutes_mild: boolean;
  soreness_glutes_low_moderate: boolean;
  soreness_glutes_moderate: boolean;
  soreness_glutes_high: boolean;
  soreness_glutes_severe: boolean;

  // Thighs levels
  soreness_thighs_mild: boolean;
  soreness_thighs_low_moderate: boolean;
  soreness_thighs_moderate: boolean;
  soreness_thighs_high: boolean;
  soreness_thighs_severe: boolean;

  // Hamstrings levels
  soreness_hamstrings_mild: boolean;
  soreness_hamstrings_low_moderate: boolean;
  soreness_hamstrings_moderate: boolean;
  soreness_hamstrings_high: boolean;
  soreness_hamstrings_severe: boolean;

  // Knees levels
  soreness_knees_mild: boolean;
  soreness_knees_low_moderate: boolean;
  soreness_knees_moderate: boolean;
  soreness_knees_high: boolean;
  soreness_knees_severe: boolean;

  // Calves levels
  soreness_calves_mild: boolean;
  soreness_calves_low_moderate: boolean;
  soreness_calves_moderate: boolean;
  soreness_calves_high: boolean;
  soreness_calves_severe: boolean;

  // Ankles levels
  soreness_ankles_mild: boolean;
  soreness_ankles_low_moderate: boolean;
  soreness_ankles_moderate: boolean;
  soreness_ankles_high: boolean;
  soreness_ankles_severe: boolean;

  // === REGIONAL ANALYSIS ===
  soreness_has_upper_body: boolean; // neck, shoulders, upper_back, chest, arms, wrists, elbows
  soreness_has_core: boolean; // abs_core, lower_back
  soreness_has_lower_body: boolean; // hips, glutes, thighs, hamstrings, knees, calves, ankles
  soreness_has_back_issues: boolean; // upper_back, lower_back
  soreness_has_joint_issues: boolean; // wrists, elbows, knees, ankles

  // === SEVERITY ANALYSIS ===
  soreness_has_mild_only: boolean; // all selected are level 1
  soreness_has_moderate_levels: boolean; // any level 2-3
  soreness_has_high_levels: boolean; // any level 4-5
  soreness_has_severe_levels: boolean; // any level 5
  soreness_mixed_severity: boolean; // multiple different levels

  // === IMPACT ASSESSMENT ===
  soreness_affects_upper_workouts: boolean; // upper body soreness present
  soreness_affects_lower_workouts: boolean; // lower body soreness present
  soreness_affects_core_workouts: boolean; // core/back soreness present
  soreness_affects_cardio: boolean; // leg/joint soreness that impacts cardio
  soreness_affects_flexibility: boolean; // any moderate+ soreness

  // === WORKOUT MODIFICATION FLAGS ===
  soreness_needs_upper_modification: boolean;
  soreness_needs_lower_modification: boolean;
  soreness_needs_core_modification: boolean;
  soreness_needs_intensity_reduction: boolean;
  soreness_needs_recovery_focus: boolean;
  soreness_contraindicated_high_impact: boolean;

  // === ANALYTICS & COUNTS ===
  soreness_total_areas: number; // count of sore body parts
  soreness_mild_count: number; // count of level 1 areas
  soreness_moderate_count: number; // count of level 2-3 areas
  soreness_high_count: number; // count of level 4-5 areas
  soreness_average_level: number; // average soreness level (0-5)
  soreness_severity_score: number; // weighted severity score (0-100)

  // === RECOVERY RECOMMENDATIONS ===
  soreness_recommend_rest: boolean; // high severity scores
  soreness_recommend_active_recovery: boolean; // moderate levels
  soreness_recommend_mobility_work: boolean; // joint issues
  soreness_recommend_massage: boolean; // muscle soreness
  soreness_recommend_ice_heat: boolean; // acute soreness

  // === BACKUP & META ===
  soreness_data_json: string;
  soreness_last_updated: string;
  soreness_flattener_version: string;
}

// Helper function to create empty flattened structure
function createEmptySorenessFlattened(): EnhancedSorenessFlat {
  return {
    // BODY PART PRESENCE FLAGS
    soreness_has_neck: false,
    soreness_has_shoulders: false,
    soreness_has_upper_back: false,
    soreness_has_lower_back: false,
    soreness_has_chest: false,
    soreness_has_arms: false,
    soreness_has_wrists: false,
    soreness_has_elbows: false,
    soreness_has_abs_core: false,
    soreness_has_hips: false,
    soreness_has_glutes: false,
    soreness_has_thighs: false,
    soreness_has_hamstrings: false,
    soreness_has_knees: false,
    soreness_has_calves: false,
    soreness_has_ankles: false,

    // SORENESS LEVEL FLAGS (all body parts x 5 levels = 80 flags)
    soreness_neck_mild: false,
    soreness_neck_low_moderate: false,
    soreness_neck_moderate: false,
    soreness_neck_high: false,
    soreness_neck_severe: false,

    soreness_shoulders_mild: false,
    soreness_shoulders_low_moderate: false,
    soreness_shoulders_moderate: false,
    soreness_shoulders_high: false,
    soreness_shoulders_severe: false,

    soreness_upper_back_mild: false,
    soreness_upper_back_low_moderate: false,
    soreness_upper_back_moderate: false,
    soreness_upper_back_high: false,
    soreness_upper_back_severe: false,

    soreness_lower_back_mild: false,
    soreness_lower_back_low_moderate: false,
    soreness_lower_back_moderate: false,
    soreness_lower_back_high: false,
    soreness_lower_back_severe: false,

    soreness_chest_mild: false,
    soreness_chest_low_moderate: false,
    soreness_chest_moderate: false,
    soreness_chest_high: false,
    soreness_chest_severe: false,

    soreness_arms_mild: false,
    soreness_arms_low_moderate: false,
    soreness_arms_moderate: false,
    soreness_arms_high: false,
    soreness_arms_severe: false,

    soreness_wrists_mild: false,
    soreness_wrists_low_moderate: false,
    soreness_wrists_moderate: false,
    soreness_wrists_high: false,
    soreness_wrists_severe: false,

    soreness_elbows_mild: false,
    soreness_elbows_low_moderate: false,
    soreness_elbows_moderate: false,
    soreness_elbows_high: false,
    soreness_elbows_severe: false,

    soreness_abs_core_mild: false,
    soreness_abs_core_low_moderate: false,
    soreness_abs_core_moderate: false,
    soreness_abs_core_high: false,
    soreness_abs_core_severe: false,

    soreness_hips_mild: false,
    soreness_hips_low_moderate: false,
    soreness_hips_moderate: false,
    soreness_hips_high: false,
    soreness_hips_severe: false,

    soreness_glutes_mild: false,
    soreness_glutes_low_moderate: false,
    soreness_glutes_moderate: false,
    soreness_glutes_high: false,
    soreness_glutes_severe: false,

    soreness_thighs_mild: false,
    soreness_thighs_low_moderate: false,
    soreness_thighs_moderate: false,
    soreness_thighs_high: false,
    soreness_thighs_severe: false,

    soreness_hamstrings_mild: false,
    soreness_hamstrings_low_moderate: false,
    soreness_hamstrings_moderate: false,
    soreness_hamstrings_high: false,
    soreness_hamstrings_severe: false,

    soreness_knees_mild: false,
    soreness_knees_low_moderate: false,
    soreness_knees_moderate: false,
    soreness_knees_high: false,
    soreness_knees_severe: false,

    soreness_calves_mild: false,
    soreness_calves_low_moderate: false,
    soreness_calves_moderate: false,
    soreness_calves_high: false,
    soreness_calves_severe: false,

    soreness_ankles_mild: false,
    soreness_ankles_low_moderate: false,
    soreness_ankles_moderate: false,
    soreness_ankles_high: false,
    soreness_ankles_severe: false,

    // REGIONAL ANALYSIS
    soreness_has_upper_body: false,
    soreness_has_core: false,
    soreness_has_lower_body: false,
    soreness_has_back_issues: false,
    soreness_has_joint_issues: false,

    // SEVERITY ANALYSIS
    soreness_has_mild_only: false,
    soreness_has_moderate_levels: false,
    soreness_has_high_levels: false,
    soreness_has_severe_levels: false,
    soreness_mixed_severity: false,

    // IMPACT ASSESSMENT
    soreness_affects_upper_workouts: false,
    soreness_affects_lower_workouts: false,
    soreness_affects_core_workouts: false,
    soreness_affects_cardio: false,
    soreness_affects_flexibility: false,

    // WORKOUT MODIFICATION FLAGS
    soreness_needs_upper_modification: false,
    soreness_needs_lower_modification: false,
    soreness_needs_core_modification: false,
    soreness_needs_intensity_reduction: false,
    soreness_needs_recovery_focus: false,
    soreness_contraindicated_high_impact: false,

    // ANALYTICS & COUNTS
    soreness_total_areas: 0,
    soreness_mild_count: 0,
    soreness_moderate_count: 0,
    soreness_high_count: 0,
    soreness_average_level: 0,
    soreness_severity_score: 0,

    // RECOVERY RECOMMENDATIONS
    soreness_recommend_rest: false,
    soreness_recommend_active_recovery: false,
    soreness_recommend_mobility_work: false,
    soreness_recommend_massage: false,
    soreness_recommend_ice_heat: false,

    // BACKUP & META
    soreness_data_json: JSON.stringify(null),
    soreness_last_updated: new Date().toISOString(),
    soreness_flattener_version: '1.0.0',
  };
}

// Enhanced flattener function - generates comprehensive boolean flags
export function flattenSorenessData(
  data: CategoryRatingData | undefined
): EnhancedSorenessFlat {
  // Handle undefined/null input
  if (!data) {
    return createEmptySorenessFlattened();
  }

  const result = createEmptySorenessFlattened();

  // Process each body part and its rating
  const bodyParts = Object.keys(data).filter((key) => data[key].selected);
  const ratings: number[] = [];

  bodyParts.forEach((bodyPart) => {
    const categoryInfo = data[bodyPart];
    const rating = categoryInfo.rating;

    // Set presence flags
    switch (bodyPart) {
      case 'neck':
        result.soreness_has_neck = true;
        break;
      case 'shoulders':
        result.soreness_has_shoulders = true;
        break;
      case 'upper_back':
        result.soreness_has_upper_back = true;
        break;
      case 'lower_back':
        result.soreness_has_lower_back = true;
        break;
      case 'chest':
        result.soreness_has_chest = true;
        break;
      case 'arms':
        result.soreness_has_arms = true;
        break;
      case 'wrists':
        result.soreness_has_wrists = true;
        break;
      case 'elbows':
        result.soreness_has_elbows = true;
        break;
      case 'abs_core':
        result.soreness_has_abs_core = true;
        break;
      case 'hips':
        result.soreness_has_hips = true;
        break;
      case 'glutes':
        result.soreness_has_glutes = true;
        break;
      case 'thighs':
        result.soreness_has_thighs = true;
        break;
      case 'hamstrings':
        result.soreness_has_hamstrings = true;
        break;
      case 'knees':
        result.soreness_has_knees = true;
        break;
      case 'calves':
        result.soreness_has_calves = true;
        break;
      case 'ankles':
        result.soreness_has_ankles = true;
        break;
    }

    // Set level-specific flags if rating exists
    if (rating) {
      ratings.push(rating);

      switch (bodyPart) {
        case 'neck':
          if (rating === 1) result.soreness_neck_mild = true;
          else if (rating === 2) result.soreness_neck_low_moderate = true;
          else if (rating === 3) result.soreness_neck_moderate = true;
          else if (rating === 4) result.soreness_neck_high = true;
          else if (rating === 5) result.soreness_neck_severe = true;
          break;
        case 'shoulders':
          if (rating === 1) result.soreness_shoulders_mild = true;
          else if (rating === 2) result.soreness_shoulders_low_moderate = true;
          else if (rating === 3) result.soreness_shoulders_moderate = true;
          else if (rating === 4) result.soreness_shoulders_high = true;
          else if (rating === 5) result.soreness_shoulders_severe = true;
          break;
        case 'upper_back':
          if (rating === 1) result.soreness_upper_back_mild = true;
          else if (rating === 2) result.soreness_upper_back_low_moderate = true;
          else if (rating === 3) result.soreness_upper_back_moderate = true;
          else if (rating === 4) result.soreness_upper_back_high = true;
          else if (rating === 5) result.soreness_upper_back_severe = true;
          break;
        case 'lower_back':
          if (rating === 1) result.soreness_lower_back_mild = true;
          else if (rating === 2) result.soreness_lower_back_low_moderate = true;
          else if (rating === 3) result.soreness_lower_back_moderate = true;
          else if (rating === 4) result.soreness_lower_back_high = true;
          else if (rating === 5) result.soreness_lower_back_severe = true;
          break;
        case 'chest':
          if (rating === 1) result.soreness_chest_mild = true;
          else if (rating === 2) result.soreness_chest_low_moderate = true;
          else if (rating === 3) result.soreness_chest_moderate = true;
          else if (rating === 4) result.soreness_chest_high = true;
          else if (rating === 5) result.soreness_chest_severe = true;
          break;
        case 'arms':
          if (rating === 1) result.soreness_arms_mild = true;
          else if (rating === 2) result.soreness_arms_low_moderate = true;
          else if (rating === 3) result.soreness_arms_moderate = true;
          else if (rating === 4) result.soreness_arms_high = true;
          else if (rating === 5) result.soreness_arms_severe = true;
          break;
        case 'wrists':
          if (rating === 1) result.soreness_wrists_mild = true;
          else if (rating === 2) result.soreness_wrists_low_moderate = true;
          else if (rating === 3) result.soreness_wrists_moderate = true;
          else if (rating === 4) result.soreness_wrists_high = true;
          else if (rating === 5) result.soreness_wrists_severe = true;
          break;
        case 'elbows':
          if (rating === 1) result.soreness_elbows_mild = true;
          else if (rating === 2) result.soreness_elbows_low_moderate = true;
          else if (rating === 3) result.soreness_elbows_moderate = true;
          else if (rating === 4) result.soreness_elbows_high = true;
          else if (rating === 5) result.soreness_elbows_severe = true;
          break;
        case 'abs_core':
          if (rating === 1) result.soreness_abs_core_mild = true;
          else if (rating === 2) result.soreness_abs_core_low_moderate = true;
          else if (rating === 3) result.soreness_abs_core_moderate = true;
          else if (rating === 4) result.soreness_abs_core_high = true;
          else if (rating === 5) result.soreness_abs_core_severe = true;
          break;
        case 'hips':
          if (rating === 1) result.soreness_hips_mild = true;
          else if (rating === 2) result.soreness_hips_low_moderate = true;
          else if (rating === 3) result.soreness_hips_moderate = true;
          else if (rating === 4) result.soreness_hips_high = true;
          else if (rating === 5) result.soreness_hips_severe = true;
          break;
        case 'glutes':
          if (rating === 1) result.soreness_glutes_mild = true;
          else if (rating === 2) result.soreness_glutes_low_moderate = true;
          else if (rating === 3) result.soreness_glutes_moderate = true;
          else if (rating === 4) result.soreness_glutes_high = true;
          else if (rating === 5) result.soreness_glutes_severe = true;
          break;
        case 'thighs':
          if (rating === 1) result.soreness_thighs_mild = true;
          else if (rating === 2) result.soreness_thighs_low_moderate = true;
          else if (rating === 3) result.soreness_thighs_moderate = true;
          else if (rating === 4) result.soreness_thighs_high = true;
          else if (rating === 5) result.soreness_thighs_severe = true;
          break;
        case 'hamstrings':
          if (rating === 1) result.soreness_hamstrings_mild = true;
          else if (rating === 2) result.soreness_hamstrings_low_moderate = true;
          else if (rating === 3) result.soreness_hamstrings_moderate = true;
          else if (rating === 4) result.soreness_hamstrings_high = true;
          else if (rating === 5) result.soreness_hamstrings_severe = true;
          break;
        case 'knees':
          if (rating === 1) result.soreness_knees_mild = true;
          else if (rating === 2) result.soreness_knees_low_moderate = true;
          else if (rating === 3) result.soreness_knees_moderate = true;
          else if (rating === 4) result.soreness_knees_high = true;
          else if (rating === 5) result.soreness_knees_severe = true;
          break;
        case 'calves':
          if (rating === 1) result.soreness_calves_mild = true;
          else if (rating === 2) result.soreness_calves_low_moderate = true;
          else if (rating === 3) result.soreness_calves_moderate = true;
          else if (rating === 4) result.soreness_calves_high = true;
          else if (rating === 5) result.soreness_calves_severe = true;
          break;
        case 'ankles':
          if (rating === 1) result.soreness_ankles_mild = true;
          else if (rating === 2) result.soreness_ankles_low_moderate = true;
          else if (rating === 3) result.soreness_ankles_moderate = true;
          else if (rating === 4) result.soreness_ankles_high = true;
          else if (rating === 5) result.soreness_ankles_severe = true;
          break;
      }
    }
  });

  // Calculate regional analysis
  result.soreness_has_upper_body =
    result.soreness_has_neck ||
    result.soreness_has_shoulders ||
    result.soreness_has_upper_back ||
    result.soreness_has_chest ||
    result.soreness_has_arms ||
    result.soreness_has_wrists ||
    result.soreness_has_elbows;

  result.soreness_has_core =
    result.soreness_has_abs_core || result.soreness_has_lower_back;

  result.soreness_has_lower_body =
    result.soreness_has_hips ||
    result.soreness_has_glutes ||
    result.soreness_has_thighs ||
    result.soreness_has_hamstrings ||
    result.soreness_has_knees ||
    result.soreness_has_calves ||
    result.soreness_has_ankles;

  result.soreness_has_back_issues =
    result.soreness_has_upper_back || result.soreness_has_lower_back;
  result.soreness_has_joint_issues =
    result.soreness_has_wrists ||
    result.soreness_has_elbows ||
    result.soreness_has_knees ||
    result.soreness_has_ankles;

  // Calculate severity analysis
  const mildCount = ratings.filter((r) => r === 1).length;
  const moderateCount = ratings.filter((r) => r === 2 || r === 3).length;
  const highCount = ratings.filter((r) => r === 4 || r === 5).length;
  const severeCount = ratings.filter((r) => r === 5).length;

  result.soreness_has_mild_only =
    ratings.length > 0 && ratings.every((r) => r === 1);
  result.soreness_has_moderate_levels = moderateCount > 0;
  result.soreness_has_high_levels = highCount > 0;
  result.soreness_has_severe_levels = severeCount > 0;
  result.soreness_mixed_severity = new Set(ratings).size > 1;

  // Calculate impact assessment
  result.soreness_affects_upper_workouts = result.soreness_has_upper_body;
  result.soreness_affects_lower_workouts = result.soreness_has_lower_body;
  result.soreness_affects_core_workouts = result.soreness_has_core;
  result.soreness_affects_cardio =
    result.soreness_has_lower_body || result.soreness_has_joint_issues;
  result.soreness_affects_flexibility = ratings.some((r) => r >= 3);

  // Calculate workout modification needs
  result.soreness_needs_upper_modification =
    result.soreness_has_upper_body && ratings.some((r) => r >= 3);
  result.soreness_needs_lower_modification =
    result.soreness_has_lower_body && ratings.some((r) => r >= 3);
  result.soreness_needs_core_modification =
    result.soreness_has_core && ratings.some((r) => r >= 3);
  result.soreness_needs_intensity_reduction = ratings.some((r) => r >= 4);
  result.soreness_needs_recovery_focus = ratings.some((r) => r >= 3);
  result.soreness_contraindicated_high_impact =
    result.soreness_has_joint_issues && ratings.some((r) => r >= 4);

  // Calculate analytics
  result.soreness_total_areas = bodyParts.length;
  result.soreness_mild_count = mildCount;
  result.soreness_moderate_count = moderateCount;
  result.soreness_high_count = highCount;
  result.soreness_average_level =
    ratings.length > 0
      ? Math.round(
          (ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 10
        ) / 10
      : 0;

  // Calculate severity score (0-100)
  result.soreness_severity_score =
    ratings.length > 0
      ? Math.round(ratings.reduce((sum, r) => sum + r * 20, 0) / ratings.length)
      : 0;

  // Calculate recovery recommendations
  result.soreness_recommend_rest =
    result.soreness_severity_score >= 80 || severeCount > 0;
  result.soreness_recommend_active_recovery =
    result.soreness_severity_score >= 40 && result.soreness_severity_score < 80;
  result.soreness_recommend_mobility_work =
    result.soreness_has_joint_issues || result.soreness_has_back_issues;
  result.soreness_recommend_massage =
    result.soreness_has_upper_body || result.soreness_has_lower_body;
  result.soreness_recommend_ice_heat = ratings.some((r) => r >= 4);

  result.soreness_data_json = JSON.stringify(data);
  result.soreness_last_updated = new Date().toISOString();

  return result;
}

// Enhanced usage example
export function getSorenessSummary(flattened: EnhancedSorenessFlat): string {
  const parts = [];

  // Area count
  if (flattened.soreness_total_areas > 0) {
    parts.push(`${flattened.soreness_total_areas} sore areas`);
  }

  // Severity summary
  if (flattened.soreness_has_severe_levels) parts.push('Severe soreness');
  else if (flattened.soreness_has_high_levels) parts.push('High soreness');
  else if (flattened.soreness_has_moderate_levels)
    parts.push('Moderate soreness');
  else if (flattened.soreness_has_mild_only) parts.push('Mild soreness');

  // Regional summary
  const regions = [];
  if (flattened.soreness_has_upper_body) regions.push('Upper Body');
  if (flattened.soreness_has_core) regions.push('Core');
  if (flattened.soreness_has_lower_body) regions.push('Lower Body');

  if (regions.length > 0) {
    parts.push(regions.join(' + '));
  }

  // Special concerns
  if (flattened.soreness_has_back_issues) parts.push('Back Issues');
  if (flattened.soreness_has_joint_issues) parts.push('Joint Issues');

  // Recommendations
  if (flattened.soreness_recommend_rest) parts.push('Needs Rest');
  else if (flattened.soreness_recommend_active_recovery)
    parts.push('Active Recovery');

  return parts.join(' • ') || 'No soreness reported';
}
