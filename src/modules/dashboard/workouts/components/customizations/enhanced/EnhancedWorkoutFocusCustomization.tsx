import { memo } from 'react';
import { DetailedSelector } from '@/ui/shared/molecules';
import { Heart } from 'lucide-react';
import { useWorkoutAnalytics } from '../../../hooks/useWorkoutAnalytics';
import { useEnhancedOptions } from '../../utils/optionEnhancers';
import type { CustomizationComponentProps } from '../../types';

/**
 * Enhanced Workout Focus Customization Component
 *
 * Enhanced version of the workout focus component that uses the DetailedSelector
 * molecule for consistent card-based UI and integrates analytics tracking.
 *
 * Key Features:
 * - Card-based UI using DetailedSelector molecule
 * - Focus options with intensity LevelDots as tertiary content
 * - Analytics integration for user behavior tracking
 * - Enhanced options with descriptions for better UX
 * - Maintains exact API compatibility with legacy component
 *
 * @example
 * <EnhancedWorkoutFocusCustomization
 *   value={selectedFocus}
 *   onChange={handleFocusChange}
 *   disabled={false}
 *   error={validationError}
 * />
 */
export default memo(function EnhancedWorkoutFocusCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<string | undefined>) {
  const { focusOptions } = useEnhancedOptions();
  const { trackSelection } = useWorkoutAnalytics();

  /**
   * Handle selection changes with analytics tracking
   *
   * @param newValue - The new selection value (string ID)
   */
  const handleChange = (newValue: string | string[]) => {
    // For single-select, we expect a string
    const focusValue = newValue as string;

    // Validate the focus value
    if (!focusValue || typeof focusValue !== 'string') {
      console.warn('Invalid focus value:', newValue);
      return;
    }

    onChange(focusValue);

    // Track user selection for analytics and AI learning
    trackSelection('customization_focus', focusValue, 'detailed');
  };

  return (
    <DetailedSelector
      icon={Heart}
      options={focusOptions}
      selectedValue={value || undefined}
      onChange={handleChange}
      question="What's your main goal for this workout?"
      description="Choose the primary focus that aligns with your fitness objectives"
      disabled={disabled}
      error={error}
      gridCols={3}
      colorScheme="primary"
      required={false}
      variant="detailed"
    />
  );
});
