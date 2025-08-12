import React, { forwardRef, ElementType } from 'react';

export interface ScrollTargetProps {
  /** Unique identifier for this scroll target */
  targetId: string;
  /** Function to register this element as a scroll target */
  registerScrollTarget: (targetId: string, element: HTMLElement | null) => void;
  /** Additional CSS classes */
  className?: string;
  /** Children to render */
  children: React.ReactNode;
  /** HTML element to render (default: div) */
  as?: ElementType;
}

/**
 * ScrollTarget - A helper component for registering scroll targets
 *
 * This component makes it easy to register DOM elements as scroll targets
 * for the universal auto-scroll system. It automatically handles the
 * registration and cleanup of scroll targets.
 *
 * @example
 * <ScrollTarget
 *   targetId="duration-question"
 *   registerScrollTarget={registerScrollTarget}
 *   className="scroll-mt-4"
 * >
 *   <h3>How long do you want your workout to be?</h3>
 * </ScrollTarget>
 *
 * @example
 * <ScrollTarget
 *   targetId="energy-section"
 *   registerScrollTarget={registerScrollTarget}
 *   as="section"
 *   className="mb-6"
 * >
 *   <DetailedSelector
 *     icon={Battery}
 *     options={energyOptions}
 *     question="How energetic are you feeling today?"
 *     // ... other props
 *   />
 * </ScrollTarget>
 */
export const ScrollTarget = forwardRef<HTMLElement, ScrollTargetProps>(
  (
    {
      targetId,
      registerScrollTarget,
      className = '',
      children,
      as: Component = 'div' as ElementType,
      ...props
    },
    ref
  ) => {
    const handleRef = (element: HTMLElement | null) => {
      // Validate inputs
      if (!targetId) {
        console.warn('ScrollTarget: targetId is required');
        return;
      }

      if (!registerScrollTarget || typeof registerScrollTarget !== 'function') {
        console.warn('ScrollTarget: registerScrollTarget must be a function');
        return;
      }

      try {
        // Register the element as a scroll target
        registerScrollTarget(targetId, element);

        // Forward the ref if provided
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      } catch (error) {
        console.error('ScrollTarget: Error registering scroll target:', error);
      }
    };

    return (
      <Component
        ref={handleRef}
        className={className}
        data-scroll-target={targetId}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ScrollTarget.displayName = 'ScrollTarget';
