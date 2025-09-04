import { Location } from '@/domain/entities';

// Extract regex pattern to constant to avoid duplication
const WEIGHT_PATTERN = /(.+?)\s*-\s*(\d+(?:\.\d+)?)\s*lbs?$/i;

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

/**
 * Validation error class for location data transformation
 */
export class LocationDataValidationError extends Error {
  constructor(
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'LocationDataValidationError';
  }
}

/**
 * Validate location data structure before transformation
 */
function validateLocationData(locations: Location[]): void {
  if (!Array.isArray(locations)) {
    throw new LocationDataValidationError('Locations must be an array');
  }

  locations.forEach((location, index) => {
    if (!location || typeof location !== 'object') {
      throw new LocationDataValidationError(
        `Location at index ${index} is not a valid object`
      );
    }

    if (!location.name || typeof location.name !== 'string') {
      throw new LocationDataValidationError(
        `Location at index ${index} must have a valid name string`
      );
    }

    if (!Array.isArray(location.equipment)) {
      throw new LocationDataValidationError(
        `Location at index ${index} must have an equipment array`
      );
    }

    location.equipment.forEach((equipment, eqIndex) => {
      if (!equipment || typeof equipment !== 'object') {
        throw new LocationDataValidationError(
          `Equipment at index ${eqIndex} in location ${index} is not a valid object`
        );
      }

      if (!Array.isArray(equipment.equipment_list)) {
        throw new LocationDataValidationError(
          `Equipment at index ${eqIndex} in location ${index} must have an equipment_list array`
        );
      }

      if (!equipment.category || typeof equipment.category !== 'string') {
        throw new LocationDataValidationError(
          `Equipment at index ${eqIndex} in location ${index} must have a valid category string`
        );
      }
    });
  });
}

export function transformLocationToEquipmentZones(
  locations: Location[]
): EquipmentZone[] {
  try {
    // Validate input data
    validateLocationData(locations);

    return locations.map((location) => ({
      id: location.id || 'default',
      name: location.name,
      description: `Equipment available at ${location.name}`,
      equipment: location.equipment
        .filter((eq) => eq.is_active)
        .flatMap((equipment) => {
          try {
            // Group equipment by type and handle weights
            const equipmentGroups = groupEquipmentByType(
              equipment.equipment_list
            );

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
          } catch (error) {
            console.warn(`Failed to process equipment ${equipment.id}:`, error);
            // Return a fallback equipment item instead of failing completely
            return [
              {
                id: `${equipment.id}-fallback`,
                name: equipment.category,
                category: formatCategory(equipment.category),
                hasWeight: false,
                weight: undefined,
                defaultWeightRange: undefined,
                weightIncrements: undefined,
                availableWeights: undefined,
              },
            ];
          }
        }),
    }));
  } catch (error) {
    console.error('Location data transformation failed:', error);

    // Return fallback zones instead of crashing
    return [
      {
        id: 'fallback',
        name: 'Equipment',
        description: 'Equipment selection is temporarily unavailable',
        equipment: [
          {
            id: 'fallback-equipment',
            name: 'General Equipment',
            category: 'Available',
            hasWeight: false,
            weight: undefined,
            defaultWeightRange: undefined,
            weightIncrements: undefined,
            availableWeights: undefined,
          },
        ],
      },
    ];
  }
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
  try {
    if (!Array.isArray(equipmentList)) {
      throw new LocationDataValidationError('Equipment list must be an array');
    }

    const groups: Record<string, EquipmentGroup> = {};

    equipmentList.forEach((equipmentName, index) => {
      try {
        if (typeof equipmentName !== 'string' || !equipmentName.trim()) {
          console.warn(
            `Skipping invalid equipment name at index ${index}:`,
            equipmentName
          );
          return;
        }

        const { baseName, weight } = parseEquipmentName(equipmentName);

        if (!groups[baseName]) {
          // Create new group
          groups[baseName] = {
            name: baseName,
            hasWeight: weight !== null,
            weight: weight || undefined,
            defaultWeightRange: weight
              ? { min: weight, max: weight }
              : undefined,
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
      } catch (error) {
        console.warn(
          `Failed to process equipment name at index ${index}:`,
          equipmentName,
          error
        );
        // Continue processing other equipment instead of failing completely
      }
    });

    return Object.values(groups);
  } catch (error) {
    console.error('Equipment grouping failed:', error);
    // Return fallback groups instead of crashing
    return [
      {
        name: 'General Equipment',
        hasWeight: false,
      },
    ];
  }
}

function parseEquipmentName(equipmentName: string): {
  baseName: string;
  weight: number | null;
} {
  try {
    if (typeof equipmentName !== 'string' || !equipmentName.trim()) {
      return { baseName: 'Unknown Equipment', weight: null };
    }

    // Handle patterns like "Dumbbells - 5 lbs", "Kettlebells - 10 lbs", "Olympic Barbell - 45 lbs", etc.
    const match = equipmentName.match(WEIGHT_PATTERN);
    if (match) {
      const baseName = match[1].trim();
      const weight = parseFloat(match[2]);

      // Validate parsed weight
      if (isNaN(weight) || weight < 0) {
        console.warn(
          `Invalid weight value in equipment name: ${equipmentName}`
        );
        return { baseName, weight: null };
      }

      return { baseName, weight };
    }

    // No weight specified
    return { baseName: equipmentName.trim(), weight: null };
  } catch (error) {
    console.warn(`Failed to parse equipment name: ${equipmentName}`, error);
    return { baseName: equipmentName || 'Unknown Equipment', weight: null };
  }
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
