import { useState, useCallback, useMemo, useEffect } from "react";
import { CustomizationComponentProps } from "../types";

// Exercise categories with curated exercise lists
const EXERCISE_CATEGORIES = [
  {
    name: "Full Body",
    exercises: [
      "Burpees",
      "Kettlebell Swings", 
      "Thrusters",
      "Clean & Press",
      "Wall Balls",
      "Man Makers",
      "Jumping Jacks",
      "Bear Crawl"
    ]
  },
  {
    name: "Lower Body",
    exercises: [
      "Bodyweight Squats",
      "Lunges",
      "Step-Ups", 
      "Glute Bridges",
      "Deadlifts (Dumbbell/Barbell)",
      "Wall Sit",
      "Jump Squats",
      "Bulgarian Split Squats"
    ]
  },
  {
    name: "Upper Body", 
    exercises: [
      "Push-Ups",
      "Pull-Ups or Assisted Pull-Ups",
      "Bent-Over Rows",
      "Overhead Press",
      "Dumbbell Chest Press",
      "Renegade Rows",
      "Bicep Curls",
      "Tricep Dips"
    ]
  },
  {
    name: "Core & Stability",
    exercises: [
      "Plank",
      "Side Plank",
      "Mountain Climbers",
      "Dead Bug",
      "Bird Dog", 
      "Leg Raises",
      "Russian Twists",
      "V-Ups"
    ]
  },
  {
    name: "Mobility & Corrective / Recovery",
    exercises: [
      "World's Greatest Stretch",
      "Cat-Cow",
      "90/90 Hip Stretch",
      "Band Pull-Aparts",
      "Foam Rolling (Quads)",
      "Thread the Needle",
      "Wall Angels",
      "Shoulder CARs"
    ]
  }
];

export default function IncludeExercisesCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<string | undefined>) {
  // Parse the value to separate custom text and selected exercises
  const { customText, selectedExercises } = useMemo(() => {
    if (!value) return { customText: "", selectedExercises: [] };
    
    // Check if value contains our separator
    const parts = value.split(" | SELECTED: ");
    if (parts.length === 2) {
      const customText = parts[0];
      const selectedExercises = parts[1] ? parts[1].split(", ") : [];
      return { customText, selectedExercises };
    }
    
    // If no separator, treat entire value as custom text
    return { customText: value, selectedExercises: [] };
  }, [value]);

  const [includeExercises, setIncludeExercises] = useState(customText);
  const [selectedExercisesList, setSelectedExercisesList] = useState<string[]>(selectedExercises);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Full Body"]);

  // Update local state when prop value changes
  useEffect(() => {
    setIncludeExercises(customText);
    setSelectedExercisesList(selectedExercises);
  }, [customText, selectedExercises]);

  // Combine custom text and selected exercises into final value
  const updateCombinedValue = useCallback((newCustomText: string, newSelectedExercises: string[]) => {
    let combinedValue = "";
    
    if (newCustomText.trim() && newSelectedExercises.length > 0) {
      combinedValue = `${newCustomText.trim()} | SELECTED: ${newSelectedExercises.join(", ")}`;
    } else if (newCustomText.trim()) {
      combinedValue = newCustomText.trim();
    } else if (newSelectedExercises.length > 0) {
      combinedValue = `SELECTED: ${newSelectedExercises.join(", ")}`;
    }
    
    onChange(combinedValue || undefined);
  }, [onChange]);

  const handleCustomTextChange = useCallback((newText: string) => {
    setIncludeExercises(newText);
    updateCombinedValue(newText, selectedExercisesList);
  }, [selectedExercisesList, updateCombinedValue]);

  const handleExerciseToggle = useCallback((exercise: string) => {
    const newSelected = selectedExercisesList.includes(exercise)
      ? selectedExercisesList.filter(ex => ex !== exercise)
      : [...selectedExercisesList, exercise];
    
    setSelectedExercisesList(newSelected);
    updateCombinedValue(includeExercises, newSelected);
  }, [selectedExercisesList, includeExercises, updateCombinedValue]);

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
    setIncludeExercises("");
    setSelectedExercisesList([]);
    onChange(undefined);
  }, [onChange]);

  // Get preview of selected exercises
  const getSelectedPreview = useCallback(() => {
    if (selectedExercisesList.length === 0) return null;
    if (selectedExercisesList.length <= 3) {
      return selectedExercisesList.join(", ");
    }
    const firstThree = selectedExercisesList.slice(0, 3).join(", ");
    const remaining = selectedExercisesList.length - 3;
    return `${firstThree} +${remaining} more`;
  }, [selectedExercisesList]);

  const selectedPreview = getSelectedPreview();
  const hasSelections = selectedExercisesList.length > 0 || includeExercises.trim();

  return (
    <div className="space-y-4">
      {/* Custom Exercise Input */}
      <div>
        <label className="block text-sm font-medium text-base-content mb-2">
          Specify exercises you definitely want in your workout
        </label>
        <textarea
          placeholder="e.g., squats, pushups, deadlifts, mountain climbers"
          value={includeExercises}
          onChange={(e) => handleCustomTextChange(e.target.value)}
          disabled={disabled}
          rows={3}
          className={`textarea textarea-bordered w-full resize-none ${disabled ? "textarea-disabled" : ""}`}
        />
        <p className="text-xs text-base-content/60 mt-1">
          Enter exercises as comma-separated list (e.g., "Squats, Push-ups, Deadlifts")
        </p>
      </div>

      {/* Selected Exercises Preview */}
      {hasSelections && (
        <div className="p-4 bg-info/10 rounded-lg border border-info/20">
          <h3 className="font-semibold text-info mb-2">
            Your Exercise Selection
          </h3>
          {selectedExercisesList.length > 0 && (
            <div className="mb-2">
              <p className="text-info text-sm font-medium mb-1">
                Selected from categories ({selectedExercisesList.length}):
              </p>
              <p className="text-info text-sm">
                {selectedPreview}
              </p>
            </div>
          )}
          {includeExercises.trim() && (
            <div>
              <p className="text-info text-sm font-medium mb-1">
                Custom exercises to include:
              </p>
              <p className="text-info text-sm">
                {includeExercises}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Exercise Categories */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-base-content">
          Browse Exercise Library (Optional)
        </h4>
        
        {EXERCISE_CATEGORIES.map((category) => {
          const selectedInCategory = category.exercises.filter(ex => 
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
                    ({category.exercises.length} exercises)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedInCategory > 0 && (
                    <span className="bg-success text-success-content px-2 py-1 rounded-full text-xs font-medium">
                      {selectedInCategory} selected
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
                      const isSelected = selectedExercisesList.includes(exercise);
                      return (
                        <button
                          key={exercise}
                          type="button"
                          className={`
                            flex items-center justify-center
                            h-auto min-h-[2.5rem] py-3 px-3 rounded-lg
                            text-xs font-medium transition-all duration-200
                            border text-center
                            ${isSelected 
                              ? "bg-primary text-primary-content border-primary" 
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
      <div className="p-4 bg-success/10 rounded-lg border border-success/20">
        <h3 className="font-semibold text-success mb-2">How It Works</h3>
        <div className="space-y-1 text-success text-sm">
          <p>1. Add custom exercises you definitely want in the text area above</p>
          <p>2. Browse exercises by category below</p>
          <p>3. Click category headers to expand/collapse exercise lists</p>
          <p>4. Select additional exercises from the categories</p>
          <p>5. Both custom and selected exercises will be included in your workout</p>
        </div>
      </div>

      {/* Quick Actions */}
      {hasSelections && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-sm btn-error btn-outline"
            onClick={clearAll}
            disabled={disabled}
          >
            Clear All
          </button>
        </div>
      )}

      {error && <p className="validator-hint mt-2" role="alert">{error}</p>}
    </div>
  );
}
