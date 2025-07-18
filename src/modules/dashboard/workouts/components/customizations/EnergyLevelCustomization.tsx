import { CustomizationComponentProps } from "../types";

// Energy level ratings based on Rate of Perceived Exertion (RPE) and clinical energy assessments
const ENERGY_LEVELS = [
  {
    value: 1,
    label: "Very Low",
    description: "Extremely fatigued, struggling to stay awake, need rest",
  },
  {
    value: 2,
    label: "Low",
    description: "Tired and sluggish, low motivation, minimal energy reserves",
  },
  {
    value: 3,
    label: "Moderate",
    description: "Average energy, can perform daily activities comfortably",
  },
  {
    value: 4,
    label: "High",
    description:
      "Feeling energetic and motivated, ready for challenging activities",
  },
  {
    value: 5,
    label: "Very High",
    description: "Peak energy, feeling powerful and ready for intense workouts",
  },
];

export default function EnergyLevelCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<number | undefined>) {
  const selectedRating = value as number | undefined;

  const handleRatingChange = (rating: number) => {
    if (selectedRating === rating) {
      // Deselect if clicking the same rating
      onChange(undefined);
    } else {
      onChange(rating);
    }
  };

  const getSelectedLevel = () => {
    if (!selectedRating) return null;
    return ENERGY_LEVELS.find((level) => level.value === selectedRating);
  };

  const selectedLevel = getSelectedLevel();

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-base-content/80 mb-3">
          Rate your current energy level (1 = Very Low, 5 = Very High)
        </p>

        <div className="rating rating-lg gap-2">
          {ENERGY_LEVELS.map((level) => {
            const isSelected = selectedRating === level.value;

            return (
              <button
                key={level.value}
                type="button"
                className={`btn btn-circle ${
                  isSelected
                    ? "btn-secondary text-secondary-content"
                    : "btn-outline btn-secondary"
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

      {selectedLevel && (
        <div className="bg-base-200 rounded-lg p-3 mb-2">
          <p className="font-medium text-sm text-secondary">
            {selectedLevel.label}
          </p>
          <p className="text-xs text-base-content/70">
            {selectedLevel.description}
          </p>
        </div>
      )}

      {error && <p className="validator-hint mt-2">{error}</p>}
    </div>
  );
}
