'use client';

import {
  Exercise,
  Section,
  WorkoutStructure,
} from '@/domain/entities/generatedWorkout';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  EmptySectionsCard,
  ExerciseCard,
  InvalidWorkoutCard,
} from './WorkoutComponents';
import { formatTime } from '../utils/workouts.func';

// Type for a flattened workout step
type WorkoutStep = {
  type: 'exercise' | 'rest' | 'section-intro';
  sectionIndex: number;
  subSectionPath?: number[]; // Path to subsection (e.g., [0, 1] means section 0, subsection 1)
  exerciseIndex?: number;
  round?: number; // Current round number (1-based)
  totalRounds?: number; // Total number of rounds for this section
  content: Exercise | Section | { duration: number; message: string };
  sectionName?: string; // Full section name including parent context
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
      typeof workout === 'object' &&
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

  // Recursive function to flatten sections and subsections
  const flattenSection = useCallback(
    (
      section: Section,
      sectionIndex: number,
      subSectionPath: number[] = [],
      parentSectionName: string = ''
    ): WorkoutStep[] => {
      if (!section || typeof section !== 'object') {
        return [];
      }

      const steps: WorkoutStep[] = [];
      const currentSectionName = parentSectionName
        ? `${parentSectionName} > ${section.name || 'Unnamed Section'}`
        : section.name || `Section ${sectionIndex + 1}`;

      const rounds = section.rounds || 1;
      const totalRounds = rounds;

      // Add section intro as a step
      steps.push({
        type: 'section-intro',
        sectionIndex,
        subSectionPath:
          subSectionPath.length > 0 ? [...subSectionPath] : undefined,
        content: section,
        sectionName: currentSectionName,
        totalRounds: totalRounds > 1 ? totalRounds : undefined,
      });

      // Ensure exercises is an array
      const exercises = Array.isArray(section.exercises)
        ? section.exercises
        : [];

      // Handle rounds - repeat exercises for each round
      for (let round = 1; round <= rounds; round++) {
        // Add each exercise and rest periods for this round
        exercises.forEach((exercise, exerciseIndex) => {
          if (!exercise || typeof exercise !== 'object') {
            return; // Skip invalid exercises
          }

          steps.push({
            type: 'exercise',
            sectionIndex,
            subSectionPath:
              subSectionPath.length > 0 ? [...subSectionPath] : undefined,
            exerciseIndex,
            round: rounds > 1 ? round : undefined,
            totalRounds: rounds > 1 ? totalRounds : undefined,
            content: exercise,
            sectionName: currentSectionName,
          });

          // Add rest period after exercise (if not the last exercise in the current round)
          if (
            exerciseIndex < exercises.length - 1 &&
            section.rest_between_exercises
          ) {
            steps.push({
              type: 'rest',
              sectionIndex,
              subSectionPath:
                subSectionPath.length > 0 ? [...subSectionPath] : undefined,
              round: rounds > 1 ? round : undefined,
              totalRounds: rounds > 1 ? totalRounds : undefined,
              content: {
                duration: section.rest_between_exercises,
                message: 'Rest between exercises',
              },
              sectionName: currentSectionName,
            });
          }
        });

        // Add rest between rounds (if not the last round and rest_between_rounds is specified)
        if (
          round < rounds &&
          section.rest_between_rounds &&
          section.rest_between_rounds > 0
        ) {
          steps.push({
            type: 'rest',
            sectionIndex,
            subSectionPath:
              subSectionPath.length > 0 ? [...subSectionPath] : undefined,
            round: round,
            totalRounds: totalRounds,
            content: {
              duration: section.rest_between_rounds,
              message: `Rest between rounds (${round}/${totalRounds})`,
            },
            sectionName: currentSectionName,
          });
        }
      }

      // Process subsections recursively
      const subSections = Array.isArray(section.sub_sections)
        ? section.sub_sections
        : [];
      subSections.forEach((subSection, subSectionIndex) => {
        // Add rest before subsection if there were exercises in the parent section
        if (exercises.length > 0 && section.rest_between_exercises) {
          steps.push({
            type: 'rest',
            sectionIndex,
            subSectionPath:
              subSectionPath.length > 0 ? [...subSectionPath] : undefined,
            content: {
              duration: section.rest_between_exercises,
              message: 'Rest before subsection',
            },
            sectionName: currentSectionName,
          });
        }

        // Recursively flatten the subsection
        const subSectionSteps = flattenSection(
          subSection,
          sectionIndex,
          [...subSectionPath, subSectionIndex],
          currentSectionName
        );
        steps.push(...subSectionSteps);

        // Add rest period between subsections (if not the last subsection)
        if (
          subSectionIndex < subSections.length - 1 &&
          section.rest_between_exercises
        ) {
          steps.push({
            type: 'rest',
            sectionIndex,
            subSectionPath:
              subSectionPath.length > 0 ? [...subSectionPath] : undefined,
            content: {
              duration: section.rest_between_exercises,
              message: 'Rest between subsections',
            },
            sectionName: currentSectionName,
          });
        }
      });

      return steps;
    },
    []
  );

  // Create flattened array of steps on mount
  useEffect(() => {
    if (!isValidWorkout || sections.length === 0) {
      setSteps([]);
      return;
    }

    const workoutSteps: WorkoutStep[] = [];

    sections.forEach((section, sectionIndex) => {
      // Flatten this section and all its subsections
      const sectionSteps = flattenSection(section, sectionIndex);
      workoutSteps.push(...sectionSteps);

      // Add rest period between main sections
      if (sectionIndex < sections.length - 1 && workout.rest_between_sections) {
        workoutSteps.push({
          type: 'rest',
          sectionIndex,
          content: {
            duration: workout.rest_between_sections,
            message: 'Rest before next section',
          },
          sectionName: section.name || `Section ${sectionIndex + 1}`,
        });
      }
    });

    setSteps(workoutSteps);
  }, [isValidWorkout, sections, workout.rest_between_sections, flattenSection]);

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
          {currentStep.type === 'section-intro' && (
            <div>
              <h2 className="card-title text-xl">
                {currentStep.sectionName ||
                  (currentStep.content as Section).name ||
                  `Section ${currentStep.sectionIndex + 1}`}
              </h2>
              <div className="badge badge-outline mt-1">
                {(currentStep.content as Section).type || 'Unknown'}
              </div>
              {(currentStep.content as Section).rounds &&
                (currentStep.content as Section).rounds! > 1 && (
                  <div className="badge badge-primary ml-2">
                    {(currentStep.content as Section).rounds} rounds
                  </div>
                )}
              {currentStep.subSectionPath && (
                <div className="badge badge-secondary ml-2">Subsection</div>
              )}
              <p className="mt-4">Get ready for this section!</p>
            </div>
          )}

          {currentStep.type === 'exercise' && (
            <div>
              <h3 className="text-lg font-bold mb-3">
                {currentStep.sectionName ||
                  `Section ${currentStep.sectionIndex + 1}`}{' '}
                - Exercise {(currentStep.exerciseIndex || 0) + 1}
                {currentStep.round && currentStep.totalRounds && (
                  <span className="text-sm font-normal opacity-70 ml-2">
                    (Round {currentStep.round}/{currentStep.totalRounds})
                  </span>
                )}
              </h3>
              {currentStep.round && currentStep.totalRounds && (
                <div className="badge badge-info mb-3">
                  Round {currentStep.round} of {currentStep.totalRounds}
                </div>
              )}
              <ExerciseCard exercise={currentStep.content as Exercise} />
            </div>
          )}

          {currentStep.type === 'rest' && (
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
              {currentStep.sectionName && (
                <p className="text-sm opacity-50 mt-2">
                  {currentStep.sectionName}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepByStepWorkoutViewer;
