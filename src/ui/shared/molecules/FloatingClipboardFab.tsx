import { Clipboard } from 'lucide-react';

type Props = {
  href?: string;
  className?: string;
  onClick?: () => void; // optional analytics hook
  ariaLabel?: string;
  title?: string;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function FloatingClipboardFab({
  href = '/select-workout',
  className = '',
  onClick,
  ariaLabel = 'Select workout',
  title = 'Select workout',
}: Props) {
  return (
    <div
      className={classNames(
        // simple fixed positioning
        'fixed right-6 bottom-6 z-50',
        className
      )}
    >
      <a
        href={href}
        onClick={onClick}
        aria-label={ariaLabel}
        title={title}
        className="btn btn-primary btn-circle shadow-lg hover:shadow-xl 
                   focus-visible:outline-none focus-visible:ring focus-visible:ring-primary/50"
      >
        <Clipboard
          className="w-6 h-6"
          aria-hidden="true"
          data-testid="clipboard-icon"
        />
      </a>
    </div>
  );
}
