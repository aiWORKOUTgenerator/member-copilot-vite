import { Location } from '@/domain/entities';

export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  hasWeight: boolean;
  weight?: number; // Specific weight for this item
  defaultWeightRange?: { min: number; max: number };
  weightIncrements?: number[];
  availableWeights?: number[]; // For grouped equipment
}

export interface EquipmentZone {
  id: string;
  name: string;
  description: string;
  equipment: EquipmentItem[];
}

export function transformLocationToEquipmentZones(
  locations: Location[]
): EquipmentZone[] {
  return locations.map((location) => ({
    id: location.id || 'default',
    name: location.name,
    description: `Equipment available at ${location.name}`,
    equipment: location.equipment
      .filter((eq) => eq.is_active)
      .flatMap((equipment) => {
        // Group equipment by type and handle weights
        const equipmentGroups = groupEquipmentByType(equipment.equipment_list);

        return equipmentGroups.map((group, index) => ({
          id: `${equipment.id}-${index}`,
          name: group.name,
          category: formatCategory(equipment.category),
          hasWeight: group.hasWeight,
          weight: group.weight,
          defaultWeightRange: group.defaultWeightRange,
          weightIncrements: group.weightIncrements,
          availableWeights: group.availableWeights,
        }));
      }),
  }));
}

interface EquipmentGroup {
  name: string;
  hasWeight: boolean;
  weight?: number;
  defaultWeightRange?: { min: number; max: number };
  weightIncrements?: number[];
  availableWeights?: number[];
}

function groupEquipmentByType(equipmentList: string[]): EquipmentGroup[] {
  const groups: Record<string, EquipmentGroup> = {};

  equipmentList.forEach((equipmentName) => {
    const { baseName, weight } = parseEquipmentName(equipmentName);

    if (!groups[baseName]) {
      // Create new group
      groups[baseName] = {
        name: baseName,
        hasWeight: weight !== null,
        weight: weight || undefined,
        defaultWeightRange: weight ? { min: weight, max: weight } : undefined,
        weightIncrements: weight ? [weight] : undefined,
        availableWeights: weight ? [weight] : undefined,
      };
    } else {
      // Add weight to existing group
      if (weight !== null) {
        const group = groups[baseName];
        group.hasWeight = true;

        if (!group.availableWeights) {
          group.availableWeights = [];
        }
        group.availableWeights.push(weight);

        // Update weight range
        const weights = group.availableWeights.sort((a, b) => a - b);
        group.defaultWeightRange = {
          min: weights[0],
          max: weights[weights.length - 1],
        };
        group.weightIncrements = weights;
      }
    }
  });

  return Object.values(groups);
}

// Extract regex pattern to constant to avoid duplication
const WEIGHT_PATTERN = /(.+?)\s*-\s*(\d+(?:\.\d+)?)\s*lbs?$/i;

function parseEquipmentName(equipmentName: string): {
  baseName: string;
  weight: number | null;
} {
  // Handle patterns like "Dumbbells - 5 lbs", "Kettlebells - 10 lbs", "Olympic Barbell - 45 lbs", etc.
  const match = equipmentName.match(WEIGHT_PATTERN);
  if (match) {
    const baseName = match[1].trim();
    const weight = parseFloat(match[2]);
    return { baseName, weight };
  }

  // No weight specified
  return { baseName: equipmentName, weight: null };
}

function formatCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    free_weights: 'Free Weights',
    cardio: 'Cardio',
    cable_machines: 'Cable Machines',
    bodyweight: 'Bodyweight',
    machines: 'Machines',
    accessories: 'Accessories',
  };

  return categoryMap[category] || category;
}
