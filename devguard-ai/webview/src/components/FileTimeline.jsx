import { FileText, GitBranch, Terminal, History } from 'lucide-react';
import { timeAgo, getFileName } from '../utils/constants';

const TRIGGER_ICONS = { save: FileText, git: GitBranch, command: Terminal };
const TRIGGER_LABELS = { save: 'File saved', git: 'Git change', command: 'Command executed' };
const TRIGGER_COLORS = { 
  save: 'text-primary bg-primary/10', 
  git: 'text-indigo-400 bg-indigo-400/10', 
  command: 'text-amber-500 bg-amber-500/10' 
};

export default function FileTimeline({ timeline }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <History size={48} className="text-text-dim opacity-10 mb-4" />
        <h3 className="text-base font-semibold text-text-base">No activity tracked yet</h3>
        <p className="text-sm text-text-muted mt-1 max-w-xs">Start editing and saving files to see their change history here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-dim mb-4">
        <History size={14} /> File Change History
      </div>
      
      <div className="space-y-1">
        {timeline.map((item, i) => {
          const Icon = TRIGGER_ICONS[item.lastTrigger] || FileText;
          const colorClass = TRIGGER_COLORS[item.lastTrigger] || TRIGGER_COLORS.save;
          
          return (
            <div 
              key={i} 
              className="group flex items-center gap-4 p-3 rounded-base hover:bg-slate-900/40 transition-colors border border-transparent hover:border-border-base"
            >
              <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${colorClass}`}>
                <Icon size={14} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-text-base truncate">
                  {getFileName(item.filePath)}
                </div>
                <div className="text-[11px] text-text-muted flex items-center gap-2">
                  <span>{TRIGGER_LABELS[item.lastTrigger] || 'Modified'}</span>
                  <span className="w-0.5 h-0.5 rounded-full bg-slate-700" />
                  <span>{item.snapshots} snapshot{item.snapshots !== 1 ? 's' : ''}</span>
                </div>
              </div>
              
              <div className="text-[11px] text-text-dim font-medium whitespace-nowrap">
                {timeAgo(item.lastChange)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
