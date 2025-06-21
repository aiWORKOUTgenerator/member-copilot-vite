"use client";

import {
  useWorkoutInstances,
  useCurrentWorkoutInstance,
  useCurrentWorkoutInstanceLoading,
} from "@/contexts/WorkoutInstanceContext";
import {
  ExerciseInstance,
  SectionInstance,
} from "@/domain/entities/workoutInstance";
import { Exercise, Section } from "@/domain/entities/generatedWorkout";
import { Check, X, Clock, Target } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";

interface ExerciseCompletionState {
  [exerciseId: string]: {
    completed: boolean;
    actualSets?: number;
    actualReps?: number;
    actualWeight?: number;
    actualDuration?: number;
    notes?: string;
  };
}

interface WorkoutProgress {
  totalExercises: number;
  completedExercises: number;
  currentSectionIndex: number;
  currentExerciseIndex: number;
}

export default function WorkoutInstancePage() {
  const params = useParams();
  const navigate = useNavigate();
  const instanceId = params?.id as string;

  const { loadCurrentInstance, clearCurrentInstance, updateInstance } =
    useWorkoutInstances();
  const currentInstance = useCurrentWorkoutInstance();
  const isLoading = useCurrentWorkoutInstanceLoading();

  const [exerciseStates, setExerciseStates] = useState<ExerciseCompletionState>(
    {}
  );
  const [workoutProgress, setWorkoutProgress] = useState<WorkoutProgress>({
    totalExercises: 0,
    completedExercises: 0,
    currentSectionIndex: 0,
    currentExerciseIndex: 0,
  });
  const [isUpdating, setIsUpdating] = useState(false);

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

  // Initialize exercise states and calculate progress when instance loads
  useEffect(() => {
    if (currentInstance?.jsonFormat?.sections) {
      const sections = currentInstance.jsonFormat.sections;
      let totalExercises = 0;
      const initialStates: ExerciseCompletionState = {};

      sections.forEach((section, sectionIndex) => {
        section.exercises?.forEach((_, exerciseIndex) => {
          const exerciseId = `section-${sectionIndex}-exercise-${exerciseIndex}`;
          totalExercises++;

          // Initialize from existing instance data if available
          const existingExercise = (section as SectionInstance).exercises?.[
            exerciseIndex
          ] as ExerciseInstance;
          initialStates[exerciseId] = {
            completed: existingExercise?.completed || false,
            actualSets: existingExercise?.actual_sets,
            actualReps: existingExercise?.actual_reps,
            actualWeight: existingExercise?.actual_weight,
            actualDuration: existingExercise?.actual_duration,
            notes: existingExercise?.notes,
          };
        });
      });

      setExerciseStates(initialStates);
      setWorkoutProgress((prev) => ({
        ...prev,
        totalExercises,
        completedExercises: Object.values(initialStates).filter(
          (state) => state.completed
        ).length,
      }));
    }
  }, [currentInstance]);

  const handleClose = () => {
    navigate("/dashboard/workouts");
  };

  const handleExerciseComplete = useCallback(
    (exerciseId: string, completed: boolean) => {
      setExerciseStates((prev) => {
        const newStates = {
          ...prev,
          [exerciseId]: {
            ...prev[exerciseId],
            completed,
          },
        };

        // Update progress
        const completedCount = Object.values(newStates).filter(
          (state) => state.completed
        ).length;
        setWorkoutProgress((prev) => ({
          ...prev,
          completedExercises: completedCount,
        }));

        return newStates;
      });
    },
    []
  );

  const handleCompleteWorkout = async () => {
    if (!currentInstance) return;

    setIsUpdating(true);
    try {
      await updateInstance(currentInstance.id, {
        completed: true,
        duration: Math.round(
          (new Date().getTime() -
            new Date(currentInstance.performedAt).getTime()) /
            60000
        ),
      });
    } catch (error) {
      console.error("Failed to complete workout:", error);
    } finally {
      setIsUpdating(false);
    }
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

  if (!currentInstance || !currentInstance.jsonFormat) {
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
              The workout instance could not be found or has no workout data.
            </p>
            <button onClick={handleClose} className="btn btn-primary">
              Back to Workouts
            </button>
          </div>
        </div>
      </div>
    );
  }

  const workoutTitle = currentInstance.jsonFormat.title || "Workout Session";
  const progressPercentage =
    workoutProgress.totalExercises > 0
      ? (workoutProgress.completedExercises / workoutProgress.totalExercises) *
        100
      : 0;

  return (
    <div className="min-h-screen bg-base-100">
      {/* Fixed Header with Progress */}
      <div className="fixed top-0 left-0 right-0 bg-base-100 border-b border-base-300 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex-1 pr-4">
            <h1 className="text-lg font-semibold text-base-content truncate">
              {workoutTitle}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="text-xs text-base-content/70">
                {workoutProgress.completedExercises} of{" "}
                {workoutProgress.totalExercises} exercises
              </div>
              <div className="text-xs badge badge-primary">
                {Math.round(progressPercentage)}%
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Close workout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-base-200 h-1">
          <div
            className="bg-primary h-1 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Fixed Progress Indicator (Mobile) */}
      <div className="fixed bottom-6 right-6 z-40 lg:hidden">
        <div className="bg-primary text-primary-content rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
          <div className="text-center">
            <div className="text-xs font-bold">
              {Math.round(progressPercentage)}%
            </div>
            <div className="text-xs opacity-80">done</div>
          </div>
        </div>
      </div>

      {/* Workout Content */}
      <div className="pt-24 pb-8 px-4 max-w-4xl mx-auto">
        {/* Workout Header Info */}
        <div className="bg-base-200 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {workoutProgress.completedExercises}
              </div>
              <div className="text-xs text-base-content/70">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-base-content">
                {workoutProgress.totalExercises}
              </div>
              <div className="text-xs text-base-content/70">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {currentInstance.duration || 0}
                <span className="text-sm">m</span>
              </div>
              <div className="text-xs text-base-content/70">Duration</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">
                {new Date(currentInstance.performedAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  }
                )}
              </div>
              <div className="text-xs text-base-content/70">Date</div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {currentInstance.jsonFormat.sections.map((section, sectionIndex) => (
            <SectionCard
              key={sectionIndex}
              section={section}
              sectionIndex={sectionIndex}
              exerciseStates={exerciseStates}
              onExerciseComplete={handleExerciseComplete}
            />
          ))}
        </div>

        {/* Complete Workout Button */}
        {progressPercentage === 100 && !currentInstance.completed && (
          <div className="mt-8 text-center">
            <button
              onClick={handleCompleteWorkout}
              disabled={isUpdating}
              className="btn btn-success btn-lg"
            >
              {isUpdating ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Completing...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Complete Workout
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Section Component
function SectionCard({
  section,
  sectionIndex,
  exerciseStates,
  onExerciseComplete,
}: {
  section: Section;
  sectionIndex: number;
  exerciseStates: ExerciseCompletionState;
  onExerciseComplete: (exerciseId: string, completed: boolean) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const exercises = Array.isArray(section.exercises) ? section.exercises : [];
  const completedInSection = exercises.filter(
    (_, idx) =>
      exerciseStates[`section-${sectionIndex}-exercise-${idx}`]?.completed
  ).length;

  return (
    <div className="bg-base-100 rounded-lg shadow-sm border border-base-300">
      <div
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="text-xl font-bold">
            {section.name || "Unnamed Section"}
          </h3>
          <div className="flex gap-2 mt-1">
            <div className="badge badge-outline">
              {section.type || "Standard"}
            </div>
            {section.rounds && section.rounds > 1 && (
              <div className="badge badge-primary">{section.rounds} rounds</div>
            )}
            <div className="badge badge-success">
              {completedInSection}/{exercises.length} complete
            </div>
          </div>
        </div>
        <button className="btn btn-circle btn-sm">
          {isExpanded ? "−" : "+"}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 pt-0 space-y-3">
          {exercises.map((exercise: Exercise, exerciseIndex: number) => (
            <ExerciseCard
              key={exerciseIndex}
              exercise={exercise}
              exerciseId={`section-${sectionIndex}-exercise-${exerciseIndex}`}
              exerciseState={
                exerciseStates[
                  `section-${sectionIndex}-exercise-${exerciseIndex}`
                ]
              }
              onComplete={onExerciseComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Exercise Card Component
function ExerciseCard({
  exercise,
  exerciseId,
  exerciseState,
  onComplete,
}: {
  exercise: Exercise;
  exerciseId: string;
  exerciseState?: ExerciseCompletionState[string];
  onComplete: (exerciseId: string, completed: boolean) => void;
}) {
  const isCompleted = exerciseState?.completed || false;

  const formatExerciseDetails = () => {
    const details = [];
    if (exercise.sets) details.push(`${exercise.sets} sets`);
    if (exercise.reps) details.push(`${exercise.reps} reps`);
    if (exercise.weight) details.push(`${exercise.weight} lbs`);
    if (exercise.duration) details.push(`${exercise.duration}s`);
    return details.join(" × ");
  };

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
        isCompleted
          ? "bg-success bg-opacity-10 border-success"
          : "bg-base-200 border-base-300 hover:border-primary"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h4
              className={`font-semibold ${
                isCompleted ? "line-through opacity-70" : ""
              }`}
            >
              {exercise.name}
            </h4>
            {isCompleted && <Check className="w-5 h-5 text-success" />}
          </div>

          {formatExerciseDetails() && (
            <div className="text-sm text-base-content/70 mt-1">
              <Target className="w-4 h-4 inline mr-1" />
              {formatExerciseDetails()}
            </div>
          )}

          {exercise.description && (
            <div className="text-sm text-base-content/60 mt-1">
              {exercise.description}
            </div>
          )}

          {exercise.rest && (
            <div className="text-sm text-base-content/60 mt-1">
              <Clock className="w-4 h-4 inline mr-1" />
              Rest: {exercise.rest}s
            </div>
          )}
        </div>

        <div className="ml-4">
          <button
            onClick={() => onComplete(exerciseId, !isCompleted)}
            className={`btn btn-circle ${
              isCompleted ? "btn-success" : "btn-outline btn-primary"
            }`}
          >
            {isCompleted ? (
              <Check className="w-5 h-5" />
            ) : (
              <div className="w-5 h-5 border-2 border-current rounded-full" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
