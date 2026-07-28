import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, pdfsTable, subjectsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/require-auth";

const router: IRouter = Router();
router.use(requireAuth);

router.get("/pdfs", async (req, res) => {
  const { subjectId } = req.query;

  const base = db
    .select({
      id: pdfsTable.id,
      subjectId: pdfsTable.subjectId,
      subjectName: subjectsTable.name,
      chapterId: pdfsTable.chapterId,
      title: pdfsTable.title,
      url: pdfsTable.url,
      pageCount: pdfsTable.pageCount,
    })
    .from(pdfsTable)
    .innerJoin(subjectsTable, eq(pdfsTable.subjectId, subjectsTable.id));

  const rows =
    typeof subjectId === "string"
      ? await base.where(eq(pdfsTable.subjectId, subjectId)).orderBy(pdfsTable.orderIndex)
      : await base.orderBy(pdfsTable.subjectId, pdfsTable.orderIndex);

  res.json(rows);
});

export default router;
