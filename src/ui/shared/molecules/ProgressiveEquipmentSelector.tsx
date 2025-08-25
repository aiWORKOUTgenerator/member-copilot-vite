import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Dumbbell, Settings } from 'lucide-react';
import { Card, CardBody } from '@/ui/shared/atoms/Card';
import { Button } from '@/ui/shared/atoms/Button';
// import { SelectionBadge } from '@/ui/shared/atoms/SelectionBadge';

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
    weightType: 'individual' | 'range';
    weight?: number | number[]; // Support both single weight and array of weights
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
 * Progressive Equipment Selector
 *
 * A three-level progressive disclosure interface that reduces cognitive overload:
 * 1. Zone Selection (single choice)
 * 2. Equipment Selection (multi-choice within zone)
 * 3. Weight Configuration (individual or range)
 */
export function ProgressiveEquipmentSelector({
  zones,
  value = [],
  onChange,
  disabled = false,
}: ProgressiveEquipmentSelectorProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [expandedEquipment, setExpandedEquipment] = useState<Set<string>>(
    new Set()
  );

  // Get current selection for selected zone
  const currentZoneSelection = useMemo(() => {
    return value.find((selection) => selection.zoneId === selectedZone);
  }, [value, selectedZone]);

  const handleZoneSelect = (zoneId: string) => {
    if (selectedZone === zoneId) {
      setSelectedZone(null);
      setExpandedEquipment(new Set());
    } else {
      setSelectedZone(zoneId);
      setExpandedEquipment(new Set());
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
      // Add equipment with default weight configuration
      const newItem = {
        id: equipmentId,
        name: equipment.name,
        weightType: 'individual' as const,
        weight:
          equipment.availableWeights && equipment.availableWeights.length > 0
            ? [] // Start with no weights selected for multi-select
            : equipment.defaultWeightRange?.min
              ? [equipment.defaultWeightRange.min]
              : [],
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
    const defaultRange = zoneEquipment?.defaultWeightRange;

    const updatedEquipment = currentSelection.map((e) => {
      if (e.id === equipmentId) {
        return {
          ...e,
          weightType,
          weight:
            weightType === 'individual'
              ? defaultRange?.min
                ? [defaultRange.min]
                : []
              : undefined,
          weightRange: weightType === 'range' ? defaultRange : undefined,
        };
      }
      return e;
    });

    updateZoneSelection(selectedZone, updatedEquipment);
  };

  const handleWeightChange = (
    equipmentId: string,
    weight: number | number[]
  ) => {
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

  const toggleEquipmentExpansion = (equipmentId: string) => {
    const newExpanded = new Set(expandedEquipment);
    if (newExpanded.has(equipmentId)) {
      newExpanded.delete(equipmentId);
    } else {
      newExpanded.add(equipmentId);
    }
    setExpandedEquipment(newExpanded);
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
              <Card
                key={zone.id}
                variant="path"
                colorScheme={isSelected ? 'primary' : 'secondary'}
                isSelected={isSelected}
                onClick={() => !disabled && handleZoneSelect(zone.id)}
                className={`cursor-pointer transition-all ${
                  disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-[1.02]'
                }`}
              >
                <CardBody padding="md">
                  <div className="space-y-2">
                    {/* Title row with badge inline */}
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-base-content">
                        {zone.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        {hasEquipment > 0 && (
                          <span className="badge badge-primary badge-sm">
                            {hasEquipment} selected
                          </span>
                        )}
                        {isSelected ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    {/* Description on its own row */}
                    <p className="text-sm text-base-content/70">
                      {zone.description}
                    </p>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Level 2: Equipment Selection (only when zone is selected) */}
      {selectedZone && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            <h3 className="text-lg font-semibold">
              Select Equipment in{' '}
              {zones.find((z) => z.id === selectedZone)?.name}
            </h3>
          </div>

          <div className="space-y-3">
            {zones
              .find((z) => z.id === selectedZone)
              ?.equipment.map((equipment) => {
                const isSelected =
                  currentZoneSelection?.equipment.some(
                    (e) => e.id === equipment.id
                  ) || false;
                const isExpanded = expandedEquipment.has(equipment.id);
                const selectedEquipment = currentZoneSelection?.equipment.find(
                  (e) => e.id === equipment.id
                );

                return (
                  <div
                    key={equipment.id}
                    className="border border-base-300 rounded-lg"
                  >
                    {/* Equipment Header */}
                    <div
                      className={`p-4 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-base-200'
                      }`}
                      onClick={() =>
                        !disabled && handleEquipmentToggle(equipment.id)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // Handled by parent click
                            disabled={disabled}
                            className="checkbox checkbox-sm"
                          />
                          <div>
                            <h4 className="font-medium">{equipment.name}</h4>
                            <p className="text-sm text-base-content/70">
                              {equipment.category}
                            </p>
                          </div>
                        </div>
                        {isSelected && equipment.hasWeight && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleEquipmentExpansion(equipment.id);
                            }}
                          >
                            <Settings className="h-4 w-4" />
                            Configure
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Level 3: Weight Configuration (accordion) */}
                    {isSelected && equipment.hasWeight && isExpanded && (
                      <div className="border-t border-base-300 p-4 bg-base-50">
                        <WeightConfiguration
                          equipment={equipment}
                          value={selectedEquipment}
                          onChange={(weightType, weight, weightRange) => {
                            if (weightType) {
                              handleWeightTypeChange(equipment.id, weightType);
                            }
                            if (weight !== undefined) {
                              handleWeightChange(equipment.id, weight);
                            }
                            if (weightRange) {
                              handleWeightRangeChange(
                                equipment.id,
                                weightRange
                              );
                            }
                          }}
                          disabled={disabled}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

interface WeightConfigurationProps {
  equipment: EquipmentItem;
  value?: EquipmentSelection['equipment'][0];
  onChange: (
    weightType?: 'individual' | 'range',
    weight?: number | number[],
    weightRange?: WeightRange
  ) => void;
  disabled?: boolean;
}

function WeightConfiguration({
  equipment,
  value,
  onChange,
  disabled,
}: WeightConfigurationProps) {
  const weightType = value?.weightType || 'individual';
  // Ensure weight is always an array for multi-select
  const weight = Array.isArray(value?.weight)
    ? value.weight
    : value?.weight
      ? [value.weight]
      : equipment.defaultWeightRange?.min
        ? [equipment.defaultWeightRange.min]
        : [];
  const weightRange = value?.weightRange ||
    equipment.defaultWeightRange || { min: 0, max: 100 };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Weight Configuration</h4>

      {/* Weight Type Toggle */}
      <div className="flex gap-2">
        <Button
          variant={weightType === 'individual' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onChange('individual')}
          disabled={disabled}
        >
          Individual Weight
        </Button>
        <Button
          variant={weightType === 'range' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onChange('range')}
          disabled={disabled}
        >
          Weight Range
        </Button>
      </div>

      {/* Individual Weight Selection */}
      {weightType === 'individual' && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Select {equipment.name} weights
          </label>
          {equipment.availableWeights ? (
            <div className="grid grid-cols-4 gap-2">
              {equipment.availableWeights.map((availableWeight) => {
                const isSelected = weight.includes(availableWeight);

                return (
                  <button
                    key={availableWeight}
                    type="button"
                    onClick={() => {
                      const newWeights = isSelected
                        ? weight.filter((w) => w !== availableWeight)
                        : [...weight, availableWeight];
                      onChange(undefined, newWeights);
                    }}
                    disabled={disabled}
                    className={`btn btn-sm text-xs ${
                      isSelected ? 'btn-primary' : 'btn-outline'
                    }`}
                  >
                    {availableWeight} lbs
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={weight[0] || 0}
                onChange={(e) =>
                  onChange(undefined, [parseInt(e.target.value) || 0])
                }
                disabled={disabled}
                className="input input-bordered input-sm w-24"
                min={0}
                step={equipment.weightIncrements?.[0] || 5}
              />
              <span className="text-sm text-base-content/70">lbs</span>
            </div>
          )}
        </div>
      )}

      {/* Weight Range Selection */}
      {weightType === 'range' && (
        <div className="space-y-4">
          {equipment.availableWeights ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Weight Range</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-base-content/70">From</label>
                  <select
                    value={weightRange.min}
                    onChange={(e) =>
                      onChange(undefined, undefined, {
                        ...weightRange,
                        min: parseInt(e.target.value) || 0,
                      })
                    }
                    disabled={disabled}
                    className="select select-bordered select-sm w-full"
                  >
                    {equipment.availableWeights
                      .filter((w) => w <= weightRange.max)
                      .map((weight) => (
                        <option key={weight} value={weight}>
                          {weight} lbs
                        </option>
                      ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-base-content/70">To</label>
                  <select
                    value={weightRange.max}
                    onChange={(e) =>
                      onChange(undefined, undefined, {
                        ...weightRange,
                        max: parseInt(e.target.value) || 0,
                      })
                    }
                    disabled={disabled}
                    className="select select-bordered select-sm w-full"
                  >
                    {equipment.availableWeights
                      .filter((w) => w >= weightRange.min)
                      .map((weight) => (
                        <option key={weight} value={weight}>
                          {weight} lbs
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="text-sm text-base-content/70">
                Range: {weightRange.min} - {weightRange.max} lbs
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Minimum Weight (lbs)
                </label>
                <input
                  type="number"
                  value={weightRange.min}
                  onChange={(e) =>
                    onChange(undefined, undefined, {
                      ...weightRange,
                      min: parseInt(e.target.value) || 0,
                    })
                  }
                  disabled={disabled}
                  className="input input-bordered input-sm w-full"
                  min={0}
                  max={weightRange.max}
                  step={equipment.weightIncrements?.[0] || 5}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Maximum Weight (lbs)
                </label>
                <input
                  type="number"
                  value={weightRange.max}
                  onChange={(e) =>
                    onChange(undefined, undefined, {
                      ...weightRange,
                      max: parseInt(e.target.value) || 0,
                    })
                  }
                  disabled={disabled}
                  className="input input-bordered input-sm w-full"
                  min={weightRange.min}
                  step={equipment.weightIncrements?.[0] || 5}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
