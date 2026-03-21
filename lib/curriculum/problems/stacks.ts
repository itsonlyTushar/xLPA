import { Problem } from "../../types";

export const stackProblems: Problem[] = [
  // === WARMUP ===
  {
    id: "stk-01",
    chapterId: 10,
    title: "Implement a Stack with Array",
    difficulty: "warmup",
    description:
      "Implement a Stack class using an array with push, pop, peek, and isEmpty methods. This is the foundation for all stack-based problems.",
    examples: [
      {
        input: "push(1), push(2), peek() → 2, pop() → 2, pop() → 1, isEmpty() → true",
        output: "2, 2, 1, true",
      },
    ],
    constraints: ["All operations should be O(1)", "pop() and peek() return undefined on empty stack"],
    starterCode: `class Stack {
  constructor() {
    // Your code here
  }

  push(val) {
    // Your code here
  }

  pop() {
    // Your code here
  }

  peek() {
    // Your code here
  }

  isEmpty() {
    // Your code here
  }
}

// Tests
const s = new Stack();
console.assert(s.isEmpty() === true, 'Test 1: empty');
s.push(1);
s.push(2);
s.push(3);
console.assert(s.peek() === 3, 'Test 2: peek');
console.assert(s.pop() === 3, 'Test 3: pop');
console.assert(s.pop() === 2, 'Test 4: pop');
console.assert(s.isEmpty() === false, 'Test 5: not empty');
console.assert(s.pop() === 1, 'Test 6: pop last');
console.assert(s.isEmpty() === true, 'Test 7: empty again');
console.assert(s.pop() === undefined, 'Test 8: pop empty');
console.log('All tests passed!');`,
    testCases: `const s = new Stack();
console.assert(s.isEmpty() === true, 'Test 1');
s.push(1); s.push(2); s.push(3);
console.assert(s.peek() === 3, 'Test 2');
console.assert(s.pop() === 3, 'Test 3');
console.assert(s.pop() === 2, 'Test 4');
console.assert(s.isEmpty() === false, 'Test 5');
console.assert(s.pop() === 1, 'Test 6');
console.assert(s.isEmpty() === true, 'Test 7');
console.assert(s.pop() === undefined, 'Test 8');`,
    tags: ["stack", "data-structure"],
    order: 1,
    timeComplexity: "O(1) per operation",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: a stack is LIFO (Last In, First Out) — push adds to the top, pop removes from the top. Arrays naturally support this with push/pop.",
    solution: `class Stack {
  constructor() {
    this.items = [];
  }
  push(val) {
    this.items.push(val);
  }
  pop() {
    if (this.isEmpty()) return undefined;
    return this.items.pop();
  }
  peek() {
    if (this.isEmpty()) return undefined;
    return this.items[this.items.length - 1];
  }
  isEmpty() {
    return this.items.length === 0;
  }
}`,
    solutionExplanation:
      "Use a JavaScript array as the backing store. push() appends to end, pop() removes from end — both O(1). peek() reads the last element without removing. isEmpty() checks length. All operations are O(1).",
  },
  {
    id: "stk-02",
    chapterId: 10,
    title: "Valid Parentheses",
    difficulty: "warmup",
    description:
      "Given a string containing only '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: open brackets are closed by the same type, and in the correct order.",
    examples: [
      { input: '"()[]{}"', output: "true" },
      { input: '"(]"', output: "false" },
      { input: '"([)]"', output: "false" },
      { input: '"{[]}"', output: "true" },
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only"],
    starterCode: `function isValid(s) {
  // Your code here
}

// Tests
console.assert(isValid("()[]{}") === true, 'Test 1');
console.assert(isValid("(]") === false, 'Test 2');
console.assert(isValid("([)]") === false, 'Test 3');
console.assert(isValid("{[]}") === true, 'Test 4');
console.assert(isValid("(") === false, 'Test 5');
console.assert(isValid("") === true, 'Test 6');
console.log('All tests passed!');`,
    testCases: `console.assert(isValid("()[]{}") === true, 'Test 1');
console.assert(isValid("(]") === false, 'Test 2');
console.assert(isValid("([)]") === false, 'Test 3');
console.assert(isValid("{[]}") === true, 'Test 4');
console.assert(isValid("(") === false, 'Test 5');
console.assert(isValid("") === true, 'Test 6');`,
    tags: ["stack", "parentheses", "classic"],
    order: 2,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: matching brackets = stack. Push opening brackets, pop and compare on closing brackets. If they don't match or stack isn't empty at the end, it's invalid.",
    solution: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const ch of s) {
    if (!map[ch]) {
      stack.push(ch);
    } else {
      if (stack.pop() !== map[ch]) return false;
    }
  }
  return stack.length === 0;
}`,
    solutionExplanation:
      "Use a map of closing→opening brackets. For each character: if it's an opening bracket, push it. If closing, pop the stack and check if the popped bracket matches. If mismatch or stack is empty when popping, return false. At the end, the stack must be empty.",
  },

  // === CORE ===
  {
    id: "stk-03",
    chapterId: 10,
    title: "Min Stack",
    difficulty: "core",
    description:
      "Design a stack that supports push, pop, peek, and retrieving the minimum element — all in O(1) time. Implement the MinStack class.",
    examples: [
      {
        input: "push(-2), push(0), push(-3), getMin() → -3, pop(), peek() → 0, getMin() → -2",
        output: "-3, 0, -2",
      },
    ],
    constraints: ["All operations must be O(1)", "-10^5 <= val <= 10^5"],
    starterCode: `class MinStack {
  constructor() {
    // Your code here
  }

  push(val) {
    // Your code here
  }

  pop() {
    // Your code here
  }

  peek() {
    // Your code here
  }

  getMin() {
    // Your code here
  }
}

// Tests
const ms = new MinStack();
ms.push(-2);
ms.push(0);
ms.push(-3);
console.assert(ms.getMin() === -3, 'Test 1');
ms.pop();
console.assert(ms.peek() === 0, 'Test 2');
console.assert(ms.getMin() === -2, 'Test 3');
console.log('All tests passed!');`,
    testCases: `const ms = new MinStack();
ms.push(-2); ms.push(0); ms.push(-3);
console.assert(ms.getMin() === -3, 'Test 1');
ms.pop();
console.assert(ms.peek() === 0, 'Test 2');
console.assert(ms.getMin() === -2, 'Test 3');
ms.push(-5);
console.assert(ms.getMin() === -5, 'Test 4');`,
    tags: ["stack", "design", "min-tracking"],
    order: 3,
    timeComplexity: "O(1) per operation",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: to track min in O(1), maintain a parallel stack where each entry stores the current minimum at that point in time.",
    solution: `class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }
  push(val) {
    this.stack.push(val);
    const currentMin = this.minStack.length === 0 ? val : Math.min(val, this.minStack[this.minStack.length - 1]);
    this.minStack.push(currentMin);
  }
  pop() {
    this.stack.pop();
    this.minStack.pop();
  }
  peek() {
    return this.stack[this.stack.length - 1];
  }
  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}`,
    solutionExplanation:
      "Use two stacks: one for values and one for minimums. When pushing, also push the current minimum (min of new value and previous minimum). When popping, pop both. getMin() just peeks the min stack. All operations remain O(1).",
  },
  {
    id: "stk-04",
    chapterId: 10,
    title: "Evaluate Reverse Polish Notation",
    difficulty: "core",
    description:
      "Evaluate an arithmetic expression in Reverse Polish Notation (postfix). Valid operators are +, -, *, /. Each operand is an integer. Division truncates toward zero.",
    examples: [
      { input: '["2","1","+","3","*"]', output: "9", explanation: "((2+1)*3) = 9" },
      { input: '["4","13","5","/","+"]', output: "6", explanation: "(4+(13/5)) = 6" },
    ],
    constraints: [
      "1 <= tokens.length <= 10^4",
      "Each token is an operator or integer",
      "Division truncates toward zero",
    ],
    starterCode: `function evalRPN(tokens) {
  // Your code here
}

// Tests
console.assert(evalRPN(["2","1","+","3","*"]) === 9, 'Test 1');
console.assert(evalRPN(["4","13","5","/","+"]) === 6, 'Test 2');
console.assert(evalRPN(["10","6","9","3","+","-11","*","/","*","17","+","5","+"]) === 22, 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(evalRPN(["2","1","+","3","*"]) === 9, 'Test 1');
console.assert(evalRPN(["4","13","5","/","+"]) === 6, 'Test 2');
console.assert(evalRPN(["10","6","9","3","+","-11","*","/","*","17","+","5","+"]) === 22, 'Test 3');
console.assert(evalRPN(["3"]) === 3, 'Test 4');`,
    tags: ["stack", "expression-evaluation", "postfix"],
    order: 4,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: RPN evaluation uses a stack — push numbers, and when you see an operator, pop two operands, compute, push the result back.",
    solution: `function evalRPN(tokens) {
  const stack = [];
  const ops = new Set(['+', '-', '*', '/']);
  for (const token of tokens) {
    if (ops.has(token)) {
      const b = stack.pop();
      const a = stack.pop();
      if (token === '+') stack.push(a + b);
      else if (token === '-') stack.push(a - b);
      else if (token === '*') stack.push(a * b);
      else stack.push(Math.trunc(a / b));
    } else {
      stack.push(Number(token));
    }
  }
  return stack[0];
}`,
    solutionExplanation:
      "Iterate through tokens. If it's a number, push it. If it's an operator, pop two values (b first, then a), compute a op b, and push the result. After processing all tokens, the answer is the single value on the stack. Math.trunc handles truncation toward zero.",
  },
  {
    id: "stk-05",
    chapterId: 10,
    title: "Daily Temperatures",
    difficulty: "core",
    description:
      "Given an array of daily temperatures, return an array where answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If no future day is warmer, put 0. This is the classic 'next greater element' pattern.",
    examples: [
      {
        input: "[73,74,75,71,69,72,76,73]",
        output: "[1,1,4,2,1,1,0,0]",
        explanation: "From day 0 (73°), wait 1 day for 74°. From day 2 (75°), wait 4 days for 76°.",
      },
    ],
    constraints: ["1 <= temperatures.length <= 10^5", "30 <= temperatures[i] <= 100"],
    starterCode: `function dailyTemperatures(temperatures) {
  // Your code here
}

// Tests
console.assert(JSON.stringify(dailyTemperatures([73,74,75,71,69,72,76,73])) === '[1,1,4,2,1,1,0,0]', 'Test 1');
console.assert(JSON.stringify(dailyTemperatures([30,40,50,60])) === '[1,1,1,0]', 'Test 2');
console.assert(JSON.stringify(dailyTemperatures([30,20,10])) === '[0,0,0]', 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(dailyTemperatures([73,74,75,71,69,72,76,73])) === '[1,1,4,2,1,1,0,0]', 'Test 1');
console.assert(JSON.stringify(dailyTemperatures([30,40,50,60])) === '[1,1,1,0]', 'Test 2');
console.assert(JSON.stringify(dailyTemperatures([30,20,10])) === '[0,0,0]', 'Test 3');
console.assert(JSON.stringify(dailyTemperatures([50])) === '[0]', 'Test 4');`,
    tags: ["stack", "monotonic-stack", "next-greater"],
    order: 5,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: monotonic stack — maintain a stack of indices in decreasing temperature order. When a warmer day arrives, pop all cooler days and record the distance.",
    solution: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const result = new Array(n).fill(0);
  const stack = []; // stores indices

  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prevIdx = stack.pop();
      result[prevIdx] = i - prevIdx;
    }
    stack.push(i);
  }
  return result;
}`,
    solutionExplanation:
      "Use a monotonic decreasing stack of indices. For each new temperature, pop all stack entries where the temperature is lower (we found their 'next warmer day'). The distance is current index minus popped index. Each element is pushed and popped at most once → O(n).",
  },
  {
    id: "stk-06",
    chapterId: 10,
    title: "Next Greater Element",
    difficulty: "core",
    description:
      "Given a circular array (the next element of the last element is the first element), find the next greater element for every element. The next greater element of a number x is the first greater number found traversing the array circularly. Output -1 if no greater element exists.",
    examples: [
      { input: "[1, 2, 1]", output: "[2, -1, 2]", explanation: "1→2, 2→-1 (no greater), 1→2 (wraps around)" },
      { input: "[1, 2, 3, 4, 3]", output: "[2, 3, 4, -1, 4]" },
    ],
    constraints: ["1 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
    starterCode: `function nextGreaterElements(nums) {
  // Your code here
}

// Tests
console.assert(JSON.stringify(nextGreaterElements([1,2,1])) === '[2,-1,2]', 'Test 1');
console.assert(JSON.stringify(nextGreaterElements([1,2,3,4,3])) === '[2,3,4,-1,4]', 'Test 2');
console.assert(JSON.stringify(nextGreaterElements([5,4,3,2,1])) === '[-1,5,5,5,5]', 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(nextGreaterElements([1,2,1])) === '[2,-1,2]', 'Test 1');
console.assert(JSON.stringify(nextGreaterElements([1,2,3,4,3])) === '[2,3,4,-1,4]', 'Test 2');
console.assert(JSON.stringify(nextGreaterElements([5,4,3,2,1])) === '[-1,5,5,5,5]', 'Test 3');`,
    tags: ["stack", "monotonic-stack", "circular-array"],
    order: 6,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: for circular arrays, iterate 2n times using modulo to simulate wrapping. The monotonic stack pattern stays the same.",
    solution: `function nextGreaterElements(nums) {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = [];

  for (let i = 0; i < 2 * n; i++) {
    const idx = i % n;
    while (stack.length > 0 && nums[idx] > nums[stack[stack.length - 1]]) {
      result[stack.pop()] = nums[idx];
    }
    if (i < n) stack.push(idx);
  }
  return result;
}`,
    solutionExplanation:
      "To handle the circular nature, iterate 2*n times using i % n. Use a monotonic decreasing stack of indices. When we find a greater element, pop and record. Only push indices during the first pass (i < n) to avoid duplicates.",
  },

  // === CHALLENGE ===
  {
    id: "stk-07",
    chapterId: 10,
    title: "Largest Rectangle in Histogram",
    difficulty: "challenge",
    description:
      "Given an array of integers representing histogram bar heights (each bar width = 1), find the area of the largest rectangle that can be formed within the histogram.",
    examples: [
      { input: "[2, 1, 5, 6, 2, 3]", output: "10", explanation: "Rectangle of height 5 and width 2 between bars at index 2-3" },
      { input: "[2, 4]", output: "4" },
    ],
    constraints: ["1 <= heights.length <= 10^5", "0 <= heights[i] <= 10^4"],
    starterCode: `function largestRectangleArea(heights) {
  // Your code here
}

// Tests
console.assert(largestRectangleArea([2,1,5,6,2,3]) === 10, 'Test 1');
console.assert(largestRectangleArea([2,4]) === 4, 'Test 2');
console.assert(largestRectangleArea([1]) === 1, 'Test 3');
console.assert(largestRectangleArea([6,2,5,4,5,1,6]) === 12, 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(largestRectangleArea([2,1,5,6,2,3]) === 10, 'Test 1');
console.assert(largestRectangleArea([2,4]) === 4, 'Test 2');
console.assert(largestRectangleArea([1]) === 1, 'Test 3');
console.assert(largestRectangleArea([6,2,5,4,5,1,6]) === 12, 'Test 4');`,
    tags: ["stack", "monotonic-stack", "histogram"],
    order: 7,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: monotonic increasing stack — when a shorter bar appears, pop taller bars and calculate the rectangle they could form, using the stack to determine width.",
    solution: `function largestRectangleArea(heights) {
  const stack = [];
  let maxArea = 0;
  const n = heights.length;

  for (let i = 0; i <= n; i++) {
    const h = i === n ? 0 : heights[i];
    while (stack.length > 0 && h < heights[stack[stack.length - 1]]) {
      const height = heights[stack.pop()];
      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, height * width);
    }
    stack.push(i);
  }
  return maxArea;
}`,
    solutionExplanation:
      "Maintain a stack of indices in increasing height order. When we encounter a shorter bar, pop taller bars — for each popped bar, its height is fixed, and its width extends from the current stack top to the current index. A sentinel height of 0 at the end flushes remaining bars.",
  },
  {
    id: "stk-08",
    chapterId: 10,
    title: "Trapping Rain Water (Stack Approach)",
    difficulty: "challenge",
    description:
      "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining. Solve this using a stack-based approach.",
    examples: [
      { input: "[0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
      { input: "[4,2,0,3,2,5]", output: "9" },
    ],
    constraints: ["n == height.length", "1 <= n <= 2 × 10^4", "0 <= height[i] <= 10^5"],
    starterCode: `function trap(height) {
  // Your code here — use a stack approach
}

// Tests
console.assert(trap([0,1,0,2,1,0,1,3,2,1,2,1]) === 6, 'Test 1');
console.assert(trap([4,2,0,3,2,5]) === 9, 'Test 2');
console.assert(trap([1,2,3,4,5]) === 0, 'Test 3: ascending');
console.assert(trap([5,4,3,2,1]) === 0, 'Test 4: descending');
console.log('All tests passed!');`,
    testCases: `console.assert(trap([0,1,0,2,1,0,1,3,2,1,2,1]) === 6, 'Test 1');
console.assert(trap([4,2,0,3,2,5]) === 9, 'Test 2');
console.assert(trap([1,2,3,4,5]) === 0, 'Test 3');
console.assert(trap([5,4,3,2,1]) === 0, 'Test 4');`,
    tags: ["stack", "monotonic-stack", "trapping-rain-water"],
    order: 8,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: use a monotonic decreasing stack. When a taller bar appears, the area between it and the previous taller bar on the stack forms a water pool.",
    solution: `function trap(height) {
  const stack = [];
  let water = 0;

  for (let i = 0; i < height.length; i++) {
    while (stack.length > 0 && height[i] > height[stack[stack.length - 1]]) {
      const bottom = stack.pop();
      if (stack.length === 0) break;
      const left = stack[stack.length - 1];
      const width = i - left - 1;
      const h = Math.min(height[i], height[left]) - height[bottom];
      water += width * h;
    }
    stack.push(i);
  }
  return water;
}`,
    solutionExplanation:
      "Use a stack of indices in decreasing height order. When we find a taller bar, pop the bottom of the pool and calculate water layer by layer: width is the gap between the current bar and the new stack top, height is the min of both walls minus the bottom height.",
  },

  // === REAL-WORLD ===
  {
    id: "stk-09",
    chapterId: 10,
    title: "Browser Back/Forward Navigation",
    difficulty: "real-world",
    description:
      "Implement a BrowserHistory class that simulates browser navigation. visit(url) visits a new URL (clears forward history). back(steps) moves back up to 'steps' pages. forward(steps) moves forward up to 'steps' pages. Return the current URL after back/forward.",
    examples: [
      {
        input: 'new BrowserHistory("google.com"), visit("fb.com"), visit("yt.com"), back(1) → "fb.com", forward(1) → "yt.com"',
        output: '"fb.com", "yt.com"',
      },
    ],
    constraints: [
      "1 <= url.length <= 20",
      "1 <= steps <= 100",
      "back/forward should not go past the beginning/end",
    ],
    starterCode: `class BrowserHistory {
  constructor(homepage) {
    // Your code here
  }

  visit(url) {
    // Your code here
  }

  back(steps) {
    // Your code here — return current URL
  }

  forward(steps) {
    // Your code here — return current URL
  }
}

// Tests
const bh = new BrowserHistory("google.com");
bh.visit("fb.com");
bh.visit("yt.com");
console.assert(bh.back(1) === "fb.com", 'Test 1');
console.assert(bh.back(1) === "google.com", 'Test 2');
console.assert(bh.forward(1) === "fb.com", 'Test 3');
bh.visit("linkedin.com");
console.assert(bh.forward(2) === "linkedin.com", 'Test 4: forward cleared');
console.assert(bh.back(2) === "google.com", 'Test 5');
console.log('All tests passed!');`,
    testCases: `const bh = new BrowserHistory("google.com");
bh.visit("fb.com"); bh.visit("yt.com");
console.assert(bh.back(1) === "fb.com", 'Test 1');
console.assert(bh.back(1) === "google.com", 'Test 2');
console.assert(bh.forward(1) === "fb.com", 'Test 3');
bh.visit("linkedin.com");
console.assert(bh.forward(2) === "linkedin.com", 'Test 4');
console.assert(bh.back(2) === "google.com", 'Test 5');`,
    tags: ["stack", "design", "browser-history", "real-world"],
    order: 9,
    timeComplexity: "O(1) for visit, O(steps) for back/forward",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: browser history uses two stacks — a back stack and a forward stack. Visiting a new page clears the forward stack.",
    solution: `class BrowserHistory {
  constructor(homepage) {
    this.backStack = [homepage];
    this.forwardStack = [];
  }
  visit(url) {
    this.backStack.push(url);
    this.forwardStack = [];
  }
  back(steps) {
    while (steps > 0 && this.backStack.length > 1) {
      this.forwardStack.push(this.backStack.pop());
      steps--;
    }
    return this.backStack[this.backStack.length - 1];
  }
  forward(steps) {
    while (steps > 0 && this.forwardStack.length > 0) {
      this.backStack.push(this.forwardStack.pop());
      steps--;
    }
    return this.backStack[this.backStack.length - 1];
  }
}`,
    solutionExplanation:
      "Two stacks manage navigation. The back stack holds the history up to the current page. Going back pops from back stack and pushes to forward stack. Going forward does the reverse. Visiting a new page pushes to back stack and clears forward stack (just like a real browser).",
  },
  {
    id: "stk-10",
    chapterId: 10,
    title: "Simplify Unix File Path",
    difficulty: "real-world",
    description:
      "Given an absolute Unix-style file path, simplify it to its canonical form. Handle '.', '..', multiple slashes, and trailing slashes. The canonical path starts with '/' and has no trailing slash (except root).",
    examples: [
      { input: '"/home/"', output: '"/home"' },
      { input: '"/a/./b/../../c/"', output: '"/c"' },
      { input: '"/../"', output: '"/"', explanation: "Can't go above root" },
      { input: '"/home//foo/"', output: '"/home/foo"' },
    ],
    constraints: ["1 <= path.length <= 3000", "Path consists of English letters, digits, '.', '/'"],
    starterCode: `function simplifyPath(path) {
  // Your code here
}

// Tests
console.assert(simplifyPath("/home/") === "/home", 'Test 1');
console.assert(simplifyPath("/a/./b/../../c/") === "/c", 'Test 2');
console.assert(simplifyPath("/../") === "/", 'Test 3');
console.assert(simplifyPath("/home//foo/") === "/home/foo", 'Test 4');
console.assert(simplifyPath("/a/b/c/../d") === "/a/b/d", 'Test 5');
console.log('All tests passed!');`,
    testCases: `console.assert(simplifyPath("/home/") === "/home", 'Test 1');
console.assert(simplifyPath("/a/./b/../../c/") === "/c", 'Test 2');
console.assert(simplifyPath("/../") === "/", 'Test 3');
console.assert(simplifyPath("/home//foo/") === "/home/foo", 'Test 4');
console.assert(simplifyPath("/a/b/c/../d") === "/a/b/d", 'Test 5');`,
    tags: ["stack", "string", "file-path", "real-world"],
    order: 10,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: split the path by '/', use a stack for directory names. '.' means stay, '..' means pop (go up), anything else gets pushed.",
    solution: `function simplifyPath(path) {
  const stack = [];
  const parts = path.split('/');
  for (const part of parts) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      stack.pop();
    } else {
      stack.push(part);
    }
  }
  return '/' + stack.join('/');
}`,
    solutionExplanation:
      "Split the path by '/'. Iterate through parts: skip empty strings and '.'. For '..', pop the stack (go up a directory). For any valid directory name, push it. At the end, join the stack with '/' and prepend '/' for the root.",
  },
];
