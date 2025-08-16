import { memo } from 'react';
import { DetailedSelector } from '@/ui/shared/molecules';
import { Heart } from 'lucide-react';
import { useWorkoutAnalytics } from '../../../hooks/useWorkoutAnalytics';
import { useEnhancedOptions } from '../../utils/optionEnhancers';
import type { CustomizationComponentProps } from '../../types';

/**
 * Enhanced Workout Focus Customization Component
 *
 * Enhanced version of the workout focus component specifically designed for detailed
 * workout setup. Uses session intent-based options that reflect training methodology
 * and philosophy rather than specific modalities or outcomes.
 *
 * Features 6 refined focus options:
 * - General Fitness Maintenance: Balanced health and energy support
 * - Strength & Power Development: Maximal force and explosive movement
 * - Muscle Building (Hypertrophy): Targeted muscle development
 * - Endurance & Conditioning: Cardiovascular fitness and stamina
 * - Mobility & Movement Quality: Joint range of motion and control
 * - Recovery & Restoration: Gentle, supportive recovery movement
 *
 * Key Features:
 * - Card-based UI using DetailedSelector molecule
 * - Session intent-based options (no overlap with Focus Areas/Equipment)
 * - Analytics integration for user behavior tracking
 * - Detailed descriptions for better UX
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
