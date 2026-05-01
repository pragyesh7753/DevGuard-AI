const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const StorageManager = require('./src/storage/storageManager');
const GitService = require('./src/git/gitService');
const TerminalTracker = require('./src/terminal/terminalTracker');
const AnalyzerPipeline = require('./src/analyzers/analyzerPipeline');
const AIService = require('./src/services/aiService');
const PanelManager = require('./src/ui/panelManager');

/** @type {StorageManager} */
let storage;
/** @type {GitService} */
let gitService;
/** @type {TerminalTracker} */
let terminalTracker;
/** @type {AnalyzerPipeline} */
let pipeline;
/** @type {AIService} */
let aiService;
/** @type {PanelManager} */
let panelManager;

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  console.log('DevGuard AI activating...');

  // Initialize services
  storage = new StorageManager(context);
  await storage.init();

  gitService = new GitService();
  pipeline = new AnalyzerPipeline();
  aiService = new AIService();

  // Panel Manager — handle webview messages
  panelManager = new PanelManager(context, handleWebviewMessage);

  // Terminal Tracker
  terminalTracker = new TerminalTracker(context, async (_command) => {
    // When a terminal command completes with file changes, re-analyze
    panelManager.postMessage('terminalCommands', { data: terminalTracker.getCommands() });
    await analyzeWorkspace('command');
  });

  const config = vscode.workspace.getConfiguration('devguardAI');
  if (config.get('enableTerminalTracking', true)) {
    terminalTracker.activate();
  }

  // ── Commands ──
  context.subscriptions.push(
    vscode.commands.registerCommand('devguard-ai.openPanel', () => {
      panelManager.openPanel();
      // Send initial data after a brief delay
      setTimeout(() => refreshAllData(), 500);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('devguard-ai.runAnalysis', () => {
      analyzeWorkspace('manual');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('devguard-ai.clearHistory', async () => {
      await storage.clearHistory();
      vscode.window.showInformationMessage('DevGuard AI: Save history cleared.');
      refreshAllData();
    })
  );

  // ── Sidebar Provider ──
  context.subscriptions.push(panelManager.registerSidebarProvider());

  // ── File Watchers ──
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(async (document) => {
      const filePath = document.uri.fsPath;
      const content = document.getText();

      // Get previous snapshot for diff
      const previousSnapshot = await storage.getLatestSnapshot(filePath);

      // Save new snapshot
      await storage.saveSnapshot(filePath, content, 'save');

      // Analyze if auto-analyze is enabled
      if (config.get('autoAnalyzeOnSave', true)) {
        const context = {};
        if (previousSnapshot) {
          context.diff = storage.diffContents(previousSnapshot.content, content);
        }
        context.trigger = 'save';

        panelManager.postMessage('analyzing', {});

        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath || '';
        const relativePath = path.relative(workspaceRoot, filePath);
        const result = pipeline.analyze(content, relativePath, context);

        // Merge with AI analysis if enabled
        if (aiService.isEnabled) {
          try {
            const aiIssues = await aiService.deepAnalyze(content, relativePath);
            if (aiIssues && aiIssues.length > 0) {
              result.issues.push(...aiIssues);
              result.summary.total += aiIssues.length;
            }
          } catch {
            console.error('AI analysis error');
          }
        }

        panelManager.postMessage('analysisResults', {
          issues: result.issues,
          summary: result.summary
        });

        refreshGitAndTimeline();
      }
    })
  );

  // Track file creation, deletion, rename
  context.subscriptions.push(
    vscode.workspace.onDidCreateFiles(() => refreshGitAndTimeline()),
    vscode.workspace.onDidDeleteFiles(() => refreshGitAndTimeline()),
    vscode.workspace.onDidRenameFiles(() => refreshGitAndTimeline())
  );

  // Git state changes (branch switch, etc.)
  const gitDisposable = gitService.onDidChange(() => {
    refreshGitAndTimeline();
    // Intentionally removed analyzeWorkspace('git') here because it fires on every save,
    // causing a race condition with onDidSaveTextDocument and triggering duplicate AI calls.
  });
  if (gitDisposable) context.subscriptions.push(gitDisposable);

  console.log('DevGuard AI activated successfully.');
}

/**
 * Handle messages from the webview.
 */
function handleWebviewMessage(message) {
  switch (message.type) {
    case 'runAnalysis':
      analyzeWorkspace('manual');
      break;

    case 'issueAction':
      handleIssueAction(message.issue, message.action);
      break;

    case 'requestData':
      refreshAllData();
      break;
  }
}

/**
 * Analyze all open/changed files in the workspace.
 */
async function analyzeWorkspace(trigger) {
  panelManager.postMessage('analyzing', {});

  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) return;

  const rootPath = workspaceFolders[0].uri.fsPath;
  const filesToAnalyze = [];

  // Get open editors' documents
  for (const tabGroup of vscode.window.tabGroups.all) {
    for (const tab of tabGroup.tabs) {
      if (tab.input && tab.input.uri) {
        try {
          const doc = await vscode.workspace.openTextDocument(tab.input.uri);
          const relativePath = path.relative(rootPath, doc.uri.fsPath);

          // Get diff context
          const previousSnapshot = await storage.getLatestSnapshot(doc.uri.fsPath);
          const context = { trigger };
          if (previousSnapshot) {
            context.diff = storage.diffContents(previousSnapshot.content, doc.getText());
          }

          filesToAnalyze.push({
            content: doc.getText(),
            filePath: relativePath,
            context
          });
        } catch {
          // File might not be text, skip it
        }
      }
    }
  }

  // Also analyze git changed files
  const gitChanges = gitService.getWorkingTreeChanges();
  for (const change of gitChanges) {
    if (change.status === 'deleted') continue;
    const alreadyIncluded = filesToAnalyze.some(f => f.filePath === change.filePath);
    if (alreadyIncluded) continue;

    try {
      const fullPath = path.join(rootPath, change.filePath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        filesToAnalyze.push({
          content,
          filePath: change.filePath,
          context: { trigger: 'git' }
        });
      }
    } catch {
      // Skip unreadable files
    }
  }

  if (filesToAnalyze.length === 0) {
    // If no files to analyze from tabs or git, try active editor first
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      const doc = activeEditor.document;
      const relativePath = path.relative(rootPath, doc.uri.fsPath);
      filesToAnalyze.push({
        content: doc.getText(),
        filePath: relativePath,
        context: { trigger }
      });
    } else {
      // If no active editor (e.g. dashboard is focused), scan the workspace (limit to 10 files to prevent API spam)
      const uris = await vscode.workspace.findFiles('**/*.{js,jsx,ts,tsx,py,go,java,c,cpp}', '**/node_modules/**', 10);
      for (const uri of uris) {
        try {
          const doc = await vscode.workspace.openTextDocument(uri);
          const relativePath = path.relative(rootPath, doc.uri.fsPath);
          filesToAnalyze.push({
            content: doc.getText(),
            filePath: relativePath,
            context: { trigger }
          });
        } catch { }
      }
    }
  }

  const result = pipeline.analyzeMultiple(filesToAnalyze);

  // Merge with AI analysis if enabled
  if (aiService.isEnabled) {
    try {
      // Run AI analysis sequentially to avoid rate limiting from SambaNova/OpenAI
      for (const f of filesToAnalyze) {
        const aiIssues = await aiService.deepAnalyze(f.content, f.filePath);
        if (aiIssues && aiIssues.length > 0) {
          result.issues.push(...aiIssues);
          result.summary.total += aiIssues.length;
          
          // Re-calculate category summary
          for (const issue of aiIssues) {
            result.summary[issue.severity] = (result.summary[issue.severity] || 0) + 1;
            result.summary.byCategory[issue.category] = (result.summary.byCategory[issue.category] || 0) + 1;
          }
        }
      }
      
      // Re-sort after adding AI issues
      const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
      result.issues.sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 5) - (SEVERITY_ORDER[b.severity] ?? 5));
      
    } catch {
      console.error('AI analysis error in analyzeWorkspace');
    }
  }

  panelManager.postMessage('analysisResults', {
    issues: result.issues,
    summary: result.summary
  });
}

/**
 * Handle fix/navigation actions from the webview.
 */
async function handleIssueAction(issue, action) {
  if (!issue) return;

  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) return;

  const rootPath = workspaceFolders[0].uri.fsPath;
  const fullPath = path.join(rootPath, issue.filePath);

  switch (action) {
    case 'goto': {
      try {
        const doc = await vscode.workspace.openTextDocument(fullPath);
        const editor = await vscode.window.showTextDocument(doc);
        const line = Math.max(0, (issue.line || 1) - 1);
        const pos = new vscode.Position(line, 0);
        editor.selection = new vscode.Selection(pos, pos);
        editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenter);
      } catch {
        vscode.window.showErrorMessage(`Could not open file: ${issue.filePath}`);
      }
      break;
    }

    case 'fix': {
      if (aiService.isEnabled) {
        try {
          const doc = await vscode.workspace.openTextDocument(fullPath);
          const content = doc.getText();
          const fix = await aiService.generateFix(issue, content, issue.filePath);

          if (fix && fix.suggestion) {
            // Show the suggestion as a diff
            vscode.window.showInformationMessage(
              `DevGuard AI Fix: ${fix.explanation}`,
              'Apply', 'Dismiss'
            ).then(choice => {
              if (choice === 'Apply') {
                // Apply the fix - open the file and show the suggestion
                vscode.window.showTextDocument(doc).then(editor => {
                  const line = Math.max(0, (issue.line || 1) - 1);
                  const pos = new vscode.Position(line, 0);
                  editor.selection = new vscode.Selection(pos, pos);
                  editor.revealRange(new vscode.Range(pos, pos));
                });
              }
            });
          } else {
            vscode.window.showInformationMessage(
              `DevGuard AI: ${issue.fix}`,
              'Go to File'
            ).then(choice => {
              if (choice === 'Go to File') handleIssueAction(issue, 'goto');
            });
          }
        } catch {
          vscode.window.showInformationMessage(`Fix suggestion: ${issue.fix}`);
        }
      } else {
        // No AI key — show the rule-based suggestion
        vscode.window.showInformationMessage(
          `DevGuard AI: ${issue.fix}`,
          'Go to File'
        ).then(choice => {
          if (choice === 'Go to File') handleIssueAction(issue, 'goto');
        });
      }
      break;
    }
  }
}

/**
 * Refresh git summary and file timeline data in the webview.
 */
function refreshGitAndTimeline() {
  const gitSummary = gitService.getChangeSummary();
  panelManager.postMessage('gitSummary', { data: gitSummary });

  storage.getFileTimeline().then(timeline => {
    panelManager.postMessage('fileTimeline', { data: timeline });
  });
}

/**
 * Send all data to the webview.
 */
function refreshAllData() {
  refreshGitAndTimeline();

  panelManager.postMessage('terminalCommands', {
    data: terminalTracker ? terminalTracker.getCommands() : []
  });

  // Run analysis on current workspace
  analyzeWorkspace('manual');
}

function deactivate() {
  if (terminalTracker) terminalTracker.dispose();
}

module.exports = { activate, deactivate };