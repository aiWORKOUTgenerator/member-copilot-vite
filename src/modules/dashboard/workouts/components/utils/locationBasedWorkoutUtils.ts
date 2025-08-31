import { useAllEquipment, useDefaultLocation } from '@/hooks/useLocation';
import { Equipment } from '@/domain/entities';

/**
 * Hook to get equipment options based on user's location
 * This replaces static equipment options with dynamic location-based options
 */
export function useLocationBasedEquipmentOptions() {
  const allEquipment = useAllEquipment();
  const defaultLocation = useDefaultLocation();

  // Transform location equipment into workout customization options
  const locationEquipmentOptions = allEquipment
    .filter((equipment) => equipment.is_active) // Only show active equipment
    .map((equipment) => ({
      id: equipment.category, // Use category as ID for consistency
      title: equipment.zone,
      description: equipment.description,
      directions: equipment.directions,
      exerciseTypes: equipment.exercise_types,
      equipmentList: equipment.equipment_list,
      category: equipment.category,
    }));

  // Add fallback options for when no location data is available
  const fallbackOptions = [
    {
      id: 'bodyweight',
      title: 'Body Weight',
      description: 'No equipment needed',
    },
    {
      id: 'available_equipment',
      title: 'Available Equipment',
      description: 'Use what you have',
    },
    {
      id: 'full_gym',
      title: 'Full Gym',
      description: 'All equipment available',
    },
  ];

  // Return location-based options if available, otherwise fallback
  const equipmentOptions =
    locationEquipmentOptions.length > 0
      ? locationEquipmentOptions
      : fallbackOptions;

  return {
    equipmentOptions,
    hasLocationData: locationEquipmentOptions.length > 0,
    defaultLocation,
    allEquipment,
  };
}

/**
 * Utility to filter equipment by exercise type
 */
export function filterEquipmentByExerciseType(
  equipment: Equipment[],
  exerciseType: string
): Equipment[] {
  return equipment.filter(
    (eq) => eq.is_active && eq.exercise_types.includes(exerciseType)
  );
}

/**
 * Utility to get equipment categories available at location
 */
export function getAvailableEquipmentCategories(
  equipment: Equipment[]
): string[] {
  return [
    ...new Set(equipment.filter((eq) => eq.is_active).map((eq) => eq.category)),
  ];
}

/**
 * Utility to create workout params with location equipment
 */
export function createWorkoutParamsWithLocation(
  baseParams: Record<string, unknown>,
  selectedEquipment: string[],
  allEquipment: Equipment[]
): Record<string, unknown> {
  // Filter equipment to only include active equipment from user's location
  const availableEquipment = allEquipment.filter((eq) => eq.is_active);

  // Map selected equipment categories to actual equipment items
  const equipmentItems = selectedEquipment.flatMap((category) => {
    const categoryEquipment = availableEquipment.filter(
      (eq) => eq.category === category
    );
    return categoryEquipment.flatMap((eq) => eq.equipment_list);
  });

  return {
    ...baseParams,
    available_equipment: equipmentItems,
    equipment_categories: selectedEquipment,
    location_equipment_count: availableEquipment.length,
  };
}
