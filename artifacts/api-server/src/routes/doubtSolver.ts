import { Router, type IRouter } from "express";
import { eq, asc, desc } from "drizzle-orm";
import { db, doubtChatsTable, doubtMessagesTable } from "@workspace/db";
import { requireAuth } from "../middlewares/require-auth";
import { callGemini } from "../lib/gemini";

const router: IRouter = Router();
router.use(requireAuth);

router.get("/doubt-solver/chats", async (req, res) => {
  const userId = req.user!.id;
  const chats = await db
    .select()
    .from(doubtChatsTable)
    .where(eq(doubtChatsTable.userId, userId))
    .orderBy(desc(doubtChatsTable.createdAt));

  res.json(
    chats.map((c) => ({ id: c.id, title: c.title, createdAt: c.createdAt.toISOString() })),
  );
});

router.get("/doubt-solver/chats/:chatId", async (req, res) => {
  const userId = req.user!.id;
  const { chatId } = req.params;

  const [chat] = await db
    .select()
    .from(doubtChatsTable)
    .where(eq(doubtChatsTable.id, chatId))
    .limit(1);

  if (!chat || chat.userId !== userId) {
    res.status(404).json({ message: "Chat not found" });
    return;
  }

  const messages = await db
    .select()
    .from(doubtMessagesTable)
    .where(eq(doubtMessagesTable.chatId, chatId))
    .orderBy(asc(doubtMessagesTable.createdAt));

  res.json({
    id: chat.id,
    title: chat.title,
    messages: messages.map((m) => ({ id: m.id, role: m.role, content: m.content })),
  });
});

router.post("/doubt-solver/send", async (req, res) => {
  const userId = req.user!.id;
  const { chatId, message } = req.body as { chatId?: string | null; message?: string };

  if (!message || !message.trim()) {
    res.status(400).json({ message: "message is required" });
    return;
  }

  let activeChatId = chatId;

  if (!activeChatId) {
    const title = message.trim().slice(0, 60);
    const [chat] = await db
      .insert(doubtChatsTable)
      .values({ userId, title })
      .returning();
    activeChatId = chat!.id;
  } else {
    const [chat] = await db
      .select()
      .from(doubtChatsTable)
      .where(eq(doubtChatsTable.id, activeChatId))
      .limit(1);
    if (!chat || chat.userId !== userId) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }
  }

  await db.insert(doubtMessagesTable).values({
    chatId: activeChatId,
    role: "user",
    content: message,
  });

  const history = await db
    .select()
    .from(doubtMessagesTable)
    .where(eq(doubtMessagesTable.chatId, activeChatId))
    .orderBy(asc(doubtMessagesTable.createdAt));

  let reply: string;
  try {
    reply = await callGemini(
      history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    );
  } catch (err) {
    console.error("GEMINI_CALL_FAILED", err);
    res.status(502).json({ message: "AI service is unavailable right now. Please try again." });
    return;
  }

  await db.insert(doubtMessagesTable).values({
    chatId: activeChatId,
    role: "assistant",
    content: reply,
  });

  res.json({ chatId: activeChatId, reply });
});

export default router;
