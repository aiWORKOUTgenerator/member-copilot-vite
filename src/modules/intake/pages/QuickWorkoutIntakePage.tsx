'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '@/hooks/auth';
import { useAppConfig } from '@/hooks/useConfiguration';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AuthRequired, Button } from '@/ui';
import { IntakeFullScreenLayout } from '../components/IntakeFullScreenLayout';
import { StepTransition } from '../components/StepTransition';
import { RadioCardGroupInput } from '@/ui/shared/molecules/RadioCardGroupInput';
import { useGeneratedWorkouts } from '@/hooks/useGeneratedWorkouts';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation as useLocationState } from '@/hooks/useLocation';
import { usePusherService } from '@/hooks/useServices';
import { ensureWorkoutChunkBinding } from '@/services/pusher/workoutChunkBinding';
import type { WorkoutParams } from '@/domain/entities/workoutParams';
import type {
  AgeRange,
  DurationIntensity,
  ExperienceLevel,
  QuickWorkoutIntake,
  StepDescriptor,
} from '../types/quickWorkoutIntake';

type StepKey = StepDescriptor['key'];

const AGE_OPTIONS: AgeRange[] = [
  'Male 18-34',
  'Male 35-54',
  'Male 55+',
  'Female 18-34',
  'Female 35-54',
  'Female 55+',
];
const EXPERIENCE_OPTIONS: ExperienceLevel[] = [
  'goal_fatloss_low',
  'goal_fatloss_mod',
  'goal_fatloss_high',
  'goal_muscle_low',
  'goal_muscle_mod',
  'goal_muscle_high',
  'goal_endurance_low_mod',
  'goal_endurance_high',
  'goal_strength_mod_high',
];
const DURATION_INTENSITY_OPTIONS: DurationIntensity[] = [
  'dur30_low',
  'dur30_mod',
  'dur30_high',
  'dur45_low',
  'dur45_mod',
  'dur45_high',
  'dur60_low',
];

export default function QuickWorkoutIntakePage() {
  const { isLoaded, isSignedIn } = useAuth();
  const analytics = useAnalytics();
  const navigate = useNavigate();
  const { locationId } = useParams<{ locationId: string }>();
  const appConfig = useAppConfig();
  const {
    locations,
    isLoading: isLocationsLoading,
    isLoaded: isLocationsLoaded,
    error: locationsError,
  } = useLocationState();
  const {
    createWorkout,
    isLoading: isGenerating,
    error: generationError,
  } = useGeneratedWorkouts();
  const queryClient = useQueryClient();
  const pusherService = usePusherService();

  const mapSexAgeToText = (age: AgeRange | null): string | undefined => {
    return age || undefined;
  };

  const mapExperienceToText = (
    exp: ExperienceLevel | null
  ): string | undefined => {
    switch (exp) {
      case 'goal_fatloss_low':
        return 'Fat loss - Low activity';
      case 'goal_fatloss_mod':
        return 'Fat loss - Somewhat active';
      case 'goal_fatloss_high':
        return 'Fat loss - Consistently active';
      case 'goal_muscle_low':
        return 'Build muscle - Low activity';
      case 'goal_muscle_mod':
        return 'Build muscle - Somewhat active';
      case 'goal_muscle_high':
        return 'Build muscle - Consistently active';
      case 'goal_endurance_low_mod':
        return 'Endurance - Light/Moderate activity';
      case 'goal_endurance_high':
        return 'Endurance - Consistently active';
      case 'goal_strength_mod_high':
        return 'Strength/Power - Regular training';
      default:
        return undefined;
    }
  };

  const mapDurationIntensityToText = (
    di: DurationIntensity | null
  ): string | undefined => {
    switch (di) {
      case 'dur30_low':
        return '30 minutes - Low intensity';
      case 'dur30_mod':
        return '30 minutes - Moderate intensity';
      case 'dur30_high':
        return '30 minutes - High intensity';
      case 'dur45_low':
        return '45 minutes - Low intensity';
      case 'dur45_mod':
        return '45 minutes - Moderate intensity';
      case 'dur45_high':
        return '45 minutes - High intensity';
      case 'dur60_low':
        return '60 minutes - Low intensity';
      default:
        return undefined;
    }
  };

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
      { key: 'energy', title: 'Duration & Intensity' },
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

  // Location validation & retrieval
  const hasLocationId = Boolean(locationId && locationId.trim().length > 0);
  const selectedLocation = useMemo(
    () => locations.find((loc) => loc.id === locationId) ?? null,
    [locations, locationId]
  );
  useEffect(() => {
    if (!hasLocationId) {
      console.warn('Invalid or missing locationId for quick workout intake');
    }
    if (hasLocationId && isLocationsLoaded && !selectedLocation) {
      console.warn('Location not found for id:', locationId);
    }
  }, [hasLocationId, isLocationsLoaded, selectedLocation, locationId]);

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
      // Generation is handled on energy selection; nothing to do here
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
              disabled={isGenerating}
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
              disabled={nextDisabled || isGenerating}
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
      {/* Location state handling */}
      {!hasLocationId && (
        <section className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Invalid Link</h2>
          <p className="text-base-content/70">
            The link is missing a valid location. Please try again.
          </p>
        </section>
      )}

      {hasLocationId && isLocationsLoading && (
        <section className="min-h-[50vh] flex items-center justify-center">
          <span
            className="loading loading-ring loading-lg"
            aria-label="Loading locations"
          ></span>
        </section>
      )}

      {hasLocationId && !isLocationsLoading && !selectedLocation && (
        <section className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Location Not Found</h2>
          <p className="text-base-content/70">
            We could not find the location for this link. Please check the link
            and try again.
          </p>
          {locationsError && (
            <p className="text-error text-sm" role="alert">
              {locationsError}
            </p>
          )}
        </section>
      )}

      {hasLocationId && !isLocationsLoading && selectedLocation && (
        <>
          {/* Welcome */}
          {currentStep === 'welcome' && (
            <StepTransition>
              <section className="text-center space-y-6">
                {appConfig?.logoUrl && (
                  <img
                    src={appConfig.logoUrl}
                    alt="Brand Logo"
                    className="h-16 w-auto mx-auto"
                  />
                )}
                <h1 className="text-2xl font-bold">
                  Get An AI Powered Workout For Today
                </h1>
                <p className="text-base-content/70">
                  at {selectedLocation.name}
                </p>
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
            </StepTransition>
          )}

          {/* Age Range */}
          {currentStep === 'ageRange' && (
            <StepTransition>
              <section>
                <RadioCardGroupInput
                  id="age-range"
                  name="ageRange"
                  legend=""
                  legendRef={legendRef}
                  options={AGE_OPTIONS.map((opt) => ({
                    id: opt,
                    value: opt,
                    title: opt,
                  }))}
                  value={responses.ageRange}
                  onChange={(value) => {
                    setResponses((r) => ({
                      ...r,
                      ageRange: value as AgeRange,
                    }));
                    setAttemptedNext(false);
                    setCurrentStepIndex((idx) =>
                      Math.min(stepOrder.length - 1, idx + 1)
                    );
                    analytics.track('QuickWorkoutIntake Step Next', {
                      stepName: 'ageRange',
                    });
                  }}
                  isValid={!attemptedNext || Boolean(responses.ageRange)}
                  validationMessage="Please select an age range."
                />
              </section>
            </StepTransition>
          )}

          {/* Experience */}
          {currentStep === 'experience' && (
            <StepTransition>
              <section>
                <RadioCardGroupInput
                  id="experience"
                  name="experience"
                  legend="What is your goal and activity level?"
                  legendRef={legendRef}
                  options={EXPERIENCE_OPTIONS.map((opt) => ({
                    id: opt,
                    value: opt,
                    title:
                      opt === 'goal_fatloss_low'
                        ? 'Fat loss • Low activity'
                        : opt === 'goal_fatloss_mod'
                          ? 'Fat loss • Somewhat active'
                          : opt === 'goal_fatloss_high'
                            ? 'Fat loss • Consistently active'
                            : opt === 'goal_muscle_low'
                              ? 'Build muscle • Low activity'
                              : opt === 'goal_muscle_mod'
                                ? 'Build muscle • Somewhat active'
                                : opt === 'goal_muscle_high'
                                  ? 'Build muscle • Consistently active'
                                  : opt === 'goal_endurance_low_mod'
                                    ? 'Endurance • Light/Moderate activity'
                                    : opt === 'goal_endurance_high'
                                      ? 'Endurance • Consistently active'
                                      : 'Strength/Power • Regular training',
                  }))}
                  value={responses.experience}
                  onChange={(value) => {
                    setResponses((r) => ({
                      ...r,
                      experience: value as ExperienceLevel,
                    }));
                    setAttemptedNext(false);
                    setCurrentStepIndex((idx) =>
                      Math.min(stepOrder.length - 1, idx + 1)
                    );
                    analytics.track('QuickWorkoutIntake Step Next', {
                      stepName: 'experience',
                    });
                  }}
                  isValid={!attemptedNext || Boolean(responses.experience)}
                  validationMessage="Please select your experience."
                />
              </section>
            </StepTransition>
          )}

          {/* Duration & Intensity */}
          {currentStep === 'energy' && (
            <StepTransition>
              <section>
                <RadioCardGroupInput
                  id="duration-intensity"
                  name="energy"
                  legend="How much time do you have and at what intensity?"
                  legendRef={legendRef}
                  options={DURATION_INTENSITY_OPTIONS.map((opt) => ({
                    id: opt,
                    value: opt,
                    title:
                      opt === 'dur30_low'
                        ? '30 min • Low intensity'
                        : opt === 'dur30_mod'
                          ? '30 min • Moderate intensity'
                          : opt === 'dur30_high'
                            ? '30 min • High intensity'
                            : opt === 'dur45_low'
                              ? '45 min • Low intensity'
                              : opt === 'dur45_mod'
                                ? '45 min • Moderate intensity'
                                : opt === 'dur45_high'
                                  ? '45 min • High intensity'
                                  : '60 min • Low intensity',
                  }))}
                  value={responses.energy}
                  onChange={(value) => {
                    setResponses((r) => ({
                      ...r,
                      energy: value as DurationIntensity,
                    }));
                    setAttemptedNext(false);
                    // Auto-complete and start generation
                    console.log('QuickWorkoutIntake Completed', {
                      ...responses,
                      energy: value,
                    });
                    analytics.track('QuickWorkoutIntake Completed', {
                      ...responses,
                      energy: value,
                      tracked_at: new Date().toISOString(),
                    });
                    setCurrentStepIndex(
                      stepOrder.findIndex((s) => s.key === 'complete')
                    );

                    const params: WorkoutParams = {
                      sex_and_age: mapSexAgeToText(responses.ageRange),
                      goal_and_activity: mapExperienceToText(
                        responses.experience
                      ),
                      duration_and_intensity: mapDurationIntensityToText(
                        value as DurationIntensity
                      ),
                    };
                    const configId = import.meta.env
                      .VITE_QUICK_WORKOUT_CONFIGURATION_ID;

                    createWorkout(configId, params, '')
                      .then((workout) => {
                        // Seed chunk cache immediately to avoid missing early messages
                        queryClient.setQueryData<string[]>(
                          ['generatedWorkoutChunks', workout.id],
                          (prev) => prev ?? []
                        );

                        // Subscribe to real-time chunk updates ASAP (idempotent)
                        ensureWorkoutChunkBinding(
                          pusherService,
                          queryClient,
                          workout.id
                        );

                        analytics.track('Workout Generated from Intake', {
                          workoutId: workout.id,
                          tracked_at: new Date().toISOString(),
                        });
                        navigate(`/dashboard/workouts/${workout.id}`);
                      })
                      .catch((err) => {
                        console.error(
                          'Failed to generate workout from intake:',
                          err
                        );
                      });
                  }}
                  isValid={!attemptedNext || Boolean(responses.energy)}
                  validationMessage="Please select your energy level."
                />
              </section>
            </StepTransition>
          )}

          {/* Complete */}
          {currentStep === 'complete' && (
            <StepTransition>
              <section className="text-center space-y-4">
                <h2 className="text-2xl font-semibold">You’re all set!</h2>
                <p className="text-base-content/70">
                  Thanks! We’re generating your workout now. You’ll be
                  redirected automatically to your workout.
                </p>
                {isGenerating && (
                  <div className="flex items-center justify-center gap-3">
                    <span
                      className="loading loading-spinner"
                      aria-label="Generating"
                    />
                    <span className="text-sm text-base-content/70">
                      Generating your workout…
                    </span>
                  </div>
                )}
                {generationError && (
                  <p className="text-error text-sm" role="alert">
                    {generationError}
                  </p>
                )}
              </section>
            </StepTransition>
          )}
        </>
      )}
    </IntakeFullScreenLayout>
  );
}
