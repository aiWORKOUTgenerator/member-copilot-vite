import { useTrainerPersona } from '@/hooks/useTrainerPersona';
import { useTrainerPersonaStatus } from '@/hooks/useTrainerPersonaStatus';
import { AlertTriangle, Bot, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useWorkoutAnalytics } from '@/modules/dashboard/workouts/hooks/useWorkoutAnalytics';

const GeneratingTrainerPage = () => {
  const navigate = useNavigate();
  const { trainerPersona, refetch: refetchTrainerPersona } =
    useTrainerPersona();
  const { trackTrainerPersonaCreated } = useWorkoutAnalytics();

  // Use React Query's built-in polling - much simpler!
  const { status, error, isGenerationComplete } = useTrainerPersonaStatus(true); // Enable polling

  // Track time elapsed for user feedback
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime] = useState(Date.now());

  // Update time elapsed every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Handle navigation when generation completes
  useEffect(() => {
    if (isGenerationComplete) {
      // Refetch trainer persona data to get the latest data
      refetchTrainerPersona().then(() => {
        // Track trainer persona creation
        trackTrainerPersonaCreated('unknown');
        // Small delay to show success state before redirect
        navigate('/dashboard/trainer', { replace: true });
      });
    }
  }, [
    isGenerationComplete,
    refetchTrainerPersona,
    navigate,
    trackTrainerPersonaCreated,
  ]);

  useEffect(() => {
    console.log('trainerPersona', trainerPersona);
    console.log('status', status);
  }, [trainerPersona, status]);

  // Get estimated completion info from status
  const timeRemainingSeconds = status?.estimated_time_remaining_seconds ?? null;
  const completionPercentage = status?.estimated_completion_percentage ?? null;

  // Check for timeout (5 minutes)
  const hasTimedOut = timeElapsed > 300;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show error state if generation failed
  if (status?.generation_status.status === 'failed' || error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-base-100 shadow-xl max-w-md w-full rounded-lg">
          <div className="p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-error" />
            </div>

            <h2 className="card-title justify-center text-xl mb-2">
              Generation Failed
            </h2>

            <p className="text-base-content/70 mb-6">
              {error ||
                'There was an error generating your trainer persona. Please try again.'}
            </p>

            <div className="flex flex-col gap-3">
              <button
                className="btn btn-primary"
                onClick={() => navigate('/dashboard/trainer')}
              >
                Try Again
              </button>

              <button
                className="btn btn-ghost"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasTimedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-base-100 shadow-xl max-w-md w-full rounded-lg">
          <div className="p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-warning" />
            </div>

            <h2 className="card-title justify-center text-xl mb-2">
              Generation Taking Longer Than Expected
            </h2>

            <p className="text-base-content/70 mb-6">
              Your trainer persona generation is taking longer than usual. This
              sometimes happens during high demand periods.
            </p>

            <div className="flex flex-col gap-3">
              <button
                className="btn btn-primary"
                onClick={() => {
                  // Reset timer and continue waiting
                  setTimeElapsed(0);
                  window.location.reload();
                }}
              >
                Continue Waiting
              </button>

              <button
                className="btn btn-ghost"
                onClick={() => navigate('/dashboard/trainer')}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isGenerationComplete || trainerPersona?.has_persona) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-base-100 shadow-xl max-w-md w-full rounded-lg">
          <div className="p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-success animate-bounce" />
            </div>

            <h2 className="card-title justify-center text-xl mb-2">
              Your AI Trainer is Ready!
            </h2>

            <p className="text-base-content/70 mb-4">
              {trainerPersona?.trainer_name
                ? `Meet ${trainerPersona.trainer_name}, your personalized AI trainer!`
                : 'Your personalized trainer persona has been generated successfully.'}
            </p>

            <button
              className="btn btn-primary mt-4"
              onClick={() => navigate('/dashboard/trainer')}
            >
              Meet My Trainer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-base-100 shadow-xl max-w-md w-full rounded-lg">
        <div className="p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Bot className="w-8 h-8 text-primary animate-pulse" />
          </div>

          <h2 className="card-title justify-center text-xl mb-2">
            Creating Your AI Trainer
          </h2>

          <p className="text-base-content/70 mb-6">
            We're analyzing your preferences and creating a personalized trainer
            just for you. This usually takes about 30 seconds.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-base-content/60">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>
                {status?.generation_status.status === 'generating'
                  ? 'Analyzing your profile and generating personality traits...'
                  : 'Generating personality traits...'}
              </span>
            </div>

            {/* Progress bar with percentage if available */}
            {completionPercentage !== null ? (
              <div className="space-y-2">
                <progress
                  className="progress progress-primary w-full"
                  value={completionPercentage}
                  max="100"
                ></progress>
                <p className="text-xs text-base-content/50 text-center">
                  {completionPercentage}% complete
                </p>
              </div>
            ) : (
              <progress className="progress progress-primary w-full"></progress>
            )}

            <div className="stats stats-horizontal bg-base-200 shadow">
              <div className="stat">
                <div className="stat-title text-xs">Time Elapsed</div>
                <div className="stat-value text-sm">
                  {formatTime(timeElapsed)}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title text-xs">Status</div>
                <div className="stat-value text-sm">
                  {status?.generation_status.status === 'generating'
                    ? 'Generating'
                    : 'Checking'}
                </div>
              </div>
              {timeRemainingSeconds !== null && (
                <div className="stat">
                  <div className="stat-title text-xs">Est. Remaining</div>
                  <div className="stat-value text-sm">
                    {formatTime(timeRemainingSeconds)}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/dashboard/trainer')}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratingTrainerPage;
