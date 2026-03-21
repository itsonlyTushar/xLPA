import { Problem } from "../../types";

export const linkedListProblems: Problem[] = [
  // === WARMUP ===
  {
    id: "ll-01",
    chapterId: 9,
    title: "Create and Traverse a Linked List",
    difficulty: "warmup",
    description:
      "Given an array of values, build a singly linked list and return the values by traversing it. Each node is { value, next }. This is your introduction to pointer-based data structures.",
    examples: [
      { input: "[1, 2, 3]", output: "[1, 2, 3]" },
      { input: "[]", output: "[]" },
    ],
    constraints: ["0 <= arr.length <= 10^4"],
    starterCode: `function buildList(arr) {
  // Build a linked list from arr, return the head node
}

function traverse(head) {
  // Return an array of values from traversing the linked list
}

// Tests
const h1 = buildList([1, 2, 3]);
console.assert(JSON.stringify(traverse(h1)) === '[1,2,3]', 'Test 1');
console.assert(JSON.stringify(traverse(buildList([]))) === '[]', 'Test 2');
console.assert(JSON.stringify(traverse(buildList([42]))) === '[42]', 'Test 3');
console.log('All tests passed!');`,
    testCases: `const t1=buildList([1,2,3]);console.assert(JSON.stringify(traverse(t1))==='[1,2,3]','T1');
console.assert(JSON.stringify(traverse(buildList([])))==='[]','T2');`,
    tags: ["linked-list", "traversal"],
    order: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: follow the next pointer until null — this is the linked list equivalent of a for-loop.",
    solution: `function buildList(arr) {
  let head = null;
  for (let i = arr.length - 1; i >= 0; i--) {
    head = { value: arr[i], next: head };
  }
  return head;
}

function traverse(head) {
  const result = [];
  let current = head;
  while (current !== null) {
    result.push(current.value);
    current = current.next;
  }
  return result;
}`,
    solutionExplanation:
      "Build the list from the end (prepending each element). Traverse by following next pointers until null, collecting values in an array.",
  },

  // === CORE ===
  {
    id: "ll-02",
    chapterId: 9,
    title: "Reverse a Linked List",
    difficulty: "core",
    description:
      "Reverse a singly linked list in-place. Return the new head. This is the most important linked list problem — the three-pointer technique appears everywhere.",
    examples: [
      { input: "1 -> 2 -> 3 -> 4 -> 5", output: "5 -> 4 -> 3 -> 2 -> 1" },
      { input: "1", output: "1" },
    ],
    constraints: ["0 <= list length <= 5000"],
    starterCode: `function reverseList(head) {
  // Your code here — reverse in-place, return new head
}

// Helper: build list from array
function buildList(arr) {
  let head = null;
  for (let i = arr.length - 1; i >= 0; i--) head = { value: arr[i], next: head };
  return head;
}
function toArray(head) {
  const r = []; let c = head; while(c) { r.push(c.value); c = c.next; } return r;
}

// Tests
console.assert(JSON.stringify(toArray(reverseList(buildList([1,2,3,4,5])))) === '[5,4,3,2,1]', 'Test 1');
console.assert(JSON.stringify(toArray(reverseList(buildList([1])))) === '[1]', 'Test 2');
console.assert(reverseList(null) === null, 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(toArray(reverseList(buildList([1,2,3,4,5]))))==='[5,4,3,2,1]','T1');
console.assert(reverseList(null)===null,'T2');`,
    tags: ["linked-list", "in-place"],
    order: 2,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: three pointers — prev, current, next. Save next, point current back to prev, advance all three.",
    solution: `function reverseList(head) {
  let prev = null, current = head;
  while (current !== null) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}`,
    solutionExplanation:
      "Use three pointers: prev (starts null), current (starts at head), and a temp for next. At each step, reverse the link, then advance. When current is null, prev is the new head.",
  },
  {
    id: "ll-03",
    chapterId: 9,
    title: "Detect a Cycle (Floyd's Algorithm)",
    difficulty: "core",
    description:
      "Given a linked list, determine if it has a cycle. Use Floyd's slow-and-fast pointer technique. Do not modify the list.",
    examples: [
      { input: "1 -> 2 -> 3 -> 4 -> 2 (cycle)", output: "true" },
      { input: "1 -> 2 -> 3 -> null", output: "false" },
    ],
    constraints: ["0 <= list length <= 10^4", "Do not modify the list"],
    starterCode: `function hasCycle(head) {
  // Your code here
}

// Helper
function buildList(arr) {
  let head = null;
  for (let i = arr.length - 1; i >= 0; i--) head = { value: arr[i], next: head };
  return head;
}

// Tests
const noCycle = buildList([1, 2, 3]);
console.assert(hasCycle(noCycle) === false, 'Test 1: no cycle');

// Create a cycle: 1 -> 2 -> 3 -> 2
const cycleList = buildList([1, 2, 3]);
let tail = cycleList; while(tail.next) tail = tail.next;
tail.next = cycleList.next; // 3 points back to 2
console.assert(hasCycle(cycleList) === true, 'Test 2: has cycle');

console.assert(hasCycle(null) === false, 'Test 3: empty list');
console.log('All tests passed!');`,
    testCases: `const nc=buildList([1,2,3]);console.assert(hasCycle(nc)===false,'T1');
console.assert(hasCycle(null)===false,'T2');`,
    tags: ["linked-list", "two-pointer", "cycle-detection"],
    order: 3,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: slow moves 1 step, fast moves 2 steps — if they ever meet, there's a cycle. If fast hits null, no cycle.",
    solution: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    solutionExplanation:
      "The tortoise-and-hare technique. Slow pointer moves one node, fast pointer moves two nodes per step. In a cycle, fast will lap slow and they'll meet. Without a cycle, fast reaches null.",
  },
  {
    id: "ll-04",
    chapterId: 9,
    title: "Find the Middle Node",
    difficulty: "core",
    description:
      "Given a linked list, return the middle node. If the list has an even number of nodes, return the second middle node. Use the slow/fast pointer technique.",
    examples: [
      { input: "1 -> 2 -> 3 -> 4 -> 5", output: "3" },
      { input: "1 -> 2 -> 3 -> 4", output: "3", explanation: "Second middle for even-length" },
    ],
    constraints: ["1 <= list length <= 100"],
    starterCode: `function middleNode(head) {
  // Return the middle node's value
}

function buildList(arr) {
  let head = null;
  for (let i = arr.length - 1; i >= 0; i--) head = { value: arr[i], next: head };
  return head;
}

// Tests
console.assert(middleNode(buildList([1,2,3,4,5])).value === 3, 'Test 1: odd');
console.assert(middleNode(buildList([1,2,3,4])).value === 3, 'Test 2: even');
console.assert(middleNode(buildList([1])).value === 1, 'Test 3: single');
console.log('All tests passed!');`,
    testCases: `console.assert(middleNode(buildList([1,2,3,4,5])).value===3,'T1');
console.assert(middleNode(buildList([1,2,3,4])).value===3,'T2');`,
    tags: ["linked-list", "two-pointer"],
    order: 4,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: when slow reaches the middle, fast has reached the end — the fast/slow pointer is a measuring tool.",
    solution: `function middleNode(head) {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}`,
    solutionExplanation:
      "Slow moves 1 step, fast moves 2 steps. When fast reaches the end, slow is at the middle. For even-length lists, this gives the second middle.",
  },
  {
    id: "ll-05",
    chapterId: 9,
    title: "Merge Two Sorted Lists",
    difficulty: "core",
    description:
      "Merge two sorted linked lists into one sorted linked list. Use a dummy head node to simplify edge cases.",
    examples: [
      { input: "1->2->4, 1->3->4", output: "1->1->2->3->4->4" },
      { input: "[], []", output: "[]" },
    ],
    constraints: ["0 <= list lengths <= 50", "Both lists are sorted in non-decreasing order"],
    starterCode: `function mergeTwoLists(l1, l2) {
  // Your code here
}

function buildList(arr) {
  let head = null;
  for (let i = arr.length - 1; i >= 0; i--) head = { value: arr[i], next: head };
  return head;
}
function toArray(head) {
  const r = []; let c = head; while(c) { r.push(c.value); c = c.next; } return r;
}

// Tests
const r1 = mergeTwoLists(buildList([1,2,4]), buildList([1,3,4]));
console.assert(JSON.stringify(toArray(r1)) === '[1,1,2,3,4,4]', 'Test 1');
console.assert(mergeTwoLists(null, null) === null, 'Test 2');
const r3 = mergeTwoLists(null, buildList([1]));
console.assert(JSON.stringify(toArray(r3)) === '[1]', 'Test 3');
console.log('All tests passed!');`,
    testCases: `const m1=mergeTwoLists(buildList([1,2,4]),buildList([1,3,4]));
console.assert(JSON.stringify(toArray(m1))==='[1,1,2,3,4,4]','T1');`,
    tags: ["linked-list", "merge"],
    order: 5,
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: use a dummy head to avoid special-casing the first node — compare heads of both lists and append the smaller one.",
    solution: `function mergeTwoLists(l1, l2) {
  const dummy = { value: 0, next: null };
  let tail = dummy;
  while (l1 !== null && l2 !== null) {
    if (l1.value <= l2.value) {
      tail.next = l1;
      l1 = l1.next;
    } else {
      tail.next = l2;
      l2 = l2.next;
    }
    tail = tail.next;
  }
  tail.next = l1 !== null ? l1 : l2;
  return dummy.next;
}`,
    solutionExplanation:
      "Create a dummy node. Compare heads of both lists, append the smaller to the result. When one list is exhausted, append the remainder of the other.",
  },

  // === CHALLENGE ===
  {
    id: "ll-06",
    chapterId: 9,
    title: "Remove Nth Node From End",
    difficulty: "challenge",
    description:
      "Given a linked list, remove the nth node from the end of the list in one pass. Use the two-pointer gap technique.",
    examples: [
      { input: "1->2->3->4->5, n=2", output: "1->2->3->5" },
      { input: "1, n=1", output: "[]" },
    ],
    constraints: ["1 <= list length <= 30", "1 <= n <= list length"],
    starterCode: `function removeNthFromEnd(head, n) {
  // Your code here
}

function buildList(arr) {
  let head = null;
  for (let i = arr.length - 1; i >= 0; i--) head = { value: arr[i], next: head };
  return head;
}
function toArray(head) {
  const r = []; let c = head; while(c) { r.push(c.value); c = c.next; } return r;
}

// Tests
console.assert(JSON.stringify(toArray(removeNthFromEnd(buildList([1,2,3,4,5]), 2))) === '[1,2,3,5]', 'Test 1');
console.assert(removeNthFromEnd(buildList([1]), 1) === null, 'Test 2');
console.assert(JSON.stringify(toArray(removeNthFromEnd(buildList([1,2]), 1))) === '[1]', 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(toArray(removeNthFromEnd(buildList([1,2,3,4,5]),2)))==='[1,2,3,5]','T1');
console.assert(removeNthFromEnd(buildList([1]),1)===null,'T2');`,
    tags: ["linked-list", "two-pointer"],
    order: 6,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternSentence:
      "The pattern to remember: advance fast pointer n steps ahead, then move both — when fast reaches the end, slow is at the node before the target.",
    solution: `function removeNthFromEnd(head, n) {
  const dummy = { value: 0, next: head };
  let fast = dummy, slow = dummy;
  for (let i = 0; i <= n; i++) fast = fast.next;
  while (fast !== null) { fast = fast.next; slow = slow.next; }
  slow.next = slow.next.next;
  return dummy.next;
}`,
    solutionExplanation:
      "Use a dummy node. Advance fast by n+1 steps. Move both pointers until fast is null. Now slow is right before the target node. Skip the target by updating slow.next.",
  },
];
