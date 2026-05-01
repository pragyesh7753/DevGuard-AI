import { useState } from 'react';
import { Shield, Zap, Code2, Bug, ChevronRight, Terminal } from 'lucide-react';

import SeverityBadge from './SeverityBadge';
import { getFileName } from '../utils/constants';

const CATEGORY_ICONS = {
  security: Shield,
  performance: Zap,
  quality: Code2,
  bugs: Bug,
};

export default function IssueCard({ issue, onFix }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = CATEGORY_ICONS[issue.category] || Code2;

  return (
    <div
      className={`
        group border transition-all duration-200 cursor-pointer
        ${expanded ? 'bg-zinc-900/40 border-zinc-700 shadow-sm' : 'bg-transparent border-border-base hover:border-zinc-700 hover:bg-zinc-900/20'}
      `}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-4 p-3">
        <div className="text-zinc-600 group-hover:text-zinc-400 transition-colors">
          <Icon size={14} />
        </div>
        
        <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
          <h4 className="text-[12px] font-medium text-zinc-200 truncate">
            {issue.title}
          </h4>
          
          <div className="flex items-center gap-6 shrink-0">
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
              <span className="truncate max-w-[120px]">{getFileName(issue.filePath)}</span>
              <span className="opacity-50">:</span>
              <span>{issue.line}</span>
            </div>
            <SeverityBadge severity={issue.severity} />
            <div className={`text-zinc-600 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-11 pb-4 pt-2 space-y-5 animate-in slide-in-from-top-1 duration-200">
          <div className="text-[11px] text-zinc-400 leading-relaxed max-w-2xl border-l-2 border-zinc-800 pl-4 py-1">
            {issue.description}
          </div>

          {issue.snippet && (
            <div className="relative group/code">
              <pre className="bg-black border border-zinc-800/50 p-4 rounded-sm overflow-x-auto font-mono text-[11px] text-zinc-400 leading-relaxed">
                <code>{issue.snippet}</code>
              </pre>
              <div className="absolute top-2 right-2 flex items-center gap-2 text-[9px] uppercase font-bold text-zinc-700">
                <Terminal size={10} /> source
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-6 bg-zinc-900/30 p-3 rounded-sm border border-zinc-800/50">
            <div className="flex-1">
              <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Proposed Resolution</div>
              <p className="text-[11px] text-zinc-300 font-medium">
                {issue.fix}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="btn btn-primary h-7 px-3 text-[10px] font-bold uppercase tracking-tight" 
                onClick={(e) => { e.stopPropagation(); onFix?.(issue, 'fix'); }}
              >
                Apply Fix
              </button>
              <button 
                className="btn btn-secondary h-7 px-3 text-[10px] font-bold uppercase tracking-tight" 
                onClick={(e) => { e.stopPropagation(); onFix?.(issue, 'goto'); }}
              >
                Inspect
              </button>
            </div>
          </div>

          {issue.rootCause && (
            <div className="text-[10px] text-zinc-500 flex items-center gap-2">
              <span className="font-bold uppercase tracking-tighter text-zinc-600">Origin Analysis</span>
              <div className="h-px flex-1 bg-zinc-900" />
              <span className="italic">{issue.rootCause}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
