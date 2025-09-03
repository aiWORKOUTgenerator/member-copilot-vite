import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Dumbbell } from 'lucide-react';

interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  hasWeight: boolean;
  defaultWeightRange?: { min: number; max: number };
  weightIncrements?: number[];
  availableWeights?: number[];
}

interface EquipmentZone {
  id: string;
  name: string;
  description: string;
  equipment: EquipmentItem[];
}

interface WeightRange {
  min: number;
  max: number;
}

interface EquipmentSelection {
  zoneId: string;
  equipment: Array<{
    id: string;
    name: string;
    weightType?: 'individual' | 'range';
    weight: number[];
    weightRange?: WeightRange;
  }>;
}

interface ProgressiveEquipmentSelectorProps {
  zones: EquipmentZone[];
  value?: EquipmentSelection[];
  onChange: (selection: EquipmentSelection[]) => void;
  disabled?: boolean;
}

/**
 * NEW Progressive Equipment Selector - Built from scratch with DaisyUI only
 * Simple, reliable, no nested components, no state synchronization hell
 */
export function ProgressiveEquipmentSelector({
  zones,
  value = [],
  onChange,
  disabled = false,
}: ProgressiveEquipmentSelectorProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // Simple state - no complex validation, no transformations
  const currentZoneSelection = useMemo(() => {
    const selection = value.find(
      (selection) => selection.zoneId === selectedZone
    );
    return selection;
  }, [value, selectedZone]);

  const handleZoneSelect = (zoneId: string) => {
    if (selectedZone === zoneId) {
      setSelectedZone(null);
    } else {
      setSelectedZone(zoneId);
    }
  };

  const handleEquipmentToggle = (equipmentId: string) => {
    if (!selectedZone) return;

    const zone = zones.find((z) => z.id === selectedZone);
    const equipment = zone?.equipment.find((e) => e.id === equipmentId);
    if (!equipment) return;

    const currentSelection = currentZoneSelection?.equipment || [];
    const isSelected = currentSelection.some((e) => e.id === equipmentId);

    let newEquipment: EquipmentSelection['equipment'];
    if (isSelected) {
      // Remove equipment
      newEquipment = currentSelection.filter((e) => e.id !== equipmentId);
    } else {
      // Add equipment - only include weight config if equipment has weight options
      const newItem = {
        id: equipmentId,
        name: equipment.name,
        weightType:
          equipment.availableWeights && equipment.availableWeights.length > 0
            ? ('individual' as const)
            : undefined,
        weight:
          equipment.availableWeights && equipment.availableWeights.length > 0
            ? [equipment.availableWeights[0]]
            : [],
        weightRange:
          equipment.availableWeights && equipment.availableWeights.length > 0
            ? { min: 0, max: 0 }
            : undefined,
      };
      newEquipment = [...currentSelection, newItem];
    }

    updateZoneSelection(selectedZone, newEquipment);
  };

  const handleWeightTypeChange = (
    equipmentId: string,
    weightType: 'individual' | 'range'
  ) => {
    if (!selectedZone) return;

    const currentSelection = currentZoneSelection?.equipment || [];
    const equipment = currentSelection.find((e) => e.id === equipmentId);
    if (!equipment) return;

    const zone = zones.find((z) => z.id === selectedZone);
    const zoneEquipment = zone?.equipment.find((e) => e.id === equipmentId);

    // Only allow weight type changes if the equipment actually has weight options
    if (
      !zoneEquipment?.availableWeights ||
      zoneEquipment.availableWeights.length === 0
    ) {
      return;
    }

    const updatedEquipment = currentSelection.map((e) => {
      if (e.id === equipmentId) {
        return {
          ...e,
          weightType,
          weight:
            weightType === 'individual'
              ? e.weight.length > 0
                ? e.weight
                : [zoneEquipment.availableWeights![0]]
              : [],
          weightRange: weightType === 'range' ? { min: 0, max: 0 } : undefined,
        };
      }
      return e;
    });

    updateZoneSelection(selectedZone, updatedEquipment);
  };

  const handleWeightChange = (equipmentId: string, weight: number[]) => {
    if (!selectedZone) return;

    const currentSelection = currentZoneSelection?.equipment || [];
    const updatedEquipment = currentSelection.map((e) => {
      if (e.id === equipmentId) {
        return { ...e, weight };
      }
      return e;
    });

    updateZoneSelection(selectedZone, updatedEquipment);
  };

  const handleWeightRangeChange = (equipmentId: string, range: WeightRange) => {
    if (!selectedZone) return;

    const currentSelection = currentZoneSelection?.equipment || [];
    const updatedEquipment = currentSelection.map((e) => {
      if (e.id === equipmentId) {
        return { ...e, weightRange: range };
      }
      return e;
    });

    updateZoneSelection(selectedZone, updatedEquipment);
  };

  const updateZoneSelection = (
    zoneId: string,
    equipment: EquipmentSelection['equipment']
  ) => {
    const newValue = value.filter((selection) => selection.zoneId !== zoneId);
    if (equipment.length > 0) {
      newValue.push({ zoneId, equipment });
    }
    onChange(newValue);
  };

  return (
    <div className="space-y-6">
      {/* Level 1: Zone Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select Equipment Zone</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map((zone) => {
            const isSelected = selectedZone === zone.id;
            const hasEquipment =
              value.find((s) => s.zoneId === zone.id)?.equipment.length || 0;

            return (
              <div
                key={zone.id}
                className={`card cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-primary text-primary-content'
                    : 'bg-base-100 hover:bg-base-200'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                onClick={() => !disabled && handleZoneSelect(zone.id)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
                    e.preventDefault();
                    handleZoneSelect(zone.id);
                  }
                }}
                tabIndex={disabled ? -1 : 0}
                role="button"
                aria-pressed={isSelected}
                aria-label={`Select ${zone.name} zone`}
              >
                <div className="card-body p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="card-title text-base">{zone.name}</h4>
                    <div className="flex items-center gap-2">
                      {hasEquipment > 0 && (
                        <div className="badge badge-primary badge-sm">
                          {hasEquipment} selected
                        </div>
                      )}
                      {isSelected ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm opacity-70">{zone.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level 2: Equipment Selection */}
      {selectedZone && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            <h3 className="text-lg font-semibold">
              Select Equipment in{' '}
              {zones.find((z) => z.id === selectedZone)?.name}
            </h3>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            data-testid="equipment-selection-grid"
          >
            {zones
              .find((z) => z.id === selectedZone)
              ?.equipment.map((equipment) => {
                const isSelected =
                  currentZoneSelection?.equipment.some(
                    (e) => e.id === equipment.id
                  ) || false;
                const selectedEquipment = currentZoneSelection?.equipment.find(
                  (e) => e.id === equipment.id
                );

                return (
                  <div
                    key={equipment.id}
                    className={`card bg-base-100 border-2 min-h-[200px] transition-all ${
                      isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                    } ${disabled ? 'opacity-50' : ''}`}
                  >
                    <div className="card-body p-4">
                      {/* Equipment Header - Clickable */}
                      <div
                        className={`flex items-center gap-3 mb-4 cursor-pointer ${disabled ? 'cursor-not-allowed' : 'hover:bg-base-200 rounded p-2 -m-2'}`}
                        onClick={() => {
                          if (!disabled) {
                            handleEquipmentToggle(equipment.id);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            (e.key === 'Enter' || e.key === ' ') &&
                            !disabled
                          ) {
                            e.preventDefault();
                            handleEquipmentToggle(equipment.id);
                          }
                        }}
                        tabIndex={disabled ? -1 : 0}
                        role="button"
                        aria-pressed={isSelected}
                        aria-label={`Select ${equipment.name} equipment`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-primary border-primary'
                              : 'border-base-300'
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{equipment.name}</h4>
                          <p className="text-sm text-base-content/70">
                            {equipment.category}
                          </p>
                        </div>
                      </div>

                      {/* Weight Configuration - ONLY SHOW WHEN EQUIPMENT HAS WEIGHT OPTIONS */}
                      {isSelected && (
                        <div className="space-y-4">
                          {selectedEquipment?.weightType ? (
                            <>
                              <h5 className="font-medium text-sm">
                                Weight Configuration
                              </h5>

                              {/* Weight Type Toggle */}
                              <div className="tabs tabs-boxed">
                                <button
                                  className={`tab tab-sm ${selectedEquipment?.weightType === 'individual' ? 'tab-active' : ''}`}
                                  onClick={() =>
                                    handleWeightTypeChange(
                                      equipment.id,
                                      'individual'
                                    )
                                  }
                                  disabled={disabled}
                                >
                                  Individual
                                </button>
                                <button
                                  className={`tab tab-sm ${selectedEquipment?.weightType === 'range' ? 'tab-active' : ''}`}
                                  onClick={() =>
                                    handleWeightTypeChange(
                                      equipment.id,
                                      'range'
                                    )
                                  }
                                  disabled={disabled}
                                >
                                  Range
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="text-sm text-base-content/70 italic">
                              No weight configuration needed for this equipment
                            </div>
                          )}

                          {/* Individual Weight Selection */}
                          {selectedEquipment?.weightType === 'individual' && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">
                                Select weights
                              </div>
                              {equipment.availableWeights ? (
                                <div className="grid grid-cols-4 gap-2">
                                  {equipment.availableWeights.map(
                                    (availableWeight) => {
                                      const isSelected =
                                        selectedEquipment.weight.includes(
                                          availableWeight
                                        );
                                      return (
                                        <button
                                          key={availableWeight}
                                          type="button"
                                          onClick={() => {
                                            const newWeights = isSelected
                                              ? selectedEquipment.weight.filter(
                                                  (w) => w !== availableWeight
                                                )
                                              : [
                                                  ...selectedEquipment.weight,
                                                  availableWeight,
                                                ];
                                            handleWeightChange(
                                              equipment.id,
                                              newWeights
                                            );
                                          }}
                                          disabled={disabled}
                                          className={`btn btn-xs ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                                        >
                                          {availableWeight} lbs
                                        </button>
                                      );
                                    }
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <label
                                    htmlFor={`weight-input-${equipment.id}`}
                                    className="sr-only"
                                  >
                                    Weight in pounds
                                  </label>
                                  <input
                                    id={`weight-input-${equipment.id}`}
                                    type="number"
                                    value={selectedEquipment.weight[0] || 0}
                                    onChange={(e) =>
                                      handleWeightChange(equipment.id, [
                                        parseInt(e.target.value) || 0,
                                      ])
                                    }
                                    disabled={disabled}
                                    className="input input-bordered input-sm w-24"
                                    min={0}
                                    step={equipment.weightIncrements?.[0] || 5}
                                  />
                                  <span className="text-sm text-base-content/70">
                                    lbs
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Weight Range Selection */}
                          {selectedEquipment?.weightType === 'range' && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">
                                Select weight range
                              </div>
                              {equipment.availableWeights ? (
                                <div className="grid grid-cols-4 gap-2">
                                  {equipment.availableWeights.map(
                                    (availableWeight) => {
                                      const isInRange =
                                        availableWeight >=
                                          (selectedEquipment.weightRange?.min ||
                                            0) &&
                                        availableWeight <=
                                          (selectedEquipment.weightRange?.max ||
                                            0);
                                      const isRangeStart =
                                        availableWeight ===
                                        selectedEquipment.weightRange?.min;
                                      const isRangeEnd =
                                        availableWeight ===
                                        selectedEquipment.weightRange?.max;

                                      let buttonClass = 'btn btn-xs ';
                                      if (isInRange) {
                                        if (isRangeStart || isRangeEnd) {
                                          buttonClass +=
                                            'btn-primary ring-2 ring-primary-content ring-offset-1';
                                        } else {
                                          buttonClass += 'btn-primary';
                                        }
                                      } else {
                                        buttonClass += 'btn-outline';
                                      }

                                      return (
                                        <button
                                          key={availableWeight}
                                          type="button"
                                          onClick={() => {
                                            let newMin =
                                              selectedEquipment.weightRange
                                                ?.min || 0;
                                            let newMax =
                                              selectedEquipment.weightRange
                                                ?.max || 0;

                                            // Simple range selection logic
                                            if (newMin === 0 && newMax === 0) {
                                              // First click - set start point
                                              newMin = availableWeight;
                                              newMax = availableWeight;
                                            } else if (
                                              availableWeight === newMin &&
                                              availableWeight === newMax
                                            ) {
                                              // Clicking the same weight again - clear selection
                                              newMin = 0;
                                              newMax = 0;
                                            } else if (
                                              availableWeight < newMin
                                            ) {
                                              // Clicking a lower weight - set as new min
                                              newMin = availableWeight;
                                            } else if (
                                              availableWeight > newMax
                                            ) {
                                              // Clicking a higher weight - set as new max
                                              newMax = availableWeight;
                                            } else {
                                              // Clicking within the range - expand/contract appropriately
                                              if (availableWeight === newMin) {
                                                // Clicking min - expand range down
                                                newMin =
                                                  availableWeight -
                                                  (equipment
                                                    .weightIncrements?.[0] ||
                                                    5);
                                              } else if (
                                                availableWeight === newMax
                                              ) {
                                                // Clicking max - expand range up
                                                newMax =
                                                  availableWeight +
                                                  (equipment
                                                    .weightIncrements?.[0] ||
                                                    5);
                                              }
                                            }

                                            // Ensure min <= max
                                            if (newMin > newMax) {
                                              [newMin, newMax] = [
                                                newMax,
                                                newMin,
                                              ];
                                            }

                                            // Don't allow negative weights
                                            if (newMin < 0) newMin = 0;
                                            if (newMax < 0) newMax = 0;

                                            handleWeightRangeChange(
                                              equipment.id,
                                              { min: newMin, max: newMax }
                                            );
                                          }}
                                          disabled={disabled}
                                          className={buttonClass}
                                        >
                                          {availableWeight} lbs
                                        </button>
                                      );
                                    }
                                  )}
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="form-control">
                                    <label
                                      htmlFor={`min-weight-${equipment.id}`}
                                      className="label"
                                    >
                                      <span className="label-text text-xs">
                                        Min (lbs)
                                      </span>
                                    </label>
                                    <input
                                      id={`min-weight-${equipment.id}`}
                                      type="number"
                                      value={
                                        selectedEquipment.weightRange?.min || 0
                                      }
                                      onChange={(e) =>
                                        handleWeightRangeChange(equipment.id, {
                                          min: parseInt(e.target.value) || 0,
                                          max:
                                            selectedEquipment.weightRange
                                              ?.max || 0,
                                        })
                                      }
                                      disabled={disabled}
                                      className="input input-bordered input-sm"
                                      min={0}
                                      max={selectedEquipment.weightRange?.max}
                                      step={
                                        equipment.weightIncrements?.[0] || 5
                                      }
                                    />
                                  </div>
                                  <div className="form-control">
                                    <label
                                      htmlFor={`max-weight-${equipment.id}`}
                                      className="label"
                                    >
                                      <span className="label-text text-xs">
                                        Max (lbs)
                                      </span>
                                    </label>
                                    <input
                                      id={`max-weight-${equipment.id}`}
                                      type="number"
                                      value={
                                        selectedEquipment.weightRange?.max || 0
                                      }
                                      onChange={(e) =>
                                        handleWeightRangeChange(equipment.id, {
                                          min:
                                            selectedEquipment.weightRange
                                              ?.min || 0,
                                          max: parseInt(e.target.value) || 0,
                                        })
                                      }
                                      disabled={disabled}
                                      className="input input-bordered input-sm"
                                      min={
                                        selectedEquipment.weightRange?.min || 0
                                      }
                                      step={
                                        equipment.weightIncrements?.[0] || 5
                                      }
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Range Display */}
                              {selectedEquipment.weightRange &&
                                selectedEquipment.weightRange.min > 0 &&
                                selectedEquipment.weightRange.max > 0 && (
                                  <div className="text-sm text-base-content/70">
                                    Range: {selectedEquipment.weightRange.min} -{' '}
                                    {selectedEquipment.weightRange.max} lbs
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Equipment Toggle Button - Removed since entire card is now clickable */}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
