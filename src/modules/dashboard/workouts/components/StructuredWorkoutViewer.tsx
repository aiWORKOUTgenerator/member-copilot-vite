"use client";

import { Section, WorkoutStructure } from "@/domain/entities/generatedWorkout";
import { useState } from "react";
import {
  ExerciseCard,
  formatTime,
  InvalidWorkoutCard,
  EmptySectionsCard,
} from "./WorkoutComponents";

// Section component to display a group of exercises
const SectionCard = ({ section }: { section: Section }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!section || typeof section !== "object") {
    return (
      <div className="p-4 bg-error bg-opacity-10 rounded-lg mb-6">
        Invalid section data
      </div>
    );
  }

  // Ensure exercises is an array
  const exercises = Array.isArray(section.exercises) ? section.exercises : [];

  return (
    <div className="bg-base-100 rounded-lg shadow-sm mb-6">
      <div
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="text-xl font-bold">
            {section.name || "Unnamed Section"}
          </h3>
          <div className="badge badge-outline mt-1">
            {section.type || "Unknown"}
          </div>
          {section.rounds && section.rounds > 1 && (
            <div className="badge badge-primary ml-2">
              {section.rounds} rounds
            </div>
          )}
        </div>
        <button className="btn btn-circle btn-sm">
          {isExpanded ? "−" : "+"}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 pt-0">
          {exercises.length === 0 ? (
            <div className="p-3 bg-warning bg-opacity-10 rounded text-sm">
              No exercises found in this section
            </div>
          ) : (
            exercises.map((exercise, idx) => (
              <div key={idx}>
                <ExerciseCard exercise={exercise} />
                {idx < exercises.length - 1 &&
                  section.rest_between_exercises != undefined &&
                  section.rest_between_exercises > 0 && (
                    <div className="text-center text-sm opacity-60 my-2">
                      Rest {formatTime(section.rest_between_exercises)}
                    </div>
                  )}
              </div>
            ))
          )}

          {Boolean(section.rest_between_rounds) &&
            (section.rest_between_rounds ?? 0) > 0 &&
            Boolean(section.rounds) &&
            (section.rounds ?? 0) > 1 && (
              <div className="text-center text-sm font-semibold mt-3">
                Rest {formatTime(section.rest_between_rounds)} between rounds
              </div>
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
}: {
  workout: WorkoutStructure;
}) => {
  // Handle potentially malformed workout structure
  const isValidWorkout =
    workout &&
    typeof workout === "object" &&
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
              <SectionCard section={section} />
              {idx < sections.length - 1 &&
                workout.rest_between_sections != undefined &&
                workout.rest_between_sections > 0 && (
                  <div className="text-center text-sm font-semibold my-4 p-2 bg-base-200 rounded-md">
                    Rest {formatTime(workout.rest_between_sections)} before next
                    section
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
