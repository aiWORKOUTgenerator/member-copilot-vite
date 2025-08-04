import {
  useGenerateTrainerPersona,
  useTrainerPersonaData,
  useTrainerPersonaError,
  useTrainerPersonaHasNoPersona,
  useTrainerPersonaLoading,
} from "@/hooks/useTrainerPersona";
import { useUserAccess } from "@/hooks";
import EmptyStateBasic from "@/ui/shared/molecules/EmptyState";
import {
  ArrowRight,
  Bot,
  CheckCircle,
  Crown,
  Shield,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router";

const MyAITrainerPage = () => {
  const trainerPersona = useTrainerPersonaData();
  const isLoading = useTrainerPersonaLoading();
  const error = useTrainerPersonaError();
  const generateTrainerPersona = useGenerateTrainerPersona();
  const hasNoPersona = useTrainerPersonaHasNoPersona();
  const {
    canAccessFeature,
    isLoading: isAccessLoading,
    isLoaded: isAccessLoaded,
  } = useUserAccess();
  const navigate = useNavigate();

  // Check if user has access to trainer persona feature
  const hasTrainerAccess = canAccessFeature("ai_assistant_advanced");

  // Handle access control loading state
  if (isAccessLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }

  // Show access denied if user doesn't have trainer persona access
  if (!hasTrainerAccess && isAccessLoaded) {
    return (
      <div className="">
        {/* Hero Section */}
        <div className="hero min-h-[70vh] bg-gradient-to-r from-primary to-secondary">
          <div className="hero-content text-center text-primary-content max-w-5xl">
            <div>
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Bot
                    className="size-20 text-primary-content drop-shadow-lg"
                    strokeWidth={1.5}
                  />
                  <div className="absolute -top-2 -right-2">
                    <Crown className="size-8 text-warning drop-shadow-lg animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="badge badge-warning badge-lg mb-4 font-bold animate-pulse">
                🚀 JUST LAUNCHED
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Meet Your Personal
                <span className="text-warning block mt-2">
                  {" "}
                  AI Fitness Coach
                </span>
              </h1>

              <p className="text-lg md:text-xl mb-8 text-primary-content/90 leading-relaxed max-w-3xl mx-auto">
                Experience personalized fitness guidance with your own AI coach
                that adapts to your style. Our AI trainer creates a unique
                personality and communication approach that matches your
                preferences, making every workout feel like training with a real
                coach who truly understands you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <button
                  className="btn btn-warning btn-lg text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 min-w-[240px]"
                  onClick={() => navigate("/dashboard/billing")}
                >
                  <Crown className="size-6" />
                  Start Now - $10/mo (50% off)
                  <ArrowRight className="size-5" />
                </button>
              </div>

              <div className="flex justify-center items-center gap-6 text-sm text-primary-content/80">
                <div className="flex items-center gap-1">
                  <CheckCircle className="size-4" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="size-4" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error loading trainer persona: {error}</span>
      </div>
    );
  }

  if (hasNoPersona) {
    return (
      <div className="p-4 space-y-6">
        <h1 className="text-3xl font-bold">My AI Trainer</h1>

        <EmptyStateBasic
          icon={
            <Bot
              className="mx-auto size-16 text-primary/60"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          }
          title="No AI Trainer Persona Yet"
          description="You haven't been assigned an AI trainer persona yet. Your personalized AI trainer will be tailored to your fitness goals, communication preferences, and training style to provide you with the most effective coaching experience."
          actionLabel="Generate My Trainer"
          actionIcon={<Sparkles className="mr-2 size-4" aria-hidden="true" />}
          onAction={async () => {
            try {
              await generateTrainerPersona();
              navigate("/dashboard/trainer/generating");
            } catch (error) {
              console.error("Error starting trainer generation:", error);
            }
          }}
          className="mt-12"
        />

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg">
              What is an AI Trainer Persona?
            </h3>
            <div className="space-y-3 text-base-content/80">
              <p>
                Your AI Trainer Persona is a personalized virtual coach designed
                specifically for you. It includes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Personality Traits:</strong> Communication style that
                  matches your preferences
                </li>
                <li>
                  <strong>Expertise Areas:</strong> Specialized knowledge in
                  your areas of interest
                </li>
                <li>
                  <strong>Training Approach:</strong> Coaching methods tailored
                  to your learning style
                </li>
                <li>
                  <strong>Motivational Style:</strong> Encouragement and
                  feedback that resonates with you
                </li>
              </ul>
              <p>
                Once generated, your AI trainer will provide personalized
                workout plans, nutrition advice, and motivation that feels
                natural and effective for your unique fitness journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!trainerPersona) {
    return (
      <div className="alert alert-info">
        <span>No trainer persona found</span>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold">My AI Trainer</h1>

      <div className="">
        <div className="card-body">
          <div className="flex items-start gap-4">
            {trainerPersona.avatar_url && (
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img
                    src={trainerPersona.avatar_url}
                    alt={`${trainerPersona.trainer_name}'s avatar`}
                  />
                </div>
              </div>
            )}

            <div className="flex-1">
              <h2 className="card-title text-2xl">
                {trainerPersona.trainer_name}
              </h2>
              <p className="text-base-content/70 mb-4">
                {trainerPersona.trainer_bio}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Gender</h3>
                  <p className="text-base-content/80 capitalize">
                    {trainerPersona.trainer_gender}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Communication Style</h3>
                  <p className="text-base-content/80 capitalize">
                    {trainerPersona.communication_style}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold mb-2">Personality Traits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(trainerPersona.personality_traits).map(
                      ([key, value]) => (
                        <div key={key} className="card bg-base-200">
                          <div className="card-body p-4">
                            <h4 className="card-title text-sm opacity-80">
                              {key
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </h4>
                            <p className="text-base-content/90">{value}</p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold mb-2">Expertise Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {trainerPersona.expertise_areas.map((area, index) => (
                      <span key={index} className="badge badge-secondary">
                        {area
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAITrainerPage;
