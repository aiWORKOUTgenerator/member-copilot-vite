import { useContext } from "react";
import { Announcement } from "@/domain/entities/announcement";
import {
  AnnouncementContext,
  AnnouncementState,
} from "@/contexts/announcement.types";

/**
 * Custom hook to access the announcement data from the AnnouncementContext.
 * Throws an error if used outside of an AnnouncementProvider.
 */
export function useAnnouncements(): AnnouncementState {
  const context = useContext(AnnouncementContext);

  if (context === undefined) {
    throw new Error(
      "useAnnouncements must be used within an AnnouncementProvider",
    );
  }

  return context;
}

/**
 * Convenience hook to get just the announcements array
 */
export function useAnnouncementsData(): Announcement[] {
  const { announcements } = useAnnouncements();
  return announcements;
}

/**
 * Convenience hook to check if the announcements are loading
 */
export function useAnnouncementsLoading(): boolean {
  const { isLoading } = useAnnouncements();
  return isLoading;
}

/**
 * Convenience hook to get any announcements loading error
 */
export function useAnnouncementsError(): string | null {
  const { error } = useAnnouncements();
  return error;
}

/**
 * Hook to get a specific announcement by ID
 */
export function useAnnouncement(id: string): Announcement | undefined {
  const { announcements } = useAnnouncements();
  return announcements.find((announcement) => announcement.id === id);
}
