import { Problem } from "../../types";

export const binarySearchProblems: Problem[] = [
  // === WARMUP ===
  {
    id: "bs-01",
    chapterId: 3,
    title: "Classic Binary Search",
    difficulty: "warmup",
    description:
      "Given a sorted array of integers and a target, return the index of the target using binary search. If not found, return -1. This is the foundation — get the boundary conditions right.",
    examples: [
      { input: "[-1, 0, 3, 5, 9, 12], target=9", output: "4" },
      { input: "[-1, 0, 3, 5, 9, 12], target=2", output: "-1" },
    ],
    constraints: ["Array is sorted in ascending order", "All elements are unique"],
    starterCode: `function binarySearch(nums, target) {
  // Your code here
}

// Tests
console.assert(binarySearch([-1,0,3,5,9,12], 9) === 4, 'Test 1');
console.assert(binarySearch([-1,0,3,5,9,12], 2) === -1, 'Test 2');
console.assert(binarySearch([5], 5) === 0, 'Test 3');
console.assert(binarySearch([1,2,3,4,5], 1) === 0, 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(binarySearch([-1,0,3,5,9,12],9)===4,'T1');
console.assert(binarySearch([-1,0,3,5,9,12],2)===-1,'T2');`,
    tags: ["binary-search"],
    order: 1,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: maintain [lo, hi] invariant — the target is always in this range. Halve the range each step. Use lo <= hi for exact match.",
    solution: `function binarySearch(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    solutionExplanation:
      "Start with the full range. Compute mid, compare with target. If equal, return. If target is larger, search right half. If smaller, search left half. O(log n) time.",
  },

  // === CORE ===
  {
    id: "bs-02",
    chapterId: 3,
    title: "Find First Occurrence (Leftmost)",
    difficulty: "core",
    description:
      "Given a sorted array that may have duplicates, find the index of the first (leftmost) occurrence of the target. This teaches the 'leftmost binary search' variant.",
    examples: [
      { input: "[1, 2, 2, 2, 3, 4], target=2", output: "1" },
      { input: "[1, 1, 1, 1], target=1", output: "0" },
    ],
    constraints: ["Array is sorted", "Duplicates allowed"],
    starterCode: `function findFirst(nums, target) {
  // Your code here — return -1 if not found
}

// Tests
console.assert(findFirst([1,2,2,2,3,4], 2) === 1, 'Test 1');
console.assert(findFirst([1,1,1,1], 1) === 0, 'Test 2');
console.assert(findFirst([1,2,3], 4) === -1, 'Test 3');
console.assert(findFirst([2,2,2], 2) === 0, 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(findFirst([1,2,2,2,3,4],2)===1,'T1');
console.assert(findFirst([1,1,1,1],1)===0,'T2');
console.assert(findFirst([1,2,3],4)===-1,'T3');`,
    tags: ["binary-search", "leftmost"],
    order: 2,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: when you find target, don't return — set hi = mid - 1 to keep searching left. Record the best answer as you go.",
    solution: `function findFirst(nums, target) {
  let lo = 0, hi = nums.length - 1, result = -1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] === target) {
      result = mid;
      hi = mid - 1; // keep searching left
    } else if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return result;
}`,
    solutionExplanation:
      "Standard binary search, but when we find the target, we record it and continue searching left (hi = mid - 1) to find an earlier occurrence. The last recorded index is the leftmost.",
  },
  {
    id: "bs-03",
    chapterId: 3,
    title: "Search Insert Position",
    difficulty: "core",
    description:
      "Given a sorted array and a target, return the index where it would be inserted to keep the array sorted. If target exists, return its index. This is the 'lower bound' operation.",
    examples: [
      { input: "[1,3,5,6], target=5", output: "2" },
      { input: "[1,3,5,6], target=2", output: "1" },
      { input: "[1,3,5,6], target=7", output: "4" },
    ],
    constraints: ["1 <= nums.length <= 10^4", "No duplicates"],
    starterCode: `function searchInsert(nums, target) {
  // Your code here
}

// Tests
console.assert(searchInsert([1,3,5,6], 5) === 2, 'Test 1');
console.assert(searchInsert([1,3,5,6], 2) === 1, 'Test 2');
console.assert(searchInsert([1,3,5,6], 7) === 4, 'Test 3');
console.assert(searchInsert([1,3,5,6], 0) === 0, 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(searchInsert([1,3,5,6],5)===2,'T1');
console.assert(searchInsert([1,3,5,6],2)===1,'T2');
console.assert(searchInsert([1,3,5,6],7)===4,'T3');`,
    tags: ["binary-search", "lower-bound"],
    order: 3,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: after binary search, lo is the insertion position — it points to the first element >= target.",
    solution: `function searchInsert(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return lo;
}`,
    solutionExplanation:
      "Standard binary search. If the target is found, return its index. If not, lo ends up at the correct insertion point — the position of the first element greater than target.",
  },
  {
    id: "bs-04",
    chapterId: 3,
    title: "Find Peak Element",
    difficulty: "core",
    description:
      "An element is a peak if it's strictly greater than its neighbors. Given an array where arr[-1] = arr[n] = -∞, find any peak element's index in O(log n). Binary search on the answer space.",
    examples: [
      { input: "[1,2,3,1]", output: "2", explanation: "3 is a peak" },
      { input: "[1,2,1,3,5,6,4]", output: "5", explanation: "6 is a peak (1 is also valid)" },
    ],
    constraints: ["1 <= nums.length <= 1000", "nums[i] != nums[i+1] for all i"],
    starterCode: `function findPeakElement(nums) {
  // Your code here — O(log n)
}

// Tests
console.assert(findPeakElement([1,2,3,1]) === 2, 'Test 1');
const peak = findPeakElement([1,2,1,3,5,6,4]);
console.assert(peak === 1 || peak === 5, 'Test 2');
console.assert(findPeakElement([1]) === 0, 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(findPeakElement([1,2,3,1])===2,'T1');
console.assert(findPeakElement([1])===0,'T2');`,
    tags: ["binary-search"],
    order: 4,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: binary search doesn't need a sorted array — it works whenever you can decide which half to discard. Go toward the higher neighbor.",
    solution: `function findPeakElement(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] > nums[mid + 1]) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    solutionExplanation:
      "If mid > mid+1, a peak exists on the left (including mid). Otherwise, a peak exists on the right. Converge until lo === hi. This works because a peak is guaranteed to exist.",
  },

  // === CHALLENGE ===
  {
    id: "bs-05",
    chapterId: 3,
    title: "Search in Rotated Sorted Array",
    difficulty: "challenge",
    description:
      "A sorted array was rotated at some pivot. Search for a target in O(log n). The trick: at every midpoint, one half is always sorted — binary search that half.",
    examples: [
      { input: "[4,5,6,7,0,1,2], target=0", output: "4" },
      { input: "[4,5,6,7,0,1,2], target=3", output: "-1" },
    ],
    constraints: ["All values are unique", "Array was sorted then rotated"],
    starterCode: `function search(nums, target) {
  // Your code here
}

// Tests
console.assert(search([4,5,6,7,0,1,2], 0) === 4, 'Test 1');
console.assert(search([4,5,6,7,0,1,2], 3) === -1, 'Test 2');
console.assert(search([1], 1) === 0, 'Test 3');
console.assert(search([3,1], 1) === 1, 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(search([4,5,6,7,0,1,2],0)===4,'T1');
console.assert(search([4,5,6,7,0,1,2],3)===-1,'T2');`,
    tags: ["binary-search"],
    order: 5,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: one half is always sorted in a rotated array. Check if target is in the sorted half — if yes, search there; otherwise, search the other half.",
    solution: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      // left half is sorted
      if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      // right half is sorted
      if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
    solutionExplanation:
      "At each step, determine which half is sorted (compare lo and mid). Check if target falls within the sorted half. If yes, search there. Otherwise, search the other half.",
  },
];
