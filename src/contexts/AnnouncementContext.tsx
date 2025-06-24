"use client";

import { Announcement } from "@/domain/entities/announcement";
import { useAuth } from "@/hooks/auth";
import { useAnnouncementsService } from "@/hooks/useAnnouncementsService";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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
const AnnouncementContext = createContext<AnnouncementState | undefined>(
  undefined
);

interface AnnouncementProviderProps {
  children: ReactNode;
}

/**
 * AnnouncementProvider component that makes announcement data available to all child components.
 * It fetches announcement data on mount and provides methods to refetch.
 */
export function AnnouncementProvider({ children }: AnnouncementProviderProps) {
  const announcementService = useAnnouncementsService();
  const { isSignedIn } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await announcementService.getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch announcements"
      );
    } finally {
      setIsLoading(false);
    }
  }, [announcementService]);

  // Fetch announcement data when the component mounts
  useEffect(() => {
    if (isSignedIn) {
      fetchAnnouncements();
    } else {
      setAnnouncements([]);
    }
  }, [isSignedIn, fetchAnnouncements]);

  // Memoized context value
  const contextValue: AnnouncementState = {
    announcements,
    isLoading,
    error,
    refetch: fetchAnnouncements,
  };

  return (
    <AnnouncementContext.Provider value={contextValue}>
      {children}
    </AnnouncementContext.Provider>
  );
}

/**
 * Custom hook to access the announcement data from the AnnouncementContext.
 * Throws an error if used outside of an AnnouncementProvider.
 */
export function useAnnouncements(): AnnouncementState {
  const context = useContext(AnnouncementContext);

  if (context === undefined) {
    throw new Error(
      "useAnnouncements must be used within an AnnouncementProvider"
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
