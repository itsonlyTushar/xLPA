import { Problem } from "../../types";

export const hashMapProblems: Problem[] = [
  // === WARMUP ===
  {
    id: "hm-01",
    chapterId: 5,
    title: "Two Sum",
    difficulty: "warmup",
    description:
      "Given an array of integers and a target, return the indices of two numbers that add up to the target. Use a hash map for O(n) lookup. The classic interview opener.",
    examples: [
      { input: "[2, 7, 11, 15], target=9", output: "[0, 1]" },
      { input: "[3, 2, 4], target=6", output: "[1, 2]" },
    ],
    constraints: ["Exactly one solution exists", "Can't use the same element twice"],
    starterCode: `function twoSum(nums, target) {
  // Your code here — return [index1, index2]
}

// Tests
console.assert(JSON.stringify(twoSum([2,7,11,15], 9)) === JSON.stringify([0,1]), 'Test 1');
console.assert(JSON.stringify(twoSum([3,2,4], 6)) === JSON.stringify([1,2]), 'Test 2');
console.assert(JSON.stringify(twoSum([3,3], 6)) === JSON.stringify([0,1]), 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(twoSum([2,7,11,15],9))===JSON.stringify([0,1]),'T1');
console.assert(JSON.stringify(twoSum([3,2,4],6))===JSON.stringify([1,2]),'T2');`,
    tags: ["hashmap", "two-sum"],
    order: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: for each element, check if (target - element) is already in the map. If yes, you found the pair. If not, store element → index.",
    solution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}`,
    solutionExplanation:
      "One-pass hash map: for each number, compute complement = target - num. If complement exists in map, return both indices. Otherwise, store num → index. O(n) time and space.",
  },
  {
    id: "hm-02",
    chapterId: 5,
    title: "Frequency Counter",
    difficulty: "warmup",
    description:
      "Given a string, return an object with each character and its count. This is the foundational hash map pattern — counting occurrences.",
    examples: [
      { input: '"hello"', output: '{ h: 1, e: 1, l: 2, o: 1 }' },
      { input: '"aab"', output: '{ a: 2, b: 1 }' },
    ],
    constraints: ["Count all characters including spaces", "Case-sensitive"],
    starterCode: `function charFrequency(str) {
  // Your code here — return an object { char: count }
}

// Tests
const r1 = charFrequency('hello');
console.assert(r1['h'] === 1 && r1['l'] === 2 && r1['o'] === 1, 'Test 1');
const r2 = charFrequency('aab');
console.assert(r2['a'] === 2 && r2['b'] === 1, 'Test 2');
console.log('All tests passed!');`,
    testCases: `const r=charFrequency('hello'); console.assert(r['l']===2,'T1');`,
    tags: ["hashmap", "frequency"],
    order: 2,
    timeComplexity: "O(n)",
    spaceComplexity: "O(k) where k = unique chars",
    patternSentence:
      "The pattern to remember: iterate and increment — map[key] = (map[key] || 0) + 1. This is the building block for anagrams, duplicates, and majority element.",
    solution: `function charFrequency(str) {
  const freq = {};
  for (const ch of str) {
    freq[ch] = (freq[ch] || 0) + 1;
  }
  return freq;
}`,
    solutionExplanation:
      "Loop through each character. Use the character as a key and increment its count. Initialize to 0 if not present. O(n) time.",
  },

  // === CORE ===
  {
    id: "hm-03",
    chapterId: 5,
    title: "Group Anagrams",
    difficulty: "core",
    description:
      "Given an array of strings, group anagrams together. Two strings are anagrams if they contain the same characters with the same frequencies. Use sorted string as hash key.",
    examples: [
      {
        input: '["eat","tea","tan","ate","nat","bat"]',
        output: '[["eat","tea","ate"],["tan","nat"],["bat"]]',
      },
    ],
    constraints: ["All lowercase English letters", "Order within groups doesn't matter"],
    starterCode: `function groupAnagrams(strs) {
  // Your code here — return array of arrays
}

// Tests
const groups = groupAnagrams(["eat","tea","tan","ate","nat","bat"]);
console.assert(groups.length === 3, 'Test 1: should have 3 groups');
const sizes = groups.map(g => g.length).sort();
console.assert(JSON.stringify(sizes) === JSON.stringify([1,2,3]), 'Test 2: group sizes');
console.log('All tests passed!');`,
    testCases: `const g=groupAnagrams(["eat","tea","tan","ate","nat","bat"]); console.assert(g.length===3,'T1');`,
    tags: ["hashmap", "anagram"],
    order: 3,
    timeComplexity: "O(n * k log k) where k = max string length",
    spaceComplexity: "O(n * k)",
    patternSentence:
      "The pattern to remember: normalize each item into a canonical key (sorted chars), then group by that key in a hash map. This pattern works for any 'group by equivalence' problem.",
    solution: `function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return [...map.values()];
}`,
    solutionExplanation:
      "Sort each string's characters to create a canonical key. All anagrams produce the same sorted key. Group strings by this key in a Map, then return all groups.",
  },
  {
    id: "hm-04",
    chapterId: 5,
    title: "Longest Consecutive Sequence",
    difficulty: "core",
    description:
      "Given an unsorted array of integers, find the length of the longest sequence of consecutive numbers. Must run in O(n). Use a Set to check membership in O(1).",
    examples: [
      { input: "[100, 4, 200, 1, 3, 2]", output: "4", explanation: "Sequence: 1,2,3,4" },
      { input: "[0,3,7,2,5,8,4,6,0,1]", output: "9" },
    ],
    constraints: ["O(n) time required", "Elements can be negative"],
    starterCode: `function longestConsecutive(nums) {
  // Your code here — return the length
}

// Tests
console.assert(longestConsecutive([100,4,200,1,3,2]) === 4, 'Test 1');
console.assert(longestConsecutive([0,3,7,2,5,8,4,6,0,1]) === 9, 'Test 2');
console.assert(longestConsecutive([]) === 0, 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(longestConsecutive([100,4,200,1,3,2])===4,'T1');`,
    tags: ["hashmap", "set", "sequence"],
    order: 4,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: put everything in a Set. For each number that has no predecessor (num-1 not in set), it's a sequence start — count forward. This avoids re-counting.",
    solution: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let maxLen = 0;
  for (const num of set) {
    if (!set.has(num - 1)) {
      let current = num, length = 1;
      while (set.has(current + 1)) { current++; length++; }
      maxLen = Math.max(maxLen, length);
    }
  }
  return maxLen;
}`,
    solutionExplanation:
      "Build a Set for O(1) lookup. Only start counting from sequence beginnings (numbers whose predecessor isn't in the set). Count consecutive numbers forward. Each number is visited at most twice.",
  },

  // === CHALLENGE ===
  {
    id: "hm-05",
    chapterId: 5,
    title: "Subarray Sum Equals K",
    difficulty: "challenge",
    description:
      "Given an array of integers and k, find the total number of contiguous subarrays whose sum equals k. Use prefix sum + hash map to solve in O(n).",
    examples: [
      { input: "[1,1,1], k=2", output: "2" },
      { input: "[1,2,3], k=3", output: "2", explanation: "[1,2] and [3]" },
    ],
    constraints: ["Array can have negative numbers", "O(n) expected"],
    starterCode: `function subarraySum(nums, k) {
  // Your code here — return count
}

// Tests
console.assert(subarraySum([1,1,1], 2) === 2, 'Test 1');
console.assert(subarraySum([1,2,3], 3) === 2, 'Test 2');
console.assert(subarraySum([1,-1,0], 0) === 3, 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(subarraySum([1,1,1],2)===2,'T1');
console.assert(subarraySum([1,2,3],3)===2,'T2');`,
    tags: ["hashmap", "prefix-sum"],
    order: 5,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: prefix sum + hash map. If prefixSum[j] - prefixSum[i] = k, then subarray [i+1..j] sums to k. Store prefix sum frequencies as you go.",
    solution: `function subarraySum(nums, k) {
  const prefixCount = new Map([[0, 1]]);
  let sum = 0, count = 0;
  for (const num of nums) {
    sum += num;
    if (prefixCount.has(sum - k)) {
      count += prefixCount.get(sum - k);
    }
    prefixCount.set(sum, (prefixCount.get(sum) || 0) + 1);
  }
  return count;
}`,
    solutionExplanation:
      "Maintain running prefix sum. For each position, check if (sum - k) was a previous prefix sum — that means the subarray between them sums to k. Count how many times each prefix sum occurs.",
  },

  // === REAL-WORLD ===
  {
    id: "hm-06",
    chapterId: 5,
    title: "LRU Cache",
    difficulty: "real-world",
    description:
      "Design a Least Recently Used (LRU) cache with get and put operations, both O(1). When the cache is full, evict the least recently used item. This is used everywhere — browser caches, CDNs, database query caches.",
    examples: [
      {
        input: "capacity=2; put(1,'a'); put(2,'b'); get(1); put(3,'c'); get(2)",
        output: "'a', undefined (2 was evicted)",
      },
    ],
    constraints: ["O(1) for both get and put", "Capacity ≥ 1"],
    starterCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    // Initialize your data structures
  }

  get(key) {
    // Return value or undefined
  }

  put(key, value) {
    // Insert or update, evict if over capacity
  }
}

// Tests
const cache = new LRUCache(2);
cache.put(1, 'a');
cache.put(2, 'b');
console.assert(cache.get(1) === 'a', 'Test 1');
cache.put(3, 'c'); // evicts key 2
console.assert(cache.get(2) === undefined, 'Test 2');
cache.put(4, 'd'); // evicts key 1
console.assert(cache.get(1) === undefined, 'Test 3');
console.assert(cache.get(3) === 'c', 'Test 4');
console.log('All tests passed!');`,
    testCases: `const c=new LRUCache(2); c.put(1,'a'); c.put(2,'b'); console.assert(c.get(1)==='a','T1');
c.put(3,'c'); console.assert(c.get(2)===undefined,'T2');`,
    tags: ["hashmap", "design", "cache"],
    order: 6,
    timeComplexity: "O(1) per operation",
    spaceComplexity: "O(capacity)",
    patternSentence:
      "The pattern to remember: Map preserves insertion order in JS. On access, delete and re-insert to move to end. On eviction, delete the first key (map.keys().next().value).",
    solution: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return undefined;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val); // move to end (most recent)
    return val;
  }

  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
  }
}`,
    solutionExplanation:
      "Use JS Map which maintains insertion order. On get: delete and re-insert to move to end. On put: delete if exists, insert, then evict first entry if over capacity. All O(1).",
  },
];
