"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useUser } from "@clerk/clerk-react";
import { useRewardService } from "./ServiceContext";
import {
  Reward,
  UserRewardClaim,
  RewardTriggerType,
  RewardError,
} from "@/domain/entities/reward";
import {
  RewardProgress,
  UserRewardSummary,
  ClaimRewardResponse,
} from "@/domain/interfaces/services/RewardService";

/**
 * Reward context state interface
 */
interface RewardContextState {
  // Data
  rewards: Reward[];
  userClaims: UserRewardClaim[];
  activeClaims: UserRewardClaim[];
  rewardProgress: RewardProgress[];
  rewardSummary: UserRewardSummary | null;

  // Loading states
  isLoading: boolean;
  isClaimingReward: boolean;
  isRedeemingClaim: boolean;

  // Error states
  error: string | null;
  claimError: string | null;

  // Actions
  refreshRewards: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  claimReward: (
    rewardId: string,
    triggerData?: Record<string, unknown>
  ) => Promise<ClaimRewardResponse | null>;
  redeemClaim: (claimId: string) => Promise<boolean>;
  triggerRewardCheck: (
    triggerType: RewardTriggerType,
    triggerData?: Record<string, unknown>
  ) => Promise<ClaimRewardResponse[]>;
  validateCouponCode: (couponCode: string) => Promise<{
    valid: boolean;
    claim?: UserRewardClaim;
    reward?: Reward;
    message: string;
  }>;
  clearErrors: () => void;
}

/**
 * Create the reward context
 */
const RewardContext = createContext<RewardContextState | undefined>(undefined);

/**
 * Reward provider props
 */
interface RewardProviderProps {
  children: ReactNode;
}

/**
 * Reward provider component
 */
export function RewardProvider({ children }: RewardProviderProps) {
  const { user } = useUser();
  const rewardService = useRewardService();

  // State
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userClaims, setUserClaims] = useState<UserRewardClaim[]>([]);
  const [activeClaims, setActiveClaims] = useState<UserRewardClaim[]>([]);
  const [rewardProgress, setRewardProgress] = useState<RewardProgress[]>([]);
  const [rewardSummary, setRewardSummary] = useState<UserRewardSummary | null>(
    null
  );

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isClaimingReward, setIsClaimingReward] = useState(false);
  const [isRedeemingClaim, setIsRedeemingClaim] = useState(false);

  // Error states
  const [error, setError] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  /**
   * Clear all error states
   */
  const clearErrors = useCallback(() => {
    setError(null);
    setClaimError(null);
  }, []);

  /**
   * Handle errors from reward operations
   */
  const handleError = useCallback((error: unknown, context: string) => {
    console.error(`RewardContext error in ${context}:`, error);

    if (error instanceof RewardError) {
      setError(error.message);
    } else if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("An unexpected error occurred");
    }
  }, []);

  /**
   * Refresh available rewards
   */
  const refreshRewards = useCallback(async () => {
    try {
      clearErrors();
      setIsLoading(true);

      const activeRewards = await rewardService.getActiveRewards();
      setRewards(activeRewards);
    } catch (error) {
      handleError(error, "refreshRewards");
    } finally {
      setIsLoading(false);
    }
  }, [rewardService, handleError, clearErrors]);

  /**
   * Refresh user-specific reward data
   */
  const refreshUserData = useCallback(async () => {
    if (!user?.id) return;

    try {
      clearErrors();
      setIsLoading(true);

      const [claims, activeClaimsData, progress, summary] = await Promise.all([
        rewardService.getUserRewardClaims(user.id),
        rewardService.getUserActiveClaims(user.id),
        rewardService.getUserRewardProgress(user.id),
        rewardService.getUserRewardSummary(user.id),
      ]);

      setUserClaims(claims);
      setActiveClaims(activeClaimsData);
      setRewardProgress(progress);
      setRewardSummary(summary);
    } catch (error) {
      handleError(error, "refreshUserData");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, rewardService, handleError, clearErrors]);

  /**
   * Claim a reward
   */
  const claimReward = useCallback(
    async (
      rewardId: string,
      triggerData: Record<string, unknown> = {}
    ): Promise<ClaimRewardResponse | null> => {
      if (!user?.id) {
        setClaimError("User not authenticated");
        return null;
      }

      try {
        setClaimError(null);
        setIsClaimingReward(true);

        const response = await rewardService.claimReward(user.id, {
          reward_id: rewardId,
          trigger_data: triggerData,
        });

        // Refresh user data after successful claim
        await refreshUserData();

        return response;
      } catch (error) {
        console.error("Error claiming reward:", error);

        if (error instanceof RewardError) {
          setClaimError(error.message);
        } else if (error instanceof Error) {
          setClaimError(error.message);
        } else {
          setClaimError("Failed to claim reward");
        }

        return null;
      } finally {
        setIsClaimingReward(false);
      }
    },
    [user?.id, rewardService, refreshUserData]
  );

  /**
   * Redeem a reward claim
   */
  const redeemClaim = useCallback(
    async (claimId: string): Promise<boolean> => {
      if (!user?.id) {
        setError("User not authenticated");
        return false;
      }

      try {
        clearErrors();
        setIsRedeemingClaim(true);

        const result = await rewardService.redeemRewardClaim(user.id, claimId);

        if (result.success) {
          // Refresh user data after successful redemption
          await refreshUserData();
          return true;
        }

        return false;
      } catch (error) {
        handleError(error, "redeemClaim");
        return false;
      } finally {
        setIsRedeemingClaim(false);
      }
    },
    [user?.id, rewardService, refreshUserData, handleError, clearErrors]
  );

  /**
   * Trigger reward check (for gamification events)
   */
  const triggerRewardCheck = useCallback(
    async (
      triggerType: RewardTriggerType,
      triggerData: Record<string, unknown> = {}
    ): Promise<ClaimRewardResponse[]> => {
      if (!user?.id) {
        return [];
      }

      try {
        const result = await rewardService.triggerRewardCheck(
          user.id,
          triggerType,
          triggerData
        );

        // Refresh data if rewards were triggered
        if (result.triggered_rewards.length > 0) {
          await Promise.all([refreshRewards(), refreshUserData()]);
        }

        return result.triggered_rewards;
      } catch (error) {
        console.error("Error triggering reward check:", error);
        return [];
      }
    },
    [user?.id, rewardService, refreshRewards, refreshUserData]
  );

  /**
   * Validate a coupon code
   */
  const validateCouponCode = useCallback(
    async (couponCode: string) => {
      try {
        clearErrors();
        return await rewardService.validateCouponCode(couponCode);
      } catch (error) {
        handleError(error, "validateCouponCode");
        return {
          valid: false,
          message: "Error validating coupon code",
        };
      }
    },
    [rewardService, handleError, clearErrors]
  );

  // Load initial data when user changes
  useEffect(() => {
    if (user?.id) {
      Promise.all([refreshRewards(), refreshUserData()]);
    } else {
      // Clear data when user logs out
      setRewards([]);
      setUserClaims([]);
      setActiveClaims([]);
      setRewardProgress([]);
      setRewardSummary(null);
      clearErrors();
    }
  }, [user?.id, refreshRewards, refreshUserData, clearErrors]);

  const contextValue: RewardContextState = {
    // Data
    rewards,
    userClaims,
    activeClaims,
    rewardProgress,
    rewardSummary,

    // Loading states
    isLoading,
    isClaimingReward,
    isRedeemingClaim,

    // Error states
    error,
    claimError,

    // Actions
    refreshRewards,
    refreshUserData,
    claimReward,
    redeemClaim,
    triggerRewardCheck,
    validateCouponCode,
    clearErrors,
  };

  return (
    <RewardContext.Provider value={contextValue}>
      {children}
    </RewardContext.Provider>
  );
}

/**
 * Hook to use the reward context
 */
export function useRewardContext(): RewardContextState {
  const context = useContext(RewardContext);

  if (context === undefined) {
    throw new Error("useRewardContext must be used within a RewardProvider");
  }

  return context;
}
