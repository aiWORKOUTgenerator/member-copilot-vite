import { CustomizationComponentProps } from '../types';

export default function IncludeExercisesCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<string | undefined>) {
  return (
    <div className="space-y-2">
      <input
        type="text"
        className="input input-bordered validator w-full"
        placeholder="e.g., squats, pushups, deadlifts"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        disabled={disabled}
      />
      {error && <p className="validator-hint">{error}</p>}
      <p className="text-xs text-base-content/60">
        Specify exercises you want to include in your workout (comma-separated)
      </p>
    </div>
  );
}
