import { useGeneratedWorkouts } from "@/contexts/GeneratedWorkoutContext";
import {
  WorkoutParams,
  WorkoutType,
  WorkoutStructure,
} from "@/domain/entities/workoutParams";
import { ArrowBigLeft, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// 15 workout prompt examples
const WORKOUT_PROMPTS = [
  "30 minute HIIT workout for fat loss",
  "Strength training for beginners with dumbbells only",
  "Recovery yoga routine after leg day",
  "20-minute HIIT workout with no equipment",
  "Strength training routine for building leg muscles",
  "Full body workout with dumbbells only",
  "Low impact cardio for beginners",
  "Upper body workout focusing on arms and shoulders",
  "Quick morning yoga routine for flexibility",
  "Core strengthening workout for abs",
  "Endurance training plan for marathon preparation",
  "Bodyweight exercises for hotel room travel workouts",
  "Kettlebell circuit for full body conditioning",
  "Back pain relief stretching routine",
  "Powerlifting workout for strength gains",
  "Post-workout recovery stretching routine",
  "15-minute desk-based workout for office breaks",
  "Workout for improving running speed and endurance",
  "Senior-friendly gentle exercise routine",
  "Mobility workout for improving joint health",
];

export default function GenerateWorkoutPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [workoutParams, setWorkoutParams] = useState<WorkoutParams>({});
  const { createWorkout } = useGeneratedWorkouts();
  const [errors, setErrors] = useState<
    Partial<Record<keyof WorkoutParams, string>>
  >({});
  const [displayPrompts, setDisplayPrompts] = useState<string[]>([]);

  // Select 3 random prompts when the component mounts
  useEffect(() => {
    const shuffled = [...WORKOUT_PROMPTS].sort(() => 0.5 - Math.random());
    setDisplayPrompts(shuffled.slice(0, 3));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    // Validate rest between sets if provided
    const newErrors: Partial<Record<keyof WorkoutParams, string>> = {};
    if (workoutParams.restBetweenSets !== undefined) {
      const rest = Number(workoutParams.restBetweenSets);
      if (isNaN(rest) || rest < 0) {
        newErrors.restBetweenSets = "Rest time must be a positive number";
      }
    }

    // If there are validation errors, don't proceed
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsGenerating(true);

    try {
      // TODO: Replace with actual API call
      const response = await createWorkout(
        "01JSHGHV0V6RZC3TN7T2W09P2M",
        workoutParams,
        prompt
      );

      console.log("Generated workout:", response);

      // Redirect to the generated workout page
      navigate(`/dashboard/workouts/${response.id}`);
    } catch (error) {
      console.error("Failed to generate workout:", error);
      setIsGenerating(false);
    }
  };

  const handleParamChange = (
    param: keyof WorkoutParams,
    value: string | number | WorkoutType | WorkoutStructure | undefined
  ) => {
    setWorkoutParams({
      ...workoutParams,
      [param]: value,
    });

    // Clear error for this field if it exists
    if (errors[param]) {
      setErrors({
        ...errors,
        [param]: undefined,
      });
    }
  };

  const validateRestBetweenSets = (value: string) => {
    const rest = Number(value);
    if (value && (isNaN(rest) || rest < 0)) {
      setErrors({
        ...errors,
        restBetweenSets: "Rest time must be a positive number",
      });
    } else {
      const newErrors = { ...errors };
      delete newErrors.restBetweenSets;
      setErrors(newErrors);
    }

    handleParamChange("restBetweenSets", value ? Number(value) : undefined);
  };

  // Function to use an example prompt
  const setExamplePrompt = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost flex items-center"
        >
          <ArrowBigLeft className="w-4 h-4" />
          Back to workouts
        </button>
      </div>

      <div className="card card-border max-w-3xl mx-auto">
        <div className="card-body">
          <h2 className="card-title">Generate a New Workout</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block mb-2 font-medium flex justify-between items-center">
                <span>Describe your workout needs</span>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => {
                    const shuffled = [...WORKOUT_PROMPTS].sort(
                      () => 0.5 - Math.random()
                    );
                    setDisplayPrompts(shuffled.slice(0, 3));
                  }}
                  aria-label="Refresh examples"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-refresh-cw"
                  >
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M3 21v-5h5" />
                  </svg>
                </button>
              </label>

              <div className="mockup-code mb-3 text-sm">
                {displayPrompts.map((example, index) => (
                  <pre
                    key={index}
                    data-prefix=">"
                    className={`text-${
                      index === 0 ? "success" : index === 1 ? "info" : "warning"
                    } cursor-pointer hover:bg-base-300`}
                    onClick={() => setExamplePrompt(example)}
                  >
                    <code>{example}</code>
                  </pre>
                ))}
              </div>

              <textarea
                className="textarea textarea-bordered validator w-full min-h-32"
                placeholder="Describe the type of workout you want, including duration, equipment, fitness goals, etc."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
                required
              ></textarea>
              {!prompt.trim() && (
                <p className="validator-hint">Please describe your workout</p>
              )}
            </div>

            <div className="mb-6">
              <button
                type="button"
                className="btn btn-outline w-full flex justify-between items-center"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <span>Advanced Options</span>
                {showAdvanced ? <ChevronUp /> : <ChevronDown />}
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-4 border p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Workout Type
                      </label>
                      <select
                        className="select select-bordered validator w-full"
                        value={workoutParams.workoutType || ""}
                        onChange={(e) =>
                          handleParamChange(
                            "workoutType",
                            e.target.value
                              ? (e.target.value as WorkoutType)
                              : undefined
                          )
                        }
                        disabled={isGenerating}
                      >
                        <option value="">Select type (optional)</option>
                        {Object.values(WorkoutType).map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Workout Structure
                      </label>
                      <select
                        className="select select-bordered validator w-full"
                        value={workoutParams.workoutStructure || ""}
                        onChange={(e) =>
                          handleParamChange(
                            "workoutStructure",
                            e.target.value
                              ? (e.target.value as WorkoutStructure)
                              : undefined
                          )
                        }
                        disabled={isGenerating}
                      >
                        <option value="">Select structure (optional)</option>
                        {Object.values(WorkoutStructure).map((structure) => (
                          <option key={structure} value={structure}>
                            {structure}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Rest Between Sets (seconds)
                    </label>
                    <input
                      type="number"
                      className="input input-bordered validator w-full"
                      placeholder="60"
                      min="0"
                      value={workoutParams.restBetweenSets || ""}
                      onChange={(e) => validateRestBetweenSets(e.target.value)}
                      disabled={isGenerating}
                    />
                    {errors.restBetweenSets && (
                      <p className="validator-hint">{errors.restBetweenSets}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Target Muscle Groups
                    </label>
                    <input
                      type="text"
                      className="input input-bordered validator w-full"
                      placeholder="e.g., chest, back, legs"
                      value={workoutParams.targetMuscleGroups || ""}
                      onChange={(e) =>
                        handleParamChange(
                          "targetMuscleGroups",
                          e.target.value || undefined
                        )
                      }
                      disabled={isGenerating}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Include Exercises
                      </label>
                      <input
                        type="text"
                        className="input input-bordered validator w-full"
                        placeholder="e.g., squats, pushups"
                        value={workoutParams.includeExercises || ""}
                        onChange={(e) =>
                          handleParamChange(
                            "includeExercises",
                            e.target.value || undefined
                          )
                        }
                        disabled={isGenerating}
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Exclude Exercises
                      </label>
                      <input
                        type="text"
                        className="input input-bordered validator w-full"
                        placeholder="e.g., burpees, jumping jacks"
                        value={workoutParams.excludeExercises || ""}
                        onChange={(e) =>
                          handleParamChange(
                            "excludeExercises",
                            e.target.value || undefined
                          )
                        }
                        disabled={isGenerating}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="card-actions justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  isGenerating ||
                  !prompt.trim() ||
                  Object.keys(errors).length > 0
                }
              >
                {isGenerating ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Generating...
                  </>
                ) : (
                  "Generate Workout"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
