/**
 * Equipment entity representing gym equipment available at a location
 */
export interface Equipment {
  id: string;
  zone: string;
  description: string;
  directions: string;
  exercise_types: string[];
  equipment_list: string[];
  category: string;
  is_active: boolean;
}

/**
 * Type guard to check if an object is valid Equipment
 */
export function isEquipment(obj: unknown): obj is Equipment {
  return !!(
    obj &&
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'zone' in obj &&
    'description' in obj &&
    'directions' in obj &&
    'exercise_types' in obj &&
    'equipment_list' in obj &&
    'category' in obj &&
    'is_active' in obj &&
    typeof (obj as Equipment).id === 'string' &&
    typeof (obj as Equipment).zone === 'string' &&
    typeof (obj as Equipment).description === 'string' &&
    typeof (obj as Equipment).directions === 'string' &&
    Array.isArray((obj as Equipment).exercise_types) &&
    (obj as Equipment).exercise_types.every(
      (type) => typeof type === 'string'
    ) &&
    Array.isArray((obj as Equipment).equipment_list) &&
    (obj as Equipment).equipment_list.every(
      (item) => typeof item === 'string'
    ) &&
    typeof (obj as Equipment).category === 'string' &&
    typeof (obj as Equipment).is_active === 'boolean'
  );
}

/**
 * Helper functions for equipment operations
 */
export const EquipmentUtils = {
  /**
   * Filter equipment by exercise type
   */
  filterByExerciseType(
    equipment: Equipment[],
    exerciseType: string
  ): Equipment[] {
    return equipment.filter(
      (item) => item.exercise_types.includes(exerciseType) && item.is_active
    );
  },

  /**
   * Filter equipment by category
   */
  filterByCategory(equipment: Equipment[], category: string): Equipment[] {
    return equipment.filter(
      (item) => item.category === category && item.is_active
    );
  },

  /**
   * Get all unique categories from equipment list
   */
  getUniqueCategories(equipment: Equipment[]): string[] {
    return [...new Set(equipment.map((item) => item.category))];
  },

  /**
   * Get all unique exercise types from equipment list
   */
  getUniqueExerciseTypes(equipment: Equipment[]): string[] {
    return [...new Set(equipment.flatMap((item) => item.exercise_types))];
  },
};
