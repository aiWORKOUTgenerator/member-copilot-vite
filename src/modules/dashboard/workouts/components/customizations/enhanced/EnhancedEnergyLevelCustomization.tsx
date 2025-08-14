import { memo } from 'react';
import { DetailedSelector } from '@/ui/shared/molecules';
import { Battery } from 'lucide-react';
import { useWorkoutAnalytics } from '../../../hooks/useWorkoutAnalytics';
import { useEnhancedOptions } from '../../utils/optionEnhancers';
import type { CustomizationComponentProps } from '../../types';

/**
 * Enhanced Energy Level Customization Component
 *
 * Replaces the legacy EnergyLevelCustomization with a card-based selector that
 * integrates analytics tracking, validation, and enhanced visual presentation.
 * Provides intuitive energy level selection with LevelDots visual indicators.
 *
 * Key Features:
 * - Card-based UI using DetailedSelector molecule
 * - Energy options with LevelDots as tertiary content
 * - Analytics integration for user behavior tracking
 * - Enhanced options with descriptions for better UX
 * - Maintains exact API compatibility with legacy component
 *
 * @example
 * <EnhancedEnergyLevelCustomization
 *   value={selectedEnergyLevel}
 *   onChange={handleEnergyChange}
 *   disabled={false}
 *   error={validationError}
 * />
 */
export default memo(function EnhancedEnergyLevelCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<number | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { energyOptions } = useEnhancedOptions();
  const { trackSelection } = useWorkoutAnalytics();

  /**
   * Handle selection changes with analytics tracking
   *
   * @param newValue - The new selection value (string ID or array of strings)
   */
  const handleChange = (newValue: string | string[]) => {
    // For single-select, we expect a string
    const valueStr = Array.isArray(newValue) ? newValue[0] : newValue;
    const energyValue = parseInt(valueStr, 10);

    // Validate the energy value (1-6 scale based on existing implementation)
    if (energyValue >= 1 && energyValue <= 6) {
      onChange(energyValue);

      // Track user selection for analytics and AI learning
      const analyticsMode = variant === 'simple' ? 'quick' : 'detailed';
      trackSelection('customization_energy', energyValue, analyticsMode);
    } else {
      console.warn('Invalid energy value:', newValue);
    }
  };

  return (
    <DetailedSelector
      icon={Battery}
      options={energyOptions}
      selectedValue={value?.toString() || undefined}
      onChange={handleChange}
      question="How energetic are you feeling today?"
      description="This helps us tailor the workout intensity to your current energy level"
      disabled={disabled}
      error={error}
      gridCols={6}
      colorScheme="primary"
      required={false}
      variant={variant}
    />
  );
});
