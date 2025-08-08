import { useState, useCallback, useMemo, useEffect, memo } from 'react';
import { CustomizationComponentProps } from '../types';
import {
  formatSelectionSummary,
  getCustomizationButtonClass,
} from '../utils/customizationHelpers';
import {
  ErrorDisplay,
  SelectionSummary,
} from '../utils/customizationComponents';

// Exercise categories for library selection
const EXERCISE_CATEGORIES = [
  {
    name: 'Full Body',
    exercises: [
      'Burpees',
      'Mountain Climbers',
      'Thrusters',
      'Turkish Get-ups',
      'Man Makers',
      'Bear Crawls',
      'Plank to Downward Dog',
    ],
  },
  {
    name: 'Upper Body',
    exercises: [
      'Push-ups',
      'Pull-ups',
      'Chest Press',
      'Shoulder Press',
      'Bicep Curls',
      'Tricep Dips',
      'Lat Pulldowns',
      'Rows',
    ],
  },
  {
    name: 'Lower Body',
    exercises: [
      'Squats',
      'Lunges',
      'Deadlifts',
      'Hip Thrusts',
      'Calf Raises',
      'Step-ups',
      'Bulgarian Split Squats',
      'Wall Sits',
    ],
  },
  {
    name: 'Core',
    exercises: [
      'Plank',
      'Sit-ups',
      'Russian Twists',
      'Bicycle Crunches',
      'Dead Bug',
      'Bird Dog',
      'Leg Raises',
      'Hollow Body Hold',
    ],
  },
  {
    name: 'Cardio',
    exercises: [
      'Jumping Jacks',
      'High Knees',
      'Butt Kicks',
      'Jump Rope',
      'Running in Place',
      'Star Jumps',
      'Side Shuffles',
    ],
  },
  {
    name: 'Functional',
    exercises: [
      'Kettlebell Swings',
      'Battle Ropes',
      'Medicine Ball Slams',
      'Wall Balls',
      "Farmer's Walk",
      'Sled Push',
      'Box Jumps',
      'Tire Flips',
    ],
  },
];

// Clean data structure for the component value
interface IncludeExercisesData {
  customExercises: string;
  libraryExercises: string[];
}

export default memo(function IncludeExercisesCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<IncludeExercisesData | string | undefined>) {
  // Parse incoming value (handle both new format and legacy string format)
  const parsedValue = useMemo((): IncludeExercisesData => {
    if (!value) {
      return { customExercises: '', libraryExercises: [] };
    }

    // New object format
    if (typeof value === 'object' && 'customExercises' in value) {
      return value as IncludeExercisesData;
    }

    // Legacy string format - treat as custom exercises
    if (typeof value === 'string') {
      return { customExercises: value, libraryExercises: [] };
    }

    return { customExercises: '', libraryExercises: [] };
  }, [value]);

  // Separate state for each input method
  const [customExercises, setCustomExercises] = useState(
    parsedValue.customExercises
  );
  const [libraryExercises, setLibraryExercises] = useState<string[]>(
    parsedValue.libraryExercises
  );
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    'Full Body',
  ]);

  // Update local state when prop value changes
  useEffect(() => {
    setCustomExercises(parsedValue.customExercises);
    setLibraryExercises(parsedValue.libraryExercises);
  }, [parsedValue]);

  // ✅ CRITICAL FIX: Stable data creation function
  const createIncludeData = useCallback(
    (customText: string, libraryList: string[]): IncludeExercisesData => ({
      customExercises: customText.trim(),
      libraryExercises: libraryList,
    }),
    []
  );

  // ✅ CRITICAL FIX: Controlled component pattern - immediate change emission
  const emitChange = useCallback(
    (newCustom: string, newLibrary: string[]) => {
      const hasCustom = newCustom.trim().length > 0;
      const hasLibrary = newLibrary.length > 0;

      if (!hasCustom && !hasLibrary) {
        onChange(undefined);
        return;
      }

      const newValue = createIncludeData(newCustom, newLibrary);
      onChange(newValue);
    },
    [onChange, createIncludeData]
  );

  // Handle custom text changes
  const handleCustomChange = useCallback(
    (newText: string) => {
      setCustomExercises(newText);
      // ✅ CRITICAL FIX: Direct controlled update
      emitChange(newText, libraryExercises);
    },
    [libraryExercises, emitChange]
  );

  // Handle library exercise selection
  const handleLibraryToggle = useCallback(
    (exercise: string) => {
      const newLibrary = libraryExercises.includes(exercise)
        ? libraryExercises.filter((ex) => ex !== exercise)
        : [...libraryExercises, exercise];

      setLibraryExercises(newLibrary);
      // ✅ CRITICAL FIX: Direct controlled update
      emitChange(customExercises, newLibrary);
    },
    [libraryExercises, customExercises, emitChange]
  );

  // Category expansion handling
  const toggleCategory = useCallback((categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName]
    );
  }, []);

  const isExpanded = useCallback(
    (categoryName: string) => {
      return expandedCategories.includes(categoryName);
    },
    [expandedCategories]
  );

  // Clear functions
  const clearCustom = useCallback(() => {
    handleCustomChange('');
  }, [handleCustomChange]);

  const clearLibrary = useCallback(() => {
    setLibraryExercises([]);
    // ✅ CRITICAL FIX: Direct controlled update
    emitChange(customExercises, []);
  }, [customExercises, emitChange]);

  const clearAll = useCallback(() => {
    setCustomExercises('');
    setLibraryExercises([]);
    onChange(undefined);
  }, [onChange]);

  // Helper functions
  const getLibraryPreview = useCallback(() => {
    return formatSelectionSummary(libraryExercises, { maxItems: 3 });
  }, [libraryExercises]);

  const hasCustom = customExercises.trim().length > 0;
  const hasLibrary = libraryExercises.length > 0;
  const hasAnySelections = hasCustom || hasLibrary;

  return (
    <div className="space-y-6">
      {/* Field 1: Custom Exercise Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-base-content">
            Custom Exercises
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
          placeholder="e.g., squats, pushups, deadlifts, mountain climbers"
          value={customExercises}
          onChange={(e) => handleCustomChange(e.target.value)}
          disabled={disabled}
          rows={3}
          className={`textarea textarea-bordered w-full resize-none ${disabled ? 'textarea-disabled' : ''}`}
        />
        <p className="text-xs text-base-content/60 mt-1">
          Enter exercises as comma-separated list
        </p>

        {hasCustom && (
          <SelectionSummary
            title="Custom exercises"
            count={customExercises.split(',').filter((e) => e.trim()).length}
          >
            <span className="text-sm">{customExercises}</span>
          </SelectionSummary>
        )}
      </div>

      {/* Field 2: Library Exercise Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-base-content">
            Exercise Library
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
            title="Selected from library"
            count={libraryExercises.length}
            className="mb-4"
          >
            <span className="text-sm">{getLibraryPreview()}</span>
          </SelectionSummary>
        )}

        <div className="space-y-3">
          {EXERCISE_CATEGORIES.map((category) => {
            const selectedInCategory = category.exercises.filter((ex) =>
              libraryExercises.includes(ex)
            ).length;

            return (
              <div
                key={category.name}
                className="border border-base-300 rounded-lg overflow-hidden"
              >
                {/* Category Header */}
                <button
                  type="button"
                  className={`
                    w-full flex items-center justify-between p-4 text-left
                    transition-all duration-200 hover:bg-base-200
                    ${isExpanded(category.name) ? 'bg-base-200' : 'bg-base-100'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => !disabled && toggleCategory(category.name)}
                  disabled={disabled}
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-base-content">
                      {category.name}
                    </span>
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
                    <span
                      className={`
                      transition-transform duration-200 text-base-content/40
                      ${isExpanded(category.name) ? 'rotate-180' : ''}
                    `}
                    >
                      ▼
                    </span>
                  </div>
                </button>

                {/* Exercise Grid */}
                {isExpanded(category.name) && (
                  <div className="p-4 bg-base-100 border-t border-base-300">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {category.exercises.map((exercise) => {
                        const isSelected = libraryExercises.includes(exercise);
                        return (
                          <button
                            key={exercise}
                            type="button"
                            className={`${getCustomizationButtonClass(isSelected, disabled)} flex items-center justify-center h-auto min-h-[2.5rem] py-3 px-3 rounded-lg text-xs font-medium text-center`}
                            onClick={() =>
                              !disabled && handleLibraryToggle(exercise)
                            }
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
      {hasAnySelections && (
        <div className="flex flex-wrap gap-3 pt-2 border-t border-base-200">
          <button
            type="button"
            className="btn btn-sm btn-error btn-outline"
            onClick={clearAll}
            disabled={disabled}
          >
            Clear Everything
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="p-4 bg-info/10 rounded-lg border border-info/20">
        <h3 className="font-semibold text-info mb-2">How to Use</h3>
        <div className="space-y-1 text-info text-sm">
          <p>
            <strong>Custom Exercises:</strong> Type any exercises you want
            (comma-separated)
          </p>
          <p>
            <strong>Exercise Library:</strong> Browse and select from
            categorized exercises
          </p>
          <p>Both methods work independently - use either or both as needed</p>
        </div>
      </div>

      <ErrorDisplay error={error} />
    </div>
  );
});
