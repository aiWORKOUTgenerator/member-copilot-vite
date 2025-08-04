import { useState } from "react";
import { Announcement } from "@/domain/entities/announcement";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { AnnouncementCard } from "./AnnouncementCard";
import { AnnouncementModal } from "./AnnouncementModal";

export function AnnouncementsSection() {
  const { announcements, isLoading, error } = useAnnouncements();
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewMore = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-base-content">
          Latest Announcements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Loading skeletons */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="card bg-base-100 shadow-md">
              <div className="card-body p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="skeleton h-4 w-16"></div>
                  <div className="skeleton h-3 w-12"></div>
                </div>
                <div className="skeleton h-5 w-3/4 mb-2"></div>
                <div className="skeleton h-4 w-full mb-1"></div>
                <div className="skeleton h-4 w-full mb-1"></div>
                <div className="skeleton h-4 w-2/3 mb-4"></div>
                <div className="card-actions justify-end">
                  <div className="skeleton h-8 w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-base-content">
          Latest Announcements
        </h2>
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-bold">Error loading announcements</h3>
            <div className="text-xs">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (announcements.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-base-content">
          Latest Announcements
        </h2>
        <div className="text-center py-8">
          <div className="text-base-content/60 mb-4">
            <svg
              className="mx-auto h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-base-content mb-2">
            No announcements
          </h3>
          <p className="text-base-content/60">
            There are no announcements to display at this time.
          </p>
        </div>
      </div>
    );
  }

  // Success state with announcements
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-base-content">
        Latest Announcements
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            onViewMore={handleViewMore}
          />
        ))}
      </div>

      {/* Modal for viewing full announcement */}
      <AnnouncementModal
        announcement={selectedAnnouncement}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
