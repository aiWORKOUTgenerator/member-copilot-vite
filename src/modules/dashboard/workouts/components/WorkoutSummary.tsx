import { Target, Eye } from "lucide-react";
import { PerWorkoutOptions, CategoryRatingData, HierarchicalSelectionData, DurationConfigurationData, WorkoutFocusConfigurationData } from "./types";
import { CUSTOMIZATION_CONFIG } from "./customizations";
import { formatWorkoutSelection, getRatingLabel } from "./utils/selectionFormatter";

interface WorkoutSummaryProps {
  options: PerWorkoutOptions;
  mode: "custom" | "quick";
}

// Group customizations logically for summary display
const SUMMARY_GROUPS = {
  "Workout Structure": ["customization_duration", "customization_focus", "customization_areas"],
  "Equipment & Environment": ["customization_equipment"],
  "Your Current State": ["customization_energy", "customization_sleep", "customization_soreness", "customization_stress"],
  "Exercise Preferences": ["customization_include", "customization_exclude"]
} as const;

export default function WorkoutSummary({
  options,
  mode
}: WorkoutSummaryProps) {
  // Get selected options (options that have values)
  const selectedOptions = Object.entries(options).filter(([, value]) => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return value > 0;
    if (typeof value === 'object' && value !== null) {
      // Handle complex objects - check if they have meaningful data
      if ('selected' in value) return value.selected;
      return Object.keys(value).length > 0;
    }
    return value !== undefined && value !== null;
  });

  // Extract individual selections as separate pill badges
  const extractIndividualSelections = (key: string, value: unknown): string[] => {
    if (!value) return [];

    switch (key) {
      case "customization_duration": {
        if (typeof value === 'number') {
          const duration = value as number;
          if (duration >= 60) {
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;
            if (minutes === 0) {
              return [`${hours} hour${hours > 1 ? "s" : ""}`];
            } else {
              return [`${hours}h ${minutes}m`];
            }
          }
          return [`${duration} min`];
        } else {
          const durationData = value as DurationConfigurationData;
          if (!durationData?.selected) return [];
          return [durationData.label];
        }
      }

      case "customization_areas": {
        if (Array.isArray(value)) {
          const areas = value as string[];
          return areas.map(area => 
            area.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
          );
        } else {
          const hierarchicalData = value as HierarchicalSelectionData;
          if (!hierarchicalData) return [];
          
          const selectedEntries = Object.entries(hierarchicalData).filter(([, info]) => info.selected);
          return selectedEntries.map(([, info]) => info.label);
        }
      }

      case "customization_equipment": {
        if (Array.isArray(value)) {
          const equipment = value as string[];
          return equipment.map(item => 
            item.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
          );
        } else {
          const equipmentData = value as { location?: string; contexts: string[]; specificEquipment: string[]; weights?: { [key: string]: number[] } };
          if (!equipmentData) return [];
          
          const selections: string[] = [];
          
          if (equipmentData.location) {
            const locationLabels = {
              home: "Home",
              home_gym: "Home Gym", 
              gym: "Gym",
              hotel: "Hotel",
              park: "Park",
              corporate_gym: "Corporate Gym",
              athletic_club: "Athletic Club"
            };
            selections.push(locationLabels[equipmentData.location as keyof typeof locationLabels] || equipmentData.location);
          }
          
          selections.push(...equipmentData.contexts);
          selections.push(...equipmentData.specificEquipment);
          
          // Add weights info if present
          const hasWeights = equipmentData.weights && Object.keys(equipmentData.weights).some(key => equipmentData.weights![key].length > 0);
          if (hasWeights) {
            selections.push("Weights Available");
          }
          
          return selections;
        }
      }

      case "customization_soreness":
      case "customization_stress": {
        const categoryData = value as CategoryRatingData;
        if (!categoryData) return [];
        const selectedEntries = Object.entries(categoryData).filter(([, info]) => info.selected);
        return selectedEntries.map(([, info]) => 
          `${info.label}${info.rating ? ` (${getRatingLabel(info.rating)})` : ''}`
        );
      }

      case "customization_focus": {
        if (typeof value === 'string') {
          const focus = value as string;
          return [focus.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())];
        } else {
          const focusData = value as WorkoutFocusConfigurationData;
          if (!focusData?.selected) return [];
          return [focusData.label];
        }
      }

      case "customization_include":
      case "customization_exclude": {
        // Handle new object format
        if (typeof value === 'object' && value !== null && 'customExercises' in value) {
          const exerciseData = value as { customExercises: string; libraryExercises: string[] };
          const customList = exerciseData.customExercises
            .split(",")
            .map((e) => e.trim())
            .filter((e) => e.length > 0);
          return [...customList, ...exerciseData.libraryExercises];
        }
        
        // Handle legacy string format
        if (typeof value === 'string') {
          const exerciseList = value
            .split(",")
            .map((e) => e.trim())
            .filter((e) => e.length > 0);
          return exerciseList;
        }
        
        return [];
      }

      case "customization_sleep": {
        const rating = value as number;
        const labels = ["", "Very Poor", "Poor", "Fair", "Good", "Excellent"];
        return [`${labels[rating]} (${rating}/5)`];
      }

      case "customization_energy": {
        const rating = value as number;
        const labels = ["", "Very Low", "Low", "Moderate", "High", "Very High"];
        return [`${labels[rating]} (${rating}/5)`];
      }

      default:
        return [String(value)];
    }
  };

  // Render individual customization summary with pill badges
  const renderCustomizationSummary = (key: string, value: unknown) => {
    const config = CUSTOMIZATION_CONFIG.find(c => c.key === key);
    if (!config || !value) return null;
    
    const individualSelections = extractIndividualSelections(key, value);
    if (individualSelections.length === 0) return null;
    
    const IconComponent = config.icon;
    
    return (
      <div key={key} className="flex items-start py-2 border-b border-base-200 last:border-b-0">
        <div className="flex items-start mr-3">
          <IconComponent className="w-4 h-4 mr-2 mt-0.5 text-base-content/70" />
          <div>
            <span className="text-sm font-medium">{config.label}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 flex-1">
          {individualSelections.map((selection, index) => (
            <span key={index} className="badge badge-primary badge-sm">
              {selection}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Render grouped sections
  const renderSummaryGroup = (groupName: string, keys: readonly string[]) => {
    const groupOptions = keys
      .map(key => [key, options[key as keyof PerWorkoutOptions]] as const)
      .filter(([, value]) => {
        if (typeof value === 'string') return value.trim().length > 0;
        if (typeof value === 'number') return value > 0;
        if (typeof value === 'object' && value !== null) {
          if ('selected' in value) return value.selected;
          return Object.keys(value).length > 0;
        }
        return value !== undefined && value !== null;
      });

    if (groupOptions.length === 0) return null;

    return (
      <div key={groupName} className="mb-4">
        <h5 className="text-xs font-semibold text-base-content/60 mb-2 uppercase tracking-wide">{groupName}</h5>
        <div className="bg-base-50 rounded-lg p-3">
          {groupOptions.map(([key, value]) => renderCustomizationSummary(key, value))}
        </div>
      </div>
    );
  };

  // Check if there are any customizations
  const hasCustomizations = selectedOptions.length > 0;

  // Don't render anything if no customizations
  if (!hasCustomizations) return null;

  return (
    <div className="mb-6">
      <div className="border border-base-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold mb-4 flex items-center text-base-content/80">
          <Eye className="w-4 h-4 mr-2" />
          Review Your Selections
          <span className="badge badge-outline badge-xs ml-2">
            {mode === "quick" ? "Quick" : "Custom"}
          </span>
        </h4>

        {/* Customizations Summary */}
        <div className="space-y-4">
          {Object.entries(SUMMARY_GROUPS).map(([groupName, keys]) => 
            renderSummaryGroup(groupName, keys)
          )}
        </div>

        {/* Quick preview of what will be sent */}
        <details className="collapse collapse-arrow bg-base-100 border border-base-200 mt-4">
          <summary className="collapse-title text-xs font-medium py-2">
            <span className="flex items-center">
              <Target className="w-3 h-3 mr-1" />
              Preview final prompt
            </span>
          </summary>
          <div className="collapse-content">
            <div className="mockup-code text-xs">
              {selectedOptions.map(([key, value]) => {
                const config = CUSTOMIZATION_CONFIG.find(c => c.key === key);
                const formatted = config ? formatWorkoutSelection(config, value) : String(value);
                return formatted && (
                  <pre key={key} data-prefix="•" className="text-success">
                    <code>{config?.label}: {formatted}</code>
                  </pre>
                );
              })}
            </div>
          </div>
        </details>
      </div>
    </div>
  );
} 