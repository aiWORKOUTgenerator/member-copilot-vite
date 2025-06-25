import {
  Reward,
  UserRewardClaim,
  RewardTriggerType,
} from "@/domain/entities/reward";

/**
 * Reward eligibility check result
 */
export interface RewardEligibilityResult {
  eligible: boolean;
  reason?: string;
  requirements_met: Record<string, boolean>;
  next_requirement?: string;
}

/**
 * Claim reward request
 */
export interface ClaimRewardRequest {
  reward_id: string;
  trigger_data: Record<string, unknown>;
}

/**
 * Claim reward response
 */
export interface ClaimRewardResponse {
  success: boolean;
  claim: UserRewardClaim;
  message: string;
}

/**
 * User reward summary
 */
export interface UserRewardSummary {
  total_rewards_available: number;
  total_rewards_claimed: number;
  total_rewards_redeemed: number;
  active_claims: UserRewardClaim[];
  points_balance?: number;
}

/**
 * Reward progress tracking
 */
export interface RewardProgress {
  reward_id: string;
  reward: Reward;
  progress_percentage: number;
  current_value: number;
  target_value: number;
  description: string;
}

/**
 * Reward service interface
 */
export interface RewardService {
  /**
   * Get all active rewards
   */
  getActiveRewards(): Promise<Reward[]>;

  /**
   * Get rewards by trigger type
   */
  getRewardsByTrigger(triggerType: RewardTriggerType): Promise<Reward[]>;

  /**
   * Get reward by ID
   */
  getRewardById(rewardId: string): Promise<Reward>;

  /**
   * Check if user is eligible for a reward
   */
  checkRewardEligibility(
    userId: string,
    rewardId: string
  ): Promise<RewardEligibilityResult>;

  /**
   * Claim a reward for a user
   */
  claimReward(
    userId: string,
    request: ClaimRewardRequest
  ): Promise<ClaimRewardResponse>;

  /**
   * Get user's reward claims
   */
  getUserRewardClaims(userId: string): Promise<UserRewardClaim[]>;

  /**
   * Get user's active (valid) claims
   */
  getUserActiveClaims(userId: string): Promise<UserRewardClaim[]>;

  /**
   * Redeem a reward claim
   */
  redeemRewardClaim(
    userId: string,
    claimId: string
  ): Promise<{ success: boolean; message: string }>;

  /**
   * Get user reward summary
   */
  getUserRewardSummary(userId: string): Promise<UserRewardSummary>;

  /**
   * Get user's progress toward available rewards
   */
  getUserRewardProgress(userId: string): Promise<RewardProgress[]>;

  /**
   * Trigger reward check (called when events happen)
   */
  triggerRewardCheck(
    userId: string,
    triggerType: RewardTriggerType,
    triggerData: Record<string, unknown>
  ): Promise<{
    triggered_rewards: ClaimRewardResponse[];
    available_rewards: Reward[];
  }>;

  /**
   * Validate coupon code
   */
  validateCouponCode(couponCode: string): Promise<{
    valid: boolean;
    claim?: UserRewardClaim;
    reward?: Reward;
    message: string;
  }>;
}
