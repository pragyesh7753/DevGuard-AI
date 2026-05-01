const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function activate(context) {
	const disposable = vscode.commands.registerCommand(
		'devguard-ai.openPanel',
		function () {

			const panel = vscode.window.createWebviewPanel(
				'devguardAI',
				'DevGuard AI',
				vscode.ViewColumn.One,
				{
					enableScripts: true
				}
			);

			const htmlPath = path.join(
				context.extensionPath,
				'webview',
				'dist',
				'index.html'
			);

			let html = fs.readFileSync(htmlPath, 'utf8');

			const assetsPath = panel.webview.asWebviewUri(
				vscode.Uri.file(
					path.join(
						context.extensionPath,
						'webview',
						'dist',
						'assets'
					)
				)
			);

			html = html.replace(/src="\.\/assets\//g, `src="${assetsPath}/`);
			html = html.replace(/href="\.\/assets\//g, `href="${assetsPath}/`);

			panel.webview.html = html;

			// Send data after panel loads
			setTimeout(() => {
				panel.webview.postMessage({
					type: "projectData",
					files: [
						"server.js",
						"auth.js",
						"package.json"
					]
				});
			}, 1000);
		}
	);

	context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = { activate, deactivate };