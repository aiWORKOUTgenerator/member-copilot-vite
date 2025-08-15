import { Announcement } from '@/domain/entities/announcement';
import { useEffect, useRef } from 'react';

interface AnnouncementModalProps {
  announcement: Announcement | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AnnouncementModal({
  announcement,
  isOpen,
  onClose,
}: AnnouncementModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  // Handle modal open/close state
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    if (isOpen && announcement) {
      modal.showModal();
    } else {
      modal.close();
    }
  }, [isOpen, announcement]);

  // Handle modal close events
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const handleClose = () => {
      onClose();
    };

    modal.addEventListener('close', handleClose);
    return () => modal.removeEventListener('close', handleClose);
  }, [onClose]);

  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!announcement) {
    return null;
  }

  // Priority-based styling
  const getPriorityStyles = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'badge-error';
      case 'medium':
        return 'badge-warning';
      case 'low':
        return 'badge-info';
      default:
        return 'badge-info';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Simple markdown-like rendering (basic implementation)
  const renderMarkdown = (content: string) => {
    return (
      content
        // Headers
        .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
        .replace(
          /^## (.+)$/gm,
          '<h2 class="text-xl font-semibold mb-3">$1</h2>'
        )
        .replace(/^### (.+)$/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
        // Bold text
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
        // Lists
        .replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>')
        // Numbered lists
        .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
        // Line breaks
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>')
    );
  };

  return (
    <dialog
      ref={modalRef}
      className="modal modal-bottom sm:modal-middle"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="bg-base-300 modal-box max-w-4xl">
        {/* Modal Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`badge ${getPriorityStyles(
                announcement.priority
              )} text-xs uppercase font-semibold`}
            >
              {announcement.priority}
            </div>
            <div className="text-sm text-base-content/60">
              {formatDate(announcement.createdAt)}
            </div>
          </div>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Title */}
        <h1 id="modal-title" className="text-xl font-bold mb-4">
          {announcement.title}
        </h1>

        {/* Modal Content */}
        <div
          id="modal-description"
          className="prose prose-sm max-w-none text-base-content/90 mb-6"
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(announcement.longDescription),
          }}
        />

        {/* Modal Actions */}
        <div className="modal-action">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      {/* Modal backdrop - clicking outside closes modal */}
      <form method="dialog" className="modal-backdrop">
        <button type="submit" aria-label="Close modal">
          close
        </button>
      </form>
    </dialog>
  );
}
