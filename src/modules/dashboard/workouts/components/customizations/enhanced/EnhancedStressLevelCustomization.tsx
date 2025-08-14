import { memo } from 'react';
import { DetailedSelector } from '@/ui/shared/molecules';
import { Brain } from 'lucide-react';
import { useEnhancedOptions } from '../../utils/optionEnhancers';
import { useWorkoutAnalytics } from '../../../hooks/useWorkoutAnalytics';
import type { CustomizationComponentProps } from '../../types';

export default memo(function EnhancedStressLevelCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<number | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { stressLevelOptions } = useEnhancedOptions();
  const { trackSelection } = useWorkoutAnalytics();

  /**
   * Handle selection changes with analytics tracking
   *
   * @param newValue - The new selection value (string from DetailedSelector)
   */
  const handleChange = (newValue: string | string[]) => {
    // Handle both string and array inputs safely
    const valueStr = Array.isArray(newValue) ? newValue[0] : newValue;
    // Convert string to number for stress level
    const stressValue = parseInt(valueStr, 10);

    // Validate the value is within range (1-6)
    if (stressValue >= 1 && stressValue <= 6) {
      onChange(stressValue);

      // Track user selection for analytics and AI learning
      // Map component variant to analytics mode ('simple' -> 'quick', 'detailed' -> 'detailed')
      const analyticsMode = variant === 'simple' ? 'quick' : 'detailed';
      trackSelection('customization_stress', stressValue, analyticsMode);
    }
  };

  return (
    <DetailedSelector
      icon={Brain}
      options={stressLevelOptions}
      selectedValue={value?.toString() || undefined}
      onChange={handleChange}
      question="What's your current stress level?"
      description="We'll adjust the workout to help manage your stress"
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
