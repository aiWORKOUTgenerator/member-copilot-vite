import { useMemo } from 'react';
import { useMemberService } from './useMemberService';

/**
 * Hook to get the contact-related functionality from the MemberService
 * This is a thin wrapper around the MemberService that provides only contact-related methods
 * @returns Contact-related methods from MemberService
 */
export function useContactService() {
  const memberService = useMemberService();

  // Create a memoized object with just the contact-related methods
  const contactService = useMemo(() => {
    return {
      getOrCreateContact: memberService.getOrCreateContact.bind(memberService),
    };
  }, [memberService]);

  return contactService;
}
