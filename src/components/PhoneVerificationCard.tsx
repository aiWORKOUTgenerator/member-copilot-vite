import React, { useState } from "react";
import { PhoneVerificationModal } from "./PhoneVerificationModal";
import { PhoneNumberDisplay } from "./PhoneNumberInput";
import { usePhoneVerificationStatus } from "@/hooks";
import {
  useContactData,
  useIsPhoneVerified,
  useHasPhoneNumber,
} from "@/contexts/ContactContext";
import { Phone, Shield, AlertTriangle, CheckCircle } from "lucide-react";

/**
 * Phone verification status card for dashboard
 */
export function PhoneVerificationCard() {
  const [showModal, setShowModal] = useState(false);
  const contact = useContactData();
  const isPhoneVerified = useIsPhoneVerified();
  const hasPhoneNumber = useHasPhoneNumber();
  const { canVerify } = usePhoneVerificationStatus();

  const handleVerifySuccess = (phoneNumber: string) => {
    console.log(`Phone verified successfully: ${phoneNumber}`);
    setShowModal(false);
  };

  // If no phone number at all
  if (!hasPhoneNumber) {
    return (
      <>
        <div className="card bg-yellow-50 border border-yellow-200">
          <div className="card-body">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Phone className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="card-title text-yellow-800 text-base">
                  Phone Number Not Provided
                </h3>
                <p className="text-yellow-700 text-sm mb-3">
                  Add your phone number to enable SMS notifications and improve
                  account security.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="btn btn-sm btn-warning"
                >
                  Add Phone Number
                </button>
              </div>
            </div>
          </div>
        </div>

        <PhoneVerificationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handleVerifySuccess}
          title="Add & Verify Phone Number"
          description="Add your phone number and verify it to improve account security."
        />
      </>
    );
  }

  // If phone number exists but not verified
  if (!isPhoneVerified) {
    return (
      <>
        <div className="card bg-orange-50 border border-orange-200">
          <div className="card-body">
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-2 rounded-full">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="card-title text-orange-800 text-base">
                  Phone Number Not Verified
                </h3>
                <div className="mb-2">
                  <PhoneNumberDisplay
                    phoneNumber={contact?.phone_number || ""}
                    showVerificationStatus={false}
                    className="text-orange-700 text-sm"
                  />
                </div>
                <p className="text-orange-700 text-sm mb-3">
                  Verify your phone number to receive important notifications
                  and enhance account security.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="btn btn-sm btn-warning"
                  disabled={!canVerify}
                >
                  <Shield className="w-4 h-4" />
                  Verify Phone Number
                </button>
              </div>
            </div>
          </div>
        </div>

        <PhoneVerificationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handleVerifySuccess}
          initialPhoneNumber={contact?.phone_number}
          title="Verify Phone Number"
          description="Verify your phone number to enhance account security."
        />
      </>
    );
  }

  // If phone number is verified - show success status
  return (
    <div className="card bg-green-50 border border-green-200">
      <div className="card-body">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 p-2 rounded-full">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="card-title text-green-800 text-base">
              Phone Number Verified
            </h3>
            <div className="mb-2">
              <PhoneNumberDisplay
                phoneNumber={contact?.phone_number || ""}
                showVerificationStatus={true}
                className="text-green-700 text-sm"
              />
            </div>
            <p className="text-green-700 text-sm">
              Your phone number is verified and ready to receive notifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Phone verification alert component (for alert-style display)
 */
export function PhoneVerificationAlert() {
  const [showModal, setShowModal] = useState(false);
  const contact = useContactData();
  const isPhoneVerified = useIsPhoneVerified();
  const hasPhoneNumber = useHasPhoneNumber();
  const { canVerify } = usePhoneVerificationStatus();

  // Don't show alert if phone is already verified
  if (isPhoneVerified) {
    return null;
  }

  // Alert for missing phone number
  if (!hasPhoneNumber) {
    return (
      <>
        <div
          role="alert"
          className="alert alert-warning alert-vertical sm:alert-horizontal cursor-pointer hover:bg-warning/10 transition-colors"
          onClick={() => setShowModal(true)}
        >
          <Phone className="stroke-warning h-6 w-6 shrink-0" />
          <div>
            <h3 className="font-bold">Phone Number Missing</h3>
            <div className="text-xs">
              Add your phone number for better account security and
              notifications
            </div>
          </div>
          <button className="btn btn-sm">Add Phone</button>
        </div>

        <PhoneVerificationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowModal(false)}
          title="Add & Verify Phone Number"
          description="Add your phone number and verify it to improve account security."
        />
      </>
    );
  }

  // Alert for unverified phone number
  return (
    <>
      <div
        role="alert"
        className="alert alert-warning alert-vertical sm:alert-horizontal cursor-pointer hover:bg-warning/10 transition-colors"
        onClick={() => setShowModal(true)}
      >
        <AlertTriangle className="stroke-warning h-6 w-6 shrink-0" />
        <div>
          <h3 className="font-bold">Phone Number Not Verified</h3>
          <div className="text-xs">
            {contact?.phone_number} needs verification for security
          </div>
        </div>
        <button className="btn btn-sm" disabled={!canVerify}>
          Verify
        </button>
      </div>

      <PhoneVerificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => setShowModal(false)}
        initialPhoneNumber={contact?.phone_number}
        title="Verify Phone Number"
        description="Verify your phone number to enhance account security."
      />
    </>
  );
}
