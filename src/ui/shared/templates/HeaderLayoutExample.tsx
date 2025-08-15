import React from 'react';
import { HeaderLayout } from './HeaderLayout';

/**
 * Example usage of HeaderLayout component
 *
 * This demonstrates how to use the new HeaderLayout which provides:
 * - Compact navigation header at the top
 * - Separate title section below navigation
 * - Clean main content area
 *
 * To use this in your pages, simply replace StackedLayout with HeaderLayout:
 *
 * Before:
 * <StackedLayout title="My Page">
 *   <YourContent />
 * </StackedLayout>
 *
 * After:
 * <HeaderLayout title="My Page" headerStyle="white">
 *   <YourContent />
 * </HeaderLayout>
 */

export const HeaderLayoutExample: React.FC = () => {
  return (
    <HeaderLayout
      title="Dashboard Overview"
      headerStyle="white" // Options: 'white', 'base', or custom class
      containerStyle="default" // Options: 'default', 'none', or custom class
    >
      {/* Your page content goes here */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Sample Card 1</h3>
              <p>This is example content in the new HeaderLayout structure.</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Sample Card 2</h3>
              <p>
                Notice how the navigation is compact and the title is separate.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Sample Card 3</h3>
              <p>This provides a cleaner, more traditional layout structure.</p>
            </div>
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
};

export default HeaderLayoutExample;
