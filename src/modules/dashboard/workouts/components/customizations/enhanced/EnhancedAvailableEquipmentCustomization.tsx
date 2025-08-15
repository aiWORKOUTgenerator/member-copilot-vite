import { memo } from 'react';
import { DetailedSelector } from '@/ui/shared/molecules';
import { Dumbbell } from 'lucide-react';
import { useWorkoutAnalytics } from '../../../hooks/useWorkoutAnalytics';
import { useEnhancedOptions } from '../../utils/optionEnhancers';
import type { CustomizationComponentProps } from '../../types';

/**
 * Enhanced Available Equipment Customization Component
 *
 * Replaces the legacy AvailableEquipmentCustomization with a card-based selector that
 * integrates analytics tracking, validation, and enhanced visual presentation.
 * Provides intuitive equipment selection for workout customization.
 *
 * Key Features:
 * - Card-based UI using DetailedSelector molecule
 * - Multi-select functionality for equipment selection
 * - Analytics integration for user behavior tracking
 * - Enhanced options with descriptions for better UX
 * - Maintains exact API compatibility with legacy component
 *
 * @example
 * <EnhancedAvailableEquipmentCustomization
 *   value={selectedEquipment}
 *   onChange={handleEquipmentChange}
 *   disabled={false}
 *   error={validationError}
 * />
 */
export default memo(function EnhancedAvailableEquipmentCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<string[] | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { equipmentOptions } = useEnhancedOptions();
  const { trackSelection } = useWorkoutAnalytics();

  /**
   * Handle selection changes with analytics tracking
   *
   * @param newValue - The new selection value (single string or array of strings)
   */
  const handleChange = (newValue: string | string[]) => {
    // Ensure we always pass the correct type to onChange
    const equipmentArray = Array.isArray(newValue) ? newValue : [newValue];

    // Pass undefined if empty array to maintain API compatibility
    const finalValue = equipmentArray.length > 0 ? equipmentArray : undefined;

    onChange(finalValue);

    // Track user selection for analytics and AI learning
    // Map 'simple' variant to 'quick' for analytics compatibility
    const analyticsMode = variant === 'simple' ? 'quick' : 'detailed';
    trackSelection(
      'customization_equipment',
      finalValue === undefined ? null : finalValue,
      analyticsMode
    );
  };

  return (
    <DetailedSelector
      icon={Dumbbell}
      options={equipmentOptions}
      selectedValue={value || []}
      multiple={true}
      onChange={handleChange}
      question="What equipment do you have available?"
      description="Select all the equipment you have available for your workout"
      disabled={disabled}
      error={error}
      gridCols={3}
      colorScheme="primary"
      required={false}
      variant={variant}
    />
  );
});
