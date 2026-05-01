import { CATEGORIES } from '../utils/constants';

export default function TabBar({ activeTab, onTabChange, issueCounts }) {
  const tabs = [
    { id: 'all', label: 'All Issues' },
    ...Object.entries(CATEGORIES).map(([id, cat]) => ({
      id,
      label: cat.label
    }))
  ];

  return (
    <div className="dg-tabs">
      {tabs.map(tab => {
        const count = tab.id === 'all'
          ? Object.values(issueCounts).reduce((s, v) => s + v, 0)
          : (issueCounts[tab.id] || 0);

        return (
          <button
            key={tab.id}
            className={`dg-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            {count > 0 && (
              <span className={`dg-tab-count has-issues`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
