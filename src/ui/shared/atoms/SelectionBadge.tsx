interface SelectionBadgeProps {
  /** The selected value to display */
  value?: string | null;
  /** Size variant - matches DaisyUI badge sizes */
  size?: 'xs' | 'sm';
  /** Additional CSS classes */
  className?: string;
}

/**
 * A simple badge component for showing selected values in workout setup.
 * Uses subtle outline styling with DaisyUI semantic colors for consistency.
 * Includes right alignment (ml-auto) to match existing patterns.
 */
export const SelectionBadge: React.FC<SelectionBadgeProps> = ({
  value,
  size = 'sm',
  className = '',
}) => {
  if (!value) return null;

  return (
    <span
      className={`badge badge-outline badge-${size} ml-auto bg-base-100 text-base-content border-base-300 ${className}`}
    >
      {value}
    </span>
  );
};
