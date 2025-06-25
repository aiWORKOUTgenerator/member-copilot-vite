import { describe, it, expect } from "vitest";
import {
  useRewards,
  useRewardClaiming,
  useRewardRedemption,
  useRewardProgress,
  useRewardTriggers,
  useRewardFilters,
} from "./useRewards";

describe("Reward Hooks Exports", () => {
  it("should export all reward hooks", () => {
    expect(useRewards).toBeDefined();
    expect(useRewardClaiming).toBeDefined();
    expect(useRewardRedemption).toBeDefined();
    expect(useRewardProgress).toBeDefined();
    expect(useRewardTriggers).toBeDefined();
    expect(useRewardFilters).toBeDefined();

    expect(typeof useRewards).toBe("function");
    expect(typeof useRewardClaiming).toBe("function");
    expect(typeof useRewardRedemption).toBe("function");
    expect(typeof useRewardProgress).toBe("function");
    expect(typeof useRewardTriggers).toBe("function");
    expect(typeof useRewardFilters).toBe("function");
  });
});
