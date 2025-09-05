import {
  useAttributeTypesData,
  useAttributeTypesLoading,
} from '@/hooks/useAttributeTypes';
import { useContactData } from '@/hooks/useContact';
import { useTitle } from '@/hooks/useTitle';
import { AttributeCompletion, ContactUtils } from '@/domain';

import {
  StepIndicator,
  ProgressBar,
  FloatingClipboardFab,
} from '@/ui/shared/molecules';
import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useAnalytics } from '@/hooks/useAnalytics';
import { usePromptsData } from '@/hooks/usePrompts';
import { useAutoScrollPreferences } from '@/hooks/useAutoScrollPreferences';
import { AUTO_SCROLL_CONFIG } from '@/config/autoScroll';
import { User } from 'lucide-react';

export default function TrainingProfileLayout() {
  const { setTitle } = useTitle();
  const attributeTypes = useAttributeTypesData();
  const isAttributeTypesLoading = useAttributeTypesLoading();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;

  // Current step state for step indicator
  const [currentStep, setCurrentStep] = useState<string>(() => {
    // Set initial step based on URL or first attribute type
    const pathParts = pathname.split('/');
    const attributeTypeId = pathParts[pathParts.length - 1];
    if (
      pathname.startsWith('/dashboard/profile/') &&
      attributeTypeId !== 'profile'
    ) {
      return attributeTypeId;
    }
    return attributeTypes[0]?.id.toString() || '';
  });

  // Get contact and prompts data
  const contact = useContactData();
  const prompts = usePromptsData();

  // Set the page title
  useEffect(() => {
    setTitle('Training Profile');
  }, [setTitle]);

  // Calculate attribute completion status
  const attributeCompletions = useMemo<AttributeCompletion[]>(() => {
    return ContactUtils.getAttributeCompletionStatus(
      contact,
      attributeTypes,
      prompts
    );
  }, [contact, attributeTypes, prompts]);

  // Extract attributeTypeId from the path if we're in a specific attribute type route
  useEffect(() => {
    if (attributeTypes.length > 0 && pathname) {
      const pathParts = pathname.split('/');
      const attributeTypeId = pathParts[pathParts.length - 1];

      // Check if we're in a specific attribute type route
      if (
        pathname.startsWith('/dashboard/profile/') &&
        attributeTypeId !== 'profile'
      ) {
        const selectedAttributeType = attributeTypes.find(
          (type) => type.id.toString() === attributeTypeId
        );

        if (selectedAttributeType) {
          setCurrentStep(attributeTypeId);
        }
      } else if (
        pathname === '/dashboard/profile' &&
        attributeTypes.length > 0
      ) {
        // If we're on the main profile page, set the first attribute as current
        setCurrentStep(attributeTypes[0].id.toString());
      }
    }
  }, [pathname, attributeTypes]);

  const analytics = useAnalytics();
  const { enabled: autoScrollEnabled } = useAutoScrollPreferences();

  // Track profile page views
  useEffect(() => {
    analytics.track('Profile Page Viewed', {
      tracked_at: new Date().toISOString(),
    });
  }, [analytics]);

  // Handle step click navigation
  const handleStepClick = (stepId: string) => {
    // Track attribute selection for analytics (keeping original event name for continuity)
    const attributeType = attributeTypes.find(
      (type) => type.id.toString() === stepId
    );
    analytics.track('Profile Attribute Card Selected', {
      attributeTypeId: stepId,
      attributeTypeName: attributeType?.name,
      autoScrollEnabled,
    });

    // Navigate to the selected attribute
    const targetPath = `/dashboard/profile/${stepId}`;
    navigate(targetPath);

    // Simple auto-scroll after navigation
    if (autoScrollEnabled) {
      setTimeout(() => {
        const firstPrompt = document.querySelector(
          '[data-scroll-target="first-prompt"]'
        );
        if (firstPrompt) {
          firstPrompt.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, AUTO_SCROLL_CONFIG.timing.profileNavigationDelay);
    }
  };

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    if (attributeCompletions.length === 0) return 0;
    const totalCompletion = attributeCompletions.reduce(
      (sum, completion) => sum + completion.percentComplete,
      0
    );
    return Math.round(totalCompletion / attributeCompletions.length);
  }, [attributeCompletions]);

  // User is authenticated, show Training Profile page
  return (
    <div className="p-3 sm:p-4 space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform duration-200">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-accent to-accent/80 rounded-full animate-pulse"></div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-base-content to-base-content/80 bg-clip-text text-transparent">
            Training Profile
          </h2>
          <p className="text-sm text-base-content/70 mt-1">
            Complete your profile to get personalized workout recommendations
          </p>
        </div>
      </div>

      {isAttributeTypesLoading ? (
        <div className="flex justify-center my-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="relative">
          {/* Glass morphism background container */}
          <div className="absolute inset-0 bg-gradient-to-br from-base-200/5 via-transparent to-base-200/5 rounded-3xl -m-4 p-4"></div>
          <div className="relative z-10">
            <div
              className={`transition-all duration-200 ${
                isAttributeTypesLoading ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {/* Overall Progress Bar */}
              <div className="mb-6">
                <ProgressBar
                  progress={overallProgress}
                  label="Overall Profile Completion"
                  showPercentage={true}
                  size="md"
                  variant="primary"
                  animated={true}
                  description={`Complete your training profile to get better workout recommendations`}
                />
              </div>

              {/* Step Indicator */}
              <StepIndicator
                steps={attributeTypes.map((attributeType) => {
                  const completion = attributeCompletions.find(
                    (c) => c.attributeType.id === attributeType.id
                  );
                  return {
                    id: attributeType.id.toString(),
                    label: attributeType.name,
                    description: `${completion?.percentComplete || 0}% complete`,
                    disabled: false,
                    hasErrors: false,
                  };
                })}
                currentStep={currentStep}
                onStepClick={handleStepClick}
                disabled={false}
                showConnectors={true}
                size="md"
                responsive={true}
              />
            </div>
          </div>
        </div>
      )}
      <div>
        <Outlet />
      </div>

      {/* Floating Action Button for quick workout generation from profile */}
      <FloatingClipboardFab
        href="/dashboard/workouts/generate"
        ariaLabel="Generate new workout"
        title="Generate new workout"
      />
    </div>
  );
}
