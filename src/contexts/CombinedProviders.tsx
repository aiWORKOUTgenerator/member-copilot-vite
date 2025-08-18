'use client';

import { ReactNode } from 'react';
import { AutoScrollProvider } from './AutoScrollContext';
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
      <WorkoutFeedbackProvider>
        <SubscriptionProvider>{children}</SubscriptionProvider>
      </WorkoutFeedbackProvider>
    </AutoScrollProvider>
  );
}
