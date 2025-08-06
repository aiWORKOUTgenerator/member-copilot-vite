import { WorkoutInstance } from "@/domain/entities/workoutInstance";

/**
 * Filter workout instances to show only the last specified number of days
 */
export function filterLastDays(
  instances: WorkoutInstance[],
  days: number = 30,
): WorkoutInstance[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return instances.filter((instance) => {
    const performedDate = new Date(instance.performedAt);
    return performedDate >= cutoffDate;
  });
}

/**
 * Sort workout instances by performed date (most recent first)
 */
export function sortByDateDesc(
  instances: WorkoutInstance[],
): WorkoutInstance[] {
  return instances.sort(
    (a, b) =>
      new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime(),
  );
}

/**
 * Calculate basic workout statistics
 */
export function calculateStats(instances: WorkoutInstance[]) {
  const total = instances.length;

  // Calculate active days percentage for last 2 weeks only
  const daysInPeriod = 14; // Last 2 weeks
  const lastTwoWeeks = filterLastDays(instances, 14);
  const uniqueDates = new Set(
    lastTwoWeeks.map(
      (instance) => new Date(instance.performedAt).toISOString().split("T")[0],
    ),
  );
  const activeDays = uniqueDates.size;
  const activeDaysPercent = Math.round((activeDays / daysInPeriod) * 100);

  return {
    total,
    activeDays,
    activeDaysPercent,
  };
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format date for short display (just date)
 */
export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
