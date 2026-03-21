import { Problem } from "../../types";

export const backtrackingProblems: Problem[] = [
  // === WARMUP ===
  {
    id: "bt-01",
    chapterId: 7,
    title: "Generate All Subsets",
    difficulty: "warmup",
    description:
      "Given an array of distinct integers, return all possible subsets. This is your introduction to the backtracking template: choose, explore, un-choose.",
    examples: [
      {
        input: "[1, 2, 3]",
        output: "[[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]",
      },
      { input: "[]", output: "[[]]" },
    ],
    constraints: ["0 <= nums.length <= 10", "All elements are distinct"],
    starterCode: `function subsets(nums) {
  // Your code here
}

// Tests
const r1 = subsets([1, 2, 3]);
console.assert(r1.length === 8, 'Test 1: 8 subsets');
console.assert(subsets([]).length === 1, 'Test 2: empty input');
console.assert(subsets([1]).length === 2, 'Test 3: single element');
console.log('All tests passed!');`,
    testCases: `console.assert(subsets([1,2,3]).length === 8, 'Test 1');
console.assert(subsets([]).length === 1, 'Test 2');
console.assert(subsets([1]).length === 2, 'Test 3');
console.assert(subsets([1,2,3,4]).length === 16, 'Test 4');`,
    tags: ["backtracking", "subsets"],
    order: 1,
    timeComplexity: "O(n × 2^n)",
    spaceComplexity: "O(n × 2^n)",
    patternSentence:
      "The pattern to remember: the backtracking template is choose → explore → un-choose. For subsets, at each index decide to include or skip.",
    solution: `function subsets(nums) {
  const result = [];
  function backtrack(start, current) {
    result.push([...current]);
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }
  backtrack(0, []);
  return result;
}`,
    solutionExplanation:
      "Start with an empty subset. At each step, snapshot the current subset into results. Then try adding each remaining element, recurse, and backtrack by removing the element. This generates all 2^n subsets.",
  },
  {
    id: "bt-02",
    chapterId: 7,
    title: "Combinations (n choose k)",
    difficulty: "warmup",
    description:
      "Given two integers n and k, return all possible combinations of k numbers chosen from the range [1, n]. Combinations are unordered — [1,2] and [2,1] are the same.",
    examples: [
      { input: "n=4, k=2", output: "[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]" },
      { input: "n=3, k=1", output: "[[1],[2],[3]]" },
    ],
    constraints: ["1 <= n <= 20", "1 <= k <= n"],
    starterCode: `function combine(n, k) {
  // Your code here
}

// Tests
console.assert(combine(4, 2).length === 6, 'Test 1: C(4,2) = 6');
console.assert(combine(3, 1).length === 3, 'Test 2: C(3,1) = 3');
console.assert(combine(5, 5).length === 1, 'Test 3: C(5,5) = 1');
console.log('All tests passed!');`,
    testCases: `console.assert(combine(4, 2).length === 6, 'Test 1');
console.assert(combine(3, 1).length === 3, 'Test 2');
console.assert(combine(5, 5).length === 1, 'Test 3');
console.assert(combine(5, 3).length === 10, 'Test 4');`,
    tags: ["backtracking", "combinations"],
    order: 2,
    timeComplexity: "O(C(n,k) × k)",
    spaceComplexity: "O(C(n,k) × k)",
    patternSentence:
      "The pattern to remember: combinations use the subsets template but only collect results when the current path reaches length k.",
    solution: `function combine(n, k) {
  const result = [];
  function backtrack(start, current) {
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    for (let i = start; i <= n; i++) {
      current.push(i);
      backtrack(i + 1, current);
      current.pop();
    }
  }
  backtrack(1, []);
  return result;
}`,
    solutionExplanation:
      "Same backtracking template as subsets, but we only add to results when the current combination has exactly k elements. We start each loop from 'start' to avoid duplicates (e.g., [1,2] and [2,1]).",
  },

  // === CORE ===
  {
    id: "bt-03",
    chapterId: 7,
    title: "Permutations",
    difficulty: "core",
    description:
      "Given an array of distinct integers, return all possible permutations. Unlike combinations, order matters here: [1,2,3] ≠ [3,2,1].",
    examples: [
      {
        input: "[1, 2, 3]",
        output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
      },
      { input: "[0, 1]", output: "[[0,1],[1,0]]" },
    ],
    constraints: ["1 <= nums.length <= 8", "All elements are distinct"],
    starterCode: `function permute(nums) {
  // Your code here
}

// Tests
console.assert(permute([1,2,3]).length === 6, 'Test 1: 3! = 6');
console.assert(permute([0,1]).length === 2, 'Test 2: 2! = 2');
console.assert(permute([1]).length === 1, 'Test 3: 1! = 1');
console.log('All tests passed!');`,
    testCases: `console.assert(permute([1,2,3]).length === 6, 'Test 1');
console.assert(permute([0,1]).length === 2, 'Test 2');
console.assert(permute([1]).length === 1, 'Test 3');
console.assert(permute([1,2,3,4]).length === 24, 'Test 4');`,
    tags: ["backtracking", "permutations"],
    order: 3,
    timeComplexity: "O(n! × n)",
    spaceComplexity: "O(n! × n)",
    patternSentence:
      "The pattern to remember: for permutations, use a 'used' set to track which elements are already in the current path, and try all unused elements at each position.",
    solution: `function permute(nums) {
  const result = [];
  const used = new Set();
  function backtrack(current) {
    if (current.length === nums.length) {
      result.push([...current]);
      return;
    }
    for (const num of nums) {
      if (used.has(num)) continue;
      used.add(num);
      current.push(num);
      backtrack(current);
      current.pop();
      used.delete(num);
    }
  }
  backtrack([]);
  return result;
}`,
    solutionExplanation:
      "Unlike subsets/combinations where we move forward with a 'start' index, permutations try all elements at each position. A 'used' set prevents reusing elements. When the path length equals the input length, we've found a complete permutation.",
  },
  {
    id: "bt-04",
    chapterId: 7,
    title: "Combination Sum",
    difficulty: "core",
    description:
      "Given an array of distinct integers (candidates) and a target sum, find all unique combinations where the candidates sum to target. The same number may be used unlimited times. Return combinations sorted.",
    examples: [
      {
        input: "candidates=[2,3,6,7], target=7",
        output: "[[2,2,3],[7]]",
        explanation: "2+2+3=7 and 7=7",
      },
      { input: "candidates=[2,3,5], target=8", output: "[[2,2,2,2],[2,3,3],[3,5]]" },
    ],
    constraints: [
      "1 <= candidates.length <= 30",
      "2 <= candidates[i] <= 40",
      "All candidates are distinct",
      "1 <= target <= 40",
    ],
    starterCode: `function combinationSum(candidates, target) {
  // Your code here
}

// Tests
const r1 = combinationSum([2,3,6,7], 7);
console.assert(r1.length === 2, 'Test 1: two combinations');

const r2 = combinationSum([2,3,5], 8);
console.assert(r2.length === 3, 'Test 2: three combinations');

console.assert(combinationSum([2], 1).length === 0, 'Test 3: impossible');
console.log('All tests passed!');`,
    testCases: `console.assert(combinationSum([2,3,6,7], 7).length === 2, 'Test 1');
console.assert(combinationSum([2,3,5], 8).length === 3, 'Test 2');
console.assert(combinationSum([2], 1).length === 0, 'Test 3');
console.assert(combinationSum([1], 3).length === 1, 'Test 4');`,
    tags: ["backtracking", "combination-sum"],
    order: 4,
    timeComplexity: "O(n^(target/min))",
    spaceComplexity: "O(target/min)",
    patternSentence:
      "The pattern to remember: combination sum allows reuse, so recurse with the same index (not i+1). Prune when the remaining target goes negative.",
    solution: `function combinationSum(candidates, target) {
  const result = [];
  candidates.sort((a, b) => a - b);
  function backtrack(start, current, remaining) {
    if (remaining === 0) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remaining) break;
      current.push(candidates[i]);
      backtrack(i, current, remaining - candidates[i]);
      current.pop();
    }
  }
  backtrack(0, [], target);
  return result;
}`,
    solutionExplanation:
      "Sort candidates first for pruning. Backtrack with a 'remaining' target. When remaining is 0, we found a valid combination. The key difference from regular combinations: we pass 'i' (not 'i+1') to allow reuse. Break early if a candidate exceeds remaining.",
  },
  {
    id: "bt-05",
    chapterId: 7,
    title: "N-Queens",
    difficulty: "core",
    description:
      "Place n queens on an n×n chessboard so that no two queens threaten each other. Queens can attack along rows, columns, and diagonals. Return the number of distinct solutions.",
    examples: [
      { input: "n=4", output: "2", explanation: "There are exactly 2 ways to place 4 queens on a 4×4 board" },
      { input: "n=1", output: "1" },
      { input: "n=8", output: "92" },
    ],
    constraints: ["1 <= n <= 10"],
    starterCode: `function solveNQueens(n) {
  // Return the number of distinct solutions
}

// Tests
console.assert(solveNQueens(1) === 1, 'Test 1');
console.assert(solveNQueens(4) === 2, 'Test 2');
console.assert(solveNQueens(8) === 92, 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(solveNQueens(1) === 1, 'Test 1');
console.assert(solveNQueens(4) === 2, 'Test 2');
console.assert(solveNQueens(5) === 10, 'Test 3');
console.assert(solveNQueens(8) === 92, 'Test 4');`,
    tags: ["backtracking", "n-queens", "classic"],
    order: 5,
    timeComplexity: "O(n!)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: N-Queens is constraint-based backtracking — place row by row, use sets for columns and diagonals to check conflicts in O(1).",
    solution: `function solveNQueens(n) {
  let count = 0;
  const cols = new Set();
  const diag1 = new Set(); // row - col
  const diag2 = new Set(); // row + col

  function backtrack(row) {
    if (row === n) { count++; return; }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue;
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);
      backtrack(row + 1);
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
    }
  }
  backtrack(0);
  return count;
}`,
    solutionExplanation:
      "Place queens row by row. For each row, try each column. Use three sets to track occupied columns, main diagonals (row-col), and anti-diagonals (row+col). If a position conflicts, skip it. If we reach row n, we found a valid arrangement.",
  },
  {
    id: "bt-06",
    chapterId: 7,
    title: "Word Search in Grid",
    difficulty: "core",
    description:
      "Given an m×n grid of characters and a word, determine if the word exists in the grid. The word can be constructed from sequentially adjacent cells (horizontal or vertical). Each cell may only be used once per word.",
    examples: [
      {
        input: 'board=[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word="ABCCED"',
        output: "true",
      },
      {
        input: 'board=[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word="SEE"',
        output: "true",
      },
      {
        input: 'board=[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word="ABCB"',
        output: "false",
      },
    ],
    constraints: [
      "1 <= m, n <= 6",
      "1 <= word.length <= 15",
      "board and word consist of uppercase/lowercase English letters",
    ],
    starterCode: `function exist(board, word) {
  // Your code here
}

// Tests
const board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]];
console.assert(exist(board, "ABCCED") === true, 'Test 1');
console.assert(exist(board, "SEE") === true, 'Test 2');
console.assert(exist(board, "ABCB") === false, 'Test 3');
console.log('All tests passed!');`,
    testCases: `const b1 = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]];
console.assert(exist(b1, "ABCCED") === true, 'Test 1');
console.assert(exist(b1, "SEE") === true, 'Test 2');
console.assert(exist(b1, "ABCB") === false, 'Test 3');
console.assert(exist([["a"]], "a") === true, 'Test 4');`,
    tags: ["backtracking", "grid", "dfs"],
    order: 6,
    timeComplexity: "O(m × n × 4^L)",
    spaceComplexity: "O(L)",
    patternSentence:
      "The pattern to remember: grid backtracking marks cells as visited, explores 4 directions, and unmarks on backtrack — the visited state is the 'choice' being undone.",
    solution: `function exist(board, word) {
  const rows = board.length, cols = board[0].length;

  function backtrack(r, c, idx) {
    if (idx === word.length) return true;
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    if (board[r][c] !== word[idx]) return false;

    const temp = board[r][c];
    board[r][c] = '#'; // mark visited

    const found = backtrack(r+1, c, idx+1) || backtrack(r-1, c, idx+1) ||
                  backtrack(r, c+1, idx+1) || backtrack(r, c-1, idx+1);

    board[r][c] = temp; // unmark
    return found;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (backtrack(r, c, 0)) return true;
    }
  }
  return false;
}`,
    solutionExplanation:
      "Try starting from every cell. At each cell, if it matches the current character, mark it visited (replace with '#'), then explore all 4 directions for the next character. Backtrack by restoring the original character. If we match all characters, return true.",
  },

  // === CHALLENGE ===
  {
    id: "bt-07",
    chapterId: 7,
    title: "Sudoku Solver",
    difficulty: "challenge",
    description:
      "Write a function to solve a Sudoku puzzle by filling the empty cells (represented by '.'). Each row, column, and 3×3 box must contain digits 1-9 with no repetition. Modify the board in-place.",
    examples: [
      {
        input: "Standard 9×9 Sudoku board with '.' for empties",
        output: "Completed board with all cells filled",
      },
    ],
    constraints: ["board is 9×9", "Contains digits '1'-'9' and '.'", "Exactly one solution exists"],
    starterCode: `function solveSudoku(board) {
  // Modify board in place, return true if solved
}

// Test
const board = [
  ["5","3",".",".","7",".",".",".","."],
  ["6",".",".","1","9","5",".",".","."],
  [".","9","8",".",".",".",".","6","."],
  ["8",".",".",".","6",".",".",".","3"],
  ["4",".",".","8",".","3",".",".","1"],
  ["7",".",".",".","2",".",".",".","6"],
  [".","6",".",".",".",".","2","8","."],
  [".",".",".","4","1","9",".",".","5"],
  [".",".",".",".","8",".",".","7","9"]
];
solveSudoku(board);
console.assert(board[0][2] === "4", 'Test 1');
console.assert(board[1][1] === "7", 'Test 2');
console.log('All tests passed!');`,
    testCases: `const b = [
  ["5","3",".",".","7",".",".",".","."],
  ["6",".",".","1","9","5",".",".","."],
  [".","9","8",".",".",".",".","6","."],
  ["8",".",".",".","6",".",".",".","3"],
  ["4",".",".","8",".","3",".",".","1"],
  ["7",".",".",".","2",".",".",".","6"],
  [".","6",".",".",".",".","2","8","."],
  [".",".",".","4","1","9",".",".","5"],
  [".",".",".",".","8",".",".","7","9"]
];
solveSudoku(b);
console.assert(b[0][2] === "4", 'Test 1');
console.assert(b[1][1] === "7", 'Test 2');
console.assert(b[4][4] === "5", 'Test 3');`,
    tags: ["backtracking", "sudoku", "constraint-propagation"],
    order: 7,
    timeComplexity: "O(9^m) where m = empty cells",
    spaceComplexity: "O(m)",
    patternSentence:
      "The pattern to remember: Sudoku is constraint-satisfaction backtracking — try a digit, check all constraints (row, col, box), recurse, and undo if stuck.",
    solution: `function solveSudoku(board) {
  function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
      if (board[i][col] === num) return false;
    }
    const r0 = Math.floor(row / 3) * 3;
    const c0 = Math.floor(col / 3) * 3;
    for (let r = r0; r < r0 + 3; r++) {
      for (let c = c0; c < c0 + 3; c++) {
        if (board[r][c] === num) return false;
      }
    }
    return true;
  }

  function solve() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== '.') continue;
        for (let num = 1; num <= 9; num++) {
          const ch = String(num);
          if (isValid(board, r, c, ch)) {
            board[r][c] = ch;
            if (solve()) return true;
            board[r][c] = '.';
          }
        }
        return false;
      }
    }
    return true;
  }
  solve();
}`,
    solutionExplanation:
      "Find the first empty cell. Try digits 1-9.  For each digit, check if it's valid in the current row, column, and 3×3 box. If valid, place it and recurse. If recursion fails, undo (backtrack). If no digit works, return false to trigger backtracking.",
  },
  {
    id: "bt-08",
    chapterId: 7,
    title: "Palindrome Partitioning",
    difficulty: "challenge",
    description:
      "Given a string s, partition it so that every substring in the partition is a palindrome. Return all possible palindrome partitionings.",
    examples: [
      { input: '"aab"', output: '[["a","a","b"],["aa","b"]]' },
      { input: '"a"', output: '[["a"]]' },
    ],
    constraints: ["1 <= s.length <= 16", "s contains only lowercase English letters"],
    starterCode: `function partition(s) {
  // Your code here
}

// Tests
const r1 = partition("aab");
console.assert(r1.length === 2, 'Test 1: two partitions');

const r2 = partition("a");
console.assert(r2.length === 1, 'Test 2: single char');

const r3 = partition("aaa");
console.assert(r3.length === 4, 'Test 3: "aaa" has 4 partitions');
console.log('All tests passed!');`,
    testCases: `console.assert(partition("aab").length === 2, 'Test 1');
console.assert(partition("a").length === 1, 'Test 2');
console.assert(partition("aaa").length === 4, 'Test 3');
console.assert(partition("ab").length === 1, 'Test 4');`,
    tags: ["backtracking", "palindrome", "string"],
    order: 8,
    timeComplexity: "O(n × 2^n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: partition problems try every possible split point, only continuing down a path if the current segment meets the constraint (here: is palindrome).",
    solution: `function partition(s) {
  const result = [];

  function isPalindrome(str, l, r) {
    while (l < r) {
      if (str[l] !== str[r]) return false;
      l++; r--;
    }
    return true;
  }

  function backtrack(start, current) {
    if (start === s.length) {
      result.push([...current]);
      return;
    }
    for (let end = start; end < s.length; end++) {
      if (isPalindrome(s, start, end)) {
        current.push(s.substring(start, end + 1));
        backtrack(end + 1, current);
        current.pop();
      }
    }
  }
  backtrack(0, []);
  return result;
}`,
    solutionExplanation:
      "Starting from index 0, try every possible end index. If the substring from start to end is a palindrome, add it to the current partition and recurse from end+1. When start reaches the end of string, we've found a valid partition.",
  },

  // === REAL-WORLD ===
  {
    id: "bt-09",
    chapterId: 7,
    title: "Generate Valid Parentheses",
    difficulty: "real-world",
    description:
      "Given n pairs of parentheses, generate all combinations of well-formed parentheses. This is a classic constrained generation problem that appears in code editors and compilers.",
    examples: [
      { input: "n=3", output: '["((()))","(()())","(())()","()(())","()()()"]' },
      { input: "n=1", output: '["()"]' },
    ],
    constraints: ["1 <= n <= 8"],
    starterCode: `function generateParenthesis(n) {
  // Your code here
}

// Tests
console.assert(generateParenthesis(1).length === 1, 'Test 1');
console.assert(generateParenthesis(2).length === 2, 'Test 2');
console.assert(generateParenthesis(3).length === 5, 'Test 3');
console.assert(generateParenthesis(4).length === 14, 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(generateParenthesis(1).length === 1, 'Test 1');
console.assert(generateParenthesis(2).length === 2, 'Test 2');
console.assert(generateParenthesis(3).length === 5, 'Test 3');
console.assert(generateParenthesis(4).length === 14, 'Test 4');`,
    tags: ["backtracking", "parentheses", "generation"],
    order: 9,
    timeComplexity: "O(4^n / √n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: constrained generation uses backtracking with validity checks — only add '(' if open < n, only add ')' if close < open.",
    solution: `function generateParenthesis(n) {
  const result = [];
  function backtrack(current, open, close) {
    if (current.length === 2 * n) {
      result.push(current);
      return;
    }
    if (open < n) backtrack(current + '(', open + 1, close);
    if (close < open) backtrack(current + ')', open, close + 1);
  }
  backtrack('', 0, 0);
  return result;
}`,
    solutionExplanation:
      "Track counts of open and close parentheses. We can add '(' if we haven't used all n. We can add ')' only if close < open (ensures validity). When the string length reaches 2n, it's a complete valid combination. The Catalan number C(n) gives the count.",
  },
  {
    id: "bt-10",
    chapterId: 7,
    title: "Letter Combinations of Phone Number",
    difficulty: "real-world",
    description:
      "Given a string containing digits 2-9, return all possible letter combinations that the number could represent (like on a phone keypad). This simulates real-world autocomplete/suggestion generation.",
    examples: [
      { input: '"23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' },
      { input: '""', output: "[]" },
      { input: '"2"', output: '["a","b","c"]' },
    ],
    constraints: ["0 <= digits.length <= 4", "digits[i] is between '2' and '9'"],
    starterCode: `function letterCombinations(digits) {
  // Your code here
}

// Tests
console.assert(letterCombinations("23").length === 9, 'Test 1');
console.assert(letterCombinations("").length === 0, 'Test 2');
console.assert(letterCombinations("2").length === 3, 'Test 3');
console.assert(letterCombinations("234").length === 27, 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(letterCombinations("23").length === 9, 'Test 1');
console.assert(letterCombinations("").length === 0, 'Test 2');
console.assert(letterCombinations("2").length === 3, 'Test 3');
console.assert(letterCombinations("234").length === 27, 'Test 4');`,
    tags: ["backtracking", "phone-keypad", "real-world"],
    order: 10,
    timeComplexity: "O(4^n × n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: when each position has multiple choices from a mapping, backtrack through each position trying every mapped character.",
    solution: `function letterCombinations(digits) {
  if (!digits.length) return [];
  const map = { '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz' };
  const result = [];
  function backtrack(idx, current) {
    if (idx === digits.length) {
      result.push(current);
      return;
    }
    for (const ch of map[digits[idx]]) {
      backtrack(idx + 1, current + ch);
    }
  }
  backtrack(0, '');
  return result;
}`,
    solutionExplanation:
      "Map each digit to its letters. Backtrack through each digit position. At each position, try every letter mapped to that digit, appending it to the current string and recursing to the next digit. When we've processed all digits, add the result.",
  },
];
