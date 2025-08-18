'use client';

import { ReactNode } from 'react';
import { AnnouncementProvider } from './AnnouncementContext';
import { AutoScrollProvider } from './AutoScrollContext';
import { GeneratedWorkoutProvider } from './GeneratedWorkoutContext';
import { SubscriptionProvider } from './SubscriptionContext';
import { WorkoutFeedbackProvider } from './WorkoutFeedbackContext';

interface CombinedProvidersProps {
  children: ReactNode;
}

/**
 * CombinedProviders wraps all context providers in the correct order to ensure
 * proper dependency resolution. AttributeTypeProvider must come before AttributeProvider
 * since AttributeProvider depends on the context from AttributeTypeProvider.
 */
export function CombinedProviders({ children }: CombinedProvidersProps) {
  return (
    <AutoScrollProvider>
      <GeneratedWorkoutProvider>
        <WorkoutFeedbackProvider>
          <SubscriptionProvider>
            <AnnouncementProvider>{children}</AnnouncementProvider>
          </SubscriptionProvider>
        </WorkoutFeedbackProvider>
      </GeneratedWorkoutProvider>
    </AutoScrollProvider>
  );
}
