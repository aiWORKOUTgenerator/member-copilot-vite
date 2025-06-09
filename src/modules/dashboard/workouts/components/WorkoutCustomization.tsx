import { Target } from "lucide-react";
import { PerWorkoutOptions } from "./types";
import { CUSTOMIZATION_CONFIG } from "./customizations";

interface WorkoutCustomizationProps {
  options: PerWorkoutOptions;
  onChange: (key: keyof PerWorkoutOptions, value: unknown) => void;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  disabled?: boolean;
}

export default function WorkoutCustomization({
  options,
  onChange,
  errors,
  disabled = false,
}: WorkoutCustomizationProps) {
  const handleChange = (key: keyof PerWorkoutOptions, value: unknown) => {
    onChange(key, value);
  };

  // Helper function to format the current selection for display
  const formatCurrentSelection = (
    config: (typeof CUSTOMIZATION_CONFIG)[0],
    value: unknown
  ) => {
    if (!value) return null;

    switch (config.key) {
      case "workoutDuration": {
        const duration = value as number;
        if (duration >= 60) {
          const hours = Math.floor(duration / 60);
          const minutes = duration % 60;
          if (minutes === 0) {
            return `${hours} hour${hours > 1 ? "s" : ""}`;
          } else {
            return `${hours}h ${minutes}m`;
          }
        }
        return `${duration} min`;
      }

      case "focusAreas": {
        const areas = value as string[];
        if (areas.length === 0) return null;
        if (areas.length === 1) {
          // Convert snake_case to display format
          return areas[0]
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
        }
        return `${areas.length} areas`;
      }

      case "availableEquipment": {
        const equipment = value as string[];
        if (equipment.length === 0) return null;
        if (equipment.length === 1) {
          // Convert snake_case to display format and handle special cases
          const formatted = equipment[0]
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
          return formatted === "Bodyweight Only"
            ? "Bodyweight Only"
            : formatted;
        }
        return `${equipment.length} items`;
      }

      case "soreness": {
        const soreAreas = value as string[];
        if (soreAreas.length === 0) return null;
        if (soreAreas.length === 1) {
          // Convert snake_case to display format
          return soreAreas[0]
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
        }
        return `${soreAreas.length} areas`;
      }

      case "workoutFocus": {
        const focus = value as string;
        // Convert snake_case to display format
        return focus
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
      }

      case "sleepQuality": {
        const rating = value as number;
        const labels = ["", "Very Poor", "Poor", "Fair", "Good", "Excellent"];
        return `${labels[rating]} (${rating}/5)`;
      }

      case "energyLevel": {
        const rating = value as number;
        const labels = ["", "Very Low", "Low", "Moderate", "High", "Very High"];
        return `${labels[rating]} (${rating}/5)`;
      }

      case "stressLevel": {
        const rating = value as number;
        const labels = ["", "Very Low", "Low", "Moderate", "High", "Very High"];
        return `${labels[rating]} (${rating}/5)`;
      }

      default:
        return String(value);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Target className="w-5 h-5 mr-2" />
        Workout Customization
        <span className="text-sm font-normal text-base-content/70 ml-2">
          (all optional)
        </span>
      </h3>

      <div className="space-y-2">
        {CUSTOMIZATION_CONFIG.map((config) => {
          const IconComponent = config.icon;
          const CustomizationComponent = config.component;
          const value = options[config.key];
          const error = errors[config.key];
          const currentSelection = formatCurrentSelection(config, value);

          return (
            <div
              key={config.key}
              className={`collapse collapse-arrow border border-base-300 rounded-lg ${
                config.comingSoon ? "opacity-50" : ""
              }`}
            >
              <input
                type="checkbox"
                className="collapse-checkbox"
                disabled={disabled || config.comingSoon}
              />

              <div className="collapse-title flex items-center justify-between pr-12">
                <div className="flex items-center">
                  <IconComponent className="w-4 h-4 mr-3" />
                  <span className="font-medium">{config.label}</span>
                  {config.comingSoon && (
                    <span className="badge badge-ghost badge-sm ml-2">
                      Coming Soon
                    </span>
                  )}
                </div>

                {currentSelection && !config.comingSoon && (
                  <div className="flex items-center space-x-2">
                    <span className="badge badge-primary badge-sm">
                      {currentSelection}
                    </span>
                  </div>
                )}
              </div>

              <div className="collapse-content">
                <div className="pt-2 pb-4">
                  {!config.comingSoon ? (
                    <>
                      <p className="text-sm text-base-content/70 mb-3">
                        {config.key === "workoutDuration" &&
                          "Choose how long you want your workout to be"}
                        {config.key === "focusAreas" &&
                          "Select the body parts or workout types you want to focus on"}
                        {config.key === "workoutFocus" &&
                          "What's your main goal for this workout?"}
                        {config.key === "availableEquipment" &&
                          "Tell us what equipment you have available"}
                        {config.key === "sleepQuality" &&
                          "How well did you sleep last night?"}
                        {config.key === "energyLevel" &&
                          "How energetic are you feeling today?"}
                        {config.key === "stressLevel" &&
                          "What's your current stress level?"}
                        {config.key === "soreness" &&
                          "Are you experiencing any soreness?"}
                      </p>
                      <CustomizationComponent
                        value={value}
                        onChange={(newValue) =>
                          handleChange(config.key, newValue)
                        }
                        disabled={disabled}
                        error={error}
                      />
                    </>
                  ) : (
                    <p className="text-sm text-base-content/50">
                      This customization option is coming soon! Stay tuned for
                      updates.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
