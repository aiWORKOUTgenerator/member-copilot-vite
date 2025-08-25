import { memo } from 'react';
import { DetailedSelector } from '@/ui/shared/molecules';
import { Dumbbell, MapPin } from 'lucide-react';
import { useLocationBasedEquipmentOptions } from '../utils/locationBasedWorkoutUtils';
import { useWorkoutAnalytics } from '../../hooks/useWorkoutAnalytics';
import type { CustomizationComponentProps } from '../types';

/**
 * Location-Aware Equipment Customization Component
 *
 * Enhanced equipment selector that uses location data to show only equipment
 * available at the user's gym location. Falls back to generic options if
 * no location data is available.
 */
export default memo(function LocationAwareEquipmentCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<string[] | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { equipmentOptions, hasLocationData, defaultLocation } =
    useLocationBasedEquipmentOptions();
  const { trackSelection } = useWorkoutAnalytics();

  const handleChange = (newValue: string | string[]) => {
    const equipmentArray = Array.isArray(newValue) ? newValue : [newValue];
    const finalValue = equipmentArray.length > 0 ? equipmentArray : undefined;

    onChange(finalValue);

    // Track selection with location context
    const analyticsMode = variant === 'simple' ? 'quick' : 'detailed';
    trackSelection(
      'customization_equipment',
      finalValue === undefined ? null : finalValue,
      analyticsMode
    );
  };

  // Enhanced description based on location data
  const getDescription = () => {
    if (hasLocationData && defaultLocation) {
      return `Equipment available at ${defaultLocation.name}. Select what you'd like to use.`;
    }
    return 'Select all the equipment you have available for your workout';
  };

  return (
    <div className="space-y-4">
      {/* Location indicator */}
      {hasLocationData && defaultLocation && (
        <div className="flex items-center gap-2 text-sm text-base-content/70">
          <MapPin className="h-4 w-4" />
          <span>Equipment from: {defaultLocation.name}</span>
        </div>
      )}

      <DetailedSelector
        icon={Dumbbell}
        options={equipmentOptions}
        selectedValue={value || []}
        multiple={true}
        onChange={handleChange}
        question="What equipment do you have available?"
        description={getDescription()}
        disabled={disabled}
        error={error}
        gridCols={3}
        colorScheme="primary"
        required={false}
        variant={variant}
      />
    </div>
  );
});
