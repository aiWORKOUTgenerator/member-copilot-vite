import { useGeneratedWorkouts } from "@/contexts/GeneratedWorkoutContext";
import { ArrowBigLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import WorkoutCustomization from "./components/WorkoutCustomization";
import { PerWorkoutOptions } from "./components/types";

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
        } else {
          // Convert numbers and strings to strings
          stringOptions[key] = String(value);
        }
      }
    });

    return stringOptions;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) return;

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
        prompt
      );

      console.log("Generated workout:", response);
      console.log("Submitted customization options:", stringOptions);

      // Redirect to the generated workout page
      navigate(`/dashboard/workouts/${response.id}`);
    } catch (error) {
      console.error("Failed to generate workout:", error);
      setIsGenerating(false);
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
  };

  // Function to use an example prompt
  const setExamplePrompt = (example: string) => {
    setPrompt(example);
  };

  // Handle workout generation from the upgrade overlay
  const handleGenerateWorkoutFromOverlay = () => {
    // Create a synthetic form event and call the existing handleSubmit
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent;
    handleSubmit(syntheticEvent);
  };

  // Handle upgrade action
  const handleUpgrade = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    navigate("/dashboard/billing");
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

      <div className="card card-border max-w-3xl mx-auto">
        <div className="card-body">
          <h2 className="card-title">Generate a New Workout</h2>
          <p className="text-sm text-base-content/70 mb-4">
            Describe what you want, then customize options below (all optional
            except description)
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block mb-2 font-medium flex justify-between items-center">
                <span>
                  Describe your workout needs{" "}
                  <span className="text-error">*</span>
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

            {/* Per Workout Options - Now using the component-based approach */}
            <WorkoutCustomization
              options={perWorkoutOptions}
              onChange={handlePerWorkoutOptionChange}
              errors={errors}
              disabled={isGenerating}
              onGenerateWorkout={handleGenerateWorkoutFromOverlay}
              onUpgrade={handleUpgrade}
            />

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
