'use client';

import React from 'react';

export type TabOption = {
  id: string;
  label: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
};

type TabBarProps = {
  selectedTab: string;
  onTabChange: (tabId: string) => void;
  tabs: TabOption[];
  className?: string;
  /** Optional background class for the tab container (e.g., 'bg-base-200', 'bg-base-100') */
  backgroundClassName?: string;
};

export default function TabBar({
  selectedTab,
  onTabChange,
  tabs,
  className = '',
  backgroundClassName = 'bg-base-200',
}: TabBarProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div
        role="tablist"
        className={`tabs tabs-boxed tabs-sm sm:tabs-md flex-nowrap whitespace-nowrap ${backgroundClassName} ${className}`}
      >
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            role="tab"
            aria-selected={selectedTab === tab.id}
            className={`tab shrink-0 rounded-lg transition-colors ${
              selectedTab === tab.id
                ? 'tab-active bg-base-100 text-base-content shadow-sm border border-base-300'
                : 'text-base-content/70 hover:bg-base-100 hover:text-base-content'
            } ${tab.disabled ? 'tab-disabled' : ''}`}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
          >
            {tab.label}
            {tab.loading && (
              <span className="loading loading-spinner loading-xs ml-2"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
