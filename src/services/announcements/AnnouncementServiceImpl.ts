import { Announcement } from "@/domain/entities/announcement";
import { ApiService } from "@/domain/interfaces/api/ApiService";
import { AnnouncementService } from "@/domain/interfaces/services/AnnouncementService";

interface AnnouncementProps {
  id: string;
  title: string;
  short_description: string;
  long_description: string;
  priority: "high" | "medium" | "low";
  created_at: string;
  is_active: boolean;
}

interface AnnouncementsResponse {
  announcements: AnnouncementProps[];
}

export class AnnouncementServiceImpl implements AnnouncementService {
  readonly serviceName = "AnnouncementService";
  private readonly apiService: ApiService;
  private readonly baseEndpoint = "/members";

  /**
   * Creates a new instance of AnnouncementServiceImpl
   * @param apiService The API service to use for HTTP requests
   */
  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async getAnnouncements(): Promise<Announcement[]> {
    try {
      const response = await this.apiService.get<AnnouncementsResponse>(
        `${this.baseEndpoint}/announcements`
      );

      return response.announcements
        .map((data) => new Announcement(data))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error("Error in getAnnouncements:", error);
      throw new Error("Failed to fetch announcements");
    }
  }
}
