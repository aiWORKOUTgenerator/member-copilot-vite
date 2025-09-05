'use client';

import { useAttributesLoaded } from '@/hooks/useAttributes';
import {
  useAttributeTypesData,
  useAttributeTypesLoaded,
} from '@/hooks/useAttributeTypes';
import { useContactData } from '@/hooks/useContact';
import { usePromptsData, usePromptsLoaded } from '@/hooks/usePrompts';
import { useTitle } from '@/hooks/useTitle';
import { AttributeCompletion, ContactUtils, License } from '@/domain';
import { useUserAccess } from '@/hooks';
import { useAnalytics } from '@/hooks/useAnalytics';
import AccessAwareComponent from '@/ui/shared/molecules/AccessAwareComponent';
import { ActionCard } from '@/ui/shared/molecules/ActionCard';
import { PhoneVerificationCard } from '@/components/PhoneVerificationCard';
import { AITrainerActionCard } from '@/components/AITrainerActionCard';
import { AnnouncementsSection } from '@/components/announcements/AnnouncementsSection';
import { Info, AlertTriangle, Dumbbell, UserCircle, Zap } from 'lucide-react';
import { FreePlanBanner } from '@/modules/dashboard/components/FreePlanBanner';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { MeteredFeature } from '@/domain/entities/meteredFeatures';
import { FloatingClipboardFab } from '@/ui/shared/molecules';

export default function DashboardHomePage() {
  const { setTitle } = useTitle();
  const [attributeCompletions, setAttributeCompletions] = useState<
    AttributeCompletion[]
  >([]);
  const navigate = useNavigate();
  const analytics = useAnalytics();

  // Get necessary data
  const contact = useContactData();
  const attributeTypes = useAttributeTypesData();
  const attributeTypesLoaded = useAttributeTypesLoaded();
  const prompts = usePromptsData();
  const promptsLoaded = usePromptsLoaded();
  const attributesLoaded = useAttributesLoaded();
  const {
    isMeterLimitReached,
    activeLicenses,
    getTotalAggregatedValueForMeter,
    getHighestLimitForMeter,
  } = useUserAccess();

  const isWorkoutGenerationLimitReached = isMeterLimitReached(
    MeteredFeature.WORKOUTS_GENERATED
  );

  // Check if user is on basic/free tier
  const isOnBasicTier = useMemo(() => {
    const basicPriceId = import.meta.env.VITE_STRIPE_PRICE_BASIC;
    if (!basicPriceId || activeLicenses.length === 0) return false;

    return activeLicenses.some(
      (license: License) => license.policy?.stripe_price_id === basicPriceId
    );
  }, [activeLicenses]);

  // Get workout usage stats for the banner
  const workoutUsage = useMemo(() => {
    const used = getTotalAggregatedValueForMeter(
      MeteredFeature.WORKOUTS_GENERATED
    );
    const limit = getHighestLimitForMeter(MeteredFeature.WORKOUTS_GENERATED);
    return { used, limit };
  }, [getTotalAggregatedValueForMeter, getHighestLimitForMeter]);

  // Calculate attribute completion status
  useEffect(() => {
    if (!attributesLoaded || !attributeTypesLoaded || !promptsLoaded) return;
    setAttributeCompletions(
      ContactUtils.getAttributeCompletionStatus(
        contact,
        attributeTypes,
        prompts
      )
    );
  }, [
    contact,
    attributeTypes,
    prompts,
    promptsLoaded,
    attributeTypesLoaded,
    attributesLoaded,
  ]);

  // Filter for incomplete attributes (less than 100% complete)
  const incompleteAttributes = useMemo(() => {
    return attributeCompletions.filter(
      (completion) => completion.percentComplete < 100
    );
  }, [attributeCompletions]);

  useEffect(() => {
    setTitle('Dashboard');
  }, [setTitle]);

  // Track dashboard page views and user state
  useEffect(() => {
    analytics.track('Dashboard Home Viewed', {
      tracked_at: new Date().toISOString(),
    });
  }, [analytics]);

  // Handle navigation to profile section
  const navigateToProfile = (attributeId: string | number) => {
    analytics.track('Profile Completion Alert Clicked', {
      attributeId: attributeId.toString(),
      location: 'dashboard_home',
    });
    navigate(`/dashboard/profile/${attributeId}`);
  };

  // Navigate to workout generation or billing if limit reached
  const navigateToWorkoutGeneration = () => {
    if (isWorkoutGenerationLimitReached) {
      analytics.track('Generate Workout Blocked', {
        reason: 'limit_reached',
        redirectTo: 'billing',
        workoutUsage: workoutUsage.used,
        workoutLimit: workoutUsage.limit,
      });
      navigate('/dashboard/billing');
    } else {
      analytics.track('Generate Workout CTA Clicked', {
        location: 'dashboard_home',
        workoutUsage: workoutUsage.used,
        workoutLimit: workoutUsage.limit,
      });
      navigate('/dashboard/workouts/generate');
    }
  };

  // Navigate to profile overview
  const navigateToProfileOverview = () => {
    analytics.track('Update Profile CTA Clicked', {
      location: 'dashboard_home',
      incompleteAttributeCount: incompleteAttributes.length,
    });
    navigate('/dashboard/profile');
  };

  // Navigate to billing/upgrade page
  const navigateToUpgrade = () => {
    analytics.track('Upgrade CTA Clicked', {
      location: 'dashboard_home',
      currentTier: 'basic',
      workoutUsage: workoutUsage.used,
      workoutLimit: workoutUsage.limit,
    });
    navigate('/dashboard/billing');
  };

  // Track upgrade banner views
  useEffect(() => {
    if (isOnBasicTier) {
      analytics.track('Upgrade Banner Viewed', {
        location: 'dashboard_home',
        workoutUsage: workoutUsage.used,
        workoutLimit: workoutUsage.limit,
      });
    }
  }, [isOnBasicTier, workoutUsage, analytics]);

  // Track FAB interactions
  const handleFabClick = () => {
    analytics.track('Floating Clipboard FAB Clicked', {
      location: 'dashboard_home',
      tracked_at: new Date().toISOString(),
    });
  };

  return (
    <div className="p-4">
      {/* Conversion Banner for Basic Tier Users */}
      {isOnBasicTier && (
        <FreePlanBanner
          usedWorkouts={workoutUsage.used}
          workoutLimit={workoutUsage.limit}
          onUpgradeClick={navigateToUpgrade}
        />
      )}

      {/* Incomplete Profile Alerts */}
      {incompleteAttributes.length > 0 && (
        <div className="space-y-4 mb-4">
          {incompleteAttributes.map((attr) => (
            <div
              key={attr.attributeType.id}
              role="button"
              tabIndex={0}
              aria-label={`Complete ${attr.attributeType.name}`}
              className="alert alert-info alert-vertical sm:alert-horizontal cursor-pointer hover:bg-info/10 transition-colors"
              onClick={() => navigateToProfile(attr.attributeType.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigateToProfile(attr.attributeType.id);
                }
              }}
            >
              <Info className="stroke-info h-6 w-6 shrink-0" />
              <div>
                <h3 className="font-bold">
                  {attr.attributeType.name} Incomplete
                </h3>
                <div className="text-xs">
                  {attr.completedPrompts} of {attr.totalPrompts} questions
                  answered ({attr.percentComplete}% complete)
                </div>
              </div>
              <span className="btn btn-sm" aria-hidden="true">
                Complete
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Latest Announcements */}
      <div className="mb-16">
        <AnnouncementsSection />
      </div>

      {/* Action Cards */}
      <div className="relative">
        {/* Action Cards Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform duration-200">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-accent to-accent/80 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-base-content to-base-content/80 bg-clip-text text-transparent">
              Quick Actions
            </h2>
            <p className="text-sm text-base-content/70 mt-1">
              Access your most important features and complete your setup
            </p>
          </div>
        </div>

        {/* Subtle background container for visual distinction */}
        <div className="absolute inset-0 bg-gradient-to-br from-base-200/5 via-transparent to-base-200/5 rounded-3xl -m-4 p-4"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-6">
          <AccessAwareComponent showSkeleton={true} skeletonClassName="w-full">
            <ActionCard
              title="Generate New Workout"
              description={
                isWorkoutGenerationLimitReached
                  ? 'You have reached your workout generation limit. Upgrade your plan to generate more workouts.'
                  : 'Create a personalized workout based on your profile and preferences.'
              }
              actionText={
                isWorkoutGenerationLimitReached
                  ? 'Upgrade Plan'
                  : 'Generate Workout'
              }
              onClick={navigateToWorkoutGeneration}
              icon={
                isWorkoutGenerationLimitReached ? (
                  <AlertTriangle className="w-5 h-5 text-warning" />
                ) : (
                  <Dumbbell className="w-5 h-5" />
                )
              }
              badgeText={
                isWorkoutGenerationLimitReached ? 'Limit Reached' : undefined
              }
              badgeColor="badge-warning"
            />
          </AccessAwareComponent>

          <ActionCard
            title="Update Profile"
            description="Complete your training profile to get more personalized workouts."
            actionText="Update Profile"
            onClick={navigateToProfileOverview}
            icon={<UserCircle className="w-5 h-5" />}
            badgeText={
              incompleteAttributes.length > 0
                ? incompleteAttributes.length.toString() + ' Incomplete'
                : undefined
            }
            badgeColor="badge-accent"
          />

          <PhoneVerificationCard />

          <AITrainerActionCard />
        </div>
      </div>

      {/* Floating Action Button for quick workout generation */}
      <FloatingClipboardFab
        href="/dashboard/workouts/generate"
        onClick={handleFabClick}
        ariaLabel="Generate new workout"
        title="Generate new workout"
      />
    </div>
  );
}
