import { useIsPhoneVerified, usePhoneVerificationStatus } from "@/hooks";
import React, { forwardRef, useCallback, useState } from "react";
import PhoneInput, {
  formatPhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";

export interface PhoneNumberInputProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  showVerificationStatus?: boolean;
  onVerifyClick?: () => void;
  id?: string;
  name?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

/**
 * Phone number input component with formatting, validation, and verification status
 */
export const PhoneNumberInput = forwardRef<
  HTMLInputElement,
  PhoneNumberInputProps
>(
  (
    {
      value,
      onChange,
      onBlur,
      placeholder = "Enter phone number",
      disabled = false,
      required = false,
      error,
      className = "",
      showVerificationStatus = true,
      onVerifyClick,
      id,
      name,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const isPhoneVerified = useIsPhoneVerified();
    const { status } = usePhoneVerificationStatus();

    // Validation state
    const isValid = value ? isValidPhoneNumber(value) : true;
    const showError = error || (!isValid && value && !isFocused);

    // Handle phone number change
    const handleChange = useCallback(
      (phoneValue: string | undefined) => {
        onChange?.(phoneValue);
      },
      [onChange]
    );

    // Handle focus states
    const handleFocus = useCallback(() => {
      setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      onBlur?.();
    }, [onBlur]);

    // Get verification status styling
    const getVerificationStatusStyles = () => {
      if (!showVerificationStatus || !value) return "";

      switch (status) {
        case "verified":
          return "border-green-500 focus:border-green-500";
        case "pending":
          return "border-yellow-500 focus:border-yellow-500";
        default:
          return "";
      }
    };

    // Get verification badge
    const getVerificationBadge = () => {
      if (!showVerificationStatus || !value) return null;

      switch (status) {
        case "verified":
          return (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Verified</span>
            </div>
          );
        case "pending":
          return (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-yellow-600 text-sm">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Not verified</span>
              </div>
              {onVerifyClick && (
                <button
                  type="button"
                  onClick={onVerifyClick}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Verify
                </button>
              )}
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="space-y-2">
        <div className="relative">
          <PhoneInput
            ref={ref}
            id={id}
            name={name}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`
              w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-200
              ${
                showError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : getVerificationStatusStyles() ||
                    "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }
              ${disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white"}
              ${className}
            `}
            aria-label={ariaLabel || "Phone number"}
            aria-describedby={ariaDescribedBy}
            aria-invalid={showError ? "true" : "false"}
            aria-required={required}
            international
            countryCallingCodeEditable
            defaultCountry="US"
          />
        </div>

        {/* Error message */}
        {showError && (
          <p className="text-red-600 text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error || "Please enter a valid phone number"}
          </p>
        )}

        {/* Verification status badge */}
        {getVerificationBadge()}
      </div>
    );
  }
);

PhoneNumberInput.displayName = "PhoneNumberInput";

/**
 * Simple phone number display component with formatting
 */
export interface PhoneNumberDisplayProps {
  phoneNumber: string;
  showVerificationStatus?: boolean;
  className?: string;
  format?: "international" | "national";
  maskNumber?: boolean;
}

export function PhoneNumberDisplay({
  phoneNumber,
  showVerificationStatus = true,
  className = "",
  format = "international",
  maskNumber = false,
}: PhoneNumberDisplayProps) {
  const isPhoneVerified = useIsPhoneVerified();
  const { status } = usePhoneVerificationStatus();

  if (!phoneNumber) {
    return (
      <span className={`text-gray-500 ${className}`}>No phone number</span>
    );
  }

  // Format the phone number
  const formattedNumber = React.useMemo(() => {
    try {
      if (maskNumber) {
        // Simple masking: show first 3 and last 4 digits
        const cleaned = phoneNumber.replace(/\D/g, "");
        if (cleaned.length > 7) {
          const start = cleaned.slice(0, 3);
          const end = cleaned.slice(-4);
          const middle = "*".repeat(cleaned.length - 7);
          return `+${start}${middle}${end}`;
        }
      }

      return formatPhoneNumber(phoneNumber, format.toUpperCase() as any);
    } catch {
      return phoneNumber;
    }
  }, [phoneNumber, format, maskNumber]);

  // Get verification status icon
  const getStatusIcon = () => {
    if (!showVerificationStatus) return null;

    switch (status) {
      case "verified":
        return (
          <svg
            className="w-4 h-4 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "pending":
        return (
          <svg
            className="w-4 h-4 text-yellow-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span>{formattedNumber}</span>
      {getStatusIcon()}
      {showVerificationStatus && status === "verified" && (
        <span className="text-green-600 text-sm">Verified</span>
      )}
    </div>
  );
}
