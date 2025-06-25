"use client";

import React, { useEffect, useState } from "react";
import { UserRewardClaim, Reward } from "@/domain/entities/reward";
import { RewardBadge } from "@/ui/shared/atoms/RewardBadge";
import { CouponCode } from "@/ui/shared/atoms/CouponCode";
import { Button } from "@/ui/shared/atoms/Button";

export interface RewardNotificationProps {
  claim: UserRewardClaim;
  reward: Reward;
  onDismiss?: () => void;
  onViewRewards?: () => void;
  autoHide?: boolean;
  autoHideDelay?: number;
  className?: string;
}

export const RewardNotification: React.FC<RewardNotificationProps> = ({
  claim,
  reward,
  onDismiss,
  onViewRewards,
  autoHide = true,
  autoHideDelay = 8000,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onDismiss?.(), 300); // Allow animation to complete
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss?.(), 300);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div className="alert alert-success shadow-lg max-w-md animate-bounce">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-6 h-6 text-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="font-bold text-lg">🎉 Reward Earned!</h3>
            <button
              onClick={handleDismiss}
              className="btn btn-ghost btn-xs ml-auto"
            >
              ✕
            </button>
          </div>

          {/* Reward info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{reward.name}</span>
              <RewardBadge type="type" rewardType={reward.type} />
            </div>

            <RewardBadge
              type="value"
              value={reward.value}
              className="text-base"
            />

            {/* Coupon code */}
            {claim.coupon_code && (
              <div className="mt-3">
                <div className="text-sm font-medium mb-1">
                  Your coupon code:
                </div>
                <CouponCode
                  code={claim.coupon_code}
                  variant="success"
                  size="sm"
                />
              </div>
            )}

            {/* Expiry info */}
            {claim.expires_at && (
              <div className="text-xs text-base-content/70">
                Expires: {claim.expires_at.toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            {onViewRewards && (
              <Button variant="primary" size="xs" onClick={onViewRewards}>
                View All Rewards
              </Button>
            )}
            <Button variant="ghost" size="xs" onClick={handleDismiss}>
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
