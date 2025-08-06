import { CustomizationComponentProps } from "../types";

// Focus area options
const FOCUS_AREA_OPTIONS = [
  { label: "Upper Body", value: "upper_body" },
  { label: "Lower Body", value: "lower_body" },
  { label: "Core", value: "core" },
  { label: "Back", value: "back" },
  { label: "Shoulders", value: "shoulders" },
  { label: "Chest", value: "chest" },
  { label: "Arms", value: "arms" },
  { label: "Mobility/Flexibility", value: "mobility_flexibility" },
  { label: "Cardio", value: "cardio" },
  { label: "Recovery/Stretching", value: "recovery_stretching" },
];

export default function FocusAreaCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<string[] | undefined>) {
  const selectedAreas = value || [];

  const handleAreaToggle = (areaValue: string) => {
    const isSelected = selectedAreas.includes(areaValue);

    if (isSelected) {
      // Remove the area
      const newAreas = selectedAreas.filter((area) => area !== areaValue);
      onChange(newAreas.length > 0 ? newAreas : undefined);
    } else {
      // Add the area
      onChange([...selectedAreas, areaValue]);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {FOCUS_AREA_OPTIONS.map((option) => {
          const isSelected = selectedAreas.includes(option.value);

          return (
            <label
              key={option.value}
              className={`flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-base-200 ${
                disabled ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={isSelected}
                onChange={() => handleAreaToggle(option.value)}
                disabled={disabled}
              />
              <span className="text-sm">{option.label}</span>
            </label>
          );
        })}
      </div>

      {error && <p className="validator-hint mt-2">{error}</p>}

      {selectedAreas.length > 0 && (
        <p className="text-xs text-base-content/60 mt-2">
          Selected:{" "}
          {selectedAreas
            .map(
              (area) =>
                FOCUS_AREA_OPTIONS.find((option) => option.value === area)
                  ?.label,
            )
            .join(", ")}
        </p>
      )}
    </div>
  );
}
