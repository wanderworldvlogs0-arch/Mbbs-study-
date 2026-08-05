import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, videosTable, subjectsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/require-auth";

const router: IRouter = Router();
router.use(requireAuth);

router.get("/videos", async (req, res) => {
  const { subjectId, chapterId } = req.query;

  const base = db
    .select({
      id: videosTable.id,
      subjectId: videosTable.subjectId,
      subjectName: subjectsTable.name,
      chapterId: videosTable.chapterId,
      title: videosTable.title,
      url: videosTable.url,
      durationMinutes: videosTable.durationMinutes,
    })
    .from(videosTable)
    .innerJoin(subjectsTable, eq(videosTable.subjectId, subjectsTable.id));

  const rows =
    typeof subjectId === "string" && typeof chapterId === "string"
      ? await base.where(and(eq(videosTable.subjectId, subjectId), eq(videosTable.chapterId, chapterId))).orderBy(videosTable.orderIndex)
      : typeof subjectId === "string"
      ? await base.where(eq(videosTable.subjectId, subjectId)).orderBy(videosTable.orderIndex)
      : await base.orderBy(videosTable.subjectId, videosTable.orderIndex);

  res.json(rows);
});

export default router;
