# DevGuard AI

DevGuard AI is a VS Code extension for AI-assisted code review and security analysis. It tracks file changes, detects risky patterns, and suggests fixes while you work.

## Features

- Run security and quality analysis on the active file.
- Review findings in a dedicated DevGuard AI dashboard.
- Automatically analyze files when they are saved.
- Keep short-term save history for recent change review.
- Track terminal activity and related file-system effects.
- Use SambaNova-powered AI analysis when an API key is configured.
- Fall back to rule-based analysis when no API key is available.

## Commands

Open the Command Palette and run:

- `DevGuard AI: Open Dashboard`
- `DevGuard AI: Run Analysis on Current File`
- `DevGuard AI: Clear Save History`

## Configuration

DevGuard AI contributes these settings:

- `devguardAI.sambanovaApiKey`: SambaNova API key for AI-powered analysis.
- `devguardAI.sambanovaModel`: SambaNova model used for analysis.
- `devguardAI.autoAnalyzeOnSave`: Automatically analyze files on save.
- `devguardAI.historyRetentionDays`: Number of days to keep file save history.
- `devguardAI.enableTerminalTracking`: Track terminal commands and file-system effects.

## Getting Started

1. Install DevGuard AI.
2. Open the DevGuard AI view from the Activity Bar.
3. Optionally add your SambaNova API key in VS Code settings.
4. Run `DevGuard AI: Run Analysis on Current File` from the Command Palette.

## Privacy

When AI analysis is enabled, code content may be sent to the configured SambaNova model provider for analysis. Leave `devguardAI.sambanovaApiKey` empty to use rule-based local analysis only.

## Repository

Source code and issues are available on GitHub:

https://github.com/pragyesh7753/DevGuard-AI

## License

MIT
