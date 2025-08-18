import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Announcement } from '@/domain/entities/announcement';
import { AnnouncementState } from '@/contexts/announcement.types';
import { useAnnouncementsService } from '@/hooks/useAnnouncementsService';
import { useAuth } from '@/hooks/auth';

/**
 * Hook to access announcement data using React Query
 */
export function useAnnouncements(): AnnouncementState {
  const announcementService = useAnnouncementsService();
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<Announcement[], unknown>({
    queryKey: ['announcements'],
    queryFn: () => announcementService.getAnnouncements(),
    enabled: isSignedIn === true,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (isSignedIn === false) {
      queryClient.removeQueries({ queryKey: ['announcements'] });
    }
  }, [isSignedIn, queryClient]);

  const refetch = async (): Promise<void> => {
    await query.refetch();
  };

  return {
    announcements: query.data ?? [],
    isLoading: query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    refetch,
  };
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
