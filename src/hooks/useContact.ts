import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Contact } from '@/domain/entities/contact';
import { ContactState } from '@/contexts/contact.types';
import { useContactService } from '@/hooks/useContactService';
import { useAuth } from '@/hooks/auth';

/**
 * Hook to access the authenticated user's contact using React Query
 */
export function useContact(): ContactState {
  const contactService = useContactService();
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<Contact, unknown>({
    queryKey: ['contact'],
    queryFn: () => contactService.getOrCreateContact(),
    enabled: isSignedIn === true,
  });

  useEffect(() => {
    if (isSignedIn === false) {
      queryClient.removeQueries({ queryKey: ['contact'] });
    }
  }, [isSignedIn, queryClient]);

  const refetch = async (): Promise<void> => {
    await query.refetch();
  };

  const contact: Contact | null = query.data ?? null;
  const isPhoneVerified = Boolean(
    contact?.phone_verified_at !== null &&
      contact?.phone_verified_at !== undefined
  );
  const phoneVerificationDate = contact?.phone_verified_at
    ? new Date(contact.phone_verified_at)
    : null;
  const hasPhoneNumber = Boolean(contact?.phone_number);

  return {
    contact,
    isLoading: query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    isLoaded: query.isFetched,
    refetch,
    isPhoneVerified,
    phoneVerificationDate,
    hasPhoneNumber,
  };
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
