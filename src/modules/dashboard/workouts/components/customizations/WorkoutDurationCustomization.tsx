import { useState, useCallback, useMemo, memo } from "react";
import { CustomizationComponentProps, DurationConfigurationData } from "../types";

// Enhanced duration presets with smart suggestions for warm-up/cool-down
const DURATION_PRESETS = [
  { 
    label: "Micro Session", 
    value: 10, 
    category: "Short",
    suggestedWarmUp: 1, 
    suggestedCoolDown: 2,
    description: "Ultra-focused mini-workout for busy schedules"
  },
  { 
    label: "Quick Session", 
    value: 15, 
    category: "Short",
    suggestedWarmUp: 2, 
    suggestedCoolDown: 3,
    description: "Perfect for targeted exercises or quick mobility work"
  },
  { 
    label: "Express Workout", 
    value: 20, 
    category: "Short",
    suggestedWarmUp: 3, 
    suggestedCoolDown: 3,
    description: "Efficient session with focused training"
  },
  { 
    label: "Standard Session", 
    value: 30, 
    category: "Standard",
    suggestedWarmUp: 5, 
    suggestedCoolDown: 5,
    description: "Most popular duration for balanced workouts"
  },
  { 
    label: "Full Session", 
    value: 45, 
    category: "Standard",
    suggestedWarmUp: 5, 
    suggestedCoolDown: 5,
    description: "Comprehensive training with good exercise variety"
  },
  { 
    label: "Extended Session", 
    value: 55, 
    category: "Standard",
    suggestedWarmUp: 5, 
    suggestedCoolDown: 5,
    description: "Extended training session for thorough muscle engagement"
  },
  { 
    label: "Full Workout", 
    value: 60, 
    category: "Extended",
    suggestedWarmUp: 8, 
    suggestedCoolDown: 7,
    description: "Complete training session with thorough preparation"
  },
  { 
    label: "Long Session", 
    value: 90, 
    category: "Extended",
    suggestedWarmUp: 10, 
    suggestedCoolDown: 10,
    description: "Extended training for comprehensive fitness goals"
  },
  { 
    label: "Extended Training", 
    value: 120, 
    category: "Extended",
    suggestedWarmUp: 15, 
    suggestedCoolDown: 15,
    description: "Maximum duration for intensive training sessions"
  },
];

// Warm-up duration presets
const WARMUP_PRESETS = [
  { label: "Minimal (1 min)", value: 1, description: "Ultra-brief activation for micro sessions" },
  { label: "Quick (2 min)", value: 2, description: "Basic activation for short sessions" },
  { label: "Brief (3 min)", value: 3, description: "Light preparation for express workouts" },
  { label: "Standard (5 min)", value: 5, description: "Recommended preparation for most workouts" },
  { label: "Extended (8 min)", value: 8, description: "Thorough preparation for intense sessions" },
  { label: "Comprehensive (10 min)", value: 10, description: "Complete preparation for long workouts" },
  { label: "Full Prep (15 min)", value: 15, description: "Maximum preparation for extended training" },
];

// Cool-down duration presets
const COOLDOWN_PRESETS = [
  { label: "Quick (3 min)", value: 3, description: "Basic recovery for short sessions" },
  { label: "Brief (5 min)", value: 5, description: "Standard recovery for most workouts" },
  { label: "Extended (7 min)", value: 7, description: "Enhanced recovery for intense sessions" },
  { label: "Comprehensive (10 min)", value: 10, description: "Thorough recovery for long workouts" },
  { label: "Recovery Focus (15 min)", value: 15, description: "Maximum recovery for extended training" },
];

// 🚀 Phase 4: Smart Time Calculation Logic & Validation Engine
const calculateWorkingTime = (total: number, warmUp: number, coolDown: number): number => {
  const working = total - warmUp - coolDown;
  return Math.max(working, 5); // Minimum 5 minutes working time
};

const validateTimeAllocation = (total: number, warmUp: number, coolDown: number): DurationConfigurationData['validation'] => {
  const working = calculateWorkingTime(total, warmUp, coolDown);
  const structurePercentage = ((warmUp + coolDown) / total) * 100;
  
  const validation: DurationConfigurationData['validation'] = {
    isValid: true,
    warnings: [],
    errors: []
  };
  
  // Critical validation rules (blocking)
  if (working < 5) {
    validation.isValid = false;
    validation.errors!.push("Warm-up and cool-down times are too long for selected duration");
  }
  
  if (warmUp + coolDown >= total) {
    validation.isValid = false;
    validation.errors!.push("Preparation time cannot equal or exceed total workout duration");
  }
  
  // Advisory validation rules (non-blocking warnings)
  if (structurePercentage > 60) {
    validation.warnings!.push("Consider reducing warm-up or cool-down for more working time");
  }
  
  if (total <= 20 && (warmUp > 5 || coolDown > 5)) {
    validation.warnings!.push("Long preparation phases for short sessions may reduce exercise time");
  }
  
  if (total >= 60 && warmUp < 5) {
    validation.warnings!.push("Consider longer warm-up for extended sessions");
  }
  
  if (total >= 90 && coolDown < 8) {
    validation.warnings!.push("Extended sessions benefit from longer recovery periods");
  }
  
  // Efficiency recommendations
  const workingPercentage = (working / total) * 100;
  if (workingPercentage < 50) {
    validation.warnings!.push("Very low working time percentage - consider shorter preparation");
  } else if (workingPercentage > 95) {
    validation.warnings!.push("Consider adding warm-up or cool-down for injury prevention");
  }
  
  return validation;
};

const calculateSessionEfficiency = (total: number, working: number): {
  percentage: number;
  rating: 'excellent' | 'good' | 'moderate' | 'poor';
  recommendation: string;
} => {
  const percentage = Math.round((working / total) * 100);
  
  if (percentage >= 85) {
    return {
      percentage,
      rating: 'excellent',
      recommendation: 'Optimal balance for focused training'
    };
  } else if (percentage >= 70) {
    return {
      percentage,
      rating: 'good', 
      recommendation: 'Good structure with adequate preparation time'
    };
  } else if (percentage >= 50) {
    return {
      percentage,
      rating: 'moderate',
      recommendation: 'Consider reducing preparation time for more active training'
    };
  } else {
    return {
      percentage,
      rating: 'poor',
      recommendation: 'Too much preparation time - consider shorter warm-up/cool-down'
    };
  }
};

const generateOptimalSuggestions = (totalDuration: number): {
  warmUp: number;
  coolDown: number;
  reasoning: string;
} => {
  // Smart suggestions based on session length and fitness science
  if (totalDuration <= 10) {
    return {
      warmUp: 1,
      coolDown: 2,
      reasoning: "Micro sessions need minimal preparation to maximize working time"
    };
  } else if (totalDuration <= 20) {
    return {
      warmUp: 3,
      coolDown: 3,
      reasoning: "Short sessions benefit from brief, focused preparation"
    };
  } else if (totalDuration <= 45) {
    return {
      warmUp: 5,
      coolDown: 5,
      reasoning: "Standard preparation provides good injury prevention"
    };
  } else if (totalDuration <= 75) {
    return {
      warmUp: 8,
      coolDown: 7,
      reasoning: "Extended sessions need thorough preparation and recovery"
    };
  } else {
    return {
      warmUp: 12,
      coolDown: 10,
      reasoning: "Long sessions require comprehensive preparation for safety"
    };
  }
};

// Smart label generation with context awareness
const generateSmartLabel = (
  preset: typeof DURATION_PRESETS[0] | undefined,
  totalDuration: number,
  warmUpConfig: { included: boolean; duration: number },
  coolDownConfig: { included: boolean; duration: number }
): string => {
  const baseName = preset?.label || `${totalDuration} minutes`;
  
  if (!warmUpConfig.included && !coolDownConfig.included) {
    return baseName;
  }
  
  const parts = [baseName];
  if (warmUpConfig.included) {
    parts.push(`${warmUpConfig.duration}min warm-up`);
  }
  if (coolDownConfig.included) {
    parts.push(`${coolDownConfig.duration}min cool-down`);
  }
  
  return parts.join(" + ");
};

const generateSmartDescription = (
  preset: typeof DURATION_PRESETS[0] | undefined,
  totalDuration: number,
  workingTime: number,
  configuration: DurationConfigurationData['configuration']
): string => {
  const baseDescription = preset?.description || `${totalDuration} minute workout session`;
  const workingPercent = Math.round((workingTime / totalDuration) * 100);
  
  if (configuration === 'duration-only') {
    return baseDescription;
  }
  
  return `${baseDescription} with ${workingTime} minutes active training (${workingPercent}% working time)`;
};

const determineConfiguration = (warmUpIncluded: boolean, coolDownIncluded: boolean): DurationConfigurationData['configuration'] => {
  if (warmUpIncluded && coolDownIncluded) return 'full-structure';
  if (warmUpIncluded) return 'with-warmup';
  if (coolDownIncluded) return 'with-cooldown';
  return 'duration-only';
};

// ✅ CRITICAL FIX: Memoize WorkoutDurationCustomization to prevent unnecessary re-renders
const WorkoutDurationCustomization = memo(function WorkoutDurationCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<DurationConfigurationData | undefined>) {
  // Convert existing DurationConfigurationData or create new state
  const existingData = value;
  
  const [selectedDuration, setSelectedDuration] = useState<number | null>(
    existingData?.totalDuration || null
  );
  const [warmUpConfig, setWarmUpConfig] = useState({
    included: existingData?.warmUp.included || false,
    duration: existingData?.warmUp.duration || 0
  });
  const [coolDownConfig, setCoolDownConfig] = useState({
    included: existingData?.coolDown.included || false,
    duration: existingData?.coolDown.duration || 0
  });
  const [showStructureOptions, setShowStructureOptions] = useState(
    existingData ? (existingData.warmUp.included || existingData.coolDown.included) : false
  );

  // Smart calculation and validation integration
  const currentWorkingTime = selectedDuration ? calculateWorkingTime(
    selectedDuration,
    warmUpConfig.included ? warmUpConfig.duration : 0,
    coolDownConfig.included ? coolDownConfig.duration : 0
  ) : 0;

  const currentValidation = selectedDuration ? validateTimeAllocation(
    selectedDuration,
    warmUpConfig.included ? warmUpConfig.duration : 0,
    coolDownConfig.included ? coolDownConfig.duration : 0
  ) : null;

  const sessionEfficiency = selectedDuration ? calculateSessionEfficiency(selectedDuration, currentWorkingTime) : null;

  const optimalSuggestions = selectedDuration ? generateOptimalSuggestions(selectedDuration) : null;

  // ✅ CRITICAL FIX: Memoized data building function
  const buildDurationConfiguration = useCallback((
    duration: number,
    warmUp: { included: boolean; duration: number },
    coolDown: { included: boolean; duration: number }
  ): DurationConfigurationData => {
    const preset = DURATION_PRESETS.find(p => p.value === duration);
    const workingTime = calculateWorkingTime(duration, warmUp.included ? warmUp.duration : 0, coolDown.included ? coolDown.duration : 0);
    const configuration = determineConfiguration(warmUp.included, coolDown.included);
    const validation = validateTimeAllocation(duration, warmUp.included ? warmUp.duration : 0, coolDown.included ? coolDown.duration : 0);
    
    return {
      selected: true,
      totalDuration: duration,
      label: generateSmartLabel(preset, duration, warmUp, coolDown),
      value: duration, // For backward compatibility
      description: generateSmartDescription(preset, duration, workingTime, configuration),
      warmUp: {
        included: warmUp.included,
        duration: warmUp.included ? warmUp.duration : 0,
        percentage: warmUp.included ? Math.round((warmUp.duration / duration) * 100) : 0
      },
      coolDown: {
        included: coolDown.included,
        duration: coolDown.included ? coolDown.duration : 0,
        percentage: coolDown.included ? Math.round((coolDown.duration / duration) * 100) : 0
      },
      workingTime,
      configuration,
      validation
    };
  }, []);

  // ✅ CRITICAL FIX: Immediate controlled update function
  const emitChange = useCallback((
    duration: number | null,
    warmUp = warmUpConfig,
    coolDown = coolDownConfig
  ) => {
    if (!duration) {
      onChange(undefined);
      return;
    }
    
    const configurationData = buildDurationConfiguration(duration, warmUp, coolDown);
    onChange(configurationData);
  }, [onChange, buildDurationConfiguration, warmUpConfig, coolDownConfig]);

  const handleDurationSelection = useCallback((duration: number) => {
    setSelectedDuration(duration);
    
    // Show structure options for sessions >= 20 minutes
    if (duration >= 20) {
      setShowStructureOptions(true);
    } else {
      setShowStructureOptions(false);
      // Reset structure for very short sessions
      setWarmUpConfig({ included: false, duration: 0 });
      setCoolDownConfig({ included: false, duration: 0 });
    }
    
    // ✅ CRITICAL FIX: Immediate controlled update
    emitChange(duration, warmUpConfig, coolDownConfig);
  }, [emitChange, warmUpConfig, coolDownConfig]);

  const toggleWarmUp = useCallback((enabled: boolean) => {
    if (!selectedDuration) return;
    
    const preset = DURATION_PRESETS.find(p => p.value === selectedDuration);
    const newWarmUpConfig = enabled 
      ? { included: true, duration: preset?.suggestedWarmUp || 5 }
      : { included: false, duration: 0 };
    
    setWarmUpConfig(newWarmUpConfig);
    // ✅ CRITICAL FIX: Immediate controlled update
    emitChange(selectedDuration, newWarmUpConfig, coolDownConfig);
  }, [selectedDuration, coolDownConfig, emitChange]);

  const toggleCoolDown = useCallback((enabled: boolean) => {
    if (!selectedDuration) return;
    
    const preset = DURATION_PRESETS.find(p => p.value === selectedDuration);
    const newCoolDownConfig = enabled 
      ? { included: true, duration: preset?.suggestedCoolDown || 5 }
      : { included: false, duration: 0 };
    
    setCoolDownConfig(newCoolDownConfig);
    // ✅ CRITICAL FIX: Immediate controlled update
    emitChange(selectedDuration, warmUpConfig, newCoolDownConfig);
  }, [selectedDuration, warmUpConfig, emitChange]);

  const updateWarmUpDuration = useCallback((duration: number) => {
    if (!selectedDuration) return;
    
    const newWarmUpConfig = { ...warmUpConfig, duration };
    setWarmUpConfig(newWarmUpConfig);
    // ✅ CRITICAL FIX: Immediate controlled update
    emitChange(selectedDuration, newWarmUpConfig, coolDownConfig);
  }, [selectedDuration, warmUpConfig, coolDownConfig, emitChange]);

  const updateCoolDownDuration = useCallback((duration: number) => {
    if (!selectedDuration) return;
    
    const newCoolDownConfig = { ...coolDownConfig, duration };
    setCoolDownConfig(newCoolDownConfig);
    // ✅ CRITICAL FIX: Immediate controlled update
    emitChange(selectedDuration, warmUpConfig, newCoolDownConfig);
  }, [selectedDuration, warmUpConfig, coolDownConfig, emitChange]);

  // Smart suggestion application
  const applyOptimalSuggestions = useCallback(() => {
    if (!selectedDuration || !optimalSuggestions) return;
    
    const newWarmUpConfig = { included: true, duration: optimalSuggestions.warmUp };
    const newCoolDownConfig = { included: true, duration: optimalSuggestions.coolDown };
    
    setWarmUpConfig(newWarmUpConfig);
    setCoolDownConfig(newCoolDownConfig);
    // ✅ CRITICAL FIX: Immediate controlled update
    emitChange(selectedDuration, newWarmUpConfig, newCoolDownConfig);
  }, [selectedDuration, optimalSuggestions, emitChange]);

  // Group presets by category for better organization
  const groupedPresets = useMemo(() => {
    return DURATION_PRESETS.reduce((acc, preset) => {
      if (!acc[preset.category]) {
        acc[preset.category] = [];
      }
      acc[preset.category].push(preset);
      return acc;
    }, {} as Record<string, typeof DURATION_PRESETS>);
  }, []);

  return (
    <div className="space-y-4">
      {/* Primary Level - Duration Selection */}
    <div>
        <h4 className="text-sm font-semibold text-base-content/70 uppercase tracking-wide mb-3">
          Workout Duration
        </h4>
        
        {Object.entries(groupedPresets).map(([category, presets]) => (
          <div key={category} className="mb-4">
            <p className="text-xs text-base-content/50 uppercase tracking-wider mb-2">
              {category} Sessions
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    selectedDuration === preset.value
                      ? "bg-primary text-primary-content border-primary"
                      : "bg-base-100 border-base-300 hover:border-base-content/20"
                  } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => !disabled && handleDurationSelection(preset.value)}
        disabled={disabled}
                  title={preset.description}
                >
                  <div className="text-sm font-medium">{preset.label}</div>
                  <div className="text-xs opacity-70">{preset.value} min</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 🚀 Phase 4: Smart Suggestions Panel */}
      {selectedDuration && optimalSuggestions && !warmUpConfig.included && !coolDownConfig.included && (
        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-info" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <h5 className="font-medium text-info">Smart Suggestion</h5>
              </div>
              <p className="text-sm text-base-content/80 mb-2">
                For your {selectedDuration}-minute session, we recommend adding {optimalSuggestions.warmUp}min warm-up + {optimalSuggestions.coolDown}min cool-down.
              </p>
              <p className="text-xs text-base-content/60">
                {optimalSuggestions.reasoning}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-info ml-4"
              onClick={applyOptimalSuggestions}
              disabled={disabled}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Secondary Level - Session Structure Options */}
      {selectedDuration && showStructureOptions && (
        <div className="border border-base-300 rounded-lg p-4">
          <div className="mb-3">
            <h4 className="font-medium text-base-content">Session Structure</h4>
            <p className="text-sm text-base-content/80 mb-3">
              Add warm-up and cool-down phases to your {selectedDuration}-minute session:
            </p>
          </div>
          
          <div className="space-y-4">
            {/* Warm-Up Toggle */}
            <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
              <label className="flex items-center space-x-3 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={warmUpConfig.included}
                  onChange={(e) => toggleWarmUp(e.target.checked)}
                  disabled={disabled}
                />
                <div>
                  <span className="text-sm font-medium">Include Warm-Up</span>
                  <p className="text-xs text-base-content/60">Prepare your body for exercise</p>
                </div>
              </label>
              
              {warmUpConfig.included && (
                <div className="text-right">
                  <span className="text-sm font-medium text-primary">{warmUpConfig.duration} min</span>
                  <p className="text-xs text-base-content/60">
                    {Math.round((warmUpConfig.duration / selectedDuration) * 100)}% of session
                  </p>
                </div>
              )}
            </div>
            
            {/* Cool-Down Toggle */}
            <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
              <label className="flex items-center space-x-3 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  className="checkbox checkbox-secondary"
                  checked={coolDownConfig.included}
                  onChange={(e) => toggleCoolDown(e.target.checked)}
                  disabled={disabled}
                />
                <div>
                  <span className="text-sm font-medium">Include Cool-Down</span>
                  <p className="text-xs text-base-content/60">Gradually transition to rest</p>
                </div>
              </label>
              
              {coolDownConfig.included && (
                <div className="text-right">
                  <span className="text-sm font-medium text-secondary">{coolDownConfig.duration} min</span>
                  <p className="text-xs text-base-content/60">
                    {Math.round((coolDownConfig.duration / selectedDuration) * 100)}% of session
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tertiary Level - Time Allocation Options */}
      {/* Warm-Up Duration Selection */}
      {warmUpConfig.included && (
        <div className="bg-base-100 border border-base-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-medium text-base-content text-sm">
              Warm-Up Duration
            </h5>
            <button
              type="button"
              className="btn btn-xs btn-ghost"
              onClick={() => toggleWarmUp(false)}
            >
              ×
            </button>
          </div>
          <p className="text-sm text-base-content/80 mb-3">
            Choose how long to spend preparing for your workout:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {WARMUP_PRESETS.filter(preset => preset.value <= selectedDuration! - 5).map((preset) => (
              <button
                key={preset.value}
                type="button"
                className={`p-3 rounded-md border transition-all text-center ${
                  warmUpConfig.duration === preset.value
                    ? "bg-primary text-primary-content border-primary"
                    : "bg-base-100 border-base-300 hover:border-base-content/20"
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => !disabled && updateWarmUpDuration(preset.value)}
                disabled={disabled}
                title={preset.description}
              >
                <div className="text-sm font-medium">{preset.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cool-Down Duration Selection */}
      {coolDownConfig.included && (
        <div className="bg-base-100 border border-base-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-medium text-base-content text-sm">
              Cool-Down Duration
            </h5>
            <button
              type="button"
              className="btn btn-xs btn-ghost"
              onClick={() => toggleCoolDown(false)}
            >
              ×
            </button>
          </div>
          <p className="text-sm text-base-content/80 mb-3">
            Choose how long to spend winding down after your workout:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {COOLDOWN_PRESETS.filter(preset => preset.value <= selectedDuration! - 5).map((preset) => (
              <button
                key={preset.value}
                type="button"
                className={`p-3 rounded-md border transition-all text-center ${
                  coolDownConfig.duration === preset.value
                    ? "bg-secondary text-secondary-content border-secondary"
                    : "bg-base-100 border-base-300 hover:border-base-content/20"
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => !disabled && updateCoolDownDuration(preset.value)}
                disabled={disabled}
                title={preset.description}
              >
                <div className="text-sm font-medium">{preset.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="validator-hint mt-2" role="alert">{error}</p>}

      {/* 🚀 Phase 4: Enhanced Validation Display */}
      {currentValidation && currentValidation.warnings && currentValidation.warnings.length > 0 && (
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.982-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <div className="font-medium">Session Optimization Suggestions:</div>
            {currentValidation.warnings.map((warning, index) => (
              <div key={index} className="text-sm mt-1">• {warning}</div>
            ))}
          </div>
        </div>
      )}

      {currentValidation && currentValidation.errors && currentValidation.errors.length > 0 && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="font-medium">Configuration Issues:</div>
            {currentValidation.errors.map((error, index) => (
              <div key={index} className="text-sm mt-1">• {error}</div>
            ))}
          </div>
        </div>
      )}

      {/* 🚀 Phase 4: Intelligent Session Analysis Summary */}
      {selectedDuration && sessionEfficiency && (
        <div className="bg-base-200 rounded-lg border border-base-300 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="text-sm text-base-content font-medium">
                <strong>Configuration:</strong> {generateSmartLabel(
                  DURATION_PRESETS.find(p => p.value === selectedDuration),
                  selectedDuration,
                  warmUpConfig,
                  coolDownConfig
                )}
              </div>
              <div className="text-xs text-base-content/70 mt-1">
                {generateSmartDescription(
                  DURATION_PRESETS.find(p => p.value === selectedDuration),
                  selectedDuration,
                  currentWorkingTime,
                  determineConfiguration(warmUpConfig.included, coolDownConfig.included)
                )}
              </div>
            </div>
            
            <div className="ml-4 text-right">
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                sessionEfficiency.rating === 'excellent' ? 'bg-success text-success-content' :
                sessionEfficiency.rating === 'good' ? 'bg-info text-info-content' :
                sessionEfficiency.rating === 'moderate' ? 'bg-warning text-warning-content' :
                'bg-error text-error-content'
              }`}>
                {sessionEfficiency.rating.toUpperCase()}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs text-base-content/70">
            <div>
              <div className="font-medium">Time Breakdown:</div>
              <div className="mt-1 space-y-1">
                <div>Working Time: <strong>{currentWorkingTime} min</strong> ({sessionEfficiency.percentage}%)</div>
                {warmUpConfig.included && (
                  <div>• Warm-Up: {warmUpConfig.duration} min ({Math.round((warmUpConfig.duration / selectedDuration) * 100)}%)</div>
                )}
                {coolDownConfig.included && (
                  <div>• Cool-Down: {coolDownConfig.duration} min ({Math.round((coolDownConfig.duration / selectedDuration) * 100)}%)</div>
                )}
              </div>
            </div>
            
            <div>
              <div className="font-medium">Session Efficiency:</div>
              <div className="mt-1">
                <div className="text-xs">{sessionEfficiency.recommendation}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default WorkoutDurationCustomization;
