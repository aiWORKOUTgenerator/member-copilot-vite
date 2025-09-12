import { useMemo } from 'react';
import { useContactData } from '@/hooks/useContact';
import { useAttributeTypesData } from '@/hooks/useAttributeTypes';
import { usePromptsData } from '@/hooks/usePrompts';
import { ContactUtils, AttributeCompletion } from '@/domain';

/**
 * Hook to calculate profile completeness using existing ContactUtils logic
 * This matches the same logic used in ProfileContainer.tsx
 */
export function useProfileCompleteness() {
  const contact = useContactData();
  const attributeTypes = useAttributeTypesData();
  const prompts = usePromptsData();

  // Calculate attribute completion status using existing logic
  const attributeCompletions = useMemo<AttributeCompletion[]>(() => {
    return ContactUtils.getAttributeCompletionStatus(
      contact,
      attributeTypes,
      prompts
    );
  }, [contact, attributeTypes, prompts]);

  // Calculate overall progress (same logic as ProfileContainer)
  const overallProgress = useMemo(() => {
    if (attributeCompletions.length === 0) return 0;
    const totalCompletion = attributeCompletions.reduce(
      (sum, completion) => sum + completion.percentComplete,
      0
    );
    return Math.round(totalCompletion / attributeCompletions.length);
  }, [attributeCompletions]);

  // Determine if profile is sufficient for trainer generation
  // You can adjust this threshold as needed
  const isSufficientForGeneration = useMemo(() => {
    // Require at least 60% overall completion for trainer generation
    return overallProgress >= 60;
  }, [overallProgress]);

  // Get incomplete attribute types for user guidance
  const incompleteAttributes = useMemo(() => {
    return attributeCompletions.filter(
      (completion) => completion.percentComplete < 100
    );
  }, [attributeCompletions]);

  return {
    attributeCompletions,
    overallProgress,
    isSufficientForGeneration,
    incompleteAttributes,
    isLoading: !contact || attributeTypes.length === 0 || prompts.length === 0,
  };
}

/**
 * Convenience hook to just get the overall progress percentage
 */
export function useOverallProfileProgress(): number {
  const { overallProgress } = useProfileCompleteness();
  return overallProgress;
}

/**
 * Convenience hook to check if profile is sufficient for trainer generation
 */
export function useIsProfileSufficientForGeneration(): boolean {
  const { isSufficientForGeneration } = useProfileCompleteness();
  return isSufficientForGeneration;
}
