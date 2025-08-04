"use client";

import { useTrainerPersonaData } from "@/hooks/useTrainerPersona";
import { useWorkoutInstances } from "@/hooks/useWorkoutInstances";
import { WorkoutInstance } from "@/domain/entities/workoutInstance";
import { useUserAccess } from "@/hooks";
import LoadingState from "@/ui/shared/atoms/LoadingState";
import EmptyStateBasic from "@/ui/shared/molecules/EmptyState";
import {
  Activity,
  Calendar,
  Grid,
  List,
  Crown,
  ArrowRight,
  CheckCircle,
  Shield,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { TrainerPersonaDisplay } from "./components/TrainerPersonaDisplay";
import WorkoutInstanceModal from "./components/WorkoutInstanceModal";
import { WorkoutTimeline } from "./components/WorkoutTimeline";
import {
  calculateStats,
  filterLastDays,
  formatDate,
  sortByDateDesc,
} from "./utils/workoutHistoryUtils";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useWorkoutInstanceModal } from "./components/WorkoutInstanceModal.hooks";

/**
 * Simple workout history page showing instances from the last month
 */
export default function WorkoutHistoryPage() {
  const { instances, isLoading, error } = useWorkoutInstances();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"timeline" | "list">("timeline");
  const trainerPersona = useTrainerPersonaData();
  const workoutModal = useWorkoutInstanceModal();
  const {
    canAccessFeature,
    isLoading: isAccessLoading,
    isLoaded: isAccessLoaded,
  } = useUserAccess();
  const analytics = useAnalytics();

  // Check if user has access to workout history feature
  const hasWorkoutHistoryAccess = canAccessFeature("workout_instance_history");

  // Filter to last month's workouts
  const recentWorkouts = useMemo(() => {
    return sortByDateDesc(filterLastDays(instances, 90)); // Extended to 90 days for better timeline view
  }, [instances]);

  // Calculate statistics
  const stats = useMemo(() => calculateStats(recentWorkouts), [recentWorkouts]);

  // Track workout history page views
  useEffect(() => {
    analytics.track("Workout History Viewed", {
      totalWorkouts: instances?.length || 0,
      tracked_at: new Date().toISOString(),
    });
  }, [instances, analytics]);

  const handleWorkoutClick = (workout: WorkoutInstance) => {
    analytics.track("Historical Workout Clicked", {
      workoutInstanceId: workout.id,
      completed: workout.completed,
      tracked_at: new Date().toISOString(),
    });
    workoutModal.openModal(workout);
  };

  const handleViewDetails = (workout: WorkoutInstance) => {
    analytics.track("Workout Instance Details Viewed", {
      workoutInstanceId: workout.id,
      source: "history_modal",
      tracked_at: new Date().toISOString(),
    });
    workoutModal.closeModal();
    navigate(`/dashboard/workouts/instances/${workout.id}`);
  };

  const handleViewModeChange = (newMode: "timeline" | "list") => {
    analytics.track("History View Mode Changed", {
      viewMode: newMode,
      previousMode: viewMode,
      tracked_at: new Date().toISOString(),
    });
    setViewMode(newMode);
  };

  // Handle access control loading state
  if (isAccessLoading || isLoading) {
    return <LoadingState />;
  }

  // Show upgrade prompt if user doesn't have workout history access
  if (!hasWorkoutHistoryAccess && isAccessLoaded) {
    return (
      <div className="p-4">
        {/* Upgrade Hero Section */}
        <div className="hero min-h-[60vh] bg-gradient-to-r from-primary to-secondary rounded-lg">
          <div className="hero-content text-center text-primary-content max-w-4xl">
            <div>
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Calendar
                    className="size-16 text-primary-content drop-shadow-lg"
                    strokeWidth={1.5}
                  />
                  <div className="absolute -top-2 -right-2">
                    <Crown className="size-6 text-warning drop-shadow-lg animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="badge badge-warning badge-lg mb-4 font-bold animate-pulse">
                🏋️ PREMIUM FEATURE
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Unlock Your
                <span className="text-warning block mt-2">Workout History</span>
              </h1>

              <p className="text-lg md:text-xl mb-8 text-primary-content/90 leading-relaxed max-w-2xl mx-auto">
                Track your progress, view detailed workout analytics, and see
                your fitness journey unfold over time. Get insights into your
                most effective workouts and stay motivated with comprehensive
                history tracking.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <button
                  className="btn btn-warning btn-lg text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
                  onClick={() => navigate("/dashboard/billing")}
                >
                  <Crown className="size-5" />
                  Upgrade Now
                  <ArrowRight className="size-4" />
                </button>
              </div>

              <div className="flex justify-center items-center gap-6 text-sm text-primary-content/80">
                <div className="flex items-center gap-1">
                  <CheckCircle className="size-4" />
                  <span>Full workout analytics</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="size-4" />
                  <span>Progress tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
            <p className="text-sm text-base-content/70 sm:hidden">Week view</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 bg-base-200 p-1 rounded-lg">
          <button
            onClick={() => handleViewModeChange("timeline")}
            className={`btn btn-sm ${
              viewMode === "timeline" ? "btn-primary" : "btn-ghost"
            }`}
            title="Timeline view"
          >
            <Grid className="w-4 h-4" />
            Timeline
          </button>
          <button
            onClick={() => handleViewModeChange("list")}
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

      {/* Trainer Persona Section */}
      {trainerPersona && (
        <div className="mb-6 p-3 bg-base-100 border border-base-300 rounded-lg">
          <TrainerPersonaDisplay trainerPersona={trainerPersona} />
          <div className="mt-2 text-sm text-base-content/70">
            <p>Here's your workout history and progress overview:</p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="stats shadow stats-horizontal">
          <div className="stat">
            <div className="stat-title text-xs">Active Days</div>
            <div className="stat-value text-lg sm:text-2xl text-primary">
              {stats.activeDaysPercent}%
            </div>
          </div>
          <div className="stat">
            <div className="stat-title text-xs">Total Workouts</div>
            <div className="stat-value text-lg sm:text-2xl text-success">
              {stats.total}
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

      {/* Workout Instance Modal */}
      {workoutModal.workoutInstance && (
        <WorkoutInstanceModal
          isOpen={workoutModal.isOpen}
          onClose={workoutModal.closeModal}
          workoutInstance={workoutModal.workoutInstance}
          onViewDetails={() => handleViewDetails(workoutModal.workoutInstance!)}
        />
      )}
    </div>
  );
}
