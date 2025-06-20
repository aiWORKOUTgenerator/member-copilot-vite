"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Contact } from "@/domain/entities/contact";
import { useContactService } from "@/hooks";
import { useAuth } from "@/hooks/auth";

/**
 * ContactState interface defines the shape of our contact context value.
 */
export interface ContactState {
  contact: Contact | null;
  isLoading: boolean;
  error: string | null;
  isLoaded: boolean;
  refetch: () => Promise<void>;
  // Phone verification utilities
  isPhoneVerified: boolean;
  phoneVerificationDate: Date | null;
  hasPhoneNumber: boolean;
}

/**
 * Create the context with a default undefined value.
 * This forces consumers to use the useContact hook which performs a null check.
 */
const ContactContext = createContext<ContactState | undefined>(undefined);

interface ContactProviderProps {
  children: ReactNode;
}

/**
 * ContactProvider component that makes contact data available to all child components.
 * It fetches contact data on mount and provides methods to refetch.
 */
export function ContactProvider({ children }: ContactProviderProps) {
  const contactService = useContactService();
  const { isSignedIn } = useAuth();
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContact = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await contactService.getOrCreateContact();
      setContact(data);
      setIsLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contact");
      console.error("Error fetching contact:", err);
    } finally {
      setIsLoading(false);
    }
  }, [contactService]);

  useEffect(() => {
    if (!isSignedIn && contact) {
      setContact(null);
      setIsLoaded(false);
    }
    if (isSignedIn && !contact) {
      fetchContact();
    }
  }, [isSignedIn, contact, fetchContact]);

  // Memoized context value with phone verification utilities
  const contextValue: ContactState = {
    contact,
    isLoading,
    error,
    isLoaded,
    refetch: fetchContact,
    // Phone verification utilities
    isPhoneVerified:
      contact?.phone_verified_at !== null &&
      contact?.phone_verified_at !== undefined,
    phoneVerificationDate: contact?.phone_verified_at
      ? new Date(contact.phone_verified_at)
      : null,
    hasPhoneNumber: Boolean(contact?.phone_number),
  };

  return (
    <ContactContext.Provider value={contextValue}>
      {children}
    </ContactContext.Provider>
  );
}

/**
 * Custom hook to access the contact data from the ContactContext.
 * Throws an error if used outside of a ContactProvider.
 */
export function useContact(): ContactState {
  const context = useContext(ContactContext);

  if (context === undefined) {
    throw new Error("useContact must be used within a ContactProvider");
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
