'use client';

import { useState } from 'react';
import { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface ExerciseTabNavigationProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
}

export const ExerciseTabNavigation: React.FC<ExerciseTabNavigationProps> = ({
  tabs,
  defaultTab,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Navigation */}
      <div className="tabs tabs-bordered w-full mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab tab-bordered flex items-center gap-2 ${
              activeTab === tab.id ? 'tab-active' : ''
            }`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tab-panel-${tab.id}`}
          >
            {tab.icon && <span className="text-sm">{tab.icon}</span>}
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        id={`tab-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="min-h-[200px]"
      >
        {activeTabContent}
      </div>
    </div>
  );
};
