import { useState, useCallback, useMemo, useEffect, memo } from "react";
import { CustomizationComponentProps } from "../types";
import { 
  formatSelectionSummary,
  getCustomizationButtonClass
} from "../utils/customizationHelpers";
import { 
  ErrorDisplay,
  SelectionSummary 
} from "../utils/customizationComponents";

// Exercise exclusion categories
const EXERCISE_EXCLUSION_CATEGORIES = [
  {
    name: "High-Impact/Risky Exercises",
    exercises: [
      "Burpees", "Box Jumps", "Jump Squats", "Plyometric Push-ups",
      "Jumping Lunges", "Broad Jumps", "Depth Jumps"
    ]
  },
  {
    name: "Lower Back Intensive",
    exercises: [
      "Deadlifts", "Good Mornings", "Bent-Over Rows", "Romanian Deadlifts",
      "Back Extensions", "Superman", "Stiff Leg Deadlifts"
    ]
  },
  {
    name: "Knee-Intensive Exercises",
    exercises: [
      "Deep Squats", "Lunges", "Step-ups", "Bulgarian Split Squats",
      "Jump Squats", "Pistol Squats", "Wall Sits"
    ]
  },
  {
    name: "Shoulder-Intensive Exercises",
    exercises: [
      "Overhead Press", "Handstand Push-ups", "Lateral Raises",
      "Upright Rows", "Behind-the-Neck Press", "Dips"
    ]
  },
  {
    name: "Core-Intensive Exercises",
    exercises: [
      "Sit-ups", "Crunches", "Russian Twists", "V-ups",
      "Bicycle Crunches", "Leg Raises", "Mountain Climbers"
    ]
  },
  {
    name: "Cardio-Intensive Exercises",
    exercises: [
      "Running", "Sprints", "High Knees", "Butt Kicks",
      "Jumping Jacks", "Jump Rope", "Burpees"
    ]
  }
];

// Clean data structure for the component value
interface ExcludeExercisesData {
  customExercises: string;
  libraryExercises: string[];
}

export default memo(function ExcludeExercisesCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<ExcludeExercisesData | string | undefined>) {
  
  // Parse incoming value (handle both new format and legacy string format)
  const parsedValue = useMemo((): ExcludeExercisesData => {
    if (!value) {
      return { customExercises: "", libraryExercises: [] };
    }
    
    // New object format
    if (typeof value === 'object' && 'customExercises' in value) {
      return value as ExcludeExercisesData;
    }
    
    // Legacy string format - treat as custom exercises
    if (typeof value === 'string') {
      return { customExercises: value, libraryExercises: [] };
    }
    
    return { customExercises: "", libraryExercises: [] };
  }, [value]);

  // Separate state for each input method
  const [customExercises, setCustomExercises] = useState(parsedValue.customExercises);
  const [libraryExercises, setLibraryExercises] = useState<string[]>(parsedValue.libraryExercises);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Update local state when prop value changes
  useEffect(() => {
    setCustomExercises(parsedValue.customExercises);
    setLibraryExercises(parsedValue.libraryExercises);
  }, [parsedValue]);

  // ✅ CRITICAL FIX: Stable data creation function
  const createExcludeData = useCallback((customText: string, libraryList: string[]): ExcludeExercisesData => ({
    customExercises: customText.trim(),
    libraryExercises: libraryList
  }), []);

  // ✅ CRITICAL FIX: Controlled component pattern - immediate change emission
  const emitChange = useCallback((newCustom: string, newLibrary: string[]) => {
    const hasCustom = newCustom.trim().length > 0;
    const hasLibrary = newLibrary.length > 0;
    
    if (!hasCustom && !hasLibrary) {
      onChange(undefined);
      return;
    }
    
    const newValue = createExcludeData(newCustom, newLibrary);
    onChange(newValue);
  }, [onChange, createExcludeData]);

  // Handle custom text changes
  const handleCustomChange = useCallback((newText: string) => {
    setCustomExercises(newText);
    // ✅ CRITICAL FIX: Direct controlled update
    emitChange(newText, libraryExercises);
  }, [libraryExercises, emitChange]);

  // Handle library exercise selection
  const handleLibraryToggle = useCallback((exercise: string) => {
    const newLibrary = libraryExercises.includes(exercise)
      ? libraryExercises.filter(ex => ex !== exercise)
      : [...libraryExercises, exercise];
    
    setLibraryExercises(newLibrary);
    // ✅ CRITICAL FIX: Direct controlled update
    emitChange(customExercises, newLibrary);
  }, [libraryExercises, customExercises, emitChange]);

  // Category expansion handling
  const toggleCategory = useCallback((categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
    );
  }, []);

  const isExpanded = useCallback((categoryName: string) => {
    return expandedCategories.includes(categoryName);
  }, [expandedCategories]);

  // Clear functions
  const clearCustom = useCallback(() => {
    handleCustomChange("");
  }, [handleCustomChange]);

  const clearLibrary = useCallback(() => {
    setLibraryExercises([]);
    // ✅ CRITICAL FIX: Direct controlled update
    emitChange(customExercises, []);
  }, [customExercises, emitChange]);

  const clearAll = useCallback(() => {
    setCustomExercises("");
    setLibraryExercises([]);
    onChange(undefined);
  }, [onChange]);

  // Helper functions
  const getLibraryPreview = useCallback(() => {
    return formatSelectionSummary(libraryExercises, { maxItems: 3 });
  }, [libraryExercises]);

  const hasCustom = customExercises.trim().length > 0;
  const hasLibrary = libraryExercises.length > 0;
  const hasAnyExclusions = hasCustom || hasLibrary;

  return (
    <div className="space-y-6">
      {/* Field 1: Custom Exercise Exclusion Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-base-content">
            Custom Exclusions
          </label>
          {hasCustom && (
            <button
              type="button"
              className="btn btn-xs btn-ghost text-base-content/60"
              onClick={clearCustom}
              disabled={disabled}
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          placeholder="e.g., burpees, jumping jacks, mountain climbers, sit-ups"
          value={customExercises}
          onChange={(e) => handleCustomChange(e.target.value)}
          disabled={disabled}
          rows={3}
          className={`textarea textarea-bordered w-full resize-none ${disabled ? "textarea-disabled" : ""}`}
        />
        <p className="text-xs text-base-content/60 mt-1">
          Enter exercises to avoid as comma-separated list
        </p>
        
        {hasCustom && (
          <SelectionSummary
            title="Custom exclusions"
            count={customExercises.split(',').filter(e => e.trim()).length}
          >
            <span className="text-sm">{customExercises}</span>
          </SelectionSummary>
        )}
      </div>

      {/* Field 2: Risky Exercise Library */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-base-content">
            Common Exercise Exclusions
          </label>
          {hasLibrary && (
            <button
              type="button"
              className="btn btn-xs btn-ghost text-base-content/60"
              onClick={clearLibrary}
              disabled={disabled}
            >
              Clear Selected
            </button>
          )}
        </div>
        
        {hasLibrary && (
          <SelectionSummary
            title="Excluded from library"
            count={libraryExercises.length}
            className="mb-4"
          >
            <span className="text-sm">{getLibraryPreview()}</span>
          </SelectionSummary>
        )}

        <div className="space-y-3">
          {EXERCISE_EXCLUSION_CATEGORIES.map((category) => {
            const excludedInCategory = category.exercises.filter(ex => 
              libraryExercises.includes(ex)
            ).length;
            
            return (
              <div key={category.name} className="border border-base-300 rounded-lg overflow-hidden">
                {/* Category Header */}
                <button
                  type="button"
                  className={`
                    w-full flex items-center justify-between p-4 text-left
                    transition-all duration-200 hover:bg-base-200
                    ${isExpanded(category.name) ? "bg-base-200" : "bg-base-100"}
                    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                  onClick={() => !disabled && toggleCategory(category.name)}
                  disabled={disabled}
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-base-content">{category.name}</span>
                    <span className="text-sm text-base-content/60">
                      ({category.exercises.length} risky exercises)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {excludedInCategory > 0 && (
                      <span className="bg-error text-error-content px-2 py-1 rounded-full text-xs font-medium">
                        {excludedInCategory} excluded
                      </span>
                    )}
                    <span className={`
                      transition-transform duration-200 text-base-content/40
                      ${isExpanded(category.name) ? "rotate-180" : ""}
                    `}>
                      ▼
                    </span>
                  </div>
                </button>

                {/* Exercise Grid */}
                {isExpanded(category.name) && (
                  <div className="p-4 bg-base-100 border-t border-base-300">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {category.exercises.map((exercise) => {
                        const isExcluded = libraryExercises.includes(exercise);
                        return (
                          <button
                            key={exercise}
                            type="button"
                            className={`${getCustomizationButtonClass(isExcluded, disabled)} flex items-center justify-center h-auto min-h-[2.5rem] py-3 px-3 rounded-lg text-xs font-medium text-center`}
                            onClick={() => !disabled && handleLibraryToggle(exercise)}
                            disabled={disabled}
                          >
                            <span>{exercise}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Actions */}
      {hasAnyExclusions && (
        <div className="flex flex-wrap gap-3 pt-2 border-t border-base-200">
          <button
            type="button"
            className="btn btn-sm btn-error btn-outline"
            onClick={clearAll}
            disabled={disabled}
          >
            Clear All Exclusions
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
        <h3 className="font-semibold text-warning mb-2">How to Use</h3>
        <div className="space-y-1 text-warning text-sm">
          <p><strong>Custom Exclusions:</strong> Type exercises you want to avoid (comma-separated)</p>
          <p><strong>Exercise Library:</strong> Browse and exclude common risky exercises by category</p>
          <p>Both methods work independently - use either or both as needed</p>
        </div>
      </div>

      <ErrorDisplay error={error} />
    </div>
  );
});
