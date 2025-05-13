"use client";

import { GeneratedWorkout } from "@/domain/entities/generatedWorkout";
import { ArrowBigRight } from "lucide-react";

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
  return (
    <ul className="list bg-base-100">
      <li className="p-3 pb-1 text-xs opacity-60 tracking-wide">{title}</li>
      {workouts.map((workout) => {
        // Format the date to a nice human-readable string
        const createdDate = new Date(workout.createdAt);
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          hour12: true,
        }).format(createdDate);

        return (
          <li
            key={workout.id}
            className="list-row p-2 hover:bg-base-200 cursor-pointer transition-colors rounded-lg my-1 border border-base-300"
            onClick={() => onWorkoutClick?.(workout)}
          >
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
                <ArrowBigRight className="w-4 h-4 text-primary" />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
