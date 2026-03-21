import { arrayProblems } from "./problems/arrays";
import { linearSearchProblems } from "./problems/linear-search";
import { binarySearchProblems } from "./problems/binary-search";
import { sortingProblems } from "./problems/sorting";
import { hashMapProblems } from "./problems/hashmap";
import { recursionProblems } from "./problems/recursion";
import { backtrackingProblems } from "./problems/backtracking";
import { stringProblems } from "./problems/strings";
import { linkedListProblems } from "./problems/linked-lists";
import { stackProblems } from "./problems/stacks";
import { queueProblems } from "./problems/queues";
import { treeProblems } from "./problems/trees";
import { heapProblems } from "./problems/heaps";
import { graphProblems } from "./problems/graphs";
import { dpProblems } from "./problems/dynamic-programming";
import { greedyProblems } from "./problems/greedy";
import { trieProblems } from "./problems/tries";
import { bitManipulationProblems } from "./problems/bit-manipulation";
import { chapters } from "./chapters";
import { Problem } from "../types";

export { chapters };

const allProblems: Problem[] = [
  ...arrayProblems,
  ...linearSearchProblems,
  ...binarySearchProblems,
  ...sortingProblems,
  ...hashMapProblems,
  ...recursionProblems,
  ...backtrackingProblems,
  ...stringProblems,
  ...linkedListProblems,
  ...stackProblems,
  ...queueProblems,
  ...treeProblems,
  ...heapProblems,
  ...graphProblems,
  ...dpProblems,
  ...greedyProblems,
  ...trieProblems,
  ...bitManipulationProblems,
];

export function getChapter(id: number) {
  return chapters.find((c) => c.id === id);
}

export function getChapterBySlug(slug: string) {
  return chapters.find((c) => c.slug === slug);
}

export function getProblemsForChapter(chapterId: number): Problem[] {
  return allProblems
    .filter((p) => p.chapterId === chapterId)
    .sort((a, b) => a.order - b.order);
}

export function getProblem(id: string): Problem | undefined {
  return allProblems.find((p) => p.id === id);
}

export function getTotalProblems(): number {
  return allProblems.length;
}

export function getNextProblem(currentId: string): Problem | undefined {
  const current = getProblem(currentId);
  if (!current) return undefined;
  const chapterProblems = getProblemsForChapter(current.chapterId);
  const currentIndex = chapterProblems.findIndex((p) => p.id === currentId);
  if (currentIndex < chapterProblems.length - 1) {
    return chapterProblems[currentIndex + 1];
  }
  // First problem of next chapter
  const nextChapter = chapters.find((c) => c.id === current.chapterId + 1);
  if (nextChapter) {
    const nextProblems = getProblemsForChapter(nextChapter.id);
    if (nextProblems.length > 0) return nextProblems[0];
  }
  return undefined;
}

export function getPreviousProblem(currentId: string): Problem | undefined {
  const current = getProblem(currentId);
  if (!current) return undefined;
  const chapterProblems = getProblemsForChapter(current.chapterId);
  const currentIndex = chapterProblems.findIndex((p) => p.id === currentId);
  if (currentIndex > 0) {
    return chapterProblems[currentIndex - 1];
  }
  return undefined;
}
