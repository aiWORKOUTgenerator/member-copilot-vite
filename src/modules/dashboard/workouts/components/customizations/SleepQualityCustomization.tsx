import { memo, useCallback } from "react";
import { CustomizationComponentProps } from "../types";

// Sleep quality ratings based on Pittsburgh Sleep Quality Index and clinical assessments
const SLEEP_QUALITY_LEVELS = [
  {
    value: 1,
    label: "Very Poor",
    description:
      "Severely disrupted sleep, frequent awakenings, feeling exhausted",
  },
  {
    value: 2,
    label: "Poor",
    description: "Difficulty falling asleep, restless night, waking up tired",
  },
  {
    value: 3,
    label: "Fair",
    description: "Some sleep interruptions, moderately rested upon waking",
  },
  {
    value: 4,
    label: "Good",
    description: "Mostly uninterrupted sleep, feeling refreshed in the morning",
  },
  {
    value: 5,
    label: "Excellent",
    description: "Deep, restorative sleep, waking up fully energized and alert",
  },
];

export default memo(function SleepQualityCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<number | undefined>) {
  const selectedRating = value as number | undefined;

  const handleRatingChange = useCallback((rating: number) => {
    if (selectedRating === rating) {
      // Deselect if clicking the same rating
      onChange(undefined);
    } else {
      onChange(rating);
    }
  }, [selectedRating, onChange]);

  const getSelectedLevel = () => {
    if (!selectedRating) return null;
    return SLEEP_QUALITY_LEVELS.find((level) => level.value === selectedRating);
  };

  const selectedLevel = getSelectedLevel();

  return (
    <div>
      <div className="mb-4">
        <div role="radiogroup" aria-labelledby="sleep-quality-label">
          <p id="sleep-quality-label" className="text-sm text-base-content/80 mb-3">
            Rate your sleep quality from last night (1 = Very Poor, 5 = Excellent)
          </p>

          <div className="rating rating-lg gap-2">
            {SLEEP_QUALITY_LEVELS.map((level) => {
              const isSelected = selectedRating === level.value;

              return (
                <button
                  key={level.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-describedby={error ? "sleep-quality-error" : undefined}
                  className={`btn btn-circle ${
                    isSelected
                      ? "btn-primary text-primary-content"
                      : "btn-outline btn-primary"
                  } ${disabled ? "btn-disabled" : ""} font-bold text-base`}
                  onClick={() => handleRatingChange(level.value)}
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

      {selectedLevel && (
        <div className="bg-base-200 rounded-lg p-3 mb-2">
          <p className="font-medium text-sm text-primary">
            {selectedLevel.label}
          </p>
          <p className="text-xs text-base-content/70">
            {selectedLevel.description}
          </p>
        </div>
      )}

      {error && <p id="sleep-quality-error" className="validator-hint mt-2" role="alert">{error}</p>}
    </div>
  );
});
