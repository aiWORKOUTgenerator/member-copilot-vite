"use client";

import { GeneratedWorkout } from "@/domain/entities/generatedWorkout";
import { MeteredFeature } from "@/domain/entities/meteredFeatures";
import { useUserAccess } from "@/hooks/useUserAccess";
import { ArrowBigRight, Lock, Crown } from "lucide-react";
import { useNavigate } from "react-router";

interface WorkoutListProps {
  workouts: GeneratedWorkout[];
  title?: string;
  onWorkoutClick?: (workout: GeneratedWorkout) => void;
}

const getFirstWords = (text: string, wordCount = 10) =>
  text.split(/\s+/).slice(0, wordCount).join(" ") +
  (text.split(/\s+/).length > wordCount ? "…" : "");

export default function WorkoutList({
  workouts,
  title = "",
  onWorkoutClick,
}: WorkoutListProps) {
  const navigate = useNavigate();
  const { getHighestLimitForMeter } = useUserAccess();

  // Get the stored workouts limit (defaults to 5 for free tier)
  const storedWorkoutsLimit =
    getHighestLimitForMeter(MeteredFeature.STORED_WORKOUTS) || 5;

  // Split workouts into accessible and restricted
  const accessibleWorkouts = workouts.slice(0, storedWorkoutsLimit);
  const restrictedWorkouts = workouts.slice(storedWorkoutsLimit);

  const handleUpgrade = () => {
    navigate("/dashboard/billing");
  };

  const renderWorkoutItem = (
    workout: GeneratedWorkout,
    isRestricted = false
  ) => {
    // Format the date to a nice human-readable string
    const createdDate = new Date(workout.createdAt);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour12: true,
    }).format(createdDate);

    const handleClick = () => {
      if (isRestricted) {
        handleUpgrade();
      } else {
        onWorkoutClick?.(workout);
      }
    };

    return (
      <li
        key={workout.id}
        className={`list-row p-2 transition-colors rounded-lg my-1 border border-base-300 relative cursor-pointer ${
          isRestricted ? "opacity-60 hover:opacity-80" : "hover:bg-base-200"
        }`}
        onClick={handleClick}
      >
        {/* Overlay for restricted workouts */}
        {isRestricted && (
          <div className="absolute inset-0 bg-base-300/30 backdrop-blur-[1px] rounded-lg flex items-center justify-center z-10 pointer-events-none">
            <div className="flex items-center space-x-2 bg-base-100 px-3 py-2 rounded-lg shadow-lg border">
              <Lock className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium">Upgrade to Access</span>
            </div>
          </div>
        )}

        <div className="flex-shrink-0 flex flex-col items-center justify-center bg-base-200 rounded-md p-2 mr-3">
          <span className="text-lg font-semibold text-primary tabular-nums p-2">
            {formattedDate}
          </span>
        </div>
        <div className="list-col-grow min-w-0">
          <div className="py-1 overflow-hidden flex items-center h-full">
            <p className="line-clamp-2 text-ellipsis">
              {workout.jsonFormat?.title ||
                getFirstWords(workout.textFormat, 20)}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center justify-center ml-2">
          <div className="btn btn-circle btn-ghost btn-sm">
            {isRestricted ? (
              <Lock className="w-4 h-4 text-warning" />
            ) : (
              <ArrowBigRight className="w-4 h-4 text-primary" />
            )}
          </div>
        </div>
      </li>
    );
  };

  return (
    <div>
      <ul className="list bg-base-100">
        <li className="p-3 pb-1 text-xs opacity-60 tracking-wide">{title}</li>

        {/* Render accessible workouts */}
        {accessibleWorkouts.map((workout) => renderWorkoutItem(workout, false))}

        {/* Render restricted workouts */}
        {restrictedWorkouts.map((workout) => renderWorkoutItem(workout, true))}
      </ul>

      {/* Upgrade prompt if there are restricted workouts */}
      {restrictedWorkouts.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-semibold text-base-content">
                  {restrictedWorkouts.length} Workout
                  {restrictedWorkouts.length > 1 ? "s" : ""} Locked
                </h3>
                <p className="text-sm text-base-content/70">
                  Upgrade to Pro to access all your previous workouts
                </p>
              </div>
            </div>
            <button onClick={handleUpgrade} className="btn btn-primary btn-sm">
              <Crown className="w-4 h-4 mr-1" />
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
