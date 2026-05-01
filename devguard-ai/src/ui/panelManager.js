const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

class PanelManager {
  /**
   * @param {vscode.ExtensionContext} context
   * @param {(message: any) => void} onMessage - Handler for messages from webview
   */
  constructor(context, onMessage) {
    this._context = context;
    this._onMessage = onMessage;
    /** @type {vscode.WebviewPanel|null} */
    this._panel = null;
    /** @type {vscode.WebviewView|null} */
    this._sidebarView = null;
  }

  /**
   * Opens the main dashboard panel.
   */
  openPanel() {
    if (this._panel) {
      this._panel.reveal(vscode.ViewColumn.One);
      return;
    }

    this._panel = vscode.window.createWebviewPanel(
      'devguardAI',
      'DevGuard AI',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(this._context.extensionPath, 'webview', 'dist'))
        ]
      }
    );

    this._panel.webview.html = this._getWebviewHtml(this._panel.webview);
    this._panel.webview.onDidReceiveMessage(this._onMessage, undefined, this._context.subscriptions);
    this._panel.onDidDispose(() => { this._panel = null; }, null, this._context.subscriptions);
  }

  /**
   * Registers the sidebar webview view provider.
   * @returns {vscode.Disposable}
   */
  registerSidebarProvider() {
    const provider = {
      resolveWebviewView: (webviewView) => {
        this._sidebarView = webviewView;
        webviewView.webview.options = {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(this._context.extensionPath, 'webview', 'dist'))
          ]
        };
        webviewView.webview.html = this._getWebviewHtml(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(this._onMessage, undefined, this._context.subscriptions);
      }
    };

    return vscode.window.registerWebviewViewProvider('devguard-ai.sidebarView', provider);
  }

  /**
   * Send data to the webview (both panel and sidebar).
   * @param {string} type
   * @param {any} data
   */
  postMessage(type, data) {
    const message = { type, ...data };
    if (this._panel) {
      this._panel.webview.postMessage(message);
    }
    if (this._sidebarView) {
      this._sidebarView.webview.postMessage(message);
    }
  }

  /**
   * Generates the webview HTML, replacing asset paths.
   * @param {vscode.Webview} webview
   * @returns {string}
   */
  _getWebviewHtml(webview) {
    const distPath = path.join(this._context.extensionPath, 'webview', 'dist');
    const htmlPath = path.join(distPath, 'index.html');

    if (!fs.existsSync(htmlPath)) {
      return `<!DOCTYPE html><html><body style="color:#ccc;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;">
        <div style="text-align:center"><h2>⚠️ Webview not built</h2><p>Run <code>cd webview && npm run build</code></p></div>
      </body></html>`;
    }

    let html = fs.readFileSync(htmlPath, 'utf8');

    const assetsUri = webview.asWebviewUri(vscode.Uri.file(path.join(distPath, 'assets')));
    const distUri = webview.asWebviewUri(vscode.Uri.file(distPath));

    // Replace all asset references
    html = html.replace(/src="\.\/assets\//g, `src="${assetsUri}/`);
    html = html.replace(/href="\.\/assets\//g, `href="${assetsUri}/`);
    html = html.replace(/src="\.\//g, `src="${distUri}/`);
    html = html.replace(/href="\.\//g, `href="${distUri}/`);

    return html;
  }
}

module.exports = PanelManager;
