import { useApiService } from '@/hooks/useApiService';
import { PhoneVerificationService } from '@/domain/interfaces/services/PhoneVerificationService';
import {
  SendVerificationCodeRequest,
  SendVerificationCodeResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  ResendCodeRequest,
  ResendCodeResponse,
  PhoneVerificationSession,
  PhoneVerificationError,
  PhoneVerificationErrorType,
  PhoneNumberUtils,
  PHONE_VERIFICATION_CONSTANTS,
} from '@/domain/entities/phoneVerification';

/**
 * Actual API response format from Twilio backend for send verification
 */
interface TwilioSendApiResponse {
  message: string;
  status: string;
  to: string;
  channel: string;
}

/**
 * Actual API response format from Twilio backend for verify code
 */
interface TwilioVerifyApiResponse {
  message: string;
  status: string;
  verified_at: string | null;
  phone_number: string;
}

/**
 * Implementation of the PhoneVerificationService using API backend with Twilio
 */
export class PhoneVerificationServiceImpl implements PhoneVerificationService {
  private apiService: ReturnType<typeof useApiService>;
  private readonly baseEndpoint = '/members/phone-verification';

  constructor(apiService: ReturnType<typeof useApiService>) {
    this.apiService = apiService;
  }

  /**
   * Send a verification code to the specified phone number
   */
  async sendVerificationCode(
    request: SendVerificationCodeRequest
  ): Promise<SendVerificationCodeResponse> {
    try {
      // Validate phone number format before sending to backend
      if (!this.isValidPhoneNumber(request.phone_number)) {
        throw PhoneVerificationError.invalidPhoneNumber(request.phone_number);
      }

      // Format phone number to ensure consistent format
      const formattedPhone = this.formatPhoneNumber(
        request.phone_number,
        request.country_code
      );

      const apiResponse = await this.apiService.post<
        TwilioSendApiResponse,
        Record<string, unknown>
      >(`${this.baseEndpoint}/send/`, {
        phone_number: formattedPhone,
        country_code: request.country_code,
      });

      // Transform the API response to match our expected interface
      // API returns: { message, status, to, channel }
      // We need: { success, message, verification_id, expires_at, attempts_remaining, can_resend_at }
      console.log('API Response:', apiResponse);

      const response: SendVerificationCodeResponse = {
        success: apiResponse.status === 'pending',
        message: apiResponse.message,
        verification_id: apiResponse.to || formattedPhone, // Use phone number as ID if not provided
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now
        can_resend_at: new Date(Date.now() + 30 * 1000).toISOString(), // 30 seconds from now
      };

      console.log('Transformed Response:', response);

      return response;
    } catch (error) {
      console.error('Failed to send verification code:', error);
      throw new PhoneVerificationError(
        PhoneVerificationErrorType.UNKNOWN_ERROR,
        'Failed to send verification code. Please try again.'
      );
    }
  }

  /**
   * Verify a phone number using the provided verification code
   */
  async verifyCode(request: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    try {
      // Validate code format
      if (
        !request.code ||
        request.code.length !== PHONE_VERIFICATION_CONSTANTS.CODE_LENGTH
      ) {
        throw PhoneVerificationError.invalidCode();
      }

      // Validate phone number
      if (!this.isValidPhoneNumber(request.phone_number)) {
        throw PhoneVerificationError.invalidPhoneNumber(request.phone_number);
      }

      const apiResponse = await this.apiService.post<
        TwilioVerifyApiResponse,
        Record<string, unknown>
      >(`${this.baseEndpoint}/verify/`, {
        verification_id: request.verification_id,
        code: request.code,
        phone_number: this.formatPhoneNumber(request.phone_number),
      });

      // Transform the API response to match our expected interface
      // API returns: { message, status, verified_at, phone_number }
      // We need: { success, message, verified_at }
      console.log('Verify API Response:', apiResponse);

      const response: VerifyCodeResponse = {
        success:
          apiResponse.status === 'verified' ||
          apiResponse.message.includes('successfully verified'),
        message: apiResponse.message,
        verified_at: apiResponse.verified_at,
      };

      console.log('Transformed Verify Response:', response);

      return response;
    } catch (error) {
      console.error('Failed to verify code:', error);
      throw new PhoneVerificationError(
        PhoneVerificationErrorType.UNKNOWN_ERROR,
        'Failed to verify code. Please try again.'
      );
    }
  }

  /**
   * Resend verification code for an existing verification session
   */
  async resendCode(request: ResendCodeRequest): Promise<ResendCodeResponse> {
    try {
      // Validate phone number
      if (!this.isValidPhoneNumber(request.phone_number)) {
        throw PhoneVerificationError.invalidPhoneNumber(request.phone_number);
      }

      const response = await this.apiService.post<
        ResendCodeResponse,
        Record<string, unknown>
      >(`${this.baseEndpoint}/resend/`, {
        verification_id: request.verification_id,
        phone_number: this.formatPhoneNumber(request.phone_number),
      });

      return response;
    } catch (error) {
      console.error('Failed to resend verification code:', error);
      throw new PhoneVerificationError(
        PhoneVerificationErrorType.UNKNOWN_ERROR,
        'Failed to resend verification code. Please try again.'
      );
    }
  }

  /**
   * Get current verification session status
   */
  async getVerificationStatus(
    verificationId: string
  ): Promise<PhoneVerificationSession> {
    try {
      const response = await this.apiService.get<PhoneVerificationSession>(
        `${this.baseEndpoint}/status/${verificationId}`
      );

      return response;
    } catch (error) {
      console.error('Failed to get verification status:', error);
      throw new PhoneVerificationError(
        PhoneVerificationErrorType.UNKNOWN_ERROR,
        'Failed to get verification status. Please try again.'
      );
    }
  }

  /**
   * Check if a phone number is valid for sending verification
   */
  isValidPhoneNumber(phoneNumber: string): boolean {
    return PhoneNumberUtils.isValidPhoneNumber(phoneNumber);
  }

  /**
   * Format phone number to E.164 standard
   */
  formatPhoneNumber(phoneNumber: string, countryCode?: string): string {
    try {
      let formatted = PhoneNumberUtils.formatPhoneNumber(phoneNumber);

      // If no country code in the number and one is provided, add it
      if (countryCode && !formatted.startsWith('+')) {
        formatted = `+${countryCode}${formatted.replace(/^\+/, '')}`;
      }

      return formatted;
    } catch {
      throw PhoneVerificationError.invalidPhoneNumber(phoneNumber);
    }
  }
}
