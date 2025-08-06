import { CustomizationComponentProps } from '../types';

// Stress level ratings based on sports psychology assessments and POMS (Profile of Mood States)
const STRESS_LEVELS = [
  {
    value: 1,
    label: 'Very Low',
    description: 'Feeling calm, relaxed, and mentally clear with optimal focus',
  },
  {
    value: 2,
    label: 'Low',
    description: 'Minimal stress, composed mindset, ready for performance',
  },
  {
    value: 3,
    label: 'Moderate',
    description:
      'Some tension but manageable, maintaining competitive readiness',
  },
  {
    value: 4,
    label: 'High',
    description:
      'Elevated stress affecting focus, feeling overwhelmed or anxious',
  },
  {
    value: 5,
    label: 'Very High',
    description:
      'Severe stress impacting performance, need stress management techniques',
  },
];

export default function StressLevelCustomization({
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
    return STRESS_LEVELS.find((level) => level.value === selectedRating);
  };

  const selectedLevel = getSelectedLevel();

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-base-content/80 mb-3">
          Rate your current stress level (1 = Very Low, 5 = Very High)
        </p>

        <div className="rating rating-lg gap-2">
          {STRESS_LEVELS.map((level) => {
            const isSelected = selectedRating === level.value;

            return (
              <button
                key={level.value}
                type="button"
                className={`btn btn-circle ${
                  isSelected
                    ? 'btn-accent text-accent-content'
                    : 'btn-outline btn-accent'
                } ${disabled ? 'btn-disabled' : ''} font-bold text-base`}
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
          <p className="font-medium text-sm text-accent">
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
