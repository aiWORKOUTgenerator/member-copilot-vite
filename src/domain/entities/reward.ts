import { BaseEntity } from "./baseEntity";

/**
 * Reward types enumeration
 */
export enum RewardType {
  COUPON = "coupon",
  DISCOUNT = "discount",
  FREE_ITEM = "free_item",
  POINTS = "points",
  BADGE = "badge",
}

/**
 * Reward status enumeration
 */
export enum RewardStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  EXPIRED = "expired",
  EXHAUSTED = "exhausted", // When quantity limit is reached
}

/**
 * Reward trigger type enumeration
 */
export enum RewardTriggerType {
  PHONE_VERIFICATION = "phone_verification",
  WORKOUT_STREAK = "workout_streak",
  MILESTONE = "milestone",
  REFERRAL = "referral",
  FIRST_WORKOUT = "first_workout",
}

/**
 * Reward configuration interface
 */
export interface RewardConfig {
  trigger_type: RewardTriggerType;
  trigger_data: Record<string, unknown>; // e.g., { streak_days: 3, workout_type: "any" }
}

/**
 * Reward entity
 */
export class Reward extends BaseEntity<string> {
  constructor(
    id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly type: RewardType,
    public readonly value: string, // e.g., "20% off", "$5 smoothie", "Free protein bar"
    public readonly config: RewardConfig,
    public readonly status: RewardStatus = RewardStatus.ACTIVE,
    public readonly quantity_limit: number | null = null, // null = unlimited
    public readonly quantity_claimed: number = 0,
    public readonly expires_at: Date | null = null,
    public readonly created_at: Date = new Date(),
    public readonly updated_at: Date = new Date(),
    public readonly image_url: string | null = null,
    public readonly terms_and_conditions: string | null = null,
    public readonly redemption_instructions: string | null = null
  ) {
    super(id);
  }

  /**
   * Check if reward is available for claiming
   */
  isAvailable(): boolean {
    if (this.status !== RewardStatus.ACTIVE) {
      return false;
    }

    // Check if expired
    if (this.expires_at && this.expires_at < new Date()) {
      return false;
    }

    // Check if quantity exhausted
    if (
      this.quantity_limit !== null &&
      this.quantity_claimed >= this.quantity_limit
    ) {
      return false;
    }

    return true;
  }

  /**
   * Get remaining quantity
   */
  getRemainingQuantity(): number | null {
    if (this.quantity_limit === null) {
      return null; // Unlimited
    }
    return Math.max(0, this.quantity_limit - this.quantity_claimed);
  }

  /**
   * Get expiry status
   */
  getExpiryStatus(): { expired: boolean; days_until_expiry: number | null } {
    if (!this.expires_at) {
      return { expired: false, days_until_expiry: null };
    }

    const now = new Date();
    const expired = this.expires_at < now;
    const days_until_expiry = expired
      ? 0
      : Math.ceil(
          (this.expires_at.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

    return { expired, days_until_expiry };
  }
}

/**
 * User reward claim entity
 */
export class UserRewardClaim extends BaseEntity<string> {
  constructor(
    id: string,
    public readonly user_id: string,
    public readonly reward_id: string,
    public readonly claimed_at: Date = new Date(),
    public readonly redeemed_at: Date | null = null,
    public readonly expires_at: Date | null = null,
    public readonly coupon_code: string | null = null,
    public readonly redemption_data: Record<string, unknown> = {},
    public readonly trigger_event: Record<string, unknown> = {} // What triggered this reward
  ) {
    super(id);
  }

  /**
   * Check if claim is still valid (not expired and not redeemed)
   */
  isValid(): boolean {
    // Already redeemed
    if (this.redeemed_at) {
      return false;
    }

    // Check if expired
    if (this.expires_at && this.expires_at < new Date()) {
      return false;
    }

    return true;
  }

  /**
   * Mark as redeemed
   */
  markRedeemed(): UserRewardClaim {
    return new UserRewardClaim(
      this.id,
      this.user_id,
      this.reward_id,
      this.claimed_at,
      new Date(),
      this.expires_at,
      this.coupon_code,
      this.redemption_data,
      this.trigger_event
    );
  }
}

/**
 * Reward error types
 */
export enum RewardErrorType {
  REWARD_NOT_FOUND = "reward_not_found",
  REWARD_NOT_AVAILABLE = "reward_not_available",
  REWARD_EXPIRED = "reward_expired",
  REWARD_EXHAUSTED = "reward_exhausted",
  USER_NOT_ELIGIBLE = "user_not_eligible",
  ALREADY_CLAIMED = "already_claimed",
  CLAIM_NOT_FOUND = "claim_not_found",
  CLAIM_EXPIRED = "claim_expired",
  CLAIM_ALREADY_REDEEMED = "claim_already_redeemed",
  INVALID_COUPON_CODE = "invalid_coupon_code",
  NETWORK_ERROR = "network_error",
  UNKNOWN_ERROR = "unknown_error",
}

/**
 * Reward error class
 */
export class RewardError extends Error {
  public readonly type: RewardErrorType;
  public readonly details?: Record<string, unknown>;
  public readonly retryable: boolean;

  constructor(
    type: RewardErrorType,
    message: string,
    details?: Record<string, unknown>,
    retryable: boolean = false
  ) {
    super(message);
    this.name = "RewardError";
    this.type = type;
    this.details = details;
    this.retryable = retryable;
  }

  static rewardNotFound(rewardId: string): RewardError {
    return new RewardError(
      RewardErrorType.REWARD_NOT_FOUND,
      `Reward not found: ${rewardId}`,
      { rewardId }
    );
  }

  static rewardNotAvailable(rewardId: string, reason: string): RewardError {
    return new RewardError(
      RewardErrorType.REWARD_NOT_AVAILABLE,
      `Reward not available: ${reason}`,
      { rewardId, reason }
    );
  }

  static userNotEligible(
    userId: string,
    rewardId: string,
    reason: string
  ): RewardError {
    return new RewardError(
      RewardErrorType.USER_NOT_ELIGIBLE,
      `User not eligible for reward: ${reason}`,
      { userId, rewardId, reason }
    );
  }

  static alreadyClaimed(userId: string, rewardId: string): RewardError {
    return new RewardError(
      RewardErrorType.ALREADY_CLAIMED,
      "User has already claimed this reward",
      { userId, rewardId }
    );
  }

  static networkError(originalError?: Error): RewardError {
    return new RewardError(
      RewardErrorType.NETWORK_ERROR,
      "Network error occurred. Please try again.",
      { originalError: originalError?.message },
      true
    );
  }
}
