import { CategoryRatingData, HierarchicalSelectionData, DurationConfigurationData, WorkoutFocusConfigurationData, CustomizationConfig } from "../types";
import { isWorkoutFocusConfigurationData, safeConcat } from "./validation";

// Helper function to convert rating numbers to standardized labels
export const getRatingLabel = (rating: number): string => {
  const labels = ["", "Mild", "Low-Moderate", "Moderate", "High", "Severe"];
  return labels[rating] || "Unknown";
};

// Helper function to analyze hierarchical selection data
export const analyzeHierarchicalSelection = (data: HierarchicalSelectionData) => {
  const selectedEntries = Object.entries(data).filter(([, info]) => info.selected);
  const primarySelections = selectedEntries.filter(([, info]) => info.level === 'primary');
  const secondarySelections = selectedEntries.filter(([, info]) => info.level === 'secondary');
  const tertiarySelections = selectedEntries.filter(([, info]) => info.level === 'tertiary');
  
  return {
    total: selectedEntries.length,
    primary: primarySelections,
    secondary: secondarySelections,
    tertiary: tertiarySelections,
    selectedEntries
  };
};

// Main function to format current selection for display - extracted from WorkoutCustomization
export const formatWorkoutSelection = (
  config: CustomizationConfig,
  value: unknown
): string | null => {
  if (!value) return null;

  switch (config.key) {
    case "customization_duration": {
      // Handle both simple number and enhanced DurationConfigurationData
      if (typeof value === 'number') {
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
      } else {
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
    }

    case "customization_areas": {
      // Handle both simple string[] and enhanced HierarchicalSelectionData
      if (Array.isArray(value)) {
        const areas = value as string[];
        if (areas.length === 0) return null;
        if (areas.length === 1) {
          return areas[0]
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
        }
        return `${areas.length} areas`;
      } else {
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
          const [, info] = analysis.selectedEntries[0];
          if (info.parentKey && hierarchicalData[info.parentKey]) {
            return `${hierarchicalData[info.parentKey].label} > ${info.label}`;
          }
          return info.label;
        }
        
        // For multiple selections, show intelligent summary
        if (analysis.primary.length > 0) {
          const primaryNames = analysis.primary.map(([, info]) => info.label);
          if (analysis.total === analysis.primary.length) {
            return primaryNames.join(", ");
          }
          return `${primaryNames.join(", ")} + ${analysis.total - analysis.primary.length} specific`;
        }
        
        // All secondary/tertiary selections
        return `${analysis.total} specific areas`;
      }
    }

    case "customization_equipment": {
      // Handle both legacy format (string[]) and new format (EquipmentSelectionData)
      if (Array.isArray(value)) {
        // Legacy format
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
      } else {
        // New format (EquipmentSelectionData)
        const equipmentData = value as { location?: string; contexts: string[]; specificEquipment: string[]; weights?: { [key: string]: number[] } };
        if (!equipmentData || (!equipmentData.location && equipmentData.contexts.length === 0 && equipmentData.specificEquipment.length === 0 && (!equipmentData.weights || Object.keys(equipmentData.weights).length === 0))) {
          return null;
        }
        
        // Check if weights are specified
        const hasWeights = equipmentData.weights && Object.keys(equipmentData.weights).some(key => equipmentData.weights![key].length > 0);
        
        if (equipmentData.location && equipmentData.contexts.length === 0) {
          // Only location selected
          const locationLabels = {
            home: "Home",
            home_gym: "Home Gym", 
            gym: "Gym",
            hotel: "Hotel",
            park: "Park",
            corporate_gym: "Corporate Gym",
            athletic_club: "Athletic Club"
          };
          return locationLabels[equipmentData.location as keyof typeof locationLabels] || equipmentData.location;
        }
        
        if (equipmentData.contexts.length === 1) {
          return hasWeights ? `${equipmentData.contexts[0]} + weights` : equipmentData.contexts[0];
        }
        
        if (equipmentData.contexts.length > 1) {
          return hasWeights ? `${equipmentData.contexts.length} types + weights` : `${equipmentData.contexts.length} types`;
        }
        
        if (equipmentData.specificEquipment.length > 0) {
          return hasWeights ? `${equipmentData.specificEquipment.length} items + weights` : `${equipmentData.specificEquipment.length} items`;
        }
        
        if (hasWeights) {
          return "Equipment with weights";
        }
        
        return "Equipment selected";
      }
    }

    case "customization_soreness": {
      const categoryData = value as CategoryRatingData;
      if (!categoryData) return null;
      const selectedEntries = Object.entries(categoryData).filter(([, info]) => info.selected);
      if (selectedEntries.length === 0) return null;
      if (selectedEntries.length === 1) {
        const [, info] = selectedEntries[0];
        return `${info.label}${info.rating ? ` (${getRatingLabel(info.rating)})` : ''}`;
      }
      return `${selectedEntries.length} areas`;
    }

    case "customization_focus": {
      // Handle both simple string and enhanced WorkoutFocusConfigurationData
      if (typeof value === 'string') {
        const focus = value as string;
        return focus
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
      } else {
        // Validate configuration data
        if (!isWorkoutFocusConfigurationData(value)) return null;
        
        const focusData = value;
        if (!focusData.selected) return null;
        
        // For focus-only configuration, show simple label
        if (focusData.configuration === 'focus-only') {
          return focusData.focusLabel;
        }
        
        // For focus-with-format, show enhanced label with format indicator
        if (focusData.configuration === 'focus-with-format' && focusData.format) {
          // Add intensity indicator for advanced configurations
          const intensityIndicator = focusData.metadata?.intensity === 'high' ? ' 🔥' : 
                                   focusData.metadata?.intensity === 'low' ? ' 🌱' : '';
          return safeConcat(focusData.label, intensityIndicator);
        }
        
        return focusData.label;
      }
    }

    case "customization_include": {
      // Handle new object format
      if (typeof value === 'object' && value !== null && 'customExercises' in value) {
        const exerciseData = value as { customExercises: string; libraryExercises: string[] };
        const customCount = exerciseData.customExercises
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e.length > 0).length;
        const libraryCount = exerciseData.libraryExercises.length;
        const totalCount = customCount + libraryCount;
        
        if (totalCount === 0) return null;
        if (totalCount === 1) {
          // Show the single exercise name
          if (customCount === 1) {
            return exerciseData.customExercises.trim();
          } else {
            return exerciseData.libraryExercises[0];
          }
        }
        return `${totalCount} exercises`;
      }
      
      // Handle legacy string format
      if (typeof value === 'string') {
        const exerciseList = value
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e.length > 0);
        if (exerciseList.length === 0) return null;
        if (exerciseList.length === 1) {
          return exerciseList[0];
        }
        return `${exerciseList.length} exercises`;
      }
      
      return null;
    }

    case "customization_exclude": {
      // Handle new object format
      if (typeof value === 'object' && value !== null && 'customExercises' in value) {
        const exerciseData = value as { customExercises: string; libraryExercises: string[] };
        const customCount = exerciseData.customExercises
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e.length > 0).length;
        const libraryCount = exerciseData.libraryExercises.length;
        const totalCount = customCount + libraryCount;
        
        if (totalCount === 0) return null;
        if (totalCount === 1) {
          // Show the single exercise name
          if (customCount === 1) {
            return exerciseData.customExercises.trim();
          } else {
            return exerciseData.libraryExercises[0];
          }
        }
        return `${totalCount} exercises`;
      }
      
      // Handle legacy string format
      if (typeof value === 'string') {
        const exerciseList = value
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e.length > 0);
        if (exerciseList.length === 0) return null;
        if (exerciseList.length === 1) {
          return exerciseList[0];
        }
        return `${exerciseList.length} exercises`;
      }
      
      return null;
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
      const selectedEntries = Object.entries(categoryData).filter(([, info]) => info.selected);
      if (selectedEntries.length === 0) return null;
      if (selectedEntries.length === 1) {
        const [, info] = selectedEntries[0];
        return `${info.label}${info.rating ? ` (${getRatingLabel(info.rating)})` : ''}`;
      }
      return `${selectedEntries.length} categories`;
    }

    default:
      return String(value);
  }
};

// Get human-readable description for each customization type
export const getCustomizationDescription = (key: keyof typeof customizationDescriptions): string => {
  return customizationDescriptions[key] || "";
};

const customizationDescriptions = {
  customization_duration: "Workout length including warm-up and cool-down",
  customization_areas: "Body parts and workout types to focus on",
  customization_focus: "Main goal and training style for this workout",
  customization_equipment: "Available equipment and workout location",
  customization_include: "Exercises you want included in your workout",
  customization_exclude: "Exercises to avoid in your workout",
  customization_sleep: "Your sleep quality from last night",
  customization_energy: "Current energy level",
  customization_stress: "Current stress levels by category",
  customization_soreness: "Areas of current muscle soreness",
} as const; 