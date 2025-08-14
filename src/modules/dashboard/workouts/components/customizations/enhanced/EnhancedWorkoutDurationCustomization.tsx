import { memo } from 'react';
import { DetailedSelector } from '@/ui/shared/molecules';
import { Clock } from 'lucide-react';
import { useWorkoutAnalytics } from '../../../hooks/useWorkoutAnalytics';
import { useEnhancedOptions } from '../../utils/optionEnhancers';
import type { CustomizationComponentProps } from '../../types';

/**
 * Enhanced Workout Duration Customization Component
 *
 * Enhanced version of the workout duration component that uses the DetailedSelector
 * molecule for consistent card-based UI and integrates analytics tracking.
 *
 * Key Features:
 * - Card-based UI using DetailedSelector molecule
 * - Duration options with subtitle as tertiary content
 * - Analytics integration for user behavior tracking
 * - Enhanced options with descriptions for better UX
 * - Maintains exact API compatibility with legacy component
 *
 * @example
 * <EnhancedWorkoutDurationCustomization
 *   value={selectedDuration}
 *   onChange={handleDurationChange}
 *   disabled={false}
 *   error={validationError}
 * />
 */
export default memo(function EnhancedWorkoutDurationCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<number | undefined>) {
  const { durationOptions } = useEnhancedOptions();
  const { trackSelection } = useWorkoutAnalytics();

  /**
   * Handle selection changes with analytics tracking
   *
   * @param newValue - The new selection value (string ID)
   */
  const handleChange = (newValue: string | string[]) => {
    // Convert string ID to number for duration
    const durationValue = parseInt(newValue as string, 10);

    // Validate the duration value
    if (isNaN(durationValue) || durationValue <= 0) {
      console.warn('Invalid duration value:', newValue);
      return;
    }

    onChange(durationValue);

    // Track user selection for analytics and AI learning
    trackSelection('customization_duration', durationValue, 'detailed');
  };

  return (
    <DetailedSelector
      icon={Clock}
      options={durationOptions}
      selectedValue={value?.toString() || undefined}
      onChange={handleChange}
      question="How long do you want your workout to be?"
      description="Choose a duration that fits your schedule and energy level"
      disabled={disabled}
      error={error}
      gridCols={3}
      colorScheme="primary"
      required={false}
      variant="detailed"
    />
  );
});
