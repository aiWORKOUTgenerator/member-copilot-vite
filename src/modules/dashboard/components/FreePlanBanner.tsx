import { Star, Zap, TrendingUp } from 'lucide-react';
import { ReactNode } from 'react';

interface FreePlanBannerProps {
  /** Number of workouts used in the current period */
  usedWorkouts: number;
  /** Maximum number of workouts allowed in the current plan */
  workoutLimit: number;
  /** Called when the user clicks the upgrade button */
  onUpgradeClick: () => void;
  /** Optional slot for extra actions */
  extraActions?: ReactNode;
}

export const FreePlanBanner = ({
  usedWorkouts,
  workoutLimit,
  onUpgradeClick,
  extraActions,
}: FreePlanBannerProps) => {
  return (
    <div className="mb-6">
      <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-warning" />
                <h3 className="card-title text-lg">You're on the Free Plan</h3>
                <div className="badge badge-warning badge-outline whitespace-nowrap">
                  {usedWorkouts}/{workoutLimit} workouts used
                </div>
              </div>
              <p className="text-primary-content/90 mb-3">
                Unlock unlimited AI-powered workouts, advanced customization,
                and priority support with our Premium plan (only $10/month).
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  <span>100 workouts</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Advanced AI generation</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>Priority support</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                className="btn btn-accent btn-lg sm:btn-xl secondary-content"
                onClick={onUpgradeClick}
              >
                <Star className="w-4 h-4" />
                Upgrade Now
              </button>
              {extraActions}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
