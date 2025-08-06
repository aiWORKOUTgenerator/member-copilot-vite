import {
  SendVerificationCodeRequest,
  SendVerificationCodeResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  ResendCodeRequest,
  ResendCodeResponse,
  PhoneVerificationSession,
} from '@/domain/entities/phoneVerification';

/**
 * PhoneVerificationService interface defines operations for phone number verification.
 * This service encapsulates logic related to sending verification codes via SMS
 * and verifying phone numbers using Twilio or similar services.
 */
export interface PhoneVerificationService {
  /**
   * Send a verification code to the specified phone number
   * @param request - Phone number and optional country code
   * @returns Promise resolving to verification response with session details
   */
  sendVerificationCode(
    request: SendVerificationCodeRequest
  ): Promise<SendVerificationCodeResponse>;

  /**
   * Verify a phone number using the provided verification code
   * @param request - Verification ID, code, and phone number
   * @returns Promise resolving to verification result
   */
  verifyCode(request: VerifyCodeRequest): Promise<VerifyCodeResponse>;

  /**
   * Resend verification code for an existing verification session
   * @param request - Verification ID and phone number
   * @returns Promise resolving to resend response with new session details
   */
  resendCode(request: ResendCodeRequest): Promise<ResendCodeResponse>;

  /**
   * Get current verification session status
   * @param verificationId - The verification session ID
   * @returns Promise resolving to current session state
   */
  getVerificationStatus(
    verificationId: string
  ): Promise<PhoneVerificationSession>;

  /**
   * Check if a phone number is valid for sending verification
   * @param phoneNumber - Phone number to validate
   * @returns True if phone number is valid and can receive SMS
   */
  isValidPhoneNumber(phoneNumber: string): boolean;

  /**
   * Format phone number to E.164 standard
   * @param phoneNumber - Phone number to format
   * @param countryCode - Optional country code if not in phone number
   * @returns Formatted phone number in E.164 format
   */
  formatPhoneNumber(phoneNumber: string, countryCode?: string): string;
}
