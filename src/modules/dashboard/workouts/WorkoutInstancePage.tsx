"use client";

import {
  useWorkoutInstances,
  useCurrentWorkoutInstance,
  useCurrentWorkoutInstanceLoading,
} from "@/contexts/WorkoutInstanceContext";
import { ExerciseInstance } from "@/domain/entities/workoutInstance";
import { Exercise, Section } from "@/domain/entities/generatedWorkout";
import { Check, X, Clock, Target } from "lucide-react";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useTrainerPersonaData } from "@/contexts/TrainerPersonaContext";
import { TrainerPersonaDisplay } from "./components/TrainerPersonaDisplay";

interface WorkoutProgress {
  totalExercises: number;
  completedExercises: number;
  currentSectionIndex: number;
  currentExerciseIndex: number;
}

interface ScrollProgress {
  scrollPercentage: number;
  currentSectionIndex: number;
  sectionsInView: boolean[];
}

export default function WorkoutInstancePage() {
  const params = useParams();
  const navigate = useNavigate();
  const instanceId = params?.id as string;
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const {
    loadCurrentInstance,
    clearCurrentInstance,
    updateCurrentInstanceOptimistically,
    updateCurrentInstanceJsonFormatOptimistically,
    syncCurrentInstanceToServer,
  } = useWorkoutInstances();
  const currentInstance = useCurrentWorkoutInstance();
  const isLoading = useCurrentWorkoutInstanceLoading();
  const trainerPersona = useTrainerPersonaData();

  const [workoutProgress, setWorkoutProgress] = useState<WorkoutProgress>({
    totalExercises: 0,
    completedExercises: 0,
    currentSectionIndex: 0,
    currentExerciseIndex: 0,
  });
  const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({
    scrollPercentage: 0,
    currentSectionIndex: 0,
    sectionsInView: [],
  });
  const [lastCompletedExercise, setLastCompletedExercise] = useState<
    string | null
  >(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [isMarkingAllComplete, setIsMarkingAllComplete] = useState(false);

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

  // Calculate progress whenever current instance changes
  useEffect(() => {
    if (currentInstance?.jsonFormat?.sections) {
      const sections = currentInstance.jsonFormat.sections;
      let totalExercises = 0;
      let completedExercises = 0;

      sections.forEach((section) => {
        section.exercises?.forEach((exercise) => {
          totalExercises++;
          if ((exercise as ExerciseInstance).completed) {
            completedExercises++;
          }
        });
      });

      setWorkoutProgress({
        totalExercises,
        completedExercises,
        currentSectionIndex: 0,
        currentExerciseIndex: 0,
      });

      // Initialize section refs array
      sectionRefs.current = new Array(sections.length).fill(null);
      setScrollProgress((prev) => ({
        ...prev,
        sectionsInView: new Array(sections.length).fill(false),
      }));
    }
  }, [currentInstance]);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const scrollTop = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage =
        documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

      // Find which section is currently most visible
      let currentSectionIndex = 0;
      const sectionsInView = new Array(sectionRefs.current.length).fill(false);

      sectionRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const isInView =
            rect.top < window.innerHeight / 2 &&
            rect.bottom > window.innerHeight / 2;
          sectionsInView[index] = isInView;

          if (isInView) {
            currentSectionIndex = index;
          }
        }
      });

      setScrollProgress({
        scrollPercentage: Math.min(scrollPercentage, 100),
        currentSectionIndex,
        sectionsInView,
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentInstance?.jsonFormat?.sections]);

  // Auto-scroll to next incomplete exercise when one is completed
  useEffect(() => {
    if (!lastCompletedExercise || !currentInstance?.jsonFormat?.sections)
      return;

    const scrollToNextIncompleteExercise = () => {
      // Parse the completed exercise ID to find its position
      const [, completedSectionIndexStr, , completedExerciseIndexStr] =
        lastCompletedExercise.split("-");
      const completedSectionIndex = parseInt(completedSectionIndexStr);
      const completedExerciseIndex = parseInt(completedExerciseIndexStr);

      // Find the next incomplete exercise in the data structure
      let nextExerciseId: string | null = null;
      const sections = currentInstance.jsonFormat!.sections;

      // Start searching from the completed exercise onwards
      for (
        let sectionIndex = completedSectionIndex;
        sectionIndex < sections.length;
        sectionIndex++
      ) {
        const section = sections[sectionIndex];
        if (!section.exercises) continue;

        // For the same section as completed exercise, start from next exercise
        // For other sections, start from first exercise
        const startExerciseIndex =
          sectionIndex === completedSectionIndex
            ? completedExerciseIndex + 1
            : 0;

        for (
          let exerciseIndex = startExerciseIndex;
          exerciseIndex < section.exercises.length;
          exerciseIndex++
        ) {
          const exercise = section.exercises[exerciseIndex] as ExerciseInstance;
          if (!exercise.completed) {
            nextExerciseId = `section-${sectionIndex}-exercise-${exerciseIndex}`;
            break;
          }
        }

        if (nextExerciseId) break;
      }

      // If we found a next incomplete exercise, scroll to it
      if (nextExerciseId) {
        const nextElement = document.querySelector(
          `[data-exercise-id="${nextExerciseId}"]`
        );
        if (nextElement) {
          const rect = nextElement.getBoundingClientRect();
          const currentScrollY = window.scrollY;
          const elementTop = currentScrollY + rect.top;

          // Only scroll if the next exercise is below the current viewport
          // Add buffer to account for fixed header (120px) plus some extra space (50px)
          if (elementTop > currentScrollY + window.innerHeight - 170) {
            // Scroll so the exercise is centered in viewport, accounting for fixed header
            const headerHeight = 120; // Fixed header height
            const viewportCenter = window.innerHeight / 2;
            const targetScrollY = elementTop - viewportCenter - headerHeight;

            window.scrollTo({
              top: Math.max(0, targetScrollY),
              behavior: "smooth",
            });
          }
        }
      }
    };

    // Small delay to allow DOM to update after state change
    const timeoutId = setTimeout(scrollToNextIncompleteExercise, 400);
    return () => clearTimeout(timeoutId);
  }, [lastCompletedExercise, currentInstance]);

  const handleClose = () => {
    const progressPercentage =
      workoutProgress.totalExercises > 0
        ? (workoutProgress.completedExercises /
            workoutProgress.totalExercises) *
          100
        : 0;

    if (progressPercentage > 0 && !currentInstance?.completed) {
      setShowExitConfirm(true);
    } else {
      navigate("/dashboard/workouts");
    }
  };

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    navigate("/dashboard/workouts");
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
  };

  const handleExerciseComplete = useCallback(
    (exerciseId: string, completed: boolean) => {
      if (!currentInstance?.jsonFormat) return;

      // Parse the exerciseId to get section and exercise indices
      const [, sectionIndexStr, , exerciseIndexStr] = exerciseId.split("-");
      const sectionIndex = parseInt(sectionIndexStr);
      const exerciseIndex = parseInt(exerciseIndexStr);

      // Create a deep copy of the current jsonFormat
      const updatedJsonFormat = JSON.parse(
        JSON.stringify(currentInstance.jsonFormat)
      );

      // Update the specific exercise
      if (updatedJsonFormat.sections[sectionIndex]?.exercises[exerciseIndex]) {
        updatedJsonFormat.sections[sectionIndex].exercises[
          exerciseIndex
        ].completed = completed;

        // Update the local state optimistically
        updateCurrentInstanceJsonFormatOptimistically(updatedJsonFormat);

        // Track last completed exercise for auto-scroll
        if (completed) {
          setLastCompletedExercise(exerciseId);
        }
      }
    },
    [currentInstance, updateCurrentInstanceJsonFormatOptimistically]
  );

  const handleExerciseNotes = useCallback(
    (exerciseId: string, notes: string) => {
      if (!currentInstance?.jsonFormat) return;

      // Parse the exerciseId to get section and exercise indices
      const [, sectionIndexStr, , exerciseIndexStr] = exerciseId.split("-");
      const sectionIndex = parseInt(sectionIndexStr);
      const exerciseIndex = parseInt(exerciseIndexStr);

      // Create a deep copy of the current jsonFormat
      const updatedJsonFormat = JSON.parse(
        JSON.stringify(currentInstance.jsonFormat)
      );

      // Update the specific exercise notes
      if (updatedJsonFormat.sections[sectionIndex]?.exercises[exerciseIndex]) {
        updatedJsonFormat.sections[sectionIndex].exercises[
          exerciseIndex
        ].notes = notes;

        // Update the local state optimistically
        updateCurrentInstanceJsonFormatOptimistically(updatedJsonFormat);
      }
    },
    [currentInstance, updateCurrentInstanceJsonFormatOptimistically]
  );

  const handleMarkAllComplete = useCallback(async () => {
    if (!currentInstance?.jsonFormat?.sections) return;

    setIsMarkingAllComplete(true);

    // Create a deep copy and mark all exercises as completed
    const updatedJsonFormat = JSON.parse(
      JSON.stringify(currentInstance.jsonFormat)
    );

    updatedJsonFormat.sections.forEach(
      (section: { exercises?: { completed: boolean }[] }) => {
        section.exercises?.forEach((exercise: { completed: boolean }) => {
          exercise.completed = true;
        });
      }
    );

    // Update optimistically
    updateCurrentInstanceJsonFormatOptimistically(updatedJsonFormat);

    // Small delay for visual effect
    setTimeout(() => {
      setIsMarkingAllComplete(false);

      // Scroll to Complete Workout button
      const completeButton =
        document.querySelector('button:has-text("Complete Workout")') ||
        document.querySelector("[data-complete-workout]");
      if (completeButton) {
        completeButton.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else {
        // Fallback: scroll to bottom
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 1000);
  }, [currentInstance, updateCurrentInstanceJsonFormatOptimistically]);

  const handleCompleteWorkout = async () => {
    if (!currentInstance) return;

    // If workout is not 100% complete, show confirmation dialog
    const progressPercentage =
      workoutProgress.totalExercises > 0
        ? (workoutProgress.completedExercises /
            workoutProgress.totalExercises) *
          100
        : 0;

    if (progressPercentage < 100) {
      setShowCompleteConfirm(true);
      return;
    }

    // Complete the workout directly if 100% done
    await completeWorkoutDirectly();
  };

  const completeWorkoutDirectly = async () => {
    if (!currentInstance) return;

    try {
      // Update workout as completed with duration
      const duration = Math.round(
        (new Date().getTime() -
          new Date(currentInstance.performedAt).getTime()) /
          60000
      );

      updateCurrentInstanceOptimistically({
        completed: true,
        duration: duration,
      });

      // Sync to server
      await syncCurrentInstanceToServer();

      // Navigate back to workouts page after successful completion
      setTimeout(() => {
        navigate("/dashboard/workouts");
      }, 1000); // Small delay to show success state
    } catch (error) {
      console.error("Failed to complete workout:", error);
      // Could show error toast here
    }
  };

  const handleConfirmComplete = async () => {
    setShowCompleteConfirm(false);
    await completeWorkoutDirectly();
  };

  const handleCancelComplete = () => {
    setShowCompleteConfirm(false);
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

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Finish Workout Button - Show when there's progress and workout isn't completed */}
            {progressPercentage > 0 && !currentInstance.completed && (
              <button
                onClick={handleCompleteWorkout}
                disabled={isMarkingAllComplete}
                className="btn btn-primary btn-sm gap-1 hidden sm:flex"
                title="Finish workout now"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.5-7 1.5 2 2.5 5 2.5 7 2-1 2.657-2.657 2.657-2.657A8 8 0 0117.657 18.657z"
                  />
                </svg>
                <span className="hidden md:inline">Finish</span>
              </button>
            )}

            <button
              onClick={handleClose}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Close workout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-base-200 h-1">
          <div
            className="bg-primary h-1 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Vertical Progress Indicator (Desktop) */}
      <div className="hidden lg:block fixed left-6 top-1/2 transform -translate-y-1/2 z-40">
        <VerticalProgressIndicator
          sections={currentInstance.jsonFormat.sections}
          scrollProgress={scrollProgress}
        />
      </div>

      {/* Fixed Progress Indicator (Mobile) */}
      <div className="fixed bottom-6 right-6 z-40 lg:hidden">
        {!currentInstance.completed && progressPercentage > 0 ? (
          <button
            onClick={handleCompleteWorkout}
            disabled={isMarkingAllComplete}
            className="bg-primary hover:bg-primary-focus text-primary-content rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            title="Finish workout"
          >
            <div className="text-center">
              <svg
                className="w-5 h-5 mx-auto mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <div className="text-xs font-bold">Finish</div>
            </div>
          </button>
        ) : (
          <div className="bg-primary text-primary-content rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
            <div className="text-center">
              <div className="text-xs font-bold">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-xs opacity-80">done</div>
            </div>
          </div>
        )}
      </div>

      {/* Workout Content */}
      <div ref={contentRef} className="pt-24 pb-8 px-4 max-w-4xl mx-auto">
        {/* Trainer Persona Section */}
        {trainerPersona && (
          <div className="bg-base-100 border border-base-300 rounded-lg p-4 mb-6">
            <TrainerPersonaDisplay
              trainerPersona={trainerPersona}
              className="justify-center md:justify-start"
            />
            <div className="mt-3 text-center md:text-left">
              <p className="text-sm text-base-content/70">
                Your AI trainer is here to guide you through this workout
              </p>
            </div>
          </div>
        )}

        {/* Workout Header Info */}
        <div className="bg-base-200 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
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

          {/* Mark All Complete Button */}
          {progressPercentage < 100 && !currentInstance.completed && (
            <div className="flex justify-center">
              <button
                onClick={handleMarkAllComplete}
                disabled={isMarkingAllComplete}
                className="btn btn-outline btn-primary btn-sm gap-2"
              >
                {isMarkingAllComplete ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Marking Complete...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Mark All Complete
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {currentInstance.jsonFormat.sections.map((section, sectionIndex) => (
            <SectionCard
              key={sectionIndex}
              ref={(el) => {
                sectionRefs.current[sectionIndex] = el;
              }}
              section={section}
              sectionIndex={sectionIndex}
              onExerciseComplete={handleExerciseComplete}
              onExerciseNotes={handleExerciseNotes}
            />
          ))}
        </div>

        {/* Finish Workout Button */}
        {!currentInstance.completed && (
          <div className="mt-8 text-center">
            <button
              onClick={handleCompleteWorkout}
              disabled={isMarkingAllComplete}
              className="btn btn-primary btn-lg"
              data-complete-workout
            >
              {isMarkingAllComplete ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Finishing...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.5-7 1.5 2 2.5 5 2.5 7 2-1 2.657-2.657 2.657-2.657A8 8 0 0117.657 18.657z"
                    />
                  </svg>
                  Finish Workout
                  {progressPercentage < 100 && (
                    <span className="ml-2 text-xs opacity-70">
                      ({Math.round(progressPercentage)}% done)
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">Exit Workout?</h3>
              <p className="text-base-content/70 mb-6">
                You're {Math.round(progressPercentage)}% through your workout.
                Are you sure you want to exit? Your progress won't be saved.
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={handleCancelExit} className="btn btn-ghost">
                  Continue Workout
                </button>
                <button onClick={handleConfirmExit} className="btn btn-error">
                  Exit Workout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Workout Confirmation Modal */}
      {showCompleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">
                Complete Workout Early?
              </h3>
              <p className="text-base-content/70 mb-6">
                You're {Math.round(progressPercentage)}% through your workout.
                Are you sure you want to complete it now? You can always come
                back to finish the remaining exercises later.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancelComplete}
                  className="btn btn-ghost"
                >
                  Keep Going
                </button>
                <button
                  onClick={handleConfirmComplete}
                  className="btn btn-success"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Complete Workout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Vertical Progress Indicator Component
function VerticalProgressIndicator({
  sections,
  scrollProgress,
}: {
  sections: Section[];
  scrollProgress: ScrollProgress;
}) {
  const getSectionCompletion = (sectionIndex: number) => {
    const section = sections[sectionIndex];
    if (!section.exercises) return { completed: 0, total: 0 };

    const exercises = section.exercises;
    const total = exercises.length;
    const completed = exercises.filter(
      (exercise) => (exercise as ExerciseInstance).completed
    ).length;

    return { completed, total };
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Main progress line */}
      <div className="relative w-1 h-64 bg-base-300 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full bg-primary transition-all duration-300 ease-out"
          style={{ height: `${scrollProgress.scrollPercentage}%` }}
        />
      </div>

      {/* Section dots */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col h-64 justify-between py-2">
        {sections.map((section, index) => {
          const { completed, total } = getSectionCompletion(index);
          const isActive = scrollProgress.sectionsInView[index];
          const isCompleted = completed === total && total > 0;

          return (
            <div
              key={index}
              className={`relative group transition-all duration-200 ${
                isActive ? "scale-125" : "scale-100"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                  isCompleted
                    ? "bg-success border-success"
                    : isActive
                    ? "bg-primary border-primary"
                    : "bg-base-100 border-base-300"
                }`}
              />

              {/* Tooltip */}
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-base-100 border border-base-300 rounded-lg px-3 py-2 shadow-lg text-sm whitespace-nowrap">
                  <div className="font-medium">{section.name}</div>
                  <div className="text-xs text-base-content/70">
                    {completed}/{total} exercises
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Section Component
const SectionCard = React.forwardRef<
  HTMLDivElement,
  {
    section: Section;
    sectionIndex: number;
    onExerciseComplete: (exerciseId: string, completed: boolean) => void;
    onExerciseNotes: (exerciseId: string, notes: string) => void;
  }
>(({ section, sectionIndex, onExerciseComplete, onExerciseNotes }, ref) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const exercises = Array.isArray(section.exercises) ? section.exercises : [];
  const completedInSection = exercises.filter(
    (exercise) => (exercise as ExerciseInstance).completed
  ).length;

  return (
    <div
      ref={ref}
      className="bg-base-100 rounded-lg shadow-sm border border-base-300"
    >
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
              onComplete={onExerciseComplete}
              onNotes={onExerciseNotes}
            />
          ))}
        </div>
      )}
    </div>
  );
});

SectionCard.displayName = "SectionCard";

// Exercise Card Component
function ExerciseCard({
  exercise,
  exerciseId,
  onComplete,
  onNotes,
}: {
  exercise: Exercise;
  exerciseId: string;
  onComplete: (exerciseId: string, completed: boolean) => void;
  onNotes: (exerciseId: string, notes: string) => void;
}) {
  const exerciseInstance = exercise as ExerciseInstance;
  const isCompleted = exerciseInstance.completed || false;
  const notes = exerciseInstance.notes || "";

  // Local state for notes editing
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes);
  const notesTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Update local notes when exercise notes change
  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditingNotes && notesTextareaRef.current) {
      notesTextareaRef.current.focus();
      // On mobile, scroll the element into view
      if (window.innerWidth < 768) {
        setTimeout(() => {
          notesTextareaRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    }
  }, [isEditingNotes]);

  const formatExerciseDetails = () => {
    const details = [];
    if (exercise.sets) details.push(`${exercise.sets} sets`);
    if (exercise.reps) details.push(`${exercise.reps} reps`);
    if (exercise.weight) details.push(`${exercise.weight} lbs`);
    if (exercise.duration) details.push(`${exercise.duration}s`);
    return details.join(" × ");
  };

  const handleNotesClick = () => {
    setIsEditingNotes(true);
  };

  const handleNotesSave = () => {
    onNotes(exerciseId, localNotes);
    setIsEditingNotes(false);
  };

  const handleNotesCancel = () => {
    setLocalNotes(notes); // Revert to original
    setIsEditingNotes(false);
  };

  const handleNotesKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNotesSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleNotesCancel();
    }
  };

  const handleNotesBlur = () => {
    // Auto-save when losing focus
    handleNotesSave();
  };

  return (
    <div
      data-exercise-id={exerciseId}
      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
        isCompleted
          ? "bg-success bg-opacity-10 border-success"
          : "bg-base-200 border-base-300 hover:border-primary"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h4
              className={`font-semibold ${
                isCompleted ? "line-through opacity-70" : ""
              }`}
            >
              {exercise.name}
            </h4>
            {isCompleted && (
              <Check className="w-5 h-5 text-success flex-shrink-0" />
            )}
          </div>

          {formatExerciseDetails() && (
            <div className="text-sm text-base-content/70 mb-2">
              <Target className="w-4 h-4 inline mr-1" />
              {formatExerciseDetails()}
            </div>
          )}

          {exercise.description && (
            <div className="text-sm text-base-content/60 mb-2">
              {exercise.description}
            </div>
          )}

          {exercise.rest && (
            <div className="text-sm text-base-content/60 mb-3">
              <Clock className="w-4 h-4 inline mr-1" />
              Rest: {exercise.rest}s
            </div>
          )}

          {/* Enhanced Notes Section */}
          <div className="mt-3">
            <div className="text-xs font-medium text-base-content/70 mb-2 flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Notes
            </div>

            {isEditingNotes ? (
              <div className="relative">
                <textarea
                  ref={notesTextareaRef}
                  value={localNotes}
                  onChange={(e) => setLocalNotes(e.target.value)}
                  onKeyDown={handleNotesKeyDown}
                  onBlur={handleNotesBlur}
                  placeholder="Add notes about this exercise..."
                  className="w-full text-sm p-3 border-2 border-primary rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 bg-base-100 transition-all duration-200"
                  rows={3}
                  autoComplete="off"
                />
                <div className="absolute -bottom-6 left-0 text-xs text-base-content/50">
                  Press Enter to save, Esc to cancel
                </div>
              </div>
            ) : (
              <div
                onClick={handleNotesClick}
                className={`min-h-[44px] p-3 rounded-lg border border-base-300 cursor-text transition-all duration-200 hover:border-primary/50 hover:bg-base-100/50 ${
                  notes.trim()
                    ? "bg-base-100 text-base-content"
                    : "bg-base-200/50 text-base-content/50"
                }`}
              >
                {notes.trim() ? (
                  <div className="text-sm whitespace-pre-wrap break-words">
                    {notes}
                  </div>
                ) : (
                  <div className="text-sm italic">
                    Tap to add notes about this exercise...
                  </div>
                )}
                <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-3 h-3 text-base-content/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  <span className="text-xs text-base-content/40">
                    Click to edit
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Completion Button */}
        <div className="flex-shrink-0 self-start">
          <button
            onClick={() => onComplete(exerciseId, !isCompleted)}
            className={`btn btn-circle w-12 h-12 transition-all duration-200 ${
              isCompleted
                ? "btn-success shadow-lg"
                : "btn-outline btn-primary hover:scale-105"
            }`}
            aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
          >
            {isCompleted ? (
              <Check className="w-6 h-6" />
            ) : (
              <div className="w-6 h-6 border-2 border-current rounded-full opacity-60" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
