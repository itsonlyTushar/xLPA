import { Problem } from "../../types";

export const arrayProblems: Problem[] = [
  // === WARMUP ===
  {
    id: "arr-01",
    chapterId: 1,
    title: "Sum of All Elements",
    difficulty: "warmup",
    description:
      "Given an array of numbers, return the sum of all elements. Use a single pass — no .reduce() allowed. This is your first algorithmic traversal.",
    examples: [
      { input: "[1, 2, 3, 4, 5]", output: "15", explanation: "1+2+3+4+5 = 15" },
      { input: "[-1, 0, 1]", output: "0" },
      { input: "[]", output: "0" },
    ],
    constraints: ["0 <= arr.length <= 10^5", "-10^4 <= arr[i] <= 10^4"],
    starterCode: `function sumArray(arr) {
  // Your code here
}

// Tests
console.assert(sumArray([1, 2, 3, 4, 5]) === 15, 'Test 1: basic sum');
console.assert(sumArray([-1, 0, 1]) === 0, 'Test 2: negative numbers');
console.assert(sumArray([]) === 0, 'Test 3: empty array');
console.assert(sumArray([42]) === 42, 'Test 4: single element');
console.log('All tests passed!');`,
    testCases: `console.assert(sumArray([1, 2, 3, 4, 5]) === 15, 'Test 1');
console.assert(sumArray([-1, 0, 1]) === 0, 'Test 2');
console.assert(sumArray([]) === 0, 'Test 3');
console.assert(sumArray([42]) === 42, 'Test 4');
console.assert(sumArray([100, -100, 50, -50]) === 0, 'Test 5');`,
    tags: ["traversal"],
    order: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternSentence: "The pattern to remember: a single for-loop accumulator is the simplest array traversal — it's the foundation everything else builds on.",
    solution: `function sumArray(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}`,
    solutionExplanation: "Walk through every index from 0 to length-1, adding each element to a running total. Time O(n) because we visit each element exactly once. Space O(1) because we only use one variable regardless of input size.",
  },

  // === CORE ===
  {
    id: "arr-02",
    chapterId: 1,
    title: "Reverse Array In-Place",
    difficulty: "core",
    description:
      "Reverse an array in-place without creating a new array. Return the same array reference. This is your first two-pointer problem.",
    examples: [
      { input: "[1, 2, 3, 4, 5]", output: "[5, 4, 3, 2, 1]" },
      { input: "[1, 2]", output: "[2, 1]" },
      { input: "[1]", output: "[1]" },
    ],
    constraints: ["0 <= arr.length <= 10^5", "Must modify the original array, not create a new one"],
    starterCode: `function reverseInPlace(arr) {
  // Your code here — must modify arr directly
  return arr;
}

// Tests
const a1 = [1, 2, 3, 4, 5];
reverseInPlace(a1);
console.assert(JSON.stringify(a1) === '[5,4,3,2,1]', 'Test 1: odd length');

const a2 = [1, 2];
reverseInPlace(a2);
console.assert(JSON.stringify(a2) === '[2,1]', 'Test 2: even length');

const a3 = [];
reverseInPlace(a3);
console.assert(JSON.stringify(a3) === '[]', 'Test 3: empty');
console.log('All tests passed!');`,
    testCases: `const t1 = [1,2,3,4,5]; reverseInPlace(t1); console.assert(JSON.stringify(t1)==='[5,4,3,2,1]','T1');
const t2 = [1,2]; reverseInPlace(t2); console.assert(JSON.stringify(t2)==='[2,1]','T2');
const t3 = []; reverseInPlace(t3); console.assert(JSON.stringify(t3)==='[]','T3');`,
    tags: ["two-pointer", "in-place"],
    order: 2,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternSentence: "The pattern to remember: two pointers starting at opposite ends, swapping and moving inward — this is the two-pointer template.",
    solution: `function reverseInPlace(arr) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
    left++;
    right--;
  }
  return arr;
}`,
    solutionExplanation: "Place one pointer at the start, one at the end. Swap the elements at both pointers, then move them toward each other. Stop when they meet or cross. Each element is touched at most once → O(n) time, O(1) space.",
  },
  {
    id: "arr-03",
    chapterId: 1,
    title: "Find Maximum in Subarray",
    difficulty: "core",
    description:
      "Given an array and two indices `start` and `end`, find the maximum value in the subarray arr[start..end] (inclusive). Don't use Math.max with spread — iterate manually.",
    examples: [
      { input: "[3, 1, 4, 1, 5, 9, 2, 6], start=2, end=5", output: "9" },
      { input: "[10, 20, 30], start=0, end=0", output: "10" },
    ],
    constraints: ["0 <= start <= end < arr.length", "arr.length >= 1"],
    starterCode: `function maxInSubarray(arr, start, end) {
  // Your code here
}

// Tests
console.assert(maxInSubarray([3,1,4,1,5,9,2,6], 2, 5) === 9, 'Test 1');
console.assert(maxInSubarray([10,20,30], 0, 0) === 10, 'Test 2');
console.assert(maxInSubarray([1,2,3,4,5], 0, 4) === 5, 'Test 3');
console.assert(maxInSubarray([-5,-3,-1,-4], 0, 3) === -1, 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(maxInSubarray([3,1,4,1,5,9,2,6], 2, 5) === 9, 'T1');
console.assert(maxInSubarray([10,20,30], 0, 0) === 10, 'T2');
console.assert(maxInSubarray([-5,-3,-1,-4], 0, 3) === -1, 'T3');`,
    tags: ["traversal", "subarray"],
    order: 3,
    timeComplexity: "O(end - start)",
    spaceComplexity: "O(1)",
    patternSentence: "The pattern to remember: bounded traversal with index limits is a subarray scan — the building block for sliding window.",
  },
  {
    id: "arr-04",
    chapterId: 1,
    title: "Move Zeroes to End",
    difficulty: "core",
    description:
      "Move all zeroes in the array to the end while maintaining the relative order of the non-zero elements. Must be done in-place.",
    examples: [
      { input: "[0, 1, 0, 3, 12]", output: "[1, 3, 12, 0, 0]" },
      { input: "[0, 0, 0]", output: "[0, 0, 0]" },
      { input: "[1, 2, 3]", output: "[1, 2, 3]" },
    ],
    constraints: ["0 <= arr.length <= 10^5", "Must be in-place with O(1) extra space"],
    starterCode: `function moveZeroes(arr) {
  // Your code here — modify arr in-place
  return arr;
}

// Tests
console.assert(JSON.stringify(moveZeroes([0,1,0,3,12])) === '[1,3,12,0,0]', 'Test 1');
console.assert(JSON.stringify(moveZeroes([0,0,0])) === '[0,0,0]', 'Test 2');
console.assert(JSON.stringify(moveZeroes([1,2,3])) === '[1,2,3]', 'Test 3');
console.assert(JSON.stringify(moveZeroes([0])) === '[0]', 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(moveZeroes([0,1,0,3,12]))==='[1,3,12,0,0]','T1');
console.assert(JSON.stringify(moveZeroes([0,0,0]))==='[0,0,0]','T2');
console.assert(JSON.stringify(moveZeroes([1]))==='[1]','T3');`,
    tags: ["two-pointer", "in-place"],
    order: 4,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternSentence: "The pattern to remember: use a 'write pointer' that only advances when you write a non-zero — this is the partition variant of two pointers.",
  },
  {
    id: "arr-05",
    chapterId: 1,
    title: "Two Sum (Sorted Array)",
    difficulty: "core",
    description:
      "Given a SORTED array of integers and a target sum, find two numbers that add up to the target. Return their indices as [i, j]. Use two pointers — no hash map yet.",
    examples: [
      { input: "[1, 2, 3, 4, 6], target=6", output: "[1, 3]", explanation: "2 + 4 = 6" },
      { input: "[2, 7, 11, 15], target=9", output: "[0, 1]" },
    ],
    constraints: ["Array is sorted in ascending order", "Exactly one solution exists", "Cannot use the same element twice"],
    starterCode: `function twoSumSorted(arr, target) {
  // Your code here — use two pointers, not a Map
}

// Tests
console.assert(JSON.stringify(twoSumSorted([1,2,3,4,6], 6)) === '[1,3]', 'Test 1');
console.assert(JSON.stringify(twoSumSorted([2,7,11,15], 9)) === '[0,1]', 'Test 2');
console.assert(JSON.stringify(twoSumSorted([1,3,5,7], 8)) === '[0,3]', 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(twoSumSorted([1,2,3,4,6],6))==='[1,3]','T1');
console.assert(JSON.stringify(twoSumSorted([2,7,11,15],9))==='[0,1]','T2');`,
    tags: ["two-pointer"],
    order: 5,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternSentence: "The pattern to remember: on a sorted array, two pointers from both ends can find a pair in O(n) — sum too big? move right pointer left. Too small? move left pointer right.",
  },
  {
    id: "arr-06",
    chapterId: 1,
    title: "Maximum Subarray Sum (Sliding Window)",
    difficulty: "core",
    description:
      "Given an array of integers and a window size k, find the maximum sum of any contiguous subarray of size k. Use the sliding window technique — not brute force.",
    examples: [
      { input: "[2, 1, 5, 1, 3, 2], k=3", output: "9", explanation: "Subarray [5, 1, 3] has sum 9" },
      { input: "[1, 1, 1, 1, 1], k=2", output: "2" },
    ],
    constraints: ["1 <= k <= arr.length <= 10^5"],
    starterCode: `function maxSubarraySum(arr, k) {
  // Your code here — use sliding window
}

// Tests
console.assert(maxSubarraySum([2,1,5,1,3,2], 3) === 9, 'Test 1');
console.assert(maxSubarraySum([1,1,1,1,1], 2) === 2, 'Test 2');
console.assert(maxSubarraySum([4,2,1,6,2], 4) === 13, 'Test 3');
console.assert(maxSubarraySum([10], 1) === 10, 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(maxSubarraySum([2,1,5,1,3,2],3)===9,'T1');
console.assert(maxSubarraySum([1,1,1,1,1],2)===2,'T2');
console.assert(maxSubarraySum([4,2,1,6,2],4)===13,'T3');`,
    tags: ["sliding-window"],
    order: 6,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternSentence: "The pattern to remember: instead of recalculating from scratch, slide the window by subtracting the element leaving and adding the element entering.",
  },
  {
    id: "arr-07",
    chapterId: 1,
    title: "Prefix Sum — Range Query",
    difficulty: "core",
    description:
      "Build a prefix sum array, then answer range sum queries in O(1). Given an array, implement two functions: buildPrefixSum and rangeSum.",
    examples: [
      {
        input: "arr=[1,2,3,4,5], rangeSum(1,3)",
        output: "9",
        explanation: "arr[1]+arr[2]+arr[3] = 2+3+4 = 9",
      },
    ],
    constraints: ["0 <= left <= right < arr.length"],
    starterCode: `function buildPrefixSum(arr) {
  // Return the prefix sum array
}

function rangeSum(prefix, left, right) {
  // Return sum of arr[left..right] using the prefix array
}

// Tests
const prefix = buildPrefixSum([1, 2, 3, 4, 5]);
console.assert(rangeSum(prefix, 0, 4) === 15, 'Test 1: full range');
console.assert(rangeSum(prefix, 1, 3) === 9, 'Test 2: middle range');
console.assert(rangeSum(prefix, 2, 2) === 3, 'Test 3: single element');
console.assert(rangeSum(prefix, 0, 0) === 1, 'Test 4: first element');
console.log('All tests passed!');`,
    testCases: `const p=buildPrefixSum([1,2,3,4,5]);
console.assert(rangeSum(p,0,4)===15,'T1');
console.assert(rangeSum(p,1,3)===9,'T2');
console.assert(rangeSum(p,2,2)===3,'T3');`,
    tags: ["prefix-sum"],
    order: 7,
    timeComplexity: "O(n) build, O(1) per query",
    spaceComplexity: "O(n)",
    patternSentence: "The pattern to remember: precompute cumulative sums once, then answer any range query instantly with prefix[right+1] - prefix[left].",
  },

  // === CHALLENGE ===
  {
    id: "arr-08",
    chapterId: 1,
    title: "Container With Most Water",
    difficulty: "challenge",
    description:
      "Given an array of heights, find two lines that together with the x-axis form a container that holds the most water. Return the maximum water area. This combines two-pointer with greedy reasoning.",
    examples: [
      { input: "[1, 8, 6, 2, 5, 4, 8, 3, 7]", output: "49", explanation: "Lines at index 1 (h=8) and index 8 (h=7), width=7, area=7*7=49" },
      { input: "[1, 1]", output: "1" },
    ],
    constraints: ["2 <= arr.length <= 10^5", "0 <= arr[i] <= 10^4"],
    starterCode: `function maxArea(heights) {
  // Your code here
}

// Tests
console.assert(maxArea([1,8,6,2,5,4,8,3,7]) === 49, 'Test 1');
console.assert(maxArea([1,1]) === 1, 'Test 2');
console.assert(maxArea([4,3,2,1,4]) === 16, 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(maxArea([1,8,6,2,5,4,8,3,7])===49,'T1');
console.assert(maxArea([1,1])===1,'T2');`,
    tags: ["two-pointer"],
    order: 8,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternSentence: "The pattern to remember: when maximizing with two boundaries, start wide and shrink by moving the shorter side — the taller side can never do better going inward.",
  },

  // === REAL-WORLD ===
  {
    id: "arr-09",
    chapterId: 1,
    title: "Paginate API Results",
    difficulty: "real-world",
    description:
      "You're building a dashboard that shows items from an API. Given an array of items for the current page, a page number (1-indexed), and page size, return a 'page object' with the correct slice of data and metadata. This is exactly what your backend pagination helper does.",
    examples: [
      {
        input: "items=[1..20], page=2, pageSize=5",
        output: '{ data: [6,7,8,9,10], page: 2, pageSize: 5, totalItems: 20, totalPages: 4 }',
      },
    ],
    constraints: ["page >= 1", "pageSize >= 1", "Return empty data array if page exceeds total pages"],
    starterCode: `function paginate(items, page, pageSize) {
  // Return { data, page, pageSize, totalItems, totalPages }
}

// Tests
const items = Array.from({ length: 20 }, (_, i) => i + 1);
const p1 = paginate(items, 2, 5);
console.assert(JSON.stringify(p1.data) === '[6,7,8,9,10]', 'Test 1: page 2');
console.assert(p1.totalPages === 4, 'Test 2: total pages');

const p2 = paginate(items, 5, 5);
console.assert(p2.data.length === 0, 'Test 3: beyond last page');

const p3 = paginate(items, 1, 20);
console.assert(p3.data.length === 20, 'Test 4: all items on one page');
console.log('All tests passed!');`,
    testCases: `const it=Array.from({length:20},(_,i)=>i+1);
const r1=paginate(it,2,5);console.assert(JSON.stringify(r1.data)==='[6,7,8,9,10]','T1');
console.assert(r1.totalPages===4,'T2');
const r2=paginate(it,5,5);console.assert(r2.data.length===0,'T3');`,
    tags: ["traversal", "subarray"],
    order: 9,
    timeComplexity: "O(pageSize)",
    spaceComplexity: "O(pageSize)",
    patternSentence: "The pattern to remember: pagination is just array slicing with computed start/end indices — (page-1)*size to page*size.",
  },
];
