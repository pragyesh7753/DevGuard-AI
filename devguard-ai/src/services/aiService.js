/**
 * AI Service — modular wrapper for AI-powered code analysis.
 * Falls back to rule-based analysis when no API key is configured.
 */

const vscode = require('vscode');

class AIService {
  constructor() {
    this._enabled = false;
    this._apiKey = '';
    this._model = 'DeepSeek-V3';
    this._refreshConfig();
  }

  _refreshConfig() {
    const config = vscode.workspace.getConfiguration('devguardAI');
    this._apiKey = process.env.SAMBANOVA_API_KEY;
    this._model = process.env.SAMBANOVA_MODEL || 'DeepSeek-V3';
    this._enabled = !!this._apiKey;
  }

  get isEnabled() {
    this._refreshConfig();
    return this._enabled;
  }

  /**
   * Generate an AI-powered fix for a code issue.
   * @param {{ title: string, description: string, fix: string, snippet: string }} issue
   * @param {string} fileContent - Full file content
   * @param {string} filePath
   * @returns {Promise<{ suggestion: string, explanation: string } | null>}
   */
  async generateFix(issue, fileContent, filePath) {
    if (!this.isEnabled) return null;

    const prompt = `You are a senior software engineer. A code analysis tool found this issue:

File: ${filePath}
Issue: ${issue.title}
Description: ${issue.description}
Suggested fix: ${issue.fix}
Code snippet: ${issue.snippet}

Full file content:
\`\`\`
${fileContent.substring(0, 4000)}
\`\`\`

Provide:
1. The corrected code snippet (just the relevant lines)
2. A brief explanation of the fix

Respond in JSON format: { "suggestion": "corrected code", "explanation": "why this fixes it" }`;

    try {
      const response = await this._callApi(prompt);
      return JSON.parse(response);
    } catch (err) {
      console.error('AI fix generation failed:', err.message);
      return null;
    }
  }

  /**
   * AI-powered deeper analysis of code for issues that rule-based can't catch.
   * @param {string} content
   * @param {string} filePath
   * @returns {Promise<Array<{title: string, description: string, severity: string, line: number, fix: string}> | null>}
   */
  async deepAnalyze(content, filePath) {
    if (!this.isEnabled) return null;

    const prompt = `Analyze this code for security vulnerabilities, performance issues, bugs, and code quality problems.

File: ${filePath}
\`\`\`
${content.substring(0, 6000)}
\`\`\`

Return a JSON array of issues found. Each issue should have:
- title: short issue title
- description: what's wrong
- severity: one of "critical", "high", "medium", "low", "info"
- line: approximate line number
- fix: how to fix it
- category: one of "security", "performance", "quality", "bugs"

Only return real, actionable issues. Return [] if code is clean.
Respond with ONLY the JSON array, no markdown.`;

    try {
      const response = await this._callApi(prompt);
      const parsed = JSON.parse(response);
      return Array.isArray(parsed) ? parsed.map(issue => ({
        ...issue,
        id: `AI-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        filePath,
        snippet: '',
        subcategory: 'AI Analysis',
        isAiGenerated: true
      })) : null;
    } catch (err) {
      console.error('AI deep analysis failed:', err.message);
      return null;
    }
  }

  /**
   * Call the SambaNova API (OpenAI-compatible).
   * @param {string} prompt
   * @returns {Promise<string>}
   */
  async _callApi(prompt) {
    this._refreshConfig();

    const response = await fetch('https://api.sambanova.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this._apiKey}`
      },
      body: JSON.stringify({
        model: this._model,
        messages: [
          { role: 'system', content: 'You are a code security and quality analysis expert. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`SambaNova API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }
}

module.exports = AIService;
