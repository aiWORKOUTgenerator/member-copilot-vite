/**
 * Phone verification domain types and interfaces
 */

/**
 * Phone verification status enumeration
 */
export enum PhoneVerificationStatus {
  NOT_VERIFIED = 'not_verified',
  PENDING = 'pending',
  VERIFIED = 'verified',
  EXPIRED = 'expired',
  FAILED = 'failed',
}

/**
 * Phone verification constants
 */
export const PHONE_VERIFICATION_CONSTANTS = {
  CODE_LENGTH: 6,
  CODE_EXPIRY_MINUTES: 10,
  MAX_ATTEMPTS: 3,
  RESEND_COOLDOWN_SECONDS: 60,
  RATE_LIMIT_ATTEMPTS: 5,
  RATE_LIMIT_WINDOW_MINUTES: 60,
} as const;

/**
 * Request payload for sending verification code
 */
export interface SendVerificationCodeRequest {
  phone_number: string;
  country_code?: string;
}

/**
 * Response payload for sending verification code
 */
export interface SendVerificationCodeResponse {
  success: boolean;
  message: string;
  verification_id: string;
  expires_at: string;
  can_resend_at: string;
}

/**
 * Request payload for verifying code
 */
export interface VerifyCodeRequest {
  verification_id: string;
  code: string;
  phone_number: string;
}

/**
 * Response payload for verifying code
 */
export interface VerifyCodeResponse {
  success: boolean;
  message: string;
  verified_at: string | null;
}

/**
 * Request payload for resending verification code
 */
export interface ResendCodeRequest {
  verification_id: string;
  phone_number: string;
}

/**
 * Response payload for resending verification code
 */
export interface ResendCodeResponse {
  success: boolean;
  message: string;
  verification_id: string;
  expires_at: string;
  can_resend_at: string;
}

/**
 * Phone verification session state
 */
export interface PhoneVerificationSession {
  verification_id: string | null;
  phone_number: string | null;
  status: PhoneVerificationStatus;
  attempts_made: number;
  expires_at: string | null;
  can_resend_at: string | null;
  last_error: string | null;
}

/**
 * Phone verification error types
 */
export enum PhoneVerificationErrorType {
  INVALID_PHONE_NUMBER = 'invalid_phone_number',
  INVALID_CODE = 'invalid_code',
  CODE_EXPIRED = 'code_expired',
  MAX_ATTEMPTS_REACHED = 'max_attempts_reached',
  RATE_LIMITED = 'rate_limited',
  NETWORK_ERROR = 'network_error',
  SERVICE_UNAVAILABLE = 'service_unavailable',
  VERIFICATION_NOT_FOUND = 'verification_not_found',
  PHONE_ALREADY_VERIFIED = 'phone_already_verified',
  UNKNOWN_ERROR = 'unknown_error',
}

/**
 * Phone verification error class
 */
export class PhoneVerificationError extends Error {
  public readonly type: PhoneVerificationErrorType;
  public readonly details?: Record<string, unknown>;
  public readonly retryable: boolean;

  constructor(
    type: PhoneVerificationErrorType,
    message: string,
    details?: Record<string, unknown>,
    retryable: boolean = false
  ) {
    super(message);
    this.name = 'PhoneVerificationError';
    this.type = type;
    this.details = details;
    this.retryable = retryable;
  }

  /**
   * Create error for invalid phone number
   */
  static invalidPhoneNumber(phone: string): PhoneVerificationError {
    return new PhoneVerificationError(
      PhoneVerificationErrorType.INVALID_PHONE_NUMBER,
      `Invalid phone number format: ${phone}`,
      { phone }
    );
  }

  /**
   * Create error for invalid verification code
   */
  static invalidCode(): PhoneVerificationError {
    return new PhoneVerificationError(
      PhoneVerificationErrorType.INVALID_CODE,
      `Invalid verification code`,
      undefined,
      true
    );
  }

  /**
   * Create error for expired verification code
   */
  static codeExpired(): PhoneVerificationError {
    return new PhoneVerificationError(
      PhoneVerificationErrorType.CODE_EXPIRED,
      'Verification code has expired. Please request a new code.'
    );
  }

  /**
   * Create error for maximum attempts reached
   */
  static maxAttemptsReached(): PhoneVerificationError {
    return new PhoneVerificationError(
      PhoneVerificationErrorType.MAX_ATTEMPTS_REACHED,
      'Maximum verification attempts reached. Please request a new code.'
    );
  }

  /**
   * Create error for rate limiting
   */
  static rateLimited(retryAfter: number): PhoneVerificationError {
    return new PhoneVerificationError(
      PhoneVerificationErrorType.RATE_LIMITED,
      `Too many attempts. Please try again in ${retryAfter} seconds.`,
      { retryAfter },
      true
    );
  }

  /**
   * Create error for network issues
   */
  static networkError(originalError?: Error): PhoneVerificationError {
    return new PhoneVerificationError(
      PhoneVerificationErrorType.NETWORK_ERROR,
      'Network error occurred. Please check your connection and try again.',
      { originalError: originalError?.message },
      true
    );
  }

  /**
   * Create error for service unavailable
   */
  static serviceUnavailable(): PhoneVerificationError {
    return new PhoneVerificationError(
      PhoneVerificationErrorType.SERVICE_UNAVAILABLE,
      'Phone verification service is currently unavailable. Please try again later.',
      undefined,
      true
    );
  }
}

/**
 * Phone number validation utilities
 */
export const PhoneNumberUtils = {
  /**
   * Basic phone number validation (E.164 format)
   */
  isValidPhoneNumber(phone: string): boolean {
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phone);
  },

  /**
   * Format phone number for display
   */
  formatPhoneNumber(phone: string): string {
    // Remove all non-digits except the leading +
    const cleaned = phone.replace(/[^\d+]/g, '');

    // If it doesn't start with +, add it
    if (!cleaned.startsWith('+')) {
      return `+${cleaned}`;
    }

    return cleaned;
  },

  /**
   * Extract country code from phone number
   */
  extractCountryCode(phone: string): string | null {
    const match = phone.match(/^\+(\d{1,3})/);
    return match ? match[1] : null;
  },

  /**
   * Mask phone number for display (e.g., +1***-***-1234)
   */
  maskPhoneNumber(phone: string): string {
    if (phone.length < 4) return phone;

    const last4 = phone.slice(-4);
    const masked = '*'.repeat(Math.max(0, phone.length - 4));

    return `${phone.slice(0, 2)}${masked.slice(2)}${last4}`;
  },
};

/**
 * Type guards for phone verification types
 */
export const PhoneVerificationTypeGuards = {
  isVerificationSession(obj: unknown): obj is PhoneVerificationSession {
    return (
      obj !== null &&
      typeof obj === 'object' &&
      'verification_id' in obj &&
      'phone_number' in obj &&
      'status' in obj &&
      'attempts_made' in obj &&
      'expires_at' in obj &&
      'can_resend_at' in obj &&
      'last_error' in obj
    );
  },

  isPhoneVerificationError(obj: unknown): obj is PhoneVerificationError {
    return obj instanceof PhoneVerificationError;
  },
};
