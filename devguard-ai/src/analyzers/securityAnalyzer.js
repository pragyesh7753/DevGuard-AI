/**
 * Security Analyzer — detects vulnerabilities via pattern matching.
 *
 * Categories: SQL injection, XSS, hardcoded secrets, unsafe eval,
 * auth bypass risk, insecure APIs.
 */

const RULES = [
  // SQL Injection
  {
    id: 'SEC001', category: 'security', subcategory: 'SQL Injection', severity: 'critical',
    pattern: /(?:query|execute|raw)\s*\(\s*[`"'].*\$\{/gm,
    title: 'Potential SQL injection via template literal',
    description: 'String interpolation in SQL query can lead to SQL injection. Use parameterized queries.',
    fix: 'Use parameterized queries with placeholders (e.g., `?` or `$1`) instead of string interpolation.'
  },
  {
    id: 'SEC002', category: 'security', subcategory: 'SQL Injection', severity: 'critical',
    pattern: /(?:query|execute|raw)\s*\(\s*["'].*\+\s*(?:req\.|input|user|param|body|query)/gm,
    title: 'SQL injection via string concatenation',
    description: 'Concatenating user input into SQL queries is extremely dangerous.',
    fix: 'Replace string concatenation with parameterized queries.'
  },
  // XSS
  {
    id: 'SEC003', category: 'security', subcategory: 'XSS', severity: 'high',
    pattern: /\.innerHTML\s*=\s*(?!['"`]<)/gm,
    title: 'Potential XSS via innerHTML',
    description: 'Setting innerHTML with dynamic content can execute malicious scripts.',
    fix: 'Use textContent or a sanitization library like DOMPurify.'
  },
  {
    id: 'SEC004', category: 'security', subcategory: 'XSS', severity: 'high',
    pattern: /dangerouslySetInnerHTML/gm,
    title: 'React dangerouslySetInnerHTML usage',
    description: 'dangerouslySetInnerHTML can lead to XSS if content is not sanitized.',
    fix: 'Sanitize HTML content with DOMPurify before passing to dangerouslySetInnerHTML.'
  },
  {
    id: 'SEC005', category: 'security', subcategory: 'XSS', severity: 'high',
    pattern: /document\.write\s*\(/gm,
    title: 'document.write usage',
    description: 'document.write can introduce XSS vulnerabilities and degrades performance.',
    fix: 'Use DOM manipulation methods (createElement, appendChild) instead.'
  },
  // Hardcoded Secrets
  {
    id: 'SEC006', category: 'security', subcategory: 'Hardcoded Secrets', severity: 'critical',
    pattern: /(?:api[_-]?key|apikey|secret|password|passwd|token|auth[_-]?token|access[_-]?key)\s*[:=]\s*['"][A-Za-z0-9+/=_-]{8,}['"]/gim,
    title: 'Hardcoded secret or API key detected',
    description: 'Secrets should never be hardcoded in source code. They can be leaked through version control.',
    fix: 'Use environment variables or a secrets manager. Store in .env and add to .gitignore.'
  },
  {
    id: 'SEC007', category: 'security', subcategory: 'Hardcoded Secrets', severity: 'high',
    pattern: /(?:AWS|aws)[_-]?(?:SECRET|ACCESS)[_-]?(?:KEY|ID)\s*[:=]\s*['"][A-Za-z0-9+/=]{16,}['"]/gm,
    title: 'AWS credentials hardcoded',
    description: 'AWS credentials in source code can lead to unauthorized cloud access.',
    fix: 'Use AWS IAM roles, environment variables, or AWS Secrets Manager.'
  },
  // Unsafe Eval
  {
    id: 'SEC008', category: 'security', subcategory: 'Unsafe Eval', severity: 'critical',
    pattern: /\beval\s*\(/gm,
    title: 'Use of eval()',
    description: 'eval() executes arbitrary code and is a major security risk.',
    fix: 'Use JSON.parse() for data, or Function constructors with careful validation.'
  },
  {
    id: 'SEC009', category: 'security', subcategory: 'Unsafe Eval', severity: 'high',
    pattern: /new\s+Function\s*\(\s*(?:['"`]|[a-zA-Z_$])/gm,
    title: 'Dynamic Function constructor',
    description: 'new Function() with dynamic input is similar to eval() and poses security risks.',
    fix: 'Avoid dynamic code generation. Use safer alternatives.'
  },
  {
    id: 'SEC010', category: 'security', subcategory: 'Unsafe Eval', severity: 'medium',
    pattern: /setTimeout\s*\(\s*['"`]/gm,
    title: 'setTimeout with string argument',
    description: 'Passing a string to setTimeout acts like eval().',
    fix: 'Pass a function reference instead of a string.'
  },
  // Auth Issues
  {
    id: 'SEC011', category: 'security', subcategory: 'Auth Bypass', severity: 'high',
    pattern: /(?:auth|authenticate|authorize|isAdmin|isLoggedIn)\s*(?:=|:)\s*(?:true|false)/gim,
    title: 'Hardcoded authentication bypass',
    description: 'Authentication flags should not be hardcoded.',
    fix: 'Use proper authentication middleware and session validation.'
  },
  {
    id: 'SEC012', category: 'security', subcategory: 'Auth Bypass', severity: 'medium',
    pattern: /\/\/\s*(?:TODO|FIXME|HACK|TEMP).*(?:auth|security|bypass|skip|disable)/gim,
    title: 'Security-related TODO/HACK comment',
    description: 'A comment suggests security functionality is incomplete or bypassed.',
    fix: 'Address the security concern before shipping to production.'
  },
  // Insecure APIs
  {
    id: 'SEC013', category: 'security', subcategory: 'Insecure API', severity: 'medium',
    pattern: /http:\/\/(?!localhost|127\.0\.0\.1|0\.0\.0\.0)/gm,
    title: 'Non-HTTPS URL detected',
    description: 'HTTP connections are unencrypted and vulnerable to MITM attacks.',
    fix: 'Use HTTPS for all external connections.'
  },
  {
    id: 'SEC014', category: 'security', subcategory: 'Insecure API', severity: 'high',
    pattern: /Math\.random\s*\(\)/gm,
    title: 'Math.random() used (possibly for security)',
    description: 'Math.random() is not cryptographically secure.',
    fix: 'Use crypto.randomBytes() or crypto.randomUUID() for security-sensitive randomness.'
  },
  {
    id: 'SEC015', category: 'security', subcategory: 'Insecure API', severity: 'medium',
    pattern: /rejectUnauthorized\s*:\s*false/gm,
    title: 'TLS certificate verification disabled',
    description: 'Disabling TLS verification makes HTTPS connections insecure.',
    fix: 'Remove rejectUnauthorized:false and use proper certificates.'
  },
];

class SecurityAnalyzer {
  /**
   * Analyze code content for security issues.
   * @param {string} content - File content
   * @param {string} filePath - Relative file path
   * @returns {Array<{id:string,category:string,subcategory:string,severity:string,title:string,description:string,fix:string,line:number,filePath:string,snippet:string}>}
   */
  analyze(content, filePath) {
    const issues = [];
    const lines = content.split('\n');

    for (const rule of RULES) {
      // Reset regex lastIndex
      rule.pattern.lastIndex = 0;
      let match;
      while ((match = rule.pattern.exec(content)) !== null) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        const snippet = lines[lineNumber - 1]?.trim() || '';

        issues.push({
          id: rule.id,
          category: rule.category,
          subcategory: rule.subcategory,
          severity: rule.severity,
          title: rule.title,
          description: rule.description,
          fix: rule.fix,
          line: lineNumber,
          filePath,
          snippet
        });
      }
    }

    return issues;
  }
}

module.exports = SecurityAnalyzer;
