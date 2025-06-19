import { Target } from "lucide-react";
import { WorkoutCustomizationProps } from "./types";
import { CUSTOMIZATION_CONFIG } from "./customizations";
import { useUserAccessContext } from "@/contexts/UserAccessContext";
import { useState } from "react";

export default function WorkoutCustomization({
  options,
  onChange,
  errors,
  disabled = false,
  onGenerateWorkout,
  onUpgrade,
  mode = "custom",
}: WorkoutCustomizationProps) {
  const { canAccessFeature, isLoading } = useUserAccessContext();
  const hasWorkoutCustomization = canAccessFeature("workout_customization");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const handleChange = (
    key: keyof WorkoutCustomizationProps["options"],
    value: unknown
  ) => {
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
          return soreAreas[0]
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
        }
        return `${soreAreas.length} areas`;
      }

      case "customization_focus": {
        const focus = value as string;
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

  // For quick mode, only show duration
  if (mode === "quick") {
    const durationConfig = CUSTOMIZATION_CONFIG.find(
      (config) => config.key === "customization_duration"
    );

    if (!durationConfig) return null;

    const IconComponent = durationConfig.icon;
    const CustomizationComponent = durationConfig.component;
    const value = options[durationConfig.key];
    const error = errors[durationConfig.key];

    return (
      <div className="mb-6">
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
                  plans. Upgrade to personalize your workouts with duration,
                  focus areas, equipment preferences, and more.
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
            className={`border border-base-300 rounded-lg p-4 ${
              !hasWorkoutCustomization ? "pointer-events-none opacity-80" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <IconComponent className="w-5 h-5 mr-3" />
                <span className="font-medium">{durationConfig.label}</span>
              </div>
            </div>

            <p className="text-sm text-base-content/70 mb-3">
              Choose how long you want your workout to be
            </p>
            <CustomizationComponent
              value={value}
              onChange={(newValue) =>
                handleChange(durationConfig.key, newValue)
              }
              disabled={disabled || !hasWorkoutCustomization}
              error={error}
            />
          </div>
        </div>
      </div>
    );
  }

  // Group configurations by category
  const groupedConfigs = CUSTOMIZATION_CONFIG.reduce((acc, config) => {
    const category = config.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(config);
    return acc;
  }, {} as Record<string, typeof CUSTOMIZATION_CONFIG>);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
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
          className={`space-y-4 ${
            !hasWorkoutCustomization ? "pointer-events-none opacity-80" : ""
          }`}
        >
          {Object.entries(groupedConfigs).map(([category, configs]) => (
            <div key={category} className="border border-base-300 rounded-lg">
              <button
                type="button"
                className="w-full p-4 text-left font-medium hover:bg-base-100 transition-colors rounded-t-lg flex items-center justify-between"
                onClick={() => toggleCategory(category)}
                disabled={disabled || !hasWorkoutCustomization}
              >
                <span>{category}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    expandedCategories.includes(category) ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {expandedCategories.includes(category) && (
                <div className="border-t border-base-300 p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {configs.map((config) => {
                      const IconComponent = config.icon;
                      const CustomizationComponent = config.component;
                      const value = options[config.key];
                      const error = errors[config.key];
                      const currentSelection = formatCurrentSelection(
                        config,
                        value
                      );

                      return (
                        <div
                          key={config.key}
                          className={`border border-base-200 rounded-lg p-4 ${
                            config.comingSoon ? "opacity-50" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <IconComponent className="w-4 h-4 mr-2" />
                              <span className="font-medium text-sm">
                                {config.label}
                              </span>
                              {config.comingSoon && (
                                <span className="badge badge-ghost badge-xs ml-2">
                                  Coming Soon
                                </span>
                              )}
                            </div>
                            {currentSelection && !config.comingSoon && (
                              <span className="badge badge-primary badge-xs">
                                {currentSelection}
                              </span>
                            )}
                          </div>

                          {!config.comingSoon ? (
                            <>
                              <p className="text-xs text-base-content/70 mb-2">
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
                            <p className="text-xs text-base-content/50">
                              This customization option is coming soon! Stay
                              tuned for updates.
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
