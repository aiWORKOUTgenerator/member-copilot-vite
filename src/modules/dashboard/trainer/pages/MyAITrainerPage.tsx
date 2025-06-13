import {
  useTrainerPersonaData,
  useTrainerPersonaLoading,
  useTrainerPersonaError,
  useTrainerPersonaHasNoPersona,
} from "@/contexts/TrainerPersonaContext";
import EmptyStateBasic from "@/ui/shared/molecules/EmptyState";
import { Bot, Sparkles } from "lucide-react";

const MyAITrainerPage = () => {
  const trainerPersona = useTrainerPersonaData();
  const isLoading = useTrainerPersonaLoading();
  const error = useTrainerPersonaError();
  const hasNoPersona = useTrainerPersonaHasNoPersona();

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
          onAction={() => {
            // TODO: Implement trainer persona generation
            console.log("Generate trainer persona");
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

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-start gap-4">
            {trainerPersona.avatar_photo_url && (
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img
                    src={trainerPersona.avatar_photo_url}
                    alt={`${trainerPersona.name}'s avatar`}
                  />
                </div>
              </div>
            )}

            <div className="flex-1">
              <h2 className="card-title text-2xl">{trainerPersona.name}</h2>
              <p className="text-base-content/70 mb-4">
                {trainerPersona.user_shown_bio}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Gender</h3>
                  <p className="text-base-content/80">
                    {trainerPersona.gender}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Communication Style</h3>
                  <p className="text-base-content/80">
                    {trainerPersona.communication_style}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Personality Traits</h3>
                  <div className="flex flex-wrap gap-2">
                    {trainerPersona.personality_traits.map((trait, index) => (
                      <span key={index} className="badge badge-primary">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Expertise Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {trainerPersona.expertise_areas.map((area, index) => (
                      <span key={index} className="badge badge-secondary">
                        {area}
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
