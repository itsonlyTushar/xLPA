import { Problem } from "../../types";

export const bitManipulationProblems: Problem[] = [
  // === WARMUP ===
  {
    id: "bit-01",
    chapterId: 18,
    title: "Single Number (XOR trick)",
    difficulty: "warmup",
    description:
      "Given an array where every element appears twice except one, find the single element. Use XOR — no extra space. This is the most elegant bit manipulation trick.",
    examples: [
      { input: "[2, 2, 1]", output: "1" },
      { input: "[4, 1, 2, 1, 2]", output: "4" },
    ],
    constraints: ["1 <= arr.length <= 3 * 10^4", "Each element appears exactly twice except one"],
    starterCode: `function singleNumber(nums) {
  // Your code here — no extra space
}

// Tests
console.assert(singleNumber([2, 2, 1]) === 1, 'Test 1');
console.assert(singleNumber([4, 1, 2, 1, 2]) === 4, 'Test 2');
console.assert(singleNumber([1]) === 1, 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(singleNumber([2,2,1])===1,'T1');
console.assert(singleNumber([4,1,2,1,2])===4,'T2');`,
    tags: ["bit-manipulation", "xor"],
    order: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: XOR all elements together — pairs cancel out (a ^ a = 0) and the single element remains (0 ^ a = a).",
    solution: `function singleNumber(nums) {
  let result = 0;
  for (const num of nums) result ^= num;
  return result;
}`,
    solutionExplanation:
      "XOR has two key properties: a ^ a = 0 and a ^ 0 = a. XORing all numbers cancels out pairs, leaving only the single unique number.",
  },

  // === CORE ===
  {
    id: "bit-02",
    chapterId: 18,
    title: "Power of Two",
    difficulty: "core",
    description:
      "Given an integer n, determine if it is a power of two. Use the bit trick: a power of two has exactly one set bit, so n & (n-1) removes it.",
    examples: [
      { input: "16", output: "true", explanation: "16 = 10000 in binary" },
      { input: "6", output: "false", explanation: "6 = 110 in binary" },
    ],
    constraints: ["-2^31 <= n <= 2^31 - 1"],
    starterCode: `function isPowerOfTwo(n) {
  // Your code here
}

// Tests
console.assert(isPowerOfTwo(1) === true, 'Test 1');
console.assert(isPowerOfTwo(16) === true, 'Test 2');
console.assert(isPowerOfTwo(6) === false, 'Test 3');
console.assert(isPowerOfTwo(0) === false, 'Test 4');
console.assert(isPowerOfTwo(-16) === false, 'Test 5');
console.log('All tests passed!');`,
    testCases: `console.assert(isPowerOfTwo(1)===true,'T1');
console.assert(isPowerOfTwo(16)===true,'T2');
console.assert(isPowerOfTwo(6)===false,'T3');
console.assert(isPowerOfTwo(0)===false,'T4');`,
    tags: ["bit-manipulation"],
    order: 2,
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: n & (n-1) clears the lowest set bit. If the result is 0, there was only one set bit — it's a power of two.",
    solution: `function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}`,
    solutionExplanation:
      "A power of two in binary is 100...0 (single 1 bit). n-1 flips all bits after that, giving 011...1. ANDing them gives 0. Also check n > 0 to exclude 0 and negatives.",
  },
  {
    id: "bit-03",
    chapterId: 18,
    title: "Count Set Bits (Hamming Weight)",
    difficulty: "core",
    description:
      "Given a positive integer, count the number of 1-bits in its binary representation (also known as the Hamming weight or popcount).",
    examples: [
      { input: "11 (binary: 1011)", output: "3" },
      { input: "128 (binary: 10000000)", output: "1" },
    ],
    constraints: ["0 <= n <= 2^31 - 1"],
    starterCode: `function hammingWeight(n) {
  // Your code here
}

// Tests
console.assert(hammingWeight(11) === 3, 'Test 1');
console.assert(hammingWeight(128) === 1, 'Test 2');
console.assert(hammingWeight(0) === 0, 'Test 3');
console.assert(hammingWeight(255) === 8, 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(hammingWeight(11)===3,'T1');
console.assert(hammingWeight(128)===1,'T2');
console.assert(hammingWeight(255)===8,'T3');`,
    tags: ["bit-manipulation"],
    order: 3,
    timeComplexity: "O(number of set bits)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: n & (n-1) removes the lowest set bit each time — count how many times you can do this before reaching 0.",
    solution: `function hammingWeight(n) {
  let count = 0;
  while (n !== 0) {
    n = n & (n - 1);
    count++;
  }
  return count;
}`,
    solutionExplanation:
      "The Brian Kernighan trick: n & (n-1) removes the lowest set bit. Repeat until n becomes 0, counting each removal. This runs in O(k) where k is the number of 1-bits.",
  },
  {
    id: "bit-04",
    chapterId: 18,
    title: "Reverse Bits",
    difficulty: "core",
    description:
      "Reverse the bits of a 32-bit unsigned integer. For example, the 32-bit binary representation of 43261596 reversed gives 964176192.",
    examples: [
      { input: "43261596", output: "964176192", explanation: "00000010100101000001111010011100 → 00111001011110000010100101000000" },
    ],
    constraints: ["Input is a 32-bit unsigned integer"],
    starterCode: `function reverseBits(n) {
  // Your code here
}

// Tests
console.assert(reverseBits(43261596) === 964176192, 'Test 1');
console.assert(reverseBits(0) === 0, 'Test 2');
console.log('All tests passed!');`,
    testCases: `console.assert(reverseBits(43261596)===964176192,'T1');
console.assert(reverseBits(0)===0,'T2');`,
    tags: ["bit-manipulation"],
    order: 4,
    timeComplexity: "O(1) — fixed 32 iterations",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: extract the last bit with & 1, shift result left and OR to append, shift input right — repeat 32 times.",
    solution: `function reverseBits(n) {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (n & 1);
    n >>>= 1;
  }
  return result >>> 0; // convert to unsigned
}`,
    solutionExplanation:
      "Extract the last bit of n (n & 1), append it to result (shift result left, OR with the bit), then shift n right. After 32 iterations, result holds the reversed bits. Use >>> 0 for unsigned conversion.",
  },

  // === CHALLENGE ===
  {
    id: "bit-05",
    chapterId: 18,
    title: "Missing Number",
    difficulty: "challenge",
    description:
      "Given an array containing n distinct numbers from 0 to n, find the one missing number. Use XOR to solve in O(1) space — XOR all indices and values, duplicates cancel.",
    examples: [
      { input: "[3, 0, 1]", output: "2" },
      { input: "[9,6,4,2,3,5,7,0,1]", output: "8" },
    ],
    constraints: ["n = arr.length", "All numbers in [0, n] appear exactly once except the missing one"],
    starterCode: `function missingNumber(nums) {
  // Your code here — O(1) space
}

// Tests
console.assert(missingNumber([3, 0, 1]) === 2, 'Test 1');
console.assert(missingNumber([0, 1]) === 2, 'Test 2');
console.assert(missingNumber([9,6,4,2,3,5,7,0,1]) === 8, 'Test 3');
console.assert(missingNumber([0]) === 1, 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(missingNumber([3,0,1])===2,'T1');
console.assert(missingNumber([9,6,4,2,3,5,7,0,1])===8,'T2');`,
    tags: ["bit-manipulation", "xor"],
    order: 5,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: XOR indices 0..n with all array values — every present number cancels with its index, leaving only the missing number.",
    solution: `function missingNumber(nums) {
  let xor = nums.length;
  for (let i = 0; i < nums.length; i++) {
    xor ^= i ^ nums[i];
  }
  return xor;
}`,
    solutionExplanation:
      "Start with n (since indices only go to n-1). XOR with each index and each value. Present numbers appear as both an index and a value, canceling out. The missing number has no pair and remains.",
  },

  // === REAL-WORLD ===
  {
    id: "bit-06",
    chapterId: 18,
    title: "Feature Flags with Bitmask",
    difficulty: "real-world",
    description:
      "Implement a feature flag system using bitwise operations. Each feature is a power-of-2 flag. Support enabling, disabling, toggling, and checking features — exactly how Unix file permissions work.",
    examples: [
      { input: "enable(READ | WRITE), has(READ), disable(WRITE), has(WRITE)", output: "true, false" },
    ],
    constraints: ["Up to 32 features (one per bit)"],
    starterCode: `const READ = 1;    // 001
const WRITE = 2;   // 010
const EXECUTE = 4; // 100

class FeatureFlags {
  constructor() {
    this.flags = 0;
  }
  enable(feature) { /* Turn on feature */ }
  disable(feature) { /* Turn off feature */ }
  toggle(feature) { /* Flip feature */ }
  has(feature) { /* Check if feature is on */ }
}

// Tests
const ff = new FeatureFlags();
ff.enable(READ);
ff.enable(WRITE);
console.assert(ff.has(READ) === true, 'Test 1');
console.assert(ff.has(EXECUTE) === false, 'Test 2');
ff.disable(WRITE);
console.assert(ff.has(WRITE) === false, 'Test 3');
ff.toggle(EXECUTE);
console.assert(ff.has(EXECUTE) === true, 'Test 4');
ff.toggle(EXECUTE);
console.assert(ff.has(EXECUTE) === false, 'Test 5');
console.log('All tests passed!');`,
    testCases: `const ff=new FeatureFlags();ff.enable(READ);ff.enable(WRITE);
console.assert(ff.has(READ)===true,'T1');ff.disable(WRITE);console.assert(ff.has(WRITE)===false,'T2');`,
    tags: ["bit-manipulation", "bitmask"],
    order: 6,
    timeComplexity: "O(1) per operation",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: OR to enable, AND with NOT to disable, XOR to toggle, AND to check — bitmasks are the most compact way to store boolean flags.",
    solution: `class FeatureFlags {
  constructor() { this.flags = 0; }
  enable(feature) { this.flags |= feature; }
  disable(feature) { this.flags &= ~feature; }
  toggle(feature) { this.flags ^= feature; }
  has(feature) { return (this.flags & feature) !== 0; }
}`,
    solutionExplanation:
      "Enable: OR sets the bit. Disable: AND with NOT clears it. Toggle: XOR flips it. Has: AND checks if it's set. Each operation is O(1) and uses no extra memory.",
  },
];
