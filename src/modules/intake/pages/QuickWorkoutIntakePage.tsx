'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '@/hooks/auth';
import { useAppConfig } from '@/hooks/useConfiguration';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AuthRequired, Button } from '@/ui';
import { IntakeFullScreenLayout } from '../components/IntakeFullScreenLayout';
import { RadioCardGroupInput } from '@/ui/shared/molecules/RadioCardGroupInput';
import type {
  AgeRange,
  EnergyLevel,
  ExperienceLevel,
  QuickWorkoutIntake,
  StepDescriptor,
} from '../types/quickWorkoutIntake';

type StepKey = StepDescriptor['key'];

const AGE_OPTIONS: AgeRange[] = ['18-24', '25-34', '35-44', '45+'];
const EXPERIENCE_OPTIONS: ExperienceLevel[] = [
  'beginner',
  'intermediate',
  'advanced',
];
const ENERGY_OPTIONS: EnergyLevel[] = ['low', 'moderate', 'high'];

export default function QuickWorkoutIntakePage() {
  const { isLoaded, isSignedIn } = useAuth();
  const analytics = useAnalytics();
  const navigate = useNavigate();
  const { locationId } = useParams<{ locationId: string }>();
  const appConfig = useAppConfig();

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [attemptedNext, setAttemptedNext] = useState<boolean>(false);
  const [responses, setResponses] = useState<QuickWorkoutIntake>({
    locationId: locationId || '',
    ageRange: null,
    experience: null,
    energy: null,
  });

  const stepOrder: StepDescriptor[] = useMemo(
    () => [
      { key: 'welcome', title: 'Welcome' },
      { key: 'ageRange', title: 'Your Age Range' },
      { key: 'experience', title: 'Fitness Experience' },
      { key: 'energy', title: "Today's Energy" },
      { key: 'complete', title: 'All Set' },
    ],
    []
  );

  const currentStep: StepKey = stepOrder[currentStepIndex]?.key;
  const isLastQuestionStep = currentStep === 'energy';

  const legendRef = useRef<HTMLLegendElement | null>(null);

  // Initial analytics page view
  useEffect(() => {
    analytics.track('QuickWorkoutIntake Viewed', {
      tracked_at: new Date().toISOString(),
    });
  }, [analytics]);

  // Location validation (Phase 6)
  const isLocationValid = Boolean(locationId && locationId.trim().length > 0);
  useEffect(() => {
    if (!isLocationValid) {
      console.warn('Invalid or missing locationId for quick workout intake');
    }
  }, [isLocationValid]);

  // Focus management on step change (must be before any early returns)
  useEffect(() => {
    if (legendRef.current) {
      legendRef.current.focus();
    }
  }, [currentStepIndex]);

  // Handlers
  const handleStart = () => {
    setAttemptedNext(false);
    setCurrentStepIndex(1);
    analytics.track('QuickWorkoutIntake Step Next', { stepName: 'welcome' });
  };

  const goBack = () => {
    if (currentStepIndex === 0) return;
    setAttemptedNext(false);
    setCurrentStepIndex((idx) => Math.max(0, idx - 1));
    analytics.track('QuickWorkoutIntake Step Back', { stepName: currentStep });
  };

  const goNext = () => {
    // Validation
    if (currentStep === 'ageRange' && !responses.ageRange) {
      setAttemptedNext(true);
      return;
    }
    if (currentStep === 'experience' && !responses.experience) {
      setAttemptedNext(true);
      return;
    }
    if (currentStep === 'energy' && !responses.energy) {
      setAttemptedNext(true);
      return;
    }

    setAttemptedNext(false);

    if (isLastQuestionStep) {
      console.log('QuickWorkoutIntake Completed', responses);
      analytics.track('QuickWorkoutIntake Completed', {
        ...responses,
        tracked_at: new Date().toISOString(),
      });
      setCurrentStepIndex(stepOrder.findIndex((s) => s.key === 'complete'));
      return;
    }

    setCurrentStepIndex((idx) => Math.min(stepOrder.length - 1, idx + 1));
    analytics.track('QuickWorkoutIntake Step Next', { stepName: currentStep });
  };

  // Auth gate
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }
  if (!isSignedIn) {
    return <AuthRequired signInLink="/sign-in" />;
  }

  const nextDisabled =
    currentStep === 'ageRange'
      ? !responses.ageRange
      : currentStep === 'experience'
        ? !responses.experience
        : currentStep === 'energy'
          ? !responses.energy
          : false;

  const footer =
    currentStep === 'welcome' || currentStep === 'complete' ? null : (
      <nav className="w-full">
        <div className="flex w-full items-center justify-between gap-3">
          <div>
            <Button
              variant="ghost"
              size="md"
              onClick={goBack}
              aria-label="Back"
            >
              Back
            </Button>
          </div>
          <div>
            <Button
              variant="primary"
              size="lg"
              onClick={goNext}
              aria-label="Next"
              disabled={nextDisabled}
            >
              Next
            </Button>
          </div>
        </div>
      </nav>
    );

  return (
    <IntakeFullScreenLayout
      title={stepOrder[currentStepIndex]?.title || 'Quick Workout'}
      footer={footer}
    >
      {!isLocationValid && (
        <section className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Invalid Link</h2>
          <p className="text-base-content/70">
            The link is missing a valid location. Please try again.
          </p>
        </section>
      )}

      {isLocationValid && (
        <>
          {/* Welcome */}
          {currentStep === 'welcome' && (
            <section className="text-center space-y-6">
              {appConfig?.logoUrl && (
                <img
                  src={appConfig.logoUrl}
                  alt="Brand Logo"
                  className="h-16 w-auto mx-auto"
                />
              )}
              <h1 className="text-2xl font-bold">Get A Workout For Today</h1>
              <p className="text-base-content/70">
                Answer a few quick questions and we will tailor a workout for
                you.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleStart}
                aria-label="Start intake"
                fullWidth
              >
                Start
              </Button>
            </section>
          )}

          {/* Age Range */}
          {currentStep === 'ageRange' && (
            <section>
              <RadioCardGroupInput
                id="age-range"
                name="ageRange"
                legend="What is your age range?"
                legendRef={legendRef}
                options={AGE_OPTIONS.map((opt) => ({
                  id: opt,
                  value: opt,
                  title: opt,
                }))}
                value={responses.ageRange}
                onChange={(value) =>
                  setResponses((r) => ({ ...r, ageRange: value as AgeRange }))
                }
                isValid={!attemptedNext || Boolean(responses.ageRange)}
                validationMessage="Please select an age range."
              />
            </section>
          )}

          {/* Experience */}
          {currentStep === 'experience' && (
            <section>
              <RadioCardGroupInput
                id="experience"
                name="experience"
                legend="What is your fitness experience?"
                legendRef={legendRef}
                options={EXPERIENCE_OPTIONS.map((opt) => ({
                  id: opt,
                  value: opt,
                  title: opt.charAt(0).toUpperCase() + opt.slice(1),
                }))}
                value={responses.experience}
                onChange={(value) =>
                  setResponses((r) => ({
                    ...r,
                    experience: value as ExperienceLevel,
                  }))
                }
                isValid={!attemptedNext || Boolean(responses.experience)}
                validationMessage="Please select your experience."
              />
            </section>
          )}

          {/* Energy */}
          {currentStep === 'energy' && (
            <section>
              <RadioCardGroupInput
                id="energy"
                name="energy"
                legend="How is your energy level today?"
                legendRef={legendRef}
                options={ENERGY_OPTIONS.map((opt) => ({
                  id: opt,
                  value: opt,
                  title: opt.charAt(0).toUpperCase() + opt.slice(1),
                }))}
                value={responses.energy}
                onChange={(value) =>
                  setResponses((r) => ({ ...r, energy: value as EnergyLevel }))
                }
                isValid={!attemptedNext || Boolean(responses.energy)}
                validationMessage="Please select your energy level."
              />
            </section>
          )}

          {/* Complete */}
          {currentStep === 'complete' && (
            <section className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">You’re all set!</h2>
              <p className="text-base-content/70">
                We’ve captured your preferences. Your workout will be tailored
                accordingly.
              </p>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </section>
          )}
        </>
      )}
    </IntakeFullScreenLayout>
  );
}
