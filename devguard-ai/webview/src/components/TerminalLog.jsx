import { Terminal as TerminalIcon, AlertTriangle } from 'lucide-react';
import SeverityBadge from './SeverityBadge';
import { timeAgo } from '../utils/constants';

export default function TerminalLog({ commands }) {
  if (!commands || commands.length === 0) {
    return (
      <div className="dg-empty">
        <div className="dg-empty-icon">⌨️</div>
        <h3>No terminal commands tracked</h3>
        <p>Commands executed in the integrated terminal will appear here with their file system impact.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="dg-section-title">
        <TerminalIcon size={14} /> Terminal Activity
      </div>
      {commands.map((cmd, i) => (
        <div key={i} className="dg-terminal-card">
          <div className="dg-terminal-cmd">
            <span className="prompt">$</span>
            <span>{cmd.command}</span>
            <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--dg-text-muted)' }}>
              {timeAgo(cmd.timestamp)}
            </span>
          </div>

          {cmd.filesCreated?.length > 0 && (
            <div className="dg-terminal-files">
              {cmd.filesCreated.map((f, j) => (
                <span key={j} className="dg-terminal-file-tag created">+ {f}</span>
              ))}
            </div>
          )}

          {cmd.filesModified?.length > 0 && (
            <div className="dg-terminal-files" style={{ marginTop: '4px' }}>
              {cmd.filesModified.map((f, j) => (
                <span key={j} className="dg-terminal-file-tag modified">~ {f}</span>
              ))}
            </div>
          )}

          {cmd.filesDeleted?.length > 0 && (
            <div className="dg-terminal-files" style={{ marginTop: '4px' }}>
              {cmd.filesDeleted.map((f, j) => (
                <span key={j} className="dg-terminal-file-tag deleted">- {f}</span>
              ))}
            </div>
          )}

          {cmd.risk && cmd.risk !== 'low' && (
            <div className="dg-terminal-risk">
              <AlertTriangle size={12} />
              <SeverityBadge severity={cmd.risk === 'high' ? 'high' : 'medium'} />
              <span style={{ fontSize: '11px', color: 'var(--dg-text-secondary)' }}>
                {cmd.riskDescription}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
