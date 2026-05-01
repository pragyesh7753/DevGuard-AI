export const SEVERITY = {
  critical: { label: 'Critical', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', order: 0 },
  high:     { label: 'High',     color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', order: 1 },
  medium:   { label: 'Medium',   color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)',  order: 2 },
  low:      { label: 'Low',      color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', order: 3 },
  info:     { label: 'Info',     color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', order: 4 },
};

export const CATEGORIES = {
  security:    { label: 'Security',    color: '#ef4444', icon: 'Shield' },
  performance: { label: 'Performance', color: '#f97316', icon: 'Zap' },
  quality:     { label: 'Quality',     color: '#6366f1', icon: 'Code2' },
  bugs:        { label: 'Bug Risk',    color: '#eab308', icon: 'Bug' },
};

export const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',   icon: 'LayoutDashboard' },
  { id: 'security',    label: 'Security',    icon: 'Shield' },
  { id: 'performance', label: 'Performance', icon: 'Zap' },
  { id: 'quality',     label: 'Quality',     icon: 'Code2' },
  { id: 'bugs',        label: 'Bug Risk',    icon: 'Bug' },
  { id: 'files',       label: 'Files',       icon: 'FileText' },
  { id: 'terminal',    label: 'Terminal',     icon: 'Terminal' },
  { id: 'visualization', label: 'Visualization', icon: 'BarChart3' },
];


export function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function getFileName(filePath) {
  return filePath.split(/[/\\]/).pop() || filePath;
}
