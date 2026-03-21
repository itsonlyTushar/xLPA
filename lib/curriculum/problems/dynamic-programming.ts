import { Problem } from "../../types";

export const dpProblems: Problem[] = [
  // === WARMUP ===
  {
    id: "dp-01",
    chapterId: 15,
    title: "Climbing Stairs (Fibonacci)",
    difficulty: "warmup",
    description:
      "You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. How many distinct ways can you reach the top? This is Fibonacci in disguise — your first DP problem.",
    examples: [
      { input: "2", output: "2", explanation: "1+1 or 2" },
      { input: "3", output: "3", explanation: "1+1+1, 1+2, or 2+1" },
    ],
    constraints: ["1 <= n <= 45"],
    starterCode: `function climbStairs(n) {
  // Your code here
}

// Tests
console.assert(climbStairs(2) === 2, 'Test 1');
console.assert(climbStairs(3) === 3, 'Test 2');
console.assert(climbStairs(5) === 8, 'Test 3');
console.assert(climbStairs(1) === 1, 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(climbStairs(2)===2,'T1');
console.assert(climbStairs(3)===3,'T2');
console.assert(climbStairs(5)===8,'T3');`,
    tags: ["dp", "fibonacci"],
    order: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: dp[i] = dp[i-1] + dp[i-2]. When the current state depends on only the previous two states, you only need two variables.",
    solution: `function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1, prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}`,
    solutionExplanation:
      "Ways to reach step i = ways to reach (i-1) + ways to reach (i-2). Use two variables instead of an array for O(1) space. This is the Fibonacci recurrence.",
  },

  // === CORE ===
  {
    id: "dp-02",
    chapterId: 15,
    title: "Coin Change",
    difficulty: "core",
    description:
      "Given coins of different denominations and a total amount, find the minimum number of coins needed to make that amount. Return -1 if it's not possible. Classic unbounded knapsack problem.",
    examples: [
      { input: "coins=[1,5,10], amount=12", output: "3", explanation: "10+1+1 = 12" },
      { input: "coins=[2], amount=3", output: "-1" },
    ],
    constraints: ["1 <= coins.length <= 12", "0 <= amount <= 10^4"],
    starterCode: `function coinChange(coins, amount) {
  // Your code here
}

// Tests
console.assert(coinChange([1, 5, 10], 12) === 3, 'Test 1');
console.assert(coinChange([2], 3) === -1, 'Test 2');
console.assert(coinChange([1], 0) === 0, 'Test 3');
console.assert(coinChange([1, 2, 5], 11) === 3, 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(coinChange([1,5,10],12)===3,'T1');
console.assert(coinChange([2],3)===-1,'T2');
console.assert(coinChange([1,2,5],11)===3,'T3');`,
    tags: ["dp", "knapsack"],
    order: 2,
    timeComplexity: "O(amount * coins.length)",
    spaceComplexity: "O(amount)",
    patternSentence:
      "The pattern to remember: dp[i] = min coins to make amount i. For each amount, try every coin: dp[i] = min(dp[i], dp[i - coin] + 1).",
    solution: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] !== Infinity) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    solutionExplanation:
      "Build a DP table where dp[i] = minimum coins for amount i. For each amount, try subtracting each coin and take the minimum. If dp[amount] is still Infinity, it's impossible.",
  },
  {
    id: "dp-03",
    chapterId: 15,
    title: "Longest Increasing Subsequence",
    difficulty: "core",
    description:
      "Given an array of integers, find the length of the longest strictly increasing subsequence. A subsequence doesn't have to be contiguous.",
    examples: [
      { input: "[10,9,2,5,3,7,101,18]", output: "4", explanation: "[2,3,7,101]" },
      { input: "[0,1,0,3,2,3]", output: "4" },
    ],
    constraints: ["1 <= nums.length <= 2500"],
    starterCode: `function lengthOfLIS(nums) {
  // Your code here
}

// Tests
console.assert(lengthOfLIS([10,9,2,5,3,7,101,18]) === 4, 'Test 1');
console.assert(lengthOfLIS([0,1,0,3,2,3]) === 4, 'Test 2');
console.assert(lengthOfLIS([7,7,7,7]) === 1, 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(lengthOfLIS([10,9,2,5,3,7,101,18])===4,'T1');
console.assert(lengthOfLIS([0,1,0,3,2,3])===4,'T2');`,
    tags: ["dp", "subsequence"],
    order: 3,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: dp[i] = LIS ending at index i. For each i, check all previous j where nums[j] < nums[i] and take max(dp[j]) + 1.",
    solution: `function lengthOfLIS(nums) {
  const dp = new Array(nums.length).fill(1);
  let maxLen = 1;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLen = Math.max(maxLen, dp[i]);
  }
  return maxLen;
}`,
    solutionExplanation:
      "dp[i] stores the length of the longest increasing subsequence ending at index i. For each element, look back at all earlier elements that are smaller, and extend the best subsequence found.",
  },
  {
    id: "dp-04",
    chapterId: 15,
    title: "0/1 Knapsack",
    difficulty: "core",
    description:
      "Given weights and values of n items, and a knapsack capacity W, find the maximum value you can carry. Each item can be taken at most once. The quintessential DP problem.",
    examples: [
      {
        input: "values=[60,100,120], weights=[10,20,30], W=50",
        output: "220",
        explanation: "Take items with weight 20 and 30",
      },
    ],
    constraints: ["1 <= n <= 100", "1 <= W <= 1000"],
    starterCode: `function knapsack(values, weights, W) {
  // Your code here
}

// Tests
console.assert(knapsack([60,100,120], [10,20,30], 50) === 220, 'Test 1');
console.assert(knapsack([10,20,30], [1,1,1], 2) === 50, 'Test 2');
console.assert(knapsack([10], [5], 3) === 0, 'Test 3: item too heavy');
console.log('All tests passed!');`,
    testCases: `console.assert(knapsack([60,100,120],[10,20,30],50)===220,'T1');
console.assert(knapsack([10,20,30],[1,1,1],2)===50,'T2');`,
    tags: ["dp", "knapsack"],
    order: 4,
    timeComplexity: "O(n * W)",
    spaceComplexity: "O(W) with optimization",
    patternSentence:
      "The pattern to remember: dp[w] = max value with capacity w. For each item, iterate capacity backwards: dp[w] = max(dp[w], dp[w-weight] + value).",
    solution: `function knapsack(values, weights, W) {
  const dp = new Array(W + 1).fill(0);
  for (let i = 0; i < values.length; i++) {
    for (let w = W; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[W];
}`,
    solutionExplanation:
      "Use a 1D DP array. For each item, iterate capacities from W down to the item's weight (backwards to avoid using an item twice). At each capacity, decide whether to take the item or not.",
  },
  {
    id: "dp-05",
    chapterId: 15,
    title: "Unique Paths in Grid",
    difficulty: "core",
    description:
      "A robot starts at the top-left corner of an m x n grid and can only move right or down. How many unique paths are there to the bottom-right corner? Classic 2D DP.",
    examples: [
      { input: "m=3, n=7", output: "28" },
      { input: "m=3, n=2", output: "3" },
    ],
    constraints: ["1 <= m, n <= 100"],
    starterCode: `function uniquePaths(m, n) {
  // Your code here
}

// Tests
console.assert(uniquePaths(3, 7) === 28, 'Test 1');
console.assert(uniquePaths(3, 2) === 3, 'Test 2');
console.assert(uniquePaths(1, 1) === 1, 'Test 3');
console.assert(uniquePaths(2, 2) === 2, 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(uniquePaths(3,7)===28,'T1');
console.assert(uniquePaths(3,2)===3,'T2');
console.assert(uniquePaths(1,1)===1,'T3');`,
    tags: ["dp", "grid"],
    order: 5,
    timeComplexity: "O(m * n)",
    spaceComplexity: "O(n) with row optimization",
    patternSentence:
      "The pattern to remember: dp[r][c] = dp[r-1][c] + dp[r][c-1]. Each cell's value is the sum of paths from above and from the left.",
    solution: `function uniquePaths(m, n) {
  const dp = new Array(n).fill(1);
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      dp[c] += dp[c - 1];
    }
  }
  return dp[n - 1];
}`,
    solutionExplanation:
      "Use a 1D array (single row). First row is all 1s. For each subsequent row, each cell = itself (from above) + left neighbor. dp[n-1] at the end is the answer.",
  },

  // === CHALLENGE ===
  {
    id: "dp-06",
    chapterId: 15,
    title: "Longest Common Subsequence",
    difficulty: "challenge",
    description:
      "Given two strings, find the length of their longest common subsequence. This is the classic 2D DP problem — it's used in diff algorithms (like git diff).",
    examples: [
      { input: '"abcde", "ace"', output: "3", explanation: '"ace" is the LCS' },
      { input: '"abc", "def"', output: "0" },
    ],
    constraints: ["1 <= text1.length, text2.length <= 1000"],
    starterCode: `function longestCommonSubsequence(text1, text2) {
  // Your code here
}

// Tests
console.assert(longestCommonSubsequence("abcde", "ace") === 3, 'Test 1');
console.assert(longestCommonSubsequence("abc", "abc") === 3, 'Test 2');
console.assert(longestCommonSubsequence("abc", "def") === 0, 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(longestCommonSubsequence("abcde","ace")===3,'T1');
console.assert(longestCommonSubsequence("abc","def")===0,'T2');`,
    tags: ["dp", "2d-dp", "string"],
    order: 6,
    timeComplexity: "O(m * n)",
    spaceComplexity: "O(m * n), optimizable to O(min(m,n))",
    patternSentence:
      "The pattern to remember: if chars match, dp[i][j] = dp[i-1][j-1] + 1. Otherwise, dp[i][j] = max(dp[i-1][j], dp[i][j-1]). The 2D table captures all subproblem combinations.",
    solution: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i-1] === text2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
      }
    }
  }
  return dp[m][n];
}`,
    solutionExplanation:
      "Build a 2D table where dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]. If characters match, extend the LCS. Otherwise, take the best of skipping either character.",
  },

  // === REAL-WORLD ===
  {
    id: "dp-07",
    chapterId: 15,
    title: "Word Break",
    difficulty: "real-world",
    description:
      "Given a string and a dictionary of words, determine if the string can be segmented into a sequence of dictionary words. This is the algorithm behind auto-suggestions and NLP tokenization.",
    examples: [
      { input: 's="leetcode", dict=["leet","code"]', output: "true" },
      { input: 's="catsandog", dict=["cats","dog","sand","and","cat"]', output: "false" },
    ],
    constraints: ["1 <= s.length <= 300", "1 <= dict.length <= 1000"],
    starterCode: `function wordBreak(s, wordDict) {
  // Your code here
}

// Tests
console.assert(wordBreak("leetcode", ["leet","code"]) === true, 'Test 1');
console.assert(wordBreak("applepenapple", ["apple","pen"]) === true, 'Test 2');
console.assert(wordBreak("catsandog", ["cats","dog","sand","and","cat"]) === false, 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(wordBreak("leetcode",["leet","code"])===true,'T1');
console.assert(wordBreak("catsandog",["cats","dog","sand","and","cat"])===false,'T2');`,
    tags: ["dp", "string", "set"],
    order: 7,
    timeComplexity: "O(n² * k) where k = max word length",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: dp[i] = can we segment s[0..i-1]? For each position, check all words: if dp[i - word.length] is true and the substring matches the word, dp[i] is true.",
    solution: `function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (const word of words) {
      if (i >= word.length && dp[i - word.length] && s.slice(i - word.length, i) === word) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}`,
    solutionExplanation:
      "dp[i] indicates if s[0..i-1] can be segmented. For each position i, check if any word in the dictionary ends at position i and dp[start of that word] is true.",
  },
];
