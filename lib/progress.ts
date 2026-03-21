import { supabase } from "./supabase";

export async function recordAttempt(
  userId: string,
  problemId: string,
  chapterId: number,
  code: string,
  passed: boolean,
  usedHint: boolean,
  timeTakenMs: number
) {
  const { error } = await supabase.from("attempts").insert({
    user_id: userId,
    problem_id: problemId,
    chapter_id: chapterId,
    code,
    passed,
    used_hint: usedHint,
    time_taken_ms: timeTakenMs,
  });

  if (error) {
    console.error("Failed to record attempt:", error);
    return;
  }

  if (passed) {
    await updateProgress(userId, chapterId);
    await updateStreak(userId);
  }
}

async function updateProgress(userId: string, chapterId: number) {
  // Count distinct passed problems for this chapter
  const { data: passedProblems } = await supabase
    .from("attempts")
    .select("problem_id")
    .eq("user_id", userId)
    .eq("chapter_id", chapterId)
    .eq("passed", true);

  const uniquePassed = new Set(passedProblems?.map((a) => a.problem_id)).size;

  // Count hints used
  const { data: hintAttempts } = await supabase
    .from("attempts")
    .select("problem_id, used_hint")
    .eq("user_id", userId)
    .eq("chapter_id", chapterId)
    .eq("passed", true);

  const hintsUsed = hintAttempts?.filter((a) => a.used_hint).length ?? 0;
  const totalPassed = hintAttempts?.length ?? 1;
  const hintRate = (hintsUsed / totalPassed) * 100;

  // Upsert progress
  await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      chapter_id: chapterId,
      problems_solved: uniquePassed,
      mastery_percentage: uniquePassed, // Will be computed as % on the frontend
      hint_dependency_rate: Math.round(hintRate * 100) / 100,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,chapter_id" }
  );
}

async function updateStreak(userId: string) {
  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!existing) {
    await supabase.from("streaks").insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_solved_date: today,
    });
    return;
  }

  const lastDate = existing.last_solved_date;
  if (lastDate === today) return; // Already solved today

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let newStreak: number;
  if (lastDate === yesterdayStr) {
    newStreak = existing.current_streak + 1;
  } else {
    newStreak = 1;
  }

  await supabase
    .from("streaks")
    .update({
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, existing.longest_streak),
      last_solved_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);
}

export async function scheduleSpacedRepetition(
  userId: string,
  problemId: string
) {
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + 2); // First review in 2 days

  await supabase.from("spaced_repetition").upsert(
    {
      user_id: userId,
      problem_id: problemId,
      next_review_date: nextReview.toISOString().split("T")[0],
      interval_days: 2,
      review_count: 0,
    },
    { onConflict: "user_id,problem_id" }
  );
}

export async function advanceSpacedRepetition(
  userId: string,
  problemId: string
) {
  const { data } = await supabase
    .from("spaced_repetition")
    .select("*")
    .eq("user_id", userId)
    .eq("problem_id", problemId)
    .single();

  if (!data) return;

  // Intervals: 2 → 7 → 14
  const intervals = [2, 7, 14];
  const nextIndex = Math.min(data.review_count, intervals.length - 1);
  const nextInterval = intervals[nextIndex];

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + nextInterval);

  await supabase
    .from("spaced_repetition")
    .update({
      next_review_date: nextReview.toISOString().split("T")[0],
      interval_days: nextInterval,
      review_count: data.review_count + 1,
    })
    .eq("user_id", userId)
    .eq("problem_id", problemId);
}
