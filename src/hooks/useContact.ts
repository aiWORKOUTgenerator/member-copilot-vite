import { useContext } from 'react';
import { Contact } from '@/domain/entities/contact';
import { ContactContext, ContactState } from '@/contexts/contact.types';

/**
 * Custom hook to access the contact data from the ContactContext.
 * Throws an error if used outside of a ContactProvider.
 */
export function useContact(): ContactState {
  const context = useContext(ContactContext);

  if (context === undefined) {
    throw new Error('useContact must be used within a ContactProvider');
  }

  return context;
}

/**
 * Convenience hook to get just the contact data
 */
export function useContactData(): Contact | null {
  const { contact } = useContact();
  return contact;
}

/**
 * Convenience hook to check if the contact is loading
 */
export function useContactLoading(): boolean {
  const { isLoading } = useContact();
  return isLoading;
}

/**
 * Convenience hook to check if the contact is loaded
 */
export function useContactLoaded(): boolean {
  const { isLoaded } = useContact();
  return isLoaded;
}

/**
 * Convenience hook to get any contact loading error
 */
export function useContactError(): string | null {
  const { error } = useContact();
  return error;
}

/**
 * Convenience hook to check if the contact's phone is verified
 */
export function useIsPhoneVerified(): boolean {
  const { isPhoneVerified } = useContact();
  return isPhoneVerified;
}

/**
 * Convenience hook to get the phone verification date
 */
export function usePhoneVerificationDate(): Date | null {
  const { phoneVerificationDate } = useContact();
  return phoneVerificationDate;
}

/**
 * Convenience hook to check if the contact has a phone number
 */
export function useHasPhoneNumber(): boolean {
  const { hasPhoneNumber } = useContact();
  return hasPhoneNumber;
}
