"use client";

import React from "react";
import { Reward } from "@/domain/entities/reward";
import { RewardBadge } from "@/ui/shared/atoms/RewardBadge";
import { Button } from "@/ui/shared/atoms/Button";

export interface RewardCardProps {
  reward: Reward;
  isEligible?: boolean;
  isLoading?: boolean;
  onClaim?: () => void;
  showClaimButton?: boolean;
  className?: string;
}

export const RewardCard: React.FC<RewardCardProps> = ({
  reward,
  isEligible = false,
  isLoading = false,
  onClaim,
  showClaimButton = true,
  className = "",
}) => {
  const { expires_at, quantity_limit, quantity_claimed } = reward;
  const expiryStatus = reward.getExpiryStatus();
  const remainingQuantity = reward.getRemainingQuantity();

  return (
    <div
      className={`card bg-base-100 shadow-lg border border-base-300 ${className}`}
    >
      <div className="card-body">
        {/* Header with badges */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-2 flex-wrap">
            <RewardBadge type="type" rewardType={reward.type} />
            <RewardBadge type="status" status={reward.status} />
          </div>
          {reward.image_url && (
            <div className="avatar">
              <div className="w-12 h-12 rounded-lg">
                <img src={reward.image_url} alt={reward.name} />
              </div>
            </div>
          )}
        </div>

        {/* Title and Value */}
        <div className="space-y-2">
          <h3 className="card-title text-lg">{reward.name}</h3>
          <RewardBadge type="value" value={reward.value} className="text-lg" />
        </div>

        {/* Description */}
        <p className="text-base-content/80 text-sm">{reward.description}</p>

        {/* Availability Info */}
        <div className="space-y-1">
          {expires_at && (
            <div className="text-xs text-base-content/60">
              {expiryStatus.expired ? (
                <span className="text-error">Expired</span>
              ) : expiryStatus.days_until_expiry !== null ? (
                <span>Expires in {expiryStatus.days_until_expiry} days</span>
              ) : null}
            </div>
          )}

          {quantity_limit && (
            <div className="text-xs text-base-content/60">
              {remainingQuantity !== null && remainingQuantity > 0 ? (
                <span>{remainingQuantity} remaining</span>
              ) : remainingQuantity === 0 ? (
                <span className="text-warning">Limited quantity exhausted</span>
              ) : (
                <span>
                  {quantity_limit - quantity_claimed} of {quantity_limit}{" "}
                  remaining
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {showClaimButton && (
          <div className="card-actions justify-end mt-4">
            <Button
              variant={isEligible ? "primary" : "ghost"}
              size="sm"
              disabled={!isEligible || !reward.isAvailable()}
              isLoading={isLoading}
              onClick={onClaim}
            >
              {!isEligible
                ? "Requirements not met"
                : !reward.isAvailable()
                ? "Not available"
                : "Claim Reward"}
            </Button>
          </div>
        )}

        {/* Terms and conditions */}
        {reward.terms_and_conditions && (
          <div className="mt-2 text-xs text-base-content/50">
            <details>
              <summary className="cursor-pointer hover:text-base-content/70">
                Terms & Conditions
              </summary>
              <p className="mt-1">{reward.terms_and_conditions}</p>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};
