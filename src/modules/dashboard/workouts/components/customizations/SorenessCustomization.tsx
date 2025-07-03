import { memo, useCallback } from "react";
import { CustomizationComponentProps, CategoryRatingData } from "../types";

// Body parts using common, everyday terminology
const BODY_PARTS = [
  { label: "Neck", value: "neck" },
  { label: "Shoulders", value: "shoulders" },
  { label: "Upper Back", value: "upper_back" },
  { label: "Lower Back", value: "lower_back" },
  { label: "Chest", value: "chest" },
  { label: "Arms", value: "arms" },
  { label: "Wrists", value: "wrists" },
  { label: "Elbows", value: "elbows" },
  { label: "Abs/Core", value: "abs_core" },
  { label: "Hips", value: "hips" },
  { label: "Glutes", value: "glutes" },
  { label: "Thighs", value: "thighs" },
  { label: "Hamstrings", value: "hamstrings" },
  { label: "Knees", value: "knees" },
  { label: "Calves", value: "calves" },
  { label: "Ankles", value: "ankles" },
];

// Soreness level ratings
const SORENESS_LEVELS = [
  {
    value: 1,
    label: "Mild",
    description: "Slight discomfort, barely noticeable during movement",
  },
  {
    value: 2,
    label: "Low-Moderate",
    description: "Noticeable soreness, but doesn't limit movement significantly",
  },
  {
    value: 3,
    label: "Moderate",
    description: "Clear soreness that affects some movements and activities",
  },
  {
    value: 4,
    label: "High",
    description: "Significant soreness that limits movement and causes discomfort",
  },
  {
    value: 5,
    label: "Severe",
    description: "Intense soreness that severely restricts movement and function",
  },
];

export default memo(function SorenessCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<CategoryRatingData | undefined>) {
  const categoryData = value || {};
  
  // Convert CategoryRatingData to internal format for easier manipulation
  const selectedBodyParts = Object.keys(categoryData).filter(key => categoryData[key].selected);



  const handleBodyPartToggle = useCallback((bodyPartValue: string) => {
    const bodyPart = BODY_PARTS.find(bp => bp.value === bodyPartValue);
    const isSelected = categoryData[bodyPartValue]?.selected || false;

    if (isSelected) {
      // Remove the body part
      const newCategoryData = { ...categoryData };
      delete newCategoryData[bodyPartValue];
      onChange(Object.keys(newCategoryData).length > 0 ? newCategoryData : undefined);
    } else {
      // Add the body part
      const newCategoryData = {
        ...categoryData,
        [bodyPartValue]: {
          selected: true,
          label: bodyPart?.label || bodyPartValue,
          description: undefined
        }
      };
      onChange(newCategoryData);
    }
  }, [categoryData, onChange]);

  const handleSorenessLevelChange = useCallback((bodyPart: string, level: number) => {
    const newCategoryData = {
      ...categoryData,
      [bodyPart]: {
        ...categoryData[bodyPart],
        rating: level
      }
    };
    onChange(newCategoryData);
  }, [categoryData, onChange]);

  return (
    <div>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-base-content/80 mb-3">
            Select any areas where you're experiencing soreness:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {BODY_PARTS.map((bodyPart) => {
              const isSelected = categoryData[bodyPart.value]?.selected || false;

              return (
                <button
                  key={bodyPart.value}
                  type="button"
                  className={`btn btn-sm justify-start ${
                    isSelected ? "btn-primary" : "btn-outline"
                  } ${disabled ? "btn-disabled" : ""}`}
                  onClick={() => handleBodyPartToggle(bodyPart.value)}
                  disabled={disabled}
                >
                  {bodyPart.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Soreness Level Ratings for Selected Body Parts */}
        {selectedBodyParts.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-medium text-base-content">
              Rate the soreness level for each selected area:
            </h4>
            
            {selectedBodyParts.map((bodyPartValue) => {
              const bodyPart = BODY_PARTS.find(bp => bp.value === bodyPartValue);
              const selectedLevel = categoryData[bodyPartValue]?.rating;
              const selectedSorenessLevel = SORENESS_LEVELS.find(level => level.value === selectedLevel);
              
              return (
                <div key={bodyPartValue} className="border border-base-300 rounded-lg p-4">
                  <div className="mb-3">
                    <h5 className="font-medium text-base-content mb-2">{bodyPart?.label}</h5>
                    
                    <div role="radiogroup" aria-labelledby={`soreness-${bodyPartValue}-label`}>
                      <p id={`soreness-${bodyPartValue}-label`} className="text-sm text-base-content/80 mb-3">
                        Rate soreness level (1 = Mild, 5 = Severe)
                      </p>

                      <div className="rating rating-lg gap-2">
                        {SORENESS_LEVELS.map((level) => {
                          const isSelected = selectedLevel === level.value;

                          return (
                            <button
                              key={level.value}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              aria-describedby={error ? `soreness-${bodyPartValue}-error` : undefined}
                              className={`btn btn-circle ${
                                isSelected
                                  ? "btn-warning text-warning-content"
                                  : "btn-outline btn-warning"
                              } ${disabled ? "btn-disabled" : ""} font-bold text-base`}
                              onClick={() => handleSorenessLevelChange(bodyPartValue, level.value)}
                              disabled={disabled}
                              title={`${level.label}: ${level.description}`}
                            >
                              {level.value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {selectedSorenessLevel && (
                    <div className="bg-base-200 rounded-lg p-3">
                      <p className="font-medium text-sm text-warning">
                        {selectedSorenessLevel.label}
                      </p>
                      <p className="text-xs text-base-content/70">
                        {selectedSorenessLevel.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {error && <p className="validator-hint mt-2" role="alert">{error}</p>}

      {selectedBodyParts.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-base-content/60 mb-2">
            Selected sore areas ({selectedBodyParts.length}):
          </p>
          <div className="flex flex-wrap gap-1">
            {selectedBodyParts.map((bodyPartValue) => {
              const categoryInfo = categoryData[bodyPartValue];
              const level = categoryInfo?.rating;
              const levelLabel = SORENESS_LEVELS.find(l => l.value === level)?.label;
              
              return (
                <span
                  key={bodyPartValue}
                  className="badge badge-warning badge-outline badge-sm"
                >
                  {categoryInfo?.label}{level ? ` (${levelLabel})` : ''}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});
