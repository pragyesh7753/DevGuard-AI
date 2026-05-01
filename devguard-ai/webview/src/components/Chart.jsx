import { SEVERITY } from '../utils/constants';

export default function Chart({ summary }) {
  if (!summary || summary.total === 0) return null;

  const data = ['critical', 'high', 'medium', 'low', 'info']
    .map(key => ({ key, count: summary[key] || 0, ...SEVERITY[key] }))
    .filter(d => d.count > 0);

  const total = data.reduce((s, d) => s + d.count, 0);
  const size = 120;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className="dg-chart-container">
      <div className="dg-chart-title">Issue Distribution</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {data.map((d) => {
            const pct = d.count / total;
            const dashLength = pct * circumference;
            const dashOffset = -offset;
            offset += dashLength;

            return (
              <circle
                key={d.key}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{ transition: 'all 0.5s ease' }}
              />
            );
          })}
          <text
            x={size / 2}
            y={size / 2 - 4}
            textAnchor="middle"
            fill="var(--dg-text-primary)"
            fontSize="22"
            fontWeight="700"
          >
            {total}
          </text>
          <text
            x={size / 2}
            y={size / 2 + 14}
            textAnchor="middle"
            fill="var(--dg-text-muted)"
            fontSize="10"
          >
            issues
          </text>
        </svg>

        <div className="dg-chart-legend" style={{ flexDirection: 'column', gap: '6px' }}>
          {data.map(d => (
            <div key={d.key} className="dg-chart-legend-item">
              <span className="dg-chart-legend-dot" style={{ background: d.color }} />
              <span>{d.label}</span>
              <span style={{ fontWeight: 600, color: d.color }}>{d.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
