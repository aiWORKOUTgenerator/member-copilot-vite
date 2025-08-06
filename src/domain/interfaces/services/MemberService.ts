import { Contact } from '@/domain/entities';

/**
 * Member information entity
 */
export interface MemberInfo {
  id: string;
  email: string;
}

/**
 * MemberService interface defines operations for member management.
 * This is a domain-specific service that encapsulates member-related business logic.
 */
export interface MemberService {
  /**
   * Fetches current user's member information
   * @returns Promise resolving to the member information
   */
  getUserInfo(): Promise<MemberInfo>;

  /**
   * Retrieves or creates a contact for the current user
   * @returns Promise resolving to the contact information
   */
  getOrCreateContact(): Promise<Contact>;
}
