import { useState, useCallback } from 'react';
import { RefreshCw, Shield } from 'lucide-react';
import { useVsCode, useExtensionMessage } from './hooks/useVsCode';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TabBar from './components/TabBar';
import IssueCard from './components/IssueCard';
import FileTimeline from './components/FileTimeline';
import TerminalLog from './components/TerminalLog';
import Visualization from './components/Visualization';


const EMPTY_SUMMARY = { total: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0, byCategory: {} };

export default function App() {
  const { postMessage } = useVsCode();
  const [activeView, setActiveView] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('all');
  const [issues, setIssues] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [gitSummary, setGitSummary] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [commands, setCommands] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);

  // Listen for messages from extension
  useExtensionMessage('analysisResults', useCallback((msg) => {
    setIssues(msg.issues || []);
    setSummary(msg.summary || EMPTY_SUMMARY);
    setAnalyzing(false);
  }, []));

  useExtensionMessage('gitSummary', useCallback((msg) => {
    setGitSummary(msg.data || null);
  }, []));

  useExtensionMessage('fileTimeline', useCallback((msg) => {
    setTimeline(msg.data || []);
  }, []));

  useExtensionMessage('terminalCommands', useCallback((msg) => {
    setCommands(msg.data || []);
  }, []));

  useExtensionMessage('analyzing', useCallback(() => {
    setAnalyzing(true);
  }, []));

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    postMessage('runAnalysis');
  };

  const handleFix = (issue, action) => {
    postMessage('issueAction', { issue, action });
  };

  const getFilteredIssues = () => {
    let filtered = issues;
    if (['security', 'performance', 'quality', 'bugs'].includes(activeView)) {
      filtered = issues.filter(i => i.category === activeView);
    }
    if (activeView === 'dashboard' && activeTab !== 'all') {
      filtered = issues.filter(i => i.category === activeTab);
    }
    return filtered;
  };

  const issueCounts = {
    security: issues.filter(i => i.category === 'security').length,
    performance: issues.filter(i => i.category === 'performance').length,
    quality: issues.filter(i => i.category === 'quality').length,
    bugs: issues.filter(i => i.category === 'bugs').length,
  };

  const renderContent = () => {
    if (activeView === 'files') return <FileTimeline timeline={timeline} />;
    if (activeView === 'terminal') return <TerminalLog commands={commands} />;
    if (activeView === 'visualization') return <Visualization commands={commands} />;

    if (activeView === 'dashboard') {
      return (
        <Dashboard
          issues={getFilteredIssues()}
          summary={summary}
          gitSummary={gitSummary}
          timeline={timeline}
          onFix={handleFix}
        />
      );
    }

    const filtered = getFilteredIssues();
    if (filtered.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-4xl mb-4 opacity-40">✨</div>
          <h3 className="text-base font-semibold text-text-base">No {activeView} issues found</h3>
          <p className="text-sm text-text-muted mt-1">Great job! No issues detected in this category.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-dim mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          {filtered.length} {activeView} issue{filtered.length !== 1 ? 's' : ''} detected
        </div>
        <div className="space-y-2">
          {filtered.map((issue, i) => (
            <IssueCard key={`${issue.id}-${issue.line}-${i}`} issue={issue} onFix={handleFix} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full min-h-screen bg-bg-base text-text-base">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-border-base shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white">
              <Shield size={14} />
            </div>
            <h1 className="text-sm font-semibold tracking-tight">DevGuard AI</h1>
            {analyzing && (
              <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-medium text-primary border border-primary/20">
                <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                Analyzing
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="btn btn-primary h-8 px-3 text-xs" 
              onClick={handleRunAnalysis}
              disabled={analyzing}
            >
              <RefreshCw size={12} className={analyzing ? 'animate-spin' : ''} />
              Run Analysis
            </button>
          </div>
        </header>

        {/* View Specific Tabs */}
        {activeView === 'dashboard' && (
          <div className="px-6 border-b border-border-base shrink-0">
            <TabBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              issueCounts={issueCounts}
            />
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}