import { SEVERITY } from '../utils/constants';

export default function Chart({ summary }) {
  if (!summary || summary.total === 0) return null;

  const data = ['critical', 'high', 'medium', 'low', 'info']
    .map(key => ({ key, count: summary[key] || 0, ...SEVERITY[key] }))
    .filter(d => d.count > 0);

  const total = data.reduce((s, d) => s + d.count, 0);
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-10">
      <div className="relative group">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-slate-800"
            strokeWidth={strokeWidth}
          />
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
                strokeLinecap="butt"
                className="transition-all duration-700 ease-out"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tracking-tight text-text-base">{total}</span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-text-dim">Total</span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-3">
        {data.map(d => (
          <div key={d.key} className="flex items-center justify-between group/item">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
              <span className="text-xs font-medium text-text-secondary group-hover/item:text-text-base transition-colors">{d.label}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden md:block">
                <div 
                  className="h-full rounded-full transition-all duration-1000" 
                  style={{ background: d.color, width: `${(d.count / total) * 100}%` }}
                />
              </div>
              <span className="text-[11px] font-bold min-w-[20px] text-right" style={{ color: d.color }}>{d.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
