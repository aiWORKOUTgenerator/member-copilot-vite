import { memo } from 'react';
import { DetailedSelector } from '@/ui/shared/molecules';
import { Target } from 'lucide-react';
import { useWorkoutAnalytics } from '../../../hooks/useWorkoutAnalytics';
import { useEnhancedOptions } from '../../utils/optionEnhancers';
import type { CustomizationComponentProps } from '../../types';

/**
 * Enhanced Focus Area Customization Component
 *
 * First enhanced component in the detailed workout setup modularization effort.
 * Replaces the legacy FocusAreaCustomization with a card-based selector that
 * integrates analytics tracking, validation, and enhanced visual presentation.
 *
 * Key Features:
 * - Card-based UI using DetailedSelector molecule
 * - Multi-select functionality with up to 5 area selections
 * - Analytics integration for user behavior tracking
 * - Enhanced options with descriptions for better UX
 * - Maintains exact API compatibility with legacy component
 *
 * @param variant - Controls visual density: 'simple' for compact layout, 'detailed' for full layout
 * @example
 * <EnhancedFocusAreaCustomization
 *   value={selectedAreas}
 *   onChange={handleAreasChange}
 *   disabled={false}
 *   error={validationError}
 *   variant="simple" // Compact layout
 * />
 */
export default memo(function EnhancedFocusAreaCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<string[] | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { focusAreaOptions } = useEnhancedOptions();
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
    // Map component variant to analytics mode ('simple' -> 'quick', 'detailed' -> 'detailed')
    const analyticsMode = variant === 'simple' ? 'quick' : 'detailed';
    trackSelection('customization_areas', finalValue || [], analyticsMode);
  };

  return (
    <DetailedSelector
      icon={Target}
      options={focusAreaOptions}
      selectedValue={value || []}
      multiple={true}
      onChange={handleChange}
      question="Which muscle groups do you want to focus on?"
      description="Select one or more muscle groups to target."
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
