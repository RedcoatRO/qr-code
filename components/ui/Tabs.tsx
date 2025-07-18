import React from 'react';

interface TabsProps<T extends string> {
  tabs: { id: T; label: string; icon: React.ReactNode }[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
}

export const Tabs = <T extends string>({ tabs, activeTab, onTabChange }: TabsProps<T>) => {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 bg-slate-200 dark:bg-slate-700/50 p-1 rounded-lg gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
              ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 shadow'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-700'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};