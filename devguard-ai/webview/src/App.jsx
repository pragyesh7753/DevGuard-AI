import { useState, useCallback } from 'react';
import { RefreshCw, Shield } from 'lucide-react';
import { useVsCode, useExtensionMessage } from './hooks/useVsCode';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TabBar from './components/TabBar';
import IssueCard from './components/IssueCard';
import FileTimeline from './components/FileTimeline';
import TerminalLog from './components/TerminalLog';

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

  // Filter issues based on active view/tab
  const getFilteredIssues = () => {
    let filtered = issues;

    // If we're on a category sidebar view
    if (['security', 'performance', 'quality', 'bugs'].includes(activeView)) {
      filtered = issues.filter(i => i.category === activeView);
    }

    // If we're using the tab bar filter on dashboard
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
    if (activeView === 'files') {
      return <FileTimeline timeline={timeline} />;
    }

    if (activeView === 'terminal') {
      return <TerminalLog commands={commands} />;
    }

    if (activeView === 'dashboard') {
      return (
        <>
          <Dashboard
            issues={getFilteredIssues()}
            summary={summary}
            gitSummary={gitSummary}
            timeline={timeline}
            onFix={handleFix}
          />
        </>
      );
    }

    // Category view (security, performance, quality, bugs)
    const filtered = getFilteredIssues();
    if (filtered.length === 0) {
      return (
        <div className="dg-empty">
          <div className="dg-empty-icon">✨</div>
          <h3>No {activeView} issues found</h3>
          <p>Great job! No issues detected in this category.</p>
        </div>
      );
    }

    return (
      <div>
        <div className="dg-section-title">
          {filtered.length} {activeView} issue{filtered.length !== 1 ? 's' : ''}
        </div>
        {filtered.map((issue, i) => (
          <IssueCard key={`${issue.id}-${issue.line}-${i}`} issue={issue} onFix={handleFix} />
        ))}
      </div>
    );
  };

  return (
    <div className="dg-layout">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="dg-main">
        {/* Header */}
        <div className="dg-header">
          <div className="dg-header-title">
            <div className="dg-logo">
              <Shield size={14} />
            </div>
            <h1>DevGuard AI</h1>
            {analyzing && <span className="dg-pulse" />}
          </div>
          <div className="dg-header-actions">
            <button className="dg-btn dg-btn-primary" onClick={handleRunAnalysis}>
              <RefreshCw size={12} />
              Analyze
            </button>
          </div>
        </div>

        {/* Tab Bar (only on dashboard) */}
        {activeView === 'dashboard' && (
          <TabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            issueCounts={issueCounts}
          />
        )}

        {/* Content */}
        <div className="dg-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}