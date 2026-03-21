import { Problem } from "../../types";

export const trieProblems: Problem[] = [
  // === WARMUP ===
  {
    id: "trie-01",
    chapterId: 17,
    title: "Implement a Trie",
    difficulty: "warmup",
    description:
      "Implement a Trie (prefix tree) with insert, search, and startsWith methods. Each node has children (an object mapping char → node) and an isEnd flag.",
    examples: [
      { input: 'insert("apple"), search("apple"), search("app"), startsWith("app")', output: "true, false, true" },
    ],
    constraints: ["1 <= word.length <= 2000", "Lowercase English letters only"],
    starterCode: `class Trie {
  constructor() {
    // Your code here
  }
  insert(word) { }
  search(word) { }
  startsWith(prefix) { }
}

// Tests
const trie = new Trie();
trie.insert("apple");
console.assert(trie.search("apple") === true, 'Test 1');
console.assert(trie.search("app") === false, 'Test 2');
console.assert(trie.startsWith("app") === true, 'Test 3');
trie.insert("app");
console.assert(trie.search("app") === true, 'Test 4');
console.log('All tests passed!');`,
    testCases: `const t=new Trie();t.insert("apple");
console.assert(t.search("apple")===true,'T1');console.assert(t.search("app")===false,'T2');
console.assert(t.startsWith("app")===true,'T3');t.insert("app");console.assert(t.search("app")===true,'T4');`,
    tags: ["trie", "implementation"],
    order: 1,
    timeComplexity: "O(m) per operation where m = word length",
    spaceComplexity: "O(total characters inserted)",
    patternSentence:
      "The pattern to remember: each trie node is { children: {}, isEnd: false }. Walk character by character — insert creates nodes, search follows them.",
    solution: `class Trie {
  constructor() { this.root = { children: {}, isEnd: false }; }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = { children: {}, isEnd: false };
      node = node.children[ch];
    }
    node.isEnd = true;
  }
  search(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return node.isEnd;
  }
  startsWith(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return true;
  }
}`,
    solutionExplanation:
      "Insert: walk the trie creating nodes for missing characters, mark the last node as end. Search: walk the trie, return false if any character is missing, true only if we reach an end node. StartsWith: same as search but doesn't require isEnd.",
  },

  // === CORE ===
  {
    id: "trie-02",
    chapterId: 17,
    title: "Word Search II (Prefix Filtering)",
    difficulty: "core",
    description:
      "Given a list of words, find all words that are prefixes of other words in the list. Use a trie to efficiently check prefix relationships.",
    examples: [
      { input: '["apple","app","apricot","april","bat","bath"]', output: '["app","bat"]' },
    ],
    constraints: ["1 <= words.length <= 10^4"],
    starterCode: `function findPrefixWords(words) {
  // Return words that are prefixes of at least one other word
}

// Tests
const r1 = findPrefixWords(["apple","app","apricot","april","bat","bath"]);
console.assert(r1.includes("app"), 'Test 1: app is prefix of apple');
console.assert(r1.includes("bat"), 'Test 2: bat is prefix of bath');
console.assert(r1.length === 2, 'Test 3: exactly 2');
console.log('All tests passed!');`,
    testCases: `const r=findPrefixWords(["apple","app","apricot","april","bat","bath"]);
console.assert(r.includes("app")&&r.includes("bat")&&r.length===2,'T1');`,
    tags: ["trie", "prefix"],
    order: 2,
    timeComplexity: "O(total characters)",
    spaceComplexity: "O(total characters)",
    patternSentence:
      "The pattern to remember: insert all words into a trie, then check each word — if its end node has children, it's a prefix of another word.",
    solution: `function findPrefixWords(words) {
  const root = { children: {}, isEnd: false };
  // Insert all words
  for (const word of words) {
    let node = root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = { children: {}, isEnd: false };
      node = node.children[ch];
    }
    node.isEnd = true;
  }
  // Check which words are prefixes
  const result = [];
  for (const word of words) {
    let node = root;
    for (const ch of word) node = node.children[ch];
    if (Object.keys(node.children).length > 0) result.push(word);
  }
  return result;
}`,
    solutionExplanation:
      "Insert all words into a trie. For each word, navigate to its end node. If that node has children, other words continue past it — meaning this word is a prefix of another.",
  },
  {
    id: "trie-03",
    chapterId: 17,
    title: "Autocomplete System",
    difficulty: "core",
    description:
      "Build an autocomplete system. Given a dictionary of words, implement a function that takes a prefix and returns all words starting with that prefix, sorted alphabetically.",
    examples: [
      { input: 'dict=["apple","app","apricot","banana"], prefix="ap"', output: '["app","apple","apricot"]' },
    ],
    constraints: ["1 <= dict.length <= 10^4", "1 <= prefix.length <= 100"],
    starterCode: `class Autocomplete {
  constructor(words) {
    // Build trie from words
  }
  suggest(prefix) {
    // Return all words starting with prefix, sorted
  }
}

// Tests
const ac = new Autocomplete(["apple", "app", "apricot", "banana", "band"]);
console.assert(JSON.stringify(ac.suggest("ap")) === '["app","apple","apricot"]', 'Test 1');
console.assert(JSON.stringify(ac.suggest("ban")) === '["banana","band"]', 'Test 2');
console.assert(JSON.stringify(ac.suggest("xyz")) === '[]', 'Test 3');
console.log('All tests passed!');`,
    testCases: `const ac=new Autocomplete(["apple","app","apricot","banana","band"]);
console.assert(JSON.stringify(ac.suggest("ap"))==='["app","apple","apricot"]','T1');
console.assert(JSON.stringify(ac.suggest("xyz"))==='[]','T2');`,
    tags: ["trie", "autocomplete", "dfs"],
    order: 3,
    timeComplexity: "O(prefix + total matches)",
    spaceComplexity: "O(total characters)",
    patternSentence:
      "The pattern to remember: navigate to the prefix node in the trie, then DFS from there to collect all complete words — this is exactly how autocomplete works.",
    solution: `class Autocomplete {
  constructor(words) {
    this.root = { children: {}, isEnd: false };
    for (const word of words) {
      let node = this.root;
      for (const ch of word) {
        if (!node.children[ch]) node.children[ch] = { children: {}, isEnd: false };
        node = node.children[ch];
      }
      node.isEnd = true;
    }
  }
  suggest(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return [];
      node = node.children[ch];
    }
    const results = [];
    const dfs = (n, path) => {
      if (n.isEnd) results.push(path);
      for (const ch of Object.keys(n.children).sort()) {
        dfs(n.children[ch], path + ch);
      }
    };
    dfs(node, prefix);
    return results;
  }
}`,
    solutionExplanation:
      "Build a trie with all words. To suggest, walk to the prefix node, then DFS to find all complete words below it. Sort children alphabetically for sorted output.",
  },

  // === CHALLENGE ===
  {
    id: "trie-04",
    chapterId: 17,
    title: "Replace Words with Roots",
    difficulty: "challenge",
    description:
      "Given a dictionary of root words and a sentence, replace each word in the sentence with its shortest root. If a word has no root, leave it unchanged. Use a trie for efficient prefix matching.",
    examples: [
      { input: 'roots=["cat","bat","rat"], sentence="the cattle was rattled by the battery"', output: '"the cat was rat by the bat"' },
    ],
    constraints: ["1 <= roots.length <= 1000", "1 <= sentence.length <= 10^6"],
    starterCode: `function replaceWords(roots, sentence) {
  // Your code here
}

// Tests
console.assert(replaceWords(["cat","bat","rat"], "the cattle was rattled by the battery") === "the cat was rat by the bat", 'Test 1');
console.assert(replaceWords(["a","b","c"], "aadsfasf absbs bbab cadsfabd") === "a a b c", 'Test 2');
console.log('All tests passed!');`,
    testCases: `console.assert(replaceWords(["cat","bat","rat"],"the cattle was rattled by the battery")==="the cat was rat by the bat",'T1');`,
    tags: ["trie", "string"],
    order: 4,
    timeComplexity: "O(total characters in sentence)",
    spaceComplexity: "O(total characters in roots)",
    patternSentence:
      "The pattern to remember: build a trie of roots, then for each word walk the trie — the first isEnd node you hit is the shortest root replacement.",
    solution: `function replaceWords(roots, sentence) {
  const root = { children: {}, isEnd: false };
  for (const r of roots) {
    let node = root;
    for (const ch of r) {
      if (!node.children[ch]) node.children[ch] = { children: {}, isEnd: false };
      node = node.children[ch];
    }
    node.isEnd = true;
  }
  return sentence.split(" ").map(word => {
    let node = root;
    for (let i = 0; i < word.length; i++) {
      if (!node.children[word[i]]) return word;
      node = node.children[word[i]];
      if (node.isEnd) return word.slice(0, i + 1);
    }
    return word;
  }).join(" ");
}`,
    solutionExplanation:
      "Build a trie from root words. For each word in the sentence, walk the trie character by character. If you reach an isEnd node, replace the word with the prefix up to that point. If no root matches, keep the original word.",
  },
];
