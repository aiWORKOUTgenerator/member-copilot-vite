import { useCallback } from "react";
import { useRewardContext } from "@/contexts/RewardContext";
import { RewardTriggerType } from "@/domain/entities/reward";

/**
 * Hook for basic reward operations
 */
export const useRewards = () => {
  const {
    rewards,
    userClaims,
    activeClaims,
    rewardSummary,
    isLoading,
    error,
    refreshRewards,
    refreshUserData,
    clearErrors,
  } = useRewardContext();

  return {
    rewards,
    userClaims,
    activeClaims,
    rewardSummary,
    isLoading,
    error,
    refreshRewards,
    refreshUserData,
    clearErrors,
  };
};

/**
 * Hook for reward claiming operations
 */
export const useRewardClaiming = () => {
  const { claimReward, isClaimingReward, claimError, clearErrors } =
    useRewardContext();

  return {
    claimReward,
    isClaimingReward,
    claimError,
    clearErrors,
  };
};

/**
 * Hook for reward redemption operations
 */
export const useRewardRedemption = () => {
  const {
    redeemClaim,
    isRedeemingClaim,
    error,
    validateCouponCode,
    clearErrors,
  } = useRewardContext();

  return {
    redeemClaim,
    isRedeemingClaim,
    error,
    validateCouponCode,
    clearErrors,
  };
};

/**
 * Hook for reward progress tracking
 */
export const useRewardProgress = () => {
  const { rewardProgress, rewardSummary, isLoading, refreshUserData } =
    useRewardContext();

  return {
    rewardProgress,
    rewardSummary,
    isLoading,
    refreshUserData,
  };
};

/**
 * Hook for gamification triggers
 */
export const useRewardTriggers = () => {
  const { triggerRewardCheck } = useRewardContext();

  // Convenience methods for common triggers
  const triggerPhoneVerification = useCallback(async () => {
    return await triggerRewardCheck(RewardTriggerType.PHONE_VERIFICATION);
  }, [triggerRewardCheck]);

  const triggerFirstWorkout = useCallback(async () => {
    return await triggerRewardCheck(RewardTriggerType.FIRST_WORKOUT);
  }, [triggerRewardCheck]);

  const triggerWorkoutStreak = useCallback(
    async (streakCount: number) => {
      return await triggerRewardCheck(RewardTriggerType.WORKOUT_STREAK, {
        streak_count: streakCount,
      });
    },
    [triggerRewardCheck]
  );

  const triggerMilestone = useCallback(
    async (milestoneData: Record<string, unknown>) => {
      return await triggerRewardCheck(
        RewardTriggerType.MILESTONE,
        milestoneData
      );
    },
    [triggerRewardCheck]
  );

  const triggerReferral = useCallback(
    async (referralData: Record<string, unknown>) => {
      return await triggerRewardCheck(RewardTriggerType.REFERRAL, referralData);
    },
    [triggerRewardCheck]
  );

  return {
    triggerRewardCheck,
    triggerPhoneVerification,
    triggerFirstWorkout,
    triggerWorkoutStreak,
    triggerMilestone,
    triggerReferral,
  };
};

/**
 * Hook for reward filtering and searching
 */
export const useRewardFilters = () => {
  const { rewards, rewardProgress } = useRewardContext();

  const getRewardsByType = useCallback(
    (type: string) => {
      return rewards.filter((reward) => reward.type === type);
    },
    [rewards]
  );

  const getRewardsByTrigger = useCallback(
    (triggerType: RewardTriggerType) => {
      return rewards.filter(
        (reward) => reward.config.trigger_type === triggerType
      );
    },
    [rewards]
  );

  const getAvailableRewards = useCallback(() => {
    return rewards.filter((reward) => reward.isAvailable());
  }, [rewards]);

  const getClaimableRewards = useCallback(() => {
    return rewardProgress.filter(
      (progress) => progress.progress_percentage >= 100
    );
  }, [rewardProgress]);

  const getInProgressRewards = useCallback(() => {
    return rewardProgress.filter(
      (progress) =>
        progress.progress_percentage > 0 && progress.progress_percentage < 100
    );
  }, [rewardProgress]);

  return {
    getRewardsByType,
    getRewardsByTrigger,
    getAvailableRewards,
    getClaimableRewards,
    getInProgressRewards,
  };
};
