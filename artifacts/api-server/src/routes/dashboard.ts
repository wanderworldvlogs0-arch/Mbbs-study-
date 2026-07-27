import { Router, type IRouter } from "express";
import { eq, and, inArray, sql } from "drizzle-orm";
import { db, dailyActivityTable } from "@workspace/db";
import { AddStudyTimeBody, IncrementGoalBody } from "@workspace/api-zod";
import { requireAuth } from "../middlewares/require-auth";
import {
  DAILY_GOAL_TARGETS,
  todayDateString,
  last7Days,
} from "../lib/dashboard";

const router: IRouter = Router();
router.use(requireAuth);

async function buildSummary(userId: string, name: string) {
  const days = last7Days();
  const today = days[days.length - 1]!;

  const [weekRows, [allTime]] = await Promise.all([
    db
      .select()
      .from(dailyActivityTable)
      .where(
        and(
          eq(dailyActivityTable.userId, userId),
          inArray(dailyActivityTable.date, days),
        ),
      ),
    db
      .select({
        total: sql<number>`coalesce(sum(${dailyActivityTable.secondsStudied}), 0)`,
      })
      .from(dailyActivityTable)
      .where(eq(dailyActivityTable.userId, userId)),
  ]);

  const byDate = new Map(weekRows.map((r) => [r.date, r]));
  const todayRow = byDate.get(today);
  const weekStudySeconds = weekRows.reduce((sum, r) => sum + r.secondsStudied, 0);

  return {
    name,
    streakDays: days.map((d) => {
      const r = byDate.get(d);
      return !!r && (r.secondsStudied > 0 || r.chaptersDone > 0 || r.mcqsDone > 0 || r.videosDone > 0);
    }),
    totalStudySeconds: Number(allTime?.total ?? 0),
    weekStudySeconds,
    todayStudySeconds: todayRow?.secondsStudied ?? 0,
    goals: {
      chapters: { current: todayRow?.chaptersDone ?? 0, target: DAILY_GOAL_TARGETS.chapters },
      mcqs: { current: todayRow?.mcqsDone ?? 0, target: DAILY_GOAL_TARGETS.mcqs },
      videos: { current: todayRow?.videosDone ?? 0, target: DAILY_GOAL_TARGETS.videos },
    },
  };
}

router.get("/dashboard/summary", async (req, res) => {
  const summary = await buildSummary(req.user!.id, req.user!.name);
  res.json(summary);
});

router.post("/dashboard/study-time", async (req, res) => {
  const parsed = AddStudyTimeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }

  const userId = req.user!.id;
  const today = todayDateString();

  await db
    .insert(dailyActivityTable)
    .values({ userId, date: today, secondsStudied: parsed.data.seconds })
    .onConflictDoUpdate({
      target: [dailyActivityTable.userId, dailyActivityTable.date],
      set: {
        secondsStudied: sql`${dailyActivityTable.secondsStudied} + ${parsed.data.seconds}`,
      },
    });

  res.json(await buildSummary(userId, req.user!.name));
});

const GOAL_COLUMN = {
  chapters: dailyActivityTable.chaptersDone,
  mcqs: dailyActivityTable.mcqsDone,
  videos: dailyActivityTable.videosDone,
} as const;

router.post("/dashboard/goals/increment", async (req, res) => {
  const parsed = IncrementGoalBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }

  const userId = req.user!.id;
  const today = todayDateString();
  const { type } = parsed.data;

  const values: Record<string, unknown> = { userId, date: today };
  values[
    type === "chapters" ? "chaptersDone" : type === "mcqs" ? "mcqsDone" : "videosDone"
  ] = 1;

  await db
    .insert(dailyActivityTable)
    .values(values as typeof dailyActivityTable.$inferInsert)
    .onConflictDoUpdate({
      target: [dailyActivityTable.userId, dailyActivityTable.date],
      set: { [type === "chapters" ? "chaptersDone" : type === "mcqs" ? "mcqsDone" : "videosDone"]: sql`${GOAL_COLUMN[type]} + 1` },
    });

  res.json(await buildSummary(userId, req.user!.name));
});

export default router;
