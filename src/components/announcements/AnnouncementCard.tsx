import { Announcement } from '@/domain/entities/announcement';
import {
  getPriorityLabel,
  getPriorityColor,
  getPriorityIcon,
} from '@/utils/announcementPriorityMapping';

interface AnnouncementCardProps {
  announcement: Announcement;
  onViewMore: (announcement: Announcement) => void;
}

export function AnnouncementCard({
  announcement,
  onViewMore,
}: AnnouncementCardProps) {
  // Get gym-relevant priority mapping
  const priorityLabel = getPriorityLabel(announcement.priority);
  const priorityColor = getPriorityColor(announcement.priority);
  const priorityIcon = getPriorityIcon(announcement.priority);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-2xl w-full group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div
            className={`badge ${priorityColor} text-xs uppercase font-semibold flex items-center gap-1 shadow-lg backdrop-blur-sm`}
          >
            <span>{priorityIcon}</span>
            <span>{priorityLabel}</span>
          </div>
          <div className="text-xs text-base-content/60 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
            {formatDate(announcement.createdAt)}
          </div>
        </div>

        <h2 className="text-lg font-bold text-base-content mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {announcement.title}
        </h2>

        <p className="text-sm text-base-content/80 mb-6 line-clamp-3 leading-relaxed">
          {announcement.shortDescription}
        </p>

        <div className="flex justify-end">
          <button
            className="btn btn-primary btn-sm bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/30 hover:shadow-primary/40 transform hover:scale-105 transition-all duration-200 border-0"
            onClick={() => onViewMore(announcement)}
          >
            View More
          </button>
        </div>
      </div>
    </div>
  );
}
