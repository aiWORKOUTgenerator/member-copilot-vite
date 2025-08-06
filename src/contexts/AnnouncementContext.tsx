'use client';

import { Announcement } from '@/domain/entities/announcement';
import { useAuth } from '@/hooks/auth';
import { useAnnouncementsService } from '@/hooks/useAnnouncementsService';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { AnnouncementContext, AnnouncementState } from './announcement.types';

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
        err instanceof Error ? err.message : 'Failed to fetch announcements'
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
