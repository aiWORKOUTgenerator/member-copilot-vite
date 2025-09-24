'use client';

import { Section, WorkoutStructure } from '@/domain/entities/generatedWorkout';
import { useState } from 'react';
import { InvalidWorkoutCard, EmptySectionsCard } from './WorkoutComponents';
import { formatTime } from '../utils/workouts.func';
import { useExercisesForGeneratedWorkout } from '@/hooks/useExercises';
import { useExerciseMedia } from '@/hooks/useExerciseMedia';

import { Exercise } from '@/domain/entities/generatedWorkout';
import { Exercise as CanonicalExercise } from '@/domain/entities/exercise';

// (Removed legacy tabbed ExerciseCardWithMedia in favor of simplified basic viewer)

// Simplified Gen Z/Millennial friendly viewer combining image, basic instructions, and categories
const ExerciseCardWithMediaBasic = ({
  exercise,
  availableExercises,
}: {
  exercise: Exercise;
  availableExercises: CanonicalExercise[];
}) => {
  const { imageUrl, audioUrl } = useExerciseMedia(
    { name: exercise.name },
    availableExercises
  );

  const canonicalExercise = availableExercises.find(
    (ex) => ex.name.toLowerCase() === exercise.name.toLowerCase()
  );

  const primaryName = exercise.name;

  const simpleInstructions = canonicalExercise?.simpleInstructions;
  const detailedInstructions = canonicalExercise?.detailedInstructions;
  const instructions = simpleInstructions || detailedInstructions || '';
  const muscleGroups = canonicalExercise?.muscleGroups || [];
  const equipment = canonicalExercise?.equipmentRequired || [];

  return (
    <div className="bg-base-100/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-sm">
      {/* Title */}
      <div className="p-4 pb-0">
        <h4 className="text-2xl font-bold text-base-content">{primaryName}</h4>
        {exercise.description && (
          <p className="text-sm text-base-content/70 mt-2">
            {exercise.description}
          </p>
        )}
      </div>

      {/* Exercise Stats - directly under title */}
      <div className="p-4 pt-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {exercise.sets !== undefined && (
            <div className="bg-base-100/10 backdrop-blur-xl border border-primary/30 rounded-2xl p-4 flex flex-col items-center shadow-[0_4px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_var(--color-primary)] transition-all duration-300">
              <span className="text-xs uppercase tracking-wide text-primary font-bold mb-1">
                Sets
              </span>
              <span className="text-2xl font-bold text-primary">
                {exercise.sets}
              </span>
            </div>
          )}
          {exercise.reps !== undefined && (
            <div className="bg-base-100/10 backdrop-blur-xl border border-secondary/30 rounded-2xl p-4 flex flex-col items-center shadow-[0_4px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_var(--color-secondary)] transition-all duration-300">
              <span className="text-xs uppercase tracking-wide text-secondary font-bold mb-1">
                Reps
              </span>
              <span className="text-2xl font-bold text-secondary">
                {exercise.reps}
              </span>
            </div>
          )}
          {exercise.weight !== undefined && (
            <div className="bg-base-100/10 backdrop-blur-xl border border-accent/30 rounded-2xl p-4 flex flex-col items-center shadow-[0_4px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_var(--color-accent)] transition-all duration-300">
              <span className="text-xs uppercase tracking-wide text-accent font-bold mb-1">
                Weight
              </span>
              <span className="text-2xl font-bold text-accent">
                {exercise.weight > 0 ? `${exercise.weight} lbs` : 'Bodyweight'}
              </span>
            </div>
          )}
          {exercise.duration !== undefined && (
            <div className="bg-base-100/10 backdrop-blur-xl border border-warning/30 rounded-2xl p-4 flex flex-col items-center shadow-[0_4px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_var(--color-warning)] transition-all duration-300">
              <span className="text-xs uppercase tracking-wide text-warning font-bold mb-1">
                Duration
              </span>
              <span className="text-2xl font-bold text-warning">
                {formatTime(exercise.duration)}
              </span>
            </div>
          )}
          {exercise.rest !== undefined && exercise.rest > 0 && (
            <div className="bg-base-100/10 backdrop-blur-xl border border-info/30 rounded-2xl p-4 flex flex-col items-center shadow-[0_4px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_var(--color-info)] transition-all duration-300">
              <span className="text-xs uppercase tracking-wide text-info font-bold mb-1">
                Rest
              </span>
              <span className="text-2xl font-bold text-info">
                {formatTime(exercise.rest)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="w-full bg-base-200/60 border-b border-white/10 flex items-center justify-center p-3">
          <img
            src={imageUrl}
            alt={`${primaryName} preview`}
            className="w-full max-h-56 sm:max-h-64 object-contain rounded-xl"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Audio (optional) */}
        {audioUrl && (
          <div className="bg-base-100/60 border border-white/10 rounded-xl p-3">
            <div className="text-xs uppercase tracking-wide text-base-content/60 mb-2">
              Audio Guide
            </div>
            <audio controls preload="none" className="w-full">
              <source src={audioUrl} />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
        {/* Instructions */}
        {instructions && (
          <div className="bg-base-100/60 border border-white/10 rounded-xl p-4">
            <div className="text-sm leading-relaxed text-base-content/80 whitespace-pre-line">
              {instructions}
            </div>
          </div>
        )}

        {/* Categories */}
        {(muscleGroups.length > 0 || equipment.length > 0) && (
          <div className="space-y-3">
            {muscleGroups.length > 0 && (
              <div>
                <div className="text-xs uppercase tracking-wide text-base-content/60 mb-2">
                  Muscle Groups
                </div>
                <div className="flex flex-wrap gap-2">
                  {muscleGroups.map((m, idx) => (
                    <span
                      key={`m-${idx}`}
                      className="badge badge-primary badge-sm"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {equipment.length > 0 && (
              <div>
                <div className="text-xs uppercase tracking-wide text-base-content/60 mb-2">
                  Equipment
                </div>
                <div className="flex flex-wrap gap-2">
                  {equipment.map((e, idx) => (
                    <span
                      key={`e-${idx}`}
                      className="badge badge-secondary badge-sm"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Section component to display a group of exercises
const SectionCard = ({
  section,
  depth = 0,
  availableExercises = [],
}: {
  section: Section;
  depth?: number;
  availableExercises?: CanonicalExercise[];
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!section || typeof section !== 'object') {
    return (
      <div className="p-4 bg-error bg-opacity-10 rounded-lg mb-6">
        Invalid section data
      </div>
    );
  }

  // Ensure exercises is an array
  const exercises = Array.isArray(section.exercises) ? section.exercises : [];

  // Ensure sub_sections is an array
  const subSections = Array.isArray(section.sub_sections)
    ? section.sub_sections
    : [];

  // Calculate indentation based on depth
  const indentClass = depth > 0 ? `ml-${Math.min(depth * 4, 16)}` : '';
  const cardBgClass = depth > 0 ? 'bg-base-200' : 'bg-base-100';

  return (
    <div className={`${cardBgClass} rounded-lg shadow-sm mb-6 ${indentClass}`}>
      <div
        className="p-4 flex justify-between items-center cursor-pointer"
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div>
          <h3
            className={`${
              depth === 0 ? 'text-xl' : depth === 1 ? 'text-lg' : 'text-base'
            } font-bold`}
          >
            {depth > 0 && '└ '}
            {section.name || 'Unnamed Section'}
          </h3>
          <div className="badge badge-outline mt-1">
            {section.type || 'Unknown'}
          </div>
          {section.rounds && section.rounds > 1 && (
            <div className="badge badge-primary ml-2">
              {section.rounds} rounds
            </div>
          )}
          {subSections.length > 0 && (
            <div className="badge badge-secondary ml-2">
              {subSections.length} subsection{subSections.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
        <button className="btn btn-circle btn-sm">
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 pt-0">
          {exercises.length === 0 && subSections.length === 0 ? (
            <div className="p-3 bg-warning bg-opacity-10 rounded text-sm">
              No exercises or subsections found in this section
            </div>
          ) : (
            <>
              {/* Render exercises first */}
              {exercises.length > 0 && (
                <div className="mb-4">
                  {(() => {
                    const rounds = section.rounds || 1;
                    const roundsToRender = [];

                    // Create rounds
                    for (let round = 1; round <= rounds; round++) {
                      roundsToRender.push(
                        <div key={`round-${round}`} className="mb-4">
                          {/* Round header (only show if more than 1 round) */}
                          {rounds > 1 && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="badge badge-info">
                                Round {round} of {rounds}
                              </div>
                              <div className="flex-1 h-px bg-base-300"></div>
                            </div>
                          )}

                          {/* Exercises for this round */}
                          {exercises.map((exercise, idx) => (
                            <div key={`round-${round}-exercise-${idx}`}>
                              <ExerciseCardWithMediaBasic
                                exercise={exercise}
                                availableExercises={availableExercises}
                              />
                              {idx < exercises.length - 1 &&
                                Boolean(section.rest_between_exercises) &&
                                (section.rest_between_exercises ?? 0) > 0 && (
                                  <div className="text-center text-sm opacity-60 my-2">
                                    Rest{' '}
                                    {formatTime(
                                      section.rest_between_exercises!
                                    )}
                                  </div>
                                )}
                            </div>
                          ))}

                          {/* Rest between rounds (if not the last round) */}
                          {round < rounds &&
                            Boolean(section.rest_between_rounds) &&
                            (section.rest_between_rounds ?? 0) > 0 && (
                              <div className="text-center text-sm font-semibold my-4 p-3 bg-info bg-opacity-10 rounded-md border border-info border-opacity-20">
                                <div className="flex items-center justify-center gap-2">
                                  <span>🕒</span>
                                  <span>
                                    Rest{' '}
                                    {formatTime(section.rest_between_rounds!)}{' '}
                                    before Round {round + 1}
                                  </span>
                                </div>
                              </div>
                            )}
                        </div>
                      );
                    }

                    return roundsToRender;
                  })()}
                </div>
              )}

              {/* Render subsections recursively */}
              {subSections.length > 0 && (
                <div className="space-y-4">
                  {subSections.map((subSection, idx) => (
                    <div key={idx}>
                      <SectionCard
                        section={subSection}
                        depth={depth + 1}
                        availableExercises={availableExercises}
                      />
                      {idx < subSections.length - 1 &&
                        Boolean(section.rest_between_exercises) &&
                        (section.rest_between_exercises ?? 0) > 0 && (
                          <div className="text-center text-sm opacity-60 my-2">
                            Rest {formatTime(section.rest_between_exercises!)}{' '}
                            between subsections
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {Boolean(section.time_limit) && (section.time_limit ?? 0) > 0 && (
            <div className="text-center text-sm font-semibold mt-3">
              Time limit: {formatTime(section.time_limit)}
            </div>
          )}

          {Boolean(section.duration) && (section.duration ?? 0) > 0 && (
            <div className="text-center text-sm font-semibold mt-3">
              Total duration: {formatTime(section.duration)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Main component to display the entire workout
const StructuredWorkoutViewer = ({
  workout,
  generatedWorkoutId,
}: {
  workout: WorkoutStructure;
  generatedWorkoutId?: string;
}) => {
  // Fetch exercises for media resolution if generatedWorkoutId is provided
  const { exercises: availableExercises = [] } =
    useExercisesForGeneratedWorkout(generatedWorkoutId || '');

  // Handle potentially malformed workout structure
  const isValidWorkout =
    workout &&
    typeof workout === 'object' &&
    workout.title &&
    workout.description;

  // Check if sections exist and are an array
  const sections = Array.isArray(workout?.sections) ? workout.sections : [];

  if (!isValidWorkout) {
    return <InvalidWorkoutCard />;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{workout.title}</h1>
        <p className="mt-2 opacity-80">{workout.description}</p>
      </div>

      {sections.length === 0 ? (
        <EmptySectionsCard
          title={workout.title}
          description={workout.description}
        />
      ) : (
        <div>
          {sections.map((section, idx) => (
            <div key={idx}>
              <SectionCard
                section={section}
                depth={0}
                availableExercises={availableExercises}
              />
              {idx < sections.length - 1 &&
                Boolean(workout.rest_between_sections) &&
                (workout.rest_between_sections ?? 0) > 0 && (
                  <div className="text-center text-sm font-semibold my-4 p-2 bg-base-200 rounded-md">
                    Rest {formatTime(workout.rest_between_sections!)} before
                    next section
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StructuredWorkoutViewer;
