import { CustomizationComponentProps } from "../types";

// Expanded workout duration presets
const DURATION_PRESETS = [
  { label: "15 minutes", value: 15 },
  { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 },
  { label: "1 hour", value: 60 },
  { label: "1 hour 15 minutes", value: 75 },
  { label: "1 hour 30 minutes", value: 90 },
  { label: "1 hour 45 minutes", value: 105 },
  { label: "2 hours", value: 120 },
  { label: "2 hours 15 minutes", value: 135 },
  { label: "2 hours 30 minutes", value: 150 },
];

export default function WorkoutDurationCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<number | undefined>) {
  const handleDurationChange = (newValue: string) => {
    if (newValue === "") {
      onChange(undefined);
    } else {
      onChange(Number(newValue));
    }
  };

  return (
    <div>
      <select
        className={`select select-bordered select-sm w-full ${
          error ? "select-error" : ""
        }`}
        value={value || ""}
        onChange={(e) => handleDurationChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">Select duration (optional)</option>
        {DURATION_PRESETS.map((preset) => (
          <option key={preset.value} value={preset.value}>
            {preset.label}
          </option>
        ))}
      </select>

      {error && <p className="validator-hint mt-2" role="alert">{error}</p>}

      {value && (
        <p className="text-xs text-base-content/60 mt-1">
          Selected:{" "}
          {DURATION_PRESETS.find((p) => p.value === value)?.label ||
            `${value} minutes`}
        </p>
      )}
    </div>
  );
}
