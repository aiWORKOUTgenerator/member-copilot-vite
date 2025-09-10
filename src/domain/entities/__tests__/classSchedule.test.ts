import { describe, it, expect } from 'vitest';
import {
  ClassSchedule,
  isClassSchedule,
  ClassScheduleUtils,
} from '../classSchedule';

describe('ClassSchedule', () => {
  const mockClassSchedule: ClassSchedule = {
    id: '01J2XY3IJKL1234567MNOP890',
    name: 'Yoga Flow',
    description: 'Vinyasa-style class focusing on flexibility and breath',
    times_with_instructors: [{ name: 'Alex', time: 'Mon/Wed/Fri 6:00am' }],
    workout_type: 'yoga',
    frequency: 'weekly',
    is_active: true,
  };

  const mockInactiveSchedule: ClassSchedule = {
    ...mockClassSchedule,
    id: '01J2XY3UVWX1234567YZAB890',
    name: 'HIIT Training',
    workout_type: 'hiit',
    is_active: false,
  };

  const mockHiitSchedule: ClassSchedule = {
    id: '01J2XY3CDEF1234567GHIJ890',
    name: 'HIIT Bootcamp',
    description: 'High-intensity interval training for strength and cardio',
    times_with_instructors: [
      { name: 'Jordan', time: 'Tue/Thu 7:00pm' },
      { name: 'Sam', time: 'Sat 9:00am' },
    ],
    workout_type: 'hiit',
    frequency: 'weekly',
    is_active: true,
  };

  const mockPilatesSchedule: ClassSchedule = {
    id: '01J2XY3NEWF1234567ORMAT890',
    name: 'Pilates Plus',
    description: 'Core-focused pilates with strength training',
    times_with_instructors: [
      { name: 'Jenna S.', time: 'M/W 10am' },
      { name: 'Rick P.', time: 'Fri 7am' },
    ],
    workout_type: 'pilates',
    frequency: 'weekly',
    is_active: true,
  };

  describe('isClassSchedule', () => {
    it('returns true for valid class schedule object', () => {
      expect(isClassSchedule(mockClassSchedule)).toBe(true);
    });

    it('returns true for pilates schedule', () => {
      expect(isClassSchedule(mockPilatesSchedule)).toBe(true);
    });

    it('returns false for null', () => {
      expect(isClassSchedule(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isClassSchedule(undefined)).toBe(false);
    });

    it('returns false for object missing required fields', () => {
      const invalidSchedule = {
        id: 'test',
        name: 'test',
        // missing other required fields
      };
      expect(isClassSchedule(invalidSchedule)).toBe(false);
    });

    it('returns false for object with wrong types', () => {
      const invalidSchedule = {
        ...mockClassSchedule,
        is_active: 'true', // should be boolean
      };
      expect(isClassSchedule(invalidSchedule)).toBe(false);
    });

    it('returns false when times_with_instructors is not an array', () => {
      const invalidSchedule = {
        ...mockClassSchedule,
        times_with_instructors: 'invalid',
      };
      expect(isClassSchedule(invalidSchedule)).toBe(false);
    });

    it('returns false when times_with_instructors contains invalid objects', () => {
      const invalidSchedule = {
        ...mockClassSchedule,
        times_with_instructors: [{ name: 'Alex' }], // missing time
      };
      expect(isClassSchedule(invalidSchedule)).toBe(false);
    });
  });

  describe('ClassScheduleUtils', () => {
    const scheduleList = [
      mockClassSchedule,
      mockInactiveSchedule,
      mockHiitSchedule,
      mockPilatesSchedule,
    ];

    describe('filterByWorkoutType', () => {
      it('filters schedules by workout type and active status', () => {
        const yogaSchedules = ClassScheduleUtils.filterByWorkoutType(
          scheduleList,
          'yoga'
        );
        expect(yogaSchedules).toHaveLength(1);
        expect(yogaSchedules[0].id).toBe(mockClassSchedule.id);
      });

      it('excludes inactive schedules', () => {
        const hiitSchedules = ClassScheduleUtils.filterByWorkoutType(
          scheduleList,
          'hiit'
        );
        expect(hiitSchedules).toHaveLength(1);
        expect(hiitSchedules[0].id).toBe(mockHiitSchedule.id);
      });

      it('returns empty array when no schedules match workout type', () => {
        const crossfitSchedules = ClassScheduleUtils.filterByWorkoutType(
          scheduleList,
          'crossfit'
        );
        expect(crossfitSchedules).toHaveLength(0);
      });
    });

    describe('filterByFrequency', () => {
      it('filters schedules by frequency and active status', () => {
        const weeklySchedules = ClassScheduleUtils.filterByFrequency(
          scheduleList,
          'weekly'
        );
        expect(weeklySchedules).toHaveLength(3);
        expect(weeklySchedules).toContain(mockClassSchedule);
        expect(weeklySchedules).toContain(mockHiitSchedule);
        expect(weeklySchedules).toContain(mockPilatesSchedule);
      });

      it('returns empty array when no schedules match frequency', () => {
        const dailySchedules = ClassScheduleUtils.filterByFrequency(
          scheduleList,
          'daily'
        );
        expect(dailySchedules).toHaveLength(0);
      });
    });

    describe('getUniqueWorkoutTypes', () => {
      it('returns all unique workout types', () => {
        const workoutTypes =
          ClassScheduleUtils.getUniqueWorkoutTypes(scheduleList);
        expect(workoutTypes).toContain('yoga');
        expect(workoutTypes).toContain('hiit');
        expect(workoutTypes).toContain('pilates');
        expect(workoutTypes).toHaveLength(3);
      });

      it('returns empty array for empty schedule list', () => {
        const workoutTypes = ClassScheduleUtils.getUniqueWorkoutTypes([]);
        expect(workoutTypes).toHaveLength(0);
      });
    });

    describe('filterByInstructor', () => {
      it('filters schedules by instructor and active status', () => {
        const alexSchedules = ClassScheduleUtils.filterByInstructor(
          scheduleList,
          'Alex'
        );
        expect(alexSchedules).toHaveLength(1);
        expect(alexSchedules[0].id).toBe(mockClassSchedule.id);
      });

      it('finds schedules with multiple instructors', () => {
        const jordanSchedules = ClassScheduleUtils.filterByInstructor(
          scheduleList,
          'Jordan'
        );
        expect(jordanSchedules).toHaveLength(1);
        expect(jordanSchedules[0].id).toBe(mockHiitSchedule.id);
      });

      it('excludes inactive schedules', () => {
        const samSchedules = ClassScheduleUtils.filterByInstructor(
          scheduleList,
          'Sam'
        );
        expect(samSchedules).toHaveLength(1);
        expect(samSchedules[0].id).toBe(mockHiitSchedule.id);
      });

      it('returns empty array when no schedules match instructor', () => {
        const bobSchedules = ClassScheduleUtils.filterByInstructor(
          scheduleList,
          'Bob'
        );
        expect(bobSchedules).toHaveLength(0);
      });
    });

    describe('getUniqueInstructors', () => {
      it('returns all unique instructors', () => {
        const instructors =
          ClassScheduleUtils.getUniqueInstructors(scheduleList);
        expect(instructors).toContain('Alex');
        expect(instructors).toContain('Jordan');
        expect(instructors).toContain('Sam');
        expect(instructors).toContain('Jenna S.');
        expect(instructors).toContain('Rick P.');
        expect(instructors).toHaveLength(5);
      });

      it('returns empty array for empty schedule list', () => {
        const instructors = ClassScheduleUtils.getUniqueInstructors([]);
        expect(instructors).toHaveLength(0);
      });

      it('works with multiple schedules', () => {
        const scheduleListSubset = [mockPilatesSchedule, mockClassSchedule];
        const instructors =
          ClassScheduleUtils.getUniqueInstructors(scheduleListSubset);
        expect(instructors).toContain('Jenna S.');
        expect(instructors).toContain('Rick P.');
        expect(instructors).toContain('Alex');
        expect(instructors).toHaveLength(3);
      });
    });

    describe('getInstructorTimes', () => {
      it('returns instructor-time pairs from pilates schedule', () => {
        const pairs =
          ClassScheduleUtils.getInstructorTimes(mockPilatesSchedule);
        expect(pairs).toHaveLength(2);
        expect(pairs[0]).toEqual({ name: 'Jenna S.', time: 'M/W 10am' });
        expect(pairs[1]).toEqual({ name: 'Rick P.', time: 'Fri 7am' });
      });

      it('returns instructor-time pairs from yoga schedule', () => {
        const pairs = ClassScheduleUtils.getInstructorTimes(mockClassSchedule);
        expect(pairs).toHaveLength(1);
        expect(pairs[0]).toEqual({ name: 'Alex', time: 'Mon/Wed/Fri 6:00am' });
      });

      it('returns instructor-time pairs from HIIT schedule', () => {
        const pairs = ClassScheduleUtils.getInstructorTimes(mockHiitSchedule);
        expect(pairs).toHaveLength(2);
        expect(pairs).toContainEqual({
          name: 'Jordan',
          time: 'Tue/Thu 7:00pm',
        });
        expect(pairs).toContainEqual({ name: 'Sam', time: 'Sat 9:00am' });
      });
    });

    describe('getUniqueTimes', () => {
      it('returns unique times from pilates schedule', () => {
        const times = ClassScheduleUtils.getUniqueTimes([mockPilatesSchedule]);
        expect(times).toContain('M/W 10am');
        expect(times).toContain('Fri 7am');
        expect(times).toHaveLength(2);
      });

      it('returns unique times from yoga schedule', () => {
        const times = ClassScheduleUtils.getUniqueTimes([mockClassSchedule]);
        expect(times).toContain('Mon/Wed/Fri 6:00am');
        expect(times).toHaveLength(1);
      });

      it('combines times from multiple schedules', () => {
        const times = ClassScheduleUtils.getUniqueTimes(scheduleList);
        expect(times).toContain('M/W 10am');
        expect(times).toContain('Fri 7am');
        expect(times).toContain('Mon/Wed/Fri 6:00am');
        expect(times).toContain('Tue/Thu 7:00pm');
        expect(times).toContain('Sat 9:00am');
        expect(times).toHaveLength(5);
      });
    });

    describe('filterByInstructor', () => {
      it('filters by instructor from pilates schedule', () => {
        const jennaSchedules = ClassScheduleUtils.filterByInstructor(
          scheduleList,
          'Jenna S.'
        );
        expect(jennaSchedules).toHaveLength(1);
        expect(jennaSchedules[0].id).toBe(mockPilatesSchedule.id);
      });

      it('filters by instructor from yoga schedule', () => {
        const alexSchedules = ClassScheduleUtils.filterByInstructor(
          scheduleList,
          'Alex'
        );
        expect(alexSchedules).toHaveLength(1);
        expect(alexSchedules[0].id).toBe(mockClassSchedule.id);
      });
    });
  });
});
