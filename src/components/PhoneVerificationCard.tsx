import {
  useContactData,
  useHasPhoneNumber,
  useIsPhoneVerified,
} from "@/contexts/ContactContext";
import { usePhoneVerificationStatus } from "@/hooks";
import { AlertTriangle, CheckCircle, Phone, Shield } from "lucide-react";
import { useState } from "react";
import { PhoneVerificationModal } from "./PhoneVerificationModal";
import { ActionCard } from "@/ui/shared/molecules/ActionCard";
import { formatPhoneNumber } from "react-phone-number-input";

/**
 * Phone verification status card for dashboard
 */
export function PhoneVerificationCard() {
  const [showModal, setShowModal] = useState(false);
  const contact = useContactData();
  const isPhoneVerified = useIsPhoneVerified();
  const hasPhoneNumber = useHasPhoneNumber();

  const handleVerifySuccess = (phoneNumber: string) => {
    console.log(`Phone verified successfully: ${phoneNumber}`);
    setShowModal(false);
  };

  // If no phone number at all
  if (!hasPhoneNumber) {
    return (
      <>
        <ActionCard
          title="Phone Number Not Provided"
          description="Add your phone number to enable SMS notifications and improve account security."
          actionText="Add Phone Number"
          onClick={() => setShowModal(true)}
          icon={<Phone className="w-5 h-5" />}
          badgeText="Not Added"
          badgeColor="badge-warning"
        />

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
    const phoneDisplay = contact?.phone_number
      ? formatPhoneNumber(contact.phone_number)
      : "";

    return (
      <>
        <ActionCard
          title="Phone Number Not Verified"
          description={`Your phone number ${phoneDisplay} needs verification to receive important notifications and enhance account security.`}
          actionText="Verify Phone Number"
          onClick={() => setShowModal(true)}
          icon={<Shield className="w-5 h-5" />}
          badgeText="Not Verified"
          badgeColor="badge-warning"
        />

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
  const verifiedPhoneDisplay = contact?.phone_number
    ? formatPhoneNumber(contact.phone_number)
    : "";

  return (
    <ActionCard
      title="Phone Number Verified"
      description={`Your phone number ${verifiedPhoneDisplay} is verified and ready to receive notifications.`}
      actionText="Verified"
      actionCardIsDisabled={true}
      onClick={() => {}} // No action needed for verified state
      icon={<CheckCircle className="w-5 h-5" />}
      badgeText="Verified"
      badgeColor="badge-success"
    />
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
