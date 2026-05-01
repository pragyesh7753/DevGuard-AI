import { Terminal as TerminalIcon, AlertTriangle, Command } from 'lucide-react';
import SeverityBadge from './SeverityBadge';
import { timeAgo } from '../utils/constants';

export default function TerminalLog({ commands }) {
  if (!commands || commands.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <TerminalIcon size={48} className="text-text-dim opacity-10 mb-4" />
        <h3 className="text-base font-semibold text-text-base">No terminal activity</h3>
        <p className="text-sm text-text-muted mt-1 max-w-xs">Commands executed in the integrated terminal will appear here with their file system impact.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-dim mb-4">
        <Command size={14} /> Terminal Activity Log
      </div>

      <div className="space-y-4">
        {commands.map((cmd, i) => (
          <div key={i} className="card p-4 bg-slate-900/40">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 font-mono text-[12px] text-primary bg-slate-950 px-3 py-1.5 rounded border border-slate-800 flex-1">
                <span className="text-slate-600 font-bold">$</span>
                <span className="truncate">{cmd.command}</span>
              </div>
              <div className="text-[10px] font-medium text-text-dim whitespace-nowrap pt-1.5">
                {timeAgo(cmd.timestamp)}
              </div>
            </div>

            <div className="space-y-3">
              {(cmd.filesCreated?.length > 0 || cmd.filesModified?.length > 0 || cmd.filesDeleted?.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {cmd.filesCreated?.map((f, j) => (
                    <span key={j} className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      + {f}
                    </span>
                  ))}
                  {cmd.filesModified?.map((f, j) => (
                    <span key={j} className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      ~ {f}
                    </span>
                  ))}
                  {cmd.filesDeleted?.map((f, j) => (
                    <span key={j} className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">
                      - {f}
                    </span>
                  ))}
                </div>
              )}

              {cmd.risk && cmd.risk !== 'low' && (
                <div className="flex items-center gap-3 p-2 rounded bg-red-500/5 border border-red-500/10 mt-2">
                  <AlertTriangle size={14} className="text-red-500 shrink-0" />
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={cmd.risk === 'high' ? 'high' : 'medium'} />
                    <span className="text-[11px] text-text-secondary leading-tight">
                      {cmd.riskDescription}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
