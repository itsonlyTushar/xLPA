import { Problem } from "../../types";

export const treeProblems: Problem[] = [
  // === WARMUP ===
  {
    id: "tree-01",
    chapterId: 12,
    title: "Inorder Traversal",
    difficulty: "warmup",
    description:
      "Given a binary tree, return its inorder traversal (left → root → right) as an array. A tree node is { val, left, right }. This is your first tree traversal.",
    examples: [
      { input: "[1,null,2,3]", output: "[1, 3, 2]" },
      { input: "[]", output: "[]" },
    ],
    constraints: ["0 <= number of nodes <= 100"],
    starterCode: `function inorderTraversal(root) {
  // Your code here — return an array of values
}

// Helper to build tree from description
// Tree: {val: 1, left: null, right: {val: 2, left: {val: 3, ...}, right: null}}
const tree1 = { val: 1, left: null, right: { val: 2, left: { val: 3, left: null, right: null }, right: null } };

// Tests
console.assert(JSON.stringify(inorderTraversal(tree1)) === '[1,3,2]', 'Test 1');
console.assert(JSON.stringify(inorderTraversal(null)) === '[]', 'Test 2');
const single = { val: 1, left: null, right: null };
console.assert(JSON.stringify(inorderTraversal(single)) === '[1]', 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(inorderTraversal(tree1))==='[1,3,2]','T1');
console.assert(JSON.stringify(inorderTraversal(null))==='[]','T2');`,
    tags: ["tree", "traversal", "recursion"],
    order: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) — call stack height",
    patternSentence:
      "The pattern to remember: inorder = left, self, right. For BSTs, inorder gives sorted order — this is the most important traversal.",
    solution: `function inorderTraversal(root) {
  const result = [];
  function dfs(node) {
    if (!node) return;
    dfs(node.left);
    result.push(node.val);
    dfs(node.right);
  }
  dfs(root);
  return result;
}`,
    solutionExplanation:
      "Recursive DFS: visit left subtree, then current node, then right subtree. Base case: null node returns immediately. Collects values in sorted order for BSTs.",
  },

  // === CORE ===
  {
    id: "tree-02",
    chapterId: 12,
    title: "Maximum Depth of Binary Tree",
    difficulty: "core",
    description:
      "Given a binary tree, find its maximum depth (the number of nodes along the longest path from root to a leaf). This teaches recursive return values.",
    examples: [
      { input: "[3,9,20,null,null,15,7]", output: "3" },
      { input: "[1,null,2]", output: "2" },
    ],
    constraints: ["0 <= number of nodes <= 10^4"],
    starterCode: `function maxDepth(root) {
  // Your code here
}

const tree1 = {
  val: 3,
  left: { val: 9, left: null, right: null },
  right: { val: 20, left: { val: 15, left: null, right: null }, right: { val: 7, left: null, right: null } }
};

// Tests
console.assert(maxDepth(tree1) === 3, 'Test 1');
console.assert(maxDepth(null) === 0, 'Test 2');
console.assert(maxDepth({ val: 1, left: null, right: null }) === 1, 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(maxDepth(tree1)===3,'T1');
console.assert(maxDepth(null)===0,'T2');`,
    tags: ["tree", "recursion", "dfs"],
    order: 2,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    patternSentence:
      "The pattern to remember: the depth of a tree = 1 + max(depth of left, depth of right). Base case: null → 0.",
    solution: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    solutionExplanation:
      "Classic recursive approach: an empty tree has depth 0. Otherwise, the depth is 1 (for the current node) plus the max of left and right subtree depths.",
  },
  {
    id: "tree-03",
    chapterId: 12,
    title: "Invert Binary Tree",
    difficulty: "core",
    description:
      "Invert a binary tree — swap every left and right child. This is the problem that famously stumped a Google interviewer. Simple recursion, profound insight.",
    examples: [
      { input: "[4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" },
    ],
    constraints: ["0 <= number of nodes <= 100"],
    starterCode: `function invertTree(root) {
  // Your code here
}

function toArray(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length) {
    const node = queue.shift();
    result.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return result;
}

const tree = {
  val: 4,
  left: { val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } },
  right: { val: 7, left: { val: 6, left: null, right: null }, right: { val: 9, left: null, right: null } }
};

// Tests
invertTree(tree);
console.assert(JSON.stringify(toArray(tree)) === '[4,7,2,9,6,3,1]', 'Test 1');
console.assert(invertTree(null) === null, 'Test 2');
console.log('All tests passed!');`,
    testCases: `invertTree(tree);console.assert(JSON.stringify(toArray(tree))==='[4,7,2,9,6,3,1]','T1');`,
    tags: ["tree", "recursion"],
    order: 3,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    patternSentence:
      "The pattern to remember: swap left and right children, then recursively invert both subtrees — the simplest tree transformation.",
    solution: `function invertTree(root) {
  if (!root) return null;
  const temp = root.left;
  root.left = root.right;
  root.right = temp;
  invertTree(root.left);
  invertTree(root.right);
  return root;
}`,
    solutionExplanation:
      "At each node, swap left and right children, then recurse into both. Base case: null returns null. Every node is visited once → O(n).",
  },
  {
    id: "tree-04",
    chapterId: 12,
    title: "Level Order Traversal (BFS)",
    difficulty: "core",
    description:
      "Given a binary tree, return its level order traversal as an array of arrays. Each inner array contains values at that depth level. This is BFS on a tree.",
    examples: [
      { input: "[3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" },
    ],
    constraints: ["0 <= number of nodes <= 2000"],
    starterCode: `function levelOrder(root) {
  // Your code here
}

const tree = {
  val: 3,
  left: { val: 9, left: null, right: null },
  right: { val: 20, left: { val: 15, left: null, right: null }, right: { val: 7, left: null, right: null } }
};

// Tests
console.assert(JSON.stringify(levelOrder(tree)) === '[[3],[9,20],[15,7]]', 'Test 1');
console.assert(JSON.stringify(levelOrder(null)) === '[]', 'Test 2');
console.log('All tests passed!');`,
    testCases: `console.assert(JSON.stringify(levelOrder(tree))==='[[3],[9,20],[15,7]]','T1');
console.assert(JSON.stringify(levelOrder(null))==='[]','T2');`,
    tags: ["tree", "bfs", "queue"],
    order: 4,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: BFS with a queue, process one level at a time by tracking the queue size at the start of each level.",
    solution: `function levelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length > 0) {
    const level = [];
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
    solutionExplanation:
      "Use a queue for BFS. At each iteration, record the queue size (= number of nodes at this level), process all of them, and add their children. Each processed batch is one level.",
  },
  {
    id: "tree-05",
    chapterId: 12,
    title: "Validate Binary Search Tree",
    difficulty: "core",
    description:
      "Given a binary tree, determine if it is a valid BST. Every node's value must be strictly greater than all values in its left subtree and strictly less than all in its right subtree.",
    examples: [
      { input: "[2,1,3]", output: "true" },
      { input: "[5,1,4,null,null,3,6]", output: "false", explanation: "Node 4 is in right subtree of 5 but 4 < 5" },
    ],
    constraints: ["1 <= number of nodes <= 10^4"],
    starterCode: `function isValidBST(root) {
  // Your code here
}

const valid = { val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } };
const invalid = {
  val: 5,
  left: { val: 1, left: null, right: null },
  right: { val: 4, left: { val: 3, left: null, right: null }, right: { val: 6, left: null, right: null } }
};

// Tests
console.assert(isValidBST(valid) === true, 'Test 1');
console.assert(isValidBST(invalid) === false, 'Test 2');
console.assert(isValidBST(null) === true, 'Test 3');
console.log('All tests passed!');`,
    testCases: `console.assert(isValidBST(valid)===true,'T1');
console.assert(isValidBST(invalid)===false,'T2');`,
    tags: ["tree", "bst", "recursion"],
    order: 5,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    patternSentence:
      "The pattern to remember: pass min/max bounds down the tree — each node must be within its allowed range. Left child gets upper bound, right child gets lower bound.",
    solution: `function isValidBST(root) {
  function validate(node, min, max) {
    if (!node) return true;
    if (node.val <= min || node.val >= max) return false;
    return validate(node.left, min, node.val) && validate(node.right, node.val, max);
  }
  return validate(root, -Infinity, Infinity);
}`,
    solutionExplanation:
      "Recursively validate each node against a valid range [min, max]. The root's range is (-∞, ∞). Going left narrows the max, going right narrows the min. Any violation returns false.",
  },

  // === CHALLENGE ===
  {
    id: "tree-06",
    chapterId: 12,
    title: "Lowest Common Ancestor",
    difficulty: "challenge",
    description:
      "Given a binary tree and two nodes p and q, find their lowest common ancestor (LCA). The LCA is the deepest node that has both p and q as descendants.",
    examples: [
      { input: "root=[3,5,1,6,2,0,8], p=5, q=1", output: "3" },
      { input: "root=[3,5,1,6,2,0,8], p=5, q=4", output: "5" },
    ],
    constraints: ["All node values are unique", "p and q are in the tree"],
    starterCode: `function lowestCommonAncestor(root, p, q) {
  // Your code here — return the LCA node
}

const tree = {
  val: 3,
  left: {
    val: 5,
    left: { val: 6, left: null, right: null },
    right: { val: 2, left: { val: 7, left: null, right: null }, right: { val: 4, left: null, right: null } }
  },
  right: {
    val: 1,
    left: { val: 0, left: null, right: null },
    right: { val: 8, left: null, right: null }
  }
};

// Tests
console.assert(lowestCommonAncestor(tree, 5, 1).val === 3, 'Test 1');
console.assert(lowestCommonAncestor(tree, 5, 4).val === 5, 'Test 2');
console.log('All tests passed!');`,
    testCases: `console.assert(lowestCommonAncestor(tree,5,1).val===3,'T1');
console.assert(lowestCommonAncestor(tree,5,4).val===5,'T2');`,
    tags: ["tree", "recursion", "dfs"],
    order: 6,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    patternSentence:
      "The pattern to remember: if left and right subtrees each contain one target, the current node is the LCA. If only one side has both, bubble that answer up.",
    solution: `function lowestCommonAncestor(root, p, q) {
  if (!root || root.val === p || root.val === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left || right;
}`,
    solutionExplanation:
      "If the current node is null or matches p or q, return it. Recurse left and right. If both return non-null, current node is the LCA. Otherwise, return whichever side found something.",
  },

  // === REAL-WORLD ===
  {
    id: "tree-07",
    chapterId: 12,
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "real-world",
    description:
      "Design functions to convert a binary tree to a string and back. This is exactly what JSON.stringify does for nested objects — but you'll do it for a tree structure.",
    examples: [
      { input: "[1,2,3,null,null,4,5]", output: "string that can recreate the tree" },
    ],
    constraints: ["0 <= number of nodes <= 10^4", "Use any format you want"],
    starterCode: `function serialize(root) {
  // Convert tree to string
}

function deserialize(data) {
  // Convert string back to tree
}

const tree = {
  val: 1,
  left: { val: 2, left: null, right: null },
  right: { val: 3, left: { val: 4, left: null, right: null }, right: { val: 5, left: null, right: null } }
};

// Tests
const serialized = serialize(tree);
const restored = deserialize(serialized);
console.assert(restored.val === 1, 'Test 1: root');
console.assert(restored.left.val === 2, 'Test 2: left');
console.assert(restored.right.val === 3, 'Test 3: right');
console.assert(restored.right.left.val === 4, 'Test 4: nested');
console.assert(serialize(null) !== undefined, 'Test 5: null tree');
console.assert(deserialize(serialize(null)) === null, 'Test 6: null round-trip');
console.log('All tests passed!');`,
    testCases: `const s=serialize(tree);const r=deserialize(s);
console.assert(r.val===1&&r.left.val===2&&r.right.val===3,'T1');
console.assert(deserialize(serialize(null))===null,'T2');`,
    tags: ["tree", "serialization", "bfs"],
    order: 7,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternSentence:
      "The pattern to remember: preorder traversal with null markers gives a unique serialization — use the same order to deserialize with a queue/index.",
    solution: `function serialize(root) {
  const result = [];
  function dfs(node) {
    if (!node) { result.push("null"); return; }
    result.push(String(node.val));
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  return result.join(",");
}

function deserialize(data) {
  const values = data.split(",");
  let i = 0;
  function dfs() {
    if (values[i] === "null") { i++; return null; }
    const node = { val: Number(values[i]), left: null, right: null };
    i++;
    node.left = dfs();
    node.right = dfs();
    return node;
  }
  return dfs();
}`,
    solutionExplanation:
      "Serialize with preorder DFS, writing 'null' for empty nodes. Deserialize by reading values in the same preorder sequence, using an index to track position.",
  },
];
