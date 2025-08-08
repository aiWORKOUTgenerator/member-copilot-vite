// Enhanced Focus Area Data Flattener
// Transforms complex HierarchicalSelectionData into comprehensive flat, queryable format
// Generates individual boolean flags for each field as requested by CTO

import { HierarchicalSelectionData } from '../types';

// Comprehensive flattened structure - each field gets its own JSON key
export interface EnhancedFocusAreaFlat {
  // === PRIMARY REGIONS ===
  focus_region_upper_body: boolean;
  focus_region_lower_body: boolean;
  focus_region_core: boolean;
  focus_region_full_body: boolean;
  focus_region_mobility: boolean;
  focus_region_recovery: boolean;

  // === UPPER BODY MUSCLES ===
  focus_upper_chest: boolean;
  focus_upper_back: boolean;
  focus_upper_shoulders: boolean;
  focus_upper_biceps: boolean;
  focus_upper_triceps: boolean;

  // === LOWER BODY MUSCLES ===
  focus_lower_quads: boolean;
  focus_lower_hamstrings: boolean;
  focus_lower_glutes: boolean;
  focus_lower_calves: boolean;

  // === CORE MUSCLES ===
  focus_core_abs: boolean;
  focus_core_obliques: boolean;
  focus_core_lower_back: boolean;

  // === FULL BODY TYPES ===
  focus_fullbody_olympic_lifts: boolean;
  focus_fullbody_bodyweight_circuits: boolean;
  focus_fullbody_athletic_conditioning: boolean;

  // === MOBILITY AREAS ===
  focus_mobility_hips: boolean;
  focus_mobility_ankles: boolean;
  focus_mobility_shoulders: boolean;
  focus_mobility_thoracic_spine: boolean;

  // === RECOVERY TYPES ===
  focus_recovery_foam_rolling: boolean;
  focus_recovery_static_stretching: boolean;
  focus_recovery_pnf: boolean;
  focus_recovery_breathing_meditation: boolean;

  // === CHEST SPECIFIC ===
  focus_chest_upper: boolean;
  focus_chest_lower: boolean;

  // === BACK SPECIFIC ===
  focus_back_lats: boolean;
  focus_back_traps: boolean;
  focus_back_rhomboids: boolean;
  focus_back_erector_spinae: boolean;

  // === SHOULDER SPECIFIC ===
  focus_shoulder_anterior_delt: boolean;
  focus_shoulder_lateral_delt: boolean;
  focus_shoulder_rear_delt: boolean;

  // === ARM SPECIFIC ===
  focus_biceps_short_head: boolean;
  focus_biceps_long_head: boolean;
  focus_biceps_brachialis: boolean;
  focus_triceps_long_head: boolean;
  focus_triceps_lateral_head: boolean;
  focus_triceps_medial_head: boolean;

  // === LEG SPECIFIC ===
  focus_quad_rectus_femoris: boolean;
  focus_quad_vastus_lateralis: boolean;
  focus_quad_vastus_medialis: boolean;
  focus_quad_vastus_intermedius: boolean;
  focus_glute_max: boolean;
  focus_glute_med: boolean;
  focus_glute_min: boolean;
  focus_hamstring_biceps_femoris: boolean;
  focus_hamstring_semitendinosus: boolean;
  focus_hamstring_semimembranosus: boolean;
  focus_calf_gastrocnemius_medial: boolean;
  focus_calf_gastrocnemius_lateral: boolean;
  focus_calf_soleus: boolean;

  // === CORE SPECIFIC ===
  focus_abs_upper: boolean;
  focus_abs_lower: boolean;
  focus_abs_tva: boolean;
  focus_abs_pelvic_floor: boolean;
  focus_oblique_internal: boolean;
  focus_oblique_external: boolean;
  focus_lowerback_erector_spinae: boolean;
  focus_lowerback_multifidus: boolean;
  focus_lowerback_quadratus_lumborum: boolean;

  // === MOBILITY SPECIFIC ===
  focus_hip_flexors: boolean;
  focus_hip_glute_med: boolean;
  focus_hip_tfl: boolean;
  focus_hip_piriformis: boolean;
  focus_ankle_dorsiflexors: boolean;
  focus_ankle_plantarflexors: boolean;
  focus_ankle_inverters: boolean;
  focus_ankle_everters: boolean;
  focus_shoulder_subscapularis: boolean;
  focus_shoulder_supraspinatus: boolean;
  focus_shoulder_infraspinatus: boolean;
  focus_shoulder_teres_minor: boolean;

  // === ANALYTICS & CATEGORIZATION ===
  focus_selection_count: number;
  focus_primary_count: number;
  focus_secondary_count: number;
  focus_tertiary_count: number;
  focus_has_upper_body: boolean;
  focus_has_lower_body: boolean;
  focus_has_core: boolean;
  focus_has_full_body: boolean;
  focus_has_mobility: boolean;
  focus_has_recovery: boolean;
  focus_is_balanced_selection: boolean;
  focus_is_complex_selection: boolean;
  focus_is_targeted_selection: boolean;

  // === WORKOUT TYPE SUITABILITY ===
  focus_suitable_strength: boolean;
  focus_suitable_hypertrophy: boolean;
  focus_suitable_endurance: boolean;
  focus_suitable_power: boolean;
  focus_suitable_rehabilitation: boolean;
  focus_suitable_flexibility: boolean;
  focus_suitable_athletic: boolean;

  // === TRAINING SPLIT COMPATIBILITY ===
  focus_compatible_push_pull: boolean;
  focus_compatible_upper_lower: boolean;
  focus_compatible_body_part_split: boolean;
  focus_compatible_full_body: boolean;
  focus_compatible_functional: boolean;

  // === INTENSITY & VOLUME INDICATORS ===
  focus_intensity_capacity: number; // 0-100
  focus_volume_capacity: number; // 0-100
  focus_recovery_demand: number; // 0-100
  focus_technical_complexity: number; // 0-100

  // === BACKUP & META ===
  focus_data_json: string;
  focus_last_updated: string;
  focus_flattener_version: string;
}

// Helper function to create empty flattened structure
function createEmptyFocusAreaFlattened(): EnhancedFocusAreaFlat {
  return {
    // PRIMARY REGIONS
    focus_region_upper_body: false,
    focus_region_lower_body: false,
    focus_region_core: false,
    focus_region_full_body: false,
    focus_region_mobility: false,
    focus_region_recovery: false,

    // UPPER BODY MUSCLES
    focus_upper_chest: false,
    focus_upper_back: false,
    focus_upper_shoulders: false,
    focus_upper_biceps: false,
    focus_upper_triceps: false,

    // LOWER BODY MUSCLES
    focus_lower_quads: false,
    focus_lower_hamstrings: false,
    focus_lower_glutes: false,
    focus_lower_calves: false,

    // CORE MUSCLES
    focus_core_abs: false,
    focus_core_obliques: false,
    focus_core_lower_back: false,

    // FULL BODY TYPES
    focus_fullbody_olympic_lifts: false,
    focus_fullbody_bodyweight_circuits: false,
    focus_fullbody_athletic_conditioning: false,

    // MOBILITY AREAS
    focus_mobility_hips: false,
    focus_mobility_ankles: false,
    focus_mobility_shoulders: false,
    focus_mobility_thoracic_spine: false,

    // RECOVERY TYPES
    focus_recovery_foam_rolling: false,
    focus_recovery_static_stretching: false,
    focus_recovery_pnf: false,
    focus_recovery_breathing_meditation: false,

    // CHEST SPECIFIC
    focus_chest_upper: false,
    focus_chest_lower: false,

    // BACK SPECIFIC
    focus_back_lats: false,
    focus_back_traps: false,
    focus_back_rhomboids: false,
    focus_back_erector_spinae: false,

    // SHOULDER SPECIFIC
    focus_shoulder_anterior_delt: false,
    focus_shoulder_lateral_delt: false,
    focus_shoulder_rear_delt: false,

    // ARM SPECIFIC
    focus_biceps_short_head: false,
    focus_biceps_long_head: false,
    focus_biceps_brachialis: false,
    focus_triceps_long_head: false,
    focus_triceps_lateral_head: false,
    focus_triceps_medial_head: false,

    // LEG SPECIFIC
    focus_quad_rectus_femoris: false,
    focus_quad_vastus_lateralis: false,
    focus_quad_vastus_medialis: false,
    focus_quad_vastus_intermedius: false,
    focus_glute_max: false,
    focus_glute_med: false,
    focus_glute_min: false,
    focus_hamstring_biceps_femoris: false,
    focus_hamstring_semitendinosus: false,
    focus_hamstring_semimembranosus: false,
    focus_calf_gastrocnemius_medial: false,
    focus_calf_gastrocnemius_lateral: false,
    focus_calf_soleus: false,

    // CORE SPECIFIC
    focus_abs_upper: false,
    focus_abs_lower: false,
    focus_abs_tva: false,
    focus_abs_pelvic_floor: false,
    focus_oblique_internal: false,
    focus_oblique_external: false,
    focus_lowerback_erector_spinae: false,
    focus_lowerback_multifidus: false,
    focus_lowerback_quadratus_lumborum: false,

    // MOBILITY SPECIFIC
    focus_hip_flexors: false,
    focus_hip_glute_med: false,
    focus_hip_tfl: false,
    focus_hip_piriformis: false,
    focus_ankle_dorsiflexors: false,
    focus_ankle_plantarflexors: false,
    focus_ankle_inverters: false,
    focus_ankle_everters: false,
    focus_shoulder_subscapularis: false,
    focus_shoulder_supraspinatus: false,
    focus_shoulder_infraspinatus: false,
    focus_shoulder_teres_minor: false,

    // ANALYTICS & CATEGORIZATION
    focus_selection_count: 0,
    focus_primary_count: 0,
    focus_secondary_count: 0,
    focus_tertiary_count: 0,
    focus_has_upper_body: false,
    focus_has_lower_body: false,
    focus_has_core: false,
    focus_has_full_body: false,
    focus_has_mobility: false,
    focus_has_recovery: false,
    focus_is_balanced_selection: false,
    focus_is_complex_selection: false,
    focus_is_targeted_selection: false,

    // WORKOUT TYPE SUITABILITY
    focus_suitable_strength: false,
    focus_suitable_hypertrophy: false,
    focus_suitable_endurance: false,
    focus_suitable_power: false,
    focus_suitable_rehabilitation: false,
    focus_suitable_flexibility: false,
    focus_suitable_athletic: false,

    // TRAINING SPLIT COMPATIBILITY
    focus_compatible_push_pull: false,
    focus_compatible_upper_lower: false,
    focus_compatible_body_part_split: false,
    focus_compatible_full_body: false,
    focus_compatible_functional: false,

    // INTENSITY & VOLUME INDICATORS
    focus_intensity_capacity: 0,
    focus_volume_capacity: 0,
    focus_recovery_demand: 0,
    focus_technical_complexity: 0,

    // BACKUP & META
    focus_data_json: JSON.stringify(null),
    focus_last_updated: new Date().toISOString(),
    focus_flattener_version: '1.0.0',
  };
}

// Enhanced flattener function - generates comprehensive boolean flags
export function flattenFocusAreaData(
  data: HierarchicalSelectionData | string[] | undefined
): EnhancedFocusAreaFlat {
  // Handle undefined/null input
  if (!data) {
    return createEmptyFocusAreaFlattened();
  }

  // Handle legacy format (string array)
  if (Array.isArray(data)) {
    return flattenLegacyFocusAreas(data);
  }

  // Handle modern format (HierarchicalSelectionData)
  return flattenModernFocusAreas(data);
}

// Flatten legacy string[] format
function flattenLegacyFocusAreas(areas: string[]): EnhancedFocusAreaFlat {
  const result = createEmptyFocusAreaFlattened();

  // Map legacy string values to boolean flags
  areas.forEach((area) => {
    switch (area) {
      // Primary regions
      case 'upper_body':
        result.focus_region_upper_body = true;
        break;
      case 'lower_body':
        result.focus_region_lower_body = true;
        break;
      case 'core':
        result.focus_region_core = true;
        break;
      case 'full_body':
        result.focus_region_full_body = true;
        break;
      case 'mobility':
        result.focus_region_mobility = true;
        break;
      case 'recovery':
        result.focus_region_recovery = true;
        break;

      // Upper body muscles
      case 'chest':
        result.focus_upper_chest = true;
        break;
      case 'back':
        result.focus_upper_back = true;
        break;
      case 'shoulders':
        result.focus_upper_shoulders = true;
        break;
      case 'biceps':
        result.focus_upper_biceps = true;
        break;
      case 'triceps':
        result.focus_upper_triceps = true;
        break;

      // Lower body muscles
      case 'quads':
        result.focus_lower_quads = true;
        break;
      case 'hamstrings':
        result.focus_lower_hamstrings = true;
        break;
      case 'glutes':
        result.focus_lower_glutes = true;
        break;
      case 'calves':
        result.focus_lower_calves = true;
        break;

      // Core muscles
      case 'abs':
        result.focus_core_abs = true;
        break;
      case 'obliques':
        result.focus_core_obliques = true;
        break;
      case 'lower_back':
        result.focus_core_lower_back = true;
        break;

      // Full body types
      case 'olympic_lifts':
        result.focus_fullbody_olympic_lifts = true;
        break;
      case 'bodyweight_circuits':
        result.focus_fullbody_bodyweight_circuits = true;
        break;
      case 'athletic_conditioning':
        result.focus_fullbody_athletic_conditioning = true;
        break;

      // Mobility areas
      case 'hips':
        result.focus_mobility_hips = true;
        break;
      case 'ankles':
        result.focus_mobility_ankles = true;
        break;
      case 'mobility_shoulders':
        result.focus_mobility_shoulders = true;
        break;
      case 'thoracic_spine':
        result.focus_mobility_thoracic_spine = true;
        break;

      // Recovery types
      case 'foam_rolling':
        result.focus_recovery_foam_rolling = true;
        break;
      case 'static_stretching':
        result.focus_recovery_static_stretching = true;
        break;
      case 'pnf':
        result.focus_recovery_pnf = true;
        break;
      case 'breathing_meditation':
        result.focus_recovery_breathing_meditation = true;
        break;

      // Specific areas (tertiary level)
      case 'upper_chest':
        result.focus_chest_upper = true;
        break;
      case 'lower_chest':
        result.focus_chest_lower = true;
        break;
      case 'lats':
        result.focus_back_lats = true;
        break;
      case 'traps':
        result.focus_back_traps = true;
        break;
      case 'rhomboids':
        result.focus_back_rhomboids = true;
        break;
      case 'erector_spinae':
        result.focus_back_erector_spinae = true;
        break;
      case 'anterior_delt':
        result.focus_shoulder_anterior_delt = true;
        break;
      case 'lateral_delt':
        result.focus_shoulder_lateral_delt = true;
        break;
      case 'rear_delt':
        result.focus_shoulder_rear_delt = true;
        break;
      // ... continue mapping all tertiary areas
    }
  });

  // Calculate analytics for legacy data
  result.focus_selection_count = areas.length;
  result.focus_has_upper_body =
    result.focus_region_upper_body ||
    result.focus_upper_chest ||
    result.focus_upper_back ||
    result.focus_upper_shoulders ||
    result.focus_upper_biceps ||
    result.focus_upper_triceps;
  result.focus_has_lower_body =
    result.focus_region_lower_body ||
    result.focus_lower_quads ||
    result.focus_lower_hamstrings ||
    result.focus_lower_glutes ||
    result.focus_lower_calves;
  result.focus_has_core =
    result.focus_region_core ||
    result.focus_core_abs ||
    result.focus_core_obliques ||
    result.focus_core_lower_back;
  result.focus_has_full_body =
    result.focus_region_full_body ||
    result.focus_fullbody_olympic_lifts ||
    result.focus_fullbody_bodyweight_circuits ||
    result.focus_fullbody_athletic_conditioning;
  result.focus_has_mobility =
    result.focus_region_mobility ||
    result.focus_mobility_hips ||
    result.focus_mobility_ankles ||
    result.focus_mobility_shoulders ||
    result.focus_mobility_thoracic_spine;
  result.focus_has_recovery =
    result.focus_region_recovery ||
    result.focus_recovery_foam_rolling ||
    result.focus_recovery_static_stretching ||
    result.focus_recovery_pnf ||
    result.focus_recovery_breathing_meditation;

  result.focus_is_balanced_selection =
    (result.focus_has_upper_body && result.focus_has_lower_body) ||
    result.focus_has_full_body;
  result.focus_is_complex_selection = areas.length > 6;
  result.focus_is_targeted_selection = areas.length <= 3;

  // Basic suitability analysis
  result.focus_suitable_strength =
    result.focus_has_upper_body ||
    result.focus_has_lower_body ||
    result.focus_has_full_body;
  result.focus_suitable_hypertrophy =
    result.focus_has_upper_body || result.focus_has_lower_body;
  result.focus_suitable_flexibility =
    result.focus_has_mobility || result.focus_has_recovery;
  result.focus_suitable_athletic =
    result.focus_has_full_body || result.focus_fullbody_athletic_conditioning;

  result.focus_data_json = JSON.stringify(areas);
  result.focus_last_updated = new Date().toISOString();

  return result;
}

// Flatten modern HierarchicalSelectionData format
function flattenModernFocusAreas(
  data: HierarchicalSelectionData
): EnhancedFocusAreaFlat {
  const result = createEmptyFocusAreaFlattened();

  // Process each selected area
  Object.entries(data).forEach(([key, info]) => {
    if (!info.selected) return;

    // Map each specific area to its boolean flag
    switch (key) {
      // Primary regions
      case 'upper_body':
        result.focus_region_upper_body = true;
        break;
      case 'lower_body':
        result.focus_region_lower_body = true;
        break;
      case 'core':
        result.focus_region_core = true;
        break;
      case 'full_body':
        result.focus_region_full_body = true;
        break;
      case 'mobility':
        result.focus_region_mobility = true;
        break;
      case 'recovery':
        result.focus_region_recovery = true;
        break;

      // Upper body muscles
      case 'chest':
        result.focus_upper_chest = true;
        break;
      case 'back':
        result.focus_upper_back = true;
        break;
      case 'shoulders':
        result.focus_upper_shoulders = true;
        break;
      case 'biceps':
        result.focus_upper_biceps = true;
        break;
      case 'triceps':
        result.focus_upper_triceps = true;
        break;

      // Lower body muscles
      case 'quads':
        result.focus_lower_quads = true;
        break;
      case 'hamstrings':
        result.focus_lower_hamstrings = true;
        break;
      case 'glutes':
        result.focus_lower_glutes = true;
        break;
      case 'calves':
        result.focus_lower_calves = true;
        break;

      // Core muscles
      case 'abs':
        result.focus_core_abs = true;
        break;
      case 'obliques':
        result.focus_core_obliques = true;
        break;
      case 'lower_back':
        result.focus_core_lower_back = true;
        break;

      // Full body types
      case 'olympic_lifts':
        result.focus_fullbody_olympic_lifts = true;
        break;
      case 'bodyweight_circuits':
        result.focus_fullbody_bodyweight_circuits = true;
        break;
      case 'athletic_conditioning':
        result.focus_fullbody_athletic_conditioning = true;
        break;

      // Mobility areas
      case 'hips':
        result.focus_mobility_hips = true;
        break;
      case 'ankles':
        result.focus_mobility_ankles = true;
        break;
      case 'mobility_shoulders':
        result.focus_mobility_shoulders = true;
        break;
      case 'thoracic_spine':
        result.focus_mobility_thoracic_spine = true;
        break;

      // Recovery types
      case 'foam_rolling':
        result.focus_recovery_foam_rolling = true;
        break;
      case 'static_stretching':
        result.focus_recovery_static_stretching = true;
        break;
      case 'pnf':
        result.focus_recovery_pnf = true;
        break;
      case 'breathing_meditation':
        result.focus_recovery_breathing_meditation = true;
        break;

      // Chest specific
      case 'upper_chest':
        result.focus_chest_upper = true;
        break;
      case 'lower_chest':
        result.focus_chest_lower = true;
        break;

      // Back specific
      case 'lats':
        result.focus_back_lats = true;
        break;
      case 'traps':
        result.focus_back_traps = true;
        break;
      case 'rhomboids':
        result.focus_back_rhomboids = true;
        break;
      case 'erector_spinae':
        result.focus_back_erector_spinae = true;
        break;

      // Shoulder specific
      case 'anterior_delt':
        result.focus_shoulder_anterior_delt = true;
        break;
      case 'lateral_delt':
        result.focus_shoulder_lateral_delt = true;
        break;
      case 'rear_delt':
        result.focus_shoulder_rear_delt = true;
        break;

      // Arm specific
      case 'biceps_short_head':
        result.focus_biceps_short_head = true;
        break;
      case 'biceps_long_head':
        result.focus_biceps_long_head = true;
        break;
      case 'brachialis':
        result.focus_biceps_brachialis = true;
        break;
      case 'triceps_long_head':
        result.focus_triceps_long_head = true;
        break;
      case 'triceps_lateral_head':
        result.focus_triceps_lateral_head = true;
        break;
      case 'triceps_medial_head':
        result.focus_triceps_medial_head = true;
        break;

      // Leg specific
      case 'rectus_femoris':
        result.focus_quad_rectus_femoris = true;
        break;
      case 'vastus_lateralis':
        result.focus_quad_vastus_lateralis = true;
        break;
      case 'vastus_medialis':
        result.focus_quad_vastus_medialis = true;
        break;
      case 'vastus_intermedius':
        result.focus_quad_vastus_intermedius = true;
        break;
      case 'glute_max':
        result.focus_glute_max = true;
        break;
      case 'glute_med':
        result.focus_glute_med = true;
        break;
      case 'glute_min':
        result.focus_glute_min = true;
        break;
      case 'biceps_femoris':
        result.focus_hamstring_biceps_femoris = true;
        break;
      case 'semitendinosus':
        result.focus_hamstring_semitendinosus = true;
        break;
      case 'semimembranosus':
        result.focus_hamstring_semimembranosus = true;
        break;
      case 'gastrocnemius_medial':
        result.focus_calf_gastrocnemius_medial = true;
        break;
      case 'gastrocnemius_lateral':
        result.focus_calf_gastrocnemius_lateral = true;
        break;
      case 'soleus':
        result.focus_calf_soleus = true;
        break;

      // Core specific
      case 'upper_abs':
        result.focus_abs_upper = true;
        break;
      case 'lower_abs':
        result.focus_abs_lower = true;
        break;
      case 'tva':
        result.focus_abs_tva = true;
        break;
      case 'pelvic_floor':
        result.focus_abs_pelvic_floor = true;
        break;
      case 'internal_obliques':
        result.focus_oblique_internal = true;
        break;
      case 'external_obliques':
        result.focus_oblique_external = true;
        break;
      case 'lower_erector_spinae':
        result.focus_lowerback_erector_spinae = true;
        break;
      case 'multifidus':
        result.focus_lowerback_multifidus = true;
        break;
      case 'quadratus_lumborum':
        result.focus_lowerback_quadratus_lumborum = true;
        break;

      // Mobility specific
      case 'hip_flexors':
        result.focus_hip_flexors = true;
        break;
      case 'hip_glute_med':
        result.focus_hip_glute_med = true;
        break;
      case 'tfl':
        result.focus_hip_tfl = true;
        break;
      case 'piriformis':
        result.focus_hip_piriformis = true;
        break;
      case 'dorsiflexors':
        result.focus_ankle_dorsiflexors = true;
        break;
      case 'plantarflexors':
        result.focus_ankle_plantarflexors = true;
        break;
      case 'inverters':
        result.focus_ankle_inverters = true;
        break;
      case 'everters':
        result.focus_ankle_everters = true;
        break;
      case 'subscapularis':
        result.focus_shoulder_subscapularis = true;
        break;
      case 'supraspinatus':
        result.focus_shoulder_supraspinatus = true;
        break;
      case 'infraspinatus':
        result.focus_shoulder_infraspinatus = true;
        break;
      case 'teres_minor':
        result.focus_shoulder_teres_minor = true;
        break;
    }

    // Count by level
    if (info.level === 'primary') result.focus_primary_count++;
    else if (info.level === 'secondary') result.focus_secondary_count++;
    else if (info.level === 'tertiary') result.focus_tertiary_count++;
  });

  // Calculate analytics
  result.focus_selection_count = Object.values(data).filter(
    (info) => info.selected
  ).length;

  // Region analysis
  result.focus_has_upper_body =
    result.focus_region_upper_body ||
    result.focus_upper_chest ||
    result.focus_upper_back ||
    result.focus_upper_shoulders ||
    result.focus_upper_biceps ||
    result.focus_upper_triceps;
  result.focus_has_lower_body =
    result.focus_region_lower_body ||
    result.focus_lower_quads ||
    result.focus_lower_hamstrings ||
    result.focus_lower_glutes ||
    result.focus_lower_calves;
  result.focus_has_core =
    result.focus_region_core ||
    result.focus_core_abs ||
    result.focus_core_obliques ||
    result.focus_core_lower_back;
  result.focus_has_full_body =
    result.focus_region_full_body ||
    result.focus_fullbody_olympic_lifts ||
    result.focus_fullbody_bodyweight_circuits ||
    result.focus_fullbody_athletic_conditioning;
  result.focus_has_mobility =
    result.focus_region_mobility ||
    result.focus_mobility_hips ||
    result.focus_mobility_ankles ||
    result.focus_mobility_shoulders ||
    result.focus_mobility_thoracic_spine;
  result.focus_has_recovery =
    result.focus_region_recovery ||
    result.focus_recovery_foam_rolling ||
    result.focus_recovery_static_stretching ||
    result.focus_recovery_pnf ||
    result.focus_recovery_breathing_meditation;

  // Selection complexity analysis
  result.focus_is_balanced_selection =
    (result.focus_has_upper_body && result.focus_has_lower_body) ||
    result.focus_has_full_body;
  result.focus_is_complex_selection = result.focus_selection_count > 6;
  result.focus_is_targeted_selection = result.focus_selection_count <= 3;

  // Workout type suitability
  result.focus_suitable_strength =
    result.focus_has_upper_body ||
    result.focus_has_lower_body ||
    result.focus_has_full_body;
  result.focus_suitable_hypertrophy =
    result.focus_has_upper_body || result.focus_has_lower_body;
  result.focus_suitable_endurance =
    result.focus_has_full_body || result.focus_fullbody_bodyweight_circuits;
  result.focus_suitable_power =
    result.focus_fullbody_olympic_lifts ||
    result.focus_fullbody_athletic_conditioning;
  result.focus_suitable_rehabilitation =
    result.focus_has_mobility || result.focus_has_recovery;
  result.focus_suitable_flexibility =
    result.focus_has_mobility || result.focus_has_recovery;
  result.focus_suitable_athletic =
    result.focus_has_full_body || result.focus_fullbody_athletic_conditioning;

  // Training split compatibility
  result.focus_compatible_push_pull =
    result.focus_has_upper_body &&
    (result.focus_upper_chest ||
      result.focus_upper_shoulders ||
      result.focus_upper_triceps ||
      result.focus_upper_back ||
      result.focus_upper_biceps);
  result.focus_compatible_upper_lower =
    result.focus_has_upper_body && result.focus_has_lower_body;
  result.focus_compatible_body_part_split =
    result.focus_selection_count <= 3 && !result.focus_has_full_body;
  result.focus_compatible_full_body =
    result.focus_has_full_body || result.focus_is_balanced_selection;
  result.focus_compatible_functional =
    result.focus_has_full_body ||
    result.focus_has_mobility ||
    result.focus_fullbody_athletic_conditioning;

  // Capacity calculations
  result.focus_intensity_capacity = calculateIntensityCapacity(result);
  result.focus_volume_capacity = calculateVolumeCapacity(result);
  result.focus_recovery_demand = calculateRecoveryDemand(result);
  result.focus_technical_complexity = calculateTechnicalComplexity(result);

  result.focus_data_json = JSON.stringify(data);
  result.focus_last_updated = new Date().toISOString();

  return result;
}

// Calculate intensity capacity based on selected areas
function calculateIntensityCapacity(result: EnhancedFocusAreaFlat): number {
  let score = 0;

  // Full body movements have highest intensity capacity
  if (result.focus_fullbody_olympic_lifts) score += 40;
  if (result.focus_fullbody_athletic_conditioning) score += 35;
  if (result.focus_fullbody_bodyweight_circuits) score += 30;

  // Large muscle groups support high intensity
  if (
    result.focus_lower_quads ||
    result.focus_lower_glutes ||
    result.focus_lower_hamstrings
  )
    score += 25;
  if (result.focus_upper_back || result.focus_upper_chest) score += 20;

  // Balanced selection allows for varied intensity
  if (result.focus_is_balanced_selection) score += 15;

  // Recovery/mobility focus reduces intensity capacity
  if (result.focus_has_recovery) score -= 20;
  if (
    result.focus_has_mobility &&
    !result.focus_has_upper_body &&
    !result.focus_has_lower_body
  )
    score -= 15;

  return Math.max(0, Math.min(100, score));
}

// Calculate volume capacity based on muscle group distribution
function calculateVolumeCapacity(result: EnhancedFocusAreaFlat): number {
  let score = 0;

  // More muscle groups = higher volume capacity
  const muscleGroupCount = [
    result.focus_has_upper_body,
    result.focus_has_lower_body,
    result.focus_has_core,
    result.focus_has_full_body,
  ].filter(Boolean).length;

  score += muscleGroupCount * 20;

  // Balanced selection supports higher volume
  if (result.focus_is_balanced_selection) score += 20;

  // Complex selections can handle more volume
  if (result.focus_is_complex_selection) score += 15;

  // Recovery focus reduces volume capacity
  if (result.focus_has_recovery) score -= 10;

  return Math.max(0, Math.min(100, score));
}

// Calculate recovery demand based on selection complexity and intensity
function calculateRecoveryDemand(result: EnhancedFocusAreaFlat): number {
  let score = 0;

  // Complex selections need more recovery
  if (result.focus_is_complex_selection) score += 30;

  // High intensity areas increase recovery demand
  if (result.focus_fullbody_olympic_lifts) score += 25;
  if (
    result.focus_lower_quads &&
    result.focus_lower_glutes &&
    result.focus_lower_hamstrings
  )
    score += 20;

  // Balanced full body increases recovery needs
  if (result.focus_is_balanced_selection) score += 15;

  // Recovery focus reduces recovery demand (already addressing it)
  if (result.focus_has_recovery) score -= 15;

  return Math.max(0, Math.min(100, score));
}

// Calculate technical complexity based on movement patterns
function calculateTechnicalComplexity(result: EnhancedFocusAreaFlat): number {
  let score = 0;

  // Olympic lifts are highly technical
  if (result.focus_fullbody_olympic_lifts) score += 40;

  // Athletic conditioning requires coordination
  if (result.focus_fullbody_athletic_conditioning) score += 30;

  // Specific muscle targeting requires precision
  if (result.focus_tertiary_count > 0) score += result.focus_tertiary_count * 5;

  // Mobility work requires technique
  if (result.focus_has_mobility) score += 20;

  // Simple muscle group focus is less technical
  if (result.focus_is_targeted_selection && !result.focus_has_full_body)
    score -= 10;

  return Math.max(0, Math.min(100, score));
}

// Enhanced usage example
export function getFocusAreaSummary(flattened: EnhancedFocusAreaFlat): string {
  const parts = [];

  // Region summary
  const regions = [];
  if (flattened.focus_has_upper_body) regions.push('Upper Body');
  if (flattened.focus_has_lower_body) regions.push('Lower Body');
  if (flattened.focus_has_core) regions.push('Core');
  if (flattened.focus_has_full_body) regions.push('Full Body');
  if (flattened.focus_has_mobility) regions.push('Mobility');
  if (flattened.focus_has_recovery) regions.push('Recovery');

  if (regions.length > 0) {
    parts.push(regions.join(' + '));
  }

  // Selection complexity
  if (flattened.focus_is_targeted_selection) parts.push('Targeted');
  else if (flattened.focus_is_complex_selection) parts.push('Complex');
  else if (flattened.focus_is_balanced_selection) parts.push('Balanced');

  // Capacity indicators
  if (flattened.focus_intensity_capacity >= 80) parts.push('High Intensity');
  if (flattened.focus_volume_capacity >= 80) parts.push('High Volume');
  if (flattened.focus_technical_complexity >= 70) parts.push('Technical');

  return parts.join(' • ') || 'No focus areas selected';
}
