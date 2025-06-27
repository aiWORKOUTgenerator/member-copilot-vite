import { useGeneratedWorkouts } from "@/contexts/GeneratedWorkoutContext";
import { ArrowBigLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import WorkoutCustomization from "./components/WorkoutCustomization";
import { PerWorkoutOptions } from "./components/types";
import { useAnalytics } from "@/hooks/useAnalytics";

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
  const [perWorkoutOptions, setPerWorkoutOptions] = useState<PerWorkoutOptions>(
    {}
  );
  const { createWorkout } = useGeneratedWorkouts();
  const [errors, setErrors] = useState<
    Partial<Record<keyof PerWorkoutOptions, string>>
  >({});
  const [displayPrompts, setDisplayPrompts] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"custom" | "quick">("custom");
  const analytics = useAnalytics();

  // Track workout generation page views
  useEffect(() => {
    analytics.track("Workout Generation Page Viewed", {
      tracked_at: new Date().toISOString(),
    });
  }, [analytics]);

  // Select 3 random prompts when the component mounts
  useEffect(() => {
    const shuffled = [...WORKOUT_PROMPTS].sort(() => 0.5 - Math.random());
    setDisplayPrompts(shuffled.slice(0, 3));
  }, []);

  // Convert per-workout options to string format for backend submission
  const convertOptionsToStrings = (
    options: PerWorkoutOptions
  ): Record<string, string> => {
    const stringOptions: Record<string, string> = {};

    // Convert each option to string format
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Convert arrays to comma-separated strings
          if (value.length > 0) {
            stringOptions[key] = value.join(", ");
          }
        } else if (typeof value === 'object') {
          // ✅ FIX: Proper JSON serialization for complex objects
          stringOptions[key] = JSON.stringify(value);
        } else {
          // Convert primitives to strings
          stringOptions[key] = String(value);
        }
      }
    });

    return stringOptions;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For quick workout, use default prompt if none provided
    const workoutPrompt = activeTab === "quick" && !prompt.trim() ? "" : prompt;

    if (activeTab === "custom" && !workoutPrompt.trim()) return;

    // Validate workout duration if provided
    const newErrors: Partial<Record<keyof PerWorkoutOptions, string>> = {};

    if (perWorkoutOptions.customization_duration !== undefined) {
      const duration = Number(perWorkoutOptions.customization_duration);
      if (isNaN(duration) || duration < 5 || duration > 300) {
        newErrors.customization_duration =
          "Duration must be between 5 and 300 minutes";
      }
    }

    // If there are validation errors, don't proceed
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsGenerating(true);

    try {
      // Convert per-workout options to string format
      const stringOptions = convertOptionsToStrings(perWorkoutOptions);

      // Submit string-formatted customization options
      const combinedParams = stringOptions;

      const response = await createWorkout(
        import.meta.env.VITE_GENERATED_WORKOUT_CONFIGURATION_ID,
        combinedParams,
        workoutPrompt
      );

      console.log("Generated workout:", response);
      console.log("Submitted customization options:", stringOptions);

      // Redirect to the generated workout page
      navigate(`/dashboard/workouts/${response.id}`);

      // Track successful workout generation
      handleGenerationSuccess(response.id);
    } catch (error) {
      console.error("Failed to generate workout:", error);
      setIsGenerating(false);

      // Track generation failures
      handleGenerationError(
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  const handlePerWorkoutOptionChange = (
    option: keyof PerWorkoutOptions,
    value: unknown
  ) => {
    setPerWorkoutOptions({
      ...perWorkoutOptions,
      [option]: value,
    });

    // Clear error for this field if it exists
    if (errors[option]) {
      setErrors({
        ...errors,
        [option]: undefined,
      });
    }

    // Track preference changes
    handlePreferenceChange(option, value);
  };

  // Function to use an example prompt
  const setExamplePrompt = (example: string) => {
    setPrompt(example);
  };

  // Track successful workout generation
  const handleGenerationSuccess = (workoutId: string) => {
    analytics.track("Workout Generated Successfully", {
      workoutId,
      tracked_at: new Date().toISOString(),
    });
  };

  // Track generation failures
  const handleGenerationError = (error: string) => {
    analytics.track("Workout Generation Failed", {
      error,
      tracked_at: new Date().toISOString(),
    });
  };

  // Track preference changes
  const handlePreferenceChange = (preferenceType: string, value: unknown) => {
    analytics.track("Workout Preference Changed", {
      preferenceType,
      value,
      tracked_at: new Date().toISOString(),
    });
  };

  return (
    <div className="p-2 sm:p-4">
      <div className="mb-2 sm:mb-4">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost flex items-center"
        >
          <ArrowBigLeft className="w-4 h-4" />
          Back to workouts
        </button>
      </div>

      <div className="card card-border max-w-4xl mx-auto">
        <div className="card-body">
          <h2 className="card-title">Generate a New Workout</h2>

          {/* Mode Selection */}
          <div className="join mb-6 w-fit">
            <button
              type="button"
              className={`btn join-item ${
                activeTab === "custom" ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setActiveTab("custom")}
            >
              Custom Workout
            </button>
            <button
              type="button"
              className={`btn join-item ${
                activeTab === "quick" ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setActiveTab("quick")}
            >
              Quick Workout
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === "custom" ? (
              <>
                <p className="text-sm text-base-content/70 mb-6">
                  Customize your workout with the options below, then optionally
                  describe additional requirements
                </p>

                {/* Workout Customization - Now above the textarea */}
                <WorkoutCustomization
                  options={perWorkoutOptions}
                  onChange={handlePerWorkoutOptionChange}
                  errors={errors}
                  disabled={isGenerating}
                  mode="custom"
                />

                {/* Text area - Now below customization */}
                <div className="mb-6">
                  <label className="block mb-2 font-medium flex justify-between items-center">
                    <span>
                      Additional Requirements{" "}
                      <span className="text-sm font-normal text-base-content/70">
                        (optional)
                      </span>
                    </span>
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
                          index === 0
                            ? "success"
                            : index === 1
                            ? "info"
                            : "warning"
                        } cursor-pointer hover:bg-base-300`}
                        onClick={() => setExamplePrompt(example)}
                      >
                        <code>{example}</code>
                      </pre>
                    ))}
                  </div>

                  <textarea
                    className="textarea textarea-bordered validator w-full min-h-32"
                    placeholder="Describe any additional requirements, modifications, or specific goals for your workout..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isGenerating}
                  ></textarea>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-base-content/70 mb-6">
                  Generate a quick workout based on your profile and preferences
                </p>

                {/* Quick Workout - Only duration */}
                <WorkoutCustomization
                  options={perWorkoutOptions}
                  onChange={handlePerWorkoutOptionChange}
                  errors={errors}
                  disabled={isGenerating}
                  mode="quick"
                />
              </>
            )}

            <div className="card-actions justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isGenerating || Object.keys(errors).length > 0}
              >
                {isGenerating ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Generating...
                  </>
                ) : activeTab === "quick" ? (
                  "Generate Quick Workout"
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
