import {
  LayoutDashboard, Shield, Zap, Code2, Bug,
  FileText, Terminal, Settings, BarChart3
} from 'lucide-react';
import { NAV_ITEMS } from '../utils/constants';

const ICONS = { LayoutDashboard, Shield, Zap, Code2, Bug, FileText, Terminal, Settings, BarChart3 };

export default function Sidebar({ activeView, onViewChange }) {
  return (
    <nav className="w-14 bg-bg-surface border-r border-border-base flex flex-col items-center py-4 gap-1 shrink-0">
      {NAV_ITEMS.map((item, i) => {
        const Icon = ICONS[item.icon];
        const isActive = activeView === item.id;
        
        return (
          <div key={item.id} className="w-full flex flex-col items-center gap-1">
            {(i === 1 || i === 5) && (
              <div className="w-6 h-px bg-border-base my-2" />
            )}
            <button
              className={`
                group relative w-10 h-10 flex items-center justify-center rounded-base transition-all duration-200
                ${isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-text-muted hover:bg-slate-800 hover:text-text-base'}
              `}
              onClick={() => onViewChange(item.id)}
              title={item.label}
            >
              {isActive && (
                <div className="absolute -left-1 w-1 h-5 bg-primary rounded-r-full" />
              )}
              {Icon && <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />}
            </button>
          </div>
        );
      })}
    </nav>
  );
}
