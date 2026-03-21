import { sdChapters } from "./chapters";
import { fundamentalsTopics } from "./topics/fundamentals";
import { networkingTopics } from "./topics/networking";
import { databaseTopics } from "./topics/databases";
import { cachingTopics } from "./topics/caching";
import { messageQueueTopics } from "./topics/message-queues";
import { loadBalancingTopics } from "./topics/load-balancing";
import { storageTopics } from "./topics/storage";
import { caseStudies } from "./topics/case-studies";
import { SDTopic, CaseStudy } from "./types";

export { sdChapters };

const allTopics: SDTopic[] = [
  ...fundamentalsTopics,
  ...networkingTopics,
  ...databaseTopics,
  ...cachingTopics,
  ...messageQueueTopics,
  ...loadBalancingTopics,
  ...storageTopics,
];

const allCaseStudies: CaseStudy[] = [...caseStudies];

export function getSDChapter(id: number) {
  return sdChapters.find((c) => c.id === id);
}

export function getSDChapterBySlug(slug: string) {
  return sdChapters.find((c) => c.slug === slug);
}

export function getTopicsForChapter(chapterId: number): SDTopic[] {
  return allTopics
    .filter((t) => t.chapterId === chapterId)
    .sort((a, b) => a.order - b.order);
}

export function getSDTopic(id: string): SDTopic | undefined {
  return allTopics.find((t) => t.id === id);
}

export function getCaseStudiesForChapter(chapterId: number): CaseStudy[] {
  return allCaseStudies
    .filter((cs) => cs.chapterId === chapterId)
    .sort((a, b) => a.order - b.order);
}

export function getCaseStudy(id: string): CaseStudy | undefined {
  return allCaseStudies.find((cs) => cs.id === id);
}

export function getTotalSDTopics(): number {
  return allTopics.length;
}

export function getTotalCaseStudies(): number {
  return allCaseStudies.length;
}

export function getNextTopic(currentId: string): SDTopic | undefined {
  const current = getSDTopic(currentId);
  if (!current) return undefined;
  const chapterTopics = getTopicsForChapter(current.chapterId);
  const idx = chapterTopics.findIndex((t) => t.id === currentId);
  if (idx < chapterTopics.length - 1) return chapterTopics[idx + 1];
  // First topic of next chapter (skip case studies chapter)
  const nextChapter = sdChapters.find(
    (c) => c.id === current.chapterId + 1 && c.id !== 8
  );
  if (nextChapter) {
    const next = getTopicsForChapter(nextChapter.id);
    if (next.length > 0) return next[0];
  }
  return undefined;
}

export function getPreviousTopic(currentId: string): SDTopic | undefined {
  const current = getSDTopic(currentId);
  if (!current) return undefined;
  const chapterTopics = getTopicsForChapter(current.chapterId);
  const idx = chapterTopics.findIndex((t) => t.id === currentId);
  if (idx > 0) return chapterTopics[idx - 1];
  // Last topic of previous chapter
  const prevChapter = sdChapters.find(
    (c) => c.id === current.chapterId - 1 && c.id !== 8
  );
  if (prevChapter) {
    const prev = getTopicsForChapter(prevChapter.id);
    if (prev.length > 0) return prev[prev.length - 1];
  }
  return undefined;
}
