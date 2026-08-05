import { Router, type IRouter } from "express";
import { eq, and, sql, lte } from "drizzle-orm";
import {
  db,
  subjectsTable,
  flashcardsTable,
  userFlashcardProgressTable,
} from "@workspace/db";
import { requireAuth } from "../middlewares/require-auth";
import { todayDateString } from "../lib/dashboard";

const router: IRouter = Router();
router.use(requireAuth);

const RATING_MASTERY: Record<string, number> = {
  again: 0,
  hard: 40,
  good: 70,
  easy: 100,
};
const RATING_INTERVAL_DAYS: Record<string, number> = {
  again: 0,
  hard: 1,
  good: 3,
  easy: 7,
};

router.get("/flashcards/subjects", async (req, res) => {
  const userId = req.user!.id;

  const [subjects, cards, progress] = await Promise.all([
    db.select().from(subjectsTable),
    db.select().from(flashcardsTable),
    db
      .select()
      .from(userFlashcardProgressTable)
      .where(eq(userFlashcardProgressTable.userId, userId)),
  ]);

  const progressByCard = new Map(progress.map((p) => [p.flashcardId, p]));
  const today = todayDateString();

  const cardsBySubject = new Map<string, string[]>();
  for (const c of cards) {
    const list = cardsBySubject.get(c.subjectId) ?? [];
    list.push(c.id);
    cardsBySubject.set(c.subjectId, list);
  }

  const result = subjects
    .map((s) => {
      const cardIds = cardsBySubject.get(s.id) ?? [];
      if (cardIds.length === 0) return null;
      const masteries = cardIds.map((id) => progressByCard.get(id)?.masteryPercent ?? 0);
      const dueCount = cardIds.filter((id) => {
        const p = progressByCard.get(id);
        return !p || p.dueDate <= today;
      }).length;
      const masteryPercent = Math.round(
        masteries.reduce((a, b) => a + b, 0) / masteries.length,
      );
      return { id: s.id, name: s.name, totalCards: cardIds.length, dueCount, masteryPercent };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  res.json(result);
});

// Start a review session: due cards for a subject (or all subjects if omitted).
router.get("/flashcards/session", async (req, res) => {
  const userId = req.user!.id;
  const { subjectId, chapterId } = req.query;
  const today = todayDateString();

  const cards =
    typeof subjectId === "string" && typeof chapterId === "string"
      ? await db.select().from(flashcardsTable).where(and(eq(flashcardsTable.subjectId, subjectId), eq(flashcardsTable.chapterId, chapterId)))
      : typeof subjectId === "string"
      ? await db.select().from(flashcardsTable).where(eq(flashcardsTable.subjectId, subjectId))
      : await db.select().from(flashcardsTable);

  const cardIds = cards.map((c) => c.id);
  const progress = cardIds.length
    ? await db
        .select()
        .from(userFlashcardProgressTable)
        .where(eq(userFlashcardProgressTable.userId, userId))
    : [];
  const progressByCard = new Map(progress.map((p) => [p.flashcardId, p]));

  const dueCards = cards.filter((c) => {
    const p = progressByCard.get(c.id);
    return !p || p.dueDate <= today;
  });

  let subjectName = "Mixed Review";
  if (typeof subjectId === "string") {
    const [subject] = await db
      .select()
      .from(subjectsTable)
      .where(eq(subjectsTable.id, subjectId))
      .limit(1);
    subjectName = subject?.name ?? subjectName;
  }

  res.json({
    subjectId: typeof subjectId === "string" ? subjectId : null,
    subjectName,
    cards: dueCards.map((c) => ({
      id: c.id,
      front: c.front,
      back: c.back,
      mnemonic: c.mnemonic,
      reference: c.reference,
    })),
  });
});

// Rate a card: updates mastery + due date.
router.put("/flashcards/:flashcardId/rate", async (req, res) => {
  const userId = req.user!.id;
  const { flashcardId } = req.params;
  const { rating } = req.body as { rating?: string };

  if (!rating || !(rating in RATING_MASTERY)) {
    res.status(400).json({ message: "Invalid rating" });
    return;
  }

  const [card] = await db
    .select()
    .from(flashcardsTable)
    .where(eq(flashcardsTable.id, flashcardId))
    .limit(1);
  if (!card) {
    res.status(404).json({ message: "Flashcard not found" });
    return;
  }

  const masteryPercent = RATING_MASTERY[rating]!;
  const intervalDays = RATING_INTERVAL_DAYS[rating]!;

  await db
    .insert(userFlashcardProgressTable)
    .values({
      userId,
      flashcardId,
      masteryPercent,
      dueDate: sql`current_date + ${intervalDays}::int`,
      reviewCount: 1,
    })
    .onConflictDoUpdate({
      target: [userFlashcardProgressTable.userId, userFlashcardProgressTable.flashcardId],
      set: {
        masteryPercent,
        dueDate: sql`current_date + ${intervalDays}::int`,
        reviewCount: sql`${userFlashcardProgressTable.reviewCount} + 1`,
        updatedAt: new Date(),
      },
    });

  res.json({ ok: true });
});

export default router;
