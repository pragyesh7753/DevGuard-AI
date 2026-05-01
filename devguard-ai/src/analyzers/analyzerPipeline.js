/**
 * Analyzer Pipeline — orchestrates all analyzers and merges results.
 */

const SecurityAnalyzer = require('./securityAnalyzer');
const PerformanceAnalyzer = require('./performanceAnalyzer');
const CodeQualityAnalyzer = require('./codeQualityAnalyzer');
const BugRiskAnalyzer = require('./bugRiskAnalyzer');

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };

class AnalyzerPipeline {
  constructor() {
    this._analyzers = {
      security: new SecurityAnalyzer(),
      performance: new PerformanceAnalyzer(),
      quality: new CodeQualityAnalyzer(),
      bugs: new BugRiskAnalyzer()
    };
  }

  /**
   * Run all analyzers on a file.
   * @param {string} content - File content
   * @param {string} filePath - Relative file path
   * @param {{ trigger?: string, triggerDetail?: string, diff?: { added: string[], removed: string[] } }} [context]
   * @returns {{ issues: Array, summary: { total: number, critical: number, high: number, medium: number, low: number, info: number, byCategory: object } }}
   */
  analyze(content, filePath, context) {
    // Skip non-code files
    if (this._shouldSkip(filePath)) {
      return { issues: [], summary: this._emptySummary() };
    }

    const allIssues = [];

    for (const [, analyzer] of Object.entries(this._analyzers)) {
      try {
        const issues = analyzer.analyze(content, filePath);
        allIssues.push(...issues);
      } catch (err) {
        console.error(`Analyzer error on ${filePath}:`, err.message);
      }
    }

    // Attach root cause context
    if (context) {
      for (const issue of allIssues) {
        if (context.trigger) issue.trigger = context.trigger;
        if (context.triggerDetail) issue.triggerDetail = context.triggerDetail;
        if (context.diff) {
          // Check if issue line is in newly added lines
          const isNewCode = context.diff.added.some(addedLine =>
            addedLine.trim() === issue.snippet
          );
          issue.isNewIssue = isNewCode;
          issue.rootCause = isNewCode
            ? `Introduced in this ${context.trigger || 'change'}`
            : 'Pre-existing issue';
        }
      }
    }

    // Deduplicate by id + line
    const seen = new Set();
    const deduped = allIssues.filter(issue => {
      const key = `${issue.id}:${issue.line}:${issue.filePath}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort by severity
    deduped.sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 5) - (SEVERITY_ORDER[b.severity] ?? 5));

    return {
      issues: deduped,
      summary: this._buildSummary(deduped)
    };
  }

  /**
   * Run analysis on multiple files.
   * @param {Array<{content: string, filePath: string, context?: object}>} files
   * @returns {{ issues: Array, summary: object }}
   */
  analyzeMultiple(files) {
    const allIssues = [];

    for (const file of files) {
      const result = this.analyze(file.content, file.filePath, file.context);
      allIssues.push(...result.issues);
    }

    allIssues.sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 5) - (SEVERITY_ORDER[b.severity] ?? 5));

    return {
      issues: allIssues,
      summary: this._buildSummary(allIssues)
    };
  }

  _buildSummary(issues) {
    const summary = { total: issues.length, critical: 0, high: 0, medium: 0, low: 0, info: 0, byCategory: {} };

    for (const issue of issues) {
      summary[issue.severity] = (summary[issue.severity] || 0) + 1;
      if (!summary.byCategory[issue.category]) {
        summary.byCategory[issue.category] = 0;
      }
      summary.byCategory[issue.category]++;
    }

    return summary;
  }

  _emptySummary() {
    return { total: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0, byCategory: {} };
  }

  _shouldSkip(filePath) {
    const skipExtensions = ['.json', '.md', '.txt', '.svg', '.png', '.jpg', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.map', '.lock', '.log'];
    const skipPaths = ['node_modules', '.git', 'dist/', 'build/', '.next/', 'coverage/'];

    const ext = filePath.substring(filePath.lastIndexOf('.'));
    if (skipExtensions.includes(ext)) return true;
    if (skipPaths.some(p => filePath.includes(p))) return true;

    return false;
  }
}

module.exports = AnalyzerPipeline;
