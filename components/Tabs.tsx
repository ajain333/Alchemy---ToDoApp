
import React from 'react';

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => {
  const activeClasses = 'border-indigo-500 text-indigo-600';
  const inactiveClasses = 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  return (
    <button
      onClick={onClick}
      className={`py-4 px-6 text-sm font-medium border-b-2 focus:outline-none transition-colors duration-200 ${
        isActive ? activeClasses : inactiveClasses
      }`}
    >
      {label}
    </button>
  );
};

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tabLabel) => (
          <Tab
            key={tabLabel}
            label={tabLabel}
            isActive={activeTab === tabLabel}
            onClick={() => onTabChange(tabLabel)}
          />
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
