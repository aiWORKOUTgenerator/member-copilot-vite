import { memo } from 'react';
import { DetailedSelector } from '@/ui/shared/molecules';
import { Moon } from 'lucide-react';
import { useEnhancedOptions } from '../../utils/optionEnhancers';
import { useWorkoutAnalytics } from '../../../hooks/useWorkoutAnalytics';
import type { CustomizationComponentProps } from '../../types';

export default memo(function EnhancedSleepQualityCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<number | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { sleepQualityOptions } = useEnhancedOptions();
  const { trackSelection } = useWorkoutAnalytics();

  /**
   * Handle selection changes with analytics tracking
   *
   * @param newValue - The new selection value (string from DetailedSelector)
   */
  const handleChange = (newValue: string | string[]) => {
    // Convert string to number for sleep quality
    const sleepValue = parseInt(newValue as string, 10);

    // Validate the value is within range (1-6)
    if (sleepValue >= 1 && sleepValue <= 6) {
      onChange(sleepValue);

      // Track user selection for analytics and AI learning
      trackSelection('customization_sleep', sleepValue, 'detailed');
    }
  };

  return (
    <DetailedSelector
      icon={Moon}
      options={sleepQualityOptions}
      selectedValue={value?.toString() || undefined}
      onChange={handleChange}
      question="How well did you sleep last night?"
      description="Your sleep quality affects workout intensity recommendations"
      disabled={disabled}
      error={error}
      gridCols={6}
      colorScheme="primary"
      required={false}
      variant={variant}
      showDescription={variant === 'detailed'}
      showTertiary={variant === 'detailed'}
    />
  );
});
