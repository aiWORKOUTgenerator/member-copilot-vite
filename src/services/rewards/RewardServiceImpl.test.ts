import { describe, it, expect, beforeEach } from "vitest";
import { RewardServiceImpl } from "./RewardServiceImpl";
import {
  RewardStatus,
  RewardTriggerType,
  RewardError,
} from "@/domain/entities/reward";

describe("RewardServiceImpl", () => {
  let service: RewardServiceImpl;
  const mockUserId = "user-123";

  beforeEach(() => {
    service = new RewardServiceImpl();
  });

  describe("getActiveRewards", () => {
    it("should return active rewards", async () => {
      const rewards = await service.getActiveRewards();
      expect(rewards).toHaveLength(3);
      expect(rewards.every((r) => r.status === RewardStatus.ACTIVE)).toBe(true);
      expect(rewards.every((r) => r.isAvailable())).toBe(true);
    });
  });

  describe("getRewardsByTrigger", () => {
    it("should return rewards for phone verification trigger", async () => {
      const rewards = await service.getRewardsByTrigger(
        RewardTriggerType.PHONE_VERIFICATION
      );
      expect(rewards).toHaveLength(1);
      expect(rewards[0].config.trigger_type).toBe(
        RewardTriggerType.PHONE_VERIFICATION
      );
      expect(rewards[0].name).toBe("Phone Verification Bonus");
    });

    it("should return rewards for workout streak trigger", async () => {
      const rewards = await service.getRewardsByTrigger(
        RewardTriggerType.WORKOUT_STREAK
      );
      expect(rewards).toHaveLength(1);
      expect(rewards[0].config.trigger_type).toBe(
        RewardTriggerType.WORKOUT_STREAK
      );
      expect(rewards[0].name).toBe("3-Day Workout Streak");
    });

    it("should return rewards for first workout trigger", async () => {
      const rewards = await service.getRewardsByTrigger(
        RewardTriggerType.FIRST_WORKOUT
      );
      expect(rewards).toHaveLength(1);
      expect(rewards[0].config.trigger_type).toBe(
        RewardTriggerType.FIRST_WORKOUT
      );
      expect(rewards[0].name).toBe("First Workout Bonus");
    });
  });

  describe("getRewardById", () => {
    it("should return reward by id", async () => {
      const reward = await service.getRewardById("phone-verification-reward");
      expect(reward.name).toBe("Phone Verification Bonus");
    });

    it("should throw error for non-existent reward", async () => {
      await expect(service.getRewardById("non-existent")).rejects.toThrow(
        RewardError
      );
    });
  });

  describe("checkRewardEligibility", () => {
    it("should return not eligible for phone verification when not verified", async () => {
      const eligibility = await service.checkRewardEligibility(
        mockUserId,
        "phone-verification-reward"
      );
      expect(eligibility.eligible).toBe(false);
      expect(eligibility.reason).toContain("Phone number not verified");
      expect(eligibility.requirements_met.phone_verified).toBe(false);
    });

    it("should return eligible for phone verification when verified", async () => {
      service.setUserProgress(mockUserId, { phone_verified: 1 });
      const eligibility = await service.checkRewardEligibility(
        mockUserId,
        "phone-verification-reward"
      );
      expect(eligibility.eligible).toBe(true);
      expect(eligibility.requirements_met.phone_verified).toBe(true);
    });

    it("should return not eligible for workout streak when streak is insufficient", async () => {
      service.setUserProgress(mockUserId, { current_workout_streak: 1 });
      const eligibility = await service.checkRewardEligibility(
        mockUserId,
        "workout-streak-3"
      );
      expect(eligibility.eligible).toBe(false);
      expect(eligibility.reason).toContain(
        "Need 2 more consecutive workout days"
      );
    });

    it("should return eligible for workout streak when streak is sufficient", async () => {
      service.setUserProgress(mockUserId, { current_workout_streak: 3 });
      const eligibility = await service.checkRewardEligibility(
        mockUserId,
        "workout-streak-3"
      );
      expect(eligibility.eligible).toBe(true);
      expect(eligibility.requirements_met.workout_streak).toBe(true);
    });

    it("should return not eligible for first workout when no workouts completed", async () => {
      const eligibility = await service.checkRewardEligibility(
        mockUserId,
        "first-workout-bonus"
      );
      expect(eligibility.eligible).toBe(false);
      expect(eligibility.reason).toContain("Complete your first workout");
    });

    it("should return eligible for first workout when workouts completed", async () => {
      service.setUserProgress(mockUserId, { total_workouts: 1 });
      const eligibility = await service.checkRewardEligibility(
        mockUserId,
        "first-workout-bonus"
      );
      expect(eligibility.eligible).toBe(true);
      expect(eligibility.requirements_met.first_workout).toBe(true);
    });

    it("should return not eligible when already claimed", async () => {
      // First claim the reward
      service.setUserProgress(mockUserId, { phone_verified: 1 });
      await service.claimReward(mockUserId, {
        reward_id: "phone-verification-reward",
        trigger_data: {},
      });

      // Try to check eligibility again
      const eligibility = await service.checkRewardEligibility(
        mockUserId,
        "phone-verification-reward"
      );
      expect(eligibility.eligible).toBe(false);
      expect(eligibility.reason).toContain("already claimed");
    });
  });

  describe("claimReward", () => {
    it("should successfully claim eligible reward", async () => {
      service.setUserProgress(mockUserId, { phone_verified: 1 });

      const response = await service.claimReward(mockUserId, {
        reward_id: "phone-verification-reward",
        trigger_data: {},
      });

      expect(response.success).toBe(true);
      expect(response.claim.user_id).toBe(mockUserId);
      expect(response.claim.reward_id).toBe("phone-verification-reward");
      expect(response.claim.coupon_code).toBeTruthy();
      expect(response.message).toContain("10% off your first smoothie");
    });

    it("should throw error when claiming ineligible reward", async () => {
      await expect(
        service.claimReward(mockUserId, {
          reward_id: "phone-verification-reward",
          trigger_data: {},
        })
      ).rejects.toThrow(RewardError);
    });

    it("should throw error when reward not found", async () => {
      await expect(
        service.claimReward(mockUserId, {
          reward_id: "non-existent",
          trigger_data: {},
        })
      ).rejects.toThrow(RewardError);
    });
  });

  describe("getUserRewardClaims", () => {
    it("should return empty array for user with no claims", async () => {
      const claims = await service.getUserRewardClaims(mockUserId);
      expect(claims).toEqual([]);
    });

    it("should return user claims after claiming", async () => {
      service.setUserProgress(mockUserId, { phone_verified: 1 });
      await service.claimReward(mockUserId, {
        reward_id: "phone-verification-reward",
        trigger_data: {},
      });

      const claims = await service.getUserRewardClaims(mockUserId);
      expect(claims).toHaveLength(1);
      expect(claims[0].reward_id).toBe("phone-verification-reward");
    });
  });

  describe("getUserActiveClaims", () => {
    it("should return only valid claims", async () => {
      service.setUserProgress(mockUserId, { phone_verified: 1 });
      await service.claimReward(mockUserId, {
        reward_id: "phone-verification-reward",
        trigger_data: {},
      });

      const activeClaims = await service.getUserActiveClaims(mockUserId);
      expect(activeClaims).toHaveLength(1);
      expect(activeClaims[0].isValid()).toBe(true);
    });
  });

  describe("redeemRewardClaim", () => {
    it("should successfully redeem valid claim", async () => {
      service.setUserProgress(mockUserId, { phone_verified: 1 });
      const claimResponse = await service.claimReward(mockUserId, {
        reward_id: "phone-verification-reward",
        trigger_data: {},
      });

      const redeemResponse = await service.redeemRewardClaim(
        mockUserId,
        claimResponse.claim.id
      );
      expect(redeemResponse.success).toBe(true);
      expect(redeemResponse.message).toContain("successfully redeemed");

      // Verify claim is no longer valid
      const claims = await service.getUserRewardClaims(mockUserId);
      expect(claims[0].redeemed_at).not.toBe(null);
      expect(claims[0].isValid()).toBe(false);
    });

    it("should throw error when claim not found", async () => {
      await expect(
        service.redeemRewardClaim(mockUserId, "non-existent-claim")
      ).rejects.toThrow(RewardError);
    });
  });

  describe("getUserRewardSummary", () => {
    it("should return correct summary for user with no claims", async () => {
      const summary = await service.getUserRewardSummary(mockUserId);
      expect(summary.total_rewards_available).toBe(3);
      expect(summary.total_rewards_claimed).toBe(0);
      expect(summary.total_rewards_redeemed).toBe(0);
      expect(summary.active_claims).toHaveLength(0);
    });

    it("should return correct summary for user with claims", async () => {
      service.setUserProgress(mockUserId, { phone_verified: 1 });
      await service.claimReward(mockUserId, {
        reward_id: "phone-verification-reward",
        trigger_data: {},
      });

      const summary = await service.getUserRewardSummary(mockUserId);
      expect(summary.total_rewards_available).toBe(3);
      expect(summary.total_rewards_claimed).toBe(1);
      expect(summary.total_rewards_redeemed).toBe(0);
      expect(summary.active_claims).toHaveLength(1);
    });
  });

  describe("getUserRewardProgress", () => {
    it("should return progress for all rewards", async () => {
      const progress = await service.getUserRewardProgress(mockUserId);
      expect(progress).toHaveLength(3);

      const phoneVerificationProgress = progress.find(
        (p) => p.reward_id === "phone-verification-reward"
      );
      expect(phoneVerificationProgress?.progress_percentage).toBe(0);
      expect(phoneVerificationProgress?.current_value).toBe(0);
      expect(phoneVerificationProgress?.target_value).toBe(1);
    });

    it("should return correct progress when partially completed", async () => {
      service.setUserProgress(mockUserId, {
        phone_verified: 1,
        current_workout_streak: 2,
        total_workouts: 5,
      });

      const progress = await service.getUserRewardProgress(mockUserId);

      const phoneProgress = progress.find(
        (p) => p.reward_id === "phone-verification-reward"
      );
      expect(phoneProgress?.progress_percentage).toBe(100);

      const workoutStreakProgress = progress.find(
        (p) => p.reward_id === "workout-streak-3"
      );
      expect(workoutStreakProgress?.progress_percentage).toBe(67); // 2/3 * 100 rounded

      const firstWorkoutProgress = progress.find(
        (p) => p.reward_id === "first-workout-bonus"
      );
      expect(firstWorkoutProgress?.progress_percentage).toBe(100);
    });
  });

  describe("triggerRewardCheck", () => {
    it("should trigger phone verification reward", async () => {
      const result = await service.triggerRewardCheck(
        mockUserId,
        RewardTriggerType.PHONE_VERIFICATION,
        {}
      );

      expect(result.triggered_rewards).toHaveLength(1);
      expect(result.triggered_rewards[0].claim.reward_id).toBe(
        "phone-verification-reward"
      );
      expect(result.available_rewards).toHaveLength(3);
    });

    it("should trigger first workout reward", async () => {
      const result = await service.triggerRewardCheck(
        mockUserId,
        RewardTriggerType.FIRST_WORKOUT,
        {}
      );

      expect(result.triggered_rewards).toHaveLength(1);
      expect(result.triggered_rewards[0].claim.reward_id).toBe(
        "first-workout-bonus"
      );
    });

    it("should trigger workout streak reward when streak is sufficient", async () => {
      const result = await service.triggerRewardCheck(
        mockUserId,
        RewardTriggerType.WORKOUT_STREAK,
        {
          streak_count: 3,
        }
      );

      expect(result.triggered_rewards).toHaveLength(1);
      expect(result.triggered_rewards[0].claim.reward_id).toBe(
        "workout-streak-3"
      );
    });

    it("should not trigger rewards when already claimed", async () => {
      // First trigger
      await service.triggerRewardCheck(
        mockUserId,
        RewardTriggerType.PHONE_VERIFICATION,
        {}
      );

      // Second trigger should not claim again
      const result = await service.triggerRewardCheck(
        mockUserId,
        RewardTriggerType.PHONE_VERIFICATION,
        {}
      );
      expect(result.triggered_rewards).toHaveLength(0);
    });
  });

  describe("validateCouponCode", () => {
    it("should return invalid for non-existent coupon", async () => {
      const result = await service.validateCouponCode("INVALID123");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("Invalid coupon code");
    });

    it("should return valid for existing coupon", async () => {
      service.setUserProgress(mockUserId, { phone_verified: 1 });
      const claimResponse = await service.claimReward(mockUserId, {
        reward_id: "phone-verification-reward",
        trigger_data: {},
      });

      const result = await service.validateCouponCode(
        claimResponse.claim.coupon_code!
      );
      expect(result.valid).toBe(true);
      expect(result.claim?.id).toBe(claimResponse.claim.id);
      expect(result.reward?.id).toBe("phone-verification-reward");
      expect(result.message).toContain("10% off your first smoothie");
    });

    it("should return invalid for redeemed coupon", async () => {
      service.setUserProgress(mockUserId, { phone_verified: 1 });
      const claimResponse = await service.claimReward(mockUserId, {
        reward_id: "phone-verification-reward",
        trigger_data: {},
      });

      // Redeem the claim
      await service.redeemRewardClaim(mockUserId, claimResponse.claim.id);

      const result = await service.validateCouponCode(
        claimResponse.claim.coupon_code!
      );
      expect(result.valid).toBe(false);
      expect(result.message).toContain("expired or already been used");
    });
  });
});
