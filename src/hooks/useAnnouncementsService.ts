import { AnnouncementService } from "@/domain/interfaces/services/AnnouncementService";
import { AnnouncementServiceImpl } from "@/services/announcements/AnnouncementServiceImpl";
import { useMemo } from "react";
import { useApiService } from "./useApiService";

export function useAnnouncementsService(): AnnouncementService {
  const apiService = useApiService();
  const announcementService = useMemo(() => {
    return new AnnouncementServiceImpl(apiService);
  }, [apiService]);

  return announcementService;
}
