import { CustomizationComponentProps } from '../types';

// Available equipment options for home workouts
const EQUIPMENT_OPTIONS = [
  { label: 'None / Bodyweight Only', value: 'bodyweight_only' },
  { label: 'Dumbbells', value: 'dumbbells' },
  { label: 'Adjustable Dumbbells', value: 'adjustable_dumbbells' },
  { label: 'Kettlebells', value: 'kettlebells' },
  { label: 'Barbell', value: 'barbell' },
  { label: 'Bench', value: 'bench' },
  { label: 'Pull-up Bar', value: 'pull_up_bar' },
  { label: 'Resistance Bands', value: 'resistance_bands' },
  { label: 'Resistance Loops/Mini Bands', value: 'resistance_loops' },
  { label: 'TRX/Suspension Trainer', value: 'trx_suspension' },
  { label: 'Gymnastic Rings', value: 'gymnastic_rings' },
  { label: 'Yoga Mat', value: 'yoga_mat' },
  { label: 'Medicine Ball', value: 'medicine_ball' },
  { label: 'Stability Ball', value: 'stability_ball' },
  { label: 'Jump Rope', value: 'jump_rope' },
  { label: 'Ab Wheel', value: 'ab_wheel' },
  { label: 'Foam Roller', value: 'foam_roller' },
  { label: 'Battle Ropes', value: 'battle_ropes' },
  { label: 'Cable Machine', value: 'cable_machine' },
  { label: 'Exercise/Stationary Bike', value: 'exercise_bike' },
  { label: 'Treadmill', value: 'treadmill' },
  { label: 'Rowing Machine', value: 'rowing_machine' },
];

export default function AvailableEquipmentCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<string[] | undefined>) {
  const selectedEquipment = value || [];

  const handleEquipmentToggle = (equipmentValue: string) => {
    const isSelected = selectedEquipment.includes(equipmentValue);

    if (isSelected) {
      // Remove the equipment
      const newEquipment = selectedEquipment.filter(
        (item) => item !== equipmentValue
      );
      onChange(newEquipment.length > 0 ? newEquipment : undefined);
    } else {
      // Add the equipment
      onChange([...selectedEquipment, equipmentValue]);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {EQUIPMENT_OPTIONS.map((option) => {
          const isSelected = selectedEquipment.includes(option.value);

          return (
            <label
              key={option.value}
              className={`flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-base-200 ${
                disabled ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={isSelected}
                onChange={() => handleEquipmentToggle(option.value)}
                disabled={disabled}
              />
              <span className="text-sm">{option.label}</span>
            </label>
          );
        })}
      </div>

      {error && <p className="validator-hint mt-2">{error}</p>}

      {selectedEquipment.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-base-content/60 mb-2">
            Selected equipment ({selectedEquipment.length}):
          </p>
          <div className="flex flex-wrap gap-1">
            {selectedEquipment.map((equipment) => {
              const option = EQUIPMENT_OPTIONS.find(
                (opt) => opt.value === equipment
              );
              return (
                <span key={equipment} className="badge badge-outline badge-sm">
                  {option?.label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
