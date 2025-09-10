/**
 * Instructor and time pairing for class schedules
 */
export interface InstructorTime {
  name: string;
  time: string;
}

/**
 * Class Schedule entity representing scheduled classes at a location
 */
export interface ClassSchedule {
  id: string;
  name: string;
  description: string;
  /** Instructor names with their specific times */
  times_with_instructors: InstructorTime[];
  workout_type: string;
  frequency: string;
  is_active: boolean;
}

/**
 * Class Schedule with location information for UI display
 */
export interface ClassScheduleWithLocation extends ClassSchedule {
  /** Location information */
  location: {
    id: string | null;
    name: string;
  };
}

/**
 * Type guard to check if an object is valid ClassSchedule
 */
export function isClassSchedule(obj: unknown): obj is ClassSchedule {
  if (
    !(
      obj &&
      typeof obj === 'object' &&
      obj !== null &&
      'id' in obj &&
      'name' in obj &&
      'description' in obj &&
      'times_with_instructors' in obj &&
      'workout_type' in obj &&
      'frequency' in obj &&
      'is_active' in obj &&
      typeof (obj as ClassSchedule).id === 'string' &&
      typeof (obj as ClassSchedule).name === 'string' &&
      typeof (obj as ClassSchedule).description === 'string' &&
      typeof (obj as ClassSchedule).workout_type === 'string' &&
      typeof (obj as ClassSchedule).frequency === 'string' &&
      typeof (obj as ClassSchedule).is_active === 'boolean'
    )
  ) {
    return false;
  }

  const schedule = obj as ClassSchedule;

  // Validate times_with_instructors format
  return (
    Array.isArray(schedule.times_with_instructors) &&
    schedule.times_with_instructors.every(
      (item) =>
        item &&
        typeof item === 'object' &&
        typeof item.name === 'string' &&
        typeof item.time === 'string'
    )
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
    return schedules.filter((schedule) => {
      if (!schedule.is_active) return false;

      return schedule.times_with_instructors.some(
        (item) => item.name === instructorName
      );
    });
  },

  /**
   * Get all unique instructors from schedules
   */
  getUniqueInstructors(schedules: ClassSchedule[]): string[] {
    const instructors = new Set<string>();

    schedules.forEach((schedule) => {
      schedule.times_with_instructors.forEach((item) => {
        instructors.add(item.name);
      });
    });

    return Array.from(instructors);
  },

  /**
   * Get all instructor-time pairs for a schedule
   */
  getInstructorTimes(schedule: ClassSchedule): InstructorTime[] {
    return schedule.times_with_instructors;
  },

  /**
   * Get all unique times from schedules
   */
  getUniqueTimes(schedules: ClassSchedule[]): string[] {
    const times = new Set<string>();

    schedules.forEach((schedule) => {
      schedule.times_with_instructors.forEach((item) => {
        times.add(item.time);
      });
    });

    return Array.from(times);
  },

  /**
   * Get all unique locations from schedules with location info
   */
  getUniqueLocations(
    schedules: ClassScheduleWithLocation[]
  ): Array<{ id: string | null; name: string }> {
    const locationMap = new Map<string, { id: string | null; name: string }>();

    schedules.forEach((schedule) => {
      const key = schedule.location.id || 'default';
      if (!locationMap.has(key)) {
        locationMap.set(key, schedule.location);
      }
    });

    return Array.from(locationMap.values());
  },

  /**
   * Filter schedules by location
   */
  filterByLocation(
    schedules: ClassScheduleWithLocation[],
    locationId: string | null
  ): ClassScheduleWithLocation[] {
    return schedules.filter((schedule) => {
      if (!schedule.is_active) return false;
      return schedule.location.id === locationId;
    });
  },
};
