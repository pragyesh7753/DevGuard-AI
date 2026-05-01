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
    <div className="flex items-center gap-1">
      {tabs.map(tab => {
        const count = tab.id === 'all'
          ? Object.values(issueCounts).reduce((s, v) => s + v, 0)
          : (issueCounts[tab.id] || 0);
        
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            className={`
              relative px-4 h-12 flex items-center gap-2 text-[12px] font-medium transition-all duration-200
              ${isActive ? 'text-text-base' : 'text-text-muted hover:text-text-base'}
            `}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            {count > 0 && (
              <span className={`
                text-[10px] font-bold px-1.5 py-0.5 rounded-full
                ${isActive ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-text-dim'}
              `}>
                {count}
              </span>
            )}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(99,102,241,0.3)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
