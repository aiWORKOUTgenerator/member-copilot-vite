import { useState, useCallback, useMemo, useEffect } from "react";
import { CustomizationComponentProps } from "../types";

// Exercise categories with commonly excluded/risky exercises
const EXERCISE_EXCLUSION_CATEGORIES = [
  {
    name: "Full Body",
    exercises: [
      "Burpees",
      "Man Makers", 
      "Jumping Jacks (for joint issues)",
      "Thrusters (barbell)",
      "Wall Balls (shoulder strain)",
      "Box Jumps",
      "Mountain Climbers (for wrist/back issues)",
      "High-Rep Complexes (fatigue risk)"
    ]
  },
  {
    name: "Lower Body",
    exercises: [
      "Deep Jump Squats",
      "Sissy Squats",
      "Barbell Back Squats (for beginners)",
      "Pistol Squats (advanced balance requirement)",
      "Hack Squats (machine loading issues)",
      "Walking Lunges (space/joint tolerance)",
      "Good Mornings",
      "Box Step-Ups with High Load"
    ]
  },
  {
    name: "Upper Body", 
    exercises: [
      "Behind-the-Neck Press",
      "Kipping Pull-Ups",
      "Heavy Upright Rows",
      "Dips on Straight Bars",
      "Push Press (for shoulder instability)",
      "Arnold Press (range conflicts)",
      "Barbell Bench Press (at home without spotter)",
      "Heavy Overhead Press (limited mobility)"
    ]
  },
  {
    name: "Core & Stability",
    exercises: [
      "Sit-Ups (lumbar stress)",
      "Superman Holds (spinal compression)",
      "Windshield Wipers",
      "Crunches (cervical strain)",
      "Toe-to-Bar (skill floor too high)",
      "V-Ups (tight hip flexors)",
      "Weighted Russian Twists",
      "Planks Over 1 Minute (fatigue > quality)"
    ]
  },
  {
    name: "Mobility & Corrective / Recovery",
    exercises: [
      "Standing Toe Touches (ballistic)",
      "Seated Forward Fold (lower back load)",
      "Unsupported Wall Sits >1 min",
      "Hip Circles (awkward/confusing)",
      "Excessive Foam Rolling (overuse or bruising)",
      "Unsupported Deep Squat Hold",
      "Overhead Shoulder CARs (poor cueing = risk)",
      "Ballistic Arm Swings"
    ]
  }
];

export default function ExcludeExercisesCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<string | undefined>) {
  // Parse the value to separate custom text and selected exercises
  const { customText, selectedExercises } = useMemo(() => {
    if (!value) return { customText: "", selectedExercises: [] };
    
    // Check if value contains our separator
    const parts = value.split(" | EXCLUDED: ");
    if (parts.length === 2) {
      const customText = parts[0];
      const selectedExercises = parts[1] ? parts[1].split(", ") : [];
      return { customText, selectedExercises };
    }
    
    // If no separator, treat entire value as custom text
    return { customText: value, selectedExercises: [] };
  }, [value]);

  const [excludeExercises, setExcludeExercises] = useState(customText);
  const [selectedExercisesList, setSelectedExercisesList] = useState<string[]>(selectedExercises);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Full Body"]);

  // Update local state when prop value changes
  useEffect(() => {
    setExcludeExercises(customText);
    setSelectedExercisesList(selectedExercises);
  }, [customText, selectedExercises]);

  // Combine custom text and selected exercises into final value
  const updateCombinedValue = useCallback((newCustomText: string, newSelectedExercises: string[]) => {
    let combinedValue = "";
    
    if (newCustomText.trim() && newSelectedExercises.length > 0) {
      combinedValue = `${newCustomText.trim()} | EXCLUDED: ${newSelectedExercises.join(", ")}`;
    } else if (newCustomText.trim()) {
      combinedValue = newCustomText.trim();
    } else if (newSelectedExercises.length > 0) {
      combinedValue = `EXCLUDED: ${newSelectedExercises.join(", ")}`;
    }
    
    onChange(combinedValue || undefined);
  }, [onChange]);

  const handleCustomTextChange = useCallback((newText: string) => {
    setExcludeExercises(newText);
    updateCombinedValue(newText, selectedExercisesList);
  }, [selectedExercisesList, updateCombinedValue]);

  const handleExerciseToggle = useCallback((exercise: string) => {
    const newSelected = selectedExercisesList.includes(exercise)
      ? selectedExercisesList.filter(ex => ex !== exercise)
      : [...selectedExercisesList, exercise];
    
    setSelectedExercisesList(newSelected);
    updateCombinedValue(excludeExercises, newSelected);
  }, [selectedExercisesList, excludeExercises, updateCombinedValue]);

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

  const clearAll = useCallback(() => {
    setExcludeExercises("");
    setSelectedExercisesList([]);
    onChange(undefined);
  }, [onChange]);

  // Get preview of excluded exercises
  const getExcludedPreview = useCallback(() => {
    if (selectedExercisesList.length === 0) return null;
    if (selectedExercisesList.length <= 3) {
      return selectedExercisesList.join(", ");
    }
    const firstThree = selectedExercisesList.slice(0, 3).join(", ");
    const remaining = selectedExercisesList.length - 3;
    return `${firstThree} +${remaining} more`;
  }, [selectedExercisesList]);

  const excludedPreview = getExcludedPreview();
  const hasExclusions = selectedExercisesList.length > 0 || excludeExercises.trim();

  return (
    <div className="space-y-4">
      {/* Custom Exercise Exclusion Input */}
      <div>
        <label className="block text-sm font-medium text-base-content mb-2">
          Specify exercises you want to avoid in your workout
        </label>
        <textarea
          placeholder="e.g., burpees, jumping jacks, mountain climbers, sit-ups"
          value={excludeExercises}
          onChange={(e) => handleCustomTextChange(e.target.value)}
          disabled={disabled}
          rows={3}
          className={`textarea textarea-bordered w-full resize-none ${disabled ? "textarea-disabled" : ""}`}
        />
        <p className="text-xs text-base-content/60 mt-1">
          Enter exercises as comma-separated list (e.g., "Burpees, Sit-ups, Heavy Squats")
        </p>
      </div>

      {/* Excluded Exercises Preview */}
      {hasExclusions && (
        <div className="p-4 bg-error/10 rounded-lg border border-error/20">
          <h3 className="font-semibold text-error mb-2">
            Your Exercise Exclusions
          </h3>
          {selectedExercisesList.length > 0 && (
            <div className="mb-2">
              <p className="text-error text-sm font-medium mb-1">
                Excluded from categories ({selectedExercisesList.length}):
              </p>
              <p className="text-error text-sm">
                {excludedPreview}
              </p>
            </div>
          )}
          {excludeExercises.trim() && (
            <div>
              <p className="text-error text-sm font-medium mb-1">
                Custom exercises to exclude:
              </p>
              <p className="text-error text-sm">
                {excludeExercises}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Exercise Categories */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-base-content">
          Browse Common Exercise Exclusions (Optional)
        </h4>
        
        {EXERCISE_EXCLUSION_CATEGORIES.map((category) => {
          const excludedInCategory = category.exercises.filter(ex => 
            selectedExercisesList.includes(ex)
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
                      const isExcluded = selectedExercisesList.includes(exercise);
                      return (
                        <button
                          key={exercise}
                          type="button"
                          className={`
                            flex items-center justify-center
                            h-auto min-h-[2.5rem] py-3 px-3 rounded-lg
                            text-xs font-medium transition-all duration-200
                            border text-center
                            ${isExcluded 
                              ? "bg-error text-error-content border-error" 
                              : "bg-base-100 border-base-300 text-base-content hover:border-base-400 hover:bg-base-200"
                            }
                            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                          `}
                          onClick={() => !disabled && handleExerciseToggle(exercise)}
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

      {/* Instructions */}
      <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
        <h3 className="font-semibold text-warning mb-2">How It Works</h3>
        <div className="space-y-1 text-warning text-sm">
          <p>1. Add custom exercises you want to avoid in the text area above</p>
          <p>2. Browse risky or problematic exercises by category below</p>
          <p>3. Click category headers to expand/collapse exercise lists</p>
          <p>4. Select exercises you want to exclude from your workouts</p>
          <p>5. Both custom and selected exclusions will be avoided in your workout</p>
        </div>
      </div>

      {/* Quick Actions */}
      {hasExclusions && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-sm btn-success btn-outline"
            onClick={clearAll}
            disabled={disabled}
          >
            Clear All Exclusions
          </button>
        </div>
      )}

      {error && <p className="validator-hint mt-2" role="alert">{error}</p>}
    </div>
  );
}
