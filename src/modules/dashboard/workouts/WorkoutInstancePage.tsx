"use client";

import {
  useWorkoutInstances,
  useCurrentWorkoutInstance,
  useCurrentWorkoutInstanceLoading,
} from "@/contexts/WorkoutInstanceContext";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";

export default function WorkoutInstancePage() {
  const params = useParams();
  const navigate = useNavigate();
  const instanceId = params?.id as string;

  const { loadCurrentInstance, clearCurrentInstance } = useWorkoutInstances();
  const currentInstance = useCurrentWorkoutInstance();
  const isLoading = useCurrentWorkoutInstanceLoading();

  // Load the workout instance when component mounts
  useEffect(() => {
    if (instanceId) {
      loadCurrentInstance(instanceId);
    }

    // Clear current instance when component unmounts
    return () => {
      clearCurrentInstance();
    };
  }, [instanceId, loadCurrentInstance, clearCurrentInstance]);

  const handleClose = () => {
    navigate("/dashboard/workouts");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 bg-base-100 border-b border-base-300 z-50">
          <div className="flex items-center justify-between p-4">
            <div className="flex-1">
              <div className="h-6 bg-base-300 rounded animate-pulse w-48"></div>
            </div>
            <button
              onClick={handleClose}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Close workout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area with top padding for fixed header */}
        <div className="pt-20 p-4">
          <div className="flex items-center justify-center h-40">
            <div className="flex flex-col items-center space-y-4">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-base-content/70">Loading workout...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentInstance) {
    return (
      <div className="min-h-screen bg-base-100">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 bg-base-100 border-b border-base-300 z-50">
          <div className="flex items-center justify-between p-4">
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-error">
                Workout Not Found
              </h1>
            </div>
            <button
              onClick={handleClose}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Close workout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area with top padding for fixed header */}
        <div className="pt-20 p-4">
          <div className="text-center">
            <p className="text-base-content/70 mb-4">
              The workout instance could not be found.
            </p>
            <button onClick={handleClose} className="btn btn-primary">
              Back to Workouts
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get the workout title from the JSON format if available
  const workoutTitle = currentInstance.jsonFormat?.title || "Workout Session";

  return (
    <div className="min-h-screen bg-base-100">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-base-100 border-b border-base-300 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-base-content truncate pr-4">
              {workoutTitle}
            </h1>
            <p className="text-sm text-base-content/70">
              {new Date(currentInstance.performedAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Close workout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Area with top padding for fixed header */}
      <div className="pt-20 p-4">
        {/* Workout content will go here */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-base-200 rounded-lg p-6 mb-4">
            <h2 className="text-xl font-bold mb-2">Workout Instance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`badge ${
                    currentInstance.completed
                      ? "badge-success"
                      : "badge-warning"
                  }`}
                >
                  {currentInstance.completed ? "Completed" : "In Progress"}
                </span>
              </div>
              <div>
                <span className="font-medium">Duration:</span>{" "}
                {currentInstance.duration
                  ? `${currentInstance.duration} minutes`
                  : "Not recorded"}
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">Notes:</span>{" "}
                {currentInstance.notes || "No notes added"}
              </div>
            </div>
          </div>

          {/* Placeholder for workout content - this will be enhanced in future iterations */}
          <div className="bg-base-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              Ready to start your workout!
            </h3>
            <p className="text-base-content/70 mb-4">
              This is where the interactive workout experience will be
              displayed.
            </p>
            <div className="flex gap-2">
              <button className="btn btn-primary">Start Exercise</button>
              <button className="btn btn-outline">Mark as Complete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
