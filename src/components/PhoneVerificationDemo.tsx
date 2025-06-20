import React, { useState } from "react";
import { PhoneNumberInput, PhoneNumberDisplay } from "./PhoneNumberInput";
import {
  VerificationCodeInput,
  SimpleVerificationCodeInput,
} from "./VerificationCodeInput";
import { PhoneVerificationModal } from "./PhoneVerificationModal";
import {
  usePhoneVerification,
  usePhoneNumber,
  usePhoneVerificationStatus,
} from "@/hooks";

/**
 * Demo page showing all phone verification components
 */
export function PhoneVerificationDemo() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showModal, setShowModal] = useState(false);

  const phoneVerification = usePhoneVerification();
  const phoneNumberData = usePhoneNumber(phoneNumber);
  const verificationStatus = usePhoneVerificationStatus();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Phone Verification Components Demo
        </h1>

        {/* Phone Number Input Demo */}
        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Phone Number Input
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">
                With Verification Status
              </h3>
              <PhoneNumberInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                placeholder="Enter your phone number"
                showVerificationStatus={true}
                onVerifyClick={() => setShowModal(true)}
              />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Phone Number Display</h3>
              <PhoneNumberDisplay
                phoneNumber={phoneNumber || "+1234567890"}
                showVerificationStatus={true}
                format="international"
              />
              <div className="mt-2">
                <PhoneNumberDisplay
                  phoneNumber={phoneNumber || "+1234567890"}
                  showVerificationStatus={false}
                  format="national"
                  maskNumber={true}
                  className="text-sm text-gray-600"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Phone Number Utils Demo */}
        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Phone Number Utilities
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Is Valid:</strong>{" "}
                {phoneNumberData.isValid ? "✅ Yes" : "❌ No"}
              </div>
              <div>
                <strong>Formatted:</strong> {phoneNumberData.formatted || "N/A"}
              </div>
              <div>
                <strong>Masked:</strong> {phoneNumberData.masked || "N/A"}
              </div>
              <div>
                <strong>Country Code:</strong>{" "}
                {phoneNumberData.countryCode || "N/A"}
              </div>
            </div>
          </div>
        </section>

        {/* Verification Code Input Demo */}
        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Verification Code Input
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">OTP Style Input</h3>
              <VerificationCodeInput
                value={verificationCode}
                onChange={setVerificationCode}
                onComplete={(code) => console.log("Code completed:", code)}
                placeholder="Enter verification code"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Simple Input</h3>
              <SimpleVerificationCodeInput
                value={verificationCode}
                onChange={setVerificationCode}
                onComplete={(code) => console.log("Code completed:", code)}
                placeholder="Enter 6-digit code"
              />
            </div>
          </div>
        </section>

        {/* Verification Status Demo */}
        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Verification Status
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Has Phone Number:</strong>{" "}
                {verificationStatus.hasPhoneNumber ? "✅ Yes" : "❌ No"}
              </div>
              <div>
                <strong>Is Verified:</strong>{" "}
                {verificationStatus.isVerified ? "✅ Yes" : "❌ No"}
              </div>
              <div>
                <strong>Status:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded text-xs ${
                    verificationStatus.status === "verified"
                      ? "bg-green-100 text-green-800"
                      : verificationStatus.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {verificationStatus.status}
                </span>
              </div>
              <div>
                <strong>Can Verify:</strong>{" "}
                {verificationStatus.canVerify ? "✅ Yes" : "❌ No"}
              </div>
            </div>
          </div>
        </section>

        {/* Verification Flow Demo */}
        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Verification Flow
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Phone Verification
            </button>

            {/* Verification state display */}
            {phoneVerification.session && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">
                  Active Verification Session
                </h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>Phone: {phoneVerification.session.phone_number}</div>
                  <div>Status: {phoneVerification.session.status}</div>
                  <div>Attempts: {phoneVerification.session.attempts_made}</div>
                  {phoneVerification.resendCooldownSeconds > 0 && (
                    <div>
                      Resend in: {phoneVerification.resendCooldownSeconds}s
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error display */}
            {phoneVerification.error && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium text-red-900 mb-2">
                  Verification Error
                </h3>
                <div className="text-sm text-red-800">
                  <div>Type: {phoneVerification.error.type}</div>
                  <div>Message: {phoneVerification.error.message}</div>
                  <div>
                    Retryable:{" "}
                    {phoneVerification.error.retryable ? "Yes" : "No"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => phoneVerification.actions.reset()}
              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
            >
              Reset Verification
            </button>
            <button
              onClick={() => phoneVerification.actions.clearError()}
              className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700"
            >
              Clear Error
            </button>
            <button
              onClick={() => setVerificationCode("")}
              className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
            >
              Clear Code
            </button>
          </div>
        </section>
      </div>

      {/* Phone Verification Modal */}
      <PhoneVerificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={(phone) => {
          console.log("Phone verified successfully:", phone);
          alert(`Phone ${phone} verified successfully!`);
        }}
        initialPhoneNumber={phoneNumber}
        title="Verify Your Phone Number"
        description="We'll send you a verification code via SMS to confirm your phone number."
      />
    </div>
  );
}
