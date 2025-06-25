"use client";

import React from "react";
import { RewardProgress } from "@/domain/interfaces/services/RewardService";
import { RewardBadge } from "@/ui/shared/atoms/RewardBadge";
import { ProgressBar } from "@/ui/shared/atoms/ProgressBar";
import { Button } from "@/ui/shared/atoms/Button";

export interface RewardProgressCardProps {
  progress: RewardProgress;
  onClaim?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const RewardProgressCard: React.FC<RewardProgressCardProps> = ({
  progress,
  onClaim,
  isLoading = false,
  className = "",
}) => {
  const {
    reward,
    progress_percentage,
    current_value,
    target_value,
    description,
  } = progress;
  const isComplete = progress_percentage >= 100;

  const getProgressVariant = () => {
    if (progress_percentage >= 100) return "success";
    if (progress_percentage >= 75) return "info";
    if (progress_percentage >= 50) return "warning";
    return "error";
  };

  const getProgressText = () => {
    if (isComplete) {
      return "🎉 Ready to claim!";
    }
    return `${current_value} / ${target_value}`;
  };

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
          <RewardBadge type="type" rewardType={reward.type} />
        </div>

        {/* Description */}
        <p className="text-sm text-base-content/80 mb-3">{description}</p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-base-content/70">
              {getProgressText()}
            </span>
          </div>

          <ProgressBar
            progress={progress_percentage}
            variant={getProgressVariant()}
            size="md"
          />

          <div className="text-xs text-base-content/60 text-center">
            {Math.round(progress_percentage)}% complete
          </div>
        </div>

        {/* Completion status */}
        {isComplete ? (
          <div className="alert alert-success mt-3">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm">
                Congratulations! You can now claim this reward.
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-3 p-3 bg-base-200 rounded-lg">
            <div className="text-sm text-base-content/80">
              <strong>Next step:</strong> {progress.description}
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
        {isComplete && onClaim && (
          <div className="card-actions justify-end mt-4">
            <Button
              variant="success"
              size="sm"
              isLoading={isLoading}
              onClick={onClaim}
            >
              Claim Reward
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
