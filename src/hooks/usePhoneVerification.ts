import { useContact } from "@/hooks/useContact";
import {
  PhoneVerificationError,
  PhoneVerificationErrorType,
  PhoneVerificationSession,
  PhoneVerificationStatus,
  ResendCodeRequest,
  SendVerificationCodeRequest,
  VerifyCodeRequest,
} from "@/domain/entities/phoneVerification";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePhoneVerificationService } from "./usePhoneVerificationService";

/**
 * Phone verification state interface
 */
export interface PhoneVerificationState {
  // Current verification session
  session: PhoneVerificationSession | null;

  // Loading states
  isLoading: boolean;
  isSending: boolean;
  isVerifying: boolean;
  isResending: boolean;

  // Error state
  error: PhoneVerificationError | null;

  // UI state
  showVerificationInput: boolean;
  resendCooldownSeconds: number;
  canResend: boolean;
}

/**
 * Phone verification actions interface
 */
export interface PhoneVerificationActions {
  sendCode: (phoneNumber: string, countryCode?: string) => Promise<void>;
  verifyCode: (code: string) => Promise<boolean>;
  resendCode: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
  startNewVerification: () => void;
}

/**
 * Combined hook return type
 */
export interface UsePhoneVerificationReturn extends PhoneVerificationState {
  actions: PhoneVerificationActions;
}

/**
 * Main hook for phone verification flow state management
 */
export function usePhoneVerification(): UsePhoneVerificationReturn {
  const phoneVerificationService = usePhoneVerificationService();
  const { refetch: refetchContact } = useContact();

  // State management
  const [session, setSession] = useState<PhoneVerificationSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<PhoneVerificationError | null>(null);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(0);

  // Refs for cleanup
  const cooldownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  // Computed values
  const canResend =
    resendCooldownSeconds === 0 && !isResending && session !== null;

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, []);

  // Start cooldown timer
  const startResendCooldown = useCallback((seconds: number) => {
    setResendCooldownSeconds(seconds);

    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current);
    }

    cooldownIntervalRef.current = setInterval(() => {
      setResendCooldownSeconds((prev) => {
        if (prev <= 1) {
          if (cooldownIntervalRef.current) {
            clearInterval(cooldownIntervalRef.current);
            cooldownIntervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Send verification code
  const sendCode = useCallback(
    async (phoneNumber: string, countryCode?: string) => {
      try {
        setIsSending(true);
        setError(null);

        const request: SendVerificationCodeRequest = {
          phone_number: phoneNumber,
          country_code: countryCode,
        };

        const response =
          await phoneVerificationService.sendVerificationCode(request);

        if (response.success) {
          // Create session from response
          const newSession: PhoneVerificationSession = {
            verification_id: response.verification_id,
            phone_number: phoneNumber,
            status: PhoneVerificationStatus.PENDING,
            attempts_made: 0,
            expires_at: response.expires_at,
            can_resend_at: response.can_resend_at,
            last_error: null,
          };

          setSession(newSession);
          setShowVerificationInput(true);

          // Start resend cooldown
          const cooldownTime =
            new Date(response.can_resend_at).getTime() - Date.now();
          if (cooldownTime > 0) {
            startResendCooldown(Math.ceil(cooldownTime / 1000));
          }
        }
      } catch (err) {
        const error =
          err instanceof PhoneVerificationError
            ? err
            : new PhoneVerificationError(
                "unknown_error" as PhoneVerificationErrorType,
                "Failed to send verification code"
              );
        setError(error);
      } finally {
        setIsSending(false);
      }
    },
    [phoneVerificationService, startResendCooldown]
  );

  // Verify code
  const verifyCode = useCallback(
    async (code: string): Promise<boolean> => {
      if (!session) {
        setError(
          new PhoneVerificationError(
            "verification_not_found" as PhoneVerificationErrorType,
            "No active verification session"
          )
        );
        return false;
      }

      try {
        setIsVerifying(true);
        setError(null);

        const request: VerifyCodeRequest = {
          verification_id: session.verification_id!,
          code: code,
          phone_number: session.phone_number!,
        };

        const response = await phoneVerificationService.verifyCode(request);

        if (response.success) {
          // Update session status
          const updatedSession: PhoneVerificationSession = {
            ...session,
            status: PhoneVerificationStatus.VERIFIED,
            last_error: null,
          };

          setSession(updatedSession);
          setShowVerificationInput(false);

          // Refetch contact to get updated verification status
          await refetchContact();

          return true;
        } else {
          // Update attempts made
          const updatedSession: PhoneVerificationSession = {
            ...session,
            attempts_made: session.attempts_made + 1,
            last_error: response.message,
          };

          setSession(updatedSession);

          setError(PhoneVerificationError.invalidCode());

          return false;
        }
      } catch (err) {
        const error =
          err instanceof PhoneVerificationError
            ? err
            : new PhoneVerificationError(
                "unknown_error" as PhoneVerificationErrorType,
                "Failed to verify code"
              );
        setError(error);

        if (session) {
          const updatedSession: PhoneVerificationSession = {
            ...session,
            attempts_made: session.attempts_made + 1,
            last_error: error.message,
          };
          setSession(updatedSession);
        }

        return false;
      } finally {
        setIsVerifying(false);
      }
    },
    [session, phoneVerificationService, refetchContact]
  );

  // Resend code
  const resendCode = useCallback(async () => {
    if (!session) {
      setError(
        new PhoneVerificationError(
          "verification_not_found" as PhoneVerificationErrorType,
          "No active verification session"
        )
      );
      return;
    }

    try {
      setIsResending(true);
      setError(null);

      const request: ResendCodeRequest = {
        verification_id: session.verification_id!,
        phone_number: session.phone_number!,
      };

      const response = await phoneVerificationService.resendCode(request);

      if (response.success) {
        // Update session with new details
        const updatedSession: PhoneVerificationSession = {
          ...session,
          verification_id: response.verification_id,
          expires_at: response.expires_at,
          can_resend_at: response.can_resend_at,
          last_error: null,
        };

        setSession(updatedSession);

        // Restart resend cooldown
        const cooldownTime =
          new Date(response.can_resend_at).getTime() - Date.now();
        if (cooldownTime > 0) {
          startResendCooldown(Math.ceil(cooldownTime / 1000));
        }
      }
    } catch (err) {
      const error =
        err instanceof PhoneVerificationError
          ? err
          : new PhoneVerificationError(
              "unknown_error" as PhoneVerificationErrorType,
              "Failed to resend verification code"
            );
      setError(error);
    } finally {
      setIsResending(false);
    }
  }, [session, phoneVerificationService, startResendCooldown]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset entire state
  const reset = useCallback(() => {
    setSession(null);
    setError(null);
    setShowVerificationInput(false);
    setResendCooldownSeconds(0);
    setIsLoading(false);
    setIsSending(false);
    setIsVerifying(false);
    setIsResending(false);

    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current);
      cooldownIntervalRef.current = null;
    }
  }, []);

  // Start new verification (clears current session)
  const startNewVerification = useCallback(() => {
    reset();
  }, [reset]);

  // Actions object
  const actions: PhoneVerificationActions = {
    sendCode,
    verifyCode,
    resendCode,
    clearError,
    reset,
    startNewVerification,
  };

  return {
    // State
    session,
    isLoading,
    isSending,
    isVerifying,
    isResending,
    error,
    showVerificationInput,
    resendCooldownSeconds,
    canResend,

    // Actions
    actions,
  };
}

/**
 * Hook for sending verification codes
 */
export function usePhoneVerificationSend() {
  const phoneVerificationService = usePhoneVerificationService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<PhoneVerificationError | null>(null);

  const sendCode = useCallback(
    async (phoneNumber: string, countryCode?: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const request: SendVerificationCodeRequest = {
          phone_number: phoneNumber,
          country_code: countryCode,
        };

        const response =
          await phoneVerificationService.sendVerificationCode(request);
        return response;
      } catch (err) {
        const error =
          err instanceof PhoneVerificationError
            ? err
            : new PhoneVerificationError(
                "unknown_error" as PhoneVerificationErrorType,
                "Failed to send verification code"
              );
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [phoneVerificationService]
  );

  return {
    sendCode,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

/**
 * Hook for verifying codes
 */
export function usePhoneVerificationVerify() {
  const phoneVerificationService = usePhoneVerificationService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<PhoneVerificationError | null>(null);

  const verifyCode = useCallback(
    async (verificationId: string, code: string, phoneNumber: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const request: VerifyCodeRequest = {
          verification_id: verificationId,
          code,
          phone_number: phoneNumber,
        };

        const response = await phoneVerificationService.verifyCode(request);
        return response;
      } catch (err) {
        const error =
          err instanceof PhoneVerificationError
            ? err
            : new PhoneVerificationError(
                "unknown_error" as PhoneVerificationErrorType,
                "Failed to verify code"
              );
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [phoneVerificationService]
  );

  return {
    verifyCode,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
