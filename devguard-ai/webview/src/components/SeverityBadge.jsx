export default function SeverityBadge({ severity }) {
  return (
    <span className={`dg-badge ${severity}`}>
      {severity}
    </span>
  );
}
