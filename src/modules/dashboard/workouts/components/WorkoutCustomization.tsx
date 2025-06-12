import { Target } from "lucide-react";
import { PerWorkoutOptions } from "./types";
import { CUSTOMIZATION_CONFIG } from "./customizations";
import { useUserAccessContext } from "@/contexts/UserAccessContext";

interface WorkoutCustomizationProps {
  options: PerWorkoutOptions;
  onChange: (key: keyof PerWorkoutOptions, value: unknown) => void;
  errors: Partial<Record<keyof PerWorkoutOptions, string>>;
  disabled?: boolean;
  onGenerateWorkout?: () => void;
  onUpgrade?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function WorkoutCustomization({
  options,
  onChange,
  errors,
  disabled = false,
  onGenerateWorkout,
  onUpgrade,
}: WorkoutCustomizationProps) {
  const { canAccessFeature, isLoading } = useUserAccessContext();
  const hasWorkoutCustomization = canAccessFeature("workout_customization");

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
      case "customization_duration": {
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

      case "customization_areas": {
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

      case "customization_equipment": {
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

      case "customization_soreness": {
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

      case "customization_focus": {
        const focus = value as string;
        // Convert snake_case to display format
        return focus
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
      }

      case "customization_include": {
        const exercises = value as string;
        const exerciseList = exercises
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e.length > 0);
        if (exerciseList.length === 0) return null;
        if (exerciseList.length === 1) {
          return exerciseList[0];
        }
        return `${exerciseList.length} exercises`;
      }

      case "customization_exclude": {
        const exercises = value as string;
        const exerciseList = exercises
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e.length > 0);
        if (exerciseList.length === 0) return null;
        if (exerciseList.length === 1) {
          return exerciseList[0];
        }
        return `${exerciseList.length} exercises`;
      }

      case "customization_sleep": {
        const rating = value as number;
        const labels = ["", "Very Poor", "Poor", "Fair", "Good", "Excellent"];
        return `${labels[rating]} (${rating}/5)`;
      }

      case "customization_energy": {
        const rating = value as number;
        const labels = ["", "Very Low", "Low", "Moderate", "High", "Very High"];
        return `${labels[rating]} (${rating}/5)`;
      }

      case "customization_stress": {
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

      <div className="relative">
        {/* Upgrade overlay */}
        {!isLoading && !hasWorkoutCustomization && (
          <div className="absolute inset-0 bg-base-100/30 backdrop-blur-[1px] rounded-lg z-10 flex items-center justify-center">
            <div className="text-center p-6 max-w-md bg-base-100/95 backdrop-blur-sm rounded-lg border border-base-300 shadow-lg">
              <div className="mb-4">
                <Target className="w-12 h-12 mx-auto text-primary/50" />
              </div>
              <h4 className="text-lg font-semibold mb-2">
                Upgrade To Customize
              </h4>
              <p className="text-base-content/70 mb-4">
                Workout customization features are available with our premium
                plans. Upgrade to personalize your workouts with duration, focus
                areas, equipment preferences, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="submit"
                  className="btn btn-outline btn-sm w-full sm:w-auto"
                  onClick={onGenerateWorkout}
                >
                  Generate Workout Anyway
                </button>
                <button
                  className="btn btn-primary btn-sm w-full sm:w-auto"
                  onClick={onUpgrade}
                >
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          className={`space-y-2 ${
            !hasWorkoutCustomization ? "pointer-events-none opacity-80" : ""
          }`}
        >
          {CUSTOMIZATION_CONFIG.map((config, index) => {
            const IconComponent = config.icon;
            const CustomizationComponent = config.component;
            const value = options[config.key];
            const error = errors[config.key];
            const currentSelection = formatCurrentSelection(config, value);

            return (
              <div
                tabIndex={index}
                key={config.key}
                className={`collapse collapse-arrow border border-base-300 rounded-lg ${
                  config.comingSoon ? "opacity-50" : ""
                }`}
              >
                <input
                  type="checkbox"
                  className="collapse-checkbox"
                  disabled={
                    disabled || config.comingSoon || !hasWorkoutCustomization
                  }
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
                          {config.key === "customization_duration" &&
                            "Choose how long you want your workout to be"}
                          {config.key === "customization_areas" &&
                            "Select the body parts or workout types you want to focus on"}
                          {config.key === "customization_focus" &&
                            "What's your main goal for this workout?"}
                          {config.key === "customization_equipment" &&
                            "Tell us what equipment you have available"}
                          {config.key === "customization_include" &&
                            "Specify exercises you definitely want in your workout"}
                          {config.key === "customization_exclude" &&
                            "Specify exercises you want to avoid"}
                          {config.key === "customization_sleep" &&
                            "How well did you sleep last night?"}
                          {config.key === "customization_energy" &&
                            "How energetic are you feeling today?"}
                          {config.key === "customization_stress" &&
                            "What's your current stress level?"}
                          {config.key === "customization_soreness" &&
                            "Are you experiencing any soreness?"}
                        </p>
                        <CustomizationComponent
                          value={value}
                          onChange={(newValue) =>
                            handleChange(config.key, newValue)
                          }
                          disabled={disabled || !hasWorkoutCustomization}
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
    </div>
  );
}
