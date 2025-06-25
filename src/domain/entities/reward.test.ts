import { describe, it, expect, beforeEach } from "vitest";
import {
  Reward,
  UserRewardClaim,
  RewardType,
  RewardStatus,
  RewardTriggerType,
  RewardError,
  RewardErrorType,
} from "./reward";

describe("Reward Entity", () => {
  let reward: Reward;

  beforeEach(() => {
    reward = new Reward(
      "test-reward-1",
      "Test Reward",
      "A test reward description",
      RewardType.COUPON,
      "10% off",
      {
        trigger_type: RewardTriggerType.PHONE_VERIFICATION,
        trigger_data: {},
      },
      RewardStatus.ACTIVE,
      100, // quantity limit
      50, // quantity claimed
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // expires in 7 days
    );
  });

  describe("isAvailable", () => {
    it("should return true for active, non-expired, non-exhausted reward", () => {
      expect(reward.isAvailable()).toBe(true);
    });

    it("should return false for inactive reward", () => {
      const inactiveReward = new Reward(
        reward.id,
        reward.name,
        reward.description,
        reward.type,
        reward.value,
        reward.config,
        RewardStatus.INACTIVE,
        reward.quantity_limit,
        reward.quantity_claimed,
        reward.expires_at
      );
      expect(inactiveReward.isAvailable()).toBe(false);
    });

    it("should return false for expired reward", () => {
      const expiredReward = new Reward(
        reward.id,
        reward.name,
        reward.description,
        reward.type,
        reward.value,
        reward.config,
        reward.status,
        reward.quantity_limit,
        reward.quantity_claimed,
        new Date(Date.now() - 24 * 60 * 60 * 1000) // expired yesterday
      );
      expect(expiredReward.isAvailable()).toBe(false);
    });

    it("should return false for exhausted reward", () => {
      const exhaustedReward = new Reward(
        reward.id,
        reward.name,
        reward.description,
        reward.type,
        reward.value,
        reward.config,
        reward.status,
        100, // quantity limit
        100, // quantity claimed (exhausted)
        reward.expires_at
      );
      expect(exhaustedReward.isAvailable()).toBe(false);
    });
  });

  describe("getRemainingQuantity", () => {
    it("should return remaining quantity for limited reward", () => {
      expect(reward.getRemainingQuantity()).toBe(50); // 100 - 50
    });

    it("should return null for unlimited reward", () => {
      const unlimitedReward = new Reward(
        reward.id,
        reward.name,
        reward.description,
        reward.type,
        reward.value,
        reward.config,
        reward.status,
        null, // unlimited
        reward.quantity_claimed,
        reward.expires_at
      );
      expect(unlimitedReward.getRemainingQuantity()).toBe(null);
    });

    it("should return 0 for exhausted reward", () => {
      const exhaustedReward = new Reward(
        reward.id,
        reward.name,
        reward.description,
        reward.type,
        reward.value,
        reward.config,
        reward.status,
        50, // quantity limit
        60, // more than limit
        reward.expires_at
      );
      expect(exhaustedReward.getRemainingQuantity()).toBe(0);
    });
  });

  describe("getExpiryStatus", () => {
    it("should return correct expiry status for non-expiring reward", () => {
      const nonExpiringReward = new Reward(
        reward.id,
        reward.name,
        reward.description,
        reward.type,
        reward.value,
        reward.config,
        reward.status,
        reward.quantity_limit,
        reward.quantity_claimed,
        null // never expires
      );
      const status = nonExpiringReward.getExpiryStatus();
      expect(status.expired).toBe(false);
      expect(status.days_until_expiry).toBe(null);
    });

    it("should return correct expiry status for future expiry", () => {
      const status = reward.getExpiryStatus();
      expect(status.expired).toBe(false);
      expect(status.days_until_expiry).toBe(7);
    });

    it("should return correct expiry status for expired reward", () => {
      const expiredReward = new Reward(
        reward.id,
        reward.name,
        reward.description,
        reward.type,
        reward.value,
        reward.config,
        reward.status,
        reward.quantity_limit,
        reward.quantity_claimed,
        new Date(Date.now() - 24 * 60 * 60 * 1000) // expired yesterday
      );
      const status = expiredReward.getExpiryStatus();
      expect(status.expired).toBe(true);
      expect(status.days_until_expiry).toBe(0);
    });
  });
});

describe("UserRewardClaim Entity", () => {
  let claim: UserRewardClaim;

  beforeEach(() => {
    claim = new UserRewardClaim(
      "claim-1",
      "user-1",
      "reward-1",
      new Date(),
      null, // not redeemed
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // expires in 7 days
      "COUPON123",
      { location: "gym" },
      { phone_verified: true }
    );
  });

  describe("isValid", () => {
    it("should return true for valid, unredeemed, non-expired claim", () => {
      expect(claim.isValid()).toBe(true);
    });

    it("should return false for redeemed claim", () => {
      const redeemedClaim = new UserRewardClaim(
        claim.id,
        claim.user_id,
        claim.reward_id,
        claim.claimed_at,
        new Date(), // redeemed now
        claim.expires_at,
        claim.coupon_code,
        claim.redemption_data,
        claim.trigger_event
      );
      expect(redeemedClaim.isValid()).toBe(false);
    });

    it("should return false for expired claim", () => {
      const expiredClaim = new UserRewardClaim(
        claim.id,
        claim.user_id,
        claim.reward_id,
        claim.claimed_at,
        claim.redeemed_at,
        new Date(Date.now() - 24 * 60 * 60 * 1000), // expired yesterday
        claim.coupon_code,
        claim.redemption_data,
        claim.trigger_event
      );
      expect(expiredClaim.isValid()).toBe(false);
    });
  });

  describe("markRedeemed", () => {
    it("should create new claim with redeemed timestamp", () => {
      const redeemedClaim = claim.markRedeemed();
      expect(redeemedClaim.redeemed_at).not.toBe(null);
      expect(redeemedClaim.redeemed_at).toBeInstanceOf(Date);
      expect(redeemedClaim.id).toBe(claim.id);
      expect(redeemedClaim.user_id).toBe(claim.user_id);
      expect(redeemedClaim.reward_id).toBe(claim.reward_id);
    });
  });
});

describe("RewardError", () => {
  describe("static factory methods", () => {
    it("should create rewardNotFound error", () => {
      const error = RewardError.rewardNotFound("reward-123");
      expect(error.type).toBe(RewardErrorType.REWARD_NOT_FOUND);
      expect(error.message).toContain("reward-123");
      expect(error.details?.rewardId).toBe("reward-123");
    });

    it("should create rewardNotAvailable error", () => {
      const error = RewardError.rewardNotAvailable("reward-123", "Expired");
      expect(error.type).toBe(RewardErrorType.REWARD_NOT_AVAILABLE);
      expect(error.message).toContain("Expired");
      expect(error.details?.rewardId).toBe("reward-123");
      expect(error.details?.reason).toBe("Expired");
    });

    it("should create userNotEligible error", () => {
      const error = RewardError.userNotEligible(
        "user-123",
        "reward-456",
        "Not enough points"
      );
      expect(error.type).toBe(RewardErrorType.USER_NOT_ELIGIBLE);
      expect(error.message).toContain("Not enough points");
      expect(error.details?.userId).toBe("user-123");
      expect(error.details?.rewardId).toBe("reward-456");
    });

    it("should create alreadyClaimed error", () => {
      const error = RewardError.alreadyClaimed("user-123", "reward-456");
      expect(error.type).toBe(RewardErrorType.ALREADY_CLAIMED);
      expect(error.message).toContain("already claimed");
      expect(error.details?.userId).toBe("user-123");
      expect(error.details?.rewardId).toBe("reward-456");
    });

    it("should create networkError with retryable flag", () => {
      const originalError = new Error("Connection failed");
      const error = RewardError.networkError(originalError);
      expect(error.type).toBe(RewardErrorType.NETWORK_ERROR);
      expect(error.retryable).toBe(true);
      expect(error.details?.originalError).toBe("Connection failed");
    });
  });
});
