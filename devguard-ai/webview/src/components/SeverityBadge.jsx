export default function SeverityBadge({ severity }) {
  const styles = {
    critical: 'bg-red-500/10 text-red-500 border-red-500/20',
    high: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    low: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    info: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[severity] || styles.info}`}>
      {severity}
    </span>
  );
}
