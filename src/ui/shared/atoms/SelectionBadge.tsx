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
 * Always uses primary styling and right alignment to match existing patterns.
 */
export const SelectionBadge: React.FC<SelectionBadgeProps> = ({
  value,
  size = 'sm',
  className = '',
}) => {
  if (!value) return null;

  return (
    <span className={`badge badge-primary badge-${size} ml-auto ${className}`}>
      {value}
    </span>
  );
};
