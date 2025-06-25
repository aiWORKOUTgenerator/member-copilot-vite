import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RewardBadge } from "./RewardBadge";
import { RewardType, RewardStatus } from "@/domain/entities/reward";

describe("RewardBadge", () => {
  describe("status badges", () => {
    it("should render active status badge", () => {
      render(<RewardBadge type="status" status={RewardStatus.ACTIVE} />);
      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("should render expired status badge", () => {
      render(<RewardBadge type="status" status={RewardStatus.EXPIRED} />);
      expect(screen.getByText("Expired")).toBeInTheDocument();
    });
  });

  describe("type badges", () => {
    it("should render coupon type badge", () => {
      render(<RewardBadge type="type" rewardType={RewardType.COUPON} />);
      expect(screen.getByText("Coupon")).toBeInTheDocument();
    });

    it("should render free item type badge", () => {
      render(<RewardBadge type="type" rewardType={RewardType.FREE_ITEM} />);
      expect(screen.getByText("Free Item")).toBeInTheDocument();
    });
  });

  describe("value badges", () => {
    it("should render value badge", () => {
      render(<RewardBadge type="value" value="10% off smoothie" />);
      expect(screen.getByText("10% off smoothie")).toBeInTheDocument();
    });
  });

  it("should apply custom className", () => {
    const { container } = render(
      <RewardBadge
        type="status"
        status={RewardStatus.ACTIVE}
        className="custom-class"
      />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
