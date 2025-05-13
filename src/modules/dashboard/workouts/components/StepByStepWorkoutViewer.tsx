"use client";

import {
  Exercise,
  Section,
  WorkoutStructure,
} from "@/domain/entities/generatedWorkout";
import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  ExerciseCard,
  formatTime,
  InvalidWorkoutCard,
  EmptySectionsCard,
} from "./WorkoutComponents";

// Type for a flattened workout step
type WorkoutStep = {
  type: "exercise" | "rest" | "section-intro";
  sectionIndex: number;
  exerciseIndex?: number;
  content: Exercise | Section | { duration: number; message: string };
};

const StepByStepWorkoutViewer = ({
  workout,
}: {
  workout: WorkoutStructure;
}) => {
  // Handle potentially malformed workout structure
  const isValidWorkout = useMemo(
    () =>
      workout &&
      typeof workout === "object" &&
      workout.title &&
      workout.description,
    [workout]
  );

  // Check if sections exist and are an array using useMemo to prevent re-renders
  const sections = useMemo(
    () => (Array.isArray(workout?.sections) ? workout.sections : []),
    [workout?.sections]
  );

  // Flatten workout into a sequence of steps
  const [steps, setSteps] = useState<WorkoutStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Memoize currentStep and progress calculations
  const currentStep = useMemo(
    () => (steps.length > 0 ? steps[currentStepIndex] : null),
    [steps, currentStepIndex]
  );

  const progress = useMemo(
    () =>
      steps.length > 0
        ? Math.round(((currentStepIndex + 1) / steps.length) * 100)
        : 0,
    [currentStepIndex, steps.length]
  );

  // Create flattened array of steps on mount
  useEffect(() => {
    if (!isValidWorkout || sections.length === 0) {
      setSteps([]);
      return;
    }

    const workoutSteps: WorkoutStep[] = [];

    sections.forEach((section, sectionIndex) => {
      if (!section || typeof section !== "object") {
        return; // Skip invalid sections
      }

      // Add section intro as a step
      workoutSteps.push({
        type: "section-intro",
        sectionIndex,
        content: section,
      });

      // Ensure exercises is an array
      const exercises = Array.isArray(section.exercises)
        ? section.exercises
        : [];

      // Add each exercise and rest periods
      exercises.forEach((exercise, exerciseIndex) => {
        if (!exercise || typeof exercise !== "object") {
          return; // Skip invalid exercises
        }

        workoutSteps.push({
          type: "exercise",
          sectionIndex,
          exerciseIndex,
          content: exercise,
        });

        // Add rest period after exercise (if not the last exercise in section)
        if (
          exerciseIndex < exercises.length - 1 &&
          section.rest_between_exercises
        ) {
          workoutSteps.push({
            type: "rest",
            sectionIndex,
            content: {
              duration: section.rest_between_exercises,
              message: "Rest between exercises",
            },
          });
        }
      });

      // Add rest period between sections
      if (sectionIndex < sections.length - 1 && workout.rest_between_sections) {
        workoutSteps.push({
          type: "rest",
          sectionIndex,
          content: {
            duration: workout.rest_between_sections,
            message: "Rest before next section",
          },
        });
      }
    });

    setSteps(workoutSteps);
  }, [isValidWorkout, sections, workout.rest_between_sections]);

  const goToPrevStep = () => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNextStep = () => {
    setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
  };

  // Show error message for invalid workout structure
  if (!isValidWorkout) {
    return <InvalidWorkoutCard />;
  }

  // Show message for workouts with no sections
  if (sections.length === 0) {
    return (
      <EmptySectionsCard
        title={workout.title}
        description={workout.description}
      />
    );
  }

  // Early return if steps not yet processed or current step is null
  if (steps.length === 0 || !currentStep) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{workout.title}</h1>
        <p className="mt-2 opacity-80">{workout.description}</p>
      </div>

      {/* Progress bar */}
      <div className="w-full mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <span className="text-xs font-medium">{progress}%</span>
        </div>
        <progress
          className="progress progress-primary w-full"
          value={progress}
          max="100"
        ></progress>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mb-4">
        <button
          className="btn btn-outline"
          onClick={goToPrevStep}
          disabled={currentStepIndex === 0}
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        <button
          className="btn btn-primary"
          onClick={goToNextStep}
          disabled={currentStepIndex === steps.length - 1}
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Current step content */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          {currentStep.type === "section-intro" && (
            <div>
              <h2 className="card-title text-xl">
                {(currentStep.content as Section).name ||
                  `Section ${currentStep.sectionIndex + 1}`}
              </h2>
              <div className="badge badge-outline mt-1">
                {(currentStep.content as Section).type || "Unknown"}
              </div>
              {(currentStep.content as Section).rounds &&
                (currentStep.content as Section).rounds! > 1 && (
                  <div className="badge badge-primary ml-2">
                    {(currentStep.content as Section).rounds} rounds
                  </div>
                )}
              <p className="mt-4">Get ready for this section!</p>
            </div>
          )}

          {currentStep.type === "exercise" && (
            <div>
              <h3 className="text-lg font-bold mb-3">
                {sections[currentStep.sectionIndex]?.name ||
                  `Section ${currentStep.sectionIndex + 1}`}{" "}
                - Exercise {(currentStep.exerciseIndex || 0) + 1}
              </h3>
              <ExerciseCard exercise={currentStep.content as Exercise} />
            </div>
          )}

          {currentStep.type === "rest" && (
            <div className="text-center py-6">
              <h3 className="text-xl font-bold mb-2">Rest Period</h3>
              <div className="text-4xl font-bold mb-2">
                {formatTime(
                  (currentStep.content as { duration: number }).duration
                )}
              </div>
              <p className="opacity-70">
                {(currentStep.content as { message: string }).message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepByStepWorkoutViewer;
