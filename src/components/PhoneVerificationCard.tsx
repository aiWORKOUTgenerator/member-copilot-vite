import {
  useContactData,
  useHasPhoneNumber,
  useIsPhoneVerified,
} from "@/contexts/ContactContext";
import { ActionCard } from "@/ui/shared/molecules/ActionCard";
import { CheckCircle, Phone, Shield } from "lucide-react";
import { useState } from "react";
import { formatPhoneNumber } from "react-phone-number-input";
import { PhoneVerificationModal } from "./PhoneVerificationModal";

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
          description="Add your phone number to receive personalized workout reminders, training tips, and stay connected with your AI trainer via SMS."
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
          description="Add your phone number and verify it."
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
          description={`Your phone number ${phoneDisplay} needs verification to receive important notifications.`}
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
          description="Verify your phone number."
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
      description={`Your phone number ${verifiedPhoneDisplay} is verified. You can now receive notifications.`}
      actionText="Verified"
      actionCardIsDisabled={true}
      onClick={() => {}} // No action needed for verified state
      icon={<CheckCircle className="w-5 h-5" />}
      badgeText="Verified"
      badgeColor="badge-success"
    />
  );
}
