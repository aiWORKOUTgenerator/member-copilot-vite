import { CustomizationComponentProps } from "../types";

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

export default function SorenessCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<string[] | undefined>) {
  const selectedBodyParts = value || [];

  const handleBodyPartToggle = (bodyPartValue: string) => {
    const isSelected = selectedBodyParts.includes(bodyPartValue);

    if (isSelected) {
      // Remove the body part
      const newBodyParts = selectedBodyParts.filter(
        (part) => part !== bodyPartValue
      );
      onChange(newBodyParts.length > 0 ? newBodyParts : undefined);
    } else {
      // Add the body part
      onChange([...selectedBodyParts, bodyPartValue]);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {BODY_PARTS.map((bodyPart) => {
          const isSelected = selectedBodyParts.includes(bodyPart.value);

          return (
            <label
              key={bodyPart.value}
              className={`flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-base-200 ${
                disabled ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={isSelected}
                onChange={() => handleBodyPartToggle(bodyPart.value)}
                disabled={disabled}
              />
              <span className="text-sm">{bodyPart.label}</span>
            </label>
          );
        })}
      </div>

      {error && <p className="validator-hint mt-2">{error}</p>}

      {selectedBodyParts.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-base-content/60 mb-2">
            Sore areas ({selectedBodyParts.length}):
          </p>
          <div className="flex flex-wrap gap-1">
            {selectedBodyParts.map((bodyPart) => {
              const part = BODY_PARTS.find((bp) => bp.value === bodyPart);
              return (
                <span
                  key={bodyPart}
                  className="badge badge-warning badge-outline badge-sm"
                >
                  {part?.label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
