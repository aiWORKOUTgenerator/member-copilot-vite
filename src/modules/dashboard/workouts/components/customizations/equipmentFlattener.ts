// Enhanced Equipment Data Flattener
// Transforms complex 4-tier equipment data into comprehensive flat, queryable format
// Generates individual boolean flags for each field as requested by CTO

import { EquipmentSelectionData } from "../types";

// Comprehensive flattened structure - each field gets its own JSON key
export interface EnhancedEquipmentFlat {
  // === TIER 1: LOCATION FLAGS ===
  equipment_location: string | null;
  equipment_location_home: boolean;
  equipment_location_home_gym: boolean;
  equipment_location_gym: boolean;
  equipment_location_hotel: boolean;
  equipment_location_park: boolean;
  equipment_location_corporate_gym: boolean;
  equipment_location_athletic_club: boolean;
  
  // === TIER 2: CONTEXT FLAGS ===
  equipment_contexts_count: number;
  equipment_has_free_weights: boolean;
  equipment_has_resistance_machines: boolean;
  equipment_has_cable_systems: boolean;
  equipment_has_smith_machine: boolean;
  equipment_has_racks_rigs: boolean;
  equipment_has_bodyweight: boolean;
  equipment_has_resistance_bands: boolean;
  equipment_has_basic_cardio: boolean;
  equipment_has_advanced_cardio: boolean;
  equipment_has_minimal_cardio: boolean;
  equipment_has_cardio_machines: boolean;
  equipment_has_mobility_recovery: boolean;
  equipment_has_mobility_stretching: boolean;
  equipment_has_functional_equipment: boolean;
  equipment_has_functional_tools: boolean;
  equipment_has_light_weights: boolean;
  equipment_has_adjustable_dumbbells: boolean;
  equipment_has_mat_work: boolean;
  equipment_has_mat_based_work: boolean;
  equipment_has_resistance_tubes: boolean;
  equipment_has_suspension_trainers: boolean;
  equipment_has_sandbags: boolean;
  equipment_has_jump_rope: boolean;
  equipment_has_machines: boolean;
  equipment_has_cable_stations: boolean;
  equipment_has_dumbbells: boolean;
  equipment_has_stretch_area: boolean;
  equipment_has_cardio: boolean;
  equipment_has_olympic_lifting: boolean;
  equipment_has_conditioning_tools: boolean;
  equipment_has_athletic_accessories: boolean;
  equipment_has_sport_specific: boolean;
  
  // === TIER 3: SPECIFIC EQUIPMENT FLAGS ===
  equipment_subtypes_count: number;
  // Free Weights
  equipment_has_dumbbells_specific: boolean;
  equipment_has_barbells: boolean;
  equipment_has_kettlebells: boolean;
  equipment_has_plates: boolean;
  equipment_has_ez_curl_bar: boolean;
  equipment_has_trap_bar: boolean;
  equipment_has_adjustable_dumbbells_specific: boolean;
  // Racks & Rigs
  equipment_has_squat_rack: boolean;
  equipment_has_smith_machine_specific: boolean;
  equipment_has_pull_up_bar: boolean;
  equipment_has_dip_station: boolean;
  equipment_has_safety_arms: boolean;
  equipment_has_landmine: boolean;
  // Cable Systems
  equipment_has_functional_trainer: boolean;
  equipment_has_lat_pulldown: boolean;
  equipment_has_low_row: boolean;
  equipment_has_cable_column: boolean;
  equipment_has_cable_attachments: boolean;
  // Resistance Bands
  equipment_has_mini_bands: boolean;
  equipment_has_loop_bands: boolean;
  equipment_has_resistance_tubes_specific: boolean;
  equipment_has_figure_8_bands: boolean;
  equipment_has_door_anchor: boolean;
  // Resistance Machines
  equipment_has_chest_press: boolean;
  equipment_has_leg_press: boolean;
  equipment_has_leg_curl: boolean;
  equipment_has_pec_deck: boolean;
  equipment_has_seated_row: boolean;
  equipment_has_shoulder_press: boolean;
  // Cardio Equipment
  equipment_has_treadmill: boolean;
  equipment_has_stationary_bike: boolean;
  equipment_has_elliptical: boolean;
  equipment_has_rowing_machine: boolean;
  equipment_has_stair_climber: boolean;
  equipment_has_assault_bike: boolean;
  equipment_has_jump_rope_specific: boolean;
  equipment_has_step_stool: boolean;
  // Mobility & Recovery
  equipment_has_yoga_mat: boolean;
  equipment_has_foam_roller: boolean;
  equipment_has_massage_ball: boolean;
  equipment_has_stability_ball: boolean;
  equipment_has_stretching_strap: boolean;
  // Functional Equipment
  equipment_has_medicine_ball: boolean;
  equipment_has_battle_ropes: boolean;
  equipment_has_plyo_box: boolean;
  equipment_has_parallettes: boolean;
  equipment_has_weighted_vest: boolean;
  equipment_has_agility_ladder: boolean;
  equipment_has_sandbag: boolean;
  equipment_has_bulgarian_bag: boolean;
  equipment_has_trx: boolean;
  equipment_has_suspension_trainer: boolean;
  // Specialized Equipment
  equipment_has_olympic_barbell: boolean;
  equipment_has_bumper_plates: boolean;
  equipment_has_lifting_platform: boolean;
  equipment_has_jerk_blocks: boolean;
  equipment_has_sled: boolean;
  equipment_has_tire: boolean;
  equipment_has_cones: boolean;
  equipment_has_hurdles: boolean;
  equipment_has_parachute: boolean;
  
  // === TIER 4: WEIGHT ANALYSIS ===
  equipment_total_weight_types: number;
  equipment_total_weight_count: number;
  equipment_overall_min_weight: number | null;
  equipment_overall_max_weight: number | null;
  
  // Equipment-specific weight flags and ranges
  equipment_dumbbells_min_weight: number | null;
  equipment_dumbbells_max_weight: number | null;
  equipment_dumbbells_weight_count: number;
  equipment_dumbbells_has_light: boolean;    // < 20 lbs
  equipment_dumbbells_has_medium: boolean;   // 20-50 lbs
  equipment_dumbbells_has_heavy: boolean;    // > 50 lbs
  
  equipment_barbells_min_weight: number | null;
  equipment_barbells_max_weight: number | null;
  equipment_barbells_weight_count: number;
  equipment_barbells_has_standard: boolean;  // 45 lbs
  equipment_barbells_has_loaded: boolean;    // > 135 lbs
  equipment_barbells_has_heavy: boolean;     // > 225 lbs
  
  equipment_kettlebells_min_weight: number | null;
  equipment_kettlebells_max_weight: number | null;
  equipment_kettlebells_weight_count: number;
  equipment_kettlebells_has_light: boolean;  // < 16 kg
  equipment_kettlebells_has_medium: boolean; // 16-32 kg
  equipment_kettlebells_has_heavy: boolean;  // > 32 kg
  
  equipment_plates_min_weight: number | null;
  equipment_plates_max_weight: number | null;
  equipment_plates_weight_count: number;
  
  equipment_adjustable_dumbbells_min_weight: number | null;
  equipment_adjustable_dumbbells_max_weight: number | null;
  equipment_adjustable_dumbbells_weight_count: number;
  
  // === SUMMARY ANALYTICS ===
  equipment_versatility_score: number;      // 0-100 based on equipment variety
  equipment_strength_capability: number;    // 0-100 based on weight availability
  equipment_cardio_capability: number;      // 0-100 based on cardio options
  equipment_functional_capability: number;  // 0-100 based on functional tools
  
  // === BACKUP & META ===
  equipment_data_json: string;              // stringified original object
  equipment_last_updated: string;
  equipment_flattener_version: string;      // for schema versioning
}

// Helper function to create empty flattened structure
function createEmptyFlattened(): EnhancedEquipmentFlat {
  return {
    // TIER 1: LOCATION FLAGS
    equipment_location: null,
    equipment_location_home: false,
    equipment_location_home_gym: false,
    equipment_location_gym: false,
    equipment_location_hotel: false,
    equipment_location_park: false,
    equipment_location_corporate_gym: false,
    equipment_location_athletic_club: false,
    
    // TIER 2: CONTEXT FLAGS
    equipment_contexts_count: 0,
    equipment_has_free_weights: false,
    equipment_has_resistance_machines: false,
    equipment_has_cable_systems: false,
    equipment_has_smith_machine: false,
    equipment_has_racks_rigs: false,
    equipment_has_bodyweight: false,
    equipment_has_resistance_bands: false,
    equipment_has_basic_cardio: false,
    equipment_has_advanced_cardio: false,
    equipment_has_minimal_cardio: false,
    equipment_has_cardio_machines: false,
    equipment_has_mobility_recovery: false,
    equipment_has_mobility_stretching: false,
    equipment_has_functional_equipment: false,
    equipment_has_functional_tools: false,
    equipment_has_light_weights: false,
    equipment_has_adjustable_dumbbells: false,
    equipment_has_mat_work: false,
    equipment_has_mat_based_work: false,
    equipment_has_resistance_tubes: false,
    equipment_has_suspension_trainers: false,
    equipment_has_sandbags: false,
    equipment_has_jump_rope: false,
    equipment_has_machines: false,
    equipment_has_cable_stations: false,
    equipment_has_dumbbells: false,
    equipment_has_stretch_area: false,
    equipment_has_cardio: false,
    equipment_has_olympic_lifting: false,
    equipment_has_conditioning_tools: false,
    equipment_has_athletic_accessories: false,
    equipment_has_sport_specific: false,
    
    // TIER 3: SPECIFIC EQUIPMENT FLAGS
    equipment_subtypes_count: 0,
    equipment_has_dumbbells_specific: false,
    equipment_has_barbells: false,
    equipment_has_kettlebells: false,
    equipment_has_plates: false,
    equipment_has_ez_curl_bar: false,
    equipment_has_trap_bar: false,
    equipment_has_adjustable_dumbbells_specific: false,
    equipment_has_squat_rack: false,
    equipment_has_smith_machine_specific: false,
    equipment_has_pull_up_bar: false,
    equipment_has_dip_station: false,
    equipment_has_safety_arms: false,
    equipment_has_landmine: false,
    equipment_has_functional_trainer: false,
    equipment_has_lat_pulldown: false,
    equipment_has_low_row: false,
    equipment_has_cable_column: false,
    equipment_has_cable_attachments: false,
    equipment_has_mini_bands: false,
    equipment_has_loop_bands: false,
    equipment_has_resistance_tubes_specific: false,
    equipment_has_figure_8_bands: false,
    equipment_has_door_anchor: false,
    equipment_has_chest_press: false,
    equipment_has_leg_press: false,
    equipment_has_leg_curl: false,
    equipment_has_pec_deck: false,
    equipment_has_seated_row: false,
    equipment_has_shoulder_press: false,
    equipment_has_treadmill: false,
    equipment_has_stationary_bike: false,
    equipment_has_elliptical: false,
    equipment_has_rowing_machine: false,
    equipment_has_stair_climber: false,
    equipment_has_assault_bike: false,
    equipment_has_jump_rope_specific: false,
    equipment_has_step_stool: false,
    equipment_has_yoga_mat: false,
    equipment_has_foam_roller: false,
    equipment_has_massage_ball: false,
    equipment_has_stability_ball: false,
    equipment_has_stretching_strap: false,
    equipment_has_medicine_ball: false,
    equipment_has_battle_ropes: false,
    equipment_has_plyo_box: false,
    equipment_has_parallettes: false,
    equipment_has_weighted_vest: false,
    equipment_has_agility_ladder: false,
    equipment_has_sandbag: false,
    equipment_has_bulgarian_bag: false,
    equipment_has_trx: false,
    equipment_has_suspension_trainer: false,
    equipment_has_olympic_barbell: false,
    equipment_has_bumper_plates: false,
    equipment_has_lifting_platform: false,
    equipment_has_jerk_blocks: false,
    equipment_has_sled: false,
    equipment_has_tire: false,
    equipment_has_cones: false,
    equipment_has_hurdles: false,
    equipment_has_parachute: false,
    
    // TIER 4: WEIGHT ANALYSIS
    equipment_total_weight_types: 0,
    equipment_total_weight_count: 0,
    equipment_overall_min_weight: null,
    equipment_overall_max_weight: null,
    equipment_dumbbells_min_weight: null,
    equipment_dumbbells_max_weight: null,
    equipment_dumbbells_weight_count: 0,
    equipment_dumbbells_has_light: false,
    equipment_dumbbells_has_medium: false,
    equipment_dumbbells_has_heavy: false,
    equipment_barbells_min_weight: null,
    equipment_barbells_max_weight: null,
    equipment_barbells_weight_count: 0,
    equipment_barbells_has_standard: false,
    equipment_barbells_has_loaded: false,
    equipment_barbells_has_heavy: false,
    equipment_kettlebells_min_weight: null,
    equipment_kettlebells_max_weight: null,
    equipment_kettlebells_weight_count: 0,
    equipment_kettlebells_has_light: false,
    equipment_kettlebells_has_medium: false,
    equipment_kettlebells_has_heavy: false,
    equipment_plates_min_weight: null,
    equipment_plates_max_weight: null,
    equipment_plates_weight_count: 0,
    equipment_adjustable_dumbbells_min_weight: null,
    equipment_adjustable_dumbbells_max_weight: null,
    equipment_adjustable_dumbbells_weight_count: 0,
    
    // SUMMARY ANALYTICS
    equipment_versatility_score: 0,
    equipment_strength_capability: 0,
    equipment_cardio_capability: 0,
    equipment_functional_capability: 0,
    
    // BACKUP & META
    equipment_data_json: JSON.stringify(null),
    equipment_last_updated: new Date().toISOString(),
    equipment_flattener_version: "2.0.0"
  };
}

// Enhanced flattener function - generates comprehensive boolean flags
export function flattenEquipmentData(data: EquipmentSelectionData | string[] | undefined): EnhancedEquipmentFlat {
  // Handle undefined/null input
  if (!data) {
    return createEmptyFlattened();
  }
  
  // Handle legacy format (string array)
  if (Array.isArray(data)) {
    return flattenLegacyEquipment(data);
  }
  
  // Handle modern format (EquipmentSelectionData)
  return flattenModernEquipment(data);
}

// Flatten legacy string array format
function flattenLegacyEquipment(data: string[]): EnhancedEquipmentFlat {
  const result = createEmptyFlattened();
  
  // Basic equipment detection
  data.forEach(item => {
    const itemLower = item.toLowerCase();
    
    // Set specific equipment flags
    if (itemLower.includes('dumbbell')) result.equipment_has_dumbbells_specific = true;
    if (itemLower.includes('barbell')) result.equipment_has_barbells = true;
    if (itemLower.includes('kettlebell')) result.equipment_has_kettlebells = true;
    if (itemLower.includes('treadmill')) result.equipment_has_treadmill = true;
    if (itemLower.includes('elliptical')) result.equipment_has_elliptical = true;
    if (itemLower.includes('bike')) result.equipment_has_stationary_bike = true;
    if (itemLower.includes('yoga_mat') || itemLower.includes('mat')) result.equipment_has_yoga_mat = true;
    if (itemLower.includes('pull_up') || itemLower.includes('pullup')) result.equipment_has_pull_up_bar = true;
  });
  
  // Set context flags based on equipment
  if (result.equipment_has_dumbbells_specific || result.equipment_has_barbells || result.equipment_has_kettlebells) {
    result.equipment_has_free_weights = true;
  }
  if (result.equipment_has_treadmill || result.equipment_has_elliptical || result.equipment_has_stationary_bike) {
    result.equipment_has_basic_cardio = true;
  }
  if (result.equipment_has_yoga_mat || result.equipment_has_pull_up_bar) {
    result.equipment_has_bodyweight = true;
  }
  
  result.equipment_subtypes_count = data.length;
  result.equipment_data_json = JSON.stringify(data);
  result.equipment_last_updated = new Date().toISOString();
  
  return result;
}

// Flatten modern EquipmentSelectionData format
function flattenModernEquipment(data: EquipmentSelectionData): EnhancedEquipmentFlat {
  const result = createEmptyFlattened();
  
  // TIER 1: Location flags
  if (data.location) {
    result.equipment_location = data.location;
    result.equipment_location_home = data.location === 'home';
    result.equipment_location_home_gym = data.location === 'home_gym';
    result.equipment_location_gym = data.location === 'gym';
    result.equipment_location_hotel = data.location === 'hotel';
    result.equipment_location_park = data.location === 'park';
    result.equipment_location_corporate_gym = data.location === 'corporate_gym';
    result.equipment_location_athletic_club = data.location === 'athletic_club';
  }
  
  // TIER 2: Context flags
  const contexts = data.contexts || [];
  result.equipment_contexts_count = contexts.length;
  
  contexts.forEach(context => {
    switch (context) {
      case 'Free Weights': result.equipment_has_free_weights = true; break;
      case 'Resistance Machines': result.equipment_has_resistance_machines = true; break;
      case 'Cable Systems': result.equipment_has_cable_systems = true; break;
      case 'Smith Machine': result.equipment_has_smith_machine = true; break;
      case 'Racks & Rigs': result.equipment_has_racks_rigs = true; break;
      case 'Bodyweight': result.equipment_has_bodyweight = true; break;
      case 'Resistance Bands': result.equipment_has_resistance_bands = true; break;
      case 'Basic Cardio': result.equipment_has_basic_cardio = true; break;
      case 'Advanced Cardio': result.equipment_has_advanced_cardio = true; break;
      case 'Minimal Cardio': result.equipment_has_minimal_cardio = true; break;
      case 'Cardio Machines': result.equipment_has_cardio_machines = true; break;
      case 'Mobility & Recovery': result.equipment_has_mobility_recovery = true; break;
      case 'Mobility & Stretching': result.equipment_has_mobility_stretching = true; break;
      case 'Functional Equipment': result.equipment_has_functional_equipment = true; break;
      case 'Functional Tools': result.equipment_has_functional_tools = true; break;
      case 'Light Weights': result.equipment_has_light_weights = true; break;
      case 'Adjustable Dumbbells': result.equipment_has_adjustable_dumbbells = true; break;
      case 'Mat Work': result.equipment_has_mat_work = true; break;
      case 'Mat-Based Work': result.equipment_has_mat_based_work = true; break;
      case 'Resistance Tubes': result.equipment_has_resistance_tubes = true; break;
      case 'Suspension Trainers': result.equipment_has_suspension_trainers = true; break;
      case 'Sandbags': result.equipment_has_sandbags = true; break;
      case 'Jump Rope': result.equipment_has_jump_rope = true; break;
      case 'Machines': result.equipment_has_machines = true; break;
      case 'Cable Stations': result.equipment_has_cable_stations = true; break;
      case 'Dumbbells': result.equipment_has_dumbbells = true; break;
      case 'Stretch Area': result.equipment_has_stretch_area = true; break;
      case 'Cardio': result.equipment_has_cardio = true; break;
      case 'Olympic Lifting': result.equipment_has_olympic_lifting = true; break;
      case 'Conditioning Tools': result.equipment_has_conditioning_tools = true; break;
      case 'Athletic Accessories': result.equipment_has_athletic_accessories = true; break;
      case 'Sport-Specific': result.equipment_has_sport_specific = true; break;
    }
  });
  
  // TIER 3: Specific equipment flags
  const equipment = data.specificEquipment || [];
  result.equipment_subtypes_count = equipment.length;
  
  equipment.forEach(item => {
    switch (item) {
      case 'dumbbells': result.equipment_has_dumbbells_specific = true; break;
      case 'barbells': result.equipment_has_barbells = true; break;
      case 'kettlebells': result.equipment_has_kettlebells = true; break;
      case 'plates': result.equipment_has_plates = true; break;
      case 'ez_curl_bar': result.equipment_has_ez_curl_bar = true; break;
      case 'trap_bar': result.equipment_has_trap_bar = true; break;
      case 'adjustable_dumbbells': result.equipment_has_adjustable_dumbbells_specific = true; break;
      case 'squat_rack': result.equipment_has_squat_rack = true; break;
      case 'smith_machine': result.equipment_has_smith_machine_specific = true; break;
      case 'pull_up_bar': result.equipment_has_pull_up_bar = true; break;
      case 'dip_station': result.equipment_has_dip_station = true; break;
      case 'safety_arms': result.equipment_has_safety_arms = true; break;
      case 'landmine': result.equipment_has_landmine = true; break;
      case 'functional_trainer': result.equipment_has_functional_trainer = true; break;
      case 'lat_pulldown': result.equipment_has_lat_pulldown = true; break;
      case 'low_row': result.equipment_has_low_row = true; break;
      case 'cable_column': result.equipment_has_cable_column = true; break;
      case 'cable_attachments': result.equipment_has_cable_attachments = true; break;
      case 'mini_bands': result.equipment_has_mini_bands = true; break;
      case 'loop_bands': result.equipment_has_loop_bands = true; break;
      case 'resistance_tubes': result.equipment_has_resistance_tubes_specific = true; break;
      case 'figure_8_bands': result.equipment_has_figure_8_bands = true; break;
      case 'door_anchor': result.equipment_has_door_anchor = true; break;
      case 'chest_press': result.equipment_has_chest_press = true; break;
      case 'leg_press': result.equipment_has_leg_press = true; break;
      case 'leg_curl': result.equipment_has_leg_curl = true; break;
      case 'pec_deck': result.equipment_has_pec_deck = true; break;
      case 'seated_row': result.equipment_has_seated_row = true; break;
      case 'shoulder_press': result.equipment_has_shoulder_press = true; break;
      case 'treadmill': result.equipment_has_treadmill = true; break;
      case 'stationary_bike': result.equipment_has_stationary_bike = true; break;
      case 'elliptical': result.equipment_has_elliptical = true; break;
      case 'rowing_machine': result.equipment_has_rowing_machine = true; break;
      case 'stair_climber': result.equipment_has_stair_climber = true; break;
      case 'assault_bike': result.equipment_has_assault_bike = true; break;
      case 'jump_rope': result.equipment_has_jump_rope_specific = true; break;
      case 'step_stool': result.equipment_has_step_stool = true; break;
      case 'yoga_mat': result.equipment_has_yoga_mat = true; break;
      case 'foam_roller': result.equipment_has_foam_roller = true; break;
      case 'massage_ball': result.equipment_has_massage_ball = true; break;
      case 'stability_ball': result.equipment_has_stability_ball = true; break;
      case 'stretching_strap': result.equipment_has_stretching_strap = true; break;
      case 'medicine_ball': result.equipment_has_medicine_ball = true; break;
      case 'battle_ropes': result.equipment_has_battle_ropes = true; break;
      case 'plyo_box': result.equipment_has_plyo_box = true; break;
      case 'parallettes': result.equipment_has_parallettes = true; break;
      case 'weighted_vest': result.equipment_has_weighted_vest = true; break;
      case 'agility_ladder': result.equipment_has_agility_ladder = true; break;
      case 'sandbag': result.equipment_has_sandbag = true; break;
      case 'bulgarian_bag': result.equipment_has_bulgarian_bag = true; break;
      case 'trx': result.equipment_has_trx = true; break;
      case 'suspension_trainer': result.equipment_has_suspension_trainer = true; break;
      case 'olympic_barbell': result.equipment_has_olympic_barbell = true; break;
      case 'bumper_plates': result.equipment_has_bumper_plates = true; break;
      case 'lifting_platform': result.equipment_has_lifting_platform = true; break;
      case 'jerk_blocks': result.equipment_has_jerk_blocks = true; break;
      case 'sled': result.equipment_has_sled = true; break;
      case 'tire': result.equipment_has_tire = true; break;
      case 'cones': result.equipment_has_cones = true; break;
      case 'hurdles': result.equipment_has_hurdles = true; break;
      case 'parachute': result.equipment_has_parachute = true; break;
    }
  });
  
  // TIER 4: Weight analysis
  const weights = data.weights || {};
  const weightTypes = Object.keys(weights);
  result.equipment_total_weight_types = weightTypes.length;
  
  let allWeights: number[] = [];
  
  // Process each weight type
  weightTypes.forEach(type => {
    const typeWeights = weights[type] || [];
    allWeights = allWeights.concat(typeWeights);
    
    switch (type) {
      case 'dumbbells':
        result.equipment_dumbbells_min_weight = typeWeights.length ? Math.min(...typeWeights) : null;
        result.equipment_dumbbells_max_weight = typeWeights.length ? Math.max(...typeWeights) : null;
        result.equipment_dumbbells_weight_count = typeWeights.length;
        result.equipment_dumbbells_has_light = typeWeights.some(w => w < 20);
        result.equipment_dumbbells_has_medium = typeWeights.some(w => w >= 20 && w <= 50);
        result.equipment_dumbbells_has_heavy = typeWeights.some(w => w > 50);
        break;
      case 'barbells':
        result.equipment_barbells_min_weight = typeWeights.length ? Math.min(...typeWeights) : null;
        result.equipment_barbells_max_weight = typeWeights.length ? Math.max(...typeWeights) : null;
        result.equipment_barbells_weight_count = typeWeights.length;
        result.equipment_barbells_has_standard = typeWeights.includes(45);
        result.equipment_barbells_has_loaded = typeWeights.some(w => w > 135);
        result.equipment_barbells_has_heavy = typeWeights.some(w => w > 225);
        break;
      case 'kettlebells':
        result.equipment_kettlebells_min_weight = typeWeights.length ? Math.min(...typeWeights) : null;
        result.equipment_kettlebells_max_weight = typeWeights.length ? Math.max(...typeWeights) : null;
        result.equipment_kettlebells_weight_count = typeWeights.length;
        result.equipment_kettlebells_has_light = typeWeights.some(w => w < 16);
        result.equipment_kettlebells_has_medium = typeWeights.some(w => w >= 16 && w <= 32);
        result.equipment_kettlebells_has_heavy = typeWeights.some(w => w > 32);
        break;
      case 'plates':
        result.equipment_plates_min_weight = typeWeights.length ? Math.min(...typeWeights) : null;
        result.equipment_plates_max_weight = typeWeights.length ? Math.max(...typeWeights) : null;
        result.equipment_plates_weight_count = typeWeights.length;
        break;
      case 'adjustable_dumbbells':
        result.equipment_adjustable_dumbbells_min_weight = typeWeights.length ? Math.min(...typeWeights) : null;
        result.equipment_adjustable_dumbbells_max_weight = typeWeights.length ? Math.max(...typeWeights) : null;
        result.equipment_adjustable_dumbbells_weight_count = typeWeights.length;
        break;
    }
  });
  
  result.equipment_total_weight_count = allWeights.length;
  result.equipment_overall_min_weight = allWeights.length ? Math.min(...allWeights) : null;
  result.equipment_overall_max_weight = allWeights.length ? Math.max(...allWeights) : null;
  
  // Calculate capability scores
  result.equipment_versatility_score = calculateVersatilityScore(result);
  result.equipment_strength_capability = calculateStrengthCapability(result);
  result.equipment_cardio_capability = calculateCardioCapability(result);
  result.equipment_functional_capability = calculateFunctionalCapability(result);
  
  result.equipment_data_json = JSON.stringify(data);
  result.equipment_last_updated = data.lastUpdated ? data.lastUpdated.toISOString() : new Date().toISOString();
  
  return result;
}

// Calculate versatility score (0-100) based on equipment variety
function calculateVersatilityScore(result: EnhancedEquipmentFlat): number {
  let score = 0;
  
  // Location diversity (10 points)
  if (result.equipment_location) score += 10;
  
  // Context variety (40 points max - 5 points per major context type)
  const contextFlags = [
    result.equipment_has_free_weights, result.equipment_has_resistance_machines,
    result.equipment_has_cable_systems, result.equipment_has_bodyweight,
    result.equipment_has_basic_cardio, result.equipment_has_advanced_cardio,
    result.equipment_has_functional_equipment, result.equipment_has_mobility_recovery
  ];
  score += contextFlags.filter(Boolean).length * 5;
  
  // Equipment variety (40 points max)
  score += Math.min(result.equipment_subtypes_count * 2, 40);
  
  // Weight variety (10 points max)
  score += Math.min(result.equipment_total_weight_types * 2, 10);
  
  return Math.min(score, 100);
}

// Calculate strength capability (0-100) based on weight availability
function calculateStrengthCapability(result: EnhancedEquipmentFlat): number {
  let score = 0;
  
  // Free weight availability (50 points)
  if (result.equipment_has_dumbbells_specific) score += 15;
  if (result.equipment_has_barbells) score += 20;
  if (result.equipment_has_kettlebells) score += 15;
  
  // Weight range coverage (30 points)
  if (result.equipment_dumbbells_has_light) score += 5;
  if (result.equipment_dumbbells_has_medium) score += 10;
  if (result.equipment_dumbbells_has_heavy) score += 10;
  if (result.equipment_barbells_has_loaded) score += 5;
  
  // Machine availability (20 points)
  if (result.equipment_has_resistance_machines) score += 10;
  if (result.equipment_has_cable_systems) score += 10;
  
  return Math.min(score, 100);
}

// Calculate cardio capability (0-100) based on cardio options
function calculateCardioCapability(result: EnhancedEquipmentFlat): number {
  let score = 0;
  
  // Basic cardio equipment (60 points)
  if (result.equipment_has_treadmill) score += 20;
  if (result.equipment_has_elliptical) score += 15;
  if (result.equipment_has_stationary_bike) score += 15;
  if (result.equipment_has_rowing_machine) score += 10;
  
  // Advanced/specialized cardio (25 points)
  if (result.equipment_has_stair_climber) score += 10;
  if (result.equipment_has_assault_bike) score += 15;
  
  // Minimal/functional cardio (15 points)
  if (result.equipment_has_jump_rope_specific) score += 10;
  if (result.equipment_has_battle_ropes) score += 5;
  
  return Math.min(score, 100);
}

// Calculate functional capability (0-100) based on functional tools
function calculateFunctionalCapability(result: EnhancedEquipmentFlat): number {
  let score = 0;
  
  // Core functional tools (50 points)
  if (result.equipment_has_medicine_ball) score += 10;
  if (result.equipment_has_battle_ropes) score += 10;
  if (result.equipment_has_plyo_box) score += 10;
  if (result.equipment_has_kettlebells) score += 10;
  if (result.equipment_has_sandbag) score += 10;
  
  // Bodyweight/suspension (25 points)
  if (result.equipment_has_pull_up_bar) score += 10;
  if (result.equipment_has_trx) score += 15;
  
  // Athletic accessories (25 points)
  if (result.equipment_has_agility_ladder) score += 5;
  if (result.equipment_has_cones) score += 5;
  if (result.equipment_has_hurdles) score += 5;
  if (result.equipment_has_weighted_vest) score += 10;
  
  return Math.min(score, 100);
}

// Enhanced usage example
export function getEquipmentSummary(flattened: EnhancedEquipmentFlat): string {
  const parts = [];
  
  if (flattened.equipment_location) {
    parts.push(`Location: ${flattened.equipment_location.replace('_', ' ')}`);
  }
  
  if (flattened.equipment_overall_min_weight && flattened.equipment_overall_max_weight) {
    parts.push(`Weights: ${flattened.equipment_overall_min_weight}-${flattened.equipment_overall_max_weight} lbs`);
  }
  
  if (flattened.equipment_has_free_weights) parts.push('Free Weights');
  if (flattened.equipment_has_basic_cardio || flattened.equipment_has_advanced_cardio) parts.push('Cardio');
  if (flattened.equipment_has_bodyweight) parts.push('Bodyweight');
  if (flattened.equipment_has_functional_equipment) parts.push('Functional');
  
  parts.push(`Versatility: ${flattened.equipment_versatility_score}%`);
  
  return parts.join(' • ') || 'No equipment selected';
} 