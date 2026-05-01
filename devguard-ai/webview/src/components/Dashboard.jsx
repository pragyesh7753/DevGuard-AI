import { ShieldCheck, AlertTriangle, TrendingUp, FileText } from 'lucide-react';
import Chart from './Chart';
import IssueCard from './IssueCard';

export default function Dashboard({ issues, summary, gitSummary, timeline, onFix }) {
  const recentIssues = issues.slice(0, 8);

  return (
    <div>
      {/* Stat Cards */}
      <div className="dg-stats">
        <div className="dg-stat-card">
          <div className="label">Total Issues</div>
          <div className={`value ${summary.total > 0 ? 'accent' : ''}`}>{summary.total}</div>
        </div>
        <div className="dg-stat-card">
          <div className="label">Critical</div>
          <div className={`value ${summary.critical > 0 ? 'critical' : ''}`}>{summary.critical}</div>
        </div>
        <div className="dg-stat-card">
          <div className="label">High</div>
          <div className={`value ${summary.high > 0 ? 'high' : ''}`}>{summary.high}</div>
        </div>
        <div className="dg-stat-card">
          <div className="label">Files Tracked</div>
          <div className="value accent">{timeline?.length || 0}</div>
        </div>
      </div>

      {/* Chart + Git Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <Chart summary={summary} />

        <div className="dg-chart-container">
          <div className="dg-chart-title">Git Status</div>
          {gitSummary ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={14} style={{ color: 'var(--dg-accent)' }} />
                <span style={{ fontSize: '12px', color: 'var(--dg-text-secondary)' }}>
                  Branch: <strong style={{ color: 'var(--dg-text-primary)' }}>{gitSummary.branch || 'N/A'}</strong>
                </span>
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                <span style={{ color: '#22c55e' }}>+{gitSummary.added || 0} added</span>
                <span style={{ color: 'var(--dg-medium)' }}>~{gitSummary.modified || 0} modified</span>
                <span style={{ color: 'var(--dg-critical)' }}>-{gitSummary.deleted || 0} deleted</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--dg-text-primary)' }}>
                {gitSummary.totalChanges || 0}
                <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--dg-text-muted)', marginLeft: '6px' }}>
                  uncommitted changes
                </span>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '12px', color: 'var(--dg-text-muted)' }}>
              <FileText size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              No git repository detected
            </div>
          )}
        </div>
      </div>

      {/* Recent Issues */}
      {summary.total === 0 ? (
        <div className="dg-empty">
          <div className="dg-empty-icon">
            <ShieldCheck size={48} />
          </div>
          <h3>All clear!</h3>
          <p>No issues detected. Save or modify files to trigger analysis.</p>
        </div>
      ) : (
        <div>
          <div className="dg-section-title">
            <AlertTriangle size={14} /> Recent Issues
          </div>
          {recentIssues.map((issue, i) => (
            <IssueCard key={`${issue.id}-${issue.line}-${i}`} issue={issue} onFix={onFix} />
          ))}
        </div>
      )}
    </div>
  );
}
