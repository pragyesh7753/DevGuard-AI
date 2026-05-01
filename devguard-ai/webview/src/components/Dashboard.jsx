import { ShieldCheck, AlertTriangle, TrendingUp, FileText, ArrowUpRight } from 'lucide-react';
import Chart from './Chart';
import IssueCard from './IssueCard';

export default function Dashboard({ issues, summary, gitSummary, timeline, onFix }) {
  const recentIssues = issues.slice(0, 8);

  const stats = [
    { label: 'Total Issues', value: summary.total, trend: '+2% from last analysis', color: 'text-text-base' },
    { label: 'Critical', value: summary.critical, trend: 'Unchanged', color: 'text-red-500' },
    { label: 'High Priority', value: summary.high, trend: '-3 this session', color: 'text-orange-500' },
    { label: 'Workspace Snapshots', value: timeline?.length || 0, trend: 'Real-time monitoring', color: 'text-zinc-400' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-y border-border-base divide-x divide-border-base">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-transparent hover:bg-zinc-900/30 transition-colors">
            <div className="text-[9px] font-bold uppercase tracking-widest text-text-dim mb-3">{stat.label}</div>
            <div className={`text-2xl font-semibold tracking-tight mb-2 ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] text-zinc-500 font-medium">{stat.trend}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-text-dim flex items-center gap-2">
                <TrendingUp size={12} />
                Analytics Distribution
              </h3>
            </div>
            <div className="card p-8 bg-zinc-950/20">
              <Chart summary={summary} />
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-text-dim flex items-center gap-2">
                <AlertTriangle size={12} />
                Pending Rectifications
              </h3>
              {summary.total > 8 && (
                <button className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
                  View full report <ArrowUpRight size={10} />
                </button>
              )}
            </div>
            
            {summary.total === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 card bg-zinc-900/10 border-dashed">
                <ShieldCheck size={32} className="text-zinc-700 mb-4" />
                <h3 className="text-sm font-medium text-text-base">System is healthy</h3>
                <p className="text-[11px] text-text-muted mt-1">No vulnerabilities or optimizations identified.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {recentIssues.map((issue, i) => (
                  <IssueCard key={`${issue.id}-${issue.line}-${i}`} issue={issue} onFix={onFix} />
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <section>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-text-dim flex items-center gap-2 mb-6">
              <FileText size={12} />
              VCS Context
            </h3>
            
            <div className="card p-6 bg-zinc-900/10 divide-y divide-border-base">
              {gitSummary ? (
                <div className="space-y-6">
                  <div className="pb-6">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-text-dim mb-3">Branch Environment</div>
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-mono text-text-base flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {gitSummary.branch || 'main'}
                      </div>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Active</span>
                    </div>
                  </div>

                  <div className="py-6 grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-[11px] font-semibold text-emerald-500">+{gitSummary.added || 0}</div>
                      <div className="text-[8px] text-zinc-500 uppercase font-bold">Staged</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-orange-500">~{gitSummary.modified || 0}</div>
                      <div className="text-[8px] text-zinc-500 uppercase font-bold">Modified</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-red-500">-{gitSummary.deleted || 0}</div>
                      <div className="text-[8px] text-zinc-500 uppercase font-bold">Deleted</div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <div className="text-xl font-semibold tracking-tight text-text-base">
                      {gitSummary.totalChanges || 0}
                      <span className="text-[10px] font-medium text-zinc-500 ml-2 uppercase tracking-widest">Uncommitted</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center text-text-dim">
                  <FileText size={24} className="mx-auto mb-4 opacity-20" />
                  <p className="text-[10px] uppercase font-bold tracking-widest">No Repository Found</p>
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-text-dim mb-6">System Logs</h3>
            <div className="space-y-3">
              {timeline.slice(0, 6).map((t, i) => (
                <div key={i} className="flex gap-4 group cursor-default">
                  <div className="relative flex flex-col items-center pt-1">
                    <div className={`w-1.5 h-1.5 rounded-full transition-colors ${t.type === 'git' ? 'bg-zinc-700' : 'bg-white'}`} />
                    {i !== 5 && <div className="w-px h-full bg-zinc-800 my-1" />}
                  </div>
                  <div className="min-w-0 pb-4">
                    <div className="text-[11px] font-medium text-text-base truncate group-hover:text-white transition-colors">{t.file}</div>
                    <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter mt-1">{t.time} • {t.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
