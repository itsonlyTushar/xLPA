import { Problem } from "../../types";

export const graphProblems: Problem[] = [
  // === WARMUP ===
  {
    id: "graph-01",
    chapterId: 14,
    title: "Build an Adjacency List",
    difficulty: "warmup",
    description:
      "Given a list of edges [from, to], build an adjacency list representation using a Map. Support both directed and undirected graphs. This is how you'll represent every graph problem.",
    examples: [
      {
        input: "edges=[[0,1],[0,2],[1,2]], undirected=true",
        output: "{ 0: [1,2], 1: [0,2], 2: [0,1] }",
      },
    ],
    constraints: ["0 <= edges.length <= 10^4"],
    starterCode: `function buildGraph(edges, undirected = true) {
  // Return a Map<number, number[]> adjacency list
}

// Tests
const g1 = buildGraph([[0,1],[0,2],[1,2]], true);
console.assert(g1.get(0).length === 2, 'Test 1: node 0 has 2 neighbors');
console.assert(g1.get(1).includes(0), 'Test 2: undirected edge');
const g2 = buildGraph([[0,1],[1,2]], false);
console.assert(!g2.has(2) || !g2.get(2).includes(1), 'Test 3: directed');
console.log('All tests passed!');`,
    testCases: `const g=buildGraph([[0,1],[0,2],[1,2]],true);
console.assert(g.get(0).length===2,'T1');console.assert(g.get(1).includes(0),'T2');`,
    tags: ["graph", "adjacency-list"],
    order: 1,
    timeComplexity: "O(E)",
    spaceComplexity: "O(V + E)",
    patternSentence:
      "The pattern to remember: for each edge, add to both directions (undirected) or one (directed). Initialize missing nodes with empty arrays.",
    solution: `function buildGraph(edges, undirected = true) {
  const graph = new Map();
  for (const [from, to] of edges) {
    if (!graph.has(from)) graph.set(from, []);
    if (!graph.has(to)) graph.set(to, []);
    graph.get(from).push(to);
    if (undirected) graph.get(to).push(from);
  }
  return graph;
}`,
    solutionExplanation:
      "Iterate over edges. For each edge, ensure both nodes exist in the map, then add the connection. For undirected graphs, add in both directions.",
  },

  // === CORE ===
  {
    id: "graph-02",
    chapterId: 14,
    title: "BFS — Shortest Path in Unweighted Graph",
    difficulty: "core",
    description:
      "Given an unweighted graph and a source node, find the shortest distance to every other node using BFS. BFS guarantees shortest paths in unweighted graphs.",
    examples: [
      {
        input: "edges=[[0,1],[0,2],[1,3],[2,3]], source=0",
        output: "{ 0: 0, 1: 1, 2: 1, 3: 2 }",
      },
    ],
    constraints: ["Graph is connected", "No negative edges"],
    starterCode: `function bfsShortestPath(edges, source) {
  // Return an object mapping node -> shortest distance from source
}

// Tests
const dist = bfsShortestPath([[0,1],[0,2],[1,3],[2,3]], 0);
console.assert(dist[0] === 0, 'Test 1: source distance');
console.assert(dist[1] === 1, 'Test 2: neighbor');
console.assert(dist[3] === 2, 'Test 3: two hops');
console.log('All tests passed!');`,
    testCases: `const d=bfsShortestPath([[0,1],[0,2],[1,3],[2,3]],0);
console.assert(d[0]===0&&d[1]===1&&d[3]===2,'T1');`,
    tags: ["graph", "bfs", "shortest-path"],
    order: 2,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    patternSentence:
      "The pattern to remember: BFS visits nodes level by level — each level is one hop further. The first time you reach a node is the shortest path.",
    solution: `function bfsShortestPath(edges, source) {
  const graph = new Map();
  for (const [u, v] of edges) {
    if (!graph.has(u)) graph.set(u, []);
    if (!graph.has(v)) graph.set(v, []);
    graph.get(u).push(v);
    graph.get(v).push(u);
  }
  const dist = {};
  dist[source] = 0;
  const queue = [source];
  while (queue.length > 0) {
    const node = queue.shift();
    for (const neighbor of (graph.get(node) || [])) {
      if (dist[neighbor] === undefined) {
        dist[neighbor] = dist[node] + 1;
        queue.push(neighbor);
      }
    }
  }
  return dist;
}`,
    solutionExplanation:
      "Build adjacency list. BFS from source: mark distance as parent+1 on first visit. The queue ensures we process closer nodes first, guaranteeing shortest paths.",
  },
  {
    id: "graph-03",
    chapterId: 14,
    title: "DFS — Detect Cycle in Undirected Graph",
    difficulty: "core",
    description:
      "Given an undirected graph, determine if it contains a cycle. Use DFS with parent tracking — if you visit a neighbor that's already visited and is not the parent, there's a cycle.",
    examples: [
      { input: "n=4, edges=[[0,1],[1,2],[2,3],[3,1]]", output: "true" },
      { input: "n=3, edges=[[0,1],[1,2]]", output: "false" },
    ],
    constraints: ["1 <= n <= 10^5"],
    starterCode: `function hasCycle(n, edges) {
  // Your code here
}

// Tests
console.assert(hasCycle(4, [[0,1],[1,2],[2,3],[3,1]]) === true, 'Test 1: has cycle');
console.assert(hasCycle(3, [[0,1],[1,2]]) === false, 'Test 2: no cycle');
console.assert(hasCycle(1, []) === false, 'Test 3: single node');
console.log('All tests passed!');`,
    testCases: `console.assert(hasCycle(4,[[0,1],[1,2],[2,3],[3,1]])===true,'T1');
console.assert(hasCycle(3,[[0,1],[1,2]])===false,'T2');`,
    tags: ["graph", "dfs", "cycle-detection"],
    order: 3,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    patternSentence:
      "The pattern to remember: in DFS on an undirected graph, a back edge (visiting an already-visited non-parent node) means a cycle exists.",
    solution: `function hasCycle(n, edges) {
  const graph = new Map();
  for (let i = 0; i < n; i++) graph.set(i, []);
  for (const [u, v] of edges) {
    graph.get(u).push(v);
    graph.get(v).push(u);
  }
  const visited = new Set();
  function dfs(node, parent) {
    visited.add(node);
    for (const neighbor of graph.get(node)) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor, node)) return true;
      } else if (neighbor !== parent) {
        return true;
      }
    }
    return false;
  }
  for (let i = 0; i < n; i++) {
    if (!visited.has(i) && dfs(i, -1)) return true;
  }
  return false;
}`,
    solutionExplanation:
      "DFS from each unvisited node, tracking the parent. If we encounter a visited node that isn't our parent, we've found a cycle. Check all components for disconnected graphs.",
  },
  {
    id: "graph-04",
    chapterId: 14,
    title: "Number of Islands",
    difficulty: "core",
    description:
      "Given a 2D grid of '1's (land) and '0's (water), count the number of islands. An island is connected land cells (horizontal/vertical). This is DFS/BFS on an implicit graph.",
    examples: [
      {
        input: '[["1","1","0"],["1","1","0"],["0","0","1"]]',
        output: "2",
      },
    ],
    constraints: ["1 <= m, n <= 300"],
    starterCode: `function numIslands(grid) {
  // Your code here
}

// Tests
console.assert(numIslands([
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]) === 1, 'Test 1');
console.assert(numIslands([
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]) === 3, 'Test 2');
console.log('All tests passed!');`,
    testCases: `console.assert(numIslands([["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]])===1,'T1');
console.assert(numIslands([["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]])===3,'T2');`,
    tags: ["graph", "dfs", "matrix"],
    order: 4,
    timeComplexity: "O(m * n)",
    spaceComplexity: "O(m * n) worst case for recursion",
    patternSentence:
      "The pattern to remember: scan the grid — when you find a '1', DFS/BFS to mark the entire island as visited, increment count. The grid itself is the graph.",
    solution: `function numIslands(grid) {
  let count = 0;
  const rows = grid.length, cols = grid[0].length;
  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') return;
    grid[r][c] = '0'; // mark visited
    dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') { count++; dfs(r, c); }
    }
  }
  return count;
}`,
    solutionExplanation:
      "Iterate through every cell. When a '1' is found, increment the island count and DFS to mark all connected '1's as '0' (visited). Each cell is visited at most twice → O(m*n).",
  },
  {
    id: "graph-05",
    chapterId: 14,
    title: "Topological Sort (Kahn's Algorithm)",
    difficulty: "core",
    description:
      "Given a directed acyclic graph (DAG), return a topological ordering of its vertices. Use Kahn's algorithm (BFS with in-degree tracking). This is how npm resolves dependencies.",
    examples: [
      { input: "n=4, edges=[[0,1],[0,2],[1,3],[2,3]]", output: "[0,1,2,3] or [0,2,1,3]" },
    ],
    constraints: ["Graph is a DAG (no cycles)", "2 <= n <= 10^4"],
    starterCode: `function topologicalSort(n, edges) {
  // Return an array of nodes in topological order
}

// Tests
const order = topologicalSort(4, [[0,1],[0,2],[1,3],[2,3]]);
console.assert(order[0] === 0, 'Test 1: 0 comes first');
console.assert(order.indexOf(1) < order.indexOf(3), 'Test 2: 1 before 3');
console.assert(order.indexOf(2) < order.indexOf(3), 'Test 3: 2 before 3');
console.assert(order.length === 4, 'Test 4: all nodes');
console.log('All tests passed!');`,
    testCases: `const o=topologicalSort(4,[[0,1],[0,2],[1,3],[2,3]]);
console.assert(o[0]===0&&o.indexOf(1)<o.indexOf(3)&&o.length===4,'T1');`,
    tags: ["graph", "bfs", "topological-sort"],
    order: 5,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
    patternSentence:
      "The pattern to remember: start with all nodes that have 0 in-degree (no dependencies), process them, reduce their neighbors' in-degrees, repeat.",
    solution: `function topologicalSort(n, edges) {
  const graph = new Map();
  const inDegree = new Array(n).fill(0);
  for (let i = 0; i < n; i++) graph.set(i, []);
  for (const [u, v] of edges) {
    graph.get(u).push(v);
    inDegree[v]++;
  }
  const queue = [];
  for (let i = 0; i < n; i++) if (inDegree[i] === 0) queue.push(i);
  const result = [];
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);
    for (const neighbor of graph.get(node)) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) queue.push(neighbor);
    }
  }
  return result;
}`,
    solutionExplanation:
      "Compute in-degree for each node. Start BFS with all zero in-degree nodes. Process each, decrement neighbors' in-degrees, add newly zero in-degree nodes to the queue. The processing order is topological.",
  },

  // === CHALLENGE ===
  {
    id: "graph-06",
    chapterId: 14,
    title: "Clone Graph",
    difficulty: "challenge",
    description:
      "Given a reference to a node in a connected undirected graph, return a deep copy. Each node has a val and a list of neighbors. Use a hashmap to track cloned nodes.",
    examples: [
      { input: "[[2,4],[1,3],[2,4],[1,3]]", output: "deep copy of the graph" },
    ],
    constraints: ["1 <= number of nodes <= 100", "No duplicate edges or self-loops"],
    starterCode: `function cloneGraph(node) {
  // Your code here
}

// Node class for testing
class GraphNode {
  constructor(val, neighbors = []) { this.val = val; this.neighbors = neighbors; }
}

// Build test graph: 1--2, 1--4, 2--3, 3--4
const n1 = new GraphNode(1), n2 = new GraphNode(2), n3 = new GraphNode(3), n4 = new GraphNode(4);
n1.neighbors = [n2, n4]; n2.neighbors = [n1, n3]; n3.neighbors = [n2, n4]; n4.neighbors = [n1, n3];

const clone = cloneGraph(n1);
console.assert(clone.val === 1, 'Test 1: value');
console.assert(clone !== n1, 'Test 2: different reference');
console.assert(clone.neighbors.length === 2, 'Test 3: neighbors cloned');
console.assert(clone.neighbors[0] !== n2, 'Test 4: deep copy');
console.log('All tests passed!');`,
    testCases: `const cl=cloneGraph(n1);console.assert(cl.val===1&&cl!==n1&&cl.neighbors.length===2,'T1');`,
    tags: ["graph", "dfs", "hashmap"],
    order: 6,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    patternSentence:
      "The pattern to remember: use a Map<original, clone> — if a node is already cloned, return the clone. Otherwise create it, then recursively clone neighbors.",
    solution: `function cloneGraph(node) {
  if (!node) return null;
  const cloned = new Map();
  function dfs(n) {
    if (cloned.has(n)) return cloned.get(n);
    const copy = new GraphNode(n.val);
    cloned.set(n, copy);
    for (const neighbor of n.neighbors) {
      copy.neighbors.push(dfs(neighbor));
    }
    return copy;
  }
  return dfs(node);
}`,
    solutionExplanation:
      "DFS with a Map to track cloned nodes. For each node, create a copy, store it in the map, then recursively clone each neighbor. The map prevents infinite loops on cycles.",
  },
];
