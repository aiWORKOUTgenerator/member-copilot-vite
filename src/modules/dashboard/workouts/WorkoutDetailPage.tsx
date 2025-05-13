import {
  useGeneratedWorkout,
  useGeneratedWorkouts,
} from "@/contexts/GeneratedWorkoutContext";
import { WorkoutStructure } from "@/domain/entities/generatedWorkout";
import TabBar, { TabOption } from "@/ui/shared/molecules/TabBar";
import { ArrowBigLeft, ShareIcon } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router";
import SimpleFormatWorkoutViewer from "./components/SimpleFormatWorkoutViewer";
import StepByStepWorkoutViewer from "./components/StepByStepWorkoutViewer";
import StructuredWorkoutViewer from "./components/StructuredWorkoutViewer";
import VerySimpleFormatWorkoutViewer from "./components/VerySimpleFormatWorkoutViewer";
import WebShareButton from "./components/WebShareButton";
import { PusherEvent } from "@/contexts/PusherEvent";

interface WorkoutChunkData {
  chunk: string;
  [key: string]: unknown;
}

export default function WorkoutDetailPage() {
  const params = useParams();
  const generatedWorkoutId = params?.id as string;
  const generatedWorkout = useGeneratedWorkout(generatedWorkoutId);
  const { refetch } = useGeneratedWorkouts();
  const [workoutFormat, setWorkoutFormat] = useState<
    "plain" | "structured" | "step-by-step" | "simple" | "very-simple"
  >("plain");
  const [workoutChunks, setWorkoutChunks] = useState<string[]>([]);
  const [isTextGenerating, setIsTextGenerating] = useState(false);
  const [isJsonFormatting, setIsJsonFormatting] = useState(false);

  // Combine all chunks into a single string
  const workoutFromChunks = workoutChunks.join("");

  // Display text from either the generatedWorkout or accumulated chunks
  const displayText = generatedWorkout?.textFormat || workoutFromChunks;

  const simpleFormat = generatedWorkout?.simpleFormat;
  const verySimpleFormat = generatedWorkout?.verySimpleFormat;

  // Check if jsonFormat has a title attribute
  const hasValidJsonFormat =
    generatedWorkout?.jsonFormat &&
    typeof generatedWorkout.jsonFormat === "object" &&
    "title" in generatedWorkout.jsonFormat;

  // Extract valid jsonFormat as WorkoutStructure for component props
  const validJsonFormat = hasValidJsonFormat
    ? (generatedWorkout.jsonFormat as WorkoutStructure)
    : undefined;

  // Clear loading states when refetching completes
  useEffect(() => {
    if (generatedWorkout) {
      setIsTextGenerating(false);
      setIsJsonFormatting(false);
    }
  }, [generatedWorkout]);

  // Define tabs for the TabBar component
  const tabs: TabOption[] = [
    {
      id: "plain",
      label: "Plain Text",
    },
    {
      id: "structured",
      label: "Structured",
      disabled: !hasValidJsonFormat,
      loading: isJsonFormatting,
    },
    {
      id: "step-by-step",
      label: "Step by Step",
      disabled: !hasValidJsonFormat,
      loading: isJsonFormatting,
    },
    {
      id: "simple",
      label: "Simple",
      disabled: !generatedWorkout?.simpleFormat,
      loading: isTextGenerating,
    },
    {
      id: "very-simple",
      label: "Quick View",
      disabled: !generatedWorkout?.verySimpleFormat,
      loading: isTextGenerating,
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => window.history.back()}
          className="btn btn-ghost flex items-center"
        >
          <ArrowBigLeft className="w-4 h-4" />
          Back to workouts
        </button>
        <WebShareButton
          disabled={!verySimpleFormat && !simpleFormat}
          title="Workout Plan"
          text={verySimpleFormat || simpleFormat || ""}
        >
          <ShareIcon className="w-4 h-4 mr-2" />
          Share Workout
        </WebShareButton>
      </div>

      <TabBar
        selectedTab={workoutFormat}
        onTabChange={(tabId) =>
          setWorkoutFormat(
            tabId as
              | "plain"
              | "structured"
              | "step-by-step"
              | "simple"
              | "very-simple"
          )
        }
        tabs={tabs}
      />

      {workoutFormat === "plain" ? (
        displayText ? (
          <div className="p-4 prose-md">
            <ReactMarkdown>{displayText}</ReactMarkdown>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-base-200 rounded-lg flex flex-col items-center justify-center space-y-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p>Waiting for workout data...</p>
          </div>
        )
      ) : workoutFormat === "structured" && validJsonFormat ? (
        <div className="p-4">
          <StructuredWorkoutViewer workout={validJsonFormat} />
        </div>
      ) : workoutFormat === "simple" && generatedWorkout?.simpleFormat ? (
        <div className="p-4">
          <SimpleFormatWorkoutViewer
            simpleFormat={generatedWorkout.simpleFormat}
          />
        </div>
      ) : workoutFormat === "very-simple" &&
        generatedWorkout?.verySimpleFormat ? (
        <div className="p-4">
          <VerySimpleFormatWorkoutViewer
            verySimpleFormat={generatedWorkout.verySimpleFormat}
          />
        </div>
      ) : workoutFormat === "step-by-step" && validJsonFormat ? (
        <div className="p-4">
          <StepByStepWorkoutViewer workout={validJsonFormat} />
        </div>
      ) : (
        <div className="mt-4 p-4 bg-base-200 rounded-lg">
          <p>Structured view is not available for this workout.</p>
        </div>
      )}

      {/* Event listeners */}
      <PusherEvent
        channel={`${generatedWorkoutId}`}
        event="workout-chunk-created"
        onEvent={(data: unknown) => {
          // Type check and safely access chunk data
          if (
            data &&
            typeof data === "object" &&
            data !== null &&
            "chunk" in data &&
            typeof (data as WorkoutChunkData).chunk === "string"
          ) {
            setWorkoutChunks((prev) => [
              ...prev,
              (data as WorkoutChunkData).chunk,
            ]);
          }
        }}
      />
      <PusherEvent
        channel={`${generatedWorkoutId}`}
        event="json-format-initiated"
        onEvent={() => setIsJsonFormatting(true)}
      />
      <PusherEvent
        channel={`${generatedWorkoutId}`}
        event="json-format-completed"
        onEvent={() => {
          setIsJsonFormatting(false);
          refetch();
        }}
      />
      <PusherEvent
        channel={`${generatedWorkoutId}`}
        event="text-generation-initiated"
        onEvent={() => setIsTextGenerating(true)}
      />
      <PusherEvent
        channel={`${generatedWorkoutId}`}
        event="text-generation-completed"
        onEvent={() => {
          refetch();
          setIsTextGenerating(false);
        }}
      />
    </div>
  );
}
