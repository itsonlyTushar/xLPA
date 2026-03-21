import { Problem } from "../../types";

export const stringProblems: Problem[] = [
  // === WARMUP ===
  {
    id: "str-01",
    chapterId: 8,
    title: "Reverse a String",
    difficulty: "warmup",
    description:
      "Given a string, return it reversed. Do not use the built-in .reverse() method — iterate manually. This is your first string traversal.",
    examples: [
      { input: '"hello"', output: '"olleh"' },
      { input: '"ab"', output: '"ba"' },
      { input: '""', output: '""' },
    ],
    constraints: ["0 <= s.length <= 10^5"],
    starterCode: `function reverseString(s) {
  // Your code here
}

// Tests
console.assert(reverseString("hello") === "olleh", 'Test 1');
console.assert(reverseString("ab") === "ba", 'Test 2');
console.assert(reverseString("") === "", 'Test 3');
console.assert(reverseString("a") === "a", 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(reverseString("hello")==="olleh",'T1');
console.assert(reverseString("ab")==="ba",'T2');
console.assert(reverseString("")==="","T3');
console.assert(reverseString("a")==="a","T4');`,
    tags: ["traversal"],
    order: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: build strings from the end to the start — string reversal is the simplest string traversal.",
    solution: `function reverseString(s) {
  let result = "";
  for (let i = s.length - 1; i >= 0; i--) {
    result += s[i];
  }
  return result;
}`,
    solutionExplanation:
      "Iterate from the last character to the first, appending each character to a new string. Time O(n), Space O(n) for the new string.",
  },
  {
    id: "str-02",
    chapterId: 8,
    title: "Character Frequency Count",
    difficulty: "warmup",
    description:
      "Given a string, return an object (or Map) where keys are characters and values are their frequency. This is the foundation for anagram and pattern-matching problems.",
    examples: [
      { input: '"aabbc"', output: '{ a: 2, b: 2, c: 1 }' },
      { input: '""', output: "{}" },
    ],
    constraints: ["0 <= s.length <= 10^5", "String contains only lowercase English letters"],
    starterCode: `function charFrequency(s) {
  // Your code here — return a plain object
}

// Tests
const f1 = charFrequency("aabbc");
console.assert(f1.a === 2 && f1.b === 2 && f1.c === 1, 'Test 1');
const f2 = charFrequency("");
console.assert(Object.keys(f2).length === 0, 'Test 2');
const f3 = charFrequency("aaaa");
console.assert(f3.a === 4, 'Test 3');
console.log('All tests passed!');`,
    testCases: `const r1=charFrequency("aabbc");console.assert(r1.a===2&&r1.b===2&&r1.c===1,'T1');
const r2=charFrequency("");console.assert(Object.keys(r2).length===0,'T2');
const r3=charFrequency("aaaa");console.assert(r3.a===4,'T3');`,
    tags: ["frequency-count"],
    order: 2,
    timeComplexity: "O(n)",
    spaceComplexity: "O(k) where k = unique characters",
    patternSentence:
      "The pattern to remember: a frequency map is the go-to first step for any problem about character counts, anagrams, or duplicates.",
    solution: `function charFrequency(s) {
  const freq = {};
  for (const ch of s) {
    freq[ch] = (freq[ch] || 0) + 1;
  }
  return freq;
}`,
    solutionExplanation:
      "Iterate through each character, incrementing its count in the frequency object. O(n) time, O(k) space where k is the number of unique characters.",
  },

  // === CORE ===
  {
    id: "str-03",
    chapterId: 8,
    title: "Valid Palindrome",
    difficulty: "core",
    description:
      "Given a string, determine if it's a palindrome, considering only alphanumeric characters and ignoring case. Use two pointers from both ends.",
    examples: [
      { input: '"A man, a plan, a canal: Panama"', output: "true" },
      { input: '"race a car"', output: "false" },
      { input: '""', output: "true" },
    ],
    constraints: ["0 <= s.length <= 2 * 10^5", "String may contain non-alphanumeric characters"],
    starterCode: `function isPalindrome(s) {
  // Your code here
}

// Tests
console.assert(isPalindrome("A man, a plan, a canal: Panama") === true, 'Test 1');
console.assert(isPalindrome("race a car") === false, 'Test 2');
console.assert(isPalindrome("") === true, 'Test 3');
console.assert(isPalindrome("a") === true, 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(isPalindrome("A man, a plan, a canal: Panama")===true,'T1');
console.assert(isPalindrome("race a car")===false,'T2');
console.assert(isPalindrome("")===true,'T3');`,
    tags: ["two-pointer", "palindrome"],
    order: 3,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: two pointers from both ends, skipping non-alphanumeric characters — the standard palindrome check.",
    solution: `function isPalindrome(s) {
  let left = 0, right = s.length - 1;
  while (left < right) {
    while (left < right && !isAlphaNum(s[left])) left++;
    while (left < right && !isAlphaNum(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}

function isAlphaNum(c) {
  const code = c.charCodeAt(0);
  return (code >= 48 && code <= 57) || (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}`,
    solutionExplanation:
      "Use two pointers converging from both ends. Skip non-alphanumeric characters, compare lowercase versions. If any mismatch, not a palindrome.",
  },
  {
    id: "str-04",
    chapterId: 8,
    title: "Valid Anagram",
    difficulty: "core",
    description:
      "Given two strings s and t, return true if t is an anagram of s. An anagram uses the exact same characters the exact same number of times.",
    examples: [
      { input: 's="anagram", t="nagaram"', output: "true" },
      { input: 's="rat", t="car"', output: "false" },
    ],
    constraints: ["1 <= s.length, t.length <= 5 * 10^4", "Lowercase English letters only"],
    starterCode: `function isAnagram(s, t) {
  // Your code here
}

// Tests
console.assert(isAnagram("anagram", "nagaram") === true, 'Test 1');
console.assert(isAnagram("rat", "car") === false, 'Test 2');
console.assert(isAnagram("a", "a") === true, 'Test 3');
console.assert(isAnagram("ab", "a") === false, 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(isAnagram("anagram","nagaram")===true,'T1');
console.assert(isAnagram("rat","car")===false,'T2');
console.assert(isAnagram("ab","a")===false,'T3');`,
    tags: ["frequency-count", "anagram"],
    order: 4,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) — fixed 26-letter alphabet",
    patternSentence:
      "The pattern to remember: two strings are anagrams iff they have identical character frequency maps.",
    solution: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  for (const c of t) {
    if (!count[c]) return false;
    count[c]--;
  }
  return true;
}`,
    solutionExplanation:
      "Count character frequencies for s, then decrement for each character in t. If any count goes below zero or is missing, they're not anagrams.",
  },
  {
    id: "str-05",
    chapterId: 8,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "core",
    description:
      "Given a string, find the length of the longest substring without repeating characters. This is the classic sliding window on strings problem.",
    examples: [
      { input: '"abcabcbb"', output: "3", explanation: '"abc" has length 3' },
      { input: '"bbbbb"', output: "1" },
      { input: '"pwwkew"', output: "3", explanation: '"wke" has length 3' },
    ],
    constraints: ["0 <= s.length <= 5 * 10^4"],
    starterCode: `function lengthOfLongestSubstring(s) {
  // Your code here
}

// Tests
console.assert(lengthOfLongestSubstring("abcabcbb") === 3, 'Test 1');
console.assert(lengthOfLongestSubstring("bbbbb") === 1, 'Test 2');
console.assert(lengthOfLongestSubstring("pwwkew") === 3, 'Test 3');
console.assert(lengthOfLongestSubstring("") === 0, 'Test 4');
console.assert(lengthOfLongestSubstring("au") === 2, 'Test 5');
console.log('All tests passed!');`,
    testCases: `console.assert(lengthOfLongestSubstring("abcabcbb")===3,'T1');
console.assert(lengthOfLongestSubstring("bbbbb")===1,'T2');
console.assert(lengthOfLongestSubstring("pwwkew")===3,'T3');
console.assert(lengthOfLongestSubstring("")===0,'T4');`,
    tags: ["sliding-window", "hashmap"],
    order: 5,
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(n, alphabet))",
    patternSentence:
      "The pattern to remember: expand the window right, and when a duplicate enters, shrink from the left until it's gone — the variable-width sliding window.",
    solution: `function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let maxLen = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    if (seen.has(s[right]) && seen.get(s[right]) >= left) {
      left = seen.get(s[right]) + 1;
    }
    seen.set(s[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    solutionExplanation:
      "Use a Map to track the last index of each character. When a repeat is found inside the window, jump left past the previous occurrence. Track the maximum window size.",
  },

  // === CHALLENGE ===
  {
    id: "str-06",
    chapterId: 8,
    title: "Longest Palindromic Substring",
    difficulty: "challenge",
    description:
      "Given a string, return the longest palindromic substring. Use the expand-around-center technique — check both odd and even length palindromes at each center.",
    examples: [
      { input: '"babad"', output: '"bab" or "aba"' },
      { input: '"cbbd"', output: '"bb"' },
    ],
    constraints: ["1 <= s.length <= 1000"],
    starterCode: `function longestPalindrome(s) {
  // Your code here
}

// Tests
const r1 = longestPalindrome("babad");
console.assert(r1 === "bab" || r1 === "aba", 'Test 1');
console.assert(longestPalindrome("cbbd") === "bb", 'Test 2');
console.assert(longestPalindrome("a") === "a", 'Test 3');
console.assert(longestPalindrome("ac") === "a" || longestPalindrome("ac") === "c", 'Test 4');
console.log('All tests passed!');`,
    testCases: `const r1=longestPalindrome("babad");console.assert(r1==="bab"||r1==="aba",'T1');
console.assert(longestPalindrome("cbbd")==="bb",'T2');
console.assert(longestPalindrome("a")==="a",'T3');`,
    tags: ["two-pointer", "palindrome", "expand-around-center"],
    order: 6,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: expand from every possible center (2n-1 centers for odd and even lengths) — O(n²) but elegant and no extra space.",
    solution: `function longestPalindrome(s) {
  let start = 0, maxLen = 1;
  function expand(l, r) {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
    if (r - l - 1 > maxLen) { start = l + 1; maxLen = r - l - 1; }
  }
  for (let i = 0; i < s.length; i++) {
    expand(i, i);     // odd length
    expand(i, i + 1); // even length
  }
  return s.slice(start, start + maxLen);
}`,
    solutionExplanation:
      "For each index, expand outward from both odd and even centers. Track the longest palindrome found. O(n²) time, O(1) space.",
  },
  {
    id: "str-07",
    chapterId: 8,
    title: "Group Anagrams",
    difficulty: "challenge",
    description:
      "Given an array of strings, group the anagrams together. Two strings are anagrams if they contain the same characters with the same frequencies.",
    examples: [
      {
        input: '["eat","tea","tan","ate","nat","bat"]',
        output: '[["eat","tea","ate"],["tan","nat"],["bat"]]',
      },
    ],
    constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100"],
    starterCode: `function groupAnagrams(strs) {
  // Your code here
}

// Tests
const result = groupAnagrams(["eat","tea","tan","ate","nat","bat"]);
console.assert(result.length === 3, 'Test 1: three groups');
const sorted = result.map(g => g.sort().join(",")).sort();
console.assert(sorted.includes("ate,eat,tea"), 'Test 2: eat group');
console.assert(sorted.includes("nat,tan"), 'Test 3: tan group');
console.log('All tests passed!');`,
    testCases: `const r=groupAnagrams(["eat","tea","tan","ate","nat","bat"]);
console.assert(r.length===3,'T1');`,
    tags: ["hashmap", "anagram", "frequency-count"],
    order: 7,
    timeComplexity: "O(n * k log k) or O(n * k)",
    spaceComplexity: "O(n * k)",
    patternSentence:
      "The pattern to remember: use sorted characters (or a frequency key) as a hashmap key to group strings that are anagrams.",
    solution: `function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split("").sort().join("");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return Array.from(map.values());
}`,
    solutionExplanation:
      "Sort each string's characters to create a canonical key. Group strings with the same key in a Map. Return all groups.",
  },

  // === REAL-WORLD ===
  {
    id: "str-08",
    chapterId: 8,
    title: "URL Slug Generator",
    difficulty: "real-world",
    description:
      "Convert a blog post title into a URL-safe slug. Lowercase all characters, replace spaces with hyphens, remove non-alphanumeric characters (except hyphens), and collapse multiple hyphens into one.",
    examples: [
      { input: '"Hello World!"', output: '"hello-world"' },
      { input: '"  Multiple   Spaces  "', output: '"multiple-spaces"' },
      { input: '"React & Next.js: A Guide"', output: '"react-nextjs-a-guide"' },
    ],
    constraints: ["1 <= title.length <= 200", "ASCII characters only"],
    starterCode: `function slugify(title) {
  // Your code here
}

// Tests
console.assert(slugify("Hello World!") === "hello-world", 'Test 1');
console.assert(slugify("  Multiple   Spaces  ") === "multiple-spaces", 'Test 2');
console.assert(slugify("React & Next.js: A Guide") === "react-nextjs-a-guide", 'Test 3');
console.assert(slugify("UPPERCASE") === "uppercase", 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(slugify("Hello World!")==="hello-world",'T1');
console.assert(slugify("  Multiple   Spaces  ")==="multiple-spaces",'T2');
console.assert(slugify("UPPERCASE")==="uppercase",'T3');`,
    tags: ["string-manipulation"],
    order: 8,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: string normalization is a pipeline — lowercase, filter, replace, collapse — each step is O(n).",
    solution: `function slugify(title) {
  let slug = "";
  for (const ch of title.toLowerCase()) {
    if ((ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9')) {
      slug += ch;
    } else if (ch === ' ' || ch === '-') {
      if (slug.length > 0 && slug[slug.length - 1] !== '-') slug += '-';
    }
  }
  if (slug.endsWith('-')) slug = slug.slice(0, -1);
  return slug;
}`,
    solutionExplanation:
      "Walk through each character, keep alphanumeric ones, replace spaces/hyphens with a single hyphen (avoiding doubles), and trim trailing hyphens.",
  },
];
