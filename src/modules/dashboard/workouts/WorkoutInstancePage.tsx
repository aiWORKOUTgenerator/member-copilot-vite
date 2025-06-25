"use client";

import { useCurrentWorkoutInstance } from "@/contexts/CurrentWorkoutInstanceContext";
import { RecommendedExercise } from "@/domain/interfaces/services/WorkoutInstanceService";
import { useWorkoutInstances } from "@/contexts/WorkoutInstancesContext";
import { useTrainerPersonaData } from "@/contexts/TrainerPersonaContext";
import { Exercise, Section } from "@/domain/entities/generatedWorkout";
import { ExerciseInstance } from "@/domain/entities/workoutInstance";
import { Check, Clock, Target, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
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

interface SwapExerciseState {
  isOpen: boolean;
  exerciseId: string | null;
  sectionIndex: number | null;
  exerciseIndex: number | null;
  currentExercise: Exercise | null;
}

interface CustomExercise {
  name: string;
  description: string;
  sets: number | "";
  reps: number | "";
  weight: number | "";
  duration: number | "";
  rest: number | "";
}

export default function WorkoutInstancePage() {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const {
    currentInstance,
    isLoading,
    updateInstance,
    updateInstanceJsonFormatOptimistically,
    getExerciseRecommendations,
  } = useCurrentWorkoutInstance();

  const { updateInstanceInList } = useWorkoutInstances();

  // Direct API call to complete workout immediately
  const completeWorkoutImmediately = async () => {
    console.log("completeWorkoutImmediately");
    if (!currentInstance) {
      console.error("No current instance available");
      return;
    }

    try {
      console.log("Making immediate API call to complete workout...");

      // Calculate duration
      const duration = Math.round(
        (new Date().getTime() -
          new Date(currentInstance.performedAt).getTime()) /
          60000
      );

      // Make direct API call to complete the workout
      const updatedInstance = await updateInstance(currentInstance.id, {
        completed: true,
        duration: duration,
      });

      console.log("Workout completed successfully via API");

      // Update the workout instances list with the completed instance
      updateInstanceInList(updatedInstance);

      // Navigate back immediately after API success
      navigate("/dashboard/workouts");
    } catch (error) {
      console.error("Failed to complete workout via API:", error);
      // Could show error toast here
    }
  };
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

  // New state for exercise swapping
  const [swapExerciseState, setSwapExerciseState] = useState<SwapExerciseState>(
    {
      isOpen: false,
      exerciseId: null,
      sectionIndex: null,
      exerciseIndex: null,
      currentExercise: null,
    }
  );
  const [recommendedExercises, setRecommendedExercises] = useState<
    RecommendedExercise[]
  >([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [activeTab, setActiveTab] = useState<"recommended" | "custom">(
    "recommended"
  );
  const [customExercise, setCustomExercise] = useState<CustomExercise>({
    name: "",
    description: "",
    sets: "",
    reps: "",
    weight: "",
    duration: "",
    rest: "",
  });

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

      // Don't allow editing if workout is already completed
      if (currentInstance.completed) {
        console.log("Cannot modify exercises - workout is already completed");
        return;
      }

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
        updateInstanceJsonFormatOptimistically(updatedJsonFormat);

        // Track last completed exercise for auto-scroll
        if (completed) {
          setLastCompletedExercise(exerciseId);
        }
      }
    },
    [currentInstance, updateInstanceJsonFormatOptimistically]
  );

  const handleExerciseNotes = useCallback(
    (exerciseId: string, notes: string) => {
      if (!currentInstance?.jsonFormat) return;

      // Don't allow editing if workout is already completed
      if (currentInstance.completed) {
        console.log("Cannot modify notes - workout is already completed");
        return;
      }

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
        updateInstanceJsonFormatOptimistically(updatedJsonFormat);
      }
    },
    [currentInstance, updateInstanceJsonFormatOptimistically]
  );

  const handleMarkAllComplete = useCallback(async () => {
    if (!currentInstance?.jsonFormat?.sections) return;

    // Don't allow marking all complete if workout is already completed
    if (currentInstance.completed) {
      console.log("Cannot mark all complete - workout is already completed");
      return;
    }

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
    updateInstanceJsonFormatOptimistically(updatedJsonFormat);

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
  }, [currentInstance, updateInstanceJsonFormatOptimistically]);

  const handleCompleteWorkout = async () => {
    console.log("handleCompleteWorkout");
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

    // Complete the workout immediately via API if 100% done
    await completeWorkoutImmediately();
  };

  const handleConfirmComplete = async () => {
    setShowCompleteConfirm(false);
    await completeWorkoutImmediately();
  };

  const handleCancelComplete = () => {
    setShowCompleteConfirm(false);
  };

  const handleExerciseSwap = useCallback(
    (
      exerciseId: string,
      sectionIndex: number,
      exerciseIndex: number,
      currentExercise: Exercise
    ) => {
      if (currentInstance?.completed) {
        console.log("Cannot swap exercises - workout is already completed");
        return;
      }

      setSwapExerciseState({
        isOpen: true,
        exerciseId,
        sectionIndex,
        exerciseIndex,
        currentExercise,
      });
      setActiveTab("recommended");

      // Load recommended exercises
      loadRecommendedExercises(currentExercise);
    },
    [currentInstance]
  );

  const loadRecommendedExercises = async (currentExercise: Exercise) => {
    setIsLoadingRecommendations(true);
    try {
      const recommendations = await getExerciseRecommendations(currentExercise);
      setRecommendedExercises(recommendations);
    } catch (error) {
      console.error("Error loading recommendations:", error);
      setRecommendedExercises([]);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleSwapWithRecommended = (
    recommendedExercise: RecommendedExercise
  ) => {
    if (
      swapExerciseState.sectionIndex === null ||
      swapExerciseState.exerciseIndex === null ||
      !currentInstance?.jsonFormat
    ) {
      return;
    }

    const updatedJsonFormat = JSON.parse(
      JSON.stringify(currentInstance.jsonFormat)
    );
    const newExercise = {
      name: recommendedExercise.name,
      description: recommendedExercise.description,
      sets: recommendedExercise.sets,
      reps: recommendedExercise.reps,
      weight: recommendedExercise.weight,
      duration: recommendedExercise.duration,
      rest: recommendedExercise.rest,
      completed: false,
      notes: "",
    };

    updatedJsonFormat.sections[swapExerciseState.sectionIndex!].exercises[
      swapExerciseState.exerciseIndex!
    ] = newExercise;
    updateInstanceJsonFormatOptimistically(updatedJsonFormat);
    closeSwapModal();
  };

  const handleSwapWithCustom = () => {
    if (
      !customExercise.name.trim() ||
      swapExerciseState.sectionIndex === null ||
      swapExerciseState.exerciseIndex === null ||
      !currentInstance?.jsonFormat
    ) {
      return;
    }

    const updatedJsonFormat = JSON.parse(
      JSON.stringify(currentInstance.jsonFormat)
    );
    const newExercise = {
      name: customExercise.name.trim(),
      description: customExercise.description.trim(),
      sets: customExercise.sets || undefined,
      reps: customExercise.reps || undefined,
      weight: customExercise.weight || undefined,
      duration: customExercise.duration || undefined,
      rest: customExercise.rest || undefined,
      completed: false,
      notes: "",
    };

    updatedJsonFormat.sections[swapExerciseState.sectionIndex].exercises[
      swapExerciseState.exerciseIndex
    ] = newExercise;
    updateInstanceJsonFormatOptimistically(updatedJsonFormat);
    closeSwapModal();
  };

  const closeSwapModal = () => {
    setSwapExerciseState({
      isOpen: false,
      exerciseId: null,
      sectionIndex: null,
      exerciseIndex: null,
      currentExercise: null,
    });
    setRecommendedExercises([]);
    setCustomExercise({
      name: "",
      description: "",
      sets: "",
      reps: "",
      weight: "",
      duration: "",
      rest: "",
    });
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
              {currentInstance.completed ? (
                <div className="flex items-center gap-2">
                  <div className="text-xs badge badge-success gap-1">
                    <Check className="w-3 h-3" />
                    Completed
                  </div>
                  <div className="text-xs text-base-content/70">
                    {currentInstance.duration || 0}m duration
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-xs text-base-content/70">
                    {workoutProgress.completedExercises} of{" "}
                    {workoutProgress.totalExercises} exercises
                  </div>
                  <div className="text-xs badge badge-primary">
                    {Math.round(progressPercentage)}%
                  </div>
                </>
              )}
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

        {/* Completed Workout Notice */}
        {currentInstance.completed && (
          <div className="bg-success bg-opacity-10 border border-success rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-success rounded-full p-2">
                <Check className="w-5 h-5 text-success-content" />
              </div>
              <div>
                <h3 className="font-semibold text-success">
                  Workout Completed!
                </h3>
                <p className="text-sm text-base-content/70">
                  This workout is now read-only. Exercise completion and notes
                  cannot be modified.
                </p>
              </div>
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
              onExerciseSwap={handleExerciseSwap}
              disabled={currentInstance.completed}
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

      {/* Exercise Swap Modal */}
      {swapExerciseState.isOpen && (
        <SwapExerciseModal
          isOpen={swapExerciseState.isOpen}
          onClose={closeSwapModal}
          currentExercise={swapExerciseState.currentExercise}
          recommendedExercises={recommendedExercises}
          isLoadingRecommendations={isLoadingRecommendations}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          customExercise={customExercise}
          onCustomExerciseChange={setCustomExercise}
          onSwapWithRecommended={handleSwapWithRecommended}
          onSwapWithCustom={handleSwapWithCustom}
        />
      )}
    </div>
  );
}

// Swap Exercise Modal Component
function SwapExerciseModal({
  isOpen,
  onClose,
  currentExercise,
  recommendedExercises,
  isLoadingRecommendations,
  activeTab,
  onTabChange,
  customExercise,
  onCustomExerciseChange,
  onSwapWithRecommended,
  onSwapWithCustom,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentExercise: Exercise | null;
  recommendedExercises: RecommendedExercise[];
  isLoadingRecommendations: boolean;
  activeTab: "recommended" | "custom";
  onTabChange: (tab: "recommended" | "custom") => void;
  customExercise: CustomExercise;
  onCustomExerciseChange: (exercise: CustomExercise) => void;
  onSwapWithRecommended: (exercise: RecommendedExercise) => void;
  onSwapWithCustom: () => void;
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCustomExerciseFieldChange = (
    field: keyof CustomExercise,
    value: string | number
  ) => {
    onCustomExerciseChange({
      ...customExercise,
      [field]: value,
    });
  };

  const isCustomExerciseValid = customExercise.name.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-base-content/20 backdrop-blur-md flex items-center justify-center z-50">
      {/* Mobile: Full screen modal */}
      <div className="lg:hidden fixed inset-0 bg-base-100 flex flex-col">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h2 className="text-lg font-semibold">Swap Exercise</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Exercise Info */}
        {currentExercise && (
          <div className="p-4 bg-base-200 border-b border-base-300">
            <h3 className="font-medium text-base-content/70 text-sm mb-1">
              Replacing:
            </h3>
            <p className="font-semibold">{currentExercise.name}</p>
          </div>
        )}

        {/* Mobile Tabs */}
        <div className="flex bg-base-200 rounded-xl p-1 m-4 mb-0 gap-1">
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "recommended"
                ? "bg-primary text-primary-content shadow-lg"
                : "text-base-content/70 hover:text-base-content hover:bg-base-300"
            }`}
            onClick={() => onTabChange("recommended")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-sm font-semibold">AI Recommended</span>
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "custom"
                ? "bg-secondary text-secondary-content shadow-lg"
                : "text-base-content/70 hover:text-base-content hover:bg-base-300"
            }`}
            onClick={() => onTabChange("custom")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="text-sm font-semibold">Add Your Own</span>
          </button>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "recommended" ? (
            <RecommendedExercisesTab
              exercises={recommendedExercises}
              isLoading={isLoadingRecommendations}
              onSelect={onSwapWithRecommended}
              currentExercise={currentExercise}
            />
          ) : (
            <CustomExerciseTab
              exercise={customExercise}
              onChange={handleCustomExerciseFieldChange}
              onSubmit={onSwapWithCustom}
              isValid={isCustomExerciseValid}
            />
          )}
        </div>
      </div>

      {/* Desktop: Regular modal */}
      <div className="hidden lg:block max-w-4xl w-full mx-4 max-h-[90vh] bg-base-100 rounded-lg shadow-xl overflow-hidden">
        {/* Desktop Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <div>
            <h2 className="text-xl font-semibold">Swap Exercise</h2>
            {currentExercise && (
              <p className="text-sm text-base-content/70 mt-1">
                Replacing:{" "}
                <span className="font-medium">{currentExercise.name}</span>
              </p>
            )}
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Tabs */}
        <div className="flex bg-base-200 rounded-xl p-1 m-6 mb-0 gap-1">
          <button
            className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "recommended"
                ? "bg-primary text-primary-content shadow-lg transform scale-[1.02]"
                : "text-base-content/70 hover:text-base-content hover:bg-base-300 hover:scale-[1.01]"
            }`}
            onClick={() => onTabChange("recommended")}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-base font-semibold">AI Recommended</span>
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "custom"
                ? "bg-secondary text-secondary-content shadow-lg transform scale-[1.02]"
                : "text-base-content/70 hover:text-base-content hover:bg-base-300 hover:scale-[1.01]"
            }`}
            onClick={() => onTabChange("custom")}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="text-base font-semibold">Add Your Own</span>
          </button>
        </div>

        {/* Desktop Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === "recommended" ? (
            <RecommendedExercisesTab
              exercises={recommendedExercises}
              isLoading={isLoadingRecommendations}
              onSelect={onSwapWithRecommended}
              currentExercise={currentExercise}
            />
          ) : (
            <CustomExerciseTab
              exercise={customExercise}
              onChange={handleCustomExerciseFieldChange}
              onSubmit={onSwapWithCustom}
              isValid={isCustomExerciseValid}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Recommended Exercises Tab Component
function RecommendedExercisesTab({
  exercises,
  isLoading,
  onSelect,
  currentExercise,
}: {
  exercises: RecommendedExercise[];
  isLoading: boolean;
  onSelect: (exercise: RecommendedExercise) => void;
  currentExercise: Exercise | null;
}) {
  const trainerPersona = useTrainerPersonaData();

  // Set loading message once when component mounts/loading starts
  const [loadingMessage] = useState(() => {
    const exerciseName = currentExercise?.name || "this exercise";
    const messages = [
      `Thinking about some great alternatives to ${exerciseName}...`,
      `Hold on while I analyze better options than ${exerciseName}...`,
      `Let me find you something even better than ${exerciseName}...`,
      `Scanning my database for ${exerciseName} alternatives...`,
      `Cooking up some alternatives to ${exerciseName}...`,
      `Give me a sec to find the perfect swap for ${exerciseName}...`,
      `Analyzing movement patterns similar to ${exerciseName}...`,
      `Finding exercises that'll challenge you like ${exerciseName}...`,
      `Let me think outside the box for ${exerciseName} alternatives...`,
      `Searching for the perfect replacement for ${exerciseName}...`,
      `Working on some creative alternatives to ${exerciseName}...`,
      `Let me find exercises that target the same muscles as ${exerciseName}...`,
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-sm">
          {/* Trainer Avatar */}
          {trainerPersona && (
            <div className="flex items-center justify-center mb-4">
              <div className="avatar">
                <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  {trainerPersona.avatar_url ? (
                    <img
                      src={trainerPersona.avatar_url}
                      alt={trainerPersona.trainer_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-primary text-primary-content flex items-center justify-center w-full h-full text-xl font-bold">
                      {trainerPersona.trainer_name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Loading Spinner */}
          <span className="loading loading-spinner loading-lg text-primary mb-4"></span>

          {/* Trainer Name and Message */}
          {trainerPersona ? (
            <div>
              <p className="font-semibold text-lg mb-2">
                {trainerPersona.trainer_name}
              </p>
              <p className="text-base-content/70 text-sm italic">
                "{loadingMessage}"
              </p>
            </div>
          ) : (
            <p className="text-base-content/70">
              AI is finding the best exercise alternatives...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-base-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-base-content/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.9.785-5.291 2.083m10.582 0A7.962 7.962 0 0112 15a7.962 7.962 0 00-5.291 2.083m10.582 0L21 21m-9-6v6m-3-3l3-3m0 0l3 3"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">
          No recommendations available
        </h3>
        <p className="text-base-content/70">
          Try the "Add Your Own" tab to create a custom exercise.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with trainer persona */}
      {trainerPersona && (
        <div className="flex items-center gap-3 p-4 bg-base-200 rounded-lg mb-4">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full">
              {trainerPersona.avatar_url ? (
                <img
                  src={trainerPersona.avatar_url}
                  alt={trainerPersona.trainer_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-primary text-primary-content flex items-center justify-center w-full h-full text-sm font-bold">
                  {trainerPersona.trainer_name.charAt(0)}
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="font-medium text-sm">
              {trainerPersona.trainer_name} suggests:
            </p>
            <p className="text-xs text-base-content/70">
              "These alternatives will keep you moving forward!"
            </p>
          </div>
        </div>
      )}

      <p className="text-base-content/70 text-sm">
        Here are AI-recommended alternatives based on your current exercise:
      </p>

      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className="bg-base-200 border border-base-300 rounded-lg p-4 hover:border-primary transition-colors"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-lg mb-2">{exercise.name}</h4>
              <p className="text-base-content/70 text-sm mb-3">
                {exercise.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                {exercise.sets && (
                  <div className="badge badge-outline">
                    {exercise.sets} sets
                  </div>
                )}
                {exercise.reps && (
                  <div className="badge badge-outline">
                    {exercise.reps} reps
                  </div>
                )}
                {exercise.weight && (
                  <div className="badge badge-outline">
                    {exercise.weight} lbs
                  </div>
                )}
                {exercise.duration && (
                  <div className="badge badge-outline">
                    {exercise.duration}s
                  </div>
                )}
                {exercise.rest && (
                  <div className="badge badge-outline">
                    Rest: {exercise.rest}s
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <div
                  className={`badge ${
                    exercise.difficulty === "Beginner"
                      ? "badge-success"
                      : exercise.difficulty === "Intermediate"
                      ? "badge-warning"
                      : "badge-error"
                  }`}
                >
                  {exercise.difficulty}
                </div>
                {exercise.targetMuscles.map((muscle) => (
                  <div
                    key={muscle}
                    className="badge badge-primary badge-outline"
                  >
                    {muscle}
                  </div>
                ))}
              </div>

              {exercise.equipment && exercise.equipment.length > 0 && (
                <div className="text-xs text-base-content/60">
                  Equipment: {exercise.equipment.join(", ")}
                </div>
              )}
            </div>

            <button
              onClick={() => onSelect(exercise)}
              className="btn btn-primary btn-sm flex-shrink-0"
            >
              Select
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Custom Exercise Tab Component
function CustomExerciseTab({
  exercise,
  onChange,
  onSubmit,
  isValid,
}: {
  exercise: CustomExercise;
  onChange: (field: keyof CustomExercise, value: string | number) => void;
  onSubmit: () => void;
  isValid: boolean;
}) {
  const trainerPersona = useTrainerPersonaData();

  // Set encouraging message once when component mounts
  const [encouragingMessage] = useState(() => {
    const messages = [
      "Great choice taking control of your workout!",
      "I love when you customize your training!",
      "You know your body best - let's make this work for you!",
      "Creating your own exercise shows real dedication!",
      "This is how champions adapt their training!",
      "Your creativity in training is impressive!",
      "Let's build something that challenges you perfectly!",
      "I'm here to support your custom exercise choice!",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  });

  return (
    <div className="space-y-6">
      {/* Header with trainer persona */}
      {trainerPersona && (
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg border border-secondary/20">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full">
              {trainerPersona.avatar_url ? (
                <img
                  src={trainerPersona.avatar_url}
                  alt={trainerPersona.trainer_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-secondary text-secondary-content flex items-center justify-center w-full h-full text-lg font-bold">
                  {trainerPersona.trainer_name.charAt(0)}
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="font-medium text-sm">
              {trainerPersona.trainer_name} says:
            </p>
            <p className="text-xs text-base-content/70 italic">
              "{encouragingMessage}"
            </p>
          </div>
        </div>
      )}

      <p className="text-base-content/70 text-sm">
        Create your own custom exercise with the details below:
      </p>

      {/* Exercise Name & Description */}
      <div className="grid gap-4">
        <div>
          <label className="label">
            <span className="label-text font-medium">Exercise Name *</span>
          </label>
          <input
            type="text"
            value={exercise.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Enter exercise name"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Description</span>
          </label>
          <textarea
            value={exercise.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Describe how to perform this exercise (optional)"
            className="textarea textarea-bordered w-full"
            rows={3}
          />
        </div>
      </div>

      {/* Exercise Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">
            <span className="label-text font-medium">Sets</span>
          </label>
          <input
            type="number"
            value={exercise.sets}
            onChange={(e) =>
              onChange("sets", e.target.value ? parseInt(e.target.value) : "")
            }
            placeholder="Number of sets"
            className="input input-bordered w-full"
            min="1"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Reps</span>
          </label>
          <input
            type="number"
            value={exercise.reps}
            onChange={(e) =>
              onChange("reps", e.target.value ? parseInt(e.target.value) : "")
            }
            placeholder="Reps per set"
            className="input input-bordered w-full"
            min="1"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Weight (lbs)</span>
          </label>
          <input
            type="number"
            value={exercise.weight}
            onChange={(e) =>
              onChange(
                "weight",
                e.target.value ? parseFloat(e.target.value) : ""
              )
            }
            placeholder="Weight in pounds"
            className="input input-bordered w-full"
            min="0"
            step="0.5"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Duration (seconds)</span>
          </label>
          <input
            type="number"
            value={exercise.duration}
            onChange={(e) =>
              onChange(
                "duration",
                e.target.value ? parseInt(e.target.value) : ""
              )
            }
            placeholder="Duration in seconds"
            className="input input-bordered w-full"
            min="1"
          />
        </div>

        <div className="md:col-span-2">
          <label className="label">
            <span className="label-text font-medium">Rest (seconds)</span>
          </label>
          <input
            type="number"
            value={exercise.rest}
            onChange={(e) =>
              onChange("rest", e.target.value ? parseInt(e.target.value) : "")
            }
            placeholder="Rest time in seconds"
            className="input input-bordered w-full"
            min="0"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onSubmit}
          disabled={!isValid}
          className="btn btn-primary btn-lg"
        >
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
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          Replace Exercise
        </button>
      </div>
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
    onExerciseSwap: (
      exerciseId: string,
      sectionIndex: number,
      exerciseIndex: number,
      currentExercise: Exercise
    ) => void;
    disabled?: boolean;
  }
>(
  (
    {
      section,
      sectionIndex,
      onExerciseComplete,
      onExerciseNotes,
      onExerciseSwap,
      disabled = false,
    },
    ref
  ) => {
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
                <div className="badge badge-primary">
                  {section.rounds} rounds
                </div>
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
                onSwap={onExerciseSwap}
                disabled={disabled}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

SectionCard.displayName = "SectionCard";

// Exercise Card Component
function ExerciseCard({
  exercise,
  exerciseId,
  onComplete,
  onNotes,
  onSwap,
  disabled = false,
}: {
  exercise: Exercise;
  exerciseId: string;
  onComplete: (exerciseId: string, completed: boolean) => void;
  onNotes: (exerciseId: string, notes: string) => void;
  onSwap: (
    exerciseId: string,
    sectionIndex: number,
    exerciseIndex: number,
    currentExercise: Exercise
  ) => void;
  disabled?: boolean;
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
    if (disabled) return;
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
            <h4 className="font-semibold">{exercise.name}</h4>
            {isCompleted && (
              <div className="badge badge-success badge-sm gap-1">
                <Check className="w-3 h-3" />
                Done
              </div>
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
                className={`min-h-[44px] p-3 rounded-lg border border-base-300 transition-all duration-200 ${
                  disabled
                    ? "cursor-default opacity-60"
                    : "cursor-text hover:border-primary/50 hover:bg-base-100/50"
                } ${
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
                    {disabled
                      ? "Notes (read-only)"
                      : "Tap to add notes about this exercise..."}
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

        {/* Action Buttons */}
        <div className="flex-shrink-0 self-start flex gap-2">
          {/* Swap Exercise Button */}
          {!disabled && (
            <button
              onClick={() => {
                const [, sectionIndexStr, , exerciseIndexStr] =
                  exerciseId.split("-");
                const sectionIndex = parseInt(sectionIndexStr);
                const exerciseIndex = parseInt(exerciseIndexStr);
                onSwap(exerciseId, sectionIndex, exerciseIndex, exercise);
              }}
              className="btn btn-ghost btn-circle w-10 h-10 hover:bg-base-300 transition-all duration-200"
              aria-label="Swap this exercise"
              title="Swap exercise"
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
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>
          )}

          {/* Completion Button */}
          <button
            onClick={() => !disabled && onComplete(exerciseId, !isCompleted)}
            disabled={disabled}
            className={`btn btn-circle w-12 h-12 transition-all duration-200 ${
              disabled
                ? "btn-disabled opacity-60 cursor-not-allowed"
                : isCompleted
                ? "btn-success shadow-lg"
                : "btn-outline btn-primary hover:scale-105"
            }`}
            aria-label={
              disabled
                ? "Exercise completion locked (workout completed)"
                : isCompleted
                ? "Mark as incomplete"
                : "Mark as complete"
            }
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
