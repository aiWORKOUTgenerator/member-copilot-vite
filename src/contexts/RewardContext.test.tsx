import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { render, renderHook, act, waitFor } from "@testing-library/react";
import { useUser } from "@clerk/clerk-react";
import { RewardProvider, useRewardContext } from "./RewardContext";
import { useRewardService } from "./ServiceContext";
import { RewardServiceImpl } from "@/services/rewards/RewardServiceImpl";
import { RewardTriggerType } from "@/domain/entities/reward";
import { ClaimRewardResponse } from "@/domain/interfaces/services/RewardService";

// Mock dependencies
vi.mock("@clerk/clerk-react");
vi.mock("./ServiceContext");

const mockUser = {
  id: "test-user-123",
};

const mockRewardService = new RewardServiceImpl();

describe("RewardContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useUser as Mock).mockReturnValue({ user: mockUser });
    (useRewardService as Mock).mockReturnValue(mockRewardService);
  });

  const renderWithProvider = (children: React.ReactNode) => {
    return render(<RewardProvider>{children}</RewardProvider>);
  };

  const renderHookWithProvider = <T,>(hook: () => T) => {
    return renderHook(hook, {
      wrapper: ({ children }) => <RewardProvider>{children}</RewardProvider>,
    });
  };

  describe("RewardProvider", () => {
    it("should render children without crashing", () => {
      const { container } = renderWithProvider(<div>Test content</div>);
      expect(container.textContent).toBe("Test content");
    });

    it("should throw error when useRewardContext is used outside provider", () => {
      expect(() => {
        renderHook(() => useRewardContext());
      }).toThrow("useRewardContext must be used within a RewardProvider");
    });
  });

  describe("useRewardContext", () => {
    it("should provide initial state", async () => {
      const { result } = renderHookWithProvider(() => useRewardContext());

      await waitFor(() => {
        expect(result.current.rewards).toEqual([]);
        expect(result.current.userClaims).toEqual([]);
        expect(result.current.activeClaims).toEqual([]);
        expect(result.current.rewardProgress).toEqual([]);
        expect(result.current.rewardSummary).toBe(null);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isClaimingReward).toBe(false);
        expect(result.current.isRedeemingClaim).toBe(false);
        expect(result.current.error).toBe(null);
        expect(result.current.claimError).toBe(null);
      });
    });

    it("should load data when user is present", async () => {
      const { result } = renderHookWithProvider(() => useRewardContext());

      await waitFor(() => {
        expect(result.current.rewards).toHaveLength(3); // Sample rewards from RewardServiceImpl
      });
    });

    it("should clear data when user logs out", async () => {
      const { result, rerender } = renderHookWithProvider(() =>
        useRewardContext()
      );

      // Wait for initial data load
      await waitFor(() => {
        expect(result.current.rewards).toHaveLength(3);
      });

      // Mock user logout
      (useUser as Mock).mockReturnValue({ user: null });
      rerender();

      await waitFor(() => {
        expect(result.current.rewards).toEqual([]);
        expect(result.current.userClaims).toEqual([]);
        expect(result.current.activeClaims).toEqual([]);
        expect(result.current.rewardSummary).toBe(null);
      });
    });

    describe("claimReward", () => {
      it("should claim reward successfully", async () => {
        // Set up user progress to make them eligible
        mockRewardService.setUserProgress(mockUser.id, { phone_verified: 1 });

        const { result } = renderHookWithProvider(() => useRewardContext());

        let claimResponse: ClaimRewardResponse | null = null;
        await act(async () => {
          claimResponse = await result.current.claimReward(
            "phone-verification-reward"
          );
        });

        expect(claimResponse).toBeTruthy();
        expect(claimResponse!.success).toBe(true);
        expect(claimResponse!.claim.reward_id).toBe(
          "phone-verification-reward"
        );
      });

      it("should handle claim error when user not eligible", async () => {
        const { result } = renderHookWithProvider(() => useRewardContext());

        let claimResponse: ClaimRewardResponse | null = null;
        await act(async () => {
          claimResponse = await result.current.claimReward(
            "phone-verification-reward"
          );
        });

        expect(claimResponse).toBe(null);
        expect(result.current.claimError).toBeTruthy();
      });

      it("should set error when user not authenticated", async () => {
        (useUser as Mock).mockReturnValue({ user: null });

        const { result } = renderHookWithProvider(() => useRewardContext());

        let claimResponse: ClaimRewardResponse | null = null;
        await act(async () => {
          claimResponse = await result.current.claimReward(
            "phone-verification-reward"
          );
        });

        expect(claimResponse).toBe(null);
        expect(result.current.claimError).toBe("User not authenticated");
      });
    });

    describe("redeemClaim", () => {
      it("should redeem claim successfully", async () => {
        // Set up user progress and claim a reward first
        mockRewardService.setUserProgress(mockUser.id, { phone_verified: 1 });

        const { result } = renderHookWithProvider(() => useRewardContext());

        let claimResponse: ClaimRewardResponse | null = null;
        await act(async () => {
          claimResponse = await result.current.claimReward(
            "phone-verification-reward"
          );
        });

        const claimId = claimResponse!.claim.id;

        let redeemResult = false;
        await act(async () => {
          redeemResult = await result.current.redeemClaim(claimId);
        });

        expect(redeemResult).toBe(true);
      });

      it("should handle redeem error for non-existent claim", async () => {
        const { result } = renderHookWithProvider(() => useRewardContext());

        let redeemResult = false;
        await act(async () => {
          redeemResult = await result.current.redeemClaim("non-existent-claim");
        });

        expect(redeemResult).toBe(false);
        expect(result.current.error).toBeTruthy();
      });
    });

    describe("triggerRewardCheck", () => {
      it("should trigger phone verification reward", async () => {
        const { result } = renderHookWithProvider(() => useRewardContext());

        let triggeredRewards: ClaimRewardResponse[] = [];
        await act(async () => {
          triggeredRewards = await result.current.triggerRewardCheck(
            RewardTriggerType.PHONE_VERIFICATION
          );
        });

        expect(triggeredRewards).toHaveLength(1);
        expect(triggeredRewards[0].claim.reward_id).toBe(
          "phone-verification-reward"
        );
      });

      it("should return empty array when user not authenticated", async () => {
        (useUser as Mock).mockReturnValue({ user: null });

        const { result } = renderHookWithProvider(() => useRewardContext());

        let triggeredRewards: ClaimRewardResponse[] = [];
        await act(async () => {
          triggeredRewards = await result.current.triggerRewardCheck(
            RewardTriggerType.PHONE_VERIFICATION
          );
        });

        expect(triggeredRewards).toEqual([]);
      });
    });

    describe("validateCouponCode", () => {
      it("should validate valid coupon code", async () => {
        // Set up user progress and claim a reward first
        mockRewardService.setUserProgress(mockUser.id, { phone_verified: 1 });

        const { result } = renderHookWithProvider(() => useRewardContext());

        let claimResponse: ClaimRewardResponse | null = null;
        await act(async () => {
          claimResponse = await result.current.claimReward(
            "phone-verification-reward"
          );
        });

        const couponCode = claimResponse!.claim.coupon_code!;

        let validationResult: {
          valid: boolean;
          claim?: any;
          reward?: any;
          message: string;
        } | null = null;
        await act(async () => {
          validationResult = await result.current.validateCouponCode(
            couponCode
          );
        });

        expect(validationResult!.valid).toBe(true);
        expect(validationResult!.claim?.id).toBe(claimResponse!.claim.id);
      });

      it("should handle invalid coupon code", async () => {
        const { result } = renderHookWithProvider(() => useRewardContext());

        let validationResult: {
          valid: boolean;
          claim?: any;
          reward?: any;
          message: string;
        } | null = null;
        await act(async () => {
          validationResult = await result.current.validateCouponCode(
            "INVALID123"
          );
        });

        expect(validationResult!.valid).toBe(false);
        expect(validationResult!.message).toContain("Invalid coupon code");
      });
    });

    describe("refreshRewards", () => {
      it("should refresh rewards list", async () => {
        const { result } = renderHookWithProvider(() => useRewardContext());

        await act(async () => {
          await result.current.refreshRewards();
        });

        expect(result.current.rewards).toHaveLength(3);
      });
    });

    describe("clearErrors", () => {
      it("should clear all error states", async () => {
        const { result } = renderHookWithProvider(() => useRewardContext());

        // Trigger an error first
        await act(async () => {
          await result.current.claimReward("phone-verification-reward");
        });

        expect(result.current.claimError).toBeTruthy();

        // Clear errors
        await act(async () => {
          result.current.clearErrors();
        });

        expect(result.current.error).toBe(null);
        expect(result.current.claimError).toBe(null);
      });
    });
  });
});
