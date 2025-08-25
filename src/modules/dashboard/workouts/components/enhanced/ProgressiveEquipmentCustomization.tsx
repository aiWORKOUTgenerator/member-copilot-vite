import { memo, useMemo, useState, useEffect } from 'react';
import { ProgressiveEquipmentSelector } from '@/ui/shared/molecules/ProgressiveEquipmentSelector';
import { transformLocationToEquipmentZones } from '../utils/locationDataTransformer';
import { useLocation } from '@/hooks/useLocation';
import { useWorkoutAnalytics } from '../../hooks/useWorkoutAnalytics';
import type { CustomizationComponentProps } from '../types';

// Define the complex equipment selection type
interface EquipmentSelection {
  zoneId: string;
  equipment: Array<{
    id: string;
    name: string;
    weightType: 'individual' | 'range';
    weight?: number | number[];
    weightRange?: { min: number; max: number };
  }>;
}

/**
 * Progressive Equipment Customization Component
 *
 * Enhanced equipment selector that uses progressive disclosure to reduce cognitive overload.
 * Provides a three-level selection process:
 * 1. Zone Selection (single choice)
 * 2. Equipment Selection (multi-choice within zone)
 * 3. Weight Configuration (individual or range)
 */
export default memo(function ProgressiveEquipmentCustomization({
  value,
  onChange,
  disabled = false,
  error,
  variant = 'detailed',
}: CustomizationComponentProps<string[] | undefined> & {
  variant?: 'simple' | 'detailed';
}) {
  const { locations, isLoading } = useLocation();
  const { trackSelection } = useWorkoutAnalytics();

  // Internal state to preserve complex equipment data with weights
  const [internalEquipmentData, setInternalEquipmentData] = useState<
    EquipmentSelection[]
  >([]);

  // Transform location data to equipment zones
  const equipmentZones = transformLocationToEquipmentZones(locations);

  // Convert progressive selection to complex format and preserve weight data
  const handleProgressiveChange = (
    progressiveSelection: EquipmentSelection[]
  ) => {
    // Store the complex selection data internally
    setInternalEquipmentData(progressiveSelection);

    // Also provide legacy format for backward compatibility
    const legacyFormat = progressiveSelection.flatMap((zoneSelection) =>
      zoneSelection.equipment.map((equipment) => equipment.id)
    );

    onChange(legacyFormat.length > 0 ? legacyFormat : undefined);

    // Track selection with analytics
    const analyticsMode = variant === 'simple' ? 'quick' : 'detailed';
    trackSelection(
      'customization_equipment',
      legacyFormat.length > 0 ? legacyFormat : null,
      analyticsMode
    );
  };

  // Convert legacy format to progressive format for display
  // This now uses the internal state to preserve weight data
  const progressiveValue = useMemo(() => {
    if (!value || value.length === 0) {
      return [];
    }

    // If we have internal data, use it to preserve weight selections
    if (internalEquipmentData.length > 0) {
      // Filter internal data to only include equipment that's still in the legacy value
      const filteredInternalData = internalEquipmentData
        .map((zone) => ({
          ...zone,
          equipment: zone.equipment.filter((eq) => value.includes(eq.id)),
        }))
        .filter((zone) => zone.equipment.length > 0);

      return filteredInternalData;
    }

    // Fallback: create progressive format from legacy data (no weight data)
    return equipmentZones
      .map((zone) => ({
        zoneId: zone.id,
        equipment: zone.equipment
          .filter((equipment) => value.includes(equipment.id))
          .map((equipment) => ({
            id: equipment.id,
            name: equipment.name,
            weightType: 'individual' as const,
            weight: [], // Start with no weights selected for multi-select
          })),
      }))
      .filter((zoneSelection) => zoneSelection.equipment.length > 0);
  }, [value, equipmentZones, internalEquipmentData]);

  // Sync internal data when value changes externally
  useEffect(() => {
    if (!value || value.length === 0) {
      setInternalEquipmentData([]);
    }
  }, [value]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="loading loading-spinner loading-lg"></div>
        <span className="ml-2">Loading equipment data...</span>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="bg-base-200 rounded-lg p-6 text-center">
        <h3 className="font-semibold mb-2">No Equipment Data Available</h3>
        <p className="text-base-content/70">
          Equipment data from your location is not available. Please contact
          your gym administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Location indicator */}
      <div className="bg-base-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span className="text-sm font-medium">
            Using equipment data from {locations[0]?.name}
          </span>
        </div>
      </div>

      {/* Progressive Equipment Selector */}
      <ProgressiveEquipmentSelector
        zones={equipmentZones}
        value={progressiveValue}
        onChange={handleProgressiveChange}
        disabled={disabled}
      />

      {/* Error display */}
      {error && <div className="text-error text-sm mt-2">{error}</div>}

      {/* Selection summary */}
      {value && value.length > 0 && (
        <div className="bg-base-100 border border-base-300 rounded-lg p-4">
          <h4 className="font-medium mb-2">Selected Equipment:</h4>
          <div className="flex flex-wrap gap-2">
            {value.map((equipmentId) => {
              const equipment = equipmentZones
                .flatMap((zone) => zone.equipment)
                .find((eq) => eq.id === equipmentId);
              return (
                <span
                  key={equipmentId}
                  className="badge badge-primary badge-sm"
                >
                  {equipment?.name || equipmentId}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});
