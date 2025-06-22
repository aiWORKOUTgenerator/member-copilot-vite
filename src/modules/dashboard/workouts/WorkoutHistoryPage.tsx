"use client";

import { useWorkoutInstances } from "@/contexts/WorkoutInstanceContext";
import { WorkoutInstance } from "@/domain/entities/workoutInstance";
import LoadingState from "@/ui/shared/atoms/LoadingState";
import EmptyStateBasic from "@/ui/shared/molecules/EmptyState";
import { Calendar, Activity, List, Grid } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  filterLastDays,
  sortByDateDesc,
  calculateStats,
  formatDate,
} from "./utils/workoutHistoryUtils";
import { WorkoutTimeline } from "./components/WorkoutTimeline";

/**
 * Simple workout history page showing instances from the last month
 */
export default function WorkoutHistoryPage() {
  const { instances, isLoading, error } = useWorkoutInstances();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"timeline" | "list">("timeline");

  // Filter to last month's workouts
  const recentWorkouts = useMemo(() => {
    return sortByDateDesc(filterLastDays(instances, 90)); // Extended to 90 days for better timeline view
  }, [instances]);

  // Calculate statistics
  const stats = useMemo(() => calculateStats(recentWorkouts), [recentWorkouts]);

  const handleWorkoutClick = (workout: WorkoutInstance) => {
    navigate(`/dashboard/workouts/instances/${workout.id}`);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="p-4">
        <div role="alert" className="alert alert-error">
          <Activity className="w-6 h-6" />
          <div>
            <h3 className="font-bold">Error Loading Workout History</h3>
            <div className="text-sm">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (recentWorkouts.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <EmptyStateBasic
          title="No recent workouts"
          description="You haven't logged any workouts in the last 30 days. Complete a workout to see your history here."
          actionLabel="View All Workouts"
          onAction={() => (window.location.href = "/dashboard/workouts")}
          actionIcon={<Activity className="w-4 h-4 mr-2" />}
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Workout History</h1>
            <p className="text-sm text-base-content/70 sm:hidden">
              Week view on mobile
            </p>
          </div>
          <span className="badge badge-outline hidden sm:inline">
            Last 90 Days
          </span>
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 bg-base-200 p-1 rounded-lg">
          <button
            onClick={() => setViewMode("timeline")}
            className={`btn btn-sm ${
              viewMode === "timeline" ? "btn-primary" : "btn-ghost"
            }`}
            title="Timeline view"
          >
            <Grid className="w-4 h-4" />
            Timeline
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`btn btn-sm ${
              viewMode === "list" ? "btn-primary" : "btn-ghost"
            }`}
            title="List view"
          >
            <List className="w-4 h-4" />
            List
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="stats shadow stats-vertical sm:stats-horizontal">
          <div className="stat">
            <div className="stat-title text-xs">Total Workouts</div>
            <div className="stat-value text-lg sm:text-2xl text-primary">
              {stats.total}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title text-xs">Completed</div>
            <div className="stat-value text-lg sm:text-2xl text-success">
              {stats.completed}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title text-xs">Completion Rate</div>
            <div className="stat-value text-lg sm:text-2xl text-accent">
              {stats.completionRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === "timeline" ? (
        <WorkoutTimeline
          workouts={recentWorkouts}
          onWorkoutClick={handleWorkoutClick}
        />
      ) : (
        <div className="space-y-4">
          {recentWorkouts.map((workout) => (
            <div key={workout.id} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="card-title text-lg">
                      {workout.jsonFormat?.title ||
                        `Workout ${workout.id.slice(0, 8)}`}
                      {workout.completed && (
                        <div className="badge badge-success">Completed</div>
                      )}
                    </h3>
                    <p className="text-sm text-base-content/70 mb-2">
                      {formatDate(workout.performedAt)}
                    </p>
                    {workout.duration && (
                      <p className="text-sm">
                        <span className="font-semibold">Duration:</span>{" "}
                        {workout.duration} minutes
                      </p>
                    )}
                    {workout.notes && (
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Notes:</span>{" "}
                        {workout.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleWorkoutClick(workout)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
