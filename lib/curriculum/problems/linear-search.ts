import { Problem } from "../../types";

export const linearSearchProblems: Problem[] = [
  // === WARMUP ===
  {
    id: "ls-01",
    chapterId: 2,
    title: "Find Element Index",
    difficulty: "warmup",
    description:
      "Given an array and a target value, return the index of the target. If not found, return -1. This is Array.prototype.indexOf() from scratch.",
    examples: [
      { input: "[10, 20, 30, 40], target=30", output: "2" },
      { input: "[1, 2, 3], target=5", output: "-1" },
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: `function linearSearch(arr, target) {
  // Your code here
}

// Tests
console.assert(linearSearch([10, 20, 30, 40], 30) === 2, 'Test 1');
console.assert(linearSearch([1, 2, 3], 5) === -1, 'Test 2');
console.assert(linearSearch([], 1) === -1, 'Test 3');
console.assert(linearSearch([5], 5) === 0, 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(linearSearch([10,20,30,40],30)===2,'T1');
console.assert(linearSearch([1,2,3],5)===-1,'T2');
console.assert(linearSearch([],1)===-1,'T3');`,
    tags: ["linear-search"],
    order: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: iterate from start to end, compare each element — the simplest search is one full scan.",
    solution: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
    solutionExplanation:
      "Walk through every index. When a match is found, return immediately (early exit). If the loop completes without a match, return -1.",
  },
  {
    id: "ls-02",
    chapterId: 2,
    title: "Count Occurrences",
    difficulty: "warmup",
    description:
      "Given an array and a target, count how many times the target appears. No early exit here — you must scan everything.",
    examples: [
      { input: "[1, 2, 3, 2, 2, 5], target=2", output: "3" },
      { input: "[1, 1, 1], target=0", output: "0" },
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: `function countOccurrences(arr, target) {
  // Your code here
}

// Tests
console.assert(countOccurrences([1,2,3,2,2,5], 2) === 3, 'Test 1');
console.assert(countOccurrences([1,1,1], 0) === 0, 'Test 2');
console.assert(countOccurrences([], 1) === 0, 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(countOccurrences([1,2,3,2,2,5],2)===3,'T1');
console.assert(countOccurrences([1,1,1],0)===0,'T2');`,
    tags: ["linear-search", "counting"],
    order: 2,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: when you need a count, you must scan the entire array — no early exit possible.",
    solution: `function countOccurrences(arr, target) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) count++;
  }
  return count;
}`,
    solutionExplanation:
      "Full scan with a counter. Unlike indexOf, we can't stop early because there might be more matches ahead.",
  },

  // === CORE ===
  {
    id: "ls-03",
    chapterId: 2,
    title: "Find Min and Max in One Pass",
    difficulty: "core",
    description:
      "Find both the minimum and maximum values in an array using a single pass. Return them as [min, max]. Don't use Math.min/Math.max with spread.",
    examples: [
      { input: "[3, 1, 4, 1, 5, 9]", output: "[1, 9]" },
      { input: "[42]", output: "[42, 42]" },
    ],
    constraints: ["arr.length >= 1"],
    starterCode: `function findMinMax(arr) {
  // Your code here — single pass, return [min, max]
}

// Tests
console.assert(JSON.stringify(findMinMax([3,1,4,1,5,9])) === '[1,9]', 'Test 1');
console.assert(JSON.stringify(findMinMax([42])) === '[42,42]', 'Test 2');
console.assert(JSON.stringify(findMinMax([-5,0,5])) === '[-5,5]', 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(findMinMax([3,1,4,1,5,9]))==='[1,9]','T1');
console.assert(JSON.stringify(findMinMax([42]))==='[42,42]','T2');`,
    tags: ["linear-search", "min-max"],
    order: 3,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: track both min and max as you scan — finding extremes is just linear search with two targets.",
    solution: `function findMinMax(arr) {
  let min = arr[0], max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }
  return [min, max];
}`,
    solutionExplanation:
      "Initialize min and max to the first element. Scan the rest, updating min or max when a smaller or larger value is found. One pass, O(1) extra space.",
  },
  {
    id: "ls-04",
    chapterId: 2,
    title: "Find Object by Property",
    difficulty: "core",
    description:
      "Given an array of objects and a property name + value, return the first object that matches. This is exactly what Array.find() does under the hood.",
    examples: [
      { input: '[{id:1,name:"a"},{id:2,name:"b"}], key="id", value=2', output: '{id:2,name:"b"}' },
    ],
    constraints: ["0 <= arr.length <= 10^4"],
    starterCode: `function findByProperty(arr, key, value) {
  // Your code here — return the object or undefined
}

// Tests
const users = [{id:1,name:"Alice"},{id:2,name:"Bob"},{id:3,name:"Charlie"}];
console.assert(findByProperty(users, "id", 2).name === "Bob", 'Test 1');
console.assert(findByProperty(users, "name", "Charlie").id === 3, 'Test 2');
console.assert(findByProperty(users, "id", 99) === undefined, 'Test 3');
console.log('All tests passed!');`,
    testCases: `const u=[{id:1,name:"Alice"},{id:2,name:"Bob"}];
console.assert(findByProperty(u,"id",2).name==="Bob",'T1');
console.assert(findByProperty(u,"id",99)===undefined,'T2');`,
    tags: ["linear-search", "objects"],
    order: 4,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: searching objects by property is still linear search — the comparison step is just obj[key] === value.",
    solution: `function findByProperty(arr, key, value) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === value) return arr[i];
  }
  return undefined;
}`,
    solutionExplanation:
      "Iterate through the array, checking if each object's property matches. Return the first match. This is what you do every time you call .find() on an array of API responses.",
  },
  {
    id: "ls-05",
    chapterId: 2,
    title: "Search in a 2D Matrix (Linear)",
    difficulty: "core",
    description:
      "Given a 2D matrix of integers, determine if a target value exists in it. Treat it as a flattened array and do a linear search. Later you'll learn a faster way.",
    examples: [
      { input: "[[1,3,5],[7,9,11],[13,15,17]], target=9", output: "true" },
      { input: "[[1,2],[3,4]], target=5", output: "false" },
    ],
    constraints: ["1 <= rows, cols <= 100"],
    starterCode: `function searchMatrix(matrix, target) {
  // Your code here
}

// Tests
console.assert(searchMatrix([[1,3,5],[7,9,11],[13,15,17]], 9) === true, 'Test 1');
console.assert(searchMatrix([[1,2],[3,4]], 5) === false, 'Test 2');
console.assert(searchMatrix([[1]], 1) === true, 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(searchMatrix([[1,3,5],[7,9,11],[13,15,17]],9)===true,'T1');
console.assert(searchMatrix([[1,2],[3,4]],5)===false,'T2');`,
    tags: ["linear-search", "matrix"],
    order: 5,
    timeComplexity: "O(m * n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: a 2D matrix is just a nested loop — row by row, element by element. This is the brute force baseline.",
    solution: `function searchMatrix(matrix, target) {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] === target) return true;
    }
  }
  return false;
}`,
    solutionExplanation:
      "Nested loops: outer for rows, inner for columns. Check each element. Linear search on a 2D structure is straightforward but O(m×n).",
  },

  // === REAL-WORLD ===
  {
    id: "ls-06",
    chapterId: 2,
    title: "Fuzzy Search (Case-Insensitive Contains)",
    difficulty: "real-world",
    description:
      "Given an array of strings and a search query, return all strings that contain the query (case-insensitive). This is what your search bar filter does.",
    examples: [
      { input: '["Apple","Banana","Grape","Pineapple"], query="app"', output: '["Apple","Pineapple"]' },
    ],
    constraints: ["0 <= arr.length <= 10^4"],
    starterCode: `function fuzzySearch(items, query) {
  // Your code here
}

// Tests
const items = ["Apple","Banana","Grape","Pineapple","APPLE PIE"];
console.assert(JSON.stringify(fuzzySearch(items, "app")) === '["Apple","Pineapple","APPLE PIE"]', 'Test 1');
console.assert(fuzzySearch(items, "xyz").length === 0, 'Test 2');
console.assert(fuzzySearch(items, "").length === 5, 'Test 3');
console.log('All tests passed!');`,
    testCases: `const it=["Apple","Banana","Grape","Pineapple","APPLE PIE"];
console.assert(JSON.stringify(fuzzySearch(it,"app"))==='["Apple","Pineapple","APPLE PIE"]','T1');`,
    tags: ["linear-search", "string"],
    order: 6,
    timeComplexity: "O(n * m) where m = avg string length",
    spaceComplexity: "O(k) where k = number of matches",
    patternSentence:
      "The pattern to remember: search + filter is linear search with a predicate — the predicate here is case-insensitive substring matching.",
    solution: `function fuzzySearch(items, query) {
  const lowerQuery = query.toLowerCase();
  const results = [];
  for (const item of items) {
    if (item.toLowerCase().includes(lowerQuery)) {
      results.push(item);
    }
  }
  return results;
}`,
    solutionExplanation:
      "Lowercase the query once. For each item, lowercase and check if it includes the query. Collect matches. This is the filter pattern you use in search UIs.",
  },
];
