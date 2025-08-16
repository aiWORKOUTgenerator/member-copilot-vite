import { Announcement } from '@/domain/entities/announcement';

interface AnnouncementCardProps {
  announcement: Announcement;
  onViewMore: (announcement: Announcement) => void;
}

export function AnnouncementCard({
  announcement,
  onViewMore,
}: AnnouncementCardProps) {
  // Priority-based styling configuration
  const getPriorityStyles = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return {
          cardClass: 'card-bordered border-error',
          badgeClass: 'badge-error',
        };
      case 'medium':
        return {
          cardClass: 'card-bordered border-warning',
          badgeClass: 'badge-warning',
        };
      case 'low':
        return {
          cardClass: 'card-bordered border-info',
          badgeClass: 'badge-info',
        };
      default:
        return {
          cardClass: 'card-bordered border-info',
          badgeClass: 'badge-info',
        };
    }
  };

  const priorityStyles = getPriorityStyles(announcement.priority);

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
    <div
      className={`card bg-base-100 shadow-md hover:shadow-lg transition-shadow ${priorityStyles.cardClass} w-full`}
    >
      <div className="card-body p-4">
        <div className="flex justify-between items-start mb-2">
          <div
            className={`badge ${priorityStyles.badgeClass} text-xs uppercase font-semibold`}
          >
            {announcement.priority}
          </div>
          <div className="text-xs text-base-content/60">
            {formatDate(announcement.createdAt)}
          </div>
        </div>

        <h2 className="card-title text-base mb-2 line-clamp-2">
          {announcement.title}
        </h2>

        <p className="text-sm text-base-content/80 mb-4 line-clamp-3">
          {announcement.shortDescription}
        </p>

        <div className="card-actions justify-end">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onViewMore(announcement)}
          >
            View More
          </button>
        </div>
      </div>
    </div>
  );
}
