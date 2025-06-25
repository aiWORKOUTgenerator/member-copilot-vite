import {
  Reward,
  UserRewardClaim,
  RewardType,
  RewardStatus,
  RewardTriggerType,
  RewardError,
  RewardErrorType,
} from "@/domain/entities/reward";
import {
  RewardService,
  RewardEligibilityResult,
  ClaimRewardRequest,
  ClaimRewardResponse,
  UserRewardSummary,
  RewardProgress,
} from "@/domain/interfaces/services/RewardService";

/**
 * Mock reward service implementation
 * In a real app, this would make API calls to your backend
 */
export class RewardServiceImpl implements RewardService {
  private rewards: Reward[] = [];
  private userClaims: Map<string, UserRewardClaim[]> = new Map();
  private userProgress: Map<string, Record<string, number>> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Initialize some sample rewards
    this.rewards = [
      new Reward(
        "phone-verification-reward",
        "Phone Verification Bonus",
        "Verify your phone number and get a welcome coupon!",
        RewardType.COUPON,
        "10% off your first smoothie",
        {
          trigger_type: RewardTriggerType.PHONE_VERIFICATION,
          trigger_data: {},
        },
        RewardStatus.ACTIVE,
        null, // unlimited
        0,
        null, // never expires
        new Date(),
        new Date(),
        null,
        "Valid for 30 days from claiming. One-time use only.",
        "Show this coupon to staff at checkout"
      ),
      new Reward(
        "workout-streak-3",
        "3-Day Workout Streak",
        "Complete 3 workouts in 3 days and earn a free smoothie!",
        RewardType.FREE_ITEM,
        "Free protein smoothie",
        {
          trigger_type: RewardTriggerType.WORKOUT_STREAK,
          trigger_data: { streak_days: 3, window_days: 3 },
        },
        RewardStatus.ACTIVE,
        100, // limited quantity
        15, // already claimed by 15 users
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // expires in 30 days
        new Date(),
        new Date(),
        null,
        "Valid for 7 days from claiming. Must be used in-store.",
        "Show this coupon to staff. Valid for any smoothie up to $8 value."
      ),
      new Reward(
        "first-workout-bonus",
        "First Workout Bonus",
        "Complete your first workout and get a free protein bar!",
        RewardType.FREE_ITEM,
        "Free protein bar",
        {
          trigger_type: RewardTriggerType.FIRST_WORKOUT,
          trigger_data: {},
        },
        RewardStatus.ACTIVE,
        null,
        0,
        null,
        new Date(),
        new Date(),
        null,
        "Valid for 14 days from claiming. One-time use only.",
        "Show this coupon to staff at the front desk"
      ),
    ];
  }

  async getActiveRewards(): Promise<Reward[]> {
    return this.rewards.filter(
      (reward) => reward.status === RewardStatus.ACTIVE && reward.isAvailable()
    );
  }

  async getRewardsByTrigger(triggerType: RewardTriggerType): Promise<Reward[]> {
    return this.rewards.filter(
      (reward) =>
        reward.config.trigger_type === triggerType &&
        reward.status === RewardStatus.ACTIVE &&
        reward.isAvailable()
    );
  }

  async getRewardById(rewardId: string): Promise<Reward> {
    const reward = this.rewards.find((r) => r.id === rewardId);
    if (!reward) {
      throw RewardError.rewardNotFound(rewardId);
    }
    return reward;
  }

  async checkRewardEligibility(
    userId: string,
    rewardId: string
  ): Promise<RewardEligibilityResult> {
    const reward = await this.getRewardById(rewardId);

    if (!reward.isAvailable()) {
      return {
        eligible: false,
        reason: "Reward is not currently available",
        requirements_met: {},
      };
    }

    // Check if user already claimed this reward
    const userClaims = this.userClaims.get(userId) || [];
    const alreadyClaimed = userClaims.some(
      (claim) => claim.reward_id === rewardId && claim.isValid()
    );

    if (alreadyClaimed) {
      return {
        eligible: false,
        reason: "You have already claimed this reward",
        requirements_met: {},
      };
    }

    // Check specific eligibility based on trigger type
    const userProgressData = this.userProgress.get(userId) || {};

    switch (reward.config.trigger_type) {
      case RewardTriggerType.PHONE_VERIFICATION: {
        // For demo purposes, assume user needs to verify phone
        const phoneVerified = (userProgressData.phone_verified || 0) >= 1;
        return {
          eligible: phoneVerified,
          reason: phoneVerified ? undefined : "Phone number not verified",
          requirements_met: {
            phone_verified: phoneVerified,
          },
          next_requirement: phoneVerified
            ? undefined
            : "Verify your phone number",
        };
      }

      case RewardTriggerType.WORKOUT_STREAK: {
        const streakDays = userProgressData.current_workout_streak || 0;
        const targetStreak =
          (reward.config.trigger_data.streak_days as number) || 3;
        return {
          eligible: streakDays >= targetStreak,
          reason:
            streakDays >= targetStreak
              ? undefined
              : `Need ${
                  targetStreak - streakDays
                } more consecutive workout days`,
          requirements_met: {
            workout_streak: streakDays >= targetStreak,
          },
          next_requirement:
            streakDays >= targetStreak
              ? undefined
              : `Complete ${targetStreak - streakDays} more workouts`,
        };
      }

      case RewardTriggerType.FIRST_WORKOUT: {
        const workoutCount = userProgressData.total_workouts || 0;
        return {
          eligible: workoutCount >= 1,
          reason: workoutCount >= 1 ? undefined : "Complete your first workout",
          requirements_met: {
            first_workout: workoutCount >= 1,
          },
          next_requirement:
            workoutCount >= 1 ? undefined : "Complete your first workout",
        };
      }

      default:
        return {
          eligible: true,
          requirements_met: {},
        };
    }
  }

  async claimReward(
    userId: string,
    request: ClaimRewardRequest
  ): Promise<ClaimRewardResponse> {
    const eligibility = await this.checkRewardEligibility(
      userId,
      request.reward_id
    );

    if (!eligibility.eligible) {
      throw RewardError.userNotEligible(
        userId,
        request.reward_id,
        eligibility.reason || "Not eligible"
      );
    }

    const reward = await this.getRewardById(request.reward_id);

    // Generate claim
    const claimId = `claim_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const couponCode =
      reward.type === RewardType.COUPON || reward.type === RewardType.FREE_ITEM
        ? `${reward.id.toUpperCase()}_${Math.random()
            .toString(36)
            .substr(2, 6)}`
        : null;

    const claim = new UserRewardClaim(
      claimId,
      userId,
      request.reward_id,
      new Date(),
      null,
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // expires in 30 days
      couponCode,
      {},
      request.trigger_data
    );

    // Store the claim
    const userClaims = this.userClaims.get(userId) || [];
    userClaims.push(claim);
    this.userClaims.set(userId, userClaims);

    // Update reward claimed count
    const rewardIndex = this.rewards.findIndex(
      (r) => r.id === request.reward_id
    );
    if (rewardIndex !== -1) {
      const updatedReward = new Reward(
        reward.id,
        reward.name,
        reward.description,
        reward.type,
        reward.value,
        reward.config,
        reward.status,
        reward.quantity_limit,
        reward.quantity_claimed + 1,
        reward.expires_at,
        reward.created_at,
        new Date(),
        reward.image_url,
        reward.terms_and_conditions,
        reward.redemption_instructions
      );
      this.rewards[rewardIndex] = updatedReward;
    }

    return {
      success: true,
      claim,
      message: `Congratulations! You've earned: ${reward.value}`,
    };
  }

  async getUserRewardClaims(userId: string): Promise<UserRewardClaim[]> {
    return this.userClaims.get(userId) || [];
  }

  async getUserActiveClaims(userId: string): Promise<UserRewardClaim[]> {
    const claims = this.userClaims.get(userId) || [];
    return claims.filter((claim) => claim.isValid());
  }

  async redeemRewardClaim(
    userId: string,
    claimId: string
  ): Promise<{ success: boolean; message: string }> {
    const userClaims = this.userClaims.get(userId) || [];
    const claimIndex = userClaims.findIndex((claim) => claim.id === claimId);

    if (claimIndex === -1) {
      throw new RewardError(
        RewardErrorType.CLAIM_NOT_FOUND,
        "Reward claim not found",
        { userId, claimId }
      );
    }

    const claim = userClaims[claimIndex];

    if (!claim.isValid()) {
      throw new RewardError(
        RewardErrorType.CLAIM_EXPIRED,
        "Reward claim has expired or already been redeemed",
        { userId, claimId }
      );
    }

    // Mark as redeemed
    const redeemedClaim = claim.markRedeemed();
    userClaims[claimIndex] = redeemedClaim;
    this.userClaims.set(userId, userClaims);

    return {
      success: true,
      message: "Reward successfully redeemed!",
    };
  }

  async getUserRewardSummary(userId: string): Promise<UserRewardSummary> {
    const claims = this.userClaims.get(userId) || [];
    const activeClaims = claims.filter((claim) => claim.isValid());
    const redeemedCount = claims.filter(
      (claim) => claim.redeemed_at !== null
    ).length;
    const activeRewards = await this.getActiveRewards();

    return {
      total_rewards_available: activeRewards.length,
      total_rewards_claimed: claims.length,
      total_rewards_redeemed: redeemedCount,
      active_claims: activeClaims,
    };
  }

  async getUserRewardProgress(userId: string): Promise<RewardProgress[]> {
    const activeRewards = await this.getActiveRewards();
    const userProgressData = this.userProgress.get(userId) || {};
    const progress: RewardProgress[] = [];

    for (const reward of activeRewards) {
      let progressPercentage = 0;
      let currentValue = 0;
      let targetValue = 1;
      let description = reward.description;

      switch (reward.config.trigger_type) {
        case RewardTriggerType.PHONE_VERIFICATION:
          currentValue = userProgressData.phone_verified || 0;
          targetValue = 1;
          progressPercentage = currentValue * 100;
          description = "Verify your phone number to unlock this reward";
          break;

        case RewardTriggerType.WORKOUT_STREAK:
          currentValue = userProgressData.current_workout_streak || 0;
          targetValue = (reward.config.trigger_data.streak_days as number) || 3;
          progressPercentage = Math.min(
            (currentValue / targetValue) * 100,
            100
          );
          description = `Complete ${targetValue} workouts in ${targetValue} days`;
          break;

        case RewardTriggerType.FIRST_WORKOUT:
          currentValue = userProgressData.total_workouts || 0;
          targetValue = 1;
          progressPercentage = currentValue >= 1 ? 100 : 0;
          description = "Complete your first workout";
          break;
      }

      progress.push({
        reward_id: reward.id,
        reward,
        progress_percentage: Math.round(progressPercentage),
        current_value: currentValue,
        target_value: targetValue,
        description,
      });
    }

    return progress;
  }

  async triggerRewardCheck(
    userId: string,
    triggerType: RewardTriggerType,
    triggerData: Record<string, unknown>
  ): Promise<{
    triggered_rewards: ClaimRewardResponse[];
    available_rewards: Reward[];
  }> {
    // Update user progress based on trigger
    const userProgressData = this.userProgress.get(userId) || {};

    switch (triggerType) {
      case RewardTriggerType.PHONE_VERIFICATION:
        userProgressData.phone_verified = 1;
        break;
      case RewardTriggerType.FIRST_WORKOUT:
        userProgressData.total_workouts =
          (userProgressData.total_workouts || 0) + 1;
        break;
      case RewardTriggerType.WORKOUT_STREAK:
        userProgressData.current_workout_streak =
          (triggerData.streak_count as number) || 1;
        break;
    }

    this.userProgress.set(userId, userProgressData);

    // Check for rewards that can be auto-claimed
    const eligibleRewards = await this.getRewardsByTrigger(triggerType);
    const triggeredRewards: ClaimRewardResponse[] = [];

    for (const reward of eligibleRewards) {
      try {
        const eligibility = await this.checkRewardEligibility(
          userId,
          reward.id
        );
        if (eligibility.eligible) {
          const response = await this.claimReward(userId, {
            reward_id: reward.id,
            trigger_data: triggerData,
          });
          triggeredRewards.push(response);
        }
      } catch (error) {
        // Skip rewards that can't be claimed (e.g., already claimed)
        console.log(`Could not claim reward ${reward.id}:`, error);
      }
    }

    const availableRewards = await this.getActiveRewards();

    return {
      triggered_rewards: triggeredRewards,
      available_rewards: availableRewards,
    };
  }

  async validateCouponCode(couponCode: string): Promise<{
    valid: boolean;
    claim?: UserRewardClaim;
    reward?: Reward;
    message: string;
  }> {
    // Find claim by coupon code
    let foundClaim: UserRewardClaim | undefined;

    for (const [, claims] of this.userClaims.entries()) {
      const claim = claims.find((c) => c.coupon_code === couponCode);
      if (claim) {
        foundClaim = claim;
        break;
      }
    }

    if (!foundClaim) {
      return {
        valid: false,
        message: "Invalid coupon code",
      };
    }

    if (!foundClaim.isValid()) {
      return {
        valid: false,
        claim: foundClaim,
        message: "Coupon has expired or already been used",
      };
    }

    const reward = await this.getRewardById(foundClaim.reward_id);

    return {
      valid: true,
      claim: foundClaim,
      reward,
      message: `Valid coupon: ${reward.value}`,
    };
  }

  // Helper method for testing - simulate user progress
  public setUserProgress(
    userId: string,
    progress: Record<string, number>
  ): void {
    this.userProgress.set(userId, progress);
  }
}
