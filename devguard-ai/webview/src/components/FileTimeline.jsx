import { FileText, GitBranch, Terminal } from 'lucide-react';
import { timeAgo, getFileName } from '../utils/constants';

const TRIGGER_ICONS = { save: FileText, git: GitBranch, command: Terminal };
const TRIGGER_LABELS = { save: 'File saved', git: 'Git change', command: 'Command executed' };

export default function FileTimeline({ timeline }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="dg-empty">
        <div className="dg-empty-icon">📂</div>
        <h3>No file changes tracked yet</h3>
        <p>Start editing and saving files to see their change history here.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="dg-section-title">File Change History</div>
      <div className="dg-timeline">
        {timeline.map((item, i) => {
          const Icon = TRIGGER_ICONS[item.lastTrigger] || FileText;
          return (
            <div key={i} className="dg-timeline-item">
              <div className={`dg-timeline-dot ${item.lastTrigger || 'save'}`} />
              <div className="dg-timeline-info">
                <div className="dg-timeline-file">{getFileName(item.filePath)}</div>
                <div className="dg-timeline-meta">
                  {TRIGGER_LABELS[item.lastTrigger] || 'Modified'} · {item.snapshots} snapshot{item.snapshots !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="dg-timeline-time">{timeAgo(item.lastChange)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
