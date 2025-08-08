// Enhanced Include Exercises Data Flattener
// Transforms include exercises string into comprehensive flat, queryable format
// Generates individual boolean flags for each field as requested by CTO

// Exercise data structure for analysis
const EXERCISE_CATEGORIES = {
  'Full Body': [
    'Burpees',
    'Kettlebell Swings',
    'Thrusters',
    'Clean & Press',
    'Wall Balls',
    'Man Makers',
    'Jumping Jacks',
    'Bear Crawl',
  ],
  'Lower Body': [
    'Bodyweight Squats',
    'Lunges',
    'Step-Ups',
    'Glute Bridges',
    'Deadlifts (Dumbbell/Barbell)',
    'Wall Sit',
    'Jump Squats',
    'Bulgarian Split Squats',
  ],
  'Upper Body': [
    'Push-Ups',
    'Pull-Ups or Assisted Pull-Ups',
    'Bent-Over Rows',
    'Overhead Press',
    'Dumbbell Chest Press',
    'Renegade Rows',
    'Bicep Curls',
    'Tricep Dips',
  ],
  'Core & Stability': [
    'Plank',
    'Side Plank',
    'Mountain Climbers',
    'Dead Bug',
    'Bird Dog',
    'Leg Raises',
    'Russian Twists',
    'V-Ups',
  ],
  'Mobility & Corrective / Recovery': [
    "World's Greatest Stretch",
    'Cat-Cow',
    '90/90 Hip Stretch',
    'Band Pull-Aparts',
    'Foam Rolling (Quads)',
    'Thread the Needle',
    'Wall Angels',
    'Shoulder CARs',
  ],
};

// Exercise classifications for analysis
const EXERCISE_CLASSIFICATIONS = {
  strength: [
    'deadlifts',
    'squats',
    'press',
    'rows',
    'curls',
    'dips',
    'pull-ups',
  ],
  cardio: [
    'burpees',
    'jumping jacks',
    'mountain climbers',
    'jump squats',
    'wall balls',
  ],
  mobility: [
    'stretch',
    'foam rolling',
    'car',
    'cat-cow',
    'thread the needle',
    'wall angels',
  ],
  core: [
    'plank',
    'dead bug',
    'bird dog',
    'leg raises',
    'russian twists',
    'v-ups',
  ],
  compound: [
    'burpees',
    'thrusters',
    'clean & press',
    'man makers',
    'deadlifts',
    'squats',
  ],
  isolation: ['bicep curls', 'tricep dips', 'leg raises', 'wall sit'],
  bodyweight: [
    'push-ups',
    'pull-ups',
    'squats',
    'lunges',
    'plank',
    'burpees',
    'jumping jacks',
  ],
  weighted: ['deadlifts', 'kettlebell', 'dumbbell', 'barbell', 'wall balls'],
  explosive: [
    'jump squats',
    'burpees',
    'kettlebell swings',
    'wall balls',
    'jumping jacks',
  ],
  endurance: ['plank', 'wall sit', 'bear crawl', 'mountain climbers'],
};

// Comprehensive flattened structure
export interface EnhancedIncludeExercisesFlat {
  // === EXERCISE CATEGORY PRESENCE FLAGS ===
  exercises_has_full_body: boolean;
  exercises_has_lower_body: boolean;
  exercises_has_upper_body: boolean;
  exercises_has_core_stability: boolean;
  exercises_has_mobility_recovery: boolean;
  exercises_has_custom_specified: boolean;

  // === SPECIFIC EXERCISE SELECTIONS ===
  // Full Body exercises
  exercises_includes_burpees: boolean;
  exercises_includes_kettlebell_swings: boolean;
  exercises_includes_thrusters: boolean;
  exercises_includes_clean_press: boolean;
  exercises_includes_wall_balls: boolean;
  exercises_includes_man_makers: boolean;
  exercises_includes_jumping_jacks: boolean;
  exercises_includes_bear_crawl: boolean;

  // Lower Body exercises
  exercises_includes_squats: boolean;
  exercises_includes_lunges: boolean;
  exercises_includes_step_ups: boolean;
  exercises_includes_glute_bridges: boolean;
  exercises_includes_deadlifts: boolean;
  exercises_includes_wall_sit: boolean;
  exercises_includes_jump_squats: boolean;
  exercises_includes_bulgarian_splits: boolean;

  // Upper Body exercises
  exercises_includes_push_ups: boolean;
  exercises_includes_pull_ups: boolean;
  exercises_includes_bent_rows: boolean;
  exercises_includes_overhead_press: boolean;
  exercises_includes_chest_press: boolean;
  exercises_includes_renegade_rows: boolean;
  exercises_includes_bicep_curls: boolean;
  exercises_includes_tricep_dips: boolean;

  // Core & Stability exercises
  exercises_includes_plank: boolean;
  exercises_includes_side_plank: boolean;
  exercises_includes_mountain_climbers: boolean;
  exercises_includes_dead_bug: boolean;
  exercises_includes_bird_dog: boolean;
  exercises_includes_leg_raises: boolean;
  exercises_includes_russian_twists: boolean;
  exercises_includes_v_ups: boolean;

  // Mobility & Recovery exercises
  exercises_includes_greatest_stretch: boolean;
  exercises_includes_cat_cow: boolean;
  exercises_includes_hip_stretch: boolean;
  exercises_includes_band_pull_aparts: boolean;
  exercises_includes_foam_rolling: boolean;
  exercises_includes_thread_needle: boolean;
  exercises_includes_wall_angels: boolean;
  exercises_includes_shoulder_cars: boolean;

  // === EXERCISE TYPE ANALYSIS ===
  exercises_strength_focused: boolean;
  exercises_cardio_focused: boolean;
  exercises_mobility_focused: boolean;
  exercises_core_focused: boolean;
  exercises_compound_movements: boolean;
  exercises_isolation_movements: boolean;
  exercises_bodyweight_only: boolean;
  exercises_requires_weights: boolean;
  exercises_explosive_power: boolean;
  exercises_endurance_based: boolean;

  // === BODY REGION FOCUS ===
  exercises_targets_lower_body: boolean;
  exercises_targets_upper_body: boolean;
  exercises_targets_core: boolean;
  exercises_targets_full_body: boolean;
  exercises_unilateral_movements: boolean;
  exercises_bilateral_movements: boolean;
  exercises_anterior_chain: boolean;
  exercises_posterior_chain: boolean;
  exercises_sagittal_plane: boolean;
  exercises_frontal_plane: boolean;
  exercises_transverse_plane: boolean;

  // === EQUIPMENT REQUIREMENTS ===
  exercises_requires_no_equipment: boolean;
  exercises_requires_dumbbells: boolean;
  exercises_requires_kettlebells: boolean;
  exercises_requires_barbell: boolean;
  exercises_requires_resistance_bands: boolean;
  exercises_requires_foam_roller: boolean;
  exercises_requires_pull_up_bar: boolean;
  exercises_requires_step_platform: boolean;
  exercises_requires_wall_space: boolean;
  exercises_requires_floor_space: boolean;

  // === WORKOUT CHARACTERISTICS ===
  exercises_high_intensity: boolean;
  exercises_moderate_intensity: boolean;
  exercises_low_intensity: boolean;
  exercises_time_efficient: boolean;
  exercises_skill_demanding: boolean;
  exercises_beginner_friendly: boolean;
  exercises_intermediate_level: boolean;
  exercises_advanced_level: boolean;
  exercises_scalable_difficulty: boolean;
  exercises_requires_warmup: boolean;

  // === TRAINING GOALS ALIGNMENT ===
  exercises_builds_strength: boolean;
  exercises_improves_endurance: boolean;
  exercises_enhances_mobility: boolean;
  exercises_develops_power: boolean;
  exercises_improves_balance: boolean;
  exercises_enhances_coordination: boolean;
  exercises_builds_muscle: boolean;
  exercises_burns_calories: boolean;
  exercises_improves_posture: boolean;
  exercises_reduces_stiffness: boolean;

  // === EXERCISE COMPLEXITY ===
  exercises_simple_movements: boolean;
  exercises_complex_movements: boolean;
  exercises_requires_coordination: boolean;
  exercises_requires_balance: boolean;
  exercises_requires_flexibility: boolean;
  exercises_requires_strength_base: boolean;
  exercises_multiplanar_movement: boolean;
  exercises_unilateral_challenge: boolean;
  exercises_cognitive_demand: boolean;
  exercises_proprioceptive_challenge: boolean;

  // === TIME & VOLUME CHARACTERISTICS ===
  exercises_quick_transitions: boolean;
  exercises_sustained_holds: boolean;
  exercises_rhythmic_movements: boolean;
  exercises_controlled_tempo: boolean;
  exercises_high_volume_suitable: boolean;
  exercises_low_volume_suitable: boolean;
  exercises_circuit_friendly: boolean;
  exercises_standalone_suitable: boolean;
  exercises_requires_rest_periods: boolean;
  exercises_continuous_movement: boolean;

  // === WORKOUT STYLE COMPATIBILITY ===
  exercises_hiit_compatible: boolean;
  exercises_strength_training: boolean;
  exercises_circuit_training: boolean;
  exercises_yoga_pilates_style: boolean;
  exercises_athletic_training: boolean;
  exercises_rehabilitation_focus: boolean;
  exercises_conditioning_focus: boolean;
  exercises_flexibility_focus: boolean;
  exercises_functional_fitness: boolean;
  exercises_sport_specific: boolean;

  // === PROGRESSION & ADAPTATION ===
  exercises_easily_modified: boolean;
  exercises_progressive_overload: boolean;
  exercises_regression_options: boolean;
  exercises_progression_options: boolean;
  exercises_load_adjustable: boolean;
  exercises_range_adjustable: boolean;
  exercises_tempo_adjustable: boolean;
  exercises_volume_adjustable: boolean;
  exercises_assistance_available: boolean;
  exercises_unassisted_options: boolean;

  // === SAFETY & CONTRAINDICATIONS ===
  exercises_joint_friendly: boolean;
  exercises_high_impact: boolean;
  exercises_low_impact: boolean;
  exercises_spine_neutral: boolean;
  exercises_requires_spotting: boolean;
  exercises_fall_risk: boolean;
  exercises_coordination_required: boolean;
  exercises_balance_challenge: boolean;
  exercises_cardiovascular_demand: boolean;
  exercises_muscular_endurance: boolean;

  // === ANALYTICS & COUNTS ===
  exercises_total_count: number;
  exercises_category_count: number;
  exercises_custom_count: number;
  exercises_selected_count: number;
  exercises_strength_percentage: number;
  exercises_cardio_percentage: number;
  exercises_mobility_percentage: number;
  exercises_complexity_score: number;
  exercises_intensity_score: number;
  exercises_equipment_diversity: number;

  // === WORKOUT RECOMMENDATIONS ===
  exercises_recommend_warmup: boolean;
  exercises_recommend_cooldown: boolean;
  exercises_recommend_progression: boolean;
  exercises_recommend_supervision: boolean;
  exercises_recommend_modification: boolean;
  exercises_recommend_equipment_check: boolean;
  exercises_recommend_space_preparation: boolean;
  exercises_recommend_technique_focus: boolean;
  exercises_recommend_gradual_introduction: boolean;
  exercises_recommend_form_emphasis: boolean;

  // === PROGRAM DESIGN IMPLICATIONS ===
  exercises_supports_periodization: boolean;
  exercises_volume_dependent: boolean;
  exercises_intensity_dependent: boolean;
  exercises_frequency_dependent: boolean;
  exercises_recovery_demanding: boolean;
  exercises_skill_development: boolean;
  exercises_maintenance_suitable: boolean;
  exercises_progression_focused: boolean;
  exercises_deload_friendly: boolean;
  exercises_assessment_suitable: boolean;

  // === BACKUP & META ===
  exercises_raw_input: string;
  exercises_parsed_exercises: string;
  exercises_last_updated: string;
  exercises_flattener_version: string;
}

// Helper function to create empty flattened structure
function createEmptyIncludeExercisesFlattened(): EnhancedIncludeExercisesFlat {
  return {
    // EXERCISE CATEGORY PRESENCE FLAGS
    exercises_has_full_body: false,
    exercises_has_lower_body: false,
    exercises_has_upper_body: false,
    exercises_has_core_stability: false,
    exercises_has_mobility_recovery: false,
    exercises_has_custom_specified: false,

    // SPECIFIC EXERCISE SELECTIONS
    exercises_includes_burpees: false,
    exercises_includes_kettlebell_swings: false,
    exercises_includes_thrusters: false,
    exercises_includes_clean_press: false,
    exercises_includes_wall_balls: false,
    exercises_includes_man_makers: false,
    exercises_includes_jumping_jacks: false,
    exercises_includes_bear_crawl: false,

    exercises_includes_squats: false,
    exercises_includes_lunges: false,
    exercises_includes_step_ups: false,
    exercises_includes_glute_bridges: false,
    exercises_includes_deadlifts: false,
    exercises_includes_wall_sit: false,
    exercises_includes_jump_squats: false,
    exercises_includes_bulgarian_splits: false,

    exercises_includes_push_ups: false,
    exercises_includes_pull_ups: false,
    exercises_includes_bent_rows: false,
    exercises_includes_overhead_press: false,
    exercises_includes_chest_press: false,
    exercises_includes_renegade_rows: false,
    exercises_includes_bicep_curls: false,
    exercises_includes_tricep_dips: false,

    exercises_includes_plank: false,
    exercises_includes_side_plank: false,
    exercises_includes_mountain_climbers: false,
    exercises_includes_dead_bug: false,
    exercises_includes_bird_dog: false,
    exercises_includes_leg_raises: false,
    exercises_includes_russian_twists: false,
    exercises_includes_v_ups: false,

    exercises_includes_greatest_stretch: false,
    exercises_includes_cat_cow: false,
    exercises_includes_hip_stretch: false,
    exercises_includes_band_pull_aparts: false,
    exercises_includes_foam_rolling: false,
    exercises_includes_thread_needle: false,
    exercises_includes_wall_angels: false,
    exercises_includes_shoulder_cars: false,

    // EXERCISE TYPE ANALYSIS
    exercises_strength_focused: false,
    exercises_cardio_focused: false,
    exercises_mobility_focused: false,
    exercises_core_focused: false,
    exercises_compound_movements: false,
    exercises_isolation_movements: false,
    exercises_bodyweight_only: false,
    exercises_requires_weights: false,
    exercises_explosive_power: false,
    exercises_endurance_based: false,

    // BODY REGION FOCUS
    exercises_targets_lower_body: false,
    exercises_targets_upper_body: false,
    exercises_targets_core: false,
    exercises_targets_full_body: false,
    exercises_unilateral_movements: false,
    exercises_bilateral_movements: false,
    exercises_anterior_chain: false,
    exercises_posterior_chain: false,
    exercises_sagittal_plane: false,
    exercises_frontal_plane: false,
    exercises_transverse_plane: false,

    // EQUIPMENT REQUIREMENTS
    exercises_requires_no_equipment: false,
    exercises_requires_dumbbells: false,
    exercises_requires_kettlebells: false,
    exercises_requires_barbell: false,
    exercises_requires_resistance_bands: false,
    exercises_requires_foam_roller: false,
    exercises_requires_pull_up_bar: false,
    exercises_requires_step_platform: false,
    exercises_requires_wall_space: false,
    exercises_requires_floor_space: false,

    // WORKOUT CHARACTERISTICS
    exercises_high_intensity: false,
    exercises_moderate_intensity: false,
    exercises_low_intensity: false,
    exercises_time_efficient: false,
    exercises_skill_demanding: false,
    exercises_beginner_friendly: false,
    exercises_intermediate_level: false,
    exercises_advanced_level: false,
    exercises_scalable_difficulty: false,
    exercises_requires_warmup: false,

    // TRAINING GOALS ALIGNMENT
    exercises_builds_strength: false,
    exercises_improves_endurance: false,
    exercises_enhances_mobility: false,
    exercises_develops_power: false,
    exercises_improves_balance: false,
    exercises_enhances_coordination: false,
    exercises_builds_muscle: false,
    exercises_burns_calories: false,
    exercises_improves_posture: false,
    exercises_reduces_stiffness: false,

    // EXERCISE COMPLEXITY
    exercises_simple_movements: false,
    exercises_complex_movements: false,
    exercises_requires_coordination: false,
    exercises_requires_balance: false,
    exercises_requires_flexibility: false,
    exercises_requires_strength_base: false,
    exercises_multiplanar_movement: false,
    exercises_unilateral_challenge: false,
    exercises_cognitive_demand: false,
    exercises_proprioceptive_challenge: false,

    // TIME & VOLUME CHARACTERISTICS
    exercises_quick_transitions: false,
    exercises_sustained_holds: false,
    exercises_rhythmic_movements: false,
    exercises_controlled_tempo: false,
    exercises_high_volume_suitable: false,
    exercises_low_volume_suitable: false,
    exercises_circuit_friendly: false,
    exercises_standalone_suitable: false,
    exercises_requires_rest_periods: false,
    exercises_continuous_movement: false,

    // WORKOUT STYLE COMPATIBILITY
    exercises_hiit_compatible: false,
    exercises_strength_training: false,
    exercises_circuit_training: false,
    exercises_yoga_pilates_style: false,
    exercises_athletic_training: false,
    exercises_rehabilitation_focus: false,
    exercises_conditioning_focus: false,
    exercises_flexibility_focus: false,
    exercises_functional_fitness: false,
    exercises_sport_specific: false,

    // PROGRESSION & ADAPTATION
    exercises_easily_modified: false,
    exercises_progressive_overload: false,
    exercises_regression_options: false,
    exercises_progression_options: false,
    exercises_load_adjustable: false,
    exercises_range_adjustable: false,
    exercises_tempo_adjustable: false,
    exercises_volume_adjustable: false,
    exercises_assistance_available: false,
    exercises_unassisted_options: false,

    // SAFETY & CONTRAINDICATIONS
    exercises_joint_friendly: false,
    exercises_high_impact: false,
    exercises_low_impact: false,
    exercises_spine_neutral: false,
    exercises_requires_spotting: false,
    exercises_fall_risk: false,
    exercises_coordination_required: false,
    exercises_balance_challenge: false,
    exercises_cardiovascular_demand: false,
    exercises_muscular_endurance: false,

    // ANALYTICS & COUNTS
    exercises_total_count: 0,
    exercises_category_count: 0,
    exercises_custom_count: 0,
    exercises_selected_count: 0,
    exercises_strength_percentage: 0,
    exercises_cardio_percentage: 0,
    exercises_mobility_percentage: 0,
    exercises_complexity_score: 0,
    exercises_intensity_score: 0,
    exercises_equipment_diversity: 0,

    // WORKOUT RECOMMENDATIONS
    exercises_recommend_warmup: false,
    exercises_recommend_cooldown: false,
    exercises_recommend_progression: false,
    exercises_recommend_supervision: false,
    exercises_recommend_modification: false,
    exercises_recommend_equipment_check: false,
    exercises_recommend_space_preparation: false,
    exercises_recommend_technique_focus: false,
    exercises_recommend_gradual_introduction: false,
    exercises_recommend_form_emphasis: false,

    // PROGRAM DESIGN IMPLICATIONS
    exercises_supports_periodization: false,
    exercises_volume_dependent: false,
    exercises_intensity_dependent: false,
    exercises_frequency_dependent: false,
    exercises_recovery_demanding: false,
    exercises_skill_development: false,
    exercises_maintenance_suitable: false,
    exercises_progression_focused: false,
    exercises_deload_friendly: false,
    exercises_assessment_suitable: false,

    // BACKUP & META
    exercises_raw_input: '',
    exercises_parsed_exercises: '',
    exercises_last_updated: new Date().toISOString(),
    exercises_flattener_version: '1.0.0',
  };
}

// Helper function to normalize exercise names for comparison
function normalizeExerciseName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper function to check if exercise matches any classification
function exerciseMatchesClassification(
  exercise: string,
  classification: string[]
): boolean {
  const normalizedExercise = normalizeExerciseName(exercise);
  return classification.some((term) =>
    normalizedExercise.includes(term.toLowerCase())
  );
}

// Enhanced flattener function
export function flattenIncludeExercisesData(
  data: string | undefined
): EnhancedIncludeExercisesFlat {
  // Handle undefined/null input
  if (!data || typeof data !== 'string') {
    return createEmptyIncludeExercisesFlattened();
  }

  const result = createEmptyIncludeExercisesFlattened();

  // Parse the input to separate custom text and selected exercises
  const { customText, selectedExercises } = parseExerciseInput(data);

  // Get all exercises (custom + selected)
  const allExercises = [...customText, ...selectedExercises];

  // Set basic flags
  result.exercises_has_custom_specified = customText.length > 0;
  result.exercises_total_count = allExercises.length;
  result.exercises_custom_count = customText.length;
  result.exercises_selected_count = selectedExercises.length;

  // Check category presence and specific exercises
  Object.entries(EXERCISE_CATEGORIES).forEach(([category, exercises]) => {
    const categoryHasExercises = exercises.some((ex) =>
      selectedExercises.some(
        (selected) =>
          normalizeExerciseName(selected) === normalizeExerciseName(ex)
      )
    );

    switch (category) {
      case 'Full Body':
        result.exercises_has_full_body = categoryHasExercises;
        result.exercises_includes_burpees = checkExerciseIncluded(
          'burpees',
          allExercises
        );
        result.exercises_includes_kettlebell_swings = checkExerciseIncluded(
          'kettlebell swings',
          allExercises
        );
        result.exercises_includes_thrusters = checkExerciseIncluded(
          'thrusters',
          allExercises
        );
        result.exercises_includes_clean_press = checkExerciseIncluded(
          'clean & press',
          allExercises
        );
        result.exercises_includes_wall_balls = checkExerciseIncluded(
          'wall balls',
          allExercises
        );
        result.exercises_includes_man_makers = checkExerciseIncluded(
          'man makers',
          allExercises
        );
        result.exercises_includes_jumping_jacks = checkExerciseIncluded(
          'jumping jacks',
          allExercises
        );
        result.exercises_includes_bear_crawl = checkExerciseIncluded(
          'bear crawl',
          allExercises
        );
        break;
      case 'Lower Body':
        result.exercises_has_lower_body = categoryHasExercises;
        result.exercises_includes_squats = checkExerciseIncluded(
          'squats',
          allExercises
        );
        result.exercises_includes_lunges = checkExerciseIncluded(
          'lunges',
          allExercises
        );
        result.exercises_includes_step_ups = checkExerciseIncluded(
          'step-ups',
          allExercises
        );
        result.exercises_includes_glute_bridges = checkExerciseIncluded(
          'glute bridges',
          allExercises
        );
        result.exercises_includes_deadlifts = checkExerciseIncluded(
          'deadlifts',
          allExercises
        );
        result.exercises_includes_wall_sit = checkExerciseIncluded(
          'wall sit',
          allExercises
        );
        result.exercises_includes_jump_squats = checkExerciseIncluded(
          'jump squats',
          allExercises
        );
        result.exercises_includes_bulgarian_splits = checkExerciseIncluded(
          'bulgarian split squats',
          allExercises
        );
        break;
      case 'Upper Body':
        result.exercises_has_upper_body = categoryHasExercises;
        result.exercises_includes_push_ups = checkExerciseIncluded(
          'push-ups',
          allExercises
        );
        result.exercises_includes_pull_ups = checkExerciseIncluded(
          'pull-ups',
          allExercises
        );
        result.exercises_includes_bent_rows = checkExerciseIncluded(
          'bent-over rows',
          allExercises
        );
        result.exercises_includes_overhead_press = checkExerciseIncluded(
          'overhead press',
          allExercises
        );
        result.exercises_includes_chest_press = checkExerciseIncluded(
          'chest press',
          allExercises
        );
        result.exercises_includes_renegade_rows = checkExerciseIncluded(
          'renegade rows',
          allExercises
        );
        result.exercises_includes_bicep_curls = checkExerciseIncluded(
          'bicep curls',
          allExercises
        );
        result.exercises_includes_tricep_dips = checkExerciseIncluded(
          'tricep dips',
          allExercises
        );
        break;
      case 'Core & Stability':
        result.exercises_has_core_stability = categoryHasExercises;
        result.exercises_includes_plank = checkExerciseIncluded(
          'plank',
          allExercises
        );
        result.exercises_includes_side_plank = checkExerciseIncluded(
          'side plank',
          allExercises
        );
        result.exercises_includes_mountain_climbers = checkExerciseIncluded(
          'mountain climbers',
          allExercises
        );
        result.exercises_includes_dead_bug = checkExerciseIncluded(
          'dead bug',
          allExercises
        );
        result.exercises_includes_bird_dog = checkExerciseIncluded(
          'bird dog',
          allExercises
        );
        result.exercises_includes_leg_raises = checkExerciseIncluded(
          'leg raises',
          allExercises
        );
        result.exercises_includes_russian_twists = checkExerciseIncluded(
          'russian twists',
          allExercises
        );
        result.exercises_includes_v_ups = checkExerciseIncluded(
          'v-ups',
          allExercises
        );
        break;
      case 'Mobility & Corrective / Recovery':
        result.exercises_has_mobility_recovery = categoryHasExercises;
        result.exercises_includes_greatest_stretch = checkExerciseIncluded(
          "world's greatest stretch",
          allExercises
        );
        result.exercises_includes_cat_cow = checkExerciseIncluded(
          'cat-cow',
          allExercises
        );
        result.exercises_includes_hip_stretch = checkExerciseIncluded(
          '90/90 hip stretch',
          allExercises
        );
        result.exercises_includes_band_pull_aparts = checkExerciseIncluded(
          'band pull-aparts',
          allExercises
        );
        result.exercises_includes_foam_rolling = checkExerciseIncluded(
          'foam rolling',
          allExercises
        );
        result.exercises_includes_thread_needle = checkExerciseIncluded(
          'thread the needle',
          allExercises
        );
        result.exercises_includes_wall_angels = checkExerciseIncluded(
          'wall angels',
          allExercises
        );
        result.exercises_includes_shoulder_cars = checkExerciseIncluded(
          'shoulder cars',
          allExercises
        );
        break;
    }
  });

  // Calculate category count
  result.exercises_category_count = [
    result.exercises_has_full_body,
    result.exercises_has_lower_body,
    result.exercises_has_upper_body,
    result.exercises_has_core_stability,
    result.exercises_has_mobility_recovery,
  ].filter(Boolean).length;

  // Analyze exercise types
  const strengthCount = allExercises.filter((ex) =>
    exerciseMatchesClassification(ex, EXERCISE_CLASSIFICATIONS.strength)
  ).length;
  const cardioCount = allExercises.filter((ex) =>
    exerciseMatchesClassification(ex, EXERCISE_CLASSIFICATIONS.cardio)
  ).length;
  const mobilityCount = allExercises.filter((ex) =>
    exerciseMatchesClassification(ex, EXERCISE_CLASSIFICATIONS.mobility)
  ).length;

  result.exercises_strength_focused =
    strengthCount > cardioCount && strengthCount > mobilityCount;
  result.exercises_cardio_focused =
    cardioCount > strengthCount && cardioCount > mobilityCount;
  result.exercises_mobility_focused =
    mobilityCount > strengthCount && mobilityCount > cardioCount;
  result.exercises_core_focused = allExercises.some((ex) =>
    exerciseMatchesClassification(ex, EXERCISE_CLASSIFICATIONS.core)
  );

  // Calculate percentages
  if (allExercises.length > 0) {
    result.exercises_strength_percentage = Math.round(
      (strengthCount / allExercises.length) * 100
    );
    result.exercises_cardio_percentage = Math.round(
      (cardioCount / allExercises.length) * 100
    );
    result.exercises_mobility_percentage = Math.round(
      (mobilityCount / allExercises.length) * 100
    );
  }

  // Analyze movement patterns
  result.exercises_compound_movements = allExercises.some((ex) =>
    exerciseMatchesClassification(ex, EXERCISE_CLASSIFICATIONS.compound)
  );
  result.exercises_isolation_movements = allExercises.some((ex) =>
    exerciseMatchesClassification(ex, EXERCISE_CLASSIFICATIONS.isolation)
  );
  result.exercises_bodyweight_only = allExercises.every((ex) =>
    exerciseMatchesClassification(ex, EXERCISE_CLASSIFICATIONS.bodyweight)
  );
  result.exercises_requires_weights = allExercises.some((ex) =>
    exerciseMatchesClassification(ex, EXERCISE_CLASSIFICATIONS.weighted)
  );
  result.exercises_explosive_power = allExercises.some((ex) =>
    exerciseMatchesClassification(ex, EXERCISE_CLASSIFICATIONS.explosive)
  );
  result.exercises_endurance_based = allExercises.some((ex) =>
    exerciseMatchesClassification(ex, EXERCISE_CLASSIFICATIONS.endurance)
  );

  // Analyze body regions
  result.exercises_targets_lower_body =
    result.exercises_has_lower_body ||
    allExercises.some(
      (ex) =>
        ex.toLowerCase().includes('squat') || ex.toLowerCase().includes('lunge')
    );
  result.exercises_targets_upper_body =
    result.exercises_has_upper_body ||
    allExercises.some(
      (ex) =>
        ex.toLowerCase().includes('push') || ex.toLowerCase().includes('pull')
    );
  result.exercises_targets_core =
    result.exercises_has_core_stability ||
    allExercises.some(
      (ex) =>
        ex.toLowerCase().includes('plank') || ex.toLowerCase().includes('core')
    );
  result.exercises_targets_full_body =
    result.exercises_has_full_body ||
    allExercises.some(
      (ex) =>
        ex.toLowerCase().includes('burpee') ||
        ex.toLowerCase().includes('thruster')
    );

  // Analyze equipment requirements
  result.exercises_requires_no_equipment = !result.exercises_requires_weights;
  result.exercises_requires_dumbbells = allExercises.some((ex) =>
    ex.toLowerCase().includes('dumbbell')
  );
  result.exercises_requires_kettlebells = allExercises.some((ex) =>
    ex.toLowerCase().includes('kettlebell')
  );
  result.exercises_requires_barbell = allExercises.some((ex) =>
    ex.toLowerCase().includes('barbell')
  );
  result.exercises_requires_resistance_bands = allExercises.some((ex) =>
    ex.toLowerCase().includes('band')
  );
  result.exercises_requires_foam_roller = allExercises.some((ex) =>
    ex.toLowerCase().includes('foam rolling')
  );
  result.exercises_requires_pull_up_bar = allExercises.some((ex) =>
    ex.toLowerCase().includes('pull-up')
  );
  result.exercises_requires_wall_space = allExercises.some((ex) =>
    ex.toLowerCase().includes('wall')
  );
  result.exercises_requires_floor_space = allExercises.some(
    (ex) =>
      ex.toLowerCase().includes('plank') || ex.toLowerCase().includes('stretch')
  );

  // Calculate complexity and intensity scores
  let complexityScore = 0;
  let intensityScore = 0;

  allExercises.forEach((exercise) => {
    const normalized = normalizeExerciseName(exercise);

    // Complexity scoring
    if (
      EXERCISE_CLASSIFICATIONS.compound.some((term) =>
        normalized.includes(term)
      )
    )
      complexityScore += 3;
    else if (
      EXERCISE_CLASSIFICATIONS.isolation.some((term) =>
        normalized.includes(term)
      )
    )
      complexityScore += 1;
    else complexityScore += 2;

    // Intensity scoring
    if (
      EXERCISE_CLASSIFICATIONS.explosive.some((term) =>
        normalized.includes(term)
      )
    )
      intensityScore += 4;
    else if (
      EXERCISE_CLASSIFICATIONS.cardio.some((term) => normalized.includes(term))
    )
      intensityScore += 3;
    else if (
      EXERCISE_CLASSIFICATIONS.strength.some((term) =>
        normalized.includes(term)
      )
    )
      intensityScore += 3;
    else if (
      EXERCISE_CLASSIFICATIONS.mobility.some((term) =>
        normalized.includes(term)
      )
    )
      intensityScore += 1;
    else intensityScore += 2;
  });

  result.exercises_complexity_score =
    allExercises.length > 0
      ? Math.round(complexityScore / allExercises.length)
      : 0;
  result.exercises_intensity_score =
    allExercises.length > 0
      ? Math.round(intensityScore / allExercises.length)
      : 0;

  // Set workout characteristics based on analysis
  result.exercises_high_intensity = result.exercises_intensity_score >= 3;
  result.exercises_moderate_intensity = result.exercises_intensity_score === 2;
  result.exercises_low_intensity = result.exercises_intensity_score <= 1;
  result.exercises_beginner_friendly =
    result.exercises_complexity_score <= 2 && !result.exercises_high_intensity;
  result.exercises_intermediate_level =
    result.exercises_complexity_score === 2 ||
    result.exercises_moderate_intensity;
  result.exercises_advanced_level =
    result.exercises_complexity_score >= 3 || result.exercises_high_intensity;

  // Set recommendations based on exercise characteristics
  result.exercises_recommend_warmup =
    result.exercises_high_intensity || result.exercises_explosive_power;
  result.exercises_recommend_cooldown =
    result.exercises_high_intensity || result.exercises_mobility_focused;
  result.exercises_recommend_progression = result.exercises_advanced_level;
  result.exercises_recommend_supervision =
    result.exercises_requires_weights || result.exercises_advanced_level;
  result.exercises_recommend_form_emphasis =
    result.exercises_compound_movements || result.exercises_strength_focused;

  // Set backup data
  result.exercises_raw_input = data;
  result.exercises_parsed_exercises = allExercises.join(', ');
  result.exercises_last_updated = new Date().toISOString();

  return result;
}

// Helper function to parse exercise input
function parseExerciseInput(input: string): {
  customText: string[];
  selectedExercises: string[];
} {
  if (!input) return { customText: [], selectedExercises: [] };

  // Check if input contains our separator
  const parts = input.split(' | SELECTED: ');
  if (parts.length === 2) {
    const customText = parts[0]
      ? parts[0]
          .split(',')
          .map((ex) => ex.trim())
          .filter((ex) => ex)
      : [];
    const selectedExercises = parts[1]
      ? parts[1].split(', ').filter((ex) => ex)
      : [];
    return { customText, selectedExercises };
  }

  // Check if input starts with "SELECTED:"
  if (input.startsWith('SELECTED: ')) {
    const selectedExercises = input
      .substring(10)
      .split(', ')
      .filter((ex) => ex);
    return { customText: [], selectedExercises };
  }

  // If no separator, treat entire input as custom text
  const customText = input
    .split(',')
    .map((ex) => ex.trim())
    .filter((ex) => ex);
  return { customText, selectedExercises: [] };
}

// Helper function to check if exercise is included
function checkExerciseIncluded(
  exerciseName: string,
  allExercises: string[]
): boolean {
  const normalized = normalizeExerciseName(exerciseName);
  return allExercises.some((exercise) => {
    const exerciseNormalized = normalizeExerciseName(exercise);
    return (
      exerciseNormalized.includes(normalized) ||
      normalized.includes(exerciseNormalized)
    );
  });
}

// Enhanced usage example
export function getIncludeExercisesSummary(
  flattened: EnhancedIncludeExercisesFlat
): string {
  const parts = [];

  // Exercise count
  if (flattened.exercises_total_count > 0) {
    parts.push(`${flattened.exercises_total_count} exercises specified`);
  }

  // Category diversity
  if (flattened.exercises_category_count > 0) {
    parts.push(`${flattened.exercises_category_count} categories covered`);
  }

  // Exercise focus
  if (flattened.exercises_strength_focused) parts.push('Strength-focused');
  else if (flattened.exercises_cardio_focused) parts.push('Cardio-focused');
  else if (flattened.exercises_mobility_focused) parts.push('Mobility-focused');
  else if (flattened.exercises_core_focused) parts.push('Core-focused');

  // Complexity and intensity
  if (flattened.exercises_advanced_level) parts.push('Advanced level');
  else if (flattened.exercises_intermediate_level)
    parts.push('Intermediate level');
  else if (flattened.exercises_beginner_friendly)
    parts.push('Beginner-friendly');

  if (flattened.exercises_high_intensity) parts.push('High intensity');
  else if (flattened.exercises_moderate_intensity)
    parts.push('Moderate intensity');
  else if (flattened.exercises_low_intensity) parts.push('Low intensity');

  // Equipment requirements
  if (flattened.exercises_requires_no_equipment)
    parts.push('No equipment needed');
  else if (flattened.exercises_requires_weights) parts.push('Weights required');

  // Movement patterns
  if (flattened.exercises_compound_movements) parts.push('Compound movements');
  if (flattened.exercises_explosive_power) parts.push('Explosive power');

  return parts.join(' • ') || 'No exercises specified';
}
