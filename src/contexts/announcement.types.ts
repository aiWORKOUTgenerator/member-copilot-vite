import { Announcement } from '@/domain/entities/announcement';
import { createContext } from 'react';

/**
 * AnnouncementState interface defines the shape of our announcement context value.
 */
export interface AnnouncementState {
  announcements: Announcement[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Create the context with a default undefined value.
 * This forces consumers to use the useAnnouncements hook which performs a null check.
 */
export const AnnouncementContext = createContext<AnnouncementState | undefined>(
  undefined
);
