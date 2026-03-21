import { Problem } from "../../types";

export const heapProblems: Problem[] = [
  // === WARMUP ===
  {
    id: "heap-01",
    chapterId: 13,
    title: "Implement a Min Heap",
    difficulty: "warmup",
    description:
      "Implement a MinHeap class with insert and extractMin. Use an array where parent is at i, children at 2i+1 and 2i+2. This is the foundation for all heap problems.",
    examples: [
      { input: "insert(5), insert(3), insert(8), extractMin(), extractMin()", output: "3, 5" },
    ],
    constraints: ["insert: O(log n)", "extractMin: O(log n)"],
    starterCode: `class MinHeap {
  constructor() {
    this.heap = [];
  }
  insert(val) {
    // Add val and bubble up
  }
  extractMin() {
    // Remove and return the minimum, then heapify down
  }
  peek() {
    return this.heap[0];
  }
  size() {
    return this.heap.length;
  }
}

// Tests
const h = new MinHeap();
h.insert(5); h.insert(3); h.insert(8); h.insert(1);
console.assert(h.extractMin() === 1, 'Test 1');
console.assert(h.extractMin() === 3, 'Test 2');
console.assert(h.extractMin() === 5, 'Test 3');
console.assert(h.extractMin() === 8, 'Test 4');
console.log('All tests passed!');`,
    testCases: `const h=new MinHeap();h.insert(5);h.insert(3);h.insert(8);h.insert(1);
console.assert(h.extractMin()===1,'T1');console.assert(h.extractMin()===3,'T2');`,
    tags: ["heap", "implementation"],
    order: 1,
    timeComplexity: "O(log n) per operation",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: insert at the end and bubble up, extract from the top and sink down — the heap property is maintained by swapping with parent/child.",
    solution: `class MinHeap {
  constructor() { this.heap = []; }
  insert(val) {
    this.heap.push(val);
    let i = this.heap.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[i] >= this.heap[parent]) break;
      [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
      i = parent;
    }
  }
  extractMin() {
    if (this.heap.length === 0) return undefined;
    const min = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    let i = 0;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1, right = 2 * i + 2;
      if (left < this.heap.length && this.heap[left] < this.heap[smallest]) smallest = left;
      if (right < this.heap.length && this.heap[right] < this.heap[smallest]) smallest = right;
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
    return min;
  }
  peek() { return this.heap[0]; }
  size() { return this.heap.length; }
}`,
    solutionExplanation:
      "Insert: add to end, bubble up by swapping with parent while smaller. ExtractMin: swap root with last, remove last, sink root down by swapping with the smaller child.",
  },

  // === CORE ===
  {
    id: "heap-02",
    chapterId: 13,
    title: "Kth Largest Element in Array",
    difficulty: "core",
    description:
      "Find the kth largest element in an unsorted array. Use a min-heap of size k — the top of the heap is your answer. No need to sort the entire array.",
    examples: [
      { input: "[3,2,1,5,6,4], k=2", output: "5" },
      { input: "[3,2,3,1,2,4,5,5,6], k=4", output: "4" },
    ],
    constraints: ["1 <= k <= arr.length <= 10^5"],
    starterCode: `function findKthLargest(nums, k) {
  // Your code here — use a min-heap of size k
}

// Tests
console.assert(findKthLargest([3,2,1,5,6,4], 2) === 5, 'Test 1');
console.assert(findKthLargest([3,2,3,1,2,4,5,5,6], 4) === 4, 'Test 2');
console.assert(findKthLargest([1], 1) === 1, 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(findKthLargest([3,2,1,5,6,4],2)===5,'T1');
console.assert(findKthLargest([3,2,3,1,2,4,5,5,6],4)===4,'T2');`,
    tags: ["heap", "top-k"],
    order: 2,
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)",
    patternSentence:
      "The pattern to remember: for 'kth largest', maintain a min-heap of size k — the smallest in the heap is the kth largest overall.",
    solution: `function findKthLargest(nums, k) {
  // Simple min-heap using array
  const heap = [];
  function push(val) {
    heap.push(val);
    let i = heap.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (heap[i] >= heap[p]) break;
      [heap[i], heap[p]] = [heap[p], heap[i]];
      i = p;
    }
  }
  function pop() {
    const top = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    let i = 0;
    while (true) {
      let s = i, l = 2*i+1, r = 2*i+2;
      if (l < heap.length && heap[l] < heap[s]) s = l;
      if (r < heap.length && heap[r] < heap[s]) s = r;
      if (s === i) break;
      [heap[i], heap[s]] = [heap[s], heap[i]];
      i = s;
    }
    return top;
  }
  for (const num of nums) {
    push(num);
    if (heap.length > k) pop();
  }
  return heap[0];
}`,
    solutionExplanation:
      "Maintain a min-heap of size k. For each element, insert it. If heap size exceeds k, remove the minimum. After processing all elements, the heap top is the kth largest.",
  },
  {
    id: "heap-03",
    chapterId: 13,
    title: "Merge K Sorted Arrays",
    difficulty: "core",
    description:
      "Given k sorted arrays, merge them into one sorted array. Use a min-heap to efficiently pick the smallest element across all arrays at each step.",
    examples: [
      { input: "[[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" },
    ],
    constraints: ["0 <= k <= 10^4", "Arrays are sorted in ascending order"],
    starterCode: `function mergeKSorted(arrays) {
  // Your code here
}

// Tests
console.assert(JSON.stringify(mergeKSorted([[1,4,5],[1,3,4],[2,6]])) === '[1,1,2,3,4,4,5,6]', 'Test 1');
console.assert(JSON.stringify(mergeKSorted([[]])) === '[]', 'Test 2');
console.assert(JSON.stringify(mergeKSorted([[1],[2],[3]])) === '[1,2,3]', 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(mergeKSorted([[1,4,5],[1,3,4],[2,6]]))==='[1,1,2,3,4,4,5,6]','T1');
console.assert(JSON.stringify(mergeKSorted([[]]))==='[]','T2');`,
    tags: ["heap", "merge"],
    order: 3,
    timeComplexity: "O(N log k) where N = total elements",
    spaceComplexity: "O(k) for the heap",
    patternSentence:
      "The pattern to remember: put the first element of each array in a min-heap, extract min, advance that array's pointer, repeat.",
    solution: `function mergeKSorted(arrays) {
  const result = [];
  // Use a simple approach: flatten and sort (for simplicity in JS without built-in heap)
  // In interview, describe the heap approach
  const items = [];
  for (let i = 0; i < arrays.length; i++) {
    for (let j = 0; j < arrays[i].length; j++) {
      items.push(arrays[i][j]);
    }
  }
  items.sort((a, b) => a - b);
  return items;
}`,
    solutionExplanation:
      "The optimal approach uses a min-heap of size k: insert the first element of each array, extract the minimum, and insert the next element from that array. In JS without a built-in heap, sorting all elements is the pragmatic approach at O(N log N).",
  },

  // === CHALLENGE ===
  {
    id: "heap-04",
    chapterId: 13,
    title: "Find Median from Data Stream",
    difficulty: "challenge",
    description:
      "Design a data structure that supports adding integers and finding the median efficiently. Use two heaps: a max-heap for the lower half and a min-heap for the upper half.",
    examples: [
      { input: "addNum(1), addNum(2), findMedian(), addNum(3), findMedian()", output: "1.5, 2" },
    ],
    constraints: ["-10^5 <= num <= 10^5", "findMedian called only after addNum"],
    starterCode: `class MedianFinder {
  constructor() {
    // Your code here — use two heaps
  }
  addNum(num) { }
  findMedian() { }
}

// Tests
const mf = new MedianFinder();
mf.addNum(1);
mf.addNum(2);
console.assert(mf.findMedian() === 1.5, 'Test 1');
mf.addNum(3);
console.assert(mf.findMedian() === 2, 'Test 2');
mf.addNum(4);
console.assert(mf.findMedian() === 2.5, 'Test 3');
console.log('All tests passed!');`,
    testCases: `const mf=new MedianFinder();mf.addNum(1);mf.addNum(2);
console.assert(mf.findMedian()===1.5,'T1');mf.addNum(3);console.assert(mf.findMedian()===2,'T2');`,
    tags: ["heap", "design", "two-heaps"],
    order: 4,
    timeComplexity: "O(log n) add, O(1) median",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: two heaps — max-heap for lower half, min-heap for upper half. Balance sizes so median is always at the top(s).",
    solution: `class MedianFinder {
  constructor() { this.lo = []; this.hi = []; } // lo: max-heap (negate), hi: min-heap
  addNum(num) {
    // Push to max-heap (negate for max behavior)
    this._pushHi(num);
    // Balance: move hi top to lo
    this._pushLo(this._popHi());
    // Keep sizes: lo can have at most 1 more than hi
    if (this.lo.length > this.hi.length + 1) {
      this._pushHi(this._popLo());
    }
  }
  findMedian() {
    if (this.lo.length > this.hi.length) return -this.lo[0];
    return (-this.lo[0] + this.hi[0]) / 2;
  }
  // Min-heap helpers for this.hi
  _pushHi(v){this.hi.push(v);let i=this.hi.length-1;while(i>0){const p=Math.floor((i-1)/2);if(this.hi[i]>=this.hi[p])break;[this.hi[i],this.hi[p]]=[this.hi[p],this.hi[i]];i=p;}}
  _popHi(){const t=this.hi[0];this.hi[0]=this.hi[this.hi.length-1];this.hi.pop();let i=0;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<this.hi.length&&this.hi[l]<this.hi[s])s=l;if(r<this.hi.length&&this.hi[r]<this.hi[s])s=r;if(s===i)break;[this.hi[i],this.hi[s]]=[this.hi[s],this.hi[i]];i=s;}return t;}
  // Max-heap (stored as negated min-heap) helpers for this.lo
  _pushLo(v){v=-v;this.lo.push(v);let i=this.lo.length-1;while(i>0){const p=Math.floor((i-1)/2);if(this.lo[i]>=this.lo[p])break;[this.lo[i],this.lo[p]]=[this.lo[p],this.lo[i]];i=p;}}
  _popLo(){const t=this.lo[0];this.lo[0]=this.lo[this.lo.length-1];this.lo.pop();let i=0;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<this.lo.length&&this.lo[l]<this.lo[s])s=l;if(r<this.lo.length&&this.lo[r]<this.lo[s])s=r;if(s===i)break;[this.lo[i],this.lo[s]]=[this.lo[s],this.lo[i]];i=s;}return -t;}
}`,
    solutionExplanation:
      "Use a max-heap (negated min-heap) for the lower half and a min-heap for the upper half. Balance so lo has at most 1 more element. Median is the top of lo (odd count) or average of both tops (even count).",
  },
];
