"use client";

import { useAttributesLoaded } from "@/contexts/AttributeContext";
import {
  useAttributeTypesData,
  useAttributeTypesLoaded,
} from "@/contexts/AttributeTypeContext";
import { useContactData } from "@/contexts/ContactContext";
import { usePromptsData, usePromptsLoaded } from "@/contexts/PromptContext";
import { useTitle } from "@/contexts/TitleContext";
import { AttributeCompletion, ContactUtils } from "@/domain";
import { useUserAccess } from "@/hooks";
import { MeteredFeature } from "@/hooks/useUserAccess";
import AccessAwareComponent from "@/ui/shared/molecules/AccessAwareComponent";
import { ActionCard } from "@/ui/shared/molecules/ActionCard";
import {
  PhoneVerificationAlert,
  PhoneVerificationCard,
} from "@/components/PhoneVerificationCard";
import {
  Info,
  AlertTriangle,
  Dumbbell,
  UserCircle,
  Star,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";

export default function DashboardHomePage() {
  const { setTitle } = useTitle();
  const [attributeCompletions, setAttributeCompletions] = useState<
    AttributeCompletion[]
  >([]);
  const navigate = useNavigate();

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
      (license) => license.policy?.stripe_price_id === basicPriceId
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
    setTitle("Dashboard");
  }, [setTitle]);

  // Handle navigation to profile section
  const navigateToProfile = (attributeId: string | number) => {
    navigate(`/dashboard/profile/${attributeId}`);
  };

  // Navigate to workout generation or billing if limit reached
  const navigateToWorkoutGeneration = () => {
    if (isWorkoutGenerationLimitReached) {
      navigate("/dashboard/billing");
    } else {
      navigate("/dashboard/workouts/generate");
    }
  };

  // Navigate to profile overview
  const navigateToProfileOverview = () => {
    navigate("/dashboard/profile");
  };

  // Navigate to billing/upgrade page
  const navigateToUpgrade = () => {
    navigate("/dashboard/billing");
  };

  return (
    <div className="p-4">
      {/* Conversion Banner for Basic Tier Users */}
      {isOnBasicTier && (
        <div className="mb-6">
          <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content">
            <div className="card-body">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-warning" />
                    <h3 className="card-title text-lg">
                      You're on the Free Plan
                    </h3>
                    <div className="badge badge-warning badge-outline whitespace-nowrap">
                      {workoutUsage.used}/{workoutUsage.limit} workouts used
                    </div>
                  </div>
                  <p className="text-primary-content/90 mb-3">
                    Unlock unlimited AI-powered workouts, advanced
                    customization, and priority support with our Premium plan
                    (only $10/month).
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      <span>100 workouts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>Advanced AI generation</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>Priority support</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    className="btn btn-accent btn-xl"
                    onClick={navigateToUpgrade}
                  >
                    <Star className="w-4 h-4" />
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phone Verification Alert */}
      <div className="mb-4">
        <PhoneVerificationAlert />
      </div>

      {/* Incomplete Profile Alerts */}
      {incompleteAttributes.length > 0 && (
        <div className="space-y-4 mb-4">
          {incompleteAttributes.map((attr) => (
            <div
              key={attr.attributeType.id}
              role="alert"
              className="alert alert-info alert-vertical sm:alert-horizontal cursor-pointer hover:bg-info/10 transition-colors"
              onClick={() => navigateToProfile(attr.attributeType.id)}
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
              <button className="btn btn-sm">Complete</button>
            </div>
          ))}
        </div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <AccessAwareComponent showSkeleton={true} skeletonClassName="w-full">
          <ActionCard
            title="Generate New Workout"
            description={
              isWorkoutGenerationLimitReached
                ? "You have reached your workout generation limit. Upgrade your plan to generate more workouts."
                : "Create a personalized workout based on your profile and preferences."
            }
            actionText={
              isWorkoutGenerationLimitReached
                ? "Upgrade Plan"
                : "Generate Workout"
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
              isWorkoutGenerationLimitReached ? "Limit Reached" : undefined
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
              ? incompleteAttributes.length.toString() + " Incomplete"
              : undefined
          }
          badgeColor="badge-accent"
        />
      </div>

      {/* Account Security Section */}
      <div className="mb-8">
        <PhoneVerificationCard />
      </div>
    </div>
  );
}
