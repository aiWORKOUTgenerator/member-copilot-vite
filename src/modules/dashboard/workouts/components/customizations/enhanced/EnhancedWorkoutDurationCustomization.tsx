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
 * Provides comprehensive duration options specifically designed for detailed workout setup:
 * - 20 min: HIIT, mobility flows, EMOM/AMRAP circuits, bodyweight conditioning
 * - 30 min: Full-body dumbbell or kettlebell workouts, short cardio/strength combos
 * - 45 min: Balanced strength splits, cardio intervals + accessory work, functional circuits
 * - 60 min: Hypertrophy splits, strength + cardio combos, skill practice + accessories
 * - 75 min: Powerbuilding, Olympic lift work, strength splits with long rest, mobility + core work
 * - 90 min: Full powerlifting splits, CrossFit WOD + skill blocks, athlete-specific periodization
 *
 * Key Features:
 * - Card-based UI using DetailedSelector molecule
 * - Comprehensive duration options with specific workout types
 * - Analytics integration for user behavior tracking
 * - Enhanced options with detailed workout descriptions and use cases
 * - Maintains exact API compatibility with legacy component
 *
 * @param variant - Controls visual density: 'simple' for compact layout, 'detailed' for full layout
 * @example
 * <EnhancedWorkoutDurationCustomization
 *   value={selectedDuration}
 *   onChange={handleDurationChange}
 *   disabled={false}
 *   error={validationError}
 *   variant="simple" // Compact layout
 * />
 */
export default memo(function EnhancedWorkoutDurationCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<number | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { detailedDurationOptions } = useEnhancedOptions();
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
    // Map component variant to analytics mode ('simple' -> 'quick', 'detailed' -> 'detailed')
    const analyticsMode = variant === 'simple' ? 'quick' : 'detailed';
    trackSelection('customization_duration', durationValue, analyticsMode);
  };

  return (
    <DetailedSelector
      icon={Clock}
      options={detailedDurationOptions}
      selectedValue={value?.toString() || undefined}
      onChange={handleChange}
      question="How long do you want your workout to be?"
      description="Choose a duration that fits your schedule, energy level, and fitness goals"
      disabled={disabled}
      error={error}
      gridCols={3}
      colorScheme="primary"
      required={false}
      variant={variant}
      showDescription={variant === 'detailed'}
      showTertiary={variant === 'detailed'}
    />
  );
});
