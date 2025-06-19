import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  useTrainerPersonaData,
  useTrainerPersonaError,
  useTrainerPersona,
} from "@/contexts/TrainerPersonaContext";
import { Bot, CheckCircle, Clock, Sparkles } from "lucide-react";

const GeneratingTrainerPage = () => {
  const navigate = useNavigate();
  const { refetch } = useTrainerPersona();
  const trainerPersona = useTrainerPersonaData();
  const error = useTrainerPersonaError();

  const [pollingCount, setPollingCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const timeIntervalRef = useRef<number | null>(null);

  const MAX_POLLING_ATTEMPTS = 60; // 5 minutes (60 attempts * 5s = 300s)
  const POLLING_INTERVAL = 5000; // 5 seconds

  useEffect(() => {
    // Start polling immediately
    const startPolling = () => {
      // Initial fetch
      refetch();

      // Set up polling interval
      intervalRef.current = setInterval(async () => {
        setPollingCount((prev) => {
          const newCount = prev + 1;

          // Check if we've exceeded max attempts
          if (newCount >= MAX_POLLING_ATTEMPTS) {
            setHasTimedOut(true);
            if (intervalRef.current !== null) {
              clearInterval(intervalRef.current);
            }
            if (timeIntervalRef.current !== null) {
              clearInterval(timeIntervalRef.current);
            }
            return newCount;
          }

          return newCount;
        });

        // Fetch latest data
        await refetch();
      }, POLLING_INTERVAL);

      // Set up time elapsed counter
      timeIntervalRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    };

    startPolling();

    // Cleanup on unmount
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      if (timeIntervalRef.current !== null) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, [refetch]);

  // Redirect to trainer page when persona is generated
  useEffect(() => {
    if (trainerPersona && !error) {
      // Clear intervals
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      if (timeIntervalRef.current !== null) {
        clearInterval(timeIntervalRef.current);
      }

      // Small delay to show success state before redirect
      setTimeout(() => {
        navigate("/dashboard/trainer", { replace: true });
      }, 2000);
    }
  }, [trainerPersona, error, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (hasTimedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-xl max-w-md w-full">
          <div className="card-body text-center">
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
                  setPollingCount(0);
                  setTimeElapsed(0);
                  setHasTimedOut(false);
                  // Restart polling
                  window.location.reload();
                }}
              >
                Continue Waiting
              </button>

              <button
                className="btn btn-ghost"
                onClick={() => navigate("/dashboard/trainer")}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (trainerPersona && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-xl max-w-md w-full">
          <div className="card-body text-center">
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-success animate-bounce" />
            </div>

            <h2 className="card-title justify-center text-xl mb-2">
              Your AI Trainer is Ready!
            </h2>

            <p className="text-base-content/70 mb-4">
              Your personalized trainer persona has been generated successfully.
            </p>

            <p className="text-sm text-base-content/50">
              Redirecting you now...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body text-center">
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
              <span>Generating personality traits...</span>
            </div>

            <progress className="progress progress-primary w-full"></progress>

            <div className="stats stats-horizontal bg-base-200 shadow">
              <div className="stat">
                <div className="stat-title text-xs">Time Elapsed</div>
                <div className="stat-value text-sm">
                  {formatTime(timeElapsed)}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title text-xs">Checks</div>
                <div className="stat-value text-sm">{pollingCount + 1}</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate("/dashboard/trainer")}
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
