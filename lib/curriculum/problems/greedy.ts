import { Problem } from "../../types";

export const greedyProblems: Problem[] = [
  // === WARMUP ===
  {
    id: "greedy-01",
    chapterId: 16,
    title: "Assign Cookies",
    difficulty: "warmup",
    description:
      "You have children with greed factors and cookies with sizes. Each child gets at most one cookie, and a child is content only if cookie size >= greed factor. Maximize the number of content children.",
    examples: [
      { input: "greed=[1,2,3], cookies=[1,1]", output: "1" },
      { input: "greed=[1,2], cookies=[1,2,3]", output: "2" },
    ],
    constraints: ["1 <= greed.length, cookies.length <= 3 * 10^4"],
    starterCode: `function findContentChildren(greed, cookies) {
  // Your code here
}

// Tests
console.assert(findContentChildren([1,2,3], [1,1]) === 1, 'Test 1');
console.assert(findContentChildren([1,2], [1,2,3]) === 2, 'Test 2');
console.assert(findContentChildren([10,9,8], [5,6,7]) === 0, 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(findContentChildren([1,2,3],[1,1])===1,'T1');
console.assert(findContentChildren([1,2],[1,2,3])===2,'T2');`,
    tags: ["greedy", "sorting"],
    order: 1,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: sort both arrays, assign the smallest sufficient cookie to the least greedy child — this greedy matching is optimal.",
    solution: `function findContentChildren(greed, cookies) {
  greed.sort((a, b) => a - b);
  cookies.sort((a, b) => a - b);
  let child = 0, cookie = 0;
  while (child < greed.length && cookie < cookies.length) {
    if (cookies[cookie] >= greed[child]) child++;
    cookie++;
  }
  return child;
}`,
    solutionExplanation:
      "Sort both arrays. Try to satisfy the least greedy child with the smallest available cookie. If the cookie works, move to the next child. Always move to the next cookie.",
  },

  // === CORE ===
  {
    id: "greedy-02",
    chapterId: 16,
    title: "Activity Selection (Interval Scheduling)",
    difficulty: "core",
    description:
      "Given n activities with start and end times, select the maximum number of non-overlapping activities. This is the foundational greedy problem — sort by end time.",
    examples: [
      {
        input: "starts=[1,3,0,5,8,5], ends=[2,4,6,7,9,9]",
        output: "4",
        explanation: "Activities: [1,2], [3,4], [5,7], [8,9]",
      },
    ],
    constraints: ["1 <= n <= 10^5"],
    starterCode: `function maxActivities(starts, ends) {
  // Your code here — return the count of max non-overlapping activities
}

// Tests
console.assert(maxActivities([1,3,0,5,8,5], [2,4,6,7,9,9]) === 4, 'Test 1');
console.assert(maxActivities([1,2,3], [2,3,4]) === 3, 'Test 2');
console.assert(maxActivities([1,1,1], [2,2,2]) === 1, 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(maxActivities([1,3,0,5,8,5],[2,4,6,7,9,9])===4,'T1');
console.assert(maxActivities([1,2,3],[2,3,4])===3,'T2');`,
    tags: ["greedy", "intervals", "sorting"],
    order: 2,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: sort by end time, always pick the activity that ends earliest — this leaves the most room for future activities.",
    solution: `function maxActivities(starts, ends) {
  const activities = starts.map((s, i) => [s, ends[i]]).sort((a, b) => a[1] - b[1]);
  let count = 1, lastEnd = activities[0][1];
  for (let i = 1; i < activities.length; i++) {
    if (activities[i][0] >= lastEnd) {
      count++;
      lastEnd = activities[i][1];
    }
  }
  return count;
}`,
    solutionExplanation:
      "Sort activities by end time. Start with the first activity. For each subsequent activity, if its start >= last selected end, select it. This greedy choice is provably optimal.",
  },
  {
    id: "greedy-03",
    chapterId: 16,
    title: "Jump Game",
    difficulty: "core",
    description:
      "Given an array where each element represents the maximum jump length from that position, determine if you can reach the last index starting from index 0.",
    examples: [
      { input: "[2,3,1,1,4]", output: "true" },
      { input: "[3,2,1,0,4]", output: "false" },
    ],
    constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 10^5"],
    starterCode: `function canJump(nums) {
  // Your code here
}

// Tests
console.assert(canJump([2,3,1,1,4]) === true, 'Test 1');
console.assert(canJump([3,2,1,0,4]) === false, 'Test 2');
console.assert(canJump([0]) === true, 'Test 3');
console.assert(canJump([2,0,0]) === true, 'Test 4');
console.log('All tests passed!');`,
    testCases: `console.assert(canJump([2,3,1,1,4])===true,'T1');
console.assert(canJump([3,2,1,0,4])===false,'T2');`,
    tags: ["greedy"],
    order: 3,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: track the farthest reachable index. If the current index exceeds it, you're stuck. If it reaches the end, you can make it.",
    solution: `function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}`,
    solutionExplanation:
      "Maintain the farthest index we can reach. At each position, if we can't reach it, return false. Otherwise, update maxReach. If we process all indices, we can reach the end.",
  },
  {
    id: "greedy-04",
    chapterId: 16,
    title: "Merge Intervals",
    difficulty: "core",
    description:
      "Given an array of intervals, merge all overlapping intervals. Return the array of non-overlapping intervals that cover all the inputs. This appears in calendar apps and scheduling.",
    examples: [
      { input: "[[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
      { input: "[[1,4],[4,5]]", output: "[[1,5]]" },
    ],
    constraints: ["1 <= intervals.length <= 10^4"],
    starterCode: `function merge(intervals) {
  // Your code here
}

// Tests
console.assert(JSON.stringify(merge([[1,3],[2,6],[8,10],[15,18]])) === '[[1,6],[8,10],[15,18]]', 'Test 1');
console.assert(JSON.stringify(merge([[1,4],[4,5]])) === '[[1,5]]', 'Test 2');
console.assert(JSON.stringify(merge([[1,4],[0,4]])) === '[[0,4]]', 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(merge([[1,3],[2,6],[8,10],[15,18]]))==='[[1,6],[8,10],[15,18]]','T1');
console.assert(JSON.stringify(merge([[1,4],[4,5]]))==='[[1,5]]','T2');`,
    tags: ["greedy", "intervals", "sorting"],
    order: 4,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: sort by start time, then greedily extend the current interval's end — if next starts after current ends, start a new interval.",
    solution: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    if (intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      merged.push(intervals[i]);
    }
  }
  return merged;
}`,
    solutionExplanation:
      "Sort intervals by start time. Iterate through, merging each interval with the last in the result if they overlap (start <= previous end). Otherwise, start a new interval.",
  },

  // === CHALLENGE ===
  {
    id: "greedy-05",
    chapterId: 16,
    title: "Minimum Number of Platforms",
    difficulty: "challenge",
    description:
      "Given arrival and departure times of trains, find the minimum number of platforms required so no train waits. This is the interval overlap counting problem.",
    examples: [
      {
        input: "arrivals=[900,940,950,1100,1500,1800], departures=[910,1200,1120,1130,1900,2000]",
        output: "3",
      },
    ],
    constraints: ["1 <= n <= 10^5", "Arrival time < Departure time for each train"],
    starterCode: `function minPlatforms(arrivals, departures) {
  // Your code here
}

// Tests
console.assert(minPlatforms([900,940,950,1100,1500,1800], [910,1200,1120,1130,1900,2000]) === 3, 'Test 1');
console.assert(minPlatforms([100,200,300], [110,210,310]) === 1, 'Test 2');
console.assert(minPlatforms([100,100,100], [200,200,200]) === 3, 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(minPlatforms([900,940,950,1100,1500,1800],[910,1200,1120,1130,1900,2000])===3,'T1');
console.assert(minPlatforms([100,200,300],[110,210,310])===1,'T2');`,
    tags: ["greedy", "intervals", "sorting"],
    order: 5,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: sort arrivals and departures separately, use two pointers to count concurrent overlaps — the maximum overlap is the answer.",
    solution: `function minPlatforms(arrivals, departures) {
  arrivals.sort((a, b) => a - b);
  departures.sort((a, b) => a - b);
  let platforms = 0, maxPlatforms = 0;
  let i = 0, j = 0;
  while (i < arrivals.length) {
    if (arrivals[i] <= departures[j]) {
      platforms++;
      i++;
    } else {
      platforms--;
      j++;
    }
    maxPlatforms = Math.max(maxPlatforms, platforms);
  }
  return maxPlatforms;
}`,
    solutionExplanation:
      "Sort arrivals and departures separately. Use two pointers: if next event is an arrival, increment platforms; if departure, decrement. Track the maximum concurrent platforms.",
  },
];
