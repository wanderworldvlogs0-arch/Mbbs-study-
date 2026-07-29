import { Router, type IRouter } from "express";
import { eq, and, sql, desc, isNotNull } from "drizzle-orm";
import {
  db,
  subjectsTable,
  mcqsTable,
  quizAttemptsTable,
  quizAnswersTable,
  usersTable,
  dailyActivityTable,
} from "@workspace/db";
import { requireAuth } from "../middlewares/require-auth";
import { todayDateString } from "../lib/dashboard";

const router: IRouter = Router();
router.use(requireAuth);

const PASS_THRESHOLD = 50; // percent

// List subjects that actually have MCQs, with counts.
router.get("/quiz/subjects", async (_req, res) => {
  const rows = await db
    .select({
      id: subjectsTable.id,
      name: subjectsTable.name,
      theme: subjectsTable.theme,
      icon: subjectsTable.icon,
      mcqCount: sql<number>`count(${mcqsTable.id})`.mapWith(Number),
    })
    .from(subjectsTable)
    .leftJoin(mcqsTable, eq(mcqsTable.subjectId, subjectsTable.id))
    .groupBy(subjectsTable.id);

  res.json(rows);
});

// Start a quiz: pick up to `count` random MCQs for a subject.
router.post("/quiz/start", async (req, res) => {
  const userId = req.user!.id;
  const { subjectId, count } = req.body as { subjectId?: string; count?: number };

  if (!subjectId) {
    res.status(400).json({ message: "subjectId is required" });
    return;
  }

  const [subject] = await db
    .select()
    .from(subjectsTable)
    .where(eq(subjectsTable.id, subjectId))
    .limit(1);

  if (!subject) {
    res.status(404).json({ message: "Subject not found" });
    return;
  }

  const limit = count && count > 0 ? Math.min(count, 50) : 10;

  const questions = await db
    .select()
    .from(mcqsTable)
    .where(eq(mcqsTable.subjectId, subjectId))
    .orderBy(sql`random()`)
    .limit(limit);

  if (questions.length === 0) {
    res.status(404).json({ message: "No questions available for this subject yet" });
    return;
  }

  const [attempt] = await db
    .insert(quizAttemptsTable)
    .values({ userId, subjectId, totalQuestions: questions.length })
    .returning();

  res.json({
    attemptId: attempt!.id,
    subjectId,
    subjectName: subject.name,
    questions: questions.map((q) => ({
      mcqId: q.id,
      questionText: q.questionText,
      options: q.options,
    })),
  });
});

// Save/update an answer for one question in an in-progress attempt.
router.put("/quiz/:attemptId/answer", async (req, res) => {
  const userId = req.user!.id;
  const { attemptId } = req.params;
  const { mcqId, selectedOptionId } = req.body as {
    mcqId?: string;
    selectedOptionId?: string | null;
  };

  if (!mcqId) {
    res.status(400).json({ message: "mcqId is required" });
    return;
  }

  const [attempt] = await db
    .select()
    .from(quizAttemptsTable)
    .where(and(eq(quizAttemptsTable.id, attemptId), eq(quizAttemptsTable.userId, userId)))
    .limit(1);

  if (!attempt || attempt.submittedAt) {
    res.status(404).json({ message: "Active attempt not found" });
    return;
  }

  const [mcq] = await db.select().from(mcqsTable).where(eq(mcqsTable.id, mcqId)).limit(1);
  if (!mcq) {
    res.status(404).json({ message: "Question not found" });
    return;
  }

  const isCorrect = selectedOptionId != null && selectedOptionId === mcq.correctOptionId;

  await db
    .insert(quizAnswersTable)
    .values({ attemptId, mcqId, selectedOptionId: selectedOptionId ?? null, isCorrect })
    .onConflictDoUpdate({
      target: [quizAnswersTable.attemptId, quizAnswersTable.mcqId],
      set: { selectedOptionId: selectedOptionId ?? null, isCorrect },
    });

  res.json({ ok: true });
});

// Submit the attempt: score it, update daily activity, return full review.
router.post("/quiz/:attemptId/submit", async (req, res) => {
  const userId = req.user!.id;
  const { attemptId } = req.params;

  const [attempt] = await db
    .select()
    .from(quizAttemptsTable)
    .where(and(eq(quizAttemptsTable.id, attemptId), eq(quizAttemptsTable.userId, userId)))
    .limit(1);

  if (!attempt) {
    res.status(404).json({ message: "Attempt not found" });
    return;
  }

  const [subject] = await db
    .select()
    .from(subjectsTable)
    .where(eq(subjectsTable.id, attempt.subjectId))
    .limit(1);

  const answers = await db
    .select()
    .from(quizAnswersTable)
    .where(eq(quizAnswersTable.attemptId, attemptId));

  const mcqIds = answers.map((a) => a.mcqId);
  const mcqs = mcqIds.length
    ? await db.select().from(mcqsTable).where(sql`${mcqsTable.id} = ANY(${mcqIds})`)
    : [];
  const mcqById = new Map(mcqs.map((m) => [m.id, m]));

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const accuracyPercent = attempt.totalQuestions
    ? Math.round((correctCount / attempt.totalQuestions) * 100)
    : 0;

  if (!attempt.submittedAt) {
    await db
      .update(quizAttemptsTable)
      .set({ correctCount, submittedAt: new Date() })
      .where(eq(quizAttemptsTable.id, attemptId));

    const today = todayDateString();
    await db
      .insert(dailyActivityTable)
      .values({ userId, date: today, mcqsDone: attempt.totalQuestions })
      .onConflictDoUpdate({
        target: [dailyActivityTable.userId, dailyActivityTable.date],
        set: { mcqsDone: sql`${dailyActivityTable.mcqsDone} + ${attempt.totalQuestions}` },
      });
  }

  res.json({
    attemptId,
    subjectName: subject?.name ?? "",
    totalQuestions: attempt.totalQuestions,
    correctCount,
    accuracyPercent,
    passed: accuracyPercent >= PASS_THRESHOLD,
    answers: answers.map((a) => {
      const mcq = mcqById.get(a.mcqId);
      return {
        mcqId: a.mcqId,
        questionText: mcq?.questionText ?? "",
        options: mcq?.options ?? [],
        correctOptionId: mcq?.correctOptionId ?? "",
        selectedOptionId: a.selectedOptionId,
        isCorrect: a.isCorrect,
        explanation: mcq?.explanation ?? null,
      };
    }),
  });
});

// Recent quiz history for the current user.
router.get("/quiz/recent", async (req, res) => {
  const userId = req.user!.id;

  const rows = await db
    .select({
      attemptId: quizAttemptsTable.id,
      subjectName: subjectsTable.name,
      correctCount: quizAttemptsTable.correctCount,
      totalQuestions: quizAttemptsTable.totalQuestions,
      submittedAt: quizAttemptsTable.submittedAt,
    })
    .from(quizAttemptsTable)
    .innerJoin(subjectsTable, eq(subjectsTable.id, quizAttemptsTable.subjectId))
    .where(and(eq(quizAttemptsTable.userId, userId), isNotNull(quizAttemptsTable.submittedAt)))
    .orderBy(desc(quizAttemptsTable.submittedAt))
    .limit(5);

  res.json(
    rows.map((r) => {
      const accuracyPercent = r.totalQuestions
        ? Math.round((r.correctCount / r.totalQuestions) * 100)
        : 0;
      return {
        attemptId: r.attemptId,
        subjectName: r.subjectName,
        correctCount: r.correctCount,
        totalQuestions: r.totalQuestions,
        accuracyPercent,
        passed: accuracyPercent >= PASS_THRESHOLD,
        submittedAt: r.submittedAt,
      };
    }),
  );
});

// Global leaderboard: total correct answers across all submitted attempts.
router.get("/quiz/leaderboard", async (req, res) => {
  const userId = req.user!.id;

  const rows = await db
    .select({
      userId: usersTable.id,
      name: usersTable.name,
      totalCorrect: sql<number>`coalesce(sum(${quizAttemptsTable.correctCount}), 0)`.mapWith(Number),
    })
    .from(usersTable)
    .leftJoin(
      quizAttemptsTable,
      and(eq(quizAttemptsTable.userId, usersTable.id), isNotNull(quizAttemptsTable.submittedAt)),
    )
    .groupBy(usersTable.id)
    .orderBy(desc(sql`coalesce(sum(${quizAttemptsTable.correctCount}), 0)`))
    .limit(10);

  res.json(
    rows.map((r, i) => ({
      rank: i + 1,
      userId: r.userId,
      name: r.name,
      totalCorrect: r.totalCorrect,
      isUser: r.userId === userId,
    })),
  );
});

export default router;
