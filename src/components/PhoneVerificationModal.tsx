import { usePhoneVerification } from '@/hooks/usePhoneVerification';
import { useCallback, useEffect, useState } from 'react';
import { PhoneNumberInput } from './PhoneNumberInput';
import { VerificationCodeInput } from './VerificationCodeInput';

export interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (phoneNumber: string) => void;
  initialPhoneNumber?: string;
  title?: string;
  description?: string;
}

enum VerificationStep {
  ENTER_PHONE = 1,
  VERIFY_CODE = 2,
  SUCCESS = 3,
}

export function PhoneVerificationModal({
  isOpen,
  onClose,
  onSuccess,
  initialPhoneNumber = '',
  title = 'Verify Your Phone Number',
  description = "We'll send you a verification code to confirm your phone number.",
}: PhoneVerificationModalProps) {
  const [currentStep, setCurrentStep] = useState<VerificationStep>(
    VerificationStep.ENTER_PHONE
  );
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [verificationCode, setVerificationCode] = useState('');

  const {
    isSending,
    isVerifying,
    isResending,
    error,
    showVerificationInput,
    canResend,
    actions,
  } = usePhoneVerification();

  const handleSendCode = useCallback(async () => {
    if (!phoneNumber) return;
    await actions.sendCode(phoneNumber);
  }, [phoneNumber, actions]);

  // Update step when verification input should be shown
  useEffect(() => {
    if (showVerificationInput && currentStep === VerificationStep.ENTER_PHONE) {
      setCurrentStep(VerificationStep.VERIFY_CODE);
    }
  }, [showVerificationInput, currentStep]);

  const handleVerifyCode = useCallback(
    async (code: string) => {
      setVerificationCode(code);
      const success = await actions.verifyCode(code);
      if (success) {
        setCurrentStep(VerificationStep.SUCCESS);
        // Don't call onSuccess immediately - wait for user to click "Continue"
      } else {
        setVerificationCode('');
      }
    },
    [actions]
  );

  const handleSuccessComplete = useCallback(() => {
    // Call onSuccess callback and close modal
    onSuccess?.(phoneNumber);
    onClose();
  }, [onSuccess, phoneNumber, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="relative bg-base-100 rounded-lg shadow-xl w-full max-w-sm sm:max-w-md mx-auto p-3 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-base-content">{title}</h2>
            <button
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost"
              aria-label="Close modal"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {currentStep === VerificationStep.ENTER_PHONE && (
              <>
                <p className="text-sm text-base-content/70">{description}</p>
                <PhoneNumberInput
                  value={phoneNumber}
                  onChange={(value) => setPhoneNumber(value || '')}
                  error={error?.message}
                  showVerificationStatus={false}
                />
                <button
                  onClick={handleSendCode}
                  disabled={!phoneNumber || isSending}
                  className="btn btn-primary w-full"
                >
                  {isSending ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : null}
                  {isSending ? 'Sending...' : 'Send Code'}
                </button>
              </>
            )}

            {currentStep === VerificationStep.VERIFY_CODE && (
              <>
                <p className="text-sm text-base-content/70">
                  Enter the code sent to {phoneNumber}
                </p>
                <VerificationCodeInput
                  value={verificationCode}
                  onChange={setVerificationCode}
                  onComplete={handleVerifyCode}
                  error={error?.message}
                  disabled={isVerifying}
                />

                {/* Loading state during verification */}
                {isVerifying && (
                  <div className="flex items-center justify-center py-3">
                    <span className="loading loading-spinner loading-md text-primary"></span>
                    <span className="ml-2 text-sm text-base-content/70">
                      Verifying code...
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => setCurrentStep(VerificationStep.ENTER_PHONE)}
                    className="btn btn-ghost btn-sm"
                    disabled={isVerifying}
                  >
                    ← Back to phone number
                  </button>
                  {canResend && (
                    <button
                      onClick={actions.resendCode}
                      disabled={isResending || isVerifying}
                      className="btn btn-ghost btn-sm text-primary"
                    >
                      {isResending ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : null}
                      {isResending ? 'Resending...' : 'Resend Code'}
                    </button>
                  )}
                </div>
              </>
            )}

            {currentStep === VerificationStep.SUCCESS && (
              <>
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-base-content mb-2">
                    🎉 Phone Number Verified!
                  </h3>
                  <p className="text-sm text-base-content/70 mb-6">
                    Your phone number <strong>{phoneNumber}</strong> has been
                    successfully verified. Your account security is now
                    enhanced!
                  </p>
                  <button
                    onClick={handleSuccessComplete}
                    className="btn btn-success w-full"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
