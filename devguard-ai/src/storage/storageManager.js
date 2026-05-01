const vscode = require('vscode');
const fs = require('fs-extra');
const path = require('path');

/**
 * @typedef {Object} FileSnapshot
 * @property {string} filePath - Absolute path to the file
 * @property {string} content - File content at time of snapshot
 * @property {number} timestamp - Unix timestamp (ms)
 * @property {'save'|'git'|'command'|'manual'} trigger - What caused this snapshot
 * @property {string} [triggerDetail] - Additional detail (e.g., command name)
 */

/**
 * @typedef {Object} SnapshotIndex
 * @property {string} filePath
 * @property {number} timestamp
 * @property {string} snapshotFile - Filename in snapshots dir
 * @property {'save'|'git'|'command'|'manual'} trigger
 */

class StorageManager {
  /** @param {vscode.ExtensionContext} context */
  constructor(context) {
    this._context = context;
    this._storagePath = path.join(context.globalStorageUri.fsPath, 'devguard-data');
    this._snapshotsDir = path.join(this._storagePath, 'snapshots');
    this._indexPath = path.join(this._storagePath, 'index.json');
    /** @type {SnapshotIndex[]} */
    this._index = [];
    this._initialized = false;
  }

  async init() {
    if (this._initialized) return;
    await fs.ensureDir(this._snapshotsDir);

    if (await fs.pathExists(this._indexPath)) {
      try {
        this._index = await fs.readJson(this._indexPath);
      } catch {
        this._index = [];
      }
    }

    this._initialized = true;
    await this._pruneOldSnapshots();
  }

  /**
   * Saves a snapshot of a file's content.
   * @param {string} filePath
   * @param {string} content
   * @param {'save'|'git'|'command'|'manual'} trigger
   * @param {string} [triggerDetail]
   * @returns {Promise<SnapshotIndex>}
   */
  async saveSnapshot(filePath, content, trigger, triggerDetail) {
    await this.init();

    const timestamp = Date.now();
    const snapshotFile = `${timestamp}-${Buffer.from(filePath).toString('base64url').slice(0, 40)}.json`;

    /** @type {FileSnapshot} */
    const snapshot = {
      filePath,
      content,
      timestamp,
      trigger,
      ...(triggerDetail && { triggerDetail })
    };

    await fs.writeJson(path.join(this._snapshotsDir, snapshotFile), snapshot);

    /** @type {SnapshotIndex} */
    const entry = { filePath, timestamp, snapshotFile, trigger };
    this._index.push(entry);
    await this._saveIndex();

    return entry;
  }

  /**
   * Gets all snapshots for a given file, ordered by time.
   * @param {string} filePath
   * @returns {Promise<FileSnapshot[]>}
   */
  async getHistory(filePath) {
    await this.init();
    const entries = this._index
      .filter(e => e.filePath === filePath)
      .sort((a, b) => a.timestamp - b.timestamp);

    const snapshots = [];
    for (const entry of entries) {
      try {
        const snap = await fs.readJson(path.join(this._snapshotsDir, entry.snapshotFile));
        snapshots.push(snap);
      } catch {
        // Snapshot file missing — skip
      }
    }
    return snapshots;
  }

  /**
   * Gets the most recent snapshot for a file (the "previous" version).
   * @param {string} filePath
   * @returns {Promise<FileSnapshot|null>}
   */
  async getLatestSnapshot(filePath) {
    await this.init();
    const entries = this._index
      .filter(e => e.filePath === filePath)
      .sort((a, b) => b.timestamp - a.timestamp);

    if (entries.length === 0) return null;

    try {
      return await fs.readJson(path.join(this._snapshotsDir, entries[0].snapshotFile));
    } catch {
      return null;
    }
  }

  /**
   * Computes a simple line-by-line diff between two content strings.
   * @param {string} oldContent
   * @param {string} newContent
   * @returns {{ added: string[], removed: string[], changed: boolean }}
   */
  diffContents(oldContent, newContent) {
    const oldLines = oldContent.split('\n');
    const newLines = newContent.split('\n');
    const added = [];
    const removed = [];

    const maxLen = Math.max(oldLines.length, newLines.length);
    for (let i = 0; i < maxLen; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];

      if (oldLine === undefined && newLine !== undefined) {
        added.push(newLine);
      } else if (newLine === undefined && oldLine !== undefined) {
        removed.push(oldLine);
      } else if (oldLine !== newLine) {
        removed.push(oldLine);
        added.push(newLine);
      }
    }

    return { added, removed, changed: added.length > 0 || removed.length > 0 };
  }

  /**
   * Returns a timeline of all tracked files with metadata.
   * @returns {Promise<Array<{filePath: string, snapshots: number, lastChange: number, lastTrigger: string}>>}
   */
  async getFileTimeline() {
    await this.init();

    /** @type {Map<string, SnapshotIndex[]>} */
    const grouped = new Map();
    for (const entry of this._index) {
      if (!grouped.has(entry.filePath)) grouped.set(entry.filePath, []);
      grouped.get(entry.filePath).push(entry);
    }

    const timeline = [];
    for (const [filePath, entries] of grouped) {
      const sorted = entries.sort((a, b) => b.timestamp - a.timestamp);
      timeline.push({
        filePath,
        snapshots: entries.length,
        lastChange: sorted[0].timestamp,
        lastTrigger: sorted[0].trigger
      });
    }

    return timeline.sort((a, b) => b.lastChange - a.lastChange);
  }

  /**
   * Clears all save history.
   */
  async clearHistory() {
    await fs.emptyDir(this._snapshotsDir);
    this._index = [];
    await this._saveIndex();
  }

  /** Remove snapshots older than the configured retention period. */
  async _pruneOldSnapshots() {
    const config = vscode.workspace.getConfiguration('devguardAI');
    const retentionDays = config.get('historyRetentionDays', 7);
    const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;

    const toRemove = this._index.filter(e => e.timestamp < cutoff);
    if (toRemove.length === 0) return;

    for (const entry of toRemove) {
      try {
        await fs.remove(path.join(this._snapshotsDir, entry.snapshotFile));
      } catch {
        // Ignore removal errors
      }
    }

    this._index = this._index.filter(e => e.timestamp >= cutoff);
    await this._saveIndex();
  }

  async _saveIndex() {
    await fs.writeJson(this._indexPath, this._index);
  }
}

module.exports = StorageManager;
