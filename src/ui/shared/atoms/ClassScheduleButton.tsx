import { Calendar, Sparkles } from 'lucide-react';
import { ButtonHTMLAttributes } from 'react';

interface ClassScheduleButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Show loading state */
  isLoading?: boolean;
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Glassmorphism-styled button for opening class schedule dialog
 * Features neon glow effect following the style guide
 */
export const ClassScheduleButton: React.FC<ClassScheduleButtonProps> = ({
  isLoading = false,
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'btn-sm px-3 py-1.5 text-xs',
    md: 'btn-md px-4 py-2 text-sm',
    lg: 'btn-lg px-6 py-3 text-base',
  };

  return (
    <button
      className={`
        btn btn-ghost
        bg-base-100/10 backdrop-blur-xl border border-primary/30
        hover:bg-primary/10 hover:border-primary/50 hover:shadow-[0_0_20px_var(--color-primary)]
        active:scale-95
        transition-all duration-300
        rounded-full
        flex items-center gap-2
        relative overflow-hidden
        ${sizeClasses[size]}
        ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 animate-pulse opacity-50" />

      {/* Content */}
      <div className="relative flex items-center gap-2">
        {isLoading ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <>
            <Calendar className="w-4 h-4 text-primary" />
            <Sparkles className="w-3 h-3 text-accent animate-pulse" />
          </>
        )}

        <span className="font-medium text-base-content">
          {children || (isLoading ? 'Loading...' : 'Find Class')}
        </span>
      </div>
    </button>
  );
};
