import { useMemo } from "react";
import { useContact } from "@/hooks/useContact";
import { PhoneNumberUtils } from "@/domain/entities/phoneVerification";

/**
 * Hook for phone number utilities and validation
 */
export function usePhoneNumber(phoneNumber?: string) {
  const { contact } = useContact();

  // Use provided phone number or fall back to contact's phone number
  const currentPhoneNumber = phoneNumber || contact?.phone_number || "";

  // Memoized phone number utilities
  const phoneNumberData = useMemo(() => {
    if (!currentPhoneNumber) {
      return {
        isValid: false,
        formatted: "",
        masked: "",
        countryCode: null,
        e164: "",
      };
    }

    return {
      isValid: PhoneNumberUtils.isValidPhoneNumber(currentPhoneNumber),
      formatted: PhoneNumberUtils.formatPhoneNumber(currentPhoneNumber),
      masked: PhoneNumberUtils.maskPhoneNumber(currentPhoneNumber),
      countryCode: PhoneNumberUtils.extractCountryCode(currentPhoneNumber),
      e164: PhoneNumberUtils.formatPhoneNumber(currentPhoneNumber),
    };
  }, [currentPhoneNumber]);

  return {
    phoneNumber: currentPhoneNumber,
    ...phoneNumberData,
  };
}

/**
 * Hook to check if the current contact's phone is verified
 */
export function useIsPhoneVerified(): boolean {
  const { contact } = useContact();

  return useMemo(() => {
    return (
      contact?.phone_verified_at !== null &&
      contact?.phone_verified_at !== undefined
    );
  }, [contact?.phone_verified_at]);
}

/**
 * Hook to get the phone verification date
 */
export function usePhoneVerificationDate(): Date | null {
  const { contact } = useContact();

  return useMemo(() => {
    if (!contact?.phone_verified_at) {
      return null;
    }

    try {
      return new Date(contact.phone_verified_at);
    } catch {
      return null;
    }
  }, [contact?.phone_verified_at]);
}

/**
 * Hook to get phone verification status information
 */
export function usePhoneVerificationStatus() {
  const { contact } = useContact();
  const isVerified = useIsPhoneVerified();
  const verificationDate = usePhoneVerificationDate();

  return useMemo(() => {
    const hasPhoneNumber = Boolean(contact?.phone_number);

    return {
      hasPhoneNumber,
      isVerified,
      verificationDate,
      isPending: hasPhoneNumber && !isVerified,
      canVerify: hasPhoneNumber && !isVerified,
      status: isVerified
        ? "verified"
        : hasPhoneNumber
          ? "pending"
          : "not_provided",
    };
  }, [contact?.phone_number, isVerified, verificationDate]);
}
