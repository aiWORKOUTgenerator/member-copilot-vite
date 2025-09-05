import { useState } from 'react';
import { Announcement } from '@/domain/entities/announcement';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { AnnouncementCard } from './AnnouncementCard';
import { AnnouncementModal } from './AnnouncementModal';
import { Megaphone } from 'lucide-react';

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

  // Glass morphism container component
  const GlassMorphismContainer = ({
    children,
  }: {
    children: React.ReactNode;
  }) => (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 backdrop-blur-sm border border-white/20 shadow-2xl shadow-primary/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-xl"></div>

      <div className="relative z-10 p-8">{children}</div>
    </div>
  );

  // Enhanced header component
  const AnnouncementsHeader = () => (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform duration-200">
          <Megaphone className="w-6 h-6 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-accent to-accent/80 rounded-full animate-pulse"></div>
      </div>
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-base-content to-base-content/80 bg-clip-text text-transparent">
          Latest Announcements
        </h2>
        <p className="text-sm text-base-content/70 mt-1">
          Stay updated with the latest gym news, challenges, and offers
        </p>
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <GlassMorphismContainer>
        <AnnouncementsHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Loading skeletons */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="skeleton h-4 w-16"></div>
                <div className="skeleton h-3 w-12"></div>
              </div>
              <div className="skeleton h-5 w-3/4 mb-2"></div>
              <div className="skeleton h-4 w-full mb-1"></div>
              <div className="skeleton h-4 w-full mb-1"></div>
              <div className="skeleton h-4 w-2/3 mb-4"></div>
              <div className="flex justify-end">
                <div className="skeleton h-8 w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </GlassMorphismContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <GlassMorphismContainer>
        <AnnouncementsHeader />
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-error to-error/80 flex items-center justify-center shadow-lg shadow-error/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6 text-white"
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
            </div>
            <div>
              <h3 className="font-bold text-base-content">
                Error loading announcements
              </h3>
              <div className="text-sm text-base-content/70 mt-1">{error}</div>
            </div>
          </div>
        </div>
      </GlassMorphismContainer>
    );
  }

  // Empty state
  if (announcements.length === 0) {
    return (
      <GlassMorphismContainer>
        <AnnouncementsHeader />
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Megaphone className="w-8 h-8 text-primary/60" />
          </div>
          <h3 className="text-lg font-medium text-base-content mb-2">
            No announcements
          </h3>
          <p className="text-base-content/60">
            There are no announcements to display at this time.
          </p>
        </div>
      </GlassMorphismContainer>
    );
  }

  // Success state with announcements
  return (
    <GlassMorphismContainer>
      <AnnouncementsHeader />

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
    </GlassMorphismContainer>
  );
}
