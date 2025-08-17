import { memo } from 'react';
import { DetailedSelector } from '@/ui/shared/molecules';
import { AlertTriangle } from 'lucide-react';
import { useWorkoutAnalytics } from '../../../hooks/useWorkoutAnalytics';
import { useEnhancedOptions } from '../../utils/optionEnhancers';
import type { CustomizationComponentProps } from '../../types';

/**
 * Enhanced Soreness Customization Component
 *
 * Replaces the legacy SorenessCustomization with a card-based selector that
 * integrates analytics tracking, validation, and enhanced visual presentation.
 * Provides intuitive body area selection for soreness tracking to help
 * customize workouts and avoid aggravating sore areas.
 *
 * Key Features:
 * - Card-based UI using DetailedSelector molecule
 * - Multi-select functionality with up to 12 area selections
 * - Analytics integration for user behavior tracking
 * - Enhanced options with descriptions for better UX
 * - Warning color scheme to indicate soreness areas
 * - Maintains exact API compatibility with legacy component
 *
 * @example
 * <EnhancedSorenessCustomization
 *   value={selectedSorenessAreas}
 *   onChange={handleSorenessChange}
 *   disabled={false}
 *   error={validationError}
 * />
 */
export default memo(function EnhancedSorenessCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<string[] | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { sorenessAreaOptions } = useEnhancedOptions();
  const { trackSelection } = useWorkoutAnalytics();

  /**
   * Handle selection changes with analytics tracking
   *
   * @param newValue - The new selection value (single string or array of strings)
   */
  const handleChange = (newValue: string | string[]) => {
    // Ensure we always pass the correct type to onChange
    const areasArray = Array.isArray(newValue) ? newValue : [newValue];

    // Pass undefined if empty array to maintain API compatibility
    const finalValue = areasArray.length > 0 ? areasArray : undefined;

    onChange(finalValue);

    // Track user selection for analytics and AI learning
    trackSelection('customization_soreness', finalValue || [], 'detailed');
  };

  return (
    <DetailedSelector
      icon={AlertTriangle}
      options={sorenessAreaOptions}
      selectedValue={value || []}
      multiple={true}
      onChange={handleChange}
      question="Are you experiencing any soreness?"
      description="We'll modify exercises to avoid aggravating sore areas"
      disabled={disabled}
      error={error}
      gridCols={3}
      colorScheme="warning"
      required={false}
      variant={variant}
    />
  );
});
