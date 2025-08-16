/**
 * Class Schedule entity representing scheduled classes at a location
 */
export interface ClassSchedule {
  id: string;
  name: string;
  description: string;
  instructor_names: string[];
  times: string[];
  workout_type: string;
  frequency: string;
  is_active: boolean;
}

/**
 * Type guard to check if an object is valid ClassSchedule
 */
export function isClassSchedule(obj: unknown): obj is ClassSchedule {
  return !!(
    obj &&
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'description' in obj &&
    'instructor_names' in obj &&
    'times' in obj &&
    'workout_type' in obj &&
    'frequency' in obj &&
    'is_active' in obj &&
    typeof (obj as ClassSchedule).id === 'string' &&
    typeof (obj as ClassSchedule).name === 'string' &&
    typeof (obj as ClassSchedule).description === 'string' &&
    Array.isArray((obj as ClassSchedule).instructor_names) &&
    (obj as ClassSchedule).instructor_names.every(
      (name) => typeof name === 'string'
    ) &&
    Array.isArray((obj as ClassSchedule).times) &&
    (obj as ClassSchedule).times.every((time) => typeof time === 'string') &&
    typeof (obj as ClassSchedule).workout_type === 'string' &&
    typeof (obj as ClassSchedule).frequency === 'string' &&
    typeof (obj as ClassSchedule).is_active === 'boolean'
  );
}

/**
 * Helper functions for class schedule operations
 */
export const ClassScheduleUtils = {
  /**
   * Filter schedules by workout type
   */
  filterByWorkoutType(
    schedules: ClassSchedule[],
    workoutType: string
  ): ClassSchedule[] {
    return schedules.filter(
      (schedule) => schedule.workout_type === workoutType && schedule.is_active
    );
  },

  /**
   * Filter schedules by frequency
   */
  filterByFrequency(
    schedules: ClassSchedule[],
    frequency: string
  ): ClassSchedule[] {
    return schedules.filter(
      (schedule) => schedule.frequency === frequency && schedule.is_active
    );
  },

  /**
   * Get all unique workout types from schedules
   */
  getUniqueWorkoutTypes(schedules: ClassSchedule[]): string[] {
    return [...new Set(schedules.map((schedule) => schedule.workout_type))];
  },

  /**
   * Get schedules by instructor
   */
  filterByInstructor(
    schedules: ClassSchedule[],
    instructorName: string
  ): ClassSchedule[] {
    return schedules.filter(
      (schedule) =>
        schedule.instructor_names.includes(instructorName) && schedule.is_active
    );
  },

  /**
   * Get all unique instructors from schedules
   */
  getUniqueInstructors(schedules: ClassSchedule[]): string[] {
    return [
      ...new Set(schedules.flatMap((schedule) => schedule.instructor_names)),
    ];
  },
};
