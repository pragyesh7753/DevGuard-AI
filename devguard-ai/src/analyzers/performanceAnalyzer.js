/**
 * Performance Analyzer — detects performance anti-patterns.
 */

const RULES = [
  {
    id: 'PERF001', category: 'performance', subcategory: 'Nested Loops', severity: 'high',
    pattern: /for\s*\([^)]*\)\s*\{[^}]*for\s*\([^)]*\)\s*\{/gms,
    title: 'Nested loop detected (O(n²) potential)',
    description: 'Nested loops can cause quadratic time complexity with large datasets.',
    fix: 'Consider using a Map/Set for O(1) lookups, or restructure the algorithm.'
  },
  {
    id: 'PERF002', category: 'performance', subcategory: 'Sync I/O', severity: 'high',
    pattern: /(?:readFileSync|writeFileSync|appendFileSync|existsSync|mkdirSync|readdirSync|statSync)\s*\(/gm,
    title: 'Synchronous file I/O',
    description: 'Sync file operations block the event loop and degrade performance.',
    fix: 'Use async equivalents (readFile, writeFile, etc.) with await.'
  },
  {
    id: 'PERF003', category: 'performance', subcategory: 'Memory', severity: 'medium',
    pattern: /addEventListener\s*\([^)]+\)/gm,
    title: 'Event listener — ensure cleanup',
    description: 'Event listeners without removal can cause memory leaks.',
    fix: 'Store listener reference and call removeEventListener in cleanup/dispose.'
  },
  {
    id: 'PERF004', category: 'performance', subcategory: 'Memory', severity: 'medium',
    pattern: /setInterval\s*\(/gm,
    title: 'setInterval without clearInterval reference',
    description: 'Intervals without cleanup cause memory leaks and continue running.',
    fix: 'Store the interval ID and call clearInterval in cleanup.'
  },
  {
    id: 'PERF005', category: 'performance', subcategory: 'Rendering', severity: 'medium',
    pattern: /(?:onClick|onChange|onSubmit|onScroll)\s*=\s*\{\s*\(\s*[^)]*\)\s*=>/gm,
    title: 'Inline arrow function in JSX event handler',
    description: 'Inline functions create new references every render, causing unnecessary re-renders.',
    fix: 'Extract the handler to a useCallback hook or class method.'
  },
  {
    id: 'PERF006', category: 'performance', subcategory: 'Rendering', severity: 'low',
    pattern: /\.map\s*\(\s*(?:\([^)]*\)|[^=]*)\s*=>\s*(?:<|\(?\s*<)[^]*?(?:key\s*=\s*\{[^}]*index)/gms,
    title: 'Array index used as React key',
    description: 'Using array index as key can cause incorrect re-renders and state bugs.',
    fix: 'Use a unique, stable identifier as the key prop.'
  },
  {
    id: 'PERF007', category: 'performance', subcategory: 'Bundle', severity: 'medium',
    pattern: /require\s*\(\s*['"][^'"]+['"]\s*\)/gm,
    multiCheck: (content) => {
      // Only flag dynamic requires (with variables)
      return /require\s*\(\s*(?!['"])[^)]+\)/.test(content);
    },
    title: 'Dynamic require() call',
    description: 'Dynamic requires prevent tree-shaking and increase bundle size.',
    fix: 'Use static import statements for better bundling.'
  },
  {
    id: 'PERF008', category: 'performance', subcategory: 'Bundle', severity: 'low',
    pattern: /import\s+\*\s+as\s+\w+\s+from\s+['"][^'"]+['"]/gm,
    title: 'Wildcard import (import *)',
    description: 'Importing everything prevents tree-shaking unused exports.',
    fix: 'Import only the specific exports you need.'
  },
  {
    id: 'PERF009', category: 'performance', subcategory: 'Async', severity: 'high',
    pattern: /for\s*\([^)]*\)\s*\{[^}]*await\s+/gms,
    title: 'Sequential await in loop',
    description: 'Awaiting inside a loop executes requests sequentially instead of in parallel.',
    fix: 'Use Promise.all() with Array.map() for parallel execution.'
  },
  {
    id: 'PERF010', category: 'performance', subcategory: 'Query', severity: 'high',
    pattern: /\.(?:find|findAll|select|query)\s*\([^)]*\)[^;]*\.(?:find|findAll|select|query)\s*\(/gms,
    title: 'Potential N+1 query pattern',
    description: 'Querying inside a loop or chained queries can cause N+1 database problems.',
    fix: 'Use eager loading, joins, or batch queries.'
  },
];

class PerformanceAnalyzer {
  analyze(content, filePath) {
    const issues = [];
    const lines = content.split('\n');

    for (const rule of RULES) {
      if (rule.multiCheck && !rule.multiCheck(content)) continue;

      rule.pattern.lastIndex = 0;
      let match;
      while ((match = rule.pattern.exec(content)) !== null) {
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

module.exports = PerformanceAnalyzer;
