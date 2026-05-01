/**
 * Code Quality Analyzer — detects maintainability and style issues.
 */

class CodeQualityAnalyzer {
  analyze(content, filePath) {
    const issues = [];
    const lines = content.split('\n');

    this._checkLongFunctions(lines, filePath, issues);
    this._checkDeepNesting(lines, filePath, issues);
    this._checkMagicNumbers(lines, filePath, issues);
    this._checkPoorNaming(lines, filePath, issues);
    this._checkDeadCode(lines, filePath, issues);
    this._checkDuplicateBlocks(lines, filePath, issues);
    this._checkConsoleLog(lines, filePath, issues);
    this._checkTodoFixme(lines, filePath, issues);

    return issues;
  }

  _checkLongFunctions(lines, filePath, issues) {
    let funcStart = -1;
    let braceDepth = 0;
    let funcName = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const funcMatch = line.match(/(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\(|(\w+)\s*\([^)]*\)\s*\{)/);

      if (funcMatch && braceDepth === 0) {
        funcStart = i;
        funcName = funcMatch[1] || funcMatch[2] || funcMatch[3] || 'anonymous';
      }

      for (const ch of line) {
        if (ch === '{') braceDepth++;
        if (ch === '}') braceDepth--;
      }

      if (braceDepth === 0 && funcStart >= 0) {
        const length = i - funcStart + 1;
        if (length > 50) {
          issues.push({
            id: 'CQ001', category: 'quality', subcategory: 'Long Function',
            severity: length > 100 ? 'high' : 'medium',
            title: `Function "${funcName}" is ${length} lines long`,
            description: 'Long functions are hard to read, test, and maintain.',
            fix: 'Break into smaller, focused functions with single responsibilities.',
            line: funcStart + 1, filePath, snippet: lines[funcStart]?.trim() || ''
          });
        }
        funcStart = -1;
      }
    }
  }

  _checkDeepNesting(lines, filePath, issues) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const leadingSpaces = line.match(/^(\s*)/)[1].length;
      const tabEquivalent = line.includes('\t')
        ? (line.match(/^\t*/)[0].length * 4 + line.replace(/^\t*/, '').match(/^ */)[0].length)
        : leadingSpaces;
      const depth = Math.floor(tabEquivalent / 2);

      if (depth >= 5 && line.trim().length > 0 && !line.trim().startsWith('//') && !line.trim().startsWith('*')) {
        issues.push({
          id: 'CQ002', category: 'quality', subcategory: 'Deep Nesting',
          severity: depth >= 7 ? 'high' : 'medium',
          title: `Deeply nested code (${depth} levels)`,
          description: 'Deep nesting reduces readability. Consider early returns or extraction.',
          fix: 'Use guard clauses (early returns), extract nested blocks into functions.',
          line: i + 1, filePath, snippet: line.trim()
        });
        // Skip nearby lines to avoid flood
        i += 3;
      }
    }
  }

  _checkMagicNumbers(lines, filePath, issues) {
    const ALLOWED = new Set(['0', '1', '-1', '2', '100', '1000', '0.5', '24', '60', '1024']);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('//') || line.startsWith('*') || line.startsWith('import') || line.startsWith('const ')) continue;

      const matches = line.matchAll(/(?<![a-zA-Z_$.\[])(\d+\.?\d*)(?![a-zA-Z_$"'\]])/g);
      for (const m of matches) {
        if (!ALLOWED.has(m[1]) && parseFloat(m[1]) > 2) {
          issues.push({
            id: 'CQ003', category: 'quality', subcategory: 'Magic Number',
            severity: 'low',
            title: `Magic number: ${m[1]}`,
            description: 'Magic numbers reduce readability. Use named constants.',
            fix: `Extract ${m[1]} into a descriptively named constant.`,
            line: i + 1, filePath, snippet: line
          });
          break; // One per line
        }
      }
    }
  }

  _checkPoorNaming(lines, filePath, issues) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Single-letter variables (not in for-loop iterators)
      const varMatch = line.match(/(?:const|let|var)\s+([a-zA-Z])\s*[=:]/);
      if (varMatch && !line.includes('for') && !line.includes('for(')) {
        const name = varMatch[1];
        if (!['i', 'j', 'k', 'e', 'x', 'y', '_'].includes(name)) {
          issues.push({
            id: 'CQ004', category: 'quality', subcategory: 'Poor Naming',
            severity: 'low',
            title: `Single-letter variable name: "${name}"`,
            description: 'Non-descriptive variable names hurt readability.',
            fix: 'Use a descriptive name that conveys the variable\'s purpose.',
            line: i + 1, filePath, snippet: line.trim()
          });
        }
      }
    }
  }

  _checkDeadCode(lines, filePath, issues) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // Return followed by code (not closing brace)
      if (/^return\b/.test(line)) {
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const nextLine = lines[j].trim();
          if (nextLine === '' || nextLine === '}' || nextLine === '});' || nextLine.startsWith('//')) continue;
          if (nextLine !== '}' && nextLine.length > 0 && !nextLine.startsWith('case ') && !nextLine.startsWith('default:')) {
            issues.push({
              id: 'CQ005', category: 'quality', subcategory: 'Dead Code',
              severity: 'medium',
              title: 'Unreachable code after return',
              description: 'Code after a return statement will never execute.',
              fix: 'Remove the unreachable code or restructure the logic.',
              line: j + 1, filePath, snippet: nextLine
            });
            break;
          }
          break;
        }
      }
    }
  }

  _checkDuplicateBlocks(lines, filePath, issues) {
    const BLOCK_SIZE = 4;
    if (lines.length < BLOCK_SIZE * 2) return;

    const blockHashes = new Map();
    for (let i = 0; i <= lines.length - BLOCK_SIZE; i++) {
      const block = lines.slice(i, i + BLOCK_SIZE).map(l => l.trim()).filter(l => l.length > 0);
      if (block.length < 3) continue;
      const hash = block.join('\n');
      if (hash.length < 20) continue; // Too short to be meaningful

      if (blockHashes.has(hash)) {
        const prev = blockHashes.get(hash);
        if (i - prev >= BLOCK_SIZE) { // Don't flag overlapping blocks
          issues.push({
            id: 'CQ006', category: 'quality', subcategory: 'Duplicate Code',
            severity: 'medium',
            title: 'Duplicate code block detected',
            description: `Lines ${prev + 1}-${prev + BLOCK_SIZE} duplicated at lines ${i + 1}-${i + BLOCK_SIZE}.`,
            fix: 'Extract duplicated code into a shared function.',
            line: i + 1, filePath, snippet: lines[i]?.trim() || ''
          });
        }
      } else {
        blockHashes.set(hash, i);
      }
    }
  }

  _checkConsoleLog(lines, filePath, issues) {
    for (let i = 0; i < lines.length; i++) {
      if (/console\.(log|debug|info)\s*\(/.test(lines[i])) {
        issues.push({
          id: 'CQ007', category: 'quality', subcategory: 'Debug Code',
          severity: 'info',
          title: 'console.log/debug statement',
          description: 'Console statements should be removed or replaced with proper logging.',
          fix: 'Remove or replace with a logging framework.',
          line: i + 1, filePath, snippet: lines[i].trim()
        });
      }
    }
  }

  _checkTodoFixme(lines, filePath, issues) {
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(/\/\/\s*(TODO|FIXME|HACK|XXX|BUG)\s*:?\s*(.*)/i);
      if (match) {
        issues.push({
          id: 'CQ008', category: 'quality', subcategory: 'TODO/FIXME',
          severity: 'info',
          title: `${match[1].toUpperCase()}: ${match[2].trim() || 'No description'}`,
          description: 'Outstanding TODO/FIXME should be addressed before production.',
          fix: 'Resolve the TODO or create a tracked issue for it.',
          line: i + 1, filePath, snippet: lines[i].trim()
        });
      }
    }
  }
}

module.exports = CodeQualityAnalyzer;
