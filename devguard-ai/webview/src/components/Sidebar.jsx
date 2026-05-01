import {
  LayoutDashboard, Shield, Zap, Code2, Bug,
  FileText, Terminal, Settings
} from 'lucide-react';
import { NAV_ITEMS } from '../utils/constants';

const ICONS = { LayoutDashboard, Shield, Zap, Code2, Bug, FileText, Terminal, Settings };

export default function Sidebar({ activeView, onViewChange }) {
  return (
    <nav className="dg-sidebar">
      {NAV_ITEMS.map((item, i) => {
        const Icon = ICONS[item.icon];
        return (
          <div key={item.id}>
            {i === 1 && <div className="dg-sidebar-divider" />}
            {i === 5 && <div className="dg-sidebar-divider" />}
            <button
              className={`dg-sidebar-btn ${activeView === item.id ? 'active' : ''}`}
              onClick={() => onViewChange(item.id)}
              title={item.label}
            >
              {Icon && <Icon size={18} />}
            </button>
          </div>
        );
      })}
    </nav>
  );
}
