import { Announcement } from '@/domain/entities/announcement';

export interface AnnouncementService {
  getAnnouncements(): Promise<Announcement[]>;
  // Future methods for CRUD operations when backend is ready
  // getAnnouncement(id: string): Promise<Announcement | null>;
  // createAnnouncement(request: CreateAnnouncementRequest): Promise<Announcement>;
  // updateAnnouncement(id: string, request: UpdateAnnouncementRequest): Promise<Announcement>;
  // deleteAnnouncement(id: string): Promise<void>;
}
