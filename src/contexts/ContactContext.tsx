"use client";

import { ReactNode, useState, useEffect, useCallback } from "react";
import { Contact } from "@/domain/entities/contact";
import { useContactService } from "@/hooks";
import { useAuth } from "@/hooks/auth";
import { ContactContext, ContactState } from "./contact.types";

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
