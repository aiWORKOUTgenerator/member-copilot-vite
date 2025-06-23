"use client";

import { ReactNode } from "react";
import { AttributeProvider } from "./AttributeContext";
import { AttributeTypeProvider } from "./AttributeTypeContext";
import { GeneratedWorkoutProvider } from "./GeneratedWorkoutContext";
import { PromptProvider } from "./PromptContext";
import { SubscriptionProvider } from "./SubscriptionContext";
import { WorkoutFeedbackProvider } from "./WorkoutFeedbackContext";

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
    <AttributeTypeProvider>
      <PromptProvider>
        <GeneratedWorkoutProvider>
          <WorkoutFeedbackProvider>
            <SubscriptionProvider>
              <AttributeProvider>{children}</AttributeProvider>
            </SubscriptionProvider>
          </WorkoutFeedbackProvider>
        </GeneratedWorkoutProvider>
      </PromptProvider>
    </AttributeTypeProvider>
  );
}
