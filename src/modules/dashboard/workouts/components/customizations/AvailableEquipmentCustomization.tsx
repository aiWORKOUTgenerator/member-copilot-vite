import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { CustomizationComponentProps, EquipmentSelectionData } from '../types';
import {
  generateBadgeClass,
  getCustomizationButtonClass,
} from '../utils/customizationHelpers';
import {
  ErrorDisplay,
  SelectionSummary,
} from '../utils/customizationComponents';

// Workout locations for Tier 1 selection
const WORKOUT_LOCATIONS = [
  { label: 'Home', value: 'home' },
  { label: 'Home Gym', value: 'home_gym' },
  { label: 'Gym', value: 'gym' },
  { label: 'Hotel', value: 'hotel' },
  { label: 'Park', value: 'park' },
  { label: 'Corporate Gym', value: 'corporate_gym' },
  { label: 'Athletic Club', value: 'athletic_club' },
];

// Equipment contexts by location for Tier 2 selection
const EQUIPMENT_CONTEXTS_BY_LOCATION = {
  home: [
    'Bodyweight',
    'Resistance Bands',
    'Light Weights',
    'Mat Work',
    'Minimal Cardio',
    'Functional Equipment',
  ],
  home_gym: [
    'Free Weights',
    'Racks & Rigs',
    'Basic Cardio',
    'Mobility & Recovery',
    'Functional Equipment',
  ],
  gym: [
    'Free Weights',
    'Resistance Machines',
    'Cable Systems',
    'Smith Machine',
    'Advanced Cardio',
    'Mobility & Stretching',
  ],
  hotel: [
    'Adjustable Dumbbells',
    'Bodyweight',
    'Resistance Tubes',
    'Cardio Machines',
    'Mat-Based Work',
  ],
  park: [
    'Bodyweight',
    'Functional Tools',
    'Suspension Trainers',
    'Sandbags',
    'Jump Rope',
  ],
  corporate_gym: [
    'Machines',
    'Cable Stations',
    'Dumbbells',
    'Stretch Area',
    'Cardio',
  ],
  athletic_club: [
    'Olympic Lifting',
    'Conditioning Tools',
    'Athletic Accessories',
    'Sport-Specific',
  ],
};

// Specific equipment subtypes by context for Tier 3 selection
const EQUIPMENT_SUBTYPES_BY_CONTEXT = {
  'Free Weights': [
    { value: 'dumbbells', label: 'Dumbbells' },
    { value: 'barbells', label: 'Barbells' },
    { value: 'kettlebells', label: 'Kettlebells' },
    { value: 'plates', label: 'Weight Plates' },
    { value: 'ez_curl_bar', label: 'EZ Curl Bar' },
    { value: 'trap_bar', label: 'Trap Bar' },
    { value: 'adjustable_dumbbells', label: 'Adjustable Dumbbells' },
  ],
  'Racks & Rigs': [
    { value: 'squat_rack', label: 'Squat Rack' },
    { value: 'smith_machine', label: 'Smith Machine' },
    { value: 'pull_up_bar', label: 'Pull-Up Bar' },
    { value: 'dip_station', label: 'Dip Station' },
    { value: 'safety_arms', label: 'Safety Arms' },
    { value: 'landmine', label: 'Landmine Attachment' },
  ],
  'Cable Systems': [
    { value: 'functional_trainer', label: 'Functional Trainer' },
    { value: 'lat_pulldown', label: 'Lat Pulldown' },
    { value: 'low_row', label: 'Low Row' },
    { value: 'cable_column', label: 'Cable Column' },
    { value: 'cable_attachments', label: 'Cable Attachments' },
  ],
  'Resistance Bands': [
    { value: 'mini_bands', label: 'Mini Bands' },
    { value: 'loop_bands', label: 'Long Loop Bands' },
    { value: 'resistance_tubes', label: 'Resistance Tubes' },
    { value: 'figure_8_bands', label: 'Figure-8 Bands' },
    { value: 'door_anchor', label: 'Door Anchor' },
  ],
  'Resistance Machines': [
    { value: 'chest_press', label: 'Chest Press' },
    { value: 'leg_press', label: 'Leg Press' },
    { value: 'leg_curl', label: 'Leg Curl/Extension' },
    { value: 'pec_deck', label: 'Pec Deck' },
    { value: 'seated_row', label: 'Seated Row' },
    { value: 'shoulder_press', label: 'Shoulder Press' },
  ],
  'Basic Cardio': [
    { value: 'treadmill', label: 'Treadmill' },
    { value: 'stationary_bike', label: 'Stationary Bike' },
    { value: 'elliptical', label: 'Elliptical' },
  ],
  'Advanced Cardio': [
    { value: 'treadmill', label: 'Treadmill' },
    { value: 'elliptical', label: 'Elliptical' },
    { value: 'stationary_bike', label: 'Stationary Bike' },
    { value: 'rowing_machine', label: 'Rowing Machine' },
    { value: 'stair_climber', label: 'Stair Climber' },
    { value: 'assault_bike', label: 'Assault Bike' },
  ],
  'Minimal Cardio': [
    { value: 'jump_rope', label: 'Jump Rope' },
    { value: 'step_stool', label: 'Step Stool' },
  ],
  'Cardio Machines': [
    { value: 'treadmill', label: 'Treadmill' },
    { value: 'elliptical', label: 'Elliptical' },
    { value: 'stationary_bike', label: 'Stationary Bike' },
  ],
  'Mobility & Recovery': [
    { value: 'yoga_mat', label: 'Yoga Mat' },
    { value: 'foam_roller', label: 'Foam Roller' },
    { value: 'massage_ball', label: 'Massage Ball' },
    { value: 'stability_ball', label: 'Stability Ball' },
    { value: 'stretching_strap', label: 'Stretching Strap' },
  ],
  'Mobility & Stretching': [
    { value: 'yoga_mat', label: 'Yoga Mat' },
    { value: 'foam_roller', label: 'Foam Roller' },
    { value: 'massage_ball', label: 'Massage Ball' },
    { value: 'stability_ball', label: 'Stability Ball' },
    { value: 'stretching_strap', label: 'Stretching Strap' },
  ],
  'Functional Equipment': [
    { value: 'medicine_ball', label: 'Medicine Ball' },
    { value: 'battle_ropes', label: 'Battle Ropes' },
    { value: 'plyo_box', label: 'Plyo Box' },
    { value: 'parallettes', label: 'Parallettes' },
    { value: 'weighted_vest', label: 'Weighted Vest' },
  ],
  'Functional Tools': [
    { value: 'sandbags', label: 'Sandbags' },
    { value: 'medicine_ball', label: 'Medicine Ball' },
    { value: 'battle_ropes', label: 'Battle Ropes' },
    { value: 'plyo_box', label: 'Plyo Box' },
    { value: 'agility_ladder', label: 'Agility Ladder' },
  ],
  Bodyweight: [
    { value: 'pull_up_bar', label: 'Pull-Up Bar' },
    { value: 'parallel_bars', label: 'Parallel Bars' },
    { value: 'yoga_mat', label: 'Yoga Mat' },
    { value: 'wall_space', label: 'Wall Space' },
  ],
  'Light Weights': [
    { value: 'light_dumbbells', label: 'Light Dumbbells (1-15 lbs)' },
    { value: 'ankle_weights', label: 'Ankle Weights' },
  ],
  'Adjustable Dumbbells': [
    { value: 'bowflex_dumbbells', label: 'Bowflex Dumbbells' },
    { value: 'powerblock', label: 'PowerBlock' },
    { value: 'ironmaster', label: 'IronMaster' },
  ],
  'Mat Work': [
    { value: 'yoga_mat', label: 'Yoga Mat' },
    { value: 'pilates_ring', label: 'Pilates Ring' },
    { value: 'yoga_blocks', label: 'Yoga Blocks' },
    { value: 'sliders', label: 'Sliders' },
  ],
  'Mat-Based Work': [
    { value: 'yoga_mat', label: 'Yoga Mat' },
    { value: 'pilates_ring', label: 'Pilates Ring' },
    { value: 'yoga_blocks', label: 'Yoga Blocks' },
    { value: 'sliders', label: 'Sliders' },
  ],
  'Resistance Tubes': [
    { value: 'resistance_tubes', label: 'Resistance Tubes with Handles' },
    { value: 'door_anchor', label: 'Door Anchor' },
    { value: 'ankle_straps', label: 'Ankle Straps' },
  ],
  'Suspension Trainers': [
    { value: 'trx', label: 'TRX' },
    { value: 'suspension_trainer', label: 'Suspension Trainer' },
  ],
  Sandbags: [
    { value: 'sandbag', label: 'Sandbag' },
    { value: 'bulgarian_bag', label: 'Bulgarian Bag' },
  ],
  'Jump Rope': [
    { value: 'jump_rope', label: 'Jump Rope' },
    { value: 'weighted_jump_rope', label: 'Weighted Jump Rope' },
  ],
  Machines: [
    { value: 'chest_press', label: 'Chest Press' },
    { value: 'leg_press', label: 'Leg Press' },
    { value: 'lat_pulldown', label: 'Lat Pulldown' },
    { value: 'seated_row', label: 'Seated Row' },
  ],
  'Cable Stations': [
    { value: 'cable_crossover', label: 'Cable Crossover' },
    { value: 'lat_pulldown', label: 'Lat Pulldown' },
    { value: 'low_row', label: 'Low Row' },
  ],
  Dumbbells: [
    { value: 'fixed_dumbbells', label: 'Fixed Dumbbells' },
    { value: 'adjustable_dumbbells', label: 'Adjustable Dumbbells' },
  ],
  'Stretch Area': [
    { value: 'yoga_mats', label: 'Yoga Mats' },
    { value: 'foam_rollers', label: 'Foam Rollers' },
    { value: 'stretching_cage', label: 'Stretching Cage' },
  ],
  Cardio: [
    { value: 'treadmill', label: 'Treadmill' },
    { value: 'elliptical', label: 'Elliptical' },
    { value: 'stationary_bike', label: 'Stationary Bike' },
  ],
  'Olympic Lifting': [
    { value: 'olympic_barbell', label: 'Olympic Barbell' },
    { value: 'bumper_plates', label: 'Bumper Plates' },
    { value: 'lifting_platform', label: 'Lifting Platform' },
    { value: 'jerk_blocks', label: 'Jerk Blocks' },
  ],
  'Conditioning Tools': [
    { value: 'kettlebells', label: 'Kettlebells' },
    { value: 'battle_ropes', label: 'Battle Ropes' },
    { value: 'sled', label: 'Sled' },
    { value: 'tire', label: 'Tire' },
  ],
  'Athletic Accessories': [
    { value: 'agility_ladder', label: 'Agility Ladder' },
    { value: 'cones', label: 'Cones' },
    { value: 'hurdles', label: 'Hurdles' },
    { value: 'parachute', label: 'Speed Parachute' },
  ],
  'Sport-Specific': [
    { value: 'medicine_balls', label: 'Medicine Balls' },
    { value: 'plyometric_boxes', label: 'Plyometric Boxes' },
    { value: 'agility_equipment', label: 'Agility Equipment' },
  ],
} as const;

// Equipment weight options for Tier 4 selection
const EQUIPMENT_WEIGHTS = {
  dumbbells: {
    label: 'Dumbbells',
    weights: {
      lbs: [
        5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
        95, 100, 105, 110, 115, 120,
      ],
      kg: [
        2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 27.5, 30, 32.5, 35, 37.5,
        40, 42.5, 45, 47.5, 50,
      ],
    },
  },
  barbells: {
    label: 'Barbells',
    weights: {
      lbs: [
        45, 65, 85, 95, 115, 135, 155, 185, 205, 225, 245, 275, 315, 365, 405,
      ],
      kg: [20, 30, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 140, 160, 180],
    },
  },
  plates: {
    label: 'Weight Plates',
    weights: {
      lbs: [2.5, 5, 10, 25, 35, 45],
      kg: [1.25, 2.5, 5, 10, 15, 20],
    },
  },
  kettlebells: {
    label: 'Kettlebells',
    weights: {
      lbs: [9, 18, 26, 35, 44, 53, 62, 70, 79, 88, 97, 106],
      kg: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48],
    },
  },
  ez_curl_bar: {
    label: 'EZ Curl Bar',
    weights: {
      lbs: [20, 30, 40, 50, 60, 70, 80],
      kg: [10, 15, 20, 25, 30, 35, 40],
    },
  },
  trap_bar: {
    label: 'Trap Bar / Hex Bar',
    weights: {
      lbs: [95, 115, 135, 185, 225, 275, 315, 365],
      kg: [45, 50, 60, 80, 100, 125, 140, 160],
    },
  },
  adjustable_dumbbells: {
    label: 'Adjustable Dumbbells',
    weights: {
      lbs: [
        5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
      ],
      kg: [
        2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 27.5, 30, 32.5, 35, 37.5,
        40,
      ],
    },
  },
  medicine_ball: {
    label: 'Medicine Balls',
    weights: {
      lbs: [4, 6, 8, 10, 12, 15, 20, 25, 30],
      kg: [2, 3, 4, 5, 6, 8, 10, 12, 15],
    },
  },
  sandbag: {
    label: 'Sandbags',
    weights: {
      lbs: [25, 40, 60, 80, 100, 120],
      kg: [10, 20, 30, 40, 50, 60],
    },
  },
  weighted_vest: {
    label: 'Weighted Vests',
    weights: {
      lbs: [10, 15, 20, 30, 40, 50],
      kg: [5, 7.5, 10, 15, 20, 25],
    },
  },
} as const;

// Helper to detect if value is legacy format
const isLegacyFormat = (value: unknown): value is string[] => {
  return (
    Array.isArray(value) && (value.length === 0 || typeof value[0] === 'string')
  );
};

// Helper to convert legacy format to new format
const convertLegacyToNewFormat = (
  legacyValue: string[]
): EquipmentSelectionData => {
  return {
    location: undefined,
    contexts: [],
    specificEquipment: legacyValue,
    weights: {},
    lastUpdated: new Date(),
  };
};

// ✅ PERFORMANCE OPTIMIZATION: Memoize AvailableEquipmentCustomization to prevent unnecessary re-renders
export default memo(function AvailableEquipmentCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<string[] | EquipmentSelectionData | undefined>) {
  // Handle both legacy and new format
  const equipmentData = (() => {
    if (!value) {
      return {
        location: undefined,
        contexts: [],
        specificEquipment: [],
        weights: {},
      };
    }
    if (isLegacyFormat(value)) {
      return convertLegacyToNewFormat(value);
    }
    return value as EquipmentSelectionData;
  })();

  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(
    equipmentData.location
  );
  const [selectedContexts, setSelectedContexts] = useState<string[]>(
    equipmentData.contexts
  );
  const [selectedSubtypes, setSelectedSubtypes] = useState<string[]>(
    equipmentData.specificEquipment
  );
  const [selectedWeights, setSelectedWeights] = useState<{
    [equipmentType: string]: number[];
  }>(equipmentData.weights || {});
  const [selectionMode, setSelectionMode] = useState<'range' | 'individual'>(
    'range'
  );
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [rangeState, setRangeState] = useState<{
    [equipmentType: string]: { start?: number; end?: number };
  }>({});

  // ✅ CRITICAL FIX: Use ref for stable timestamp instead of new Date() every render
  const lastUpdatedRef = useRef<Date>(new Date());

  // ✅ CRITICAL FIX: Stable data creation function
  const createEquipmentData = useCallback(
    (
      location: string | undefined,
      contexts: string[],
      specificEquipment: string[],
      weights: { [equipmentType: string]: number[] }
    ): EquipmentSelectionData => ({
      location,
      contexts,
      specificEquipment,
      weights,
      lastUpdated: lastUpdatedRef.current, // ← Stable reference
    }),
    []
  );

  // ✅ CRITICAL FIX: Controlled component pattern - immediate change emission
  const emitChange = useCallback(
    (
      location: string | undefined,
      contexts: string[],
      specificEquipment: string[],
      weights: { [equipmentType: string]: number[] }
    ) => {
      // Update timestamp only when data actually changes
      lastUpdatedRef.current = new Date();

      // Only update if there's meaningful data or clear it if empty
      if (
        location ||
        contexts.length > 0 ||
        specificEquipment.length > 0 ||
        Object.keys(weights).some((key) => weights[key].length > 0)
      ) {
        const newData = createEquipmentData(
          location,
          contexts,
          specificEquipment,
          weights
        );
        onChange(newData);
      } else {
        onChange(undefined);
      }
    },
    [onChange, createEquipmentData]
  );

  // Reset contexts and subtypes when location changes
  useEffect(() => {
    if (
      selectedLocation &&
      EQUIPMENT_CONTEXTS_BY_LOCATION[
        selectedLocation as keyof typeof EQUIPMENT_CONTEXTS_BY_LOCATION
      ]
    ) {
      setSelectedContexts([]);
      setSelectedSubtypes([]);
    }
  }, [selectedLocation]);

  // Reset subtypes when contexts change
  useEffect(() => {
    setSelectedSubtypes([]);
    setSelectedWeights({});
    setRangeState({});
  }, [selectedContexts]);

  // Reset weights when subtypes change
  useEffect(() => {
    setSelectedWeights({});
    setRangeState({});
  }, [selectedSubtypes]);

  // Reset range state when weight unit changes
  useEffect(() => {
    setRangeState({});
    setSelectedWeights({});
  }, [weightUnit]);

  const handleLocationChange = useCallback(
    (location: string) => {
      setSelectedLocation(location);
      // ✅ CRITICAL FIX: Immediate controlled update
      emitChange(location, selectedContexts, selectedSubtypes, selectedWeights);
    },
    [selectedContexts, selectedSubtypes, selectedWeights, emitChange]
  );

  const handleContextToggle = useCallback(
    (context: string) => {
      const isSelected = selectedContexts.includes(context);
      const newContexts = isSelected
        ? selectedContexts.filter((c) => c !== context)
        : [...selectedContexts, context];

      setSelectedContexts(newContexts);
      // ✅ CRITICAL FIX: Immediate controlled update
      emitChange(
        selectedLocation,
        newContexts,
        selectedSubtypes,
        selectedWeights
      );
    },
    [
      selectedContexts,
      selectedLocation,
      selectedSubtypes,
      selectedWeights,
      emitChange,
    ]
  );

  const handleSubtypeToggle = useCallback(
    (subtype: string) => {
      const isSelected = selectedSubtypes.includes(subtype);
      const newSubtypes = isSelected
        ? selectedSubtypes.filter((s) => s !== subtype)
        : [...selectedSubtypes, subtype];

      setSelectedSubtypes(newSubtypes);
      // ✅ CRITICAL FIX: Immediate controlled update
      emitChange(
        selectedLocation,
        selectedContexts,
        newSubtypes,
        selectedWeights
      );
    },
    [
      selectedSubtypes,
      selectedLocation,
      selectedContexts,
      selectedWeights,
      emitChange,
    ]
  );

  const handleWeightToggle = useCallback(
    (equipmentType: string, weight: number) => {
      const currentWeights = selectedWeights[equipmentType] || [];

      const newWeights = {
        ...selectedWeights,
        [equipmentType]: currentWeights.includes(weight)
          ? currentWeights.filter((w) => w !== weight)
          : [...currentWeights, weight],
      };

      setSelectedWeights(newWeights);
      // ✅ CRITICAL FIX: Immediate controlled update
      emitChange(
        selectedLocation,
        selectedContexts,
        selectedSubtypes,
        newWeights
      );
    },
    [
      selectedWeights,
      selectedLocation,
      selectedContexts,
      selectedSubtypes,
      emitChange,
    ]
  );

  const handleRangeClick = useCallback(
    (equipmentType: string, weight: number) => {
      const currentRange = rangeState[equipmentType] || {};
      const equipment =
        EQUIPMENT_WEIGHTS[equipmentType as keyof typeof EQUIPMENT_WEIGHTS];
      const availableWeights = equipment?.weights[weightUnit] || [];

      if (!currentRange.start) {
        // First click - set start
        const newRangeState = {
          ...rangeState,
          [equipmentType]: { start: weight },
        };
        setRangeState(newRangeState);

        setSelectedWeights({
          ...selectedWeights,
          [equipmentType]: [weight],
        });
      } else if (!currentRange.end) {
        // Second click - set end and create range
        const start = currentRange.start;
        const end = weight;
        const minWeight = Math.min(start, end);
        const maxWeight = Math.max(start, end);

        const selectedRange = availableWeights.filter(
          (w) => w >= minWeight && w <= maxWeight
        );

        const newRangeState = {
          ...rangeState,
          [equipmentType]: { start: minWeight, end: maxWeight },
        };
        setRangeState(newRangeState);

        setSelectedWeights({
          ...selectedWeights,
          [equipmentType]: selectedRange,
        });
      } else {
        // Third click - reset and start new range
        const newRangeState = {
          ...rangeState,
          [equipmentType]: { start: weight },
        };
        setRangeState(newRangeState);

        setSelectedWeights({
          ...selectedWeights,
          [equipmentType]: [weight],
        });
      }
    },
    [rangeState, weightUnit, selectedWeights]
  );

  const getWeightButtonStyle = (
    equipmentType: string,
    weight: number,
    isRangeMode: boolean
  ) => {
    const selectedEquipmentWeights = selectedWeights[equipmentType] || [];
    const isSelected = selectedEquipmentWeights.includes(weight);

    if (isRangeMode) {
      const range = rangeState[equipmentType] || {};
      const isStart = range.start === weight;
      const isEnd = range.end === weight;
      const isInRange =
        range.start &&
        range.end &&
        weight >= range.start &&
        weight <= range.end;

      if (isStart || isEnd) {
        return 'bg-base-content text-accent border-base-content';
      } else if (isInRange) {
        return 'bg-base-300 text-base-content border-base-300';
      } else {
        return 'bg-base-100 border-base-300 text-base-content hover:border-base-400';
      }
    } else {
      return isSelected
        ? 'bg-base-content text-accent border-base-content'
        : 'bg-base-100 border-base-300 text-base-content hover:border-base-400';
    }
  };

  const availableContexts = selectedLocation
    ? EQUIPMENT_CONTEXTS_BY_LOCATION[
        selectedLocation as keyof typeof EQUIPMENT_CONTEXTS_BY_LOCATION
      ] || []
    : [];

  // Get all available subtypes from selected contexts
  const availableSubtypes = selectedContexts.reduce(
    (acc, context) => {
      const contextSubtypes =
        EQUIPMENT_SUBTYPES_BY_CONTEXT[
          context as keyof typeof EQUIPMENT_SUBTYPES_BY_CONTEXT
        ] || [];
      contextSubtypes.forEach((subtype) => {
        if (!acc.find((existing) => existing.value === subtype.value)) {
          acc.push(subtype);
        }
      });
      return acc;
    },
    [] as Array<{ value: string; label: string }>
  );

  // Get weight-supporting equipment from selected subtypes
  const weightSupportingEquipment = selectedSubtypes.filter(
    (subtype) => EQUIPMENT_WEIGHTS[subtype as keyof typeof EQUIPMENT_WEIGHTS]
  );

  return (
    <div className="space-y-6">
      {/* Tier 1: Location Selection */}
      <div>
        <p className="text-sm text-base-content/80 mb-3">
          Where will you be working out?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {WORKOUT_LOCATIONS.map((location) => {
            const isSelected = selectedLocation === location.value;
            return (
              <button
                key={location.value}
                type="button"
                className={getCustomizationButtonClass(isSelected, disabled)}
                onClick={() =>
                  !disabled && handleLocationChange(location.value)
                }
                disabled={disabled}
              >
                {location.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tier 2: Equipment Context Selection */}
      {selectedLocation && availableContexts.length > 0 && (
        <div>
          <p className="text-sm text-base-content/80 mb-3">
            Select the types of equipment you have available:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {availableContexts.map((context) => {
              const isSelected = selectedContexts.includes(context);
              return (
                <button
                  key={context}
                  type="button"
                  className={getCustomizationButtonClass(isSelected, disabled)}
                  onClick={() => !disabled && handleContextToggle(context)}
                  disabled={disabled}
                >
                  {context}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tier 3: Specific Equipment Selection */}
      {selectedContexts.length > 0 && availableSubtypes.length > 0 && (
        <div>
          <p className="text-sm text-base-content/80 mb-3">
            Select specific equipment you have access to:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {availableSubtypes.map((subtype) => {
              const isSelected = selectedSubtypes.includes(subtype.value);
              return (
                <button
                  key={subtype.value}
                  type="button"
                  className={`${getCustomizationButtonClass(isSelected, disabled)} btn-xs h-auto min-h-[2rem] py-1 px-2 text-xs`}
                  onClick={() =>
                    !disabled && handleSubtypeToggle(subtype.value)
                  }
                  disabled={disabled}
                >
                  <span className="text-left">{subtype.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tier 4: Weight Selection */}
      {weightSupportingEquipment.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-base-content/80">
              Select available weights for your equipment:
            </p>
            <div className="flex items-center gap-3">
              {/* Weight Unit Toggle */}
              <div className="flex bg-base-200 rounded-lg p-1">
                <button
                  type="button"
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    weightUnit === 'lbs'
                      ? 'bg-base-100 text-base-content shadow-sm'
                      : 'text-base-content/60 hover:text-base-content'
                  }`}
                  onClick={() => setWeightUnit('lbs')}
                  disabled={disabled}
                >
                  lbs
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    weightUnit === 'kg'
                      ? 'bg-base-100 text-base-content shadow-sm'
                      : 'text-base-content/60 hover:text-base-content'
                  }`}
                  onClick={() => setWeightUnit('kg')}
                  disabled={disabled}
                >
                  kg
                </button>
              </div>

              {/* Selection Mode Toggle */}
              <div className="flex bg-base-200 rounded-lg p-1">
                <button
                  type="button"
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    selectionMode === 'range'
                      ? 'bg-base-100 text-base-content shadow-sm'
                      : 'text-base-content/60 hover:text-base-content'
                  }`}
                  onClick={() => setSelectionMode('range')}
                  disabled={disabled}
                >
                  Range Mode
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    selectionMode === 'individual'
                      ? 'bg-base-100 text-base-content shadow-sm'
                      : 'text-base-content/60 hover:text-base-content'
                  }`}
                  onClick={() => setSelectionMode('individual')}
                  disabled={disabled}
                >
                  Individual Mode
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {weightSupportingEquipment.map((equipmentType) => {
              const equipment =
                EQUIPMENT_WEIGHTS[
                  equipmentType as keyof typeof EQUIPMENT_WEIGHTS
                ];
              if (!equipment) return null;

              const selectedEquipmentWeights =
                selectedWeights[equipmentType] || [];
              const range = rangeState[equipmentType] || {};

              return (
                <div
                  key={equipmentType}
                  className="border border-base-300 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-base-content">
                      {equipment.label}
                    </h4>
                    {selectionMode === 'range' && (
                      <div className="text-xs text-base-content/60">
                        {range.start && !range.end && 'Select end weight'}
                        {range.start &&
                          range.end &&
                          `Range: ${range.start} - ${range.end} ${weightUnit}`}
                        {!range.start && 'Select start weight'}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                    {equipment.weights[weightUnit].map((weight) => {
                      const buttonStyle = getWeightButtonStyle(
                        equipmentType,
                        weight,
                        selectionMode === 'range'
                      );

                      return (
                        <button
                          key={weight}
                          type="button"
                          className={`
                            aspect-square rounded-full border-2 text-xs font-medium
                            transition-all duration-200 min-h-[2.5rem]
                            ${buttonStyle}
                            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                          `}
                          onClick={() => {
                            if (!disabled) {
                              if (selectionMode === 'range') {
                                handleRangeClick(equipmentType, weight);
                              } else {
                                handleWeightToggle(equipmentType, weight);
                              }
                            }
                          }}
                          disabled={disabled}
                        >
                          {weight}
                        </button>
                      );
                    })}
                  </div>

                  {selectedEquipmentWeights.length > 0 && (
                    <div className="mt-3 text-xs text-base-content/60">
                      Selected:{' '}
                      {selectedEquipmentWeights
                        .sort((a, b) => a - b)
                        .join(', ')}{' '}
                      {weightUnit}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ErrorDisplay error={error} />

      {/* Current Selection Summary */}
      {(selectedLocation ||
        selectedContexts.length > 0 ||
        selectedSubtypes.length > 0 ||
        Object.keys(selectedWeights).some(
          (key) => selectedWeights[key].length > 0
        )) && (
        <SelectionSummary
          title="Current Selection"
          count={
            (selectedLocation ? 1 : 0) +
            selectedContexts.length +
            selectedSubtypes.length +
            Object.values(selectedWeights).reduce(
              (sum, weights) => sum + weights.length,
              0
            )
          }
        >
          {selectedLocation && (
            <span
              className={generateBadgeClass({ level: 'primary', size: 'sm' })}
            >
              {
                WORKOUT_LOCATIONS.find((loc) => loc.value === selectedLocation)
                  ?.label
              }
            </span>
          )}
          {selectedContexts.map((context) => (
            <span
              key={context}
              className={generateBadgeClass({ level: 'secondary', size: 'sm' })}
            >
              {context}
            </span>
          ))}
          {selectedSubtypes.slice(0, 5).map((subtype) => {
            const subtypeObj = availableSubtypes.find(
              (s) => s.value === subtype
            );
            return (
              <span
                key={subtype}
                className={generateBadgeClass({
                  level: 'tertiary',
                  size: 'xs',
                })}
              >
                {subtypeObj?.label || subtype}
              </span>
            );
          })}
          {selectedSubtypes.length > 5 && (
            <span
              className={generateBadgeClass({ level: 'tertiary', size: 'xs' })}
            >
              +{selectedSubtypes.length - 5} more
            </span>
          )}
          {Object.entries(selectedWeights).map(([equipmentType, weights]) => {
            if (!weights || weights.length === 0) return null;
            const equipment =
              EQUIPMENT_WEIGHTS[
                equipmentType as keyof typeof EQUIPMENT_WEIGHTS
              ];
            return (
              <span
                key={equipmentType}
                className={generateBadgeClass({ level: 'accent', size: 'xs' })}
              >
                {equipment?.label}: {weights.sort((a, b) => a - b).join(', ')}{' '}
                {weightUnit}
              </span>
            );
          })}
        </SelectionSummary>
      )}
    </div>
  );
});
