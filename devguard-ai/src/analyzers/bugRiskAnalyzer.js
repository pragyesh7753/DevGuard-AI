/**
 * Bug Risk Analyzer — detects common bug patterns.
 */

const RULES = [
  {
    id: 'BUG001', category: 'bugs', subcategory: 'Type Coercion', severity: 'medium',
    pattern: /[^!=]={2}(?!=)\s*(?:null|undefined|true|false|['"\d])/gm,
    title: 'Loose equality (==) used',
    description: 'Loose equality can cause unexpected type coercion bugs.',
    fix: 'Use strict equality (===) instead of loose equality (==).'
  },
  {
    id: 'BUG002', category: 'bugs', subcategory: 'Null Reference', severity: 'high',
    pattern: /(\w+)\.(\w+)\.(\w+)\.(\w+)/gm,
    multiCheck: (content, match) => {
      // Only flag deeply chained access without optional chaining
      return !match[0].includes('?.') && !match[0].includes('||') && !/^(console|process|module|require|Math|JSON|Object|Array|String|Number|Date|Promise|RegExp|Map|Set|Error|Buffer|vscode)\./.test(match[0]);
    },
    title: 'Deep property access without null check',
    description: 'Deeply chained property access can throw if any intermediate value is null/undefined.',
    fix: 'Use optional chaining (?.) or add null checks.'
  },
  {
    id: 'BUG003', category: 'bugs', subcategory: 'Async', severity: 'high',
    pattern: /(?:async\s+)?(?:function\s+\w+|\w+\s*=\s*async)\s*\([^)]*\)\s*\{[^}]*\.then\s*\(/gms,
    title: 'Mixing async/await with .then()',
    description: 'Mixing async/await with promise chains makes code harder to follow and debug.',
    fix: 'Use consistent async/await pattern throughout the function.'
  },
  {
    id: 'BUG004', category: 'bugs', subcategory: 'Async', severity: 'high',
    pattern: /(?:new\s+Promise|\.then)\s*\([^)]*\)\s*(?:;|\n)(?!\s*\.catch|\s*\.then)/gm,
    title: 'Unhandled promise (missing .catch)',
    description: 'Unhandled promise rejections can cause silent failures or crashes.',
    fix: 'Add .catch() handler or use try/catch with await.'
  },
  {
    id: 'BUG005', category: 'bugs', subcategory: 'Async', severity: 'medium',
    pattern: /(?:const|let|var)\s+\w+\s*=\s*(?:\w+\.)+(?:find|filter|map|reduce|some|every)\s*\([^)]*await/gms,
    title: 'Await inside array method',
    description: 'Array methods like .map(), .filter() do not properly await async callbacks.',
    fix: 'Use for...of loop with await, or Promise.all(arr.map(async ...)).'
  },
  {
    id: 'BUG006', category: 'bugs', subcategory: 'State', severity: 'medium',
    pattern: /(?:let|var)\s+\w+\s*=\s*(?:\[|\{)/gm,
    multiCheck: (content, match) => {
      // Only flag mutable shared state at module level (not inside functions)
      const beforeMatch = content.substring(0, match.index);
      const braceDepth = (beforeMatch.match(/\{/g) || []).length - (beforeMatch.match(/\}/g) || []).length;
      return braceDepth === 0;
    },
    title: 'Mutable module-level state',
    description: 'Module-level mutable state can cause race conditions and unexpected behavior.',
    fix: 'Use const, or encapsulate state in a class or function scope.'
  },
  {
    id: 'BUG007', category: 'bugs', subcategory: 'Error Handling', severity: 'medium',
    pattern: /catch\s*\(\s*\w*\s*\)\s*\{\s*\}/gm,
    title: 'Empty catch block',
    description: 'Empty catch blocks silently swallow errors, hiding bugs.',
    fix: 'Log the error or handle it appropriately.'
  },
  {
    id: 'BUG008', category: 'bugs', subcategory: 'Error Handling', severity: 'low',
    pattern: /catch\s*\(\s*\w+\s*\)\s*\{\s*(?:console\.log|\/\/)/gm,
    title: 'Catch block only logs error',
    description: 'Catching errors only to log them may not properly handle the failure.',
    fix: 'Consider rethrowing, returning an error state, or providing fallback behavior.'
  },
  {
    id: 'BUG009', category: 'bugs', subcategory: 'Comparison', severity: 'medium',
    pattern: /typeof\s+\w+\s*={2,3}\s*['"](?!string|number|boolean|object|function|undefined|symbol|bigint)/gm,
    title: 'Invalid typeof comparison',
    description: 'typeof always returns a specific set of strings. Comparing to invalid values is always false.',
    fix: 'Check for valid typeof return values: string, number, boolean, object, function, undefined, symbol, bigint.'
  },
  {
    id: 'BUG010', category: 'bugs', subcategory: 'Off-by-one', severity: 'medium',
    pattern: /\.length\s*(?:<=|>=)\s*\w+|(?:\w+)\s*(?:<=|>=)\s*\w+\.length/gm,
    title: 'Potential off-by-one in length comparison',
    description: 'Using <= or >= with .length may cause off-by-one errors.',
    fix: 'Verify the boundary condition. Usually < array.length is correct for iteration.'
  },
];

class BugRiskAnalyzer {
  analyze(content, filePath) {
    const issues = [];
    const lines = content.split('\n');

    for (const rule of RULES) {
      rule.pattern.lastIndex = 0;
      let match;
      while ((match = rule.pattern.exec(content)) !== null) {
        if (rule.multiCheck && !rule.multiCheck(content, match)) continue;
        const lineNumber = content.substring(0, match.index).split('\n').length;
        issues.push({
          id: rule.id, category: rule.category, subcategory: rule.subcategory,
          severity: rule.severity, title: rule.title, description: rule.description,
          fix: rule.fix, line: lineNumber, filePath,
          snippet: lines[lineNumber - 1]?.trim() || ''
        });
      }
    }
    return issues;
  }
}

module.exports = BugRiskAnalyzer;
