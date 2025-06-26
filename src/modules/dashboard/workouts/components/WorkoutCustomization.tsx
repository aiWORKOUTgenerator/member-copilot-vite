import { Target } from "lucide-react";
import { WorkoutCustomizationProps, CategoryRatingData, HierarchicalSelectionData, DurationConfigurationData, WorkoutFocusConfigurationData } from "./types";
import { CUSTOMIZATION_CONFIG } from "./customizations";
import { useState } from "react";

export default function WorkoutCustomization({
  options,
  onChange,
  errors,
  disabled = false,
  mode = "custom",
}: WorkoutCustomizationProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const handleChange = (
    key: keyof WorkoutCustomizationProps["options"],
    value: unknown
  ) => {
    onChange(key, value);
  };

  // Helper function to convert rating numbers to standardized labels
  const getRatingLabel = (rating: number): string => {
    const labels = ["", "Mild", "Low-Moderate", "Moderate", "High", "Severe"];
    return labels[rating] || "Unknown";
  };

  // Helper function to analyze hierarchical selection data
  const analyzeHierarchicalSelection = (data: HierarchicalSelectionData) => {
    const selectedEntries = Object.entries(data).filter(([_, info]) => info.selected);
    const primarySelections = selectedEntries.filter(([_, info]) => info.level === 'primary');
    const secondarySelections = selectedEntries.filter(([_, info]) => info.level === 'secondary');
    const tertiarySelections = selectedEntries.filter(([_, info]) => info.level === 'tertiary');
    
    return {
      total: selectedEntries.length,
      primary: primarySelections,
      secondary: secondarySelections,
      tertiary: tertiarySelections,
      selectedEntries
    };
  };

  // Helper function to format the current selection for display
  const formatCurrentSelection = (
    config: (typeof CUSTOMIZATION_CONFIG)[0],
    value: unknown
  ) => {
    if (!value) return null;

    switch (config.key) {
      case "customization_duration": {
        const durationData = value as DurationConfigurationData;
        if (!durationData?.selected) return null;
        
        // Simple case: duration only
        if (durationData.configuration === 'duration-only') {
          return durationData.label;
        }
        
        // Complex case: show structure summary with working time percentage
        const workingPercent = Math.round((durationData.workingTime / durationData.totalDuration) * 100);
        return `${durationData.label} (${workingPercent}% active)`;
      }

      case "customization_areas": {
        const hierarchicalData = value as HierarchicalSelectionData;
        if (!hierarchicalData) return null;
        
        const analysis = analyzeHierarchicalSelection(hierarchicalData);
        if (analysis.total === 0) return null;
        
        // For single primary selection, show the primary name
        if (analysis.primary.length === 1 && analysis.total === 1) {
          return analysis.primary[0][1].label;
        }
        
        // For single secondary/tertiary with context, show "Primary > Secondary" format
        if (analysis.total === 1) {
          const [_, info] = analysis.selectedEntries[0];
          if (info.parentKey && hierarchicalData[info.parentKey]) {
            return `${hierarchicalData[info.parentKey].label} > ${info.label}`;
          }
          return info.label;
        }
        
        // For multiple selections, show intelligent summary
        if (analysis.primary.length > 0) {
          const primaryNames = analysis.primary.map(([_, info]) => info.label);
          if (analysis.total === analysis.primary.length) {
            return primaryNames.join(", ");
          }
          return `${primaryNames.join(", ")} + ${analysis.total - analysis.primary.length} specific`;
        }
        
        // All secondary/tertiary selections
        return `${analysis.total} specific areas`;
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
        const categoryData = value as CategoryRatingData;
        if (!categoryData) return null;
        const selectedEntries = Object.entries(categoryData).filter(([_, info]) => info.selected);
        if (selectedEntries.length === 0) return null;
        if (selectedEntries.length === 1) {
          const [_, info] = selectedEntries[0];
          return `${info.label}${info.rating ? ` (${getRatingLabel(info.rating)})` : ''}`;
        }
        return `${selectedEntries.length} areas`;
      }

      case "customization_focus": {
        const focusData = value as WorkoutFocusConfigurationData;
        if (!focusData?.selected) return null;
        
        // For focus-only configuration, show simple label
        if (focusData.configuration === 'focus-only') {
          return focusData.focusLabel;
        }
        
        // For focus-with-format, show enhanced label with format indicator
        if (focusData.configuration === 'focus-with-format' && focusData.format) {
          // Add intensity indicator for advanced configurations
          const intensityIndicator = focusData.metadata?.intensity === 'high' ? ' 🔥' : 
                                   focusData.metadata?.intensity === 'low' ? ' 🌱' : '';
          return `${focusData.label}${intensityIndicator}`;
        }
        
        return focusData.label;
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
        const categoryData = value as CategoryRatingData;
        if (!categoryData) return null;
        const selectedEntries = Object.entries(categoryData).filter(([_, info]) => info.selected);
        if (selectedEntries.length === 0) return null;
        if (selectedEntries.length === 1) {
          const [_, info] = selectedEntries[0];
          return `${info.label}${info.rating ? ` (${getRatingLabel(info.rating)})` : ''}`;
        }
        return `${selectedEntries.length} categories`;
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
}
