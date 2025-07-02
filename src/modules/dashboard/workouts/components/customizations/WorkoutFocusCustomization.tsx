import { useState, useMemo, useCallback, memo } from "react";
import { CustomizationComponentProps, WorkoutFocusConfigurationData } from "../types";
import { 
  formatSelectionSummary,
  generateBadgeClass,
  getCustomizationButtonClass
} from "../utils/customizationHelpers";
import { 
  ErrorDisplay,
  ValidationDisplay 
} from "../utils/customizationComponents";
import {
  isWorkoutFormatValue,
  isWorkoutFocusConfigurationData,
  safeConcat
} from "../utils/validation";
import {
  DEFAULT_FOCUS_METADATA,
  createFocusMetadata,
  IntensityLevel,
  EquipmentLevel,
  ExperienceLevel,
  FocusCategory
} from "../utils/workoutFocusConstants";

// Define format option type
type WorkoutFormatOption = {
  label: string;
  value: string;
  description: string;
  intensity: IntensityLevel;
  beginner_friendly: boolean;
  time_efficient: boolean;
};

// Define focus option type
type WorkoutFocusOption = {
  label: string;
  value: string;
  category: FocusCategory;
  intensity: IntensityLevel;
  equipment: EquipmentLevel;
  experience: ExperienceLevel;
  duration_compatibility: number[];
  description: string;
};

// Enhanced workout focus options with categorization and metadata
const ENHANCED_WORKOUT_FOCUS_OPTIONS: WorkoutFocusOption[] = [
  // Strength & Power Category
  {
    label: "Strength Training",
    value: "strength_training",
    category: "strength_power",
    intensity: "moderate" as const,
    equipment: "full-gym" as const,
    experience: "intermediate" as const,
    duration_compatibility: [30, 45, 60, 90],
    description: "Build maximum strength with progressive overload and compound movements"
  },
  {
    label: "Powerlifting",
    value: "powerlifting",
    category: "strength_power",
    intensity: "high" as const,
    equipment: "full-gym" as const,
    experience: "advanced" as const,
    duration_compatibility: [60, 90, 120],
    description: "Focus on squat, bench, deadlift with heavy loads and competition techniques"
  },
  {
    label: "Strength & Hypertrophy",
    value: "strength_hypertrophy",
    category: "strength_power",
    intensity: "high" as const,
    equipment: "full-gym" as const,
    experience: "intermediate" as const,
    duration_compatibility: [45, 60, 90, 120],
    description: "Combined strength and muscle building approach for optimal gains"
  },

  // Muscle Building Category
  {
    label: "Muscle Building",
    value: "muscle_building",
    category: "muscle_building",
    intensity: "moderate" as const,
    equipment: "moderate" as const,
    experience: "all-levels" as const,
    duration_compatibility: [30, 45, 60, 90, 120],
    description: "Hypertrophy-focused training for maximum muscle growth and definition"
  },
  {
    label: "Bodyweight Building",
    value: "bodyweight_building",
    category: "muscle_building",
    intensity: "moderate" as const,
    equipment: "minimal" as const,
    experience: "all-levels" as const,
    duration_compatibility: [20, 30, 45, 60],
    description: "Build muscle using bodyweight exercises and progressive overload"
  },

  // Conditioning & Cardio Category
  {
    label: "HIIT",
    value: "hiit",
    category: "conditioning_cardio",
    intensity: "high" as const,
    equipment: "minimal" as const,
    experience: "intermediate" as const,
    duration_compatibility: [15, 20, 30, 45],
    description: "High-intensity interval training for maximum calorie burn and fitness"
  },
  {
    label: "Cardio Endurance",
    value: "cardio_endurance",
    category: "conditioning_cardio",
    intensity: "moderate" as const,
    equipment: "moderate" as const,
    experience: "all-levels" as const,
    duration_compatibility: [30, 45, 60, 90],
    description: "Build cardiovascular fitness and endurance capacity"
  },
  {
    label: "Fat Loss",
    value: "fat_loss",
    category: "conditioning_cardio",
    intensity: "variable" as const,
    equipment: "minimal" as const,
    experience: "all-levels" as const,
    duration_compatibility: [20, 30, 45, 60],
    description: "Metabolic conditioning focused on calorie burn and body composition"
  },

  // Functional & Recovery Category
  {
    label: "Functional Fitness",
    value: "functional_fitness",
    category: "functional_recovery",
    intensity: "moderate" as const,
    equipment: "moderate" as const,
    experience: "all-levels" as const,
    duration_compatibility: [30, 45, 60],
    description: "Real-world movement patterns for everyday strength and mobility"
  },
  {
    label: "Flexibility & Mobility",
    value: "flexibility_mobility",
    category: "functional_recovery",
    intensity: "low" as const,
    equipment: "minimal" as const,
    experience: "all-levels" as const,
    duration_compatibility: [15, 20, 30, 45],
    description: "Improve range of motion, flexibility, and movement quality"
  },
  {
    label: "Recovery & Stretching",
    value: "recovery_stretching",
    category: "functional_recovery",
    intensity: "low" as const,
    equipment: "minimal" as const,
    experience: "all-levels" as const,
    duration_compatibility: [15, 20, 30],
    description: "Active recovery sessions for muscle restoration and stress relief"
  },
];

// Define workout formats type
type WorkoutFormats = {
  [K: string]: WorkoutFormatOption[];
};

const WORKOUT_FORMATS: WorkoutFormats = {
  strength_training: [
    {
      label: "Straight Sets",
      value: "straight_sets",
      description: "Classic sets with rest between exercises",
      intensity: "moderate" as const,
      beginner_friendly: true,
      time_efficient: true
    },
    {
      label: "Pyramid Sets",
      value: "pyramid_sets", 
      description: "Increase/decrease weight with ascending/descending reps",
      intensity: "high" as const,
      beginner_friendly: false,
      time_efficient: false
    },
    {
      label: "Cluster Sets",
      value: "cluster_sets",
      description: "Break sets into mini-sets with short rests",
      intensity: "high" as const,
      beginner_friendly: false,
      time_efficient: false
    },
    {
      label: "Rest-Pause",
      value: "rest_pause",
      description: "Push to failure, rest briefly, continue",
      intensity: "high" as const,
      beginner_friendly: false,
      time_efficient: true
    }
  ],
  powerlifting: [
    {
      label: "Competition Style",
      value: "competition_style",
      description: "Squat, bench, deadlift with competition commands",
      intensity: "high" as const,
      beginner_friendly: false,
      time_efficient: false
    },
    {
      label: "Block Periodization",
      value: "block_periodization",
      description: "Structured phases building to competition peak",
      intensity: "high" as const,
      beginner_friendly: false,
      time_efficient: false
    },
    {
      label: "Conjugate Method",
      value: "conjugate_method",
      description: "Max effort and dynamic effort training",
      intensity: "high" as const,
      beginner_friendly: false,
      time_efficient: false
    }
  ],
  strength_hypertrophy: [
    {
      label: "Heavy-Light",
      value: "heavy_light",
      description: "Alternate heavy strength and lighter hypertrophy work",
      intensity: "high" as const,
      beginner_friendly: true,
      time_efficient: true
    },
    {
      label: "DUP (Daily Undulating)",
      value: "dup",
      description: "Vary intensity and volume daily",
      intensity: "variable" as const,
      beginner_friendly: true,
      time_efficient: true
    },
    {
      label: "Push-Pull-Legs",
      value: "push_pull_legs",
      description: "Split by movement patterns for strength and size",
      intensity: "moderate" as const,
      beginner_friendly: true,
      time_efficient: true
    }
  ],
  muscle_building: [
    {
      label: "Straight Sets",
      value: "straight_sets_hypertrophy",
      description: "Traditional sets with moderate rest for muscle growth",
      intensity: "moderate" as const,
      beginner_friendly: true,
      time_efficient: true
    },
    {
      label: "Supersets",
      value: "supersets",
      description: "Back-to-back exercises with no rest between",
      intensity: "high" as const,
      beginner_friendly: true,
      time_efficient: true
    },
    {
      label: "Drop Sets",
      value: "drop_sets",
      description: "Reduce weight immediately after failure and continue",
      intensity: "high" as const,
      beginner_friendly: false,
      time_efficient: true
    },
    {
      label: "Giant Sets",
      value: "giant_sets",
      description: "3-4 exercises performed consecutively",
      intensity: "high" as const,
      beginner_friendly: false,
      time_efficient: true
    }
  ],
  bodyweight_building: [
    {
      label: "Progressive Overload",
      value: "progressive_overload",
      description: "Increase difficulty through progressions",
      intensity: "moderate" as const,
      beginner_friendly: true,
      time_efficient: true
    },
    {
      label: "Time Under Tension",
      value: "time_under_tension",
      description: "Slow, controlled movements for muscle stress",
      intensity: "moderate" as const,
      beginner_friendly: true,
      time_efficient: true
    },
    {
      label: "Isometric Holds",
      value: "isometric_holds",
      description: "Static holds at challenging positions",
      intensity: "high" as const,
      beginner_friendly: false,
      time_efficient: true
    }
  ],
  hiit: [
    {
      label: "Tabata",
      value: "tabata",
      description: "20 sec work, 10 sec rest for 4 minutes",
      intensity: "high" as const,
      beginner_friendly: true,
      time_efficient: true
    },
    {
      label: "EMOM",
      value: "emom",
      description: "Every minute on the minute protocol",
      intensity: "high" as const,
      beginner_friendly: true,
      time_efficient: true
    },
    {
      label: "Circuit Training",
      value: "circuit_training",
      description: "Move through exercise stations with minimal rest",
      intensity: "high" as const,
      beginner_friendly: true,
      time_efficient: true
    },
    {
      label: "Sprint Intervals",
      value: "sprint_intervals",
      description: "All-out efforts with recovery periods",
      intensity: "high" as const,
      beginner_friendly: false,
      time_efficient: true
    }
  ],
  cardio_endurance: [
    {
      label: "Steady State",
      value: "steady_state",
      description: "Consistent moderate intensity throughout",
      intensity: "moderate" as const,
      beginner_friendly: true,
      time_efficient: false
    },
    {
      label: "Tempo Intervals",
      value: "tempo_intervals",
      description: "Sustained efforts at comfortably hard pace",
      intensity: "moderate" as const,
      beginner_friendly: true,
      time_efficient: true
    },
    {
      label: "Fartlek",
      value: "fartlek",
      description: "Play with speed - structured or unstructured",
      intensity: "variable" as const,
      beginner_friendly: true,
      time_efficient: true
    }
  ],
  fat_loss: [
    {
      label: "Metabolic Circuits",
      value: "metabolic_circuits",
      description: "High-calorie burn with compound movements",
      intensity: "high" as const,
      beginner_friendly: true,
      time_efficient: true
    },
    {
      label: "Cardio-Strength Fusion",
      value: "cardio_strength_fusion",
      description: "Blend cardio and resistance for maximum burn",
      intensity: "high" as const,
      beginner_friendly: true,
      time_efficient: true
    },
    {
      label: "LISS + Resistance",
      value: "liss_resistance",
      description: "Low-intensity steady state with strength intervals",
      intensity: "moderate" as const,
      beginner_friendly: true,
      time_efficient: false
    }
  ],
  functional_fitness: [
    {
      label: "Movement Patterns",
      value: "movement_patterns",
      description: "Focus on squat, hinge, push, pull, carry patterns",
      intensity: "moderate" as const,
      beginner_friendly: true,
      time_efficient: true
    },
    {
      label: "Sport-Specific",
      value: "sport_specific",
      description: "Movements that translate to your sport/activity",
      intensity: "moderate" as const,
      beginner_friendly: true,
      time_efficient: true
    },
    {
      label: "CrossFit Style",
      value: "crossfit_style",
      description: "Varied functional movements at high intensity",
      intensity: "high" as const,
      beginner_friendly: false,
      time_efficient: true
    }
  ],
  flexibility_mobility: [
    {
      label: "Dynamic Stretching",
      value: "dynamic_stretching",
      description: "Active movements through range of motion",
      intensity: "low" as const,
      beginner_friendly: true,
      time_efficient: true
    },
    {
      label: "Static Stretching",
      value: "static_stretching",
      description: "Hold stretches for extended periods",
      intensity: "low" as const,
      beginner_friendly: true,
      time_efficient: false
    },
    {
      label: "PNF Stretching",
      value: "pnf_stretching",
      description: "Contract-relax stretching for deeper gains",
      intensity: "moderate" as const,
      beginner_friendly: false,
      time_efficient: true
    },
    {
      label: "Yoga Flow",
      value: "yoga_flow",
      description: "Flowing sequence of poses for mobility",
      intensity: "low" as const,
      beginner_friendly: true,
      time_efficient: false
    }
  ],
  recovery_stretching: [
    {
      label: "Gentle Flow",
      value: "gentle_flow",
      description: "Easy movement for active recovery",
      intensity: "low" as const,
      beginner_friendly: true,
      time_efficient: true
    },
    {
      label: "Foam Rolling",
      value: "foam_rolling",
      description: "Self-myofascial release for muscle recovery",
      intensity: "low" as const,
      beginner_friendly: true,
      time_efficient: true
    },
    {
      label: "Breathwork",
      value: "breathwork",
      description: "Focused breathing for stress relief and recovery",
      intensity: "low" as const,
      beginner_friendly: true,
      time_efficient: true
    }
  ]
};

// Smart description generation with proper types
const generateSmartDescription = (
  focusData: WorkoutFocusOption,
  format?: string,
  formatData?: WorkoutFormatOption
): string => {
  if (!format || !formatData) {
    return focusData.description;
  }
  
  return `${focusData.description} using ${formatData.description.toLowerCase()}`;
};

// Configuration type determination
const determineConfiguration = (hasFormat: boolean): WorkoutFocusConfigurationData['configuration'] => {
  return hasFormat ? 'focus-with-format' : 'focus-only';
};

// Smart validation system with proper types
const validateFocusConfiguration = (
  focus: string,
  format?: string,
  selectedDuration?: number
): WorkoutFocusConfigurationData['validation'] => {
  const validation: WorkoutFocusConfigurationData['validation'] = {
    isValid: true,
    warnings: [],
    recommendations: []
  };
  
  const focusData = ENHANCED_WORKOUT_FOCUS_OPTIONS.find(f => f.value === focus);
  
  if (!focusData) {
    return validation;
  }
  
  // Duration compatibility validation
  if (selectedDuration && focusData.duration_compatibility) {
    if (!focusData.duration_compatibility.includes(selectedDuration)) {
      validation.warnings!.push(
        `${focusData.label} typically works better with ${
          focusData.duration_compatibility.join(', ')
        } minute sessions`
      );
    }
  }
  
  // Format-specific recommendations
  if (format) {
    const formatData = WORKOUT_FORMATS[focus]?.find((f) => f.value === format);
    
    if (formatData) {
      if (!formatData.beginner_friendly) {
        validation.recommendations!.push(
          "This format is advanced - ensure proper form and experience"
        );
      }
      
      if (selectedDuration && selectedDuration < 30 && !formatData.time_efficient) {
        validation.warnings!.push(
          "This format may need more time than your selected duration"
        );
      }
      
      if (formatData.intensity === 'high' && focusData.intensity === 'low') {
        validation.recommendations!.push(
          "High-intensity format with low-intensity focus - consider your energy levels"
        );
      }
    }
  }
  
  return validation;
};

// ✅ PERFORMANCE OPTIMIZATION: Memoize WorkoutFocusCustomization to prevent unnecessary re-renders
export default memo(function WorkoutFocusCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<WorkoutFocusConfigurationData | undefined>) {
  const configData = value || { 
    selected: false, 
    focus: "", 
    focusLabel: "", 
    label: "", 
    value: "", 
    description: "", 
    configuration: 'focus-only' as const,
    metadata: DEFAULT_FOCUS_METADATA,
    validation: {
      isValid: true,
      warnings: [],
      recommendations: []
    }
  };
  
  // State management following WorkoutDurationCustomization patterns
  const [selectedFocus, setSelectedFocus] = useState<string>(
    configData.selected ? configData.focus : ""
  );
  const [selectedFormat, setSelectedFormat] = useState<string>(
    configData.selected && configData.format ? configData.format : ""
  );
  const [showFormats, setShowFormats] = useState(false);
  
  // Track current validation state
  const currentValidation = selectedFocus && selectedFocus !== "" ? 
    validateFocusConfiguration(selectedFocus, selectedFormat || undefined) : undefined;

  // Build configuration data following WorkoutDurationCustomization patterns
  const buildFocusConfiguration = useCallback((
    focus: string,
    focusLabel: string,
    format?: string | undefined,
    formatLabel?: string | undefined
  ): WorkoutFocusConfigurationData => {
    const focusData = ENHANCED_WORKOUT_FOCUS_OPTIONS.find(f => f.value === focus);
    if (!focusData) {
      // If we can't find the focus data, return a basic configuration
      const value = format && format.length > 0 ? `${focus}_${format}` : focus;
      return {
        selected: true,
        focus,
        focusLabel,
        format: format || undefined,
        formatLabel: formatLabel || undefined,
        label: focusLabel,
        value: value,
        description: focusLabel,
        configuration: determineConfiguration(!!format),
        metadata: DEFAULT_FOCUS_METADATA,
        validation: validateFocusConfiguration(focus, format)
      };
    }

    const formatData = format ? WORKOUT_FORMATS[focus]?.find((f) => f.value === format) : undefined;
    
    // Ensure label is always a string by providing a fallback
    const selectionLabel = formatSelectionSummary(
      [
        { label: focusData.label, value: focus },
        ...(format && formatData ? [{ label: formatData.label, value: format }] : [])
      ],
      { maxItems: 2, showCount: false }
    );
    const label = selectionLabel || focusData.label; // Use focus label as fallback
    
    const description = generateSmartDescription(focusData, format, formatData);
    const configuration = determineConfiguration(!!format);
    const validation = validateFocusConfiguration(focus, format);
    
    // Ensure value is always a string by using string concatenation with proper type checks
    const value = format && format.length > 0 ? `${focus}_${format}` : focus;
    
    return {
      selected: true,
      focus,
      focusLabel,
      format: format || undefined,
      formatLabel: formatLabel || undefined,
      label, // Now guaranteed to be a string
      value,
      description,
      configuration,
      metadata: createFocusMetadata(
        focusData.intensity,
        focusData.equipment,
        focusData.experience,
        focusData.duration_compatibility,
        focusData.category
      ),
      validation
    };
  }, []);

  // Update parent data with type safety
  const updateParentData = useCallback((
    focus: string = selectedFocus,
    format: string = selectedFormat
  ) => {
    if (!focus || focus === "") {
      onChange(undefined);
      return;
    }
    
    const focusOption = ENHANCED_WORKOUT_FOCUS_OPTIONS.find(opt => opt.value === focus);
    if (!focusOption) return;
    
    const formatOption = format && format !== "" ? 
      WORKOUT_FORMATS[focus]?.find((f) => f.value === format) : 
      undefined;
    
    const configuration = buildFocusConfiguration(
      focus,
      focusOption.label,
      format && format !== "" ? format : undefined,
      formatOption?.label
    );
    
    // Validate configuration before passing to parent
    if (isWorkoutFocusConfigurationData(configuration)) {
      onChange(configuration);
    }
  }, [selectedFocus, selectedFormat, onChange, buildFocusConfiguration]);

  // Handle focus selection
  const handleFocusSelection = useCallback((focusValue: string) => {
    if (selectedFocus === focusValue) {
      // Deselect
      setSelectedFocus("");
      setSelectedFormat("");
      setShowFormats(false);
      onChange(undefined);
    } else {
      // Select new focus
      setSelectedFocus(focusValue);
      setSelectedFormat("");
      setShowFormats(true); // Automatically show formats when focus is selected
      
      // Since we know focusValue is a string, we can safely call buildFocusConfiguration
      const focusOption = ENHANCED_WORKOUT_FOCUS_OPTIONS.find(opt => opt.value === focusValue);
      if (focusOption) {
        const configuration = buildFocusConfiguration(
          focusValue,
          focusOption.label,
          undefined,
          undefined
        );
        if (isWorkoutFocusConfigurationData(configuration)) {
          onChange(configuration);
        }
      }
    }
  }, [selectedFocus, onChange, buildFocusConfiguration]);

  // Handle format selection with type safety
  const handleFormatSelection = useCallback((formatValue: string) => {
    if (!selectedFocus || selectedFocus === "") return;
    
    // Validate format value
    if (!isWorkoutFormatValue(formatValue)) return;
    
    if (selectedFormat === formatValue) {
      // Deselect format
      setSelectedFormat("");
      const focusOption = ENHANCED_WORKOUT_FOCUS_OPTIONS.find(opt => opt.value === selectedFocus);
      if (focusOption) {
        const configuration = buildFocusConfiguration(
          selectedFocus,
          focusOption.label,
          undefined,
          undefined
        );
        if (isWorkoutFocusConfigurationData(configuration)) {
          onChange(configuration);
        }
      }
    } else {
      // Select new format
      setSelectedFormat(formatValue);
      const focusOption = ENHANCED_WORKOUT_FOCUS_OPTIONS.find(opt => opt.value === selectedFocus);
      const formatOption = WORKOUT_FORMATS[selectedFocus]?.find((f) => f.value === formatValue);
      
      if (focusOption && formatOption) {
        const configuration = buildFocusConfiguration(
          selectedFocus,
          focusOption.label,
          formatValue,
          formatOption.label
        );
        if (isWorkoutFocusConfigurationData(configuration)) {
          onChange(configuration);
        }
      }
    }
  }, [selectedFocus, selectedFormat, onChange, buildFocusConfiguration]);

  // Hide format options
  const hideFormatOptions = useCallback(() => {
    setShowFormats(false);
  }, []);

  // Memoize categorized options for performance
  const categorizedOptions = useMemo(() => {
    return {
      strength_power: ENHANCED_WORKOUT_FOCUS_OPTIONS.filter(
        opt => opt.category === "strength_power"
      ),
      muscle_building: ENHANCED_WORKOUT_FOCUS_OPTIONS.filter(
        opt => opt.category === "muscle_building"
      ),
      conditioning_cardio: ENHANCED_WORKOUT_FOCUS_OPTIONS.filter(
        opt => opt.category === "conditioning_cardio"
      ),
      functional_recovery: ENHANCED_WORKOUT_FOCUS_OPTIONS.filter(
        opt => opt.category === "functional_recovery"
      ),
    };
  }, []);

  // Render focus selection (Tier 1)
  const renderFocusSelection = () => (
    <div className="space-y-4">
      {/* Strength & Power Category */}
      <div>
        <h4 className="text-sm font-medium text-base-content/70 mb-2">
          Strength & Power
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {categorizedOptions.strength_power.map((option) => {
            const isSelected = selectedFocus === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={getCustomizationButtonClass(isSelected, disabled)}
                onClick={() => handleFocusSelection(option.value)}
                disabled={disabled}
                title={option.description}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Muscle Building Category */}
      <div>
        <h4 className="text-sm font-medium text-base-content/70 mb-2">
          Muscle Building
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {categorizedOptions.muscle_building.map((option) => {
            const isSelected = selectedFocus === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={getCustomizationButtonClass(isSelected, disabled)}
                onClick={() => handleFocusSelection(option.value)}
                disabled={disabled}
                title={option.description}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conditioning & Cardio Category */}
      <div>
        <h4 className="text-sm font-medium text-base-content/70 mb-2">
          Conditioning & Cardio
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {categorizedOptions.conditioning_cardio.map((option) => {
            const isSelected = selectedFocus === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={getCustomizationButtonClass(isSelected, disabled)}
                onClick={() => handleFocusSelection(option.value)}
                disabled={disabled}
                title={option.description}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Functional & Recovery Category */}
      <div>
        <h4 className="text-sm font-medium text-base-content/70 mb-2">
          Functional & Recovery
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {categorizedOptions.functional_recovery.map((option) => {
            const isSelected = selectedFocus === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={getCustomizationButtonClass(isSelected, disabled)}
                onClick={() => handleFocusSelection(option.value)}
                disabled={disabled}
                title={option.description}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Render format selection (Tier 2)
  const renderFormatSelection = () => {
    if (!selectedFocus || selectedFocus === "" || !showFormats) return null;
    
    const availableFormats = WORKOUT_FORMATS[selectedFocus] || [];
    
    return (
      <div className="mt-6 pt-4 border-t border-base-300">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-base-content/70">
            Workout Format
          </h4>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={hideFormatOptions}
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {availableFormats.map((format) => {
            const isSelected = selectedFormat === format.value;
            return (
              <button
                key={format.value}
                type="button"
                className={getCustomizationButtonClass(isSelected, disabled)}
                onClick={() => handleFormatSelection(format.value)}
                disabled={disabled}
                title={format.description}
              >
                {format.label}
              </button>
            );
          })}
        </div>
        
        {/* Format Characteristics Display */}
        {selectedFormat && (() => {
          const formatData = availableFormats.find((f) => f.value === selectedFormat);
          return formatData ? (
            <div className="mt-3 p-3 bg-base-200 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {formatData.beginner_friendly && (
                  <span className={generateBadgeClass({ level: 'success', size: 'sm' })}>
                    Beginner Friendly
                  </span>
                )}
                {formatData.time_efficient && (
                  <span className={generateBadgeClass({ level: 'primary', size: 'sm' })}>
                    Time Efficient
                  </span>
                )}
                <span className={generateBadgeClass({ 
                  level: formatData.intensity === 'high' ? 'error' :
                         formatData.intensity === 'moderate' ? 'warning' : 
                         formatData.intensity === 'variable' ? 'accent' : 'success',
                  size: 'sm'
                })}>
                  {formatData.intensity} Intensity
                </span>
              </div>
            </div>
          ) : null;
        })()}
      </div>
    );
  };

  return (
    <div>
      {/* Error display */}
      <ErrorDisplay error={error} />

      {/* Focus selection */}
      {renderFocusSelection()}

      {/* Format selection */}
      {renderFormatSelection()}

      {/* Validation display */}
      {currentValidation && currentValidation.isValid !== undefined && (
        <ValidationDisplay validation={currentValidation} />
      )}
    </div>
  );
});
