const vscode = require('vscode');
const path = require('path');

/**
 * @typedef {Object} DiffEntry
 * @property {string} filePath - Relative path from workspace root
 * @property {'modified'|'added'|'deleted'|'renamed'} status
 * @property {string} [diff] - Unified diff text
 * @property {string[]} [addedLines]
 * @property {string[]} [removedLines]
 */

class GitService {
  constructor() {
    /** @type {import('vscode').Extension|undefined} */
    this._gitExtension = undefined;
    this._api = undefined;
  }

  /**
   * Lazily initializes the git extension API.
   * @returns {object|null} Git API or null if git extension unavailable
   */
  _getGitApi() {
    if (this._api) return this._api;

    try {
      this._gitExtension = vscode.extensions.getExtension('vscode.git');
      if (!this._gitExtension) return null;

      if (!this._gitExtension.isActive) {
        // The git extension should auto-activate, but just in case
        return null;
      }

      const git = this._gitExtension.exports.getAPI(1);
      if (!git) return null;

      this._api = git;
      return this._api;
    } catch {
      return null;
    }
  }

  /**
   * Gets the first git repository in the workspace.
   * @returns {object|null}
   */
  _getRepo() {
    const api = this._getGitApi();
    if (!api || api.repositories.length === 0) return null;
    return api.repositories[0];
  }

  /**
   * Gets the current branch name.
   * @returns {string|null}
   */
  getCurrentBranch() {
    const repo = this._getRepo();
    if (!repo || !repo.state.HEAD) return null;
    return repo.state.HEAD.name || null;
  }

  /**
   * Gets changes between HEAD and the working tree (unstaged changes).
   * @returns {DiffEntry[]}
   */
  getWorkingTreeChanges() {
    const repo = this._getRepo();
    if (!repo) return [];

    return repo.state.workingTreeChanges.map(change => this._mapChange(change, repo));
  }

  /**
   * Gets staged changes (index changes).
   * @returns {DiffEntry[]}
   */
  getStagedChanges() {
    const repo = this._getRepo();
    if (!repo) return [];

    return repo.state.indexChanges.map(change => this._mapChange(change, repo));
  }

  /**
   * Gets all changes (working tree + staged).
   * @returns {DiffEntry[]}
   */
  getAllChanges() {
    return [...this.getWorkingTreeChanges(), ...this.getStagedChanges()];
  }

  /**
   * Gets the diff content for a specific file against HEAD.
   * @param {string} filePath - Absolute file path
   * @returns {Promise<string|null>} Unified diff text
   */
  async getFileDiff(filePath) {
    const repo = this._getRepo();
    if (!repo) return null;

    try {
      const diff = await repo.diffWith('HEAD', filePath);
      return diff || null;
    } catch {
      return null;
    }
  }

  /**
   * Shows the content of a file at HEAD revision.
   * @param {string} filePath - Absolute file path
   * @returns {Promise<string|null>}
   */
  async getHeadContent(filePath) {
    const repo = this._getRepo();
    if (!repo) return null;

    try {
      const relativePath = path.relative(repo.rootUri.fsPath, filePath);
      const headUri = vscode.Uri.parse(`git:${relativePath}?HEAD`);
      const doc = await vscode.workspace.openTextDocument(headUri);
      return doc.getText();
    } catch {
      return null;
    }
  }

  /**
   * Gets recent commit history.
   * @param {number} [count=10]
   * @returns {Promise<Array<{hash: string, message: string, date: string, author: string}>>}
   */
  async getCommitHistory(count = 10) {
    const repo = this._getRepo();
    if (!repo) return [];

    try {
      const log = await repo.log({ maxEntries: count });
      return log.map(commit => ({
        hash: commit.hash.substring(0, 8),
        message: commit.message,
        date: commit.authorDate ? new Date(commit.authorDate).toISOString() : '',
        author: commit.authorName || ''
      }));
    } catch {
      return [];
    }
  }

  /**
   * Generates a readable summary of current git changes.
   * @returns {{ totalChanges: number, modified: number, added: number, deleted: number, files: DiffEntry[], branch: string|null }}
   */
  getChangeSummary() {
    const changes = this.getAllChanges();
    const branch = this.getCurrentBranch();

    let modified = 0, added = 0, deleted = 0;
    for (const change of changes) {
      switch (change.status) {
        case 'modified': modified++; break;
        case 'added': added++; break;
        case 'deleted': deleted++; break;
      }
    }

    return {
      totalChanges: changes.length,
      modified,
      added,
      deleted,
      files: changes,
      branch
    };
  }

  /**
   * Registers a callback for when the repository state changes (branch switch, etc.).
   * @param {() => void} callback
   * @returns {vscode.Disposable|null}
   */
  onDidChange(callback) {
    const repo = this._getRepo();
    if (!repo) return null;

    return repo.state.onDidChange(callback);
  }

  /**
   * Maps a VS Code git change object to our DiffEntry format.
   * @param {object} change
   * @param {object} repo
   * @returns {DiffEntry}
   */
  _mapChange(change, repo) {
    const rootPath = repo.rootUri.fsPath;
    const filePath = change.uri.fsPath;
    const relativePath = path.relative(rootPath, filePath);

    /** @type {DiffEntry['status']} */
    let status = 'modified';
    switch (change.status) {
      case 1: status = 'modified'; break;  // Status.INDEX_MODIFIED / MODIFIED
      case 5: status = 'added'; break;     // Status.INDEX_ADDED
      case 6: status = 'deleted'; break;   // Status.DELETED
      case 3: status = 'renamed'; break;   // Status.INDEX_RENAMED
      // Git status codes: 0=INDEX_MODIFIED, 1=MODIFIED, 2=INDEX_ADDED, etc.
      // The exact values depend on VS Code version; we handle common ones
      default:
        if (change.status <= 2) status = 'modified';
        else if (change.status <= 4) status = 'added';
        else if (change.status >= 6) status = 'deleted';
    }

    return {
      filePath: relativePath,
      status
    };
  }
}

module.exports = GitService;
