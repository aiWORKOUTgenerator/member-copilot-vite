"use client";

import {
  useGeneratedWorkouts,
  useGeneratedWorkoutsLoading,
} from "@/hooks/useGeneratedWorkouts";
import { GeneratedWorkout } from "@/domain/entities/generatedWorkout";
import { useUserAccess } from "@/hooks";
import { MeteredFeature } from "@/domain/entities/meteredFeatures";
import LoadingState from "@/ui/shared/atoms/LoadingState";
import AccessAwareComponent from "@/ui/shared/molecules/AccessAwareComponent";
import EmptyStateBasic from "@/ui/shared/molecules/EmptyState";
import { Plus, AlertTriangle, History } from "lucide-react";
import { useNavigate } from "react-router";
import WorkoutList from "./components/WorkoutList";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect } from "react";

export default function AIWorkouts() {
  const { workouts } = useGeneratedWorkouts();
  const isLoadingGeneratedWorkouts = useGeneratedWorkoutsLoading();
  const navigate = useNavigate();

  const { isLoading: isLoadingMeteredUsage, isMeterLimitReached } =
    useUserAccess();

  const isWorkoutGenerationLimitReached = isMeterLimitReached(
    MeteredFeature.WORKOUTS_GENERATED
  );

  const isLoading = isLoadingGeneratedWorkouts || isLoadingMeteredUsage;

  const analytics = useAnalytics();

  // Track workouts page views
  useEffect(() => {
    analytics.track("Workouts Library Viewed", {
      workoutCount: workouts?.length || 0,
      tracked_at: new Date().toISOString(),
    });
  }, [analytics, workouts]);

  if (isLoading) {
    return <LoadingState />;
  }

  // Track workout selection
  const handleWorkoutClick = (workout: GeneratedWorkout) => {
    analytics.track("Workout Selected", {
      workoutId: workout.id,
      location: "workouts_library",
      tracked_at: new Date().toISOString(),
    });
    navigate(`/dashboard/workouts/${workout.id}`);
  };

  // Track navigation to generation
  const handleGenerateNewClick = () => {
    analytics.track("Generate New Workout CTA Clicked", {
      location: "workouts_library",
      existingWorkoutCount: workouts?.length || 0,
      tracked_at: new Date().toISOString(),
    });
  };

  const navigateToGeneratePage = () => {
    handleGenerateNewClick();
    navigate("/dashboard/workouts/generate");
  };

  const navigateToBillingPage = () => {
    analytics.track("Upgrade Plan CTA Clicked", {
      location: "workouts_library",
      reason: "workout_generation_limit_reached",
      tracked_at: new Date().toISOString(),
    });
    navigate("/dashboard/billing");
  };

  const navigateToHistory = () => {
    analytics.track("Workout History CTA Clicked", {
      location: "workouts_library",
      tracked_at: new Date().toISOString(),
    });
    navigate("/dashboard/workouts/history");
  };

  if (workouts.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <EmptyStateBasic
          title="No workouts found yet"
          description={
            isWorkoutGenerationLimitReached
              ? "You have reached your workout generation limit for this period."
              : "Generate your first workout to get started"
          }
          actionLabel={
            isWorkoutGenerationLimitReached
              ? "Upgrade Plan"
              : "Generate Workout"
          }
          onAction={
            isWorkoutGenerationLimitReached
              ? navigateToBillingPage
              : navigateToGeneratePage
          }
          actionIcon={<Plus className="w-4 h-4 mr-2" />}
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      <AccessAwareComponent showSkeleton={false} fallback={null}>
        {isWorkoutGenerationLimitReached && (
          <div role="alert" className="alert alert-error mb-6">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <h3 className="font-bold">Limit Reached</h3>
              <div className="text-sm">
                You have reached your workout generation limit for this period.
              </div>
            </div>
            <button onClick={navigateToBillingPage} className="btn btn-sm">
              Upgrade Plan
            </button>
          </div>
        )}
      </AccessAwareComponent>

      <div className="flex justify-between items-center">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl font-bold">My Workouts</h1>
          <div className="flex gap-2">
            <button
              onClick={navigateToHistory}
              className="btn btn-outline"
              title="View workout history"
            >
              <History className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">History</span>
            </button>
            <AccessAwareComponent
              showSkeleton={true}
              fallback={<div className="skeleton h-10 w-full"></div>}
            >
              <button
                onClick={
                  isWorkoutGenerationLimitReached
                    ? navigateToBillingPage
                    : navigateToGeneratePage
                }
                className="btn btn-primary"
                disabled={false}
                title={
                  isWorkoutGenerationLimitReached
                    ? "You have reached your workout generation limit. Click to upgrade your plan."
                    : "Generate a new workout"
                }
              >
                <Plus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">
                  {isWorkoutGenerationLimitReached
                    ? "Upgrade Plan"
                    : "Generate Workout"}
                </span>
                <span className="sm:hidden">
                  {isWorkoutGenerationLimitReached ? "Upgrade" : "Generate"}
                </span>
              </button>
            </AccessAwareComponent>
          </div>
        </div>
      </div>
      <WorkoutList workouts={workouts} onWorkoutClick={handleWorkoutClick} />
    </div>
  );
}
