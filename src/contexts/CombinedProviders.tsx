"use client";

import { ReactNode } from "react";
import { AttributeProvider } from "./AttributeContext";
import { AttributeTypeProvider } from "./AttributeTypeContext";
import { PromptProvider } from "./PromptContext";
import { GeneratedWorkoutProvider } from "./GeneratedWorkoutContext";
import { SubscriptionProvider } from "./SubscriptionContext";

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
          <SubscriptionProvider>
            <AttributeProvider>{children}</AttributeProvider>
          </SubscriptionProvider>
        </GeneratedWorkoutProvider>
      </PromptProvider>
    </AttributeTypeProvider>
  );
}
