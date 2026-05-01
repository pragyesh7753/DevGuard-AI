const vscode = require('vscode');
const fs = require('fs-extra');
const path = require('path');

/**
 * @typedef {Object} TrackedCommand
 * @property {string} command
 * @property {number} timestamp
 * @property {string[]} filesCreated
 * @property {string[]} filesModified
 * @property {string[]} filesDeleted
 * @property {'pending'|'completed'} status
 */

const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', '__pycache__', '.vscode-test']);

class TerminalTracker {
  constructor(context, onCommandComplete) {
    this._commands = [];
    this._context = context;
    this._disposables = [];
    this._onCommandComplete = onCommandComplete || (() => {});
    this._preCommandState = new Map();
    this._isCapturing = false;
  }

  activate() {
    if (vscode.window.onDidStartTerminalShellExecution) {
      this._disposables.push(
        vscode.window.onDidStartTerminalShellExecution(async (e) => {
          const commandLine = e.execution.commandLine?.value || '';
          if (!commandLine.trim()) return;
          await this._capturePreState();
          this._commands.push({
            command: commandLine, timestamp: Date.now(),
            filesCreated: [], filesModified: [], filesDeleted: [], status: 'pending'
          });
        })
      );
      this._disposables.push(
        vscode.window.onDidEndTerminalShellExecution(async () => {
          const last = this._commands[this._commands.length - 1];
          if (!last || last.status !== 'pending') return;
          await new Promise(r => setTimeout(r, 1500));
          const changes = await this._detectChanges();
          Object.assign(last, { ...changes, status: 'completed' });
          if (changes.filesCreated.length || changes.filesModified.length || changes.filesDeleted.length) {
            this._onCommandComplete(last);
          }
        })
      );
    }

    this._disposables.push(vscode.window.onDidOpenTerminal(() => this._capturePreState()));
    this._disposables.push(vscode.window.onDidCloseTerminal(async (terminal) => {
      await new Promise(r => setTimeout(r, 500));
      const changes = await this._detectChanges();
      if (changes.filesCreated.length || changes.filesModified.length) {
        const tracked = {
          command: `[Terminal: ${terminal.name}]`, timestamp: Date.now(),
          ...changes, status: 'completed'
        };
        this._commands.push(tracked);
        this._onCommandComplete(tracked);
      }
    }));
  }

  async _capturePreState() {
    if (this._isCapturing) return;
    this._isCapturing = true;
    this._preCommandState.clear();
    const folders = vscode.workspace.workspaceFolders;
    if (folders) {
      try {
        await this._walkDir(folders[0].uri.fsPath, (fp, stats) => {
          this._preCommandState.set(fp, stats.mtimeMs);
        });
      } catch { /* ignore */ }
    }
    this._isCapturing = false;
  }

  async _detectChanges() {
    const result = { filesCreated: [], filesModified: [], filesDeleted: [] };
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || !this._preCommandState.size) return result;
    const root = folders[0].uri.fsPath;
    const current = new Map();
    try {
      await this._walkDir(root, (fp, stats) => current.set(fp, stats.mtimeMs));
    } catch { return result; }

    for (const [fp, mt] of current) {
      const rel = path.relative(root, fp);
      if (!this._preCommandState.has(fp)) result.filesCreated.push(rel);
      else if (mt > this._preCommandState.get(fp)) result.filesModified.push(rel);
    }
    for (const [fp] of this._preCommandState) {
      if (!current.has(fp)) result.filesDeleted.push(path.relative(root, fp));
    }
    return result;
  }

  async _walkDir(dir, cb) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const e of entries) {
        if (IGNORE_DIRS.has(e.name)) continue;
        const full = path.join(dir, e.name);
        if (e.isDirectory()) await this._walkDir(full, cb);
        else if (e.isFile()) { try { cb(full, await fs.stat(full)); } catch {} }
      }
    } catch {}
  }

  getCommands() { return [...this._commands].reverse(); }

  classifyCommand(command) {
    const cmd = command.toLowerCase().trim();
    if (/^(npm install|yarn add|pnpm add)/.test(cmd))
      return { category: 'dependency', risk: /--save-dev|-D/.test(cmd) ? 'low' : 'medium', description: 'New dependency — review for vulnerabilities' };
    if (/npx|generate|scaffold/.test(cmd))
      return { category: 'codegen', risk: 'medium', description: 'Code generation — review generated files' };
    if (/build|compile|webpack/.test(cmd))
      return { category: 'build', risk: 'low', description: 'Build command — check output' };
    if (/\brm\b|\bdel\b|remove/.test(cmd))
      return { category: 'destructive', risk: 'high', description: 'Destructive command — files may be deleted' };
    if (/chmod|chown|sudo/.test(cmd))
      return { category: 'permission', risk: 'high', description: 'Permission change — review security' };
    return { category: 'other', risk: 'low', description: 'General command' };
  }

  dispose() { this._disposables.forEach(d => d.dispose()); this._disposables = []; }
}

module.exports = TerminalTracker;
