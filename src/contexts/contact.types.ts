import { Contact } from "@/domain/entities/contact";
import { createContext } from "react";

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
export const ContactContext = createContext<ContactState | undefined>(
  undefined,
);
