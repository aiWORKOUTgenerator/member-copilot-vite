"use client";

import { useEffect } from "react";
import { useTitle } from "@/contexts/TitleContext";
import { RewardDashboard } from "@/ui/shared/organisms/RewardDashboard";
import { useRewards } from "@/hooks/useRewards";

export default function RewardsPage() {
  const { setTitle } = useTitle();

  const { rewards, isLoading } = useRewards();

  // Set page title
  useEffect(() => {
    setTitle("🎁 Rewards");
  }, [setTitle]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="hero bg-gradient-to-r from-primary to-secondary rounded-lg text-white">
        <div className="hero-content text-center py-8">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4">🎁 Rewards Center</h1>
            <p className="text-lg mb-6">
              Earn rewards by completing workouts, verifying your phone, and
              achieving fitness milestones!
            </p>
            <div className="stats stats-horizontal bg-white/10 shadow">
              <div className="stat">
                <div className="stat-title text-white/80">
                  Available Rewards
                </div>
                <div className="stat-value text-white">{rewards.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Rewards Dashboard */}
      <RewardDashboard />
    </div>
  );
}
