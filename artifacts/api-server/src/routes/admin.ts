import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  db,
  videosTable,
  pdfsTable,
  flashcardsTable,
  mcqsTable,
  chaptersTable,
} from "@workspace/db";
import { requireAuth } from "../middlewares/require-auth";
import { requireAdmin } from "../middlewares/require-admin";

const router: IRouter = Router();
router.use(requireAuth);
router.use(requireAdmin);

// Lets the frontend know the signed-in user is allowed to see the Admin
// Panel link / page. If this 403s, the caller isn't an admin.
router.get("/admin/check", (_req, res) => {
  res.json({ isAdmin: true });
});

// Everything currently uploaded for one subject, so the admin can review
// and delete entries. Kept as one call so the Admin page loads in one shot.
router.get("/admin/content", async (req, res) => {
  const { subjectId } = req.query;
  if (typeof subjectId !== "string" || !subjectId) {
    res.status(400).json({ message: "subjectId is required" });
    return;
  }

  const [videos, pdfs, flashcards, mcqs, chapters] = await Promise.all([
    db.select().from(videosTable).where(eq(videosTable.subjectId, subjectId)),
    db.select().from(pdfsTable).where(eq(pdfsTable.subjectId, subjectId)),
    db
      .select()
      .from(flashcardsTable)
      .where(eq(flashcardsTable.subjectId, subjectId)),
    db.select().from(mcqsTable).where(eq(mcqsTable.subjectId, subjectId)),
    db
      .select()
      .from(chaptersTable)
      .where(eq(chaptersTable.subjectId, subjectId))
      .orderBy(chaptersTable.orderIndex),
  ]);

  res.json({ videos, pdfs, flashcards, mcqs, chapters });
});

// ---------------- Chapters ----------------
router.post("/admin/chapters", async (req, res) => {
  const { subjectId, title, subChapterCount, estimatedMinutes } = req.body as {
    subjectId?: string;
    title?: string;
    subChapterCount?: number;
    estimatedMinutes?: number;
  };

  if (!subjectId || !title) {
    res.status(400).json({ message: "subjectId and title are required" });
    return;
  }

  const existing = await db
    .select()
    .from(chaptersTable)
    .where(eq(chaptersTable.subjectId, subjectId));

  const [chapter] = await db
    .insert(chaptersTable)
    .values({
      subjectId,
      title,
      orderIndex: existing.length,
      subChapterCount: subChapterCount ?? 0,
      estimatedMinutes: estimatedMinutes ?? 0,
    })
    .returning();

  res.status(201).json(chapter);
});

router.delete("/admin/chapters/:id", async (req, res) => {
  await db.delete(chaptersTable).where(eq(chaptersTable.id, req.params.id));
  res.status(204).end();
});

// ---------------- Videos ----------------
router.post("/admin/videos", async (req, res) => {
  const { subjectId, chapterId, title, url, durationMinutes } = req.body as {
    subjectId?: string;
    chapterId?: string;
    title?: string;
    url?: string;
    durationMinutes?: number;
  };

  if (!subjectId || !title || !url) {
    res.status(400).json({ message: "subjectId, title and url are required" });
    return;
  }

  const [video] = await db
    .insert(videosTable)
    .values({
      subjectId,
      chapterId: chapterId || null,
      title,
      url,
      durationMinutes: durationMinutes ?? 0,
    })
    .returning();

  res.status(201).json(video);
});

router.delete("/admin/videos/:id", async (req, res) => {
  await db.delete(videosTable).where(eq(videosTable.id, req.params.id));
  res.status(204).end();
});

// ---------------- PDFs (notes + PYQs) ----------------
router.post("/admin/pdfs", async (req, res) => {
  const { subjectId, chapterId, title, url, pageCount, category, year } = req.body as {
    subjectId?: string;
    chapterId?: string;
    title?: string;
    url?: string;
    pageCount?: number;
    category?: "notes" | "pyq";
    year?: string;
  };

  if (!subjectId || !title || !url) {
    res.status(400).json({ message: "subjectId, title and url are required" });
    return;
  }

  const [pdf] = await db
    .insert(pdfsTable)
    .values({
      subjectId,
      chapterId: chapterId || null,
      title,
      url,
      pageCount: pageCount ?? 0,
      category: category === "pyq" ? "pyq" : "notes",
      year: category === "pyq" ? (year ?? null) : null,
    })
    .returning();

  res.status(201).json(pdf);
});

router.delete("/admin/pdfs/:id", async (req, res) => {
  await db.delete(pdfsTable).where(eq(pdfsTable.id, req.params.id));
  res.status(204).end();
});

// ---------------- Flashcards ----------------
router.post("/admin/flashcards", async (req, res) => {
  const { subjectId, chapterId, front, back, mnemonic, reference } = req.body as {
    subjectId?: string;
    chapterId?: string;
    front?: string;
    back?: string;
    mnemonic?: string;
    reference?: string;
  };

  if (!subjectId || !front || !back) {
    res.status(400).json({ message: "subjectId, front and back are required" });
    return;
  }

  const [flashcard] = await db
    .insert(flashcardsTable)
    .values({
      subjectId,
      chapterId: chapterId || null,
      front,
      back,
      mnemonic: mnemonic || null,
      reference: reference || null,
    })
    .returning();

  res.status(201).json(flashcard);
});

router.delete("/admin/flashcards/:id", async (req, res) => {
  await db.delete(flashcardsTable).where(eq(flashcardsTable.id, req.params.id));
  res.status(204).end();
});

// ---------------- MCQs (also power Quiz) ----------------
router.post("/admin/mcqs", async (req, res) => {
  const { subjectId, chapterId, questionText, options, correctOptionId, explanation } =
    req.body as {
      subjectId?: string;
      chapterId?: string;
      questionText?: string;
      options?: { id: string; text: string }[];
      correctOptionId?: string;
      explanation?: string;
    };

  if (
    !subjectId ||
    !questionText ||
    !options ||
    options.length < 2 ||
    !correctOptionId
  ) {
    res.status(400).json({
      message:
        "subjectId, questionText, at least 2 options and correctOptionId are required",
    });
    return;
  }

  const [mcq] = await db
    .insert(mcqsTable)
    .values({
      subjectId,
      chapterId: chapterId || null,
      questionText,
      options,
      correctOptionId,
      explanation: explanation || null,
    })
    .returning();

  res.status(201).json(mcq);
});

router.delete("/admin/mcqs/:id", async (req, res) => {
  await db.delete(mcqsTable).where(eq(mcqsTable.id, req.params.id));
  res.status(204).end();
});

export default router;
