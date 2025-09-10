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
  /** @deprecated Use times_with_instructors instead */
  instructor_names: string[];
  /** @deprecated Use times_with_instructors instead */
  times: string[];
  /** New field combining instructor names with their specific times */
  times_with_instructors?: InstructorTime[];
  workout_type: string;
  frequency: string;
  is_active: boolean;
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

  // Check for new format first
  if (schedule.times_with_instructors) {
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

  // Fall back to legacy format validation
  return (
    'instructor_names' in schedule &&
    'times' in schedule &&
    Array.isArray(schedule.instructor_names) &&
    schedule.instructor_names.every((name) => typeof name === 'string') &&
    Array.isArray(schedule.times) &&
    schedule.times.every((time) => typeof time === 'string')
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
   * Get schedules by instructor (supports both new and legacy formats)
   */
  filterByInstructor(
    schedules: ClassSchedule[],
    instructorName: string
  ): ClassSchedule[] {
    return schedules.filter((schedule) => {
      if (!schedule.is_active) return false;

      // Use new format if available
      if (schedule.times_with_instructors) {
        return schedule.times_with_instructors.some(
          (item) => item.name === instructorName
        );
      }

      // Fall back to legacy format
      return schedule.instructor_names.includes(instructorName);
    });
  },

  /**
   * Get all unique instructors from schedules (supports both new and legacy formats)
   */
  getUniqueInstructors(schedules: ClassSchedule[]): string[] {
    const instructors = new Set<string>();

    schedules.forEach((schedule) => {
      // Use new format if available
      if (schedule.times_with_instructors) {
        schedule.times_with_instructors.forEach((item) => {
          instructors.add(item.name);
        });
      } else {
        // Fall back to legacy format
        schedule.instructor_names.forEach((name) => {
          instructors.add(name);
        });
      }
    });

    return Array.from(instructors);
  },

  /**
   * Get all instructor-time pairs for a schedule
   */
  getInstructorTimes(schedule: ClassSchedule): InstructorTime[] {
    // Use new format if available
    if (schedule.times_with_instructors) {
      return schedule.times_with_instructors;
    }

    // Fall back to legacy format - create pairs from separate arrays
    const pairs: InstructorTime[] = [];
    const instructorCount = schedule.instructor_names.length;
    const timeCount = schedule.times.length;

    // If we have equal arrays, pair them up
    if (instructorCount === timeCount) {
      for (let i = 0; i < instructorCount; i++) {
        pairs.push({
          name: schedule.instructor_names[i],
          time: schedule.times[i],
        });
      }
    } else {
      // If arrays don't match, create all combinations
      schedule.instructor_names.forEach((instructor) => {
        schedule.times.forEach((time) => {
          pairs.push({ name: instructor, time });
        });
      });
    }

    return pairs;
  },

  /**
   * Get all unique times from schedules (supports both new and legacy formats)
   */
  getUniqueTimes(schedules: ClassSchedule[]): string[] {
    const times = new Set<string>();

    schedules.forEach((schedule) => {
      // Use new format if available
      if (schedule.times_with_instructors) {
        schedule.times_with_instructors.forEach((item) => {
          times.add(item.time);
        });
      } else {
        // Fall back to legacy format
        schedule.times.forEach((time) => {
          times.add(time);
        });
      }
    });

    return Array.from(times);
  },
};
