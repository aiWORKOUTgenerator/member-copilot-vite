import { useUserAccess } from '@/hooks';
import { useProfileCompleteness } from '@/hooks/useProfileCompleteness';
import {
  useGenerateTrainerPersona,
  useTrainerPersonaData,
  useTrainerPersonaError,
  useTrainerPersonaGenerationError,
  useTrainerPersonaGenerationLoading,
  useTrainerPersonaHasNoPersona,
  useTrainerPersonaIsGenerating,
  useTrainerPersonaLoading,
} from '@/hooks/useTrainerPersona';
import {
  useTrainerPersonaGenerationBlockedReason,
  useTrainerPersonaStatus,
} from '@/hooks/useTrainerPersonaStatus';
import { ErrorToast } from '@/ui/shared/atoms/ErrorToast';
import {
  AlertCircle,
  ArrowRight,
  Bot,
  CheckCircle,
  Crown,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ProfileIncompleteAlert } from '../components/ProfileIncompleteAlert';

const MyAITrainerPage = () => {
  const trainerPersona = useTrainerPersonaData();
  const isLoading = useTrainerPersonaLoading();
  const error = useTrainerPersonaError();
  const generateTrainerPersona = useGenerateTrainerPersona();
  const hasNoPersona = useTrainerPersonaHasNoPersona();
  const isGenerating = useTrainerPersonaIsGenerating();
  const isGenerationLoading = useTrainerPersonaGenerationLoading();
  const generationError = useTrainerPersonaGenerationError();

  // Status hooks (no polling needed on this page)
  const { status: personaStatus } = useTrainerPersonaStatus(false);
  const blockedReason = useTrainerPersonaGenerationBlockedReason();

  // Profile completeness using existing logic
  const {
    overallProgress,
    isSufficientForGeneration,
    isLoading: isProfileLoading,
  } = useProfileCompleteness();

  const {
    canAccessFeature,
    isLoading: isAccessLoading,
    isLoaded: isAccessLoaded,
  } = useUserAccess();
  const navigate = useNavigate();

  // Local state for error handling
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Check if user has access to trainer persona feature
  const hasTrainerAccess = canAccessFeature('ai_assistant_advanced');

  // Handle generation errors
  useEffect(() => {
    if (generationError) {
      setErrorMessage(generationError);
      setShowErrorToast(true);
    }
  }, [generationError]);

  // Handle loading states
  if (isAccessLoading || isProfileLoading) {
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
                  {' '}
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
                  onClick={() => navigate('/dashboard/billing')}
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

  // Show generating state if persona is currently being generated
  if (
    isGenerating ||
    personaStatus?.generation_status.status === 'generating'
  ) {
    navigate('/dashboard/trainer/generating');
    return null;
  }

  if (hasNoPersona) {
    return (
      <div className="p-4 space-y-6">
        <h1 className="text-3xl font-bold">My AI Trainer</h1>

        {/* Show profile incomplete alert if profile is not sufficient */}
        {!isSufficientForGeneration && (
          <ProfileIncompleteAlert
            overallProgress={overallProgress}
            className="mb-6"
          />
        )}

        <div className="text-center mt-12 flex flex-col items-center">
          <Bot
            className="mx-auto size-16 text-primary/60"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <h3 className="mt-2 text-md font-semibold text-primary">
            No AI Trainer Persona Yet
          </h3>
          <p className="mt-1 text-md text-primary/50 max-w-2xl">
            You haven't been assigned an AI trainer persona yet. Your
            personalized AI trainer will be tailored to your fitness goals,
            communication preferences, and training style to provide you with
            the most effective coaching experience.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={async () => {
                if (!isSufficientForGeneration) {
                  navigate('/dashboard/profile');
                  return;
                }

                try {
                  await generateTrainerPersona();
                  navigate('/dashboard/trainer/generating');
                } catch (error) {
                  // Error is already handled by the useEffect above
                  console.error('Error starting trainer generation:', error);
                }
              }}
              disabled={!isSufficientForGeneration || isGenerationLoading}
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-content shadow-[0_0_20px_var(--color-primary)] hover:shadow-[0_0_30px_var(--color-primary)] hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-[0_0_20px_var(--color-primary)]"
            >
              {isGenerationLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 size-4" aria-hidden="true" />
                  {isSufficientForGeneration
                    ? 'Generate My Trainer'
                    : 'Complete Profile First'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Show blocked reason if generation is blocked */}
        {blockedReason && (
          <div className="bg-base-100 shadow-sm border border-base-300 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              <h3 className="font-semibold">Generation Blocked</h3>
            </div>
            <p className="text-sm text-base-content/70">{blockedReason}</p>
          </div>
        )}

        {/* Error Toast */}
        {showErrorToast && (
          <ErrorToast
            message={errorMessage}
            onDismiss={() => setShowErrorToast(false)}
          />
        )}

        <div className="bg-base-100 shadow-sm border border-base-300 rounded-lg">
          <div className="p-4">
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
      <div>
        <div className="card-body">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            {trainerPersona.avatar_url && (
              <div className="avatar mb-2 md:mb-0">
                <div className="w-24 rounded-full">
                  <img
                    src={trainerPersona.avatar_url}
                    alt={`${trainerPersona.trainer_name}'s avatar`}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 w-full">
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
                    {Object.entries(
                      trainerPersona.personality_traits ?? {}
                    ).map(([key, value]) => (
                      <div key={key} className="bg-base-200 rounded-lg">
                        <div className="card-body p-4">
                          <h4 className="card-title text-sm opacity-80">
                            {key
                              .replace(/_/g, ' ')
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </h4>
                          <p className="text-base-content/90">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold mb-2">Expertise Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {trainerPersona.expertise_areas?.map((area, index) => (
                      <span key={index} className="badge badge-secondary">
                        {area
                          .replace(/_/g, ' ')
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
