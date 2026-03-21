import { Problem } from "../../types";

export const queueProblems: Problem[] = [
  // === WARMUP ===
  {
    id: "que-01",
    chapterId: 11,
    title: "Implement a Queue with Array",
    difficulty: "warmup",
    description:
      "Implement a Queue class with enqueue, dequeue, front, isEmpty, and size methods. Understand why Array.shift() is O(n) and how to avoid it with an object-based approach.",
    examples: [
      { input: "enqueue(1), enqueue(2), front(), dequeue(), size()", output: "1, 1, 1" },
    ],
    constraints: ["All operations should be amortized O(1)"],
    starterCode: `class Queue {
  constructor() {
    // Your code here — hint: use an object with head/tail pointers
  }
  enqueue(val) { }
  dequeue() { }
  front() { }
  isEmpty() { }
  size() { }
}

// Tests
const q = new Queue();
console.assert(q.isEmpty() === true, 'Test 1');
q.enqueue(1); q.enqueue(2); q.enqueue(3);
console.assert(q.front() === 1, 'Test 2');
console.assert(q.dequeue() === 1, 'Test 3');
console.assert(q.size() === 2, 'Test 4');
console.log('All tests passed!');`,
    testCases: `const q=new Queue();q.enqueue(1);q.enqueue(2);q.enqueue(3);
console.assert(q.front()===1,'T1');console.assert(q.dequeue()===1,'T2');console.assert(q.size()===2,'T3');`,
    tags: ["queue", "implementation"],
    order: 1,
    timeComplexity: "O(1) amortized per operation",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: use an object with head/tail indices for O(1) dequeue — avoid Array.shift() which is O(n).",
    solution: `class Queue {
  constructor() { this.store = {}; this.head = 0; this.tail = 0; }
  enqueue(val) { this.store[this.tail] = val; this.tail++; }
  dequeue() {
    if (this.isEmpty()) return undefined;
    const val = this.store[this.head];
    delete this.store[this.head];
    this.head++;
    return val;
  }
  front() { return this.isEmpty() ? undefined : this.store[this.head]; }
  isEmpty() { return this.head === this.tail; }
  size() { return this.tail - this.head; }
}`,
    solutionExplanation:
      "Use an object as storage with head and tail indices. Enqueue adds at tail++, dequeue removes at head++. Both are O(1). The object keys act as a sparse array.",
  },

  // === CORE ===
  {
    id: "que-02",
    chapterId: 11,
    title: "Implement Queue Using Two Stacks",
    difficulty: "core",
    description:
      "Implement a FIFO queue using only two stacks (arrays with push/pop only). This is a classic problem that shows how to convert LIFO to FIFO.",
    examples: [
      { input: "enqueue(1), enqueue(2), dequeue(), enqueue(3), dequeue()", output: "1, 2" },
    ],
    constraints: ["Use only push and pop on the internal arrays", "Amortized O(1) per operation"],
    starterCode: `class QueueFromStacks {
  constructor() {
    // Your code here — use two arrays as stacks
  }
  enqueue(val) { }
  dequeue() { }
  front() { }
  isEmpty() { }
}

// Tests
const q = new QueueFromStacks();
q.enqueue(1); q.enqueue(2);
console.assert(q.dequeue() === 1, 'Test 1');
q.enqueue(3);
console.assert(q.dequeue() === 2, 'Test 2');
console.assert(q.dequeue() === 3, 'Test 3');
console.assert(q.isEmpty() === true, 'Test 4');
console.log('All tests passed!');`,
    testCases: `const q=new QueueFromStacks();q.enqueue(1);q.enqueue(2);
console.assert(q.dequeue()===1,'T1');q.enqueue(3);console.assert(q.dequeue()===2,'T2');`,
    tags: ["queue", "stack", "design"],
    order: 2,
    timeComplexity: "O(1) amortized",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: push stack → pop stack. Lazy transfer: only move elements when the pop stack is empty — amortized O(1).",
    solution: `class QueueFromStacks {
  constructor() { this.pushStack = []; this.popStack = []; }
  enqueue(val) { this.pushStack.push(val); }
  dequeue() {
    if (this.popStack.length === 0) {
      while (this.pushStack.length > 0) this.popStack.push(this.pushStack.pop());
    }
    return this.popStack.pop();
  }
  front() {
    if (this.popStack.length === 0) {
      while (this.pushStack.length > 0) this.popStack.push(this.pushStack.pop());
    }
    return this.popStack[this.popStack.length - 1];
  }
  isEmpty() { return this.pushStack.length === 0 && this.popStack.length === 0; }
}`,
    solutionExplanation:
      "Always push to pushStack. When dequeuing, if popStack is empty, pour all elements from pushStack (reversing the order). This gives FIFO behavior with amortized O(1).",
  },
  {
    id: "que-03",
    chapterId: 11,
    title: "Number of Recent Calls",
    difficulty: "core",
    description:
      "Implement a RecentCounter class that counts recent requests within a time window. Each call to ping(t) adds a new request at time t and returns the number of requests in [t-3000, t].",
    examples: [
      { input: "ping(1), ping(100), ping(3001), ping(3002)", output: "1, 2, 3, 3" },
    ],
    constraints: ["1 <= t <= 10^9", "Each t is strictly greater than the previous", "At most 10^4 calls"],
    starterCode: `class RecentCounter {
  constructor() {
    // Your code here
  }
  ping(t) {
    // Return number of requests in [t-3000, t]
  }
}

// Tests
const rc = new RecentCounter();
console.assert(rc.ping(1) === 1, 'Test 1');
console.assert(rc.ping(100) === 2, 'Test 2');
console.assert(rc.ping(3001) === 3, 'Test 3');
console.assert(rc.ping(3002) === 3, 'Test 4');
console.log('All tests passed!');`,
    testCases: `const rc=new RecentCounter();
console.assert(rc.ping(1)===1,'T1');console.assert(rc.ping(100)===2,'T2');
console.assert(rc.ping(3001)===3,'T3');console.assert(rc.ping(3002)===3,'T4');`,
    tags: ["queue", "sliding-window"],
    order: 3,
    timeComplexity: "O(1) amortized per ping",
    spaceComplexity: "O(W) where W = window size",
    patternSentence:
      "The pattern to remember: a queue naturally models a sliding time window — enqueue new events, dequeue expired ones.",
    solution: `class RecentCounter {
  constructor() { this.queue = []; this.head = 0; }
  ping(t) {
    this.queue.push(t);
    while (this.queue[this.head] < t - 3000) this.head++;
    return this.queue.length - this.head;
  }
}`,
    solutionExplanation:
      "Keep all request times in a queue. On each ping, add the new time, then remove (advance head past) all times older than t-3000. The remaining count is the answer.",
  },

  // === CHALLENGE ===
  {
    id: "que-04",
    chapterId: 11,
    title: "Sliding Window Maximum",
    difficulty: "challenge",
    description:
      "Given an array of integers and a window size k, return the maximum value in each window as it slides from left to right. Use a monotonic deque for O(n) time.",
    examples: [
      { input: "[1,3,-1,-3,5,3,6,7], k=3", output: "[3,3,5,5,6,7]" },
    ],
    constraints: ["1 <= arr.length <= 10^5", "1 <= k <= arr.length"],
    starterCode: `function maxSlidingWindow(arr, k) {
  // Your code here — use a deque (monotonic)
}

// Tests
console.assert(JSON.stringify(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3)) === '[3,3,5,5,6,7]', 'Test 1');
console.assert(JSON.stringify(maxSlidingWindow([1], 1)) === '[1]', 'Test 2');
console.assert(JSON.stringify(maxSlidingWindow([9,11], 2)) === '[11]', 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(maxSlidingWindow([1,3,-1,-3,5,3,6,7],3))==='[3,3,5,5,6,7]','T1');
console.assert(JSON.stringify(maxSlidingWindow([1],1))==='[1]','T2');`,
    tags: ["queue", "deque", "monotonic", "sliding-window"],
    order: 4,
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)",
    patternSentence:
      "The pattern to remember: a monotonic deque stores indices in decreasing value order — the front is always the window maximum, and stale indices are removed from the front.",
    solution: `function maxSlidingWindow(arr, k) {
  const result = [];
  const deque = []; // stores indices, front has max
  for (let i = 0; i < arr.length; i++) {
    // Remove indices outside the window
    while (deque.length > 0 && deque[0] <= i - k) deque.shift();
    // Remove smaller elements from the back
    while (deque.length > 0 && arr[deque[deque.length - 1]] <= arr[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) result.push(arr[deque[0]]);
  }
  return result;
}`,
    solutionExplanation:
      "Maintain a deque of indices in decreasing order of their array values. For each new element: remove out-of-window indices from front, remove smaller values from back, push current index. The front is always the window maximum.",
  },

  // === REAL-WORLD ===
  {
    id: "que-05",
    chapterId: 11,
    title: "Task Scheduler",
    difficulty: "real-world",
    description:
      "Given an array of tasks (characters) and a cooldown period n, find the minimum time units needed to complete all tasks. Same tasks must be separated by at least n intervals.",
    examples: [
      { input: '["A","A","A","B","B","B"], n=2', output: "8", explanation: "A->B->idle->A->B->idle->A->B" },
    ],
    constraints: ["1 <= tasks.length <= 10^4", "0 <= n <= 100"],
    starterCode: `function leastInterval(tasks, n) {
  // Your code here
}

// Tests
console.assert(leastInterval(["A","A","A","B","B","B"], 2) === 8, 'Test 1');
console.assert(leastInterval(["A","A","A","B","B","B"], 0) === 6, 'Test 2');
console.assert(leastInterval(["A","A","A","A","B","B","B","C","C"], 2) === 10, 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(leastInterval(["A","A","A","B","B","B"],2)===8,'T1');
console.assert(leastInterval(["A","A","A","B","B","B"],0)===6,'T2');`,
    tags: ["queue", "greedy", "frequency-count"],
    order: 5,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) — 26 letters max",
    patternSentence:
      "The pattern to remember: the most frequent task dictates the minimum time — fill the gaps between it with other tasks or idle time.",
    solution: `function leastInterval(tasks, n) {
  const freq = new Array(26).fill(0);
  for (const t of tasks) freq[t.charCodeAt(0) - 65]++;
  const maxFreq = Math.max(...freq);
  const maxCount = freq.filter(f => f === maxFreq).length;
  return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount);
}`,
    solutionExplanation:
      "Count task frequencies. The minimum time is determined by the most frequent task: (maxFreq-1) groups of (n+1) slots, plus the number of tasks with maxFreq. Take the maximum of this and the total task count.",
  },
];
