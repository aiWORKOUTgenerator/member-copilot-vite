"use client";

import React from "react";
import { UserRewardClaim, Reward } from "@/domain/entities/reward";
import { RewardBadge } from "@/ui/shared/atoms/RewardBadge";
import { CouponCode } from "@/ui/shared/atoms/CouponCode";
import { Button } from "@/ui/shared/atoms/Button";

export interface RewardClaimCardProps {
  claim: UserRewardClaim;
  reward: Reward;
  onRedeem?: () => void;
  isRedeeming?: boolean;
  showRedeemButton?: boolean;
  className?: string;
}

export const RewardClaimCard: React.FC<RewardClaimCardProps> = ({
  claim,
  reward,
  onRedeem,
  isRedeeming = false,
  showRedeemButton = true,
  className = "",
}) => {
  const isValid = claim.isValid();
  const isRedeemed = !!claim.redeemed_at;
  const isExpired = claim.expires_at && claim.expires_at < new Date();

  const getStatusInfo = () => {
    if (isRedeemed) {
      return {
        status: "Redeemed",
        variant: "success" as const,
        date: `Redeemed on ${claim.redeemed_at?.toLocaleDateString()}`,
      };
    }
    if (isExpired) {
      return {
        status: "Expired",
        variant: "error" as const,
        date: `Expired on ${claim.expires_at?.toLocaleDateString()}`,
      };
    }
    if (claim.expires_at) {
      const daysUntilExpiry = Math.ceil(
        (claim.expires_at.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return {
        status: "Active",
        variant: "success" as const,
        date:
          daysUntilExpiry > 0
            ? `Expires in ${daysUntilExpiry} day${
                daysUntilExpiry !== 1 ? "s" : ""
              }`
            : "Expires today",
      };
    }
    return {
      status: "Active",
      variant: "success" as const,
      date: "No expiration",
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div
      className={`card bg-base-100 shadow-lg border border-base-300 ${className}`}
    >
      <div className="card-body">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="space-y-1">
            <h3 className="card-title text-lg">{reward.name}</h3>
            <RewardBadge type="value" value={reward.value} />
          </div>
          <div className="text-right">
            <div className={`badge badge-${statusInfo.variant}`}>
              {statusInfo.status}
            </div>
            <div className="text-xs text-base-content/60 mt-1">
              {statusInfo.date}
            </div>
          </div>
        </div>

        {/* Claimed date */}
        <div className="text-sm text-base-content/60 mb-3">
          Claimed on {claim.claimed_at.toLocaleDateString()}
        </div>

        {/* Coupon code */}
        {claim.coupon_code && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Your coupon code:</div>
            <CouponCode code={claim.coupon_code} variant="success" size="md" />
          </div>
        )}

        {/* Redemption instructions */}
        {reward.redemption_instructions && (
          <div className="mt-3 p-3 bg-info/10 rounded-lg border border-info/20">
            <div className="text-sm font-medium text-info mb-1">
              How to redeem:
            </div>
            <div className="text-sm text-base-content/80">
              {reward.redemption_instructions}
            </div>
          </div>
        )}

        {/* Terms and conditions */}
        {reward.terms_and_conditions && (
          <div className="mt-3 text-xs text-base-content/50">
            <details>
              <summary className="cursor-pointer hover:text-base-content/70">
                Terms & Conditions
              </summary>
              <p className="mt-1">{reward.terms_and_conditions}</p>
            </details>
          </div>
        )}

        {/* Actions */}
        {showRedeemButton && isValid && !isRedeemed && onRedeem && (
          <div className="card-actions justify-end mt-4">
            <Button
              variant="success"
              size="sm"
              isLoading={isRedeeming}
              onClick={onRedeem}
            >
              Mark as Redeemed
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
