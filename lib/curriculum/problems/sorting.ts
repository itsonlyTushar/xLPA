import { Problem } from "../../types";

export const sortingProblems: Problem[] = [
  // === WARMUP ===
  {
    id: "sort-01",
    chapterId: 4,
    title: "Bubble Sort",
    difficulty: "warmup",
    description:
      "Implement bubble sort — the simplest sorting algorithm. Repeatedly step through the array, compare adjacent elements, and swap them if they're in the wrong order. Great for understanding sort mechanics.",
    examples: [
      { input: "[64, 34, 25, 12, 22, 11, 90]", output: "[11, 12, 22, 25, 34, 64, 90]" },
      { input: "[5, 1, 4, 2, 8]", output: "[1, 2, 4, 5, 8]" },
    ],
    constraints: ["Sort in ascending order", "In-place modification"],
    starterCode: `function bubbleSort(arr) {
  // Your code here — return sorted array
}

// Tests
console.assert(JSON.stringify(bubbleSort([64,34,25,12,22,11,90])) === JSON.stringify([11,12,22,25,34,64,90]), 'Test 1');
console.assert(JSON.stringify(bubbleSort([5,1,4,2,8])) === JSON.stringify([1,2,4,5,8]), 'Test 2');
console.assert(JSON.stringify(bubbleSort([1])) === JSON.stringify([1]), 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(bubbleSort([64,34,25,12,22,11,90]))===JSON.stringify([11,12,22,25,34,64,90]),'T1');`,
    tags: ["sorting", "bubble-sort"],
    order: 1,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: nested loops — outer loop shrinks the unsorted portion, inner loop bubbles the largest element to the end each pass.",
    solution: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // optimization: already sorted
  }
  return arr;
}`,
    solutionExplanation:
      "Two nested loops. Outer loop runs n-1 times. Inner loop compares adjacent pairs and swaps if out of order. The `swapped` flag provides early termination if array becomes sorted.",
  },
  {
    id: "sort-02",
    chapterId: 4,
    title: "Selection Sort",
    difficulty: "warmup",
    description:
      "Implement selection sort — find the minimum element from the unsorted portion and put it at the beginning. Build the sorted portion from left to right.",
    examples: [
      { input: "[29, 10, 14, 37, 13]", output: "[10, 13, 14, 29, 37]" },
    ],
    constraints: ["Sort in ascending order", "In-place"],
    starterCode: `function selectionSort(arr) {
  // Your code here
}

// Tests
console.assert(JSON.stringify(selectionSort([29,10,14,37,13])) === JSON.stringify([10,13,14,29,37]), 'Test 1');
console.assert(JSON.stringify(selectionSort([5,3,8,1])) === JSON.stringify([1,3,5,8]), 'Test 2');
console.assert(JSON.stringify(selectionSort([1,2,3])) === JSON.stringify([1,2,3]), 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(selectionSort([29,10,14,37,13]))===JSON.stringify([10,13,14,29,37]),'T1');`,
    tags: ["sorting", "selection-sort"],
    order: 2,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: for each position, scan the rest to find the minimum and swap it into place. The left portion is always sorted.",
    solution: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`,
    solutionExplanation:
      "For each position i, find the minimum in arr[i..n-1], then swap it into position i. After i iterations, the first i elements are sorted.",
  },

  // === CORE ===
  {
    id: "sort-03",
    chapterId: 4,
    title: "Merge Sort",
    difficulty: "core",
    description:
      "Implement merge sort — the divide-and-conquer sorting algorithm. Split the array in half, recursively sort each half, then merge the two sorted halves. This is O(n log n) guaranteed.",
    examples: [
      { input: "[38, 27, 43, 3, 9, 82, 10]", output: "[3, 9, 10, 27, 38, 43, 82]" },
    ],
    constraints: ["Return a new sorted array", "Use divide and conquer"],
    starterCode: `function mergeSort(arr) {
  // Your code here
}

// Tests
console.assert(JSON.stringify(mergeSort([38,27,43,3,9,82,10])) === JSON.stringify([3,9,10,27,38,43,82]), 'Test 1');
console.assert(JSON.stringify(mergeSort([5,2,8,1,9])) === JSON.stringify([1,2,5,8,9]), 'Test 2');
console.assert(JSON.stringify(mergeSort([])) === JSON.stringify([]), 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(mergeSort([38,27,43,3,9,82,10]))===JSON.stringify([3,9,10,27,38,43,82]),'T1');`,
    tags: ["sorting", "merge-sort", "divide-and-conquer"],
    order: 3,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: split in half → recurse → merge two sorted halves with two pointers. The merge step is the key — it runs in O(n).",
    solution: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(a, b) {
  const result = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) result.push(a[i++]);
    else result.push(b[j++]);
  }
  while (i < a.length) result.push(a[i++]);
  while (j < b.length) result.push(b[j++]);
  return result;
}`,
    solutionExplanation:
      "Base case: arrays of length 0 or 1 are sorted. Split at midpoint, recurse on both halves, then merge using two pointers — always picking the smaller element.",
  },
  {
    id: "sort-04",
    chapterId: 4,
    title: "Quick Sort",
    difficulty: "core",
    description:
      "Implement quick sort — pick a pivot, partition elements into groups less than and greater than the pivot, then recursively sort each group. Average O(n log n), in-place.",
    examples: [
      { input: "[10, 80, 30, 90, 40, 50, 70]", output: "[10, 30, 40, 50, 70, 80, 90]" },
    ],
    constraints: ["In-place sorting", "Use Lomuto or Hoare partition"],
    starterCode: `function quickSort(arr, lo = 0, hi = arr.length - 1) {
  // Your code here — sort in-place, return arr
  return arr;
}

// Tests
console.assert(JSON.stringify(quickSort([10,80,30,90,40,50,70])) === JSON.stringify([10,30,40,50,70,80,90]), 'Test 1');
console.assert(JSON.stringify(quickSort([3,1,2])) === JSON.stringify([1,2,3]), 'Test 2');
console.assert(JSON.stringify(quickSort([1])) === JSON.stringify([1]), 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(quickSort([10,80,30,90,40,50,70]))===JSON.stringify([10,30,40,50,70,80,90]),'T1');`,
    tags: ["sorting", "quick-sort", "divide-and-conquer"],
    order: 4,
    timeComplexity: "O(n log n) average",
    spaceComplexity: "O(log n) stack",
    patternSentence:
      "The pattern to remember: choose pivot → partition so everything left is smaller, right is larger → recurse on both sides. The partition step does the real work.",
    solution: `function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo < hi) {
    const pivotIdx = partition(arr, lo, hi);
    quickSort(arr, lo, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, hi);
  }
  return arr;
}

function partition(arr, lo, hi) {
  const pivot = arr[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[hi]] = [arr[hi], arr[i]];
  return i;
}`,
    solutionExplanation:
      "Lomuto partition: use last element as pivot. Walk through array — elements smaller than pivot go to the left portion (swapped with position i). Finally place pivot at position i.",
  },

  // === CHALLENGE ===
  {
    id: "sort-05",
    chapterId: 4,
    title: "Sort Colors (Dutch National Flag)",
    difficulty: "challenge",
    description:
      "Given an array with elements 0, 1, and 2 (red, white, blue), sort them in-place in a single pass using the Dutch National Flag algorithm. No counting sort allowed!",
    examples: [
      { input: "[2, 0, 2, 1, 1, 0]", output: "[0, 0, 1, 1, 2, 2]" },
      { input: "[2, 0, 1]", output: "[0, 1, 2]" },
    ],
    constraints: ["Only values 0, 1, 2", "One-pass, constant space"],
    starterCode: `function sortColors(nums) {
  // Sort in-place, return the array
  return nums;
}

// Tests
console.assert(JSON.stringify(sortColors([2,0,2,1,1,0])) === JSON.stringify([0,0,1,1,2,2]), 'Test 1');
console.assert(JSON.stringify(sortColors([2,0,1])) === JSON.stringify([0,1,2]), 'Test 2');
console.assert(JSON.stringify(sortColors([0])) === JSON.stringify([0]), 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(sortColors([2,0,2,1,1,0]))===JSON.stringify([0,0,1,1,2,2]),'T1');`,
    tags: ["sorting", "three-pointer"],
    order: 5,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: three pointers — lo (boundary for 0s), hi (boundary for 2s), mid (current). Swap 0s left, 2s right, advance mid for 1s.",
    solution: `function sortColors(nums) {
  let lo = 0, mid = 0, hi = nums.length - 1;
  while (mid <= hi) {
    if (nums[mid] === 0) {
      [nums[lo], nums[mid]] = [nums[mid], nums[lo]];
      lo++; mid++;
    } else if (nums[mid] === 2) {
      [nums[mid], nums[hi]] = [nums[hi], nums[mid]];
      hi--;
    } else {
      mid++;
    }
  }
  return nums;
}`,
    solutionExplanation:
      "Three pointers: lo tracks where next 0 should go, hi tracks where next 2 should go, mid scans through. Swap 0s to lo, 2s to hi. When mid > hi, done.",
  },

  // === REAL-WORLD ===
  {
    id: "sort-06",
    chapterId: 4,
    title: "Sort a Task Queue by Priority & Timestamp",
    difficulty: "real-world",
    description:
      "Given an array of tasks with { name, priority, timestamp }, sort them by priority (higher first). For equal priorities, earlier timestamp comes first. This is how job queues and task schedulers work.",
    examples: [
      {
        input: `[{name:"email",priority:2,timestamp:100},{name:"alert",priority:5,timestamp:200},{name:"log",priority:2,timestamp:50}]`,
        output: `[{name:"alert",priority:5,timestamp:200},{name:"log",priority:2,timestamp:50},{name:"email",priority:2,timestamp:100}]`,
      },
    ],
    constraints: ["Stable sort preferred", "Higher priority = more urgent"],
    starterCode: `function sortTasks(tasks) {
  // Sort by priority desc, then timestamp asc
  // Return sorted array (can be new or in-place)
}

// Tests
const tasks = [
  { name: "email", priority: 2, timestamp: 100 },
  { name: "alert", priority: 5, timestamp: 200 },
  { name: "log", priority: 2, timestamp: 50 },
];
const sorted = sortTasks(tasks);
console.assert(sorted[0].name === 'alert', 'Test 1');
console.assert(sorted[1].name === 'log', 'Test 2');
console.assert(sorted[2].name === 'email', 'Test 3');
console.log('All tests passed!');`,
    testCases: `const t=[{name:"email",priority:2,timestamp:100},{name:"alert",priority:5,timestamp:200},{name:"log",priority:2,timestamp:50}];
const s=sortTasks(t); console.assert(s[0].name==='alert'&&s[1].name==='log','T1');`,
    tags: ["sorting", "comparator"],
    order: 6,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: custom comparators — return negative, zero, or positive. Chain comparisons: if primary key is equal, fall through to secondary key.",
    solution: `function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return a.timestamp - b.timestamp;
  });
}`,
    solutionExplanation:
      "Use Array.sort with a custom comparator. First compare by priority descending (b - a). If equal, compare by timestamp ascending (a - b). JS sort is stable in modern engines.",
  },
];
