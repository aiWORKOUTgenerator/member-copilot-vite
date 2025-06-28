// Enhanced Exclude Exercises Data Flattener
// Transforms exclude exercises string into comprehensive flat, queryable format
// Generates individual boolean flags for each field as requested by CTO

// Exercise exclusion data structure for analysis
const EXERCISE_EXCLUSION_CATEGORIES = {
  "Full Body": [
    "Burpees", "Man Makers", "Jumping Jacks (for joint issues)", "Thrusters (barbell)",
    "Wall Balls (shoulder strain)", "Box Jumps", "Mountain Climbers (for wrist/back issues)", "High-Rep Complexes (fatigue risk)"
  ],
  "Lower Body": [
    "Deep Jump Squats", "Sissy Squats", "Barbell Back Squats (for beginners)", "Pistol Squats (advanced balance requirement)",
    "Hack Squats (machine loading issues)", "Walking Lunges (space/joint tolerance)", "Good Mornings", "Box Step-Ups with High Load"
  ],
  "Upper Body": [
    "Behind-the-Neck Press", "Kipping Pull-Ups", "Heavy Upright Rows", "Dips on Straight Bars",
    "Push Press (for shoulder instability)", "Arnold Press (range conflicts)", "Barbell Bench Press (at home without spotter)", "Heavy Overhead Press (limited mobility)"
  ],
  "Core & Stability": [
    "Sit-Ups (lumbar stress)", "Superman Holds (spinal compression)", "Windshield Wipers", "Crunches (cervical strain)",
    "Toe-to-Bar (skill floor too high)", "V-Ups (tight hip flexors)", "Weighted Russian Twists", "Planks Over 1 Minute (fatigue > quality)"
  ],
  "Mobility & Corrective / Recovery": [
    "Standing Toe Touches (ballistic)", "Seated Forward Fold (lower back load)", "Unsupported Wall Sits >1 min", "Hip Circles (awkward/confusing)",
    "Excessive Foam Rolling (overuse or bruising)", "Unsupported Deep Squat Hold", "Overhead Shoulder CARs (poor cueing = risk)", "Ballistic Arm Swings"
  ]
};

// Risk classifications for analysis
const EXERCISE_RISK_CLASSIFICATIONS = {
  high_injury_risk: [
    "behind-the-neck press", "sit-ups", "crunches", "superman holds", "good mornings", "heavy upright rows"
  ],
  joint_stress: [
    "jumping jacks", "deep jump squats", "sissy squats", "dips on straight bars", "ballistic"
  ],
  skill_demanding: [
    "pistol squats", "kipping pull-ups", "toe-to-bar", "man makers", "arnold press"
  ],
  equipment_dependent: [
    "barbell", "hack squats", "box jumps", "wall balls", "machine loading"
  ],
  spine_risky: [
    "sit-ups", "crunches", "superman holds", "windshield wipers", "seated forward fold"
  ],
  shoulder_risky: [
    "behind-the-neck press", "wall balls", "push press", "arnold press", "overhead press"
  ],
  beginner_unsafe: [
    "barbell back squats", "kipping pull-ups", "pistol squats", "behind-the-neck press"
  ],
  fatigue_risk: [
    "high-rep complexes", "planks over 1 minute", "excessive foam rolling", "unsupported wall sits"
  ]
};

// Comprehensive flattened structure
export interface EnhancedExcludeExercisesFlat {
  // === EXCLUSION CATEGORY PRESENCE FLAGS ===
  exclusions_has_full_body: boolean;
  exclusions_has_lower_body: boolean;
  exclusions_has_upper_body: boolean;
  exclusions_has_core_stability: boolean;
  exclusions_has_mobility_recovery: boolean;
  exclusions_has_custom_specified: boolean;
  
  // === SPECIFIC EXERCISE EXCLUSIONS ===
  // Full Body exclusions
  exclusions_excludes_burpees: boolean;
  exclusions_excludes_man_makers: boolean;
  exclusions_excludes_jumping_jacks: boolean;
  exclusions_excludes_thrusters: boolean;
  exclusions_excludes_wall_balls: boolean;
  exclusions_excludes_box_jumps: boolean;
  exclusions_excludes_mountain_climbers: boolean;
  exclusions_excludes_high_rep_complexes: boolean;
  
  // Lower Body exclusions
  exclusions_excludes_deep_jump_squats: boolean;
  exclusions_excludes_sissy_squats: boolean;
  exclusions_excludes_barbell_back_squats: boolean;
  exclusions_excludes_pistol_squats: boolean;
  exclusions_excludes_hack_squats: boolean;
  exclusions_excludes_walking_lunges: boolean;
  exclusions_excludes_good_mornings: boolean;
  exclusions_excludes_box_step_ups: boolean;
  
  // Upper Body exclusions
  exclusions_excludes_behind_neck_press: boolean;
  exclusions_excludes_kipping_pull_ups: boolean;
  exclusions_excludes_heavy_upright_rows: boolean;
  exclusions_excludes_dips_straight_bars: boolean;
  exclusions_excludes_push_press: boolean;
  exclusions_excludes_arnold_press: boolean;
  exclusions_excludes_barbell_bench_press: boolean;
  exclusions_excludes_heavy_overhead_press: boolean;
  
  // Core & Stability exclusions
  exclusions_excludes_sit_ups: boolean;
  exclusions_excludes_superman_holds: boolean;
  exclusions_excludes_windshield_wipers: boolean;
  exclusions_excludes_crunches: boolean;
  exclusions_excludes_toe_to_bar: boolean;
  exclusions_excludes_v_ups: boolean;
  exclusions_excludes_weighted_russian_twists: boolean;
  exclusions_excludes_long_planks: boolean;
  
  // Mobility & Recovery exclusions
  exclusions_excludes_standing_toe_touches: boolean;
  exclusions_excludes_seated_forward_fold: boolean;
  exclusions_excludes_unsupported_wall_sits: boolean;
  exclusions_excludes_hip_circles: boolean;
  exclusions_excludes_excessive_foam_rolling: boolean;
  exclusions_excludes_deep_squat_hold: boolean;
  exclusions_excludes_overhead_shoulder_cars: boolean;
  exclusions_excludes_ballistic_arm_swings: boolean;
  
  // === RISK CATEGORY ANALYSIS ===
  exclusions_avoids_high_injury_risk: boolean;
  exclusions_avoids_joint_stress: boolean;
  exclusions_avoids_skill_demanding: boolean;
  exclusions_avoids_equipment_dependent: boolean;
  exclusions_avoids_spine_risky: boolean;
  exclusions_avoids_shoulder_risky: boolean;
  exclusions_avoids_beginner_unsafe: boolean;
  exclusions_avoids_fatigue_risk: boolean;
  
  // === BODY REGION PROTECTION ===
  exclusions_protects_lower_back: boolean;
  exclusions_protects_shoulders: boolean;
  exclusions_protects_knees: boolean;
  exclusions_protects_wrists: boolean;
  exclusions_protects_neck: boolean;
  exclusions_protects_spine: boolean;
  exclusions_protects_hips: boolean;
  exclusions_protects_ankles: boolean;
  
  // === MOVEMENT PATTERN AVOIDANCE ===
  exclusions_avoids_ballistic_movements: boolean;
  exclusions_avoids_high_impact: boolean;
  exclusions_avoids_overhead_movements: boolean;
  exclusions_avoids_spinal_flexion: boolean;
  exclusions_avoids_spinal_extension: boolean;
  exclusions_avoids_rotation_under_load: boolean;
  exclusions_avoids_single_leg_balance: boolean;
  exclusions_avoids_plyometric_movements: boolean;
  
  // === EQUIPMENT AVOIDANCE ===
  exclusions_avoids_barbell_exercises: boolean;
  exclusions_avoids_machine_exercises: boolean;
  exclusions_avoids_box_equipment: boolean;
  exclusions_avoids_wall_exercises: boolean;
  exclusions_avoids_foam_roller: boolean;
  exclusions_avoids_weighted_movements: boolean;
  exclusions_avoids_hanging_exercises: boolean;
  exclusions_avoids_floor_exercises: boolean;
  
  // === WORKOUT SAFETY IMPLICATIONS ===
  exclusions_indicates_beginner_level: boolean;
  exclusions_indicates_injury_history: boolean;
  exclusions_indicates_equipment_limitations: boolean;
  exclusions_indicates_space_limitations: boolean;
  exclusions_indicates_skill_limitations: boolean;
  exclusions_indicates_mobility_limitations: boolean;
  exclusions_indicates_strength_limitations: boolean;
  exclusions_indicates_balance_limitations: boolean;
  
  // === TRAINING ADAPTATIONS NEEDED ===
  exclusions_requires_low_impact: boolean;
  exclusions_requires_joint_friendly: boolean;
  exclusions_requires_simple_movements: boolean;
  exclusions_requires_bodyweight_only: boolean;
  exclusions_requires_supported_movements: boolean;
  exclusions_requires_controlled_movements: boolean;
  exclusions_requires_short_duration: boolean;
  exclusions_requires_minimal_equipment: boolean;
  
  // === PROGRAM DESIGN IMPLICATIONS ===
  exclusions_limits_exercise_variety: boolean;
  exclusions_limits_intensity_options: boolean;
  exclusions_limits_equipment_usage: boolean;
  exclusions_limits_movement_patterns: boolean;
  exclusions_requires_modifications: boolean;
  exclusions_requires_progressions: boolean;
  exclusions_requires_alternatives: boolean;
  exclusions_requires_supervision: boolean;
  
  // === ALTERNATIVE FOCUS AREAS ===
  exclusions_suggests_flexibility_focus: boolean;
  exclusions_suggests_stability_focus: boolean;
  exclusions_suggests_endurance_focus: boolean;
  exclusions_suggests_strength_foundation: boolean;
  exclusions_suggests_movement_quality: boolean;
  exclusions_suggests_pain_free_movement: boolean;
  exclusions_suggests_gradual_progression: boolean;
  exclusions_suggests_supported_practice: boolean;
  
  // === SAFETY RECOMMENDATIONS ===
  exclusions_recommend_medical_clearance: boolean;
  exclusions_recommend_movement_assessment: boolean;
  exclusions_recommend_professional_guidance: boolean;
  exclusions_recommend_gradual_introduction: boolean;
  exclusions_recommend_modified_movements: boolean;
  exclusions_recommend_alternative_exercises: boolean;
  exclusions_recommend_equipment_alternatives: boolean;
  exclusions_recommend_space_alternatives: boolean;
  
  // === ANALYTICS & COUNTS ===
  exclusions_total_count: number;
  exclusions_category_count: number;
  exclusions_custom_count: number;
  exclusions_selected_count: number;
  exclusions_risk_level_score: number;
  exclusions_limitation_score: number;
  exclusions_modification_complexity: number;
  exclusions_safety_priority_score: number;
  exclusions_alternative_needs_score: number;
  exclusions_equipment_restrictions: number;
  
  // === WORKOUT PLANNING GUIDANCE ===
  exclusions_prioritize_safety: boolean;
  exclusions_prioritize_modifications: boolean;
  exclusions_prioritize_alternatives: boolean;
  exclusions_prioritize_progression: boolean;
  exclusions_prioritize_support: boolean;
  exclusions_prioritize_simplicity: boolean;
  exclusions_prioritize_low_impact: boolean;
  exclusions_prioritize_pain_free: boolean;
  
  // === BACKUP & META ===
  exclusions_raw_input: string;
  exclusions_parsed_exclusions: string;
  exclusions_last_updated: string;
  exclusions_flattener_version: string;
}

// Helper function to create empty flattened structure
function createEmptyExcludeExercisesFlattened(): EnhancedExcludeExercisesFlat {
  return {
    // EXCLUSION CATEGORY PRESENCE FLAGS
    exclusions_has_full_body: false,
    exclusions_has_lower_body: false,
    exclusions_has_upper_body: false,
    exclusions_has_core_stability: false,
    exclusions_has_mobility_recovery: false,
    exclusions_has_custom_specified: false,
    
    // SPECIFIC EXERCISE EXCLUSIONS
    exclusions_excludes_burpees: false,
    exclusions_excludes_man_makers: false,
    exclusions_excludes_jumping_jacks: false,
    exclusions_excludes_thrusters: false,
    exclusions_excludes_wall_balls: false,
    exclusions_excludes_box_jumps: false,
    exclusions_excludes_mountain_climbers: false,
    exclusions_excludes_high_rep_complexes: false,
    
    exclusions_excludes_deep_jump_squats: false,
    exclusions_excludes_sissy_squats: false,
    exclusions_excludes_barbell_back_squats: false,
    exclusions_excludes_pistol_squats: false,
    exclusions_excludes_hack_squats: false,
    exclusions_excludes_walking_lunges: false,
    exclusions_excludes_good_mornings: false,
    exclusions_excludes_box_step_ups: false,
    
    exclusions_excludes_behind_neck_press: false,
    exclusions_excludes_kipping_pull_ups: false,
    exclusions_excludes_heavy_upright_rows: false,
    exclusions_excludes_dips_straight_bars: false,
    exclusions_excludes_push_press: false,
    exclusions_excludes_arnold_press: false,
    exclusions_excludes_barbell_bench_press: false,
    exclusions_excludes_heavy_overhead_press: false,
    
    exclusions_excludes_sit_ups: false,
    exclusions_excludes_superman_holds: false,
    exclusions_excludes_windshield_wipers: false,
    exclusions_excludes_crunches: false,
    exclusions_excludes_toe_to_bar: false,
    exclusions_excludes_v_ups: false,
    exclusions_excludes_weighted_russian_twists: false,
    exclusions_excludes_long_planks: false,
    
    exclusions_excludes_standing_toe_touches: false,
    exclusions_excludes_seated_forward_fold: false,
    exclusions_excludes_unsupported_wall_sits: false,
    exclusions_excludes_hip_circles: false,
    exclusions_excludes_excessive_foam_rolling: false,
    exclusions_excludes_deep_squat_hold: false,
    exclusions_excludes_overhead_shoulder_cars: false,
    exclusions_excludes_ballistic_arm_swings: false,
    
    // RISK CATEGORY ANALYSIS
    exclusions_avoids_high_injury_risk: false,
    exclusions_avoids_joint_stress: false,
    exclusions_avoids_skill_demanding: false,
    exclusions_avoids_equipment_dependent: false,
    exclusions_avoids_spine_risky: false,
    exclusions_avoids_shoulder_risky: false,
    exclusions_avoids_beginner_unsafe: false,
    exclusions_avoids_fatigue_risk: false,
    
    // BODY REGION PROTECTION
    exclusions_protects_lower_back: false,
    exclusions_protects_shoulders: false,
    exclusions_protects_knees: false,
    exclusions_protects_wrists: false,
    exclusions_protects_neck: false,
    exclusions_protects_spine: false,
    exclusions_protects_hips: false,
    exclusions_protects_ankles: false,
    
    // MOVEMENT PATTERN AVOIDANCE
    exclusions_avoids_ballistic_movements: false,
    exclusions_avoids_high_impact: false,
    exclusions_avoids_overhead_movements: false,
    exclusions_avoids_spinal_flexion: false,
    exclusions_avoids_spinal_extension: false,
    exclusions_avoids_rotation_under_load: false,
    exclusions_avoids_single_leg_balance: false,
    exclusions_avoids_plyometric_movements: false,
    
    // EQUIPMENT AVOIDANCE
    exclusions_avoids_barbell_exercises: false,
    exclusions_avoids_machine_exercises: false,
    exclusions_avoids_box_equipment: false,
    exclusions_avoids_wall_exercises: false,
    exclusions_avoids_foam_roller: false,
    exclusions_avoids_weighted_movements: false,
    exclusions_avoids_hanging_exercises: false,
    exclusions_avoids_floor_exercises: false,
    
    // WORKOUT SAFETY IMPLICATIONS
    exclusions_indicates_beginner_level: false,
    exclusions_indicates_injury_history: false,
    exclusions_indicates_equipment_limitations: false,
    exclusions_indicates_space_limitations: false,
    exclusions_indicates_skill_limitations: false,
    exclusions_indicates_mobility_limitations: false,
    exclusions_indicates_strength_limitations: false,
    exclusions_indicates_balance_limitations: false,
    
    // TRAINING ADAPTATIONS NEEDED
    exclusions_requires_low_impact: false,
    exclusions_requires_joint_friendly: false,
    exclusions_requires_simple_movements: false,
    exclusions_requires_bodyweight_only: false,
    exclusions_requires_supported_movements: false,
    exclusions_requires_controlled_movements: false,
    exclusions_requires_short_duration: false,
    exclusions_requires_minimal_equipment: false,
    
    // PROGRAM DESIGN IMPLICATIONS
    exclusions_limits_exercise_variety: false,
    exclusions_limits_intensity_options: false,
    exclusions_limits_equipment_usage: false,
    exclusions_limits_movement_patterns: false,
    exclusions_requires_modifications: false,
    exclusions_requires_progressions: false,
    exclusions_requires_alternatives: false,
    exclusions_requires_supervision: false,
    
    // ALTERNATIVE FOCUS AREAS
    exclusions_suggests_flexibility_focus: false,
    exclusions_suggests_stability_focus: false,
    exclusions_suggests_endurance_focus: false,
    exclusions_suggests_strength_foundation: false,
    exclusions_suggests_movement_quality: false,
    exclusions_suggests_pain_free_movement: false,
    exclusions_suggests_gradual_progression: false,
    exclusions_suggests_supported_practice: false,
    
    // SAFETY RECOMMENDATIONS
    exclusions_recommend_medical_clearance: false,
    exclusions_recommend_movement_assessment: false,
    exclusions_recommend_professional_guidance: false,
    exclusions_recommend_gradual_introduction: false,
    exclusions_recommend_modified_movements: false,
    exclusions_recommend_alternative_exercises: false,
    exclusions_recommend_equipment_alternatives: false,
    exclusions_recommend_space_alternatives: false,
    
    // ANALYTICS & COUNTS
    exclusions_total_count: 0,
    exclusions_category_count: 0,
    exclusions_custom_count: 0,
    exclusions_selected_count: 0,
    exclusions_risk_level_score: 0,
    exclusions_limitation_score: 0,
    exclusions_modification_complexity: 0,
    exclusions_safety_priority_score: 0,
    exclusions_alternative_needs_score: 0,
    exclusions_equipment_restrictions: 0,
    
    // WORKOUT PLANNING GUIDANCE
    exclusions_prioritize_safety: false,
    exclusions_prioritize_modifications: false,
    exclusions_prioritize_alternatives: false,
    exclusions_prioritize_progression: false,
    exclusions_prioritize_support: false,
    exclusions_prioritize_simplicity: false,
    exclusions_prioritize_low_impact: false,
    exclusions_prioritize_pain_free: false,
    
    // BACKUP & META
    exclusions_raw_input: "",
    exclusions_parsed_exclusions: "",
    exclusions_last_updated: new Date().toISOString(),
    exclusions_flattener_version: "1.0.0"
  };
}

// Helper function to normalize exercise names for comparison
function normalizeExerciseName(name: string): string {
  return name.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper function to check if exercise matches any risk classification
function exerciseMatchesRiskClassification(exercise: string, classification: string[]): boolean {
  const normalizedExercise = normalizeExerciseName(exercise);
  return classification.some(term => normalizedExercise.includes(term.toLowerCase()));
}

// Enhanced flattener function
export function flattenExcludeExercisesData(data: string | undefined): EnhancedExcludeExercisesFlat {
  // Handle undefined/null input
  if (!data || typeof data !== 'string') {
    return createEmptyExcludeExercisesFlattened();
  }
  
  const result = createEmptyExcludeExercisesFlattened();
  
  // Parse the input to separate custom text and selected exercises
  const { customText, selectedExercises } = parseExerciseInput(data);
  
  // Get all exclusions (custom + selected)
  const allExclusions = [...customText, ...selectedExercises];
  
  // Set basic flags
  result.exclusions_has_custom_specified = customText.length > 0;
  result.exclusions_total_count = allExclusions.length;
  result.exclusions_custom_count = customText.length;
  result.exclusions_selected_count = selectedExercises.length;
  
  // Check category presence and specific exercise exclusions
  Object.entries(EXERCISE_EXCLUSION_CATEGORIES).forEach(([category, exercises]) => {
    const categoryHasExclusions = exercises.some(ex => 
      selectedExercises.some(selected => normalizeExerciseName(selected) === normalizeExerciseName(ex))
    );
    
    switch (category) {
      case "Full Body":
        result.exclusions_has_full_body = categoryHasExclusions;
        result.exclusions_excludes_burpees = checkExerciseExcluded("burpees", allExclusions);
        result.exclusions_excludes_man_makers = checkExerciseExcluded("man makers", allExclusions);
        result.exclusions_excludes_jumping_jacks = checkExerciseExcluded("jumping jacks", allExclusions);
        result.exclusions_excludes_thrusters = checkExerciseExcluded("thrusters", allExclusions);
        result.exclusions_excludes_wall_balls = checkExerciseExcluded("wall balls", allExclusions);
        result.exclusions_excludes_box_jumps = checkExerciseExcluded("box jumps", allExclusions);
        result.exclusions_excludes_mountain_climbers = checkExerciseExcluded("mountain climbers", allExclusions);
        result.exclusions_excludes_high_rep_complexes = checkExerciseExcluded("high-rep complexes", allExclusions);
        break;
      case "Lower Body":
        result.exclusions_has_lower_body = categoryHasExclusions;
        result.exclusions_excludes_deep_jump_squats = checkExerciseExcluded("deep jump squats", allExclusions);
        result.exclusions_excludes_sissy_squats = checkExerciseExcluded("sissy squats", allExclusions);
        result.exclusions_excludes_barbell_back_squats = checkExerciseExcluded("barbell back squats", allExclusions);
        result.exclusions_excludes_pistol_squats = checkExerciseExcluded("pistol squats", allExclusions);
        result.exclusions_excludes_hack_squats = checkExerciseExcluded("hack squats", allExclusions);
        result.exclusions_excludes_walking_lunges = checkExerciseExcluded("walking lunges", allExclusions);
        result.exclusions_excludes_good_mornings = checkExerciseExcluded("good mornings", allExclusions);
        result.exclusions_excludes_box_step_ups = checkExerciseExcluded("box step-ups", allExclusions);
        break;
      case "Upper Body":
        result.exclusions_has_upper_body = categoryHasExclusions;
        result.exclusions_excludes_behind_neck_press = checkExerciseExcluded("behind-the-neck press", allExclusions);
        result.exclusions_excludes_kipping_pull_ups = checkExerciseExcluded("kipping pull-ups", allExclusions);
        result.exclusions_excludes_heavy_upright_rows = checkExerciseExcluded("heavy upright rows", allExclusions);
        result.exclusions_excludes_dips_straight_bars = checkExerciseExcluded("dips on straight bars", allExclusions);
        result.exclusions_excludes_push_press = checkExerciseExcluded("push press", allExclusions);
        result.exclusions_excludes_arnold_press = checkExerciseExcluded("arnold press", allExclusions);
        result.exclusions_excludes_barbell_bench_press = checkExerciseExcluded("barbell bench press", allExclusions);
        result.exclusions_excludes_heavy_overhead_press = checkExerciseExcluded("heavy overhead press", allExclusions);
        break;
      case "Core & Stability":
        result.exclusions_has_core_stability = categoryHasExclusions;
        result.exclusions_excludes_sit_ups = checkExerciseExcluded("sit-ups", allExclusions);
        result.exclusions_excludes_superman_holds = checkExerciseExcluded("superman holds", allExclusions);
        result.exclusions_excludes_windshield_wipers = checkExerciseExcluded("windshield wipers", allExclusions);
        result.exclusions_excludes_crunches = checkExerciseExcluded("crunches", allExclusions);
        result.exclusions_excludes_toe_to_bar = checkExerciseExcluded("toe-to-bar", allExclusions);
        result.exclusions_excludes_v_ups = checkExerciseExcluded("v-ups", allExclusions);
        result.exclusions_excludes_weighted_russian_twists = checkExerciseExcluded("weighted russian twists", allExclusions);
        result.exclusions_excludes_long_planks = checkExerciseExcluded("planks over 1 minute", allExclusions);
        break;
      case "Mobility & Corrective / Recovery":
        result.exclusions_has_mobility_recovery = categoryHasExclusions;
        result.exclusions_excludes_standing_toe_touches = checkExerciseExcluded("standing toe touches", allExclusions);
        result.exclusions_excludes_seated_forward_fold = checkExerciseExcluded("seated forward fold", allExclusions);
        result.exclusions_excludes_unsupported_wall_sits = checkExerciseExcluded("unsupported wall sits", allExclusions);
        result.exclusions_excludes_hip_circles = checkExerciseExcluded("hip circles", allExclusions);
        result.exclusions_excludes_excessive_foam_rolling = checkExerciseExcluded("excessive foam rolling", allExclusions);
        result.exclusions_excludes_deep_squat_hold = checkExerciseExcluded("deep squat hold", allExclusions);
        result.exclusions_excludes_overhead_shoulder_cars = checkExerciseExcluded("overhead shoulder cars", allExclusions);
        result.exclusions_excludes_ballistic_arm_swings = checkExerciseExcluded("ballistic arm swings", allExclusions);
        break;
    }
  });
  
  // Calculate category count
  result.exclusions_category_count = [
    result.exclusions_has_full_body,
    result.exclusions_has_lower_body,
    result.exclusions_has_upper_body,
    result.exclusions_has_core_stability,
    result.exclusions_has_mobility_recovery
  ].filter(Boolean).length;
  
  // Analyze risk categories
  result.exclusions_avoids_high_injury_risk = allExclusions.some(ex => exerciseMatchesRiskClassification(ex, EXERCISE_RISK_CLASSIFICATIONS.high_injury_risk));
  result.exclusions_avoids_joint_stress = allExclusions.some(ex => exerciseMatchesRiskClassification(ex, EXERCISE_RISK_CLASSIFICATIONS.joint_stress));
  result.exclusions_avoids_skill_demanding = allExclusions.some(ex => exerciseMatchesRiskClassification(ex, EXERCISE_RISK_CLASSIFICATIONS.skill_demanding));
  result.exclusions_avoids_equipment_dependent = allExclusions.some(ex => exerciseMatchesRiskClassification(ex, EXERCISE_RISK_CLASSIFICATIONS.equipment_dependent));
  result.exclusions_avoids_spine_risky = allExclusions.some(ex => exerciseMatchesRiskClassification(ex, EXERCISE_RISK_CLASSIFICATIONS.spine_risky));
  result.exclusions_avoids_shoulder_risky = allExclusions.some(ex => exerciseMatchesRiskClassification(ex, EXERCISE_RISK_CLASSIFICATIONS.shoulder_risky));
  result.exclusions_avoids_beginner_unsafe = allExclusions.some(ex => exerciseMatchesRiskClassification(ex, EXERCISE_RISK_CLASSIFICATIONS.beginner_unsafe));
  result.exclusions_avoids_fatigue_risk = allExclusions.some(ex => exerciseMatchesRiskClassification(ex, EXERCISE_RISK_CLASSIFICATIONS.fatigue_risk));
  
  // Analyze body region protection
  result.exclusions_protects_lower_back = result.exclusions_excludes_sit_ups || result.exclusions_excludes_good_mornings || result.exclusions_excludes_seated_forward_fold;
  result.exclusions_protects_shoulders = result.exclusions_excludes_behind_neck_press || result.exclusions_excludes_wall_balls || result.exclusions_excludes_push_press;
  result.exclusions_protects_knees = result.exclusions_excludes_deep_jump_squats || result.exclusions_excludes_sissy_squats || result.exclusions_excludes_box_jumps;
  result.exclusions_protects_wrists = result.exclusions_excludes_mountain_climbers || allExclusions.some(ex => ex.toLowerCase().includes('wrist'));
  result.exclusions_protects_neck = result.exclusions_excludes_crunches || result.exclusions_excludes_behind_neck_press;
  result.exclusions_protects_spine = result.exclusions_excludes_sit_ups || result.exclusions_excludes_superman_holds || result.exclusions_excludes_windshield_wipers;
  
  // Calculate scores
  let riskScore = 0;
  let limitationScore = 0;
  
  if (result.exclusions_avoids_high_injury_risk) riskScore += 3;
  if (result.exclusions_avoids_spine_risky) riskScore += 3;
  if (result.exclusions_avoids_shoulder_risky) riskScore += 2;
  if (result.exclusions_avoids_joint_stress) riskScore += 2;
  if (result.exclusions_avoids_beginner_unsafe) riskScore += 2;
  
  if (result.exclusions_avoids_skill_demanding) limitationScore += 2;
  if (result.exclusions_avoids_equipment_dependent) limitationScore += 1;
  if (result.exclusions_category_count >= 3) limitationScore += 2;
  
  result.exclusions_risk_level_score = Math.min(10, riskScore);
  result.exclusions_limitation_score = Math.min(10, limitationScore);
  result.exclusions_safety_priority_score = Math.min(10, riskScore + limitationScore);
  
  // Set implications based on analysis
  result.exclusions_indicates_injury_history = result.exclusions_risk_level_score >= 5;
  result.exclusions_indicates_beginner_level = result.exclusions_avoids_beginner_unsafe || result.exclusions_avoids_skill_demanding;
  result.exclusions_indicates_equipment_limitations = result.exclusions_avoids_equipment_dependent;
  result.exclusions_indicates_skill_limitations = result.exclusions_avoids_skill_demanding;
  
  // Set training adaptations needed
  result.exclusions_requires_low_impact = result.exclusions_avoids_joint_stress || result.exclusions_protects_knees;
  result.exclusions_requires_joint_friendly = result.exclusions_protects_lower_back || result.exclusions_protects_shoulders;
  result.exclusions_requires_simple_movements = result.exclusions_avoids_skill_demanding;
  result.exclusions_requires_bodyweight_only = result.exclusions_avoids_equipment_dependent;
  
  // Set recommendations
  result.exclusions_recommend_medical_clearance = result.exclusions_risk_level_score >= 7;
  result.exclusions_recommend_professional_guidance = result.exclusions_indicates_injury_history || result.exclusions_safety_priority_score >= 6;
  result.exclusions_recommend_modified_movements = result.exclusions_total_count >= 5;
  result.exclusions_recommend_alternative_exercises = result.exclusions_category_count >= 2;
  
  // Set planning guidance
  result.exclusions_prioritize_safety = result.exclusions_risk_level_score >= 4;
  result.exclusions_prioritize_modifications = result.exclusions_limitation_score >= 3;
  result.exclusions_prioritize_alternatives = result.exclusions_category_count >= 3;
  result.exclusions_prioritize_pain_free = result.exclusions_indicates_injury_history;
  
  // Set backup data
  result.exclusions_raw_input = data;
  result.exclusions_parsed_exclusions = allExclusions.join(", ");
  result.exclusions_last_updated = new Date().toISOString();
  
  return result;
}

// Helper function to parse exercise input
function parseExerciseInput(input: string): { customText: string[], selectedExercises: string[] } {
  if (!input) return { customText: [], selectedExercises: [] };
  
  // Check if input contains our separator
  const parts = input.split(" | EXCLUDED: ");
  if (parts.length === 2) {
    const customText = parts[0] ? parts[0].split(',').map(ex => ex.trim()).filter(ex => ex) : [];
    const selectedExercises = parts[1] ? parts[1].split(', ').filter(ex => ex) : [];
    return { customText, selectedExercises };
  }
  
  // Check if input starts with "EXCLUDED:"
  if (input.startsWith("EXCLUDED: ")) {
    const selectedExercises = input.substring(10).split(', ').filter(ex => ex);
    return { customText: [], selectedExercises };
  }
  
  // If no separator, treat entire input as custom text
  const customText = input.split(',').map(ex => ex.trim()).filter(ex => ex);
  return { customText, selectedExercises: [] };
}

// Helper function to check if exercise is excluded
function checkExerciseExcluded(exerciseName: string, allExclusions: string[]): boolean {
  const normalized = normalizeExerciseName(exerciseName);
  return allExclusions.some(exercise => {
    const exerciseNormalized = normalizeExerciseName(exercise);
    return exerciseNormalized.includes(normalized) || normalized.includes(exerciseNormalized);
  });
}

// Enhanced usage example
export function getExcludeExercisesSummary(flattened: EnhancedExcludeExercisesFlat): string {
  const parts = [];
  
  // Exclusion count
  if (flattened.exclusions_total_count > 0) {
    parts.push(`${flattened.exclusions_total_count} exercises excluded`);
  }
  
  // Category diversity
  if (flattened.exclusions_category_count > 0) {
    parts.push(`${flattened.exclusions_category_count} categories affected`);
  }
  
  // Risk analysis
  if (flattened.exclusions_avoids_high_injury_risk) parts.push('Avoiding high-risk exercises');
  if (flattened.exclusions_protects_spine) parts.push('Protecting spine');
  if (flattened.exclusions_protects_shoulders) parts.push('Protecting shoulders');
  if (flattened.exclusions_protects_lower_back) parts.push('Protecting lower back');
  
  // Safety implications
  if (flattened.exclusions_indicates_injury_history) parts.push('Possible injury history');
  if (flattened.exclusions_indicates_beginner_level) parts.push('Beginner-level safety');
  if (flattened.exclusions_indicates_equipment_limitations) parts.push('Equipment limitations');
  
  // Recommendations
  if (flattened.exclusions_recommend_medical_clearance) parts.push('Medical clearance recommended');
  else if (flattened.exclusions_recommend_professional_guidance) parts.push('Professional guidance recommended');
  else if (flattened.exclusions_prioritize_safety) parts.push('Safety-first approach');
  
  // Training adaptations
  if (flattened.exclusions_requires_low_impact) parts.push('Low-impact focus');
  if (flattened.exclusions_requires_simple_movements) parts.push('Simple movements preferred');
  
  return parts.join(' • ') || 'No exercises excluded';
} 