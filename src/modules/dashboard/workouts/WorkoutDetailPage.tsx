import {
  useGeneratedWorkout,
  useGeneratedWorkouts,
} from "@/contexts/GeneratedWorkoutContext";
import { PusherEvent } from "@/contexts/PusherEvent";
import { useTrainerPersonaData } from "@/contexts/TrainerPersonaContext";
import { useWorkoutFeedback } from "@/contexts/WorkoutFeedbackContext";
import { Section, WorkoutStructure } from "@/domain/entities/generatedWorkout";
import { useUserAccess } from "@/hooks";
import FeedbackModal from "@/modules/dashboard/workouts/components/FeedbackModal";
import TabBar, { TabOption } from "@/ui/shared/molecules/TabBar";
import {
  ArrowBigLeft,
  CheckCircle,
  MessageSquare,
  Play,
  ShareIcon,
  Crown,
  Lock,
} from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router";
import FeedbackSuccessState from "./components/FeedbackSuccessState";
import SimpleFormatWorkoutViewer from "./components/SimpleFormatWorkoutViewer";
import StepByStepWorkoutViewer from "./components/StepByStepWorkoutViewer";
import StructuredWorkoutViewer from "./components/StructuredWorkoutViewer";
import { TrainerPersonaDisplay } from "./components/TrainerPersonaDisplay";
import VerySimpleFormatWorkoutViewer from "./components/VerySimpleFormatWorkoutViewer";
import WebShareButton from "./components/WebShareButton";
import WorkoutFeedbackForm from "./components/WorkoutFeedbackForm";
import { useWorkoutInstances } from "@/contexts/WorkoutInstancesContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useFeedbackModal } from "./components/FeedbackModal.hooks";

interface WorkoutChunkData {
  chunk: string;
  [key: string]: unknown;
}

export default function WorkoutDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const generatedWorkoutId = params?.id as string;
  const generatedWorkout = useGeneratedWorkout(generatedWorkoutId);
  const { refetch } = useGeneratedWorkouts();
  const { submitFeedback, isSubmitting, error, clearError, userFeedback } =
    useWorkoutFeedback();
  const { createInstance } = useWorkoutInstances();
  const feedbackModal = useFeedbackModal();
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);
  const trainerPersona = useTrainerPersonaData();
  const [isCreatingInstance, setIsCreatingInstance] = useState(false);
  const { canAccessFeature } = useUserAccess();
  const analytics = useAnalytics();

  // Check if user has access to start workouts
  const canStartWorkouts = canAccessFeature("generate_workout_instances");

  // Check if feedback already exists for this workout
  const existingFeedback = generatedWorkout
    ? userFeedback.find(
        (feedback) => feedback.workoutId === generatedWorkout.id
      )
    : null;
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

  // Track workout detail views
  useEffect(() => {
    if (generatedWorkout) {
      analytics.track("Workout Detail Viewed", {
        workoutId: generatedWorkout.id,
        tracked_at: new Date().toISOString(),
      });
    }
  }, [generatedWorkout, analytics]);

  // Track workout start from detail page
  const handleStartWorkout = async () => {
    if (!generatedWorkout) return;

    setIsCreatingInstance(true);
    try {
      // Flatten the workout structure for linear tracking
      const flattenedJsonFormat = generatedWorkout.jsonFormat
        ? flattenWorkoutForInstance(generatedWorkout.jsonFormat)
        : undefined;

      const newInstance = await createInstance({
        generatedWorkoutId: generatedWorkout.id,
        performedAt: new Date().toISOString(),
        completed: false,
        jsonFormat: flattenedJsonFormat,
      });

      // Navigate to the workout instance page
      navigate(`/dashboard/workouts/instances/${newInstance.id}`);

      // Track workout start
      analytics.track("Workout Started", {
        workoutId: generatedWorkout.id,
        location: "workout_detail",
        tracked_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to create workout instance:", error);
      // You could add error handling here (toast notification, etc.)
    } finally {
      setIsCreatingInstance(false);
    }
  };

  // Function to flatten workout rounds into linear sections for instance tracking
  const flattenWorkoutForInstance = (workoutStructure: WorkoutStructure) => {
    const flattenedSections: Section[] = [];

    workoutStructure.sections.forEach((section) => {
      const rounds = section.rounds || 1;

      if (rounds > 1) {
        // Create separate sections for each round
        for (let round = 1; round <= rounds; round++) {
          flattenedSections.push({
            ...section,
            name: `${section.name} - Round ${round}`,
            rounds: 1, // Each flattened section is now a single round
            exercises:
              section.exercises?.map((exercise) => ({
                ...exercise,
                // Add round context to exercise names if helpful
                // name: `${exercise.name} (Round ${round})`
              })) || [],
          });
        }
      } else {
        // Single round or no rounds specified - keep as is
        flattenedSections.push({
          ...section,
          exercises: section.exercises || [],
        });
      }
    });

    return {
      ...workoutStructure,
      sections: flattenedSections,
    };
  };

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
      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="btn btn-ghost flex items-center self-start"
        >
          <ArrowBigLeft className="w-4 h-4" />
          <span className="hidden sm:inline ml-2">Back to workouts</span>
          <span className="sm:hidden ml-2">Back</span>
        </button>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {canStartWorkouts ? (
            <button
              onClick={handleStartWorkout}
              className="btn btn-primary flex-1 sm:flex-initial"
              disabled={!generatedWorkout || isCreatingInstance}
              title="Start a new workout session"
            >
              <Play className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">
                {isCreatingInstance ? "Starting..." : "Start Workout"}
              </span>
              <span className="sm:hidden">
                {isCreatingInstance ? "Starting..." : "Start"}
              </span>
            </button>
          ) : (
            <div
              className="tooltip tooltip-bottom"
              data-tip="Upgrade to start workouts"
            >
              <button
                onClick={() => navigate("/dashboard/billing")}
                className="btn btn-outline btn-warning flex-1 sm:flex-initial relative"
                disabled={!generatedWorkout}
              >
                <div className="flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Start Workout</span>
                  <span className="sm:hidden">Start</span>
                  <Crown className="w-3 h-3 ml-1 animate-pulse" />
                </div>
              </button>
            </div>
          )}
          <button
            onClick={() => {
              setShowFeedbackSuccess(false);
              clearError();
              feedbackModal.openModal();
            }}
            className={`btn ${
              existingFeedback ? "btn-success" : "btn-outline"
            } flex-1 sm:flex-initial`}
            disabled={!generatedWorkout}
            title={existingFeedback ? "Workout Rated" : "Rate This Workout"}
          >
            {existingFeedback ? (
              <CheckCircle className="w-4 h-4 mr-2" />
            ) : (
              <MessageSquare className="w-4 h-4 mr-2" />
            )}
            <span className="hidden sm:inline">
              {existingFeedback ? "Workout Rated" : "Rate This Workout"}
            </span>
            <span className="sm:hidden">
              {existingFeedback ? "Rated" : "Rate"}
            </span>
          </button>
          <div className="flex-1 sm:flex-initial">
            <WebShareButton
              disabled={!verySimpleFormat && !simpleFormat}
              title="Workout Plan"
              text={verySimpleFormat || simpleFormat || ""}
            >
              <ShareIcon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Share Workout</span>
              <span className="sm:hidden">Share</span>
            </WebShareButton>
          </div>
        </div>
      </div>

      {/* Trainer Persona Section */}
      {trainerPersona && (
        <div className="mb-4 p-3 bg-base-100 border border-base-300 rounded-lg">
          <TrainerPersonaDisplay trainerPersona={trainerPersona} />
          <div className="mt-2 text-sm text-base-content/70">
            <p>Here's your personalized workout plan:</p>
          </div>
        </div>
      )}

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
          <div className="p-4 prose-lg dark:prose-invert">
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

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() => {
          clearError();
          setShowFeedbackSuccess(false);
          feedbackModal.closeModal();
        }}
        title={
          existingFeedback
            ? "Your Workout Feedback"
            : "Share Your Workout Experience"
        }
        subtitle={
          existingFeedback
            ? "You've already provided feedback for this workout"
            : generatedWorkout?.jsonFormat?.title || "How was your workout?"
        }
        confirmClose={!existingFeedback}
        hasUnsavedChanges={!existingFeedback && feedbackModal.hasUnsavedChanges}
      >
        {generatedWorkout && (
          <>
            {existingFeedback ? (
              <div className="text-center space-y-6 py-8">
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-success" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-success">
                    Feedback Already Submitted
                  </h3>
                  <p className="text-base-content/70">
                    You provided feedback for this workout on{" "}
                    {new Date(existingFeedback.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-base-200 rounded-lg p-4 space-y-2 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm">
                    <div>
                      <span className="font-medium">Overall:</span>{" "}
                      {existingFeedback.overallRating}/5 ⭐
                    </div>
                    <div>
                      <span className="font-medium">Difficulty:</span>{" "}
                      {existingFeedback.difficultyRating}/5 ⭐
                    </div>
                    <div>
                      <span className="font-medium">Enjoyment:</span>{" "}
                      {existingFeedback.enjoymentRating}/5 ⭐
                    </div>
                  </div>
                  {existingFeedback.wouldRecommend && (
                    <div className="text-sm text-success">
                      ✓ Would recommend to others
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    feedbackModal.closeModal();
                  }}
                >
                  Close
                </button>
              </div>
            ) : !showFeedbackSuccess ? (
              <WorkoutFeedbackForm
                workoutId={generatedWorkout.id}
                onSubmit={async (request) => {
                  await submitFeedback(request);
                  setShowFeedbackSuccess(true);
                }}
                isSubmitting={isSubmitting}
                error={error}
                onCancel={() => {
                  clearError();
                  feedbackModal.closeModal();
                }}
              />
            ) : (
              <FeedbackSuccessState
                onClose={() => {
                  setShowFeedbackSuccess(false);
                  feedbackModal.closeModal();
                }}
              />
            )}
          </>
        )}
      </FeedbackModal>
    </div>
  );
}
