import { memo } from 'react';
import { DetailedSelector } from '@/ui/shared/molecules';
import { Heart } from 'lucide-react';
import { useWorkoutAnalytics } from '../../../hooks/useWorkoutAnalytics';
import { useEnhancedOptions } from '../../utils/optionEnhancers';
import type { CustomizationComponentProps } from '../../types';

/**
 * Enhanced Workout Focus Customization Component
 *
 * Session intent-based workout focus selector for detailed workout setup.
 * Provides 6 training methodology options that avoid overlap with Focus Areas
 * and Equipment fields.
 *
 * Key Differentiators from Quick Workout:
 * - Session intent focus (training philosophy vs. specific modalities)
 * - No overlap with other customization fields
 * - Broader scope suitable for detailed setup workflows
 * - Enhanced analytics tracking for detailed mode
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
  const { detailedWorkoutFocusOptions } = useEnhancedOptions();
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
      options={detailedWorkoutFocusOptions}
      selectedValue={value || undefined}
      onChange={handleChange}
      question="What's your main focus for this workout session?"
      description="Choose the training intention that best matches your goals for today"
      disabled={disabled}
      error={error}
      gridCols={2}
      colorScheme="primary"
      required={false}
      variant="detailed"
    />
  );
});
