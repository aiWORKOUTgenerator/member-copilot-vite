import { CustomizationComponentProps } from '../types';

// Workout focus options
const WORKOUT_FOCUS_OPTIONS = [
  { label: 'Strength Training', value: 'strength_training' },
  { label: 'Muscle Building', value: 'muscle_building' },
  { label: 'Fat Loss', value: 'fat_loss' },
  { label: 'Cardio Endurance', value: 'cardio_endurance' },
  { label: 'HIIT', value: 'hiit' },
  { label: 'Flexibility & Mobility', value: 'flexibility_mobility' },
  { label: 'Recovery & Stretching', value: 'recovery_stretching' },
  { label: 'Powerlifting', value: 'powerlifting' },
  { label: 'Bodyweight Training', value: 'bodyweight_training' },
  { label: 'Functional Fitness', value: 'functional_fitness' },
];

export default function WorkoutFocusCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<string | undefined>) {
  const selectedFocus = value as string | undefined;

  const handleFocusChange = (focusValue: string) => {
    if (selectedFocus === focusValue) {
      // Deselect if clicking the same option
      onChange(undefined);
    } else {
      // Select new option
      onChange(focusValue);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {WORKOUT_FOCUS_OPTIONS.map((option) => {
          const isSelected = selectedFocus === option.value;

          return (
            <button
              key={option.value}
              type="button"
              className={`btn btn-sm justify-start ${
                isSelected ? 'btn-primary' : 'btn-outline'
              }`}
              onClick={() => handleFocusChange(option.value)}
              disabled={disabled}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {error && <p className="validator-hint mt-2">{error}</p>}

      {selectedFocus && (
        <p className="text-xs text-base-content/60 mt-2">
          Selected:{' '}
          {
            WORKOUT_FOCUS_OPTIONS.find(
              (option) => option.value === selectedFocus
            )?.label
          }
        </p>
      )}
    </div>
  );
}
