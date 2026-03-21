import { Problem } from "../../types";

export const recursionProblems: Problem[] = [
  // === WARMUP ===
  {
    id: "rec-01",
    chapterId: 6,
    title: "Factorial",
    difficulty: "warmup",
    description:
      "Write a recursive function that returns the factorial of a non-negative integer n. factorial(0) = 1, factorial(n) = n * factorial(n-1). This is the classic introduction to recursion.",
    examples: [
      { input: "5", output: "120", explanation: "5! = 5×4×3×2×1 = 120" },
      { input: "0", output: "1", explanation: "0! is defined as 1" },
      { input: "1", output: "1" },
    ],
    constraints: ["0 <= n <= 20", "Must use recursion, not a loop"],
    starterCode: `function factorial(n) {
  // Your code here
}

// Tests
console.assert(factorial(5) === 120, 'Test 1: 5!');
console.assert(factorial(0) === 1, 'Test 2: 0!');
console.assert(factorial(1) === 1, 'Test 3: 1!');
console.assert(factorial(10) === 3628800, 'Test 4: 10!');
console.log('All tests passed!');`,
    testCases: `console.assert(factorial(5) === 120, 'Test 1');
console.assert(factorial(0) === 1, 'Test 2');
console.assert(factorial(1) === 1, 'Test 3');
console.assert(factorial(10) === 3628800, 'Test 4');
console.assert(factorial(12) === 479001600, 'Test 5');`,
    tags: ["recursion", "base-case"],
    order: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: every recursive function needs a base case that stops recursion and a recursive case that reduces the problem size.",
    solution: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`,
    solutionExplanation:
      "Base case: if n is 0 or 1, return 1. Recursive case: return n * factorial(n-1). Each call reduces n by 1, so we make exactly n calls before hitting the base case. The call stack grows to depth n, hence O(n) space.",
  },
  {
    id: "rec-02",
    chapterId: 6,
    title: "Sum of Array (Recursive)",
    difficulty: "warmup",
    description:
      "Write a recursive function that returns the sum of all elements in an array. Do NOT use loops. Think about what the base case is and how to reduce the problem.",
    examples: [
      { input: "[1, 2, 3, 4, 5]", output: "15" },
      { input: "[]", output: "0" },
      { input: "[10]", output: "10" },
    ],
    constraints: ["0 <= arr.length <= 10^4", "Must use recursion"],
    starterCode: `function sumArray(arr) {
  // Your code here — no loops allowed
}

// Tests
console.assert(sumArray([1, 2, 3, 4, 5]) === 15, 'Test 1');
console.assert(sumArray([]) === 0, 'Test 2');
console.assert(sumArray([10]) === 10, 'Test 3');
console.assert(sumArray([-1, 1, -1, 1]) === 0, 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(sumArray([1, 2, 3, 4, 5]) === 15, 'Test 1');
console.assert(sumArray([]) === 0, 'Test 2');
console.assert(sumArray([10]) === 10, 'Test 3');
console.assert(sumArray([-1, 1, -1, 1]) === 0, 'Test 4');
console.assert(sumArray([100, 200, 300]) === 600, 'Test 5');`,
    tags: ["recursion", "array"],
    order: 2,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: break an array problem into 'first element + rest of array' to think recursively.",
    solution: `function sumArray(arr) {
  if (arr.length === 0) return 0;
  return arr[0] + sumArray(arr.slice(1));
}`,
    solutionExplanation:
      "Base case: empty array returns 0. Recursive case: take the first element and add it to the sum of the remaining array. Each call processes one element, so O(n) time. The call stack depth is n, so O(n) space.",
  },

  // === CORE ===
  {
    id: "rec-03",
    chapterId: 6,
    title: "Fibonacci Number",
    difficulty: "core",
    description:
      "Return the nth Fibonacci number using recursion. fib(0) = 0, fib(1) = 1, fib(n) = fib(n-1) + fib(n-2). Start with naive recursion, then optimize with memoization.",
    examples: [
      { input: "6", output: "8", explanation: "0,1,1,2,3,5,8 → fib(6)=8" },
      { input: "0", output: "0" },
      { input: "10", output: "55" },
    ],
    constraints: ["0 <= n <= 40", "Use memoization for efficiency"],
    starterCode: `function fib(n) {
  // Your code here — use memoization for efficiency
}

// Tests
console.assert(fib(0) === 0, 'Test 1');
console.assert(fib(1) === 1, 'Test 2');
console.assert(fib(6) === 8, 'Test 3');
console.assert(fib(10) === 55, 'Test 4');
console.assert(fib(20) === 6765, 'Test 5');
console.log('All tests passed!');`,
    testCases: `console.assert(fib(0) === 0, 'Test 1');
console.assert(fib(1) === 1, 'Test 2');
console.assert(fib(6) === 8, 'Test 3');
console.assert(fib(10) === 55, 'Test 4');
console.assert(fib(20) === 6765, 'Test 5');`,
    tags: ["recursion", "memoization", "dynamic-programming"],
    order: 3,
    timeComplexity: "O(n) with memoization",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: when recursion revisits the same subproblems, store results in a memo object to avoid exponential blowup.",
    solution: `function fib(n, memo = {}) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (memo[n] !== undefined) return memo[n];
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}`,
    solutionExplanation:
      "Without memoization, fib is O(2^n) because it recomputes the same values exponentially. With a memo object, each fib(k) is computed only once and cached. This brings time down to O(n) and space to O(n) for the memo + call stack.",
  },
  {
    id: "rec-04",
    chapterId: 6,
    title: "Power Function",
    difficulty: "core",
    description:
      "Implement pow(base, exp) recursively. Use the fast exponentiation approach: if exp is even, pow(base, exp) = pow(base, exp/2)². If odd, multiply by base once. This is O(log n) instead of O(n).",
    examples: [
      { input: "base=2, exp=10", output: "1024" },
      { input: "base=3, exp=0", output: "1" },
      { input: "base=5, exp=3", output: "125" },
    ],
    constraints: ["0 <= exp <= 30", "base is an integer"],
    starterCode: `function power(base, exp) {
  // Your code here — use fast exponentiation
}

// Tests
console.assert(power(2, 10) === 1024, 'Test 1');
console.assert(power(3, 0) === 1, 'Test 2');
console.assert(power(5, 3) === 125, 'Test 3');
console.assert(power(2, 0) === 1, 'Test 4');
console.assert(power(7, 2) === 49, 'Test 5');
console.log('All tests passed!');`,
    testCases: `console.assert(power(2, 10) === 1024, 'Test 1');
console.assert(power(3, 0) === 1, 'Test 2');
console.assert(power(5, 3) === 125, 'Test 3');
console.assert(power(2, 0) === 1, 'Test 4');
console.assert(power(7, 2) === 49, 'Test 5');`,
    tags: ["recursion", "divide-and-conquer", "math"],
    order: 4,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(log n)",
    patternSentence:
      "The pattern to remember: splitting the exponent in half each time is divide-and-conquer — it turns O(n) multiplications into O(log n).",
    solution: `function power(base, exp) {
  if (exp === 0) return 1;
  const half = power(base, Math.floor(exp / 2));
  if (exp % 2 === 0) return half * half;
  return base * half * half;
}`,
    solutionExplanation:
      "Base case: anything to the power 0 is 1. Recursive case: compute power for half the exponent. If even, square the result. If odd, multiply by base once more. We halve exp each time → O(log n) depth.",
  },
  {
    id: "rec-05",
    chapterId: 6,
    title: "Flatten Nested Array",
    difficulty: "core",
    description:
      "Given a deeply nested array, return a flat array with all values. For example, [1, [2, [3, 4], 5]] becomes [1, 2, 3, 4, 5]. Do NOT use Array.flat().",
    examples: [
      { input: "[1, [2, [3, 4], 5]]", output: "[1, 2, 3, 4, 5]" },
      { input: "[[1, 2], [3, [4, [5]]]]", output: "[1, 2, 3, 4, 5]" },
      { input: "[1, 2, 3]", output: "[1, 2, 3]" },
    ],
    constraints: ["Nesting depth <= 100", "Do not use Array.flat()"],
    starterCode: `function flatten(arr) {
  // Your code here — no Array.flat() allowed
}

// Tests
console.assert(JSON.stringify(flatten([1, [2, [3, 4], 5]])) === '[1,2,3,4,5]', 'Test 1');
console.assert(JSON.stringify(flatten([[1, 2], [3, [4, [5]]]])) === '[1,2,3,4,5]', 'Test 2');
console.assert(JSON.stringify(flatten([1, 2, 3])) === '[1,2,3]', 'Test 3');
console.assert(JSON.stringify(flatten([])) === '[]', 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(flatten([1, [2, [3, 4], 5]])) === '[1,2,3,4,5]', 'Test 1');
console.assert(JSON.stringify(flatten([[1, 2], [3, [4, [5]]]])) === '[1,2,3,4,5]', 'Test 2');
console.assert(JSON.stringify(flatten([1, 2, 3])) === '[1,2,3]', 'Test 3');
console.assert(JSON.stringify(flatten([])) === '[]', 'Test 4');`,
    tags: ["recursion", "array", "nested-structure"],
    order: 5,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: when data is nested to arbitrary depth, recursion naturally handles it — check if an element is an array and recurse, otherwise collect it.",
    solution: `function flatten(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flatten(item));
    } else {
      result.push(item);
    }
  }
  return result;
}`,
    solutionExplanation:
      "Iterate through each element. If it's an array, recursively flatten it and spread the results. If it's a value, push it directly. Total work is O(n) where n is the total number of leaf values.",
  },
  {
    id: "rec-06",
    chapterId: 6,
    title: "String Permutations",
    difficulty: "core",
    description:
      "Given a string with unique characters, return all permutations of the string. Use recursion to generate them. Return an array of strings sorted lexicographically.",
    examples: [
      { input: '"abc"', output: '["abc","acb","bac","bca","cab","cba"]' },
      { input: '"ab"', output: '["ab","ba"]' },
      { input: '"a"', output: '["a"]' },
    ],
    constraints: ["1 <= s.length <= 8", "All characters are unique"],
    starterCode: `function permutations(s) {
  // Your code here
}

// Tests
console.assert(JSON.stringify(permutations('abc')) === '["abc","acb","bac","bca","cab","cba"]', 'Test 1');
console.assert(JSON.stringify(permutations('ab')) === '["ab","ba"]', 'Test 2');
console.assert(JSON.stringify(permutations('a')) === '["a"]', 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(permutations('abc')) === '["abc","acb","bac","bca","cab","cba"]', 'Test 1');
console.assert(JSON.stringify(permutations('ab')) === '["ab","ba"]', 'Test 2');
console.assert(JSON.stringify(permutations('a')) === '["a"]', 'Test 3');
console.assert(permutations('abcd').length === 24, 'Test 4');`,
    tags: ["recursion", "permutations", "string"],
    order: 6,
    timeComplexity: "O(n! × n)",
    spaceComplexity: "O(n! × n)",
    patternSentence:
      "The pattern to remember: to generate all permutations, fix one character at each position and recursively permute the rest.",
    solution: `function permutations(s) {
  if (s.length <= 1) return [s];
  const result = [];
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    const remaining = s.slice(0, i) + s.slice(i + 1);
    const perms = permutations(remaining);
    for (const perm of perms) {
      result.push(char + perm);
    }
  }
  return result.sort();
}`,
    solutionExplanation:
      "For each character in the string, remove it and recursively generate all permutations of the remaining characters. Prepend the removed character to each result. Base case: a single character has one permutation (itself). There are n! permutations total.",
  },
  {
    id: "rec-07",
    chapterId: 6,
    title: "Merge Sort",
    difficulty: "core",
    description:
      "Implement merge sort using recursion. Split the array in half, recursively sort each half, then merge the sorted halves. This is the quintessential divide-and-conquer algorithm.",
    examples: [
      { input: "[38, 27, 43, 3, 9, 82, 10]", output: "[3, 9, 10, 27, 38, 43, 82]" },
      { input: "[5, 1]", output: "[1, 5]" },
      { input: "[1]", output: "[1]" },
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: `function mergeSort(arr) {
  // Your code here
}

// Tests
console.assert(JSON.stringify(mergeSort([38,27,43,3,9,82,10])) === '[3,9,10,27,38,43,82]', 'Test 1');
console.assert(JSON.stringify(mergeSort([5,1])) === '[1,5]', 'Test 2');
console.assert(JSON.stringify(mergeSort([1])) === '[1]', 'Test 3');
console.assert(JSON.stringify(mergeSort([])) === '[]', 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(mergeSort([38,27,43,3,9,82,10])) === '[3,9,10,27,38,43,82]', 'Test 1');
console.assert(JSON.stringify(mergeSort([5,1])) === '[1,5]', 'Test 2');
console.assert(JSON.stringify(mergeSort([1])) === '[1]', 'Test 3');
console.assert(JSON.stringify(mergeSort([])) === '[]', 'Test 4');
console.assert(JSON.stringify(mergeSort([3,3,1,1,2])) === '[1,1,2,3,3]', 'Test 5');`,
    tags: ["recursion", "divide-and-conquer", "sorting"],
    order: 7,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: divide-and-conquer splits the problem in half, solves each half recursively, then combines — this gives O(n log n).",
    solution: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);
  return result;
}`,
    solutionExplanation:
      "Split array in half until base case (length ≤ 1). Merge two sorted halves using two pointers, always picking the smaller element. The merge step is O(n), and we split log(n) times → O(n log n) total.",
  },

  // === CHALLENGE ===
  {
    id: "rec-08",
    chapterId: 6,
    title: "Generate All Subsets (Power Set)",
    difficulty: "challenge",
    description:
      "Given an array of distinct integers, return all possible subsets (the power set). The solution must not contain duplicate subsets. Return them in any order.",
    examples: [
      {
        input: "[1, 2, 3]",
        output: "[[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]",
        explanation: "2^3 = 8 subsets total",
      },
      { input: "[]", output: "[[]]" },
      { input: "[0]", output: "[[], [0]]" },
    ],
    constraints: ["0 <= nums.length <= 10", "All elements are distinct"],
    starterCode: `function subsets(nums) {
  // Your code here
}

// Tests
const result1 = subsets([1, 2, 3]);
console.assert(result1.length === 8, 'Test 1: should have 8 subsets');

const result2 = subsets([]);
console.assert(result2.length === 1, 'Test 2: empty set has 1 subset');

const result3 = subsets([0]);
console.assert(result3.length === 2, 'Test 3: single element has 2 subsets');
console.log('All tests passed!');`,
    testCases: `const r1 = subsets([1,2,3]); console.assert(r1.length === 8, 'Test 1');
const r2 = subsets([]); console.assert(r2.length === 1, 'Test 2');
const r3 = subsets([0]); console.assert(r3.length === 2, 'Test 3');
const r4 = subsets([1,2,3,4]); console.assert(r4.length === 16, 'Test 4');`,
    tags: ["recursion", "backtracking", "power-set"],
    order: 8,
    timeComplexity: "O(n × 2^n)",
    spaceComplexity: "O(n × 2^n)",
    patternSentence:
      "The pattern to remember: for each element, decide to include it or exclude it — this binary choice at each step generates 2^n subsets.",
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
      "Use backtracking: at each step, add the current subset to results, then try adding each remaining element and recurse. After recursion, remove the element (backtrack). This systematically generates all 2^n subsets.",
  },
  {
    id: "rec-09",
    chapterId: 6,
    title: "Tower of Hanoi",
    difficulty: "challenge",
    description:
      "Solve the Tower of Hanoi puzzle. Move n disks from source peg to destination peg using an auxiliary peg. Only one disk can be moved at a time, and no disk may be placed on top of a smaller disk. Return an array of moves as [from, to] pairs.",
    examples: [
      {
        input: "n=2, from='A', to='C', aux='B'",
        output: '[["A","B"],["A","C"],["B","C"]]',
        explanation: "Move disk 1: A→B, Move disk 2: A→C, Move disk 1: B→C",
      },
      { input: "n=1, from='A', to='C', aux='B'", output: '[["A","C"]]' },
    ],
    constraints: ["1 <= n <= 15"],
    starterCode: `function hanoi(n, from, to, aux) {
  const moves = [];
  // Your code here — populate moves array
  return moves;
}

// Tests
console.assert(JSON.stringify(hanoi(1, 'A', 'C', 'B')) === '[["A","C"]]', 'Test 1');
console.assert(hanoi(2, 'A', 'C', 'B').length === 3, 'Test 2: 2 disks = 3 moves');
console.assert(hanoi(3, 'A', 'C', 'B').length === 7, 'Test 3: 3 disks = 7 moves');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(hanoi(1, 'A', 'C', 'B')) === '[["A","C"]]', 'Test 1');
console.assert(hanoi(2, 'A', 'C', 'B').length === 3, 'Test 2');
console.assert(hanoi(3, 'A', 'C', 'B').length === 7, 'Test 3');
console.assert(hanoi(4, 'A', 'C', 'B').length === 15, 'Test 4');`,
    tags: ["recursion", "classic", "divide-and-conquer"],
    order: 9,
    timeComplexity: "O(2^n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: Tower of Hanoi reduces to 'move n-1 disks out of the way, move the big disk, then move n-1 back' — a recursive decomposition.",
    solution: `function hanoi(n, from, to, aux) {
  const moves = [];
  function solve(n, from, to, aux) {
    if (n === 0) return;
    solve(n - 1, from, aux, to);
    moves.push([from, to]);
    solve(n - 1, aux, to, from);
  }
  solve(n, from, to, aux);
  return moves;
}`,
    solutionExplanation:
      "To move n disks from A to C: (1) recursively move n-1 disks from A to B, (2) move the largest disk from A to C, (3) recursively move n-1 disks from B to C. This gives 2^n - 1 moves total.",
  },

  // === REAL-WORLD ===
  {
    id: "rec-10",
    chapterId: 6,
    title: "Deep Clone an Object",
    difficulty: "real-world",
    description:
      "Implement a deep clone function that creates a complete copy of a nested object/array structure. Changing the clone should not affect the original. Handle objects, arrays, and primitives. Do NOT use JSON.parse(JSON.stringify()).",
    examples: [
      {
        input: '{ a: 1, b: { c: 2, d: [3, 4] } }',
        output: '{ a: 1, b: { c: 2, d: [3, 4] } }',
        explanation: "Deep copy — modifying the clone doesn't affect the original",
      },
    ],
    constraints: [
      "Handle objects, arrays, and primitives",
      "Do not use JSON methods",
      "No circular references in input",
    ],
    starterCode: `function deepClone(obj) {
  // Your code here — no JSON.parse/stringify
}

// Tests
const original = { a: 1, b: { c: 2, d: [3, 4] } };
const cloned = deepClone(original);
cloned.b.c = 99;
cloned.b.d.push(5);
console.assert(original.b.c === 2, 'Test 1: original unchanged');
console.assert(original.b.d.length === 2, 'Test 2: original array unchanged');
console.assert(cloned.b.c === 99, 'Test 3: clone modified');
console.assert(deepClone(null) === null, 'Test 4: null');
console.assert(deepClone(42) === 42, 'Test 5: primitive');
console.log('All tests passed!');`,
    testCases: `const o1 = { a: 1, b: { c: 2, d: [3, 4] } };
const c1 = deepClone(o1); c1.b.c = 99; c1.b.d.push(5);
console.assert(o1.b.c === 2, 'Test 1');
console.assert(o1.b.d.length === 2, 'Test 2');
console.assert(c1.b.c === 99, 'Test 3');
console.assert(deepClone(null) === null, 'Test 4');
console.assert(deepClone(42) === 42, 'Test 5');`,
    tags: ["recursion", "deep-clone", "real-world"],
    order: 10,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: recursive deep clone checks the type of each value — if it's an object/array, recurse into it; otherwise, copy the primitive directly.",
    solution: `function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(item => deepClone(item));
  const clone = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
}`,
    solutionExplanation:
      "Base case: if the value is null or a primitive, return it directly. For arrays, map each element through deepClone. For objects, create a new object and recursively clone each property. This ensures no shared references between original and clone.",
  },
];
