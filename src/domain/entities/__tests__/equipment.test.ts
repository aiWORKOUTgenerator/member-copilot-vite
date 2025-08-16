import { describe, it, expect } from 'vitest';
import { Equipment, isEquipment, EquipmentUtils } from '../equipment';

describe('Equipment', () => {
  const mockEquipment: Equipment = {
    id: '01J2XY3ABCD1234567EFGH890',
    zone: 'Free Weights Area',
    description: 'Dumbbells 5–100 lbs, benches, squat racks',
    directions: 'West wall near mirrors',
    exercise_types: ['strength', 'hypertrophy'],
    equipment_list: ['bench', 'dumbbells', 'rack'],
    category: 'free_weights',
    is_active: true,
  };

  const mockInactiveEquipment: Equipment = {
    ...mockEquipment,
    id: '01J2XY3EFGH1234567IJKL890',
    zone: 'Cardio Section',
    category: 'cardio',
    exercise_types: ['cardio'],
    is_active: false,
  };

  const mockCardioEquipment: Equipment = {
    id: '01J2XY3MNOP1234567QRST890',
    zone: 'Cardio Section',
    description: 'Treadmills, ellipticals, stationary bikes',
    directions: 'Central area near entrance',
    exercise_types: ['cardio', 'endurance'],
    equipment_list: ['treadmill', 'elliptical', 'bike'],
    category: 'cardio',
    is_active: true,
  };

  describe('isEquipment', () => {
    it('returns true for valid equipment object', () => {
      expect(isEquipment(mockEquipment)).toBe(true);
    });

    it('returns false for null', () => {
      expect(isEquipment(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isEquipment(undefined)).toBe(false);
    });

    it('returns false for object missing required fields', () => {
      const invalidEquipment = {
        id: 'test',
        zone: 'test',
        // missing other required fields
      };
      expect(isEquipment(invalidEquipment)).toBe(false);
    });

    it('returns false for object with wrong types', () => {
      const invalidEquipment = {
        ...mockEquipment,
        is_active: 'true', // should be boolean
      };
      expect(isEquipment(invalidEquipment)).toBe(false);
    });

    it('returns false when exercise_types is not an array', () => {
      const invalidEquipment = {
        ...mockEquipment,
        exercise_types: 'strength',
      };
      expect(isEquipment(invalidEquipment)).toBe(false);
    });

    it('returns false when equipment_list contains non-strings', () => {
      const invalidEquipment = {
        ...mockEquipment,
        equipment_list: ['bench', 123, 'rack'],
      };
      expect(isEquipment(invalidEquipment)).toBe(false);
    });
  });

  describe('EquipmentUtils', () => {
    const equipmentList = [
      mockEquipment,
      mockInactiveEquipment,
      mockCardioEquipment,
    ];

    describe('filterByExerciseType', () => {
      it('filters equipment by exercise type and active status', () => {
        const strengthEquipment = EquipmentUtils.filterByExerciseType(
          equipmentList,
          'strength'
        );
        expect(strengthEquipment).toHaveLength(1);
        expect(strengthEquipment[0].id).toBe(mockEquipment.id);
      });

      it('returns empty array when no equipment matches exercise type', () => {
        const yogaEquipment = EquipmentUtils.filterByExerciseType(
          equipmentList,
          'yoga'
        );
        expect(yogaEquipment).toHaveLength(0);
      });

      it('excludes inactive equipment', () => {
        const cardioEquipment = EquipmentUtils.filterByExerciseType(
          equipmentList,
          'cardio'
        );
        expect(cardioEquipment).toHaveLength(1);
        expect(cardioEquipment[0].id).toBe(mockCardioEquipment.id);
      });
    });

    describe('filterByCategory', () => {
      it('filters equipment by category and active status', () => {
        const freeWeights = EquipmentUtils.filterByCategory(
          equipmentList,
          'free_weights'
        );
        expect(freeWeights).toHaveLength(1);
        expect(freeWeights[0].id).toBe(mockEquipment.id);
      });

      it('excludes inactive equipment', () => {
        const cardio = EquipmentUtils.filterByCategory(equipmentList, 'cardio');
        expect(cardio).toHaveLength(1);
        expect(cardio[0].id).toBe(mockCardioEquipment.id);
      });

      it('returns empty array when no equipment matches category', () => {
        const machines = EquipmentUtils.filterByCategory(
          equipmentList,
          'machines'
        );
        expect(machines).toHaveLength(0);
      });
    });

    describe('getUniqueCategories', () => {
      it('returns all unique categories', () => {
        const categories = EquipmentUtils.getUniqueCategories(equipmentList);
        expect(categories).toContain('free_weights');
        expect(categories).toContain('cardio');
        expect(categories).toHaveLength(2);
      });

      it('returns empty array for empty equipment list', () => {
        const categories = EquipmentUtils.getUniqueCategories([]);
        expect(categories).toHaveLength(0);
      });
    });

    describe('getUniqueExerciseTypes', () => {
      it('returns all unique exercise types', () => {
        const exerciseTypes =
          EquipmentUtils.getUniqueExerciseTypes(equipmentList);
        expect(exerciseTypes).toContain('strength');
        expect(exerciseTypes).toContain('hypertrophy');
        expect(exerciseTypes).toContain('cardio');
        expect(exerciseTypes).toContain('endurance');
        expect(exerciseTypes).toHaveLength(4);
      });

      it('returns empty array for empty equipment list', () => {
        const exerciseTypes = EquipmentUtils.getUniqueExerciseTypes([]);
        expect(exerciseTypes).toHaveLength(0);
      });
    });
  });
});
