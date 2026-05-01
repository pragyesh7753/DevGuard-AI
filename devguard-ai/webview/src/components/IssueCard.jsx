import { useState } from 'react';
import { Shield, Zap, Code2, Bug, ChevronRight } from 'lucide-react';
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
      className={`dg-issue-card ${expanded ? 'expanded' : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="dg-issue-header">
        <div className={`dg-issue-icon ${issue.category}`}>
          <Icon size={14} />
        </div>
        <div className="dg-issue-info">
          <div className="dg-issue-title">{issue.title}</div>
          <div className="dg-issue-meta">
            <SeverityBadge severity={issue.severity} />
            <span className="dg-issue-file">{getFileName(issue.filePath)}</span>
            <span className="dg-issue-line">L{issue.line}</span>
          </div>
        </div>
        <ChevronRight
          size={14}
          style={{
            color: 'var(--dg-text-muted)',
            transition: 'transform 0.2s',
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            flexShrink: 0
          }}
        />
      </div>

      {expanded && (
        <div className="dg-issue-detail">
          <div className="dg-issue-description">{issue.description}</div>

          {issue.snippet && (
            <div className="dg-issue-snippet">{issue.snippet}</div>
          )}

          <div className="dg-issue-fix">
            <div className="label">Suggested Fix</div>
            {issue.fix}
          </div>

          {issue.rootCause && (
            <div className="dg-issue-root-cause">
              {issue.isNewIssue && <span className="new-tag">NEW</span>}
              {issue.rootCause}
            </div>
          )}

          <div className="dg-issue-actions">
            <button className="dg-btn dg-btn-primary dg-btn-sm" onClick={(e) => { e.stopPropagation(); onFix?.(issue, 'fix'); }}>
              Fix Issue
            </button>
            <button className="dg-btn dg-btn-sm" onClick={(e) => { e.stopPropagation(); onFix?.(issue, 'goto'); }}>
              Go to File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
