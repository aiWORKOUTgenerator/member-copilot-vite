import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { usePhoneVerification } from "@/hooks/usePhoneVerification";

// Mock the dependencies
vi.mock("@/hooks/useContact", () => ({
  useContact: () => ({
    refetch: vi.fn(),
  }),
}));

vi.mock("@/hooks/usePhoneVerificationService", () => ({
  usePhoneVerificationService: () => ({
    sendVerificationCode: vi.fn(),
    verifyCode: vi.fn(),
    resendCode: vi.fn(),
  }),
}));

describe("usePhoneVerification", () => {
  it("should return verification state", () => {
    const { result } = renderHook(() => usePhoneVerification());

    expect(result.current).toBeDefined();
    expect(result.current.session).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.actions).toBeDefined();
  });

  it("should have all required actions", () => {
    const { result } = renderHook(() => usePhoneVerification());

    expect(result.current.actions.sendCode).toBeDefined();
    expect(result.current.actions.verifyCode).toBeDefined();
    expect(result.current.actions.resendCode).toBeDefined();
    expect(result.current.actions.clearError).toBeDefined();
    expect(result.current.actions.reset).toBeDefined();
    expect(result.current.actions.startNewVerification).toBeDefined();
  });

  it("should have proper initial state", () => {
    const { result } = renderHook(() => usePhoneVerification());

    expect(result.current.isSending).toBe(false);
    expect(result.current.isVerifying).toBe(false);
    expect(result.current.isResending).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.showVerificationInput).toBe(false);
    expect(result.current.resendCooldownSeconds).toBe(0);
    expect(result.current.canResend).toBe(false);
  });
});
