import type { SelectionSummaryItem } from '@/modules/dashboard/workouts/hooks/useSelectionSummary';

export interface SelectionSummaryProps {
  /** Array of selection items to display */
  selections: SelectionSummaryItem[];
  /** Whether the summary should be visible */
  isVisible: boolean;
  /** Visual variant of the summary */
  variant?: 'compact' | 'detailed';
  /** Additional CSS classes */
  className?: string;
}

/**
 * SelectionSummary displays a collection of user selections as read-only badges.
 * Designed for multi-step forms to show accumulated choices before submission.
 *
 * Features:
 * - Responsive layout (wraps on mobile, horizontal on desktop)
 * - Display-only badges for review purposes
 * - Icons and labels for better UX
 * - Smooth animations for selection changes
 *
 * Note: This component is display-only. To change selections, users should
 * navigate back to the appropriate form step and use the grid card interface.
 */
export const SelectionSummary: React.FC<SelectionSummaryProps> = ({
  selections,
  isVisible,
  variant = 'compact',
  className = '',
}) => {
  if (!isVisible || selections.length === 0) return null;

  return (
    <div
      className={`flex flex-wrap gap-tight animate-in fade-in duration-300 ${className}`}
      role="group"
      aria-label="Selected options"
    >
      {selections.map((selection) => (
        <div
          key={selection.key}
          className={`
            flex items-center gap-tight 
            bg-base-200 rounded-full px-3 py-1.5 
            text-sm border border-base-300
            transition-all duration-200
            ${variant === 'detailed' ? 'px-4 py-2' : ''}
          `}
        >
          {/* Label (only in detailed variant) */}
          {variant === 'detailed' && (
            <span className="text-xs text-base-content/70 font-medium">
              {selection.label}:
            </span>
          )}

          {/* Value */}
          <span className="font-semibold text-base-content">
            {selection.value}
          </span>
        </div>
      ))}
    </div>
  );
};
