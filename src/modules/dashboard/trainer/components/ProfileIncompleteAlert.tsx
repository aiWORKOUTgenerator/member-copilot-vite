import { AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

interface ProfileIncompleteAlertProps {
  overallProgress: number;
  className?: string;
}

/**
 * Glassmorphism alert component to show when profile is incomplete for trainer generation
 * Follows the established style guide with frosted glass panels and neon accents
 */
export function ProfileIncompleteAlert({
  overallProgress,
  className = '',
}: ProfileIncompleteAlertProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-base-100/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.2)] transition-all duration-300 hover:bg-base-100/15 ${className}`}
    >
      {/* Glass morphism background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-warning/5 via-transparent to-warning/5 rounded-2xl -m-1 p-1"></div>

      <div className="relative z-10">
        {/* Header with icon and title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-warning/20">
            <AlertCircle className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-base-content">
              Profile Incomplete
            </h3>
            <p className="text-sm text-base-content/70">
              {overallProgress}% complete
            </p>
          </div>
        </div>

        {/* Progress bar with glassmorphism styling */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-base-content/80">
              Training Profile
            </span>
            <span className="text-sm text-warning font-semibold">
              {overallProgress}%
            </span>
          </div>
          <div className="w-full bg-base-200/30 rounded-full h-2 backdrop-blur-sm border border-white/10">
            <div
              className="bg-gradient-to-r from-warning to-warning/80 h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_var(--color-warning)]"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Description with better typography */}
        <p className="text-base text-base-content/80 mb-6 leading-relaxed">
          Complete more of your training profile to unlock your personalized AI
          trainer. The more we know about your goals and preferences, the better
          your trainer will be!
        </p>

        {/* CTA button with glassmorphism and neon glow */}
        <button
          className="btn btn-warning rounded-full shadow-[0_0_20px_var(--color-warning)] hover:shadow-[0_0_30px_var(--color-warning)] transition-all duration-300 hover:scale-105 group"
          onClick={() => navigate('/dashboard/profile')}
        >
          Complete Profile
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}
