import { Target } from "lucide-react";
import { WorkoutCustomizationProps } from "./types";
import { CUSTOMIZATION_CONFIG } from "./customizations";
import { formatWorkoutSelection } from "./utils/selectionFormatter";
import { useState, useMemo, useCallback, memo } from "react";

// ✅ CRITICAL FIX: Memoize WorkoutCustomization to prevent unnecessary re-renders
const WorkoutCustomization = memo(function WorkoutCustomization({
  options,
  onChange,
  errors,
  disabled = false,
  mode = "custom",
}: WorkoutCustomizationProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Group configurations by category (must be before any early returns)
  const groupedConfigs = useMemo(() => {
    return CUSTOMIZATION_CONFIG.reduce((acc, config) => {
      const category = config.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(config);
      return acc;
    }, {} as Record<string, typeof CUSTOMIZATION_CONFIG>);
  }, []);

  // ✅ CRITICAL FIX: Memoize handleChange to prevent recreation
  const handleChange = useCallback((
    key: keyof WorkoutCustomizationProps["options"],
    value: unknown
  ) => {
    onChange(key, value);
  }, [onChange]);

  // ✅ CRITICAL FIX: Memoize toggleCategory to prevent recreation
  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }, []);

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
          <div className={`border border-base-300 rounded-lg p-4`}>
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
              disabled={disabled}
              error={error}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center flex-wrap gap-2">
        <Target className="w-5 h-5" />
        <span>Workout Customization</span>
        <span className="text-sm font-normal text-base-content/70">
          (all optional)
        </span>
      </h3>

      <div className="relative">
        <div className={`space-y-4`}>
          {Object.entries(groupedConfigs).map(([category, configs]) => (
            <div key={category} className="border border-base-300 rounded-lg">
              <button
                type="button"
                className="w-full p-4 text-left font-medium hover:bg-base-100 transition-colors rounded-t-lg flex items-center justify-between"
                onClick={() => toggleCategory(category)}
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
                  <div className="grid grid-cols-1 gap-4">
                    {configs.map((config) => {
                      const IconComponent = config.icon;
                      const CustomizationComponent = config.component;
                      const value = options[config.key];
                      const error = errors[config.key];
                      const currentSelection = formatWorkoutSelection(
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
                                  "How energetic are you feeling today? (Optional)"}
                                {config.key === "customization_stress" &&
                                  "What's your current stress level? (Optional)"}
                                {config.key === "customization_soreness" &&
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
});

export default WorkoutCustomization;
