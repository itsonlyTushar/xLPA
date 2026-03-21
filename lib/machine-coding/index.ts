import { mcChapters } from "./chapters";
import { uiComponentProblems } from "./problems/ui-components";
import { formProblems } from "./problems/form-input";
import { dataDisplayProblems } from "./problems/data-display";
import { interactiveWidgetProblems } from "./problems/interactive-widgets";
import { appFeatureProblems } from "./problems/app-features";
import { hooksStateProblems } from "./problems/hooks-state";
import { MCProblem } from "./types";

export { mcChapters };

const allProblems: MCProblem[] = [
  ...uiComponentProblems,
  ...formProblems,
  ...dataDisplayProblems,
  ...interactiveWidgetProblems,
  ...appFeatureProblems,
  ...hooksStateProblems,
];

export function getMCChapter(id: number) {
  return mcChapters.find((c) => c.id === id);
}

export function getMCChapterBySlug(slug: string) {
  return mcChapters.find((c) => c.slug === slug);
}

export function getMCProblemsForChapter(chapterId: number): MCProblem[] {
  return allProblems
    .filter((p) => p.chapterId === chapterId)
    .sort((a, b) => a.order - b.order);
}

export function getMCProblem(id: string): MCProblem | undefined {
  return allProblems.find((p) => p.id === id);
}

export function getTotalMCProblems(): number {
  return allProblems.length;
}

export function getNextMCProblem(currentId: string): MCProblem | undefined {
  const current = getMCProblem(currentId);
  if (!current) return undefined;
  const chapterProblems = getMCProblemsForChapter(current.chapterId);
  const idx = chapterProblems.findIndex((p) => p.id === currentId);
  if (idx < chapterProblems.length - 1) return chapterProblems[idx + 1];
  const nextChapter = mcChapters.find((c) => c.id === current.chapterId + 1);
  if (nextChapter) {
    const next = getMCProblemsForChapter(nextChapter.id);
    if (next.length > 0) return next[0];
  }
  return undefined;
}

export function getPreviousMCProblem(currentId: string): MCProblem | undefined {
  const current = getMCProblem(currentId);
  if (!current) return undefined;
  const chapterProblems = getMCProblemsForChapter(current.chapterId);
  const idx = chapterProblems.findIndex((p) => p.id === currentId);
  if (idx > 0) return chapterProblems[idx - 1];
  const prevChapter = mcChapters.find((c) => c.id === current.chapterId - 1);
  if (prevChapter) {
    const prev = getMCProblemsForChapter(prevChapter.id);
    if (prev.length > 0) return prev[prev.length - 1];
  }
  return undefined;
}
