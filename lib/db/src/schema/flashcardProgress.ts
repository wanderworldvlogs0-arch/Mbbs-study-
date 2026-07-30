import { pgTable, integer, uuid, timestamp, date, primaryKey } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { flashcardsTable } from "./flashcards";

export const userFlashcardProgressTable = pgTable(
  "user_flashcard_progress",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    flashcardId: uuid("flashcard_id")
      .notNull()
      .references(() => flashcardsTable.id, { onDelete: "cascade" }),
    masteryPercent: integer("mastery_percent").notNull().default(0),
    dueDate: date("due_date").notNull().defaultNow(),
    reviewCount: integer("review_count").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.flashcardId] })],
);

export type UserFlashcardProgress = typeof userFlashcardProgressTable.$inferSelect;
