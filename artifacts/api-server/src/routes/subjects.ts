import { Router, type IRouter } from "express";
import { eq, inArray, and, sql } from "drizzle-orm";
import {
  db,
  subjectsTable,
  chaptersTable,
  userChapterProgressTable,
  dailyActivityTable,
} from "@workspace/db";
import { UpdateProgressBody } from "@workspace/api-zod";
import { requireAuth } from "../middlewares/require-auth";
import { todayDateString } from "../lib/dashboard";

const router: IRouter = Router();
router.use(requireAuth);

router.get("/subjects", async (req, res) => {
  const userId = req.user!.id;

  const [subjects, chapters, progress] = await Promise.all([
    db.select().from(subjectsTable),
    db.select().from(chaptersTable),
    db
      .select()
      .from(userChapterProgressTable)
      .where(eq(userChapterProgressTable.userId, userId)),
  ]);

  const progressByChapter = new Map(
    progress.map((p) => [p.chapterId, p.progressPercent]),
  );

  const chaptersBySubject = new Map<string, number[]>();
  for (const ch of chapters) {
    const pct = progressByChapter.get(ch.id) ?? 0;
    const list = chaptersBySubject.get(ch.subjectId) ?? [];
    list.push(pct);
    chaptersBySubject.set(ch.subjectId, list);
  }

  const result = subjects.map((s) => {
    const pcts = chaptersBySubject.get(s.id) ?? [];
    const progressPercent =
      pcts.length === 0
        ? 0
        : Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
    return { ...s, progressPercent };
  });

  res.json(result);
});

router.get("/subjects/:subjectId", async (req, res) => {
  const userId = req.user!.id;
  const { subjectId } = req.params;

  const [subject] = await db
    .select()
    .from(subjectsTable)
    .where(eq(subjectsTable.id, subjectId))
    .limit(1);

  if (!subject) {
    res.status(404).json({ message: "Subject not found" });
    return;
  }

  const chapters = await db
    .select()
    .from(chaptersTable)
    .where(eq(chaptersTable.subjectId, subjectId))
    .orderBy(chaptersTable.orderIndex);

  const chapterIds = chapters.map((c) => c.id);
  const progress = chapterIds.length
    ? await db
        .select()
        .from(userChapterProgressTable)
        .where(
          and(
            eq(userChapterProgressTable.userId, userId),
            inArray(userChapterProgressTable.chapterId, chapterIds),
          ),
        )
    : [];
  const progressByChapter = new Map(
    progress.map((p) => [p.chapterId, p.progressPercent]),
  );

  const chaptersWithProgress = chapters.map((c) => ({
    ...c,
    progressPercent: progressByChapter.get(c.id) ?? 0,
  }));

  const progressPercent =
    chaptersWithProgress.length === 0
      ? 0
      : Math.round(
          chaptersWithProgress.reduce((a, c) => a + c.progressPercent, 0) /
            chaptersWithProgress.length,
        );

  res.json({ ...subject, progressPercent, chapters: chaptersWithProgress });
});

router.put(
  "/subjects/:subjectId/chapters/:chapterId/progress",
  async (req, res) => {
    const userId = req.user!.id;
    const { subjectId, chapterId } = req.params;

    const parsed = UpdateProgressBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }
    const { progressPercent } = parsed.data;

    const [chapter] = await db
      .select()
      .from(chaptersTable)
      .where(
        and(
          eq(chaptersTable.id, chapterId),
          eq(chaptersTable.subjectId, subjectId),
        ),
      )
      .limit(1);

    if (!chapter) {
      res.status(404).json({ message: "Chapter not found" });
      return;
    }

    const [existing] = await db
      .select()
      .from(userChapterProgressTable)
      .where(
        and(
          eq(userChapterProgressTable.userId, userId),
          eq(userChapterProgressTable.chapterId, chapterId),
        ),
      )
      .limit(1);

    await db
      .insert(userChapterProgressTable)
      .values({ userId, chapterId, progressPercent })
      .onConflictDoUpdate({
        target: [
          userChapterProgressTable.userId,
          userChapterProgressTable.chapterId,
        ],
        set: { progressPercent, updatedAt: new Date() },
      });

    // Count the chapter toward today's "chapters" goal the first time it's
    // marked complete.
    if (progressPercent >= 100 && (existing?.progressPercent ?? 0) < 100) {
      const today = todayDateString();
      await db
        .insert(dailyActivityTable)
        .values({ userId, date: today, chaptersDone: 1 })
        .onConflictDoUpdate({
          target: [dailyActivityTable.userId, dailyActivityTable.date],
          set: { chaptersDone: sql`${dailyActivityTable.chaptersDone} + 1` },
        });
    }

    res.json({ ...chapter, progressPercent });
  },
);

export default router;
