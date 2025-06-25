"use client";

import React, { useState } from "react";
import {
  useRewards,
  useRewardClaiming,
  useRewardProgress,
} from "@/hooks/useRewards";
import { RewardCard } from "@/ui/shared/molecules/RewardCard";
import { RewardClaimCard } from "@/ui/shared/molecules/RewardClaimCard";
import { RewardProgressCard } from "@/ui/shared/molecules/RewardProgressCard";
import LoadingState from "@/ui/shared/atoms/LoadingState";
import { Button } from "@/ui/shared/atoms/Button";

export interface RewardDashboardProps {
  className?: string;
}

export const RewardDashboard: React.FC<RewardDashboardProps> = ({
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<
    "available" | "progress" | "claimed"
  >("available");

  const {
    rewards,
    activeClaims,
    rewardSummary,
    isLoading,
    error,
    refreshRewards,
    refreshUserData,
  } = useRewards();

  const { claimReward, isClaimingReward, claimError } = useRewardClaiming();

  const { rewardProgress } = useRewardProgress();

  const handleClaimReward = async (rewardId: string) => {
    const result = await claimReward(rewardId);
    if (result) {
      await refreshUserData();
    }
  };

  if (isLoading) {
    return (
      <div className={`card bg-base-100 shadow-lg ${className}`}>
        <div className="card-body">
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className={`card bg-base-100 shadow-lg ${className}`}>
      <div className="card-body">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="card-title text-2xl">🎁 Rewards</h2>
          {rewardSummary && (
            <div className="stats stats-horizontal shadow">
              <div className="stat">
                <div className="stat-title">Available</div>
                <div className="stat-value text-primary">
                  {rewardSummary.total_rewards_available}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Claimed</div>
                <div className="stat-value text-secondary">
                  {rewardSummary.total_rewards_claimed}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {claimError && (
          <div className="alert alert-warning mb-4">
            <span>{claimError}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="tabs tabs-boxed justify-center mb-6">
          <button
            className={`tab ${activeTab === "available" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("available")}
          >
            Available
          </button>
          <button
            className={`tab ${activeTab === "progress" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("progress")}
          >
            Progress
          </button>
          <button
            className={`tab ${activeTab === "claimed" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("claimed")}
          >
            My Rewards
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "available" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  isEligible={true}
                  isLoading={isClaimingReward}
                  onClaim={() => handleClaimReward(reward.id)}
                />
              ))}
            </div>
          )}

          {activeTab === "progress" && (
            <div className="grid gap-4 md:grid-cols-2">
              {rewardProgress.map((progress) => (
                <RewardProgressCard
                  key={progress.reward_id}
                  progress={progress}
                  isLoading={isClaimingReward}
                  onClaim={() => handleClaimReward(progress.reward_id)}
                />
              ))}
            </div>
          )}

          {activeTab === "claimed" && (
            <div className="grid gap-4 md:grid-cols-2">
              {activeClaims.map((claim) => {
                const reward = rewards.find((r) => r.id === claim.reward_id);
                if (!reward) return null;

                return (
                  <RewardClaimCard
                    key={claim.id}
                    claim={claim}
                    reward={reward}
                    showRedeemButton={false}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Refresh button */}
        <div className="card-actions justify-center mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              refreshRewards();
              refreshUserData();
            }}
          >
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};
