"use client";

import React from "react";

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
};

export default function TabBar({
  selectedTab,
  onTabChange,
  tabs,
  className = "",
}: TabBarProps) {
  return (
    <div role="tablist" className={`tabs tabs-box mb-4 ${className}`}>
      {tabs.map((tab) => (
        <a
          key={tab.id}
          role="tab"
          className={`tab ${selectedTab === tab.id ? "tab-active" : ""} ${
            tab.disabled ? "tab-disabled" : ""
          }`}
          onClick={() => !tab.disabled && onTabChange(tab.id)}
        >
          {tab.label}
          {tab.loading && (
            <span className="loading loading-spinner loading-xs ml-2"></span>
          )}
        </a>
      ))}
    </div>
  );
}
