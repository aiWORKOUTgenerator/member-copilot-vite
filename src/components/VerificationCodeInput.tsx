import React, { useCallback, forwardRef } from "react";
import OtpInput from "react-otp-input";
import { PHONE_VERIFICATION_CONSTANTS } from "@/domain/entities/phoneVerification";

export interface VerificationCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (code: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  id?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

/**
 * Verification code input component with individual digit boxes
 */
export const VerificationCodeInput = forwardRef<
  HTMLDivElement,
  VerificationCodeInputProps
>(
  (
    {
      value,
      onChange,
      onComplete,
      disabled = false,
      error,
      className = "",
      placeholder = "Enter verification code",
      autoFocus = true,
      id,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
    },
    ref,
  ) => {
    // Handle value change
    const handleChange = useCallback(
      (otp: string) => {
        onChange(otp);

        // Auto-submit when all digits are entered (with a small delay to ensure state updates)
        if (otp.length === PHONE_VERIFICATION_CONSTANTS.CODE_LENGTH) {
          setTimeout(() => {
            onComplete?.(otp);
          }, 100);
        }
      },
      [onChange, onComplete],
    );

    return (
      <div ref={ref} className={`space-y-3 ${className}`}>
        {/* Label */}
        <label
          htmlFor={id}
          className="block text-sm font-medium text-base-content"
        >
          {ariaLabel || placeholder}
        </label>

        {/* OTP Input */}
        <div className="flex justify-center">
          <OtpInput
            value={value}
            onChange={handleChange}
            numInputs={PHONE_VERIFICATION_CONSTANTS.CODE_LENGTH}
            renderSeparator={<span className="w-1 sm:w-2" />}
            renderInput={(props) => (
              <input
                {...props}
                className="verification-code-input"
                style={{
                  width: "clamp(36px, 12vw, 48px)",
                  height: "clamp(36px, 12vw, 48px)",
                  fontSize: "clamp(14px, 4vw, 18px)",
                  fontWeight: "600",
                  textAlign: "center",
                  border: error ? "2px solid #ef4444" : "2px solid #d1d5db",
                  borderRadius: "8px",
                  backgroundColor: disabled ? "#f9fafb" : "#ffffff",
                  color: disabled ? "#9ca3af" : "#1f2937",
                  outline: "none",
                  transition: "all 0.2s ease-in-out",
                  maxWidth: "48px",
                  minWidth: "32px",
                }}
                onFocus={(e) => {
                  e.target.style.border = error
                    ? "2px solid #ef4444"
                    : "2px solid #3b82f6";
                  e.target.style.boxShadow = error
                    ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                    : "0 0 0 3px rgba(59, 130, 246, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.border = error
                    ? "2px solid #ef4444"
                    : "2px solid #d1d5db";
                  e.target.style.boxShadow = "none";
                }}
                disabled={disabled}
                placeholder="0"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                aria-describedby={ariaDescribedBy}
              />
            )}
            shouldAutoFocus={autoFocus}
            containerStyle={{
              display: "flex",
              justifyContent: "center",
              gap: "clamp(4px, 2vw, 8px)",
              width: "100%",
              maxWidth: "320px",
              margin: "0 auto",
            }}
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-600 text-sm flex items-center justify-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {/* Help text */}
        <p className="text-base-content/60 text-sm text-center">
          Enter the {PHONE_VERIFICATION_CONSTANTS.CODE_LENGTH}-digit code sent
          to your phone
        </p>
      </div>
    );
  },
);

VerificationCodeInput.displayName = "VerificationCodeInput";

/**
 * Simple inline verification code input (single input field)
 */
export interface SimpleVerificationCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (code: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  placeholder?: string;
  id?: string;
  name?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export const SimpleVerificationCodeInput = forwardRef<
  HTMLInputElement,
  SimpleVerificationCodeInputProps
>(
  (
    {
      value,
      onChange,
      onComplete,
      disabled = false,
      error,
      className = "",
      placeholder = "Enter 6-digit code",
      id,
      name,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
    },
    ref,
  ) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.replace(/\D/g, ""); // Only allow digits

        // Limit to code length
        if (inputValue.length <= PHONE_VERIFICATION_CONSTANTS.CODE_LENGTH) {
          onChange(inputValue);

          // Auto-submit when all digits are entered
          if (inputValue.length === PHONE_VERIFICATION_CONSTANTS.CODE_LENGTH) {
            onComplete?.(inputValue);
          }
        }
      },
      [onChange, onComplete],
    );

    return (
      <div className="space-y-2">
        <input
          ref={ref}
          type="tel"
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={PHONE_VERIFICATION_CONSTANTS.CODE_LENGTH}
          className={`
            w-full px-3 py-2 text-center text-lg font-mono tracking-widest
            border rounded-lg shadow-sm transition-colors duration-200
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }
            ${disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white"}
            focus:ring-2 focus:ring-opacity-50 outline-none
            ${className}
          `}
          aria-label={ariaLabel || placeholder}
          aria-describedby={ariaDescribedBy}
          aria-invalid={error ? "true" : "false"}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
        />

        {error && (
          <p className="text-red-600 text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  },
);

SimpleVerificationCodeInput.displayName = "SimpleVerificationCodeInput";
