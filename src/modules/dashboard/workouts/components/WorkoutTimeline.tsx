"use client";

import { WorkoutInstance } from "@/domain/entities/workoutInstance";
import { ChevronLeft, ChevronRight, Calendar, List } from "lucide-react";
import { useMemo, useState } from "react";

interface WorkoutTimelineProps {
  workouts: WorkoutInstance[];
  onWorkoutClick: (workout: WorkoutInstance) => void;
}

interface TimelineDay {
  date: Date;
  dateString: string; // YYYY-MM-DD format
  isToday: boolean;
  isCurrentMonth: boolean;
  workouts: WorkoutInstance[];
}

interface WeekSummary {
  weekStart: Date;
  weekEnd: Date;
  totalWorkouts: number;
  completedWorkouts: number;
  totalDuration: number;
  activeDays: number;
  completionRate: number;
  weekNumber: number;
}

/**
 * Generate calendar days for a given month
 */
function generateCalendarDays(
  year: number,
  month: number,
  workouts: WorkoutInstance[],
): TimelineDay[] {
  const firstDay = new Date(year, month, 1);
  const startOfWeek = new Date(firstDay);
  const today = new Date();

  // Start from the beginning of the week (Sunday)
  startOfWeek.setDate(firstDay.getDate() - firstDay.getDay());

  const days: TimelineDay[] = [];
  const currentDate = new Date(startOfWeek);

  // Generate 6 weeks worth of days (42 days total)
  for (let i = 0; i < 42; i++) {
    const dateString = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const dayWorkouts = workouts.filter((workout) => {
      const workoutDate = new Date(workout.performedAt)
        .toISOString()
        .split("T")[0];
      return workoutDate === dateString;
    });

    days.push({
      date: new Date(currentDate),
      dateString,
      isToday: currentDate.toDateString() === today.toDateString(),
      isCurrentMonth: currentDate.getMonth() === month,
      workouts: dayWorkouts,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
}

/**
 * Generate week days starting from the given date
 */
function generateWeekDays(
  startDate: Date,
  workouts: WorkoutInstance[],
): TimelineDay[] {
  const days: TimelineDay[] = [];
  const currentDate = new Date(startDate);
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const dateString = currentDate.toISOString().split("T")[0];
    const dayWorkouts = workouts.filter((workout) => {
      const workoutDate = new Date(workout.performedAt)
        .toISOString()
        .split("T")[0];
      return workoutDate === dateString;
    });

    days.push({
      date: new Date(currentDate),
      dateString,
      isToday: currentDate.toDateString() === today.toDateString(),
      isCurrentMonth: true, // Always true for week view
      workouts: dayWorkouts,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
}

/**
 * Get the start of the week (Sunday) for a given date
 */
function getStartOfWeek(date: Date): Date {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  return startOfWeek;
}

/**
 * Calculate weekly summaries from calendar days
 */
function calculateWeeklySummaries(days: TimelineDay[]): WeekSummary[] {
  const weeklySummaries: WeekSummary[] = [];

  // Group days into weeks (7 days each)
  for (let i = 0; i < days.length; i += 7) {
    const weekDays = days.slice(i, i + 7);
    const weekStart = weekDays[0]?.date;
    const weekEnd = weekDays[6]?.date;

    if (!weekStart || !weekEnd) continue;

    // Calculate week statistics
    const allWorkouts = weekDays.flatMap((day) => day.workouts);
    const totalWorkouts = allWorkouts.length;
    const completedWorkouts = allWorkouts.filter((w) => w.completed).length;
    const totalDuration = allWorkouts.reduce(
      (sum, w) => sum + (w.duration || 0),
      0,
    );
    const activeDays = weekDays.filter((day) => day.workouts.length > 0).length;
    const completionRate =
      totalWorkouts > 0
        ? Math.round((completedWorkouts / totalWorkouts) * 100)
        : 0;

    weeklySummaries.push({
      weekStart,
      weekEnd,
      totalWorkouts,
      completedWorkouts,
      totalDuration,
      activeDays,
      completionRate,
      weekNumber: Math.floor(i / 7) + 1,
    });
  }

  return weeklySummaries;
}

/**
 * Mobile-friendly timeline component with responsive views
 */
export function WorkoutTimeline({
  workouts,
  onWorkoutClick,
}: WorkoutTimelineProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const weekRange = useMemo(() => {
    const startOfWeek = getStartOfWeek(currentDate);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return {
      start: startOfWeek,
      end: endOfWeek,
      text: `${startOfWeek.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${endOfWeek.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`,
    };
  }, [currentDate]);

  const calendarDays = useMemo(() => {
    if (viewMode === "week") {
      return generateWeekDays(weekRange.start, workouts);
    }
    return generateCalendarDays(year, month, workouts);
  }, [year, month, workouts, viewMode, weekRange.start]);

  const weeklySummaries = useMemo(() => {
    if (viewMode === "month") {
      return calculateWeeklySummaries(calendarDays);
    }
    return [];
  }, [calendarDays, viewMode]);

  const navigate = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);

      // Check if we're on mobile (screen width check via window.innerWidth)
      // or if we're in week view mode
      const isMobile = typeof window !== "undefined" && window.innerWidth < 640; // sm breakpoint

      if (viewMode === "week" || isMobile) {
        // Navigate by week on mobile or when in week view
        const days = direction === "prev" ? -7 : 7;
        newDate.setDate(newDate.getDate() + days);
      } else {
        // Navigate by month on desktop month view
        if (direction === "prev") {
          newDate.setMonth(newDate.getMonth() - 1);
        } else {
          newDate.setMonth(newDate.getMonth() + 1);
        }
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const renderDay = (day: TimelineDay, isCompact = false) => {
    const dayNumber = day.date.getDate();
    const hasWorkouts = day.workouts.length > 0;
    const completedWorkouts = day.workouts.filter((w) => w.completed);

    // Determine styling based on workout status
    let dayClasses = `relative border border-base-200 rounded-lg cursor-pointer transition-all hover:bg-base-200/50 ${
      isCompact ? "min-h-12 p-1" : "min-h-20 p-2"
    }`;

    if (!day.isCurrentMonth && viewMode === "month") {
      dayClasses += " opacity-40";
    }

    if (day.isToday) {
      dayClasses += " ring-2 ring-primary";
    }

    if (hasWorkouts) {
      if (completedWorkouts.length === day.workouts.length) {
        dayClasses += " bg-success/10 border-success/30";
      } else if (completedWorkouts.length > 0) {
        dayClasses += " bg-warning/10 border-warning/30";
      } else {
        dayClasses += " bg-error/10 border-error/30";
      }
    }

    const handleDayClick = () => {
      if (day.workouts.length > 0) {
        onWorkoutClick(day.workouts[0]);
      }
    };

    return (
      <div key={day.dateString} className={dayClasses} onClick={handleDayClick}>
        {/* Day number */}
        <div className="flex justify-between items-start mb-1">
          <span
            className={`text-sm font-medium ${
              day.isToday
                ? "text-primary"
                : day.isCurrentMonth
                  ? ""
                  : "text-base-content/50"
            }`}
          >
            {dayNumber}
          </span>
          {day.isToday && (
            <div className="w-2 h-2 bg-primary rounded-full"></div>
          )}
        </div>

        {/* Workout indicators */}
        {hasWorkouts ? (
          <div className="space-y-1">
            {isCompact ? (
              // Compact month view - just dots
              <div className="flex gap-1 flex-wrap">
                {day.workouts.slice(0, 4).map((workout) => (
                  <div
                    key={workout.id}
                    className={`w-2 h-2 rounded-full ${
                      workout.completed ? "bg-success" : "bg-error"
                    }`}
                    title={workout.jsonFormat?.title || "Workout"}
                  />
                ))}
                {day.workouts.length > 4 && (
                  <span className="text-xs text-base-content/70">
                    +{day.workouts.length - 4}
                  </span>
                )}
              </div>
            ) : (
              // Full view - workout names with better styling
              <div className="space-y-1">
                {day.workouts.slice(0, 3).map((workout) => (
                  <div key={workout.id} className="text-xs">
                    <div className="flex items-start gap-1">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mt-0.5 flex-shrink-0 ${
                          workout.completed ? "bg-success" : "bg-error"
                        }`}
                      />
                      <span className="truncate leading-tight">
                        {workout.jsonFormat?.title ||
                          `Workout ${workout.id.slice(0, 4)}`}
                      </span>
                    </div>
                    {workout.duration && (
                      <div className="text-xs text-base-content/50 ml-3">
                        {workout.duration}min
                      </div>
                    )}
                  </div>
                ))}
                {day.workouts.length > 3 && (
                  <div className="text-xs text-base-content/70 ml-3">
                    +{day.workouts.length - 3} more
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // Rest day
          day.isCurrentMonth &&
          !isCompact && (
            <div className="flex items-center justify-center h-full">
              <span className="text-xs text-base-content/40">Rest</span>
            </div>
          )
        )}
      </div>
    );
  };

  const renderWeeklySummary = (summary: WeekSummary) => {
    return (
      <div className="bg-base-100 border border-base-200 rounded-lg p-3 min-h-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {summary.activeDays}
          </div>
          <div className="text-xs text-base-content/70">active days</div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("prev")}
            className="btn btn-ghost btn-sm"
            aria-label={`Previous ${
              typeof window !== "undefined" && window.innerWidth < 640
                ? "week"
                : viewMode
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-semibold min-w-32 text-center">
            <span className="hidden sm:inline">
              {viewMode === "week" ? weekRange.text : monthName}
            </span>
            <span className="sm:hidden">{weekRange.text}</span>
          </h2>
          <button
            onClick={() => navigate("next")}
            className="btn btn-ghost btn-sm"
            aria-label={`Next ${
              typeof window !== "undefined" && window.innerWidth < 640
                ? "week"
                : viewMode
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle - Hidden on mobile, auto-switches based on screen size */}
          <div className="hidden sm:flex gap-1 bg-base-200 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("month")}
              className={`btn btn-xs ${
                viewMode === "month" ? "btn-primary" : "btn-ghost"
              }`}
              title="Month view"
            >
              <Calendar className="w-3 h-3" />
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`btn btn-xs ${
                viewMode === "week" ? "btn-primary" : "btn-ghost"
              }`}
              title="Week view"
            >
              <List className="w-3 h-3" />
            </button>
          </div>

          <button onClick={goToToday} className="btn btn-outline btn-sm">
            Today
          </button>
        </div>
      </div>

      {/* Days of week header */}
      <div
        className={`grid gap-1 mb-2 ${
          viewMode === "month" ? "hidden sm:grid sm:grid-cols-8" : "grid-cols-7"
        }`}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-base-content/70 py-2"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
        {viewMode === "month" && (
          <div className="hidden sm:block text-center text-sm font-medium text-base-content/70 py-2">
            Week Stats
          </div>
        )}
      </div>

      {/* Responsive Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Mobile: Always show week view with larger day cells */}
        <div className="col-span-7 grid grid-cols-7 gap-1 sm:hidden">
          {generateWeekDays(getStartOfWeek(currentDate), workouts).map((day) =>
            renderDay(day, false),
          )}
        </div>

        {/* Desktop: Show selected view with weekly summaries for month view */}
        {viewMode === "month" ? (
          <div className="hidden sm:col-span-7 sm:grid sm:grid-cols-8 sm:gap-1">
            {calendarDays.map((day, index) => {
              const weekIndex = Math.floor(index / 7);
              const dayInWeek = index % 7;

              return (
                <div
                  key={`week-${weekIndex}-day-${dayInWeek}`}
                  className="contents"
                >
                  {renderDay(day, true)}
                  {dayInWeek === 6 && weeklySummaries[weekIndex] && (
                    <div key={`summary-${weekIndex}`}>
                      {renderWeeklySummary(weeklySummaries[weekIndex])}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="hidden sm:col-span-7 sm:grid sm:grid-cols-7 sm:gap-1">
            {calendarDays.map((day) => renderDay(day, false))}
          </div>
        )}
      </div>

      {/* Mobile week navigation info */}
      <div className="mt-4 text-center text-sm text-base-content/70 sm:hidden">
        Use arrows to navigate weeks
      </div>
    </div>
  );
}
