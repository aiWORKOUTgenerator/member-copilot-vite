'use client';

import { MeteredFeature } from '@/domain/entities/meteredFeatures';
import { useUserAccess } from '@/hooks';
import AccessAwareComponent from '@/ui/shared/molecules/AccessAwareComponent';
import { useNavigate } from 'react-router';

export default function UsagePage() {
  const navigate = useNavigate();
  const {
    getTotalAggregatedValueForMeter,
    isMeterLimitReached,
    getHighestLimitForMeter,
  } = useUserAccess();

  const navigateToSubscription = () => {
    navigate('/dashboard/billing');
  };

  return (
    <div className="p-6 bg-base-100 rounded-box space-y-6">
      <h2 className="text-xl font-bold mb-4">Usage Statistics</h2>
      <p className="text-base-content/70 mb-4">
        Track your usage metrics for the current billing period.
      </p>

      <AccessAwareComponent showSkeleton={true} skeletonClassName="h-32 w-full">
        <div className="stats shadow w-full">
          <div className="stat">
            <div className="stat-title">Workouts Generated</div>
            <div className="stat-value">
              {getTotalAggregatedValueForMeter(
                MeteredFeature.WORKOUTS_GENERATED
              )}
              <span className="text-sm font-normal">
                {' '}
                /{' '}
                {getHighestLimitForMeter(MeteredFeature.WORKOUTS_GENERATED) ||
                  '∞'}
              </span>
            </div>
            <div className="stat-desc">
              {isMeterLimitReached(MeteredFeature.WORKOUTS_GENERATED) ? (
                <span className="badge badge-error">Limit Reached</span>
              ) : (
                <span className="badge badge-success">Available</span>
              )}
            </div>
          </div>
        </div>
      </AccessAwareComponent>

      <AccessAwareComponent showSkeleton={false} fallback={null}>
        {isMeterLimitReached(MeteredFeature.WORKOUTS_GENERATED) && (
          <div className="mt-6">
            <button
              className="btn btn-primary"
              onClick={navigateToSubscription}
            >
              Upgrade Plan
            </button>
          </div>
        )}
      </AccessAwareComponent>
    </div>
  );
}
