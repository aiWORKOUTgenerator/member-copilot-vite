import { FC } from 'react';

/**
 * ContactLoadingIndicator
 *
 * A loading indicator for contact data, styled with DaisyUI and Tailwind CSS.
 * Use this as a fallback UI while contact information is being loaded.
 */
export const ContactLoadingIndicator: FC = () => (
  <div className="flex items-center h-40 justify-center w-full">
    <span
      className="loading loading-ring loading-xl text-primary"
      aria-label="Loading contact information"
      role="status"
    ></span>
  </div>
);
